import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpExt, HttpExtPlugin } from '@http-ext/core';

import { HttpExtInterceptor } from './http-ext.interceptor';

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
