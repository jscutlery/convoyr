import { HttpExtPlugin, RequestCondition } from '@http-ext/core';

import { HandlerOptions, NormalizerHandler } from './normalizer-handler';

export interface NormalizerPluginOptions extends HandlerOptions {
  shouldHandleRequest?: RequestCondition;
}

export function createPluginNormalizer({
  shouldHandleRequest,
}: NormalizerPluginOptions = {}): HttpExtPlugin {
  return {
    shouldHandleRequest,
    handler: new NormalizerHandler(),
  };
}
