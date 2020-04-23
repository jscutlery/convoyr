import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Convoyr, ConvoyrPlugin } from '@convoyr/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  fromNgRequest,
  fromNgResponse,
  toNgRequest,
  toNgResponse,
} from './http-converter';

export interface ConvoyConfig {
  plugins: ConvoyrPlugin[];
}

/**
 * @internal
 */
export const _HTTP_EXT_CONFIG = new InjectionToken<{
  plugins: ConvoyrPlugin[];
}>('Convoyr Config');

@Injectable()
export class ConvoyInterceptor implements HttpInterceptor {
  private _convoyr = new Convoyr(this._convoyConfig);

  constructor(
    @Inject(_HTTP_EXT_CONFIG)
    private _convoyConfig: ConvoyConfig
  ) {}

  intercept(
    ngRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._convoyr
      .handle({
        request: fromNgRequest(ngRequest),
        httpHandler: ({ request }) =>
          next.handle(toNgRequest(request)).pipe(
            filter((httpEvent) => httpEvent instanceof HttpResponse),
            map(fromNgResponse)
          ),
      })
      .pipe(map(toNgResponse));
  }
}
