import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  ModuleWithProviders,
  NgModule,
  Provider,
  ValueSansProvider,
  FactorySansProvider
} from '@angular/core';
import { HttpExtPlugin, HttpExt } from '@http-ext/core';

import { _HTTP_EXT_CONFIG, HttpExtInterceptor } from './http-ext.interceptor';
import { DOCUMENT } from '@angular/common';

@NgModule({})
export class HttpExtModule {
  static forRoot({
    config,
    createConfig,
    services
  }: any): ModuleWithProviders<HttpExtModule> {
    return {
      ngModule: HttpExtModule,
      providers: [
        {
          deps: services,
          provide: _HTTP_EXT_CONFIG,
          useFactory: createConfig,
          ...(createConfig
            ? { useFactory: createConfig }
            : new HttpExt({ plugins: [] })),
          ...(config ? { useValue: config } : {})
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
