import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiKey } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.css']
})
export class ApiKeyComponent implements OnInit {

  apiForm: FormGroup
  tempKey

  constructor(private fb: FormBuilder, private router: Router, private newsDB: NewsDatabase) { }

  ngOnInit(): void {

    this.apiForm = this.fb.group({
      apiKey: this.fb.control('', [Validators.required])
    })
  }

  back() {
    this.router.navigate(['/countries'])
  }

  async saveKey() {
    const keyData: ApiKey = {
      apiKey: this.apiForm.get('apiKey').value,
      id: 1
    }
    console.info('save: ',keyData)
    await this.newsDB.saveApiKey(keyData)
    this.back()
  }

  async deleteKey() {
    await this.newsDB.deleteApiKey()
    this.apiForm.reset()
  }

  async getR(){
    this.tempKey = await this.newsDB.getApiKey(1)
    console.info('get: ', this.tempKey)
  }

}
