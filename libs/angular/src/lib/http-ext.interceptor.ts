import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpExt, HttpExtPlugin } from '@http-ext/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  fromNgRequest,
  fromNgResponse,
  toNgRequest,
  toNgResponse
} from './http-converter';

export interface HttpExtConfig {
  plugins: HttpExtPlugin[];
}

/**
 * @internal
 */
export const _HTTP_EXT_CONFIG = new InjectionToken<{
  plugins: HttpExtPlugin[];
}>('HttpExt Config');

@Injectable()
export class HttpExtInterceptor implements HttpInterceptor {
  private _httpExt = new HttpExt(this._httpExtConfig);

  constructor(
    @Inject(_HTTP_EXT_CONFIG)
    private _httpExtConfig: HttpExtConfig
  ) {}

  intercept(
    ngRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._httpExt
      .handle({
        request: fromNgRequest(ngRequest),
        handler: ({ request }) =>
          next.handle(toNgRequest(request)).pipe(
            filter(httpEvent => httpEvent instanceof HttpResponse),
            map(fromNgResponse)
          )
      })
      .pipe(map(toNgResponse));
  }
}
