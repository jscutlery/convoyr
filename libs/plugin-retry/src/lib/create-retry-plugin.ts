import { RequestCondition } from '@http-ext/core';

import { isServerError } from './predicates/is-server-error';
import { isServerOrUnknownError } from './predicates/is-server-or-unknown-error.spec';
import { HandlerOptions, RetryHandler } from './retry-handler';

export interface RetryPluginOptions extends HandlerOptions {
  condition: RequestCondition;
}

/**
 * @param condition
 * @param initialInterval defaults to 200ms
 * @param maxInterval defaults to 1min
 * @param maxRetries defaults to 10
 * @param shouldRetry defaults to server error: 5xx
 */
export function createRetryPlugin({
  condition = () => true,
  initialInterval = 200,
  maxInterval = 60000, // 1 min
  maxRetries = 10,
  shouldRetry = isServerOrUnknownError
}: Partial<RetryPluginOptions> = {}) {
  return {
    condition,
    handler: new RetryHandler({
      initialInterval,
      maxInterval,
      maxRetries,
      shouldRetry
    })
  };
}
