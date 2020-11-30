import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsArticles } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-news-articles',
  templateUrl: './news-articles.component.html',
  styleUrls: ['./news-articles.component.css']
})
export class NewsArticlesComponent implements OnInit {

  newsArticles: NewsArticles[] = [
    // {
    //   sourceName: "CNN",
    //   author: "Paul LeBlanc",
    //   title: "Trump says for first time he'll leave office if Electoral College votes for Biden - CNN",
    //   description: "President Donald Trump said for the first time Thursday he will leave office if the Electoral College votes for President-elect Joe Biden but made clear he's not prepared to concede.",
    //   url: "https://www.cnn.com/2020/11/26/politics/trump-leave-office-electoral-college/index.html",
    //   image: "https://cdn.cnn.com/cnnnext/dam/assets/201126185050-trump-thanksgiving-super-tease.jpg",
    //   publishAt: "2020-11-27T02:13:00Z",
    //   content: "Washington (CNN)President Donald Trump said for the first time Thursday he will leave office if the Electoral College votes for President-elect Joe Biden but made clear he's not prepared to concede. … [+1651 chars]"
    // },{
    //   sourceName: "CBS Sports",
    //   author: "",
    //   title: "Ravens quarterback Lamar Jackson tests positive for COVID-19, per report - CBS Sports",
    //   description: "Baltimore's COVID troubles continue",
    //   url: "https://www.cbssports.com/nfl/news/ravens-quarterback-lamar-jackson-tests-positive-for-covid-19-per-report/",
    //   image: https://sportshub.cbsistatic.com/i/r/2020/11/19/9d2564a7-b5b8-4f4e-ac1e-d2f23787771e/thumbnail/1200x675/41d154e600aa9239ac381663cb023d1b/new-team.jpg",
    //   publishAt: "2020-11-27T01:59:00Z",
    //   content: "The COVID-19 pandemic has wreaked havoc on the Baltimore Ravens this past week, and it now has reportedly affected their best player. On Thursday night, Ian Rapoport of the NFL Network reported that … [+1947 chars]"
    // } 
  ]
  country: string
  countryFullName: string
  tempKey: string
  timestampCheck: boolean = false
  tempArray: NewsArticles[] = []

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.country = this.activatedRoute.snapshot.params['country']
    this.newsDB.getList(1)
    .then(result => {
      const idx = result.list.findIndex( c => c.code == this.country)
      this.countryFullName = result.list[idx].name
    })
    
    this.newsDB.retrieveArticles(this.country)
    .then(result => {
      result.map(r => {
        const currentTime = new Date().getTime()
        if (!r.save) {
          if ((currentTime - r.timestamp) > 30000) {
            this.newsDB.deleteArticle(r.id)
            this.timestampCheck = true
          } else
            this.newsArticles.push(r)
        } else
        this.newsArticles.push(r)
      })
      if (this.timestampCheck) {
        this.tempArray = this.newsArticles
        this.tempArray.reverse()
        this.getNewsArticles()
        this.tempArray.map(r => {
          this.newsArticles.unshift(r)
        })
        this.timestampCheck = false
      }
    })
  }

  getNewsArticles() {
    const url:string = 'https://newsapi.org/v2/top-headlines'
    let params = (new HttpParams())
      .set('country', this.country)
      .set('pageSize', '30')
      .set('category', 'general')
    this.newsDB.getApiKey(1)
    .then(result => {
      const headers = (new HttpHeaders())
        .set('X-Api-Key', result.apiKey)
      this.http.get<any>(url, {headers: headers, params: params})
        .toPromise()
        .then(resp => {
          const results = resp['articles'] as any[]
          this.newsArticles = results.map(r => {
            return {
              sourceName: r['source']['name'],
              author: r['author'],
              title: r['title'],
              description: r['description'],
              url: r['url'],
              image: r['urlToImage'] || '/assets/no_image.png',
              publishAt: r['publishedAt'],
              content: r['content'],
              timestamp: new Date().getTime(),
              save: false,
              country: this.country
            }
          })
          this.newsArticles.map(r => {
            this.newsDB.cacheArticles(r)
          })
          console.info('newsArticles', this.newsArticles)
        })
    })
  }

  saveArticle(idx: number) {
    this.newsArticles[idx].save = true
    this.newsDB.cacheArticles(this.newsArticles[idx])
  }

  async deleteArticle(id, idx) {
    this.newsArticles[idx].save = false
    await this.newsDB.deleteArticle(id)
  }
}
