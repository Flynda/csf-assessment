import { Injectable } from "@angular/core";
import Dexie from 'dexie';
import { ApiKey, CountryDB, NewsArticles } from './models';

@Injectable()
export class NewsDatabase extends Dexie {
    private apikey: Dexie.Table<ApiKey, number>
    private CountryDB: Dexie.Table<CountryDB, number>
    private newsArticles: Dexie.Table<NewsArticles, string>
    constructor() {
        super('newsDatabase')
        this.version(1).stores({
            apikey: 'id, apiKey',
            CountryDB: 'id',
            newsArticles: '++id, country'
        })
        this.apikey = this.table('apikey')
        this.CountryDB = this.table('CountryDB')
        this.newsArticles = this.table('newsArticles')
    }
    
    saveApiKey(key: ApiKey): Promise<any> {
        return this.apikey.put(key)
    }

    getApiKey(id: number): Promise<ApiKey> {
        return this.apikey.get(id)
    }

    deleteApiKey(): Promise<any>{
        return this.apikey
            .where('id').equals(1)
            .delete()
    }

    saveList(save: CountryDB): Promise<any>{
        return this.CountryDB.put(save)
    }

    getList(id: number): Promise<CountryDB> {
        return this.CountryDB.get(id)
    }

    cacheArticles(article: NewsArticles): Promise<any> {
        return this.newsArticles.put(article)
    }

    retrieveArticles(countryCode: string): Promise<NewsArticles[]>{
        return this.newsArticles
            .where('country').equals(countryCode).toArray()
    }

    deleteArticle(id: number): Promise<any>{
        return this.newsArticles.where('id').equals(id).delete()
    }

}