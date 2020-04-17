import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { NormalizedSchema } from 'normalizr';

import { environment } from '../../environments/environment';
import { Bike } from '../bike/bike';
import { BikeCardModule } from '../bike/bike-card.component';

@Component({
  selector: 'app-bike-search',
  template: `
    <div fxLayout="row" fxLayoutAlign="center">
      <mat-form-field appearance="outline">
        <input
          [formControl]="searchControl"
          matInput
          type="search"
          placeholder="Search"
        />
      </mat-form-field>
    </div>
    <div fxLayout="row wrap" fxLayoutAlign="space-around">
      <app-bike-card
        class="bike"
        *ngFor="let bike of response?.entities?.bikes | keyvalue"
        [bike]="bike.value"
        [routerLink]="['/bikes', bike.key]"
      ></app-bike-card>
    </div>
  `,
  styles: [
    `
      .bike {
        cursor: pointer;
        min-width: 200px;
        max-width: 300px;
        margin: 10px;
      }

      mat-form-field {
        margin-top: 8px;
      }
    `,
  ],
})
export class BikeSearchComponent implements OnInit, OnDestroy {
  response: NormalizedSchema<Bike, string>;

  searchControl = new FormControl();

  private _subscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this._subscription = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        switchMap((query) =>
          this.http.get<NormalizedSchema<Bike, string>>(
            environment.apiBaseUrl + '/bikes',
            {
              params: {
                q: query,
              },
            }
          )
        )
      )
      .subscribe((response) => (this.response = response));
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}

@NgModule({
  declarations: [BikeSearchComponent],
  exports: [BikeSearchComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    BikeCardModule,
  ],
})
export class BikeSearchModule {}
