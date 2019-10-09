import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpExtModule } from '@httpext/httpext';

import { AppComponent } from './app.component';
import { loggerPlugin } from './http/logger-plugin';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({ plugins: [loggerPlugin()] })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
