import { Headers } from './headers';

export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

export type HttpMethod =
  | 'HEAD'
  | 'OPTIONS'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export interface ConvoyrRequest<TBody = unknown> {
  readonly url: string;
  readonly method: HttpMethod;
  readonly body: TBody | null;
  readonly headers: Headers;
  readonly params: { [key: string]: string | string[] };
  readonly responseType: ResponseType;
}

export type RequestArgs<TBody> = { url: string } & Partial<
  ConvoyrRequest<TBody>
>;

export function createRequest<TBody>(
  request: RequestArgs<TBody>
): ConvoyrRequest {
  return {
    url: request.url,
    method: request.method || 'GET',
    body: request.body || null,
    headers: request.headers || {},
    params: request.params || {},
    responseType: request.responseType || 'json',
  };
}
