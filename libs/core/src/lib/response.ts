import { Headers } from './headers';

export interface HttpExtResponse<TBody = unknown> {
  body: TBody;
  status: number;
  statusText: string;
  headers: Headers;
}

export type ResponseArgs<TBody> = Partial<HttpExtResponse<TBody>> &
  ({ body: TBody } | { status: number; statusText: string });

export function createResponse<TBody>(
  response: ResponseArgs<TBody>
): HttpExtResponse {
  return {
    body: response.body,
    status: response.status == null ? 200 : response.status,
    statusText: response.statusText || 'OK',
    headers: response.headers || {}
  };
}
