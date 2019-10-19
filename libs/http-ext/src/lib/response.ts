import { Headers } from './headers';

export interface HttpExtResponse<T = unknown> {
  body: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export type ResponseArgs<T> = Partial<HttpExtResponse<T>> &
  ({ body: T } | { status: number; statusText: string });

export function createResponse<T>(response: ResponseArgs<T>): HttpExtResponse {
  return {
    body: response.body,
    status: response.status || 200,
    statusText: response.statusText || 'OK',
    headers: response.headers || {}
  };
}
