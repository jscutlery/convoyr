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
