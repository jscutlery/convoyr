import { RequestCondition } from '@http-ext/core';

import { AuthHandler, HandlerOptions } from './auth-handler';

export interface AuthPluginOptions extends HandlerOptions {
  condition?: RequestCondition;
}

export function createAuthPlugin({ condition, token }: AuthPluginOptions) {
  return {
    condition,
    handler: new AuthHandler({
      token
    })
  };
}
