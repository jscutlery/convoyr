import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WithCacheMetadata } from '@http-ext/plugin-cache';
import { map, switchMap } from 'rxjs/operators';

@Component({
  template: `
    <a routerLink="/">Back to the list</a>
    <div
      *ngIf="book$ | async as book"
      [class.is-from-cache]="isFromCache$ | async"
    >
      {{ book.volumeInfo.title }}
    </div>
  `
})
export class BookDetailComponent {
  request$ = this._activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('bookId')),
    switchMap(bookId =>
      this._httpClient.get<WithCacheMetadata<any>>(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
          bookId
        )}`
      )
    )
  );
  book$ = this.request$.pipe(map(body => body.data.data));
  isFromCache$ = this.request$.pipe(
    map(body => body.cacheMetadata.isFromCache)
  );

  constructor(
    private _httpClient: HttpClient,
    private _activatedRoute: ActivatedRoute
  ) {}
}
