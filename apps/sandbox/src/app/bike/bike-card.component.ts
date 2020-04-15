import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { Bike } from './bike';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'http-ext-bike-card',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ bike.name }}</mat-card-title>
        <mat-card-subtitle>{{ bike.type }} </mat-card-subtitle>
      </mat-card-header>
      <img mat-card-image [src]="bikePictureUrl" alt="Photo of a bike" />
      <mat-card-content></mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      img[mat-card-image] {
        max-height: 200px;
        min-height: 200px;
        min-width: 300px;
        object-fit: cover;
      }
    `,
  ],
})
export class BikeCardComponent implements OnChanges {
  @Input() bike: Bike;

  bikePictureUrl: string;

  ngOnChanges() {
    const color = encodeURIComponent(this.bike.color);
    this.bikePictureUrl = `https://source.unsplash.com/featured?${color}+bike`;
  }
}

@NgModule({
  declarations: [BikeCardComponent],
  exports: [BikeCardComponent],
  imports: [CommonModule, MatCardModule],
})
export class BikeCardModule {}
