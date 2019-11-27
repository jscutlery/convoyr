import { RequestHandlerFn } from './http-ext';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface PluginHandlerArgs {
  request: HttpExtRequest;
  next: RequestHandlerFn;
}

export interface PluginHandler {
  handle({ request, next }: PluginHandlerArgs): SyncOrAsync<HttpExtResponse>;
}
