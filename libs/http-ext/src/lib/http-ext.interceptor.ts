import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { fromNgReq, fromNgResponse, toNgReq, toNgResponse } from './http-converter';
import { HttpExt } from './http-ext';

export class HttpExtInterceptor implements HttpInterceptor {
  private _httpExt: HttpExt;

  constructor({ httpExt }: { httpExt: HttpExt }) {
    this._httpExt = httpExt;
  }

  intercept(
    ngReq: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /**
     * @todo filter `HttpEvent`s which are not `HttpResponse`.
     * @todo convert `HttpResponse` to http ext response after next.handle with a pipe map.
     * @todo convert http ext response to `HttpResponse` after HttpExt.handle with a pipe map.
     */
    return this._httpExt.handle({
      request: fromNgReq(ngReq),
      handler: ({ request }) =>
        next.handle(toNgReq(request)).pipe(
          filter(httpEvent => httpEvent instanceof HttpResponse),
          map(fromNgResponse)
        )
    }).pipe(map(toNgResponse))
  }
}
