import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConvoyrConfig } from '@convoyr/core';

import { ConvoyrInterceptor } from './convoyr.interceptor';
import { ConvoyrService, _CONVOYR_CONFIG } from './convoyr.service';

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
        ConvoyrService,
        {
          provide: _CONVOYR_CONFIG,
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
