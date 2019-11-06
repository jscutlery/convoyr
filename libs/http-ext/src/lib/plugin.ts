import { Observable } from 'rxjs';

import { RequestHandlerFn } from './http-ext';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export type RequestCondition = ({
  request
}: {
  request: HttpExtRequest;
}) => boolean | Promise<boolean> | Observable<boolean>;

export interface HandlerArgs {
  request: HttpExtRequest;
  next: RequestHandlerFn;
}

export interface HttpExtPlugin {
  condition?: RequestCondition;
  handle({ request, next }: HandlerArgs): SyncOrAsync<HttpExtResponse>;
}
