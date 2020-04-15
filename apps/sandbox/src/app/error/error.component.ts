import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { environment } from '../../environments/environment';

@Component({
  selector: 'http-ext-error',
  template: `
    <div fxLayout="column" fxLayoutAlign="center center">
      Error:
      <pre><code>{{ error | json }}</code></pre>
      <div>
        <button mat-button type="button" (click)="getServerError()">
          Throw 500 Server Error
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      div[fxLayout] {
        height: 100%;
      }

      button {
        margin-right: 8px;
      }

      pre {
        min-height: 100px;
      }
    `,
  ],
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
        error: (response) => (this.error = response.error),
      });
  }

  private clear(): void {
    this.error = {};
    this.subscription?.unsubscribe();
  }
}

@NgModule({
  declarations: [ErrorComponent],
  exports: [ErrorComponent],
  imports: [CommonModule, MatButtonModule, FlexLayoutModule],
})
export class ErrorModule {}
