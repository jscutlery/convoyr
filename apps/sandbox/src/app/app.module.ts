import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpExtModule } from '@http-ext/angular';
import { createAuthPlugin } from '@http-ext/plugin-auth';
import { createCachePlugin } from '@http-ext/plugin-cache';
import { createRetryPlugin } from '@http-ext/plugin-retry';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { BikeDetailModule } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { BikeCardModule } from './bike/bike-card.component';
import { ErrorComponent } from './error/error.component';
import { createLoggerPlugin } from './http/create-logger-plugin';
import { NavComponent } from './nav/nav.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BikeSearchComponent,
    ErrorComponent,
    SignInComponent,
    UsersComponent
  ],
  imports: [
    BikeCardModule,
    BikeDetailModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
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
              onUnauthorized: async () => {
                auth.signOut();
                if (await router.navigate(['/'])) {
                  snackBar.open('Nop! You\'ve been redirect to home.', 'ok', {
                    duration: 3000
                  });
                }
              }
            })
          ]
        };
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
