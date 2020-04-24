import { ConvoyrRequest } from './request';
import { NextHandler } from './request-handler';
import { ConvoyrResponse } from './response';
import { SyncOrAsync } from './utils/from-sync-or-async';

export interface PluginHandlerArgs {
  request: ConvoyrRequest;
  next: NextHandler;
}

export interface PluginHandler {
  handle({ request, next }: PluginHandlerArgs): SyncOrAsync<ConvoyrResponse>;
}
