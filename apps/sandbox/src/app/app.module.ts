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
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpExtModule } from '@http-ext/angular';
import { createAuthPlugin } from '@http-ext/plugin-auth';
import { createCachePlugin, MemoryStorage } from '@http-ext/plugin-cache';
import { createRetryPlugin } from '@http-ext/plugin-retry';
import { of } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BikeDetailComponent } from './bike-detail/bike-detail.component';
import { BikeSearchComponent } from './bike-search/bike-search.component';
import { BikeComponent } from './bike/bike.component';
import { ErrorComponent } from './error/error.component';
import { createLoggerPlugin } from './http/create-logger-plugin';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BikeDetailComponent,
    BikeSearchComponent,
    BikeComponent,
    ErrorComponent
  ],
  imports: [
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
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    HttpExtModule.forRoot({
      plugins: [
        createLoggerPlugin(),
        createRetryPlugin(),
        createCachePlugin(),
        createAuthPlugin({
          token: of('token')
        })
      ]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
