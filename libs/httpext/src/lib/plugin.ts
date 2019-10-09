import { Request, Response } from './http';
import { NextFn } from './http-ext';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface Plugin {
  condition?({ request }: { request: Request }): boolean;
  handle({
    request
  }: {
    request: Request;
    next: NextFn;
  }): SyncOrAsync<Response>;
}
