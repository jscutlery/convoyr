import { RequestHandlerFn } from './http-ext';
import { Request } from './request';
import { Response } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface Plugin {
  condition?({ request }: { request: Request }): boolean;
  handle({
    request
  }: {
    request: Request;
    next: RequestHandlerFn;
  }): SyncOrAsync<Response>;
}
