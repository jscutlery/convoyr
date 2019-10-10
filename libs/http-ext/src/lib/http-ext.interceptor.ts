import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { fromNgReq, toNgReq } from './http-converter';
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
      handler: ({ request }) => next.handle(toNgReq(request)) as Observable<any>
    }) as Observable<any>;
  }
}
