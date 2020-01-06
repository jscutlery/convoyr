import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

import { Bike } from '../bike/bike';
import { environment } from './../../environments/environment';

@Component({
  selector: 'http-ext-bike-detail',
  templateUrl: './bike-detail.component.html',
  styleUrls: ['./bike-detail.component.css']
})
export class BikeDetailComponent {
  bike$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('bikeId')),
    switchMap(bikeId =>
      this.httpClient.get<Bike>(
        `${environment.apiBaseUrl}/bikes/${encodeURIComponent(bikeId)}`
      )
    )
  );

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}
}
