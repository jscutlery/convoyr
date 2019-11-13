import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { HttpExt } from '@http-ext/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  fromNgRequest,
  fromNgResponse,
  toNgRequest,
  toNgResponse
} from './http-converter';

export class HttpExtInterceptor implements HttpInterceptor {
  private _httpExt: HttpExt;

  constructor({ httpExt }: { httpExt: HttpExt }) {
    this._httpExt = httpExt;
  }

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
