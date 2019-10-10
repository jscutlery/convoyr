import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { HttpMethod, HttpExtRequest } from './request';

function fromNgClass(
  ngClass: HttpHeaders | HttpParams
): { [key: string]: string } {
  return ngClass
    .keys()
    .reduce((_obj, key) => ({ [key]: ngClass.get(key) }), {});
}

export function fromNgReq(
  request: HttpRequest<unknown>
): HttpExtRequest<unknown> {
  return {
    url: request.url,
    method: request.method as HttpMethod,
    body: request.body,
    headers: fromNgClass(request.headers),
    params: fromNgClass(request.params)
  };
}

export function toNgReq(
  request: HttpExtRequest<unknown>
): HttpRequest<unknown> {
  const init = {
    headers: new HttpHeaders(request.headers),
    params: new HttpParams({ fromObject: request.params })
  };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return new HttpRequest(request.method, request.url, request.body, init);
  }

  return new HttpRequest(request.method, request.url, init);
}
