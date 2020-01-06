import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Bike } from '../bike/bike';

@Component({
  selector: 'http-ext-bike-search',
  templateUrl: './bike-search.component.html',
  styleUrls: ['./bike-search.component.css']
})
export class BikeSearchComponent implements OnInit {
  bikes: Bike[] = [];
  searchControl = new FormControl();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(query =>
          this.http.get<Bike[]>(environment.apiBaseUrl + '/bikes', {
            params: {
              q: query
            }
          })
        )
      )
      .subscribe(bikes => (this.bikes = bikes));
  }
}
