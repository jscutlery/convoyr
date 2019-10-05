export interface Headers {
  [key: string]: string;
}

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

export interface Response<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
