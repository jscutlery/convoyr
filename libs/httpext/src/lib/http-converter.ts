import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { HttpMethod, Request } from './http';

function fromNgClass(
  ngClass: HttpHeaders | HttpParams
): { [key: string]: string } {
  return ngClass.keys().reduce((obj, key) => ({ [key]: ngClass.get(key) }), {});
}

export function fromNgReq(req: HttpRequest<unknown>): Request<unknown> {
  return {
    url: req.url,
    method: req.method as HttpMethod,
    body: req.body,
    headers: fromNgClass(req.headers),
    params: fromNgClass(req.params)
  };
}

export function toNgReq(req: Request<unknown>): HttpRequest<unknown> {
  const init = {
    headers: new HttpHeaders(req.headers),
    params: new HttpParams({ fromObject: req.params })
  };

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return new HttpRequest(req.method, req.url, req.body, init);
  }

  return new HttpRequest(req.method, req.url, init);
}
