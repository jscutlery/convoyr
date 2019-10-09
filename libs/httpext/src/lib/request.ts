import { Headers } from './headers';

export type HttpMethod =
  | 'HEAD'
  | 'OPTIONS'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export interface Request<T = unknown> {
  readonly url: string;
  readonly method: HttpMethod;
  readonly body: T | null;
  readonly headers: Headers;
  readonly params: { [key: string]: string | string[] };
}

export type RequestArgs<T> = { url: string } & Partial<Request<T>>;

export function createRequest<T>(request: RequestArgs<T>): Request {
  return {
    url: request.url,
    method: request.method || 'GET',
    body: request.body,
    headers: request.headers || {},
    params: request.params || {}
  };
}
