import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
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
    return this._httpExt.handle({
      req: fromNgReq(ngReq),
      handler: req => next.handle(toNgReq(req))
    });
  }
}
