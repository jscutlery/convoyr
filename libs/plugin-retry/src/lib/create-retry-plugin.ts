import { RequestCondition } from '@http-ext/core';

import { isServerError } from './is-server-error';
import { HandlerOptions, RetryHandler } from './retry-handler';

export interface RetryPluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createRetryPlugin({
  condition = () => true,
  initialIntervalMs = 200,
  maxIntervalMs = 60 * 1000, // 1 min
  maxRetries = 10,
  shouldRetry = isServerError
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
