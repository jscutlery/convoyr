import { RequestHandlerFn } from './http-ext';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export type RequestCondition = ({ request: HttpExtRequest }) => boolean;

export interface Plugin {
  condition?: RequestCondition;
  handle({
    request
  }: {
    request: HttpExtRequest;
    next: RequestHandlerFn;
  }): SyncOrAsync<HttpExtResponse>;
}
