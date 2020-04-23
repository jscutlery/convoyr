import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  _HTTP_EXT_CONFIG,
  ConvoyConfig,
  ConvoyInterceptor,
} from './convoy.interceptor';

export type ConvoyModuleArgs =
  | ConvoyConfig
  | {
      deps?: unknown[];
      config: (...args: unknown[]) => ConvoyConfig;
    };

@NgModule({})
export class ConvoyModule {
  static forRoot(args: ConvoyModuleArgs): ModuleWithProviders<ConvoyModule> {
    return {
      ngModule: ConvoyModule,
      providers: [
        {
          provide: _HTTP_EXT_CONFIG,
          ...('config' in args
            ? {
                deps: args.deps,
                useFactory: args.config,
              }
            : {
                useValue: args,
              }),
        },
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useClass: ConvoyInterceptor,
        },
      ],
    };
  }
}
