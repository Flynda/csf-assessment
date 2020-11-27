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
    //   sourceName: 'sourcename',
    //   author: 'author',
    //   title: 'title',
    //   description: 'description',
    //   url: 'url',
    //   image: 'urlToImage',
    //   publishAt: 'publishedAt',
    //   content: 'content'
    // },{
    //   sourceName: 'sourcename2',
    //   author: 'author2',
    //   title: 'title2',
    //   description: 'description2',
    //   url: 'url2',
    //   image: 'urlToImage2',
    //   publishAt: 'publishedAt2',
    //   content: 'content2'
    // } 
  ]
  country: string

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    // this.getNewsArticles()
  }

  getNewsArticles() {
    const url:string = 'https://newsapi.org/v2/top-headlines'
    this.country = this.activatedRoute.snapshot.params['country']
    let params = (new HttpParams())
      .set('country', this.country)
      .set('pageSize', '30')
      .set('category', 'general')
    const headers = (new HttpHeaders())
      .set('X-Api-Key', 'key_here')
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
            image: r['urlToImage'],
            publishAt: r['publishedAt'],
            content: r['content']
          }
        })
        console.info('newsArticles', this.newsArticles)
      })
  }

  saveArticle() {}

}
