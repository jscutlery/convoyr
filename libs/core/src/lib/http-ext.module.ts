import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { HttpExt } from './http-ext';
import { HttpExtInterceptor } from './http-ext.interceptor';
import { HttpExtPlugin } from './plugin';

@NgModule({})
export class HttpExtModule {
  static forRoot({
    plugins
  }: {
    plugins: HttpExtPlugin[];
  }): ModuleWithProviders {
    const httpExt = new HttpExt({ plugins });
    const httpExtInterceptor = new HttpExtInterceptor({ httpExt });

    return {
      ngModule: HttpExtModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          multi: true,
          useValue: httpExtInterceptor
        }
      ]
    };
  }
}
