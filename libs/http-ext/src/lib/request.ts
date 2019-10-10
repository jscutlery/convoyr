import { Headers } from './headers';

export type HttpMethod =
  | 'HEAD'
  | 'OPTIONS'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export interface HttpExtRequest<T = unknown> {
  readonly url: string;
  readonly method: HttpMethod;
  readonly body: T | null;
  readonly headers: Headers;
  readonly params: { [key: string]: string | string[] };
}

export type RequestArgs<T> = { url: string } & Partial<HttpExtRequest<T>>;

export function createRequest<T>(request: RequestArgs<T>): HttpExtRequest {
  return {
    url: request.url,
    method: request.method || 'GET',
    body: request.body || null,
    headers: request.headers || {},
    params: request.params || {}
  };
}
