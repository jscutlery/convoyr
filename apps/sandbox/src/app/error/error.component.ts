import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'http-ext-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getError() {
    this.http.get<any>(environment.apiBaseUrl + '/error').subscribe();
  }
}
