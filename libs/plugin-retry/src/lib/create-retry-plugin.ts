import { RequestCondition } from '@http-ext/core';
import { isServerOrUnknownError } from './predicates/is-server-or-unknown-error';
import { HandlerOptions, RetryHandler } from './retry-handler';

export interface RetryPluginOptions extends HandlerOptions {
  shouldHandleRequest: RequestCondition;
}

/**
 * @param shouldHandleRequest
 * @param initialInterval defaults to 200ms
 * @param maxInterval defaults to 1min
 * @param maxRetries defaults to 10
 * @param shouldRetry defaults to server error: 5xx
 */
export function createRetryPlugin({
  shouldHandleRequest = () => true,
  initialInterval = 200,
  maxInterval = 60000, // 1 min
  maxRetries = 10,
  shouldRetry = isServerOrUnknownError
}: Partial<RetryPluginOptions> = {}) {
  return {
    shouldHandleRequest,
    handler: new RetryHandler({
      initialInterval,
      maxInterval,
      maxRetries,
      shouldRetry
    })
  };
}
