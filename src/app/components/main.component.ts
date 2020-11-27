import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.newsDB.getApiKey(1)
    .then(results => {
      if (results) {
        this.router.navigate(['/countries'])
      }
    })
  }

}
