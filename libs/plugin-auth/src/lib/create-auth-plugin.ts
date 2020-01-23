import { RequestCondition } from '@http-ext/core';

import { AuthHandler, HandlerOptions } from './auth-handler';

export interface AuthPluginOptions extends HandlerOptions {
  condition?: RequestCondition;
}

export function createAuthPlugin({
  condition,
  token,
  onUnauthorized
}: AuthPluginOptions) {
  return {
    condition,
    handler: new AuthHandler({
      token,
      onUnauthorized
    })
  };
}
