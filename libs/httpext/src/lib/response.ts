import { Headers } from './headers';

export interface HttpExtResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export type ResponseArgs<T> = Partial<HttpExtResponse<T>> &
  ({ data: T } | { status: number; statusText: string });

export function createResponse<T>(response: ResponseArgs<T>): HttpExtResponse {
  return {
    data: response.data,
    status: response.status || 200,
    statusText: response.statusText || 'OK',
    headers: response.headers || {}
  };
}
