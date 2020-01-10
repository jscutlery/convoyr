import { HttpExtResponse, RequestCondition } from '@http-ext/core';

import { HandlerOptions, RetryHandler } from './retry-handler';

export interface RetryPluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createRetryPlugin({
  condition = () => true,
  initialIntervalMs = 200,
  maxIntervalMs = 60 * 1000, // 1 min
  maxRetries = 10,
  shouldRetry = (response: HttpExtResponse) => response.status !== 404
}: Partial<RetryPluginOptions> = {}) {
  return {
    condition,
    handler: new RetryHandler({
      initialIntervalMs,
      maxIntervalMs,
      maxRetries,
      shouldRetry
    })
  };
}
