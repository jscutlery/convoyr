import {
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  createRequest,
  createResponse,
  ConvoyrRequest,
  ConvoyrResponse,
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
): ConvoyrRequest<unknown> {
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
  request: ConvoyrRequest<unknown>
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

export function fromNgResponse(ngResponse: HttpResponse<unknown>) {
  return createResponse({
    body: ngResponse.body,
    headers: fromNgClass(ngResponse.headers),
    status: ngResponse.status,
    statusText: ngResponse.statusText,
  });
}

export function fromNgErrorResponse(
  ngResponse: HttpErrorResponse
): ConvoyrResponse<ErrorBody> {
  return createResponse({
    body: { error: ngResponse.error ?? null },
    headers: fromNgClass(ngResponse.headers),
    status: ngResponse.status,
    statusText: ngResponse.statusText,
  });
}

export function toNgResponse(
  response: ConvoyrResponse<unknown>
): HttpResponse<unknown> {
  return new HttpResponse({
    body: response.body,
    headers: new HttpHeaders(response.headers),
    status: response.status,
    statusText: response.statusText,
  });
}

export function toNgErrorResponse(
  response: ConvoyrResponse<ErrorBody>
): HttpErrorResponse {
  return new HttpErrorResponse({
    error: response.body.error,
    headers: new HttpHeaders(response.headers),
    status: response.status,
    statusText: response.statusText,
  });
}

export interface ErrorBody {
  error: unknown;
}
