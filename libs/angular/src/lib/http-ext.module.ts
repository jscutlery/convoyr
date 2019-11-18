import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpExtPlugin } from '@http-ext/core';

import { _HTTP_EXT_CONFIG, HttpExtInterceptor } from './http-ext.interceptor';

@NgModule({})
export class HttpExtModule {
  static forRoot({
    plugins
  }: {
    plugins: HttpExtPlugin[];
  }): ModuleWithProviders<HttpExtModule> {
    return {
      ngModule: HttpExtModule,
      providers: [
        {
          provide: _HTTP_EXT_CONFIG,
          useValue: { plugins }
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: HttpExtInterceptor
        }
      ]
    };
  }
}
