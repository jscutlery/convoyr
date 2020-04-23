import { RequestCondition } from '@convoyr/core';

import { AuthHandler, HandlerOptions } from './auth-handler';

export interface AuthPluginOptions extends HandlerOptions {
  shouldHandleRequest?: RequestCondition;
}

export function createAuthPlugin({
  shouldHandleRequest,
  token,
  onUnauthorized,
}: AuthPluginOptions) {
  return {
    shouldHandleRequest,
    handler: new AuthHandler({
      token,
      onUnauthorized,
    }),
  };
}
