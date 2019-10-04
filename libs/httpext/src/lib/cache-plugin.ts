import { Observable, SubscribableOrPromise } from 'rxjs';

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

export type NextFn = ({ req: Request }) => Observable<Response>;

export type SyncOrAsync<T> = T | SubscribableOrPromise<T>;

export interface Plugin {
  condition({ req }: { req: Request }): boolean;
  handle({
    req
  }: {
    req: Request;
    next: NextFn;
  }): SyncOrAsync<Response>;
}

export function useCachePlugin(): Plugin {
  return {
    condition: null,
    handle({ req, next }) {
      throw new Error('🚧 Not implemented error!');
    }
  };
}
