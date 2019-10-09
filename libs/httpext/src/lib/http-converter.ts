import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { HttpMethod, Request } from './http';

function fromNgClass(
  ngClass: HttpHeaders | HttpParams
): { [key: string]: string } {
  return ngClass.keys().reduce((obj, key) => ({ [key]: ngClass.get(key) }), {});
}

export function fromNgReq(request: HttpRequest<unknown>): Request<unknown> {
  return {
    url: request.url,
    method: request.method as HttpMethod,
    body: request.body,
    headers: fromNgClass(request.headers),
    params: fromNgClass(request.params)
  };
}

export function toNgReq(request: Request<unknown>): HttpRequest<unknown> {
  const init = {
    headers: new HttpHeaders(request.headers),
    params: new HttpParams({ fromObject: request.params })
  };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return new HttpRequest(request.method, request.url, request.body, init);
  }

  return new HttpRequest(request.method, request.url, init);
}
