import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Bike } from '../bike/bike';
import { Subscription } from 'rxjs';

@Component({
  selector: 'http-ext-bike-search',
  templateUrl: './bike-search.component.html',
  styleUrls: ['./bike-search.component.css']
})
export class BikeSearchComponent implements OnInit, OnDestroy {
  bikes: Bike[] = [];
  searchControl = new FormControl();

  private _subscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this._subscription = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(query =>
          this.http.get<{ bikes: Bike[] }>(environment.apiBaseUrl + '/bikes', {
            params: {
              q: query
            }
          })
        )
      )
      .subscribe(({ bikes }) => (this.bikes = bikes));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
