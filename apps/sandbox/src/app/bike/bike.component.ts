import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Bike } from './bike';

@Component({
  selector: 'http-ext-bike',
  templateUrl: './bike.component.html',
  styleUrls: ['./bike.component.css']
})
export class BikeComponent implements OnChanges {
  @Input() bike: Bike;

  bikePictureUrl: string;

  ngOnChanges() {
    const color = encodeURIComponent(this.bike.color);
    this.bikePictureUrl = `https://source.unsplash.com/featured?${color}+bike`;
  }
}
