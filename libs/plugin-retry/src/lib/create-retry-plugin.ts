import { RequestCondition } from '@http-ext/core';

import { HandlerOptions, RetryHandler } from './retry-handler';

export interface RetryPluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

export function createRetryPlugin({
  condition = () => true,
  initialInterval = 200, // 100 ms
  maxInterval = 60 * 1000, // 1 min
  maxRetries = 10
}: Partial<RetryPluginOptions> = {}) {
  return {
    condition,
    handler: new RetryHandler({ initialInterval, maxInterval, maxRetries })
  };
}
