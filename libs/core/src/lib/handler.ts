import { HttpExtRequest } from './request';
import { NextFn } from './request-handler';
import { HttpExtResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface PluginHandlerArgs {
  request: HttpExtRequest;
  next: NextFn;
}

export interface PluginHandler {
  handle({ request, next }: PluginHandlerArgs): SyncOrAsync<HttpExtResponse>;
}
