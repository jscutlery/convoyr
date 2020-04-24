import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Convoyr, ConvoyrConfig } from '@convoyr/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  fromNgRequest,
  fromNgResponse,
  toNgRequest,
  toNgResponse,
} from './http-converter';

/**
 * @internal
 */
export const _CONVOYR_CONFIG = new InjectionToken<ConvoyrConfig>(
  'Convoyr Config'
);

@Injectable()
export class ConvoyrInterceptor implements HttpInterceptor {
  private _convoyr = new Convoyr(this._convoyConfig);

  constructor(
    @Inject(_CONVOYR_CONFIG)
    private _convoyConfig: ConvoyrConfig
  ) {}

  intercept(
    ngRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._convoyr
      .handle({
        request: fromNgRequest(ngRequest),
        httpHandler: {
          handle: ({ request }) =>
            next.handle(toNgRequest(request)).pipe(
              filter((httpEvent) => httpEvent instanceof HttpResponse),
              map(fromNgResponse)
            ),
        },
      })
      .pipe(map(toNgResponse));
  }
}
