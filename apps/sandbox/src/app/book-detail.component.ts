import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  template: `
    <div *ngIf="book$ | async as book">{{ book.volumeInfo.title }}</div>
  `
})
export class BookDetailComponent {
  book$ = this._activatedRoute.paramMap.pipe(
    map(paramMap => paramMap.get('bookId')),
    switchMap(bookId =>
      this._httpClient.get(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
          bookId
        )}`
      )
    )
  );

  constructor(
    private _httpClient: HttpClient,
    private _activatedRoute: ActivatedRoute
  ) {}
}
