import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryDB, CountryList } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  countryCode: string = 'ae;ar;at;au;be;bg;br;ca;ch;cn;co;cu;cz;de;eg;fr;gb;gr;hk;hu;id;ie;il;in;it;jp;kr;lt;lv;ma;mx;my;ng;nl;no;nz;ph;pl;pt;ro;rs;ru;sa;se;sg;si;sk;th;tr;tw;ua;us;ve;za'
  countryList: CountryList[] = []

  constructor(private router: Router, private http: HttpClient, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.newsDB.getList(1)
      .then(results => {
        this.countryList = results.list
      })
    if (!this.countryList.length) {
      // this.getCountries()
    }
  }

  getCountries() {
    const url = 'https://restcountries.eu/rest/v2/alpha'
    let params = (new HttpParams()).set('codes', this.countryCode)
    this.http.get<any>(url, {params: params})
      .toPromise()
      .then(results => {
        this.countryList = results.map(r => {
          return {
            name: r.name,
            flag: r.flag,
            code: r.alpha2Code.toLowerCase()
          }
        })
      })
    this.newsDB.saveList({id: 1, list: this.countryList})
  }
}
