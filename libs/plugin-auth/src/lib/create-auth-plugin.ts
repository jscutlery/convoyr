import { HttpExtPlugin, RequestCondition } from '@http-ext/core';

import { AuthHandler, HandlerOptions } from './auth-handler';

export interface AuthPluginOptions extends HandlerOptions {
  condition?: RequestCondition;
}

export function createAuthPlugin({
  condition,
  token
}: AuthPluginOptions): HttpExtPlugin {
  return {
    condition,
    handler: new AuthHandler({
      token
    })
  };
}
