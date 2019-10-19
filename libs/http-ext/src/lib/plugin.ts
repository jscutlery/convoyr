import { Observable } from 'rxjs';

import { RequestHandlerFn } from './http-ext';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export type RequestCondition = ({
  request: HttpExtRequest
}) => boolean | Promise<boolean> | Observable<boolean>;

export interface HttpExtPlugin {
  condition?: RequestCondition;
  handle({
    request
  }: {
    request: HttpExtRequest;
    next: RequestHandlerFn;
  }): SyncOrAsync<HttpExtResponse>;
}
