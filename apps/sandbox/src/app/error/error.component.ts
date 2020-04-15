import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnDestroy } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'http-ext-error',
  template: `
    <div class="container" fxLayout="column" fxLayoutAlign="center center">
      <div class="tip">
        Open developer tools network panel to see HTTP retries.
      </div>
      <div>
        <div fxLayout="column" fxLayoutAlign="center center">
          {{ loading ? 'Fetching...' : 'Error:' }}
          <div class="loader" *ngIf="loading; else error_message">
            <mat-spinner [diameter]="50"></mat-spinner>
          </div>
          <ng-template #error_message>
            <pre class="error-message"><code>{{ error | json }}</code></pre>
          </ng-template>
        </div>
      </div>
      <button mat-raised-button type="button" (click)="getServerError()">
        Throw 500 Server Error
      </button>
    </div>
  `,
  styles: [
    `
      .container {
        height: 100%;
      }

      button {
        margin-right: 8px;
      }

      .error-message,
      .loader {
        height: 100px;
        padding: 10px;
        margin: 10px;
      }

      .tip {
        margin-bottom: 40px;
        font-size: 13px;
        font-style: italic;
      }
    `,
  ],
})
export class ErrorComponent implements OnDestroy {
  subscription: Subscription;

  loading = false;

  error: any = {};

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.error = {};
    this.loading = false;
  }

  getServerError(): void {
    this.error = {};
    this.loading = true;
    this.subscription?.unsubscribe();
    this.subscription = this.http
      .get<any>(environment.apiBaseUrl + '/server-error')
      .subscribe({
        error: (response) => {
          this.error = response.error;
          this.loading = false;
        },
      });
  }
}

@NgModule({
  declarations: [ErrorComponent],
  exports: [ErrorComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
  ],
})
export class ErrorModule {}
