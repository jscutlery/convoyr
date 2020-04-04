import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'http-ext-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  error: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.clear();
  }

  getServerError(): void {
    this.clear();
    this.subscription = this.http
      .get<any>(environment.apiBaseUrl + '/server-error')
      .subscribe({
        error: response => (this.error = response.error)
      });
  }

  getUnauthorizedError(): void {
    this.clear();
    this.subscription = this.http
      .get<any>(environment.apiBaseUrl + '/unauthorized-error')
      .subscribe({ error: response => (this.error = response.error) });
  }

  private clear(): void {
    this.error = {};
    this.subscription?.unsubscribe();
  }
}
