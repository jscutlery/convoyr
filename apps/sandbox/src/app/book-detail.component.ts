import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { CacheResponse } from './http/cache-plugin/cache-plugin';

@Component({
  template: `
    <a routerLink="/">Back to the list</a>
    <ng-container
      *ngIf="{ book: book$ | async, isFromCache: isFromCache$ | async } as data"
    >
      <div [class.is-from-cache]="data.isFromCache">
        {{ data.book.volumeInfo.title }}
      </div>
    </ng-container>
  `
})
export class BookDetailComponent {
  request$ = this._activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('bookId')),
    switchMap(bookId =>
      this._httpClient.get<CacheResponse<any>>(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
          bookId
        )}`
      )
    )
  );
  book$ = this.request$.pipe(map(response => response.data));
  isFromCache$ = this.request$.pipe(map(response => response.isFromCache));

  constructor(
    private _httpClient: HttpClient,
    private _activatedRoute: ActivatedRoute
  ) {}
}
