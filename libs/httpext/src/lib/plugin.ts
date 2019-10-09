import { Request, Response } from './http';
import { RequestHandlerFn } from './http-ext';
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
