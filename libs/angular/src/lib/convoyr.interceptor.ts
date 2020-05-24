import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Convoyr, ConvoyrConfig, ConvoyrResponse } from '@convoyr/core';
import { Observable, throwError } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';

import {
  fromNgRequest,
  fromNgResponse,
  toNgRequest,
  toNgResponse,
  fromNgErrorResponse,
  toNgErrorResponse,
  ErrorBody,
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
              filter(
                (httpEvent) =>
                  httpEvent instanceof HttpResponse ||
                  httpEvent instanceof HttpErrorResponse
              ),
              map(fromNgResponse),
              catchError((error: HttpErrorResponse) =>
                throwError(fromNgErrorResponse(error))
              )
            ),
        },
      })
      .pipe(
        map(toNgResponse),
        catchError((error: ConvoyrResponse<ErrorBody>) =>
          throwError(toNgErrorResponse(error))
        )
      );
  }
}
