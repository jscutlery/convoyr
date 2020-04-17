import { HttpExtPlugin, RequestCondition, matchMethod } from '@http-ext/core';

import { HandlerOptions, NormalizerHandler } from './normalizer-handler';

export interface NormalizerPluginOptions extends HandlerOptions {
  shouldHandleRequest?: RequestCondition;
}

export function createNormalizerPlugin({
  shouldHandleRequest = matchMethod('GET'),
  schemas,
}: NormalizerPluginOptions): HttpExtPlugin {
  return {
    shouldHandleRequest,
    handler: new NormalizerHandler({
      schemas,
    }),
  };
}
