import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpExtModule } from '@http-ext/angular';
import { cachePlugin } from '@http-ext/plugin-cache';

import { AppComponent } from './app.component';
import { BookDetailComponent } from './book-detail.component';
import { BookListComponent } from './book-list.component';
import { loggerPlugin } from './http/logger-plugin';

export const routes: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: 'book/:bookId',
    component: BookDetailComponent
  }
];

@NgModule({
  declarations: [AppComponent, BookDetailComponent, BookListComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [loggerPlugin(), cachePlugin({ addCacheMetadata: true })]
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
