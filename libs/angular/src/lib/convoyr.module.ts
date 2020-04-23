import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import {
  _HTTP_EXT_CONFIG,
  ConvoyrConfig,
  ConvoyrInterceptor,
} from './convoyr.interceptor';

export type ConvoyrModuleArgs =
  | ConvoyrConfig
  | {
      deps?: unknown[];
      config: (...args: unknown[]) => ConvoyrConfig;
    };

@NgModule({})
export class ConvoyrModule {
  static forRoot(args: ConvoyrModuleArgs): ModuleWithProviders<ConvoyrModule> {
    return {
      ngModule: ConvoyrModule,
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
          useClass: ConvoyrInterceptor,
        },
      ],
    };
  }
}
