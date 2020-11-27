import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { CountryListComponent } from './components/country-list.component';
import { ApiKeyComponent } from './components/api-key.component';
import { NewsArticlesComponent } from './components/news-articles.component';
import { NewsDatabase } from './news.database';
import { MainComponent } from './components/main.component';

const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'api', component: ApiKeyComponent },
  { path: 'countries', component: CountryListComponent },
  { path: 'news/:country', component: NewsArticlesComponent },
  { path: '', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    CountryListComponent,
    ApiKeyComponent,
    NewsArticlesComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  providers: [ NewsDatabase ],
  bootstrap: [AppComponent]
})
export class AppModule { }
