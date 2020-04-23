import {
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  createRequest,
  createResponse,
  ConvoyRequest,
  ConvoyResponse,
  HttpMethod,
} from '@convoyr/core';

export function fromNgClass(
  ngClass: HttpHeaders | HttpParams
): { [key: string]: string } {
  return ngClass
    .keys()
    .reduce((_obj, key) => ({ [key]: ngClass.get(key) }), {});
}

export function fromNgRequest(
  request: HttpRequest<unknown>
): ConvoyRequest<unknown> {
  return createRequest({
    url: request.url,
    method: request.method as HttpMethod,
    body: request.body,
    headers: fromNgClass(request.headers),
    params: fromNgClass(request.params),
    responseType: request.responseType,
  });
}

export function toNgRequest(
  request: ConvoyRequest<unknown>
): HttpRequest<unknown> {
  const init = {
    headers: new HttpHeaders(request.headers),
    params: new HttpParams({ fromObject: request.params }),
    responseType: request.responseType,
  };

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return new HttpRequest(request.method, request.url, request.body, init);
  }

  return new HttpRequest(request.method, request.url, init);
}

export function fromNgResponse(
  ngResponse: HttpResponse<unknown>
): ConvoyResponse<unknown> {
  return createResponse({
    body: ngResponse.body,
    headers: fromNgClass(ngResponse.headers),
    status: ngResponse.status,
    statusText: ngResponse.statusText,
  });
}

export function toNgResponse(
  response: ConvoyResponse<unknown>
): HttpResponse<unknown> {
  return new HttpResponse({
    body: response.body,
    headers: new HttpHeaders(response.headers),
    status: response.status,
    statusText: response.statusText,
  });
}
