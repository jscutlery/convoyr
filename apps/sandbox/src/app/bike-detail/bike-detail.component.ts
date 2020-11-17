import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WithCacheMetadata } from '@convoyr/plugin-cache';
import { map, switchMap } from 'rxjs/operators';

import { Bike } from '../bike/bike';
import { BikeCardModule } from '../bike/bike-card.component';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-bike-detail',
  template: `
    <a [routerLink]="['/bikes']" mat-button>BACK</a>
    <article *ngIf="bike$ | async as bike" class="container">
      <app-bike-card [bike]="bike"></app-bike-card>
      <ul class="details">
        <li>
          Price <strong>{{ bike.price }}&euro;</strong>
        </li>
        <li>
          Color <strong>{{ bike.color }}</strong>
        </li>
        <li>
          Type <strong>{{ bike.type }}</strong>
        </li>
      </ul>
    </article>
  `,
  styles: [
    `
      a {
        margin: 8px;
      }

      .container {
        max-width: 480px;
        margin: 0 auto;
      }

      ul {
        padding: 16px;
      }

      li {
        display: flex;
        justify-content: space-between;
        padding-bottom: 6px;
        margin-top: 6px;
        border-bottom: 1px gray dotted;
      }
    `,
  ],
})
export class BikeDetailComponent {
  bike$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('bikeId')),
    switchMap((bikeId) =>
      this.httpClient.get<WithCacheMetadata<Bike>>(
        `${environment.apiBaseUrl}/bikes/${encodeURIComponent(bikeId)}`
      )
    ),
    map(({ data }) => data)
  );

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}
}

@NgModule({
  declarations: [BikeDetailComponent],
  exports: [BikeDetailComponent],
  imports: [CommonModule, RouterModule, BikeCardModule, MatButtonModule],
})
export class BikeDetailModule {}
