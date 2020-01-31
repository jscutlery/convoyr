import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  _HTTP_EXT_CONFIG,
  HttpExtConfig,
  HttpExtInterceptor
} from './http-ext.interceptor';

export type HttpExtModuleArgs =
  | HttpExtConfig
  | {
      deps?: unknown[];
      config: () => HttpExtConfig;
    };

@NgModule({})
export class HttpExtModule {
  static forRoot(args: HttpExtModuleArgs): ModuleWithProviders<HttpExtModule> {
    return {
      ngModule: HttpExtModule,
      providers: [
        {
          provide: _HTTP_EXT_CONFIG,
          ...('config' in args
            ? {
                useFactory: args.config
              }
            : {
                useValue: args
              })
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
