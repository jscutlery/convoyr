import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BikeDetailModule } from './bike-detail/bike-detail.component';
import { BikeSearchModule } from './bike-search/bike-search.component';
import { BikeCardModule } from './bike/bike-card.component';
import { NavModule } from './nav/nav.component';
import { RetryModule } from './retry/retry.component';
import { SigninModule } from './signin/signin.component';
import { HttpModule } from './http/http.module';

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
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
