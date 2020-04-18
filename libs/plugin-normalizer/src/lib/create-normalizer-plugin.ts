import {
  HttpExtPlugin,
  RequestCondition,
  HttpExtRequest,
} from '@http-ext/core';

import { HandlerOptions, NormalizerHandler } from './normalizer-handler';

export interface NormalizerPluginOptions extends HandlerOptions {
  shouldHandleRequest?: RequestCondition;
}

export const isGetMethodAndJsonResponseType = ({
  request,
}: {
  request: HttpExtRequest;
}) => request.method === 'GET' && request.responseType === 'json';

export function createNormalizerPlugin({
  shouldHandleRequest = isGetMethodAndJsonResponseType,
  schemas,
}): HttpExtPlugin {
  return {
    shouldHandleRequest,
    handler: new NormalizerHandler({
      schemas,
    }),
  };
}
