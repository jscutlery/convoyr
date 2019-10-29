import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  template: `
    <ul>
      <li *ngFor="let book of bookList$ | async">
        <a [routerLink]="['/book', book.id]">{{ book.volumeInfo.title }}</a>
      </li>
    </ul>
  `
})
export class BookListComponent {
  bookList$: Observable<any[]> = this._httpClient
    .get<any>(
      'https://www.googleapis.com/books/v1/volumes?q=extreme%20programming'
    )
    .pipe(map(response => response.items));

  constructor(private _httpClient: HttpClient) {}
}
