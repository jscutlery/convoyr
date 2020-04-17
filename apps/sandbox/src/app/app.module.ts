import { schema } from 'normalizr';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpExtModule } from '@http-ext/angular';
import { createAuthPlugin } from '@http-ext/plugin-auth';
import { createCachePlugin } from '@http-ext/plugin-cache';
import { createRetryPlugin } from '@http-ext/plugin-retry';
import { createNormalizerPlugin } from '@http-ext/plugin-normalizer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { BikeDetailModule } from './bike-detail/bike-detail.component';
import { BikeSearchModule } from './bike-search/bike-search.component';
import { BikeCardModule } from './bike/bike-card.component';
import { createLoggerPlugin } from './http/create-logger-plugin';
import { NavModule } from './nav/nav.component';
import { RetryModule } from './retry/retry.component';
import { SigninModule } from './signin/signin.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NavModule,
    BikeCardModule,
    BikeDetailModule,
    SigninModule,
    RetryModule,
    BikeSearchModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpExtModule.forRoot({
      deps: [AuthService, Router, MatSnackBar],
      config(auth: AuthService, router: Router, snackBar: MatSnackBar) {
        return {
          plugins: [
            createLoggerPlugin(),
            createCachePlugin(),
            createRetryPlugin(),
            createAuthPlugin({
              token: auth.token$,
              onUnauthorized: () => {
                auth.setToken(undefined);
                router.navigate(['signin']);
                snackBar.open(
                  "Unauthorized response handled. You've been redirect to the signin form.",
                  'ok',
                  {
                    duration: 12000,
                  }
                );
              },
            }),
            createNormalizerPlugin({
              schemas: {
                [environment.apiBaseUrl + '/bikes']: {
                  bikes: [new schema.Entity('bikes')],
                },
              },
            }),
          ],
        };
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
