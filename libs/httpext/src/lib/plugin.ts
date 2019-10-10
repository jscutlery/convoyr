import { RequestHandlerFn } from './http-ext';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface Plugin {
  condition?({ request }: { request: HttpExtRequest }): boolean;
  handle({
    request
  }: {
    request: HttpExtRequest;
    next: RequestHandlerFn;
  }): SyncOrAsync<HttpExtResponse>;
}
