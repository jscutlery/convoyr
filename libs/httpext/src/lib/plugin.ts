import { Request, Response } from './http';
import { NextFn } from './http-ext';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface Plugin {
  condition?({ req }: { req: Request }): boolean;
  handle({
    req
  }: {
    req: Request;
    next: NextFn;
  }): SyncOrAsync<Response>;
}


