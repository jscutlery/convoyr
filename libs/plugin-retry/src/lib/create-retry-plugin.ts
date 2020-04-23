import { RequestCondition } from '@convoyr/core';
import { isServerOrUnknownError } from './predicates/is-server-or-unknown-error';
import { HandlerOptions, RetryHandler } from './retry-handler';

export interface RetryPluginOptions extends HandlerOptions {
  shouldHandleRequest: RequestCondition;
}

/**
 * @param shouldHandleRequest
 * @param initialInterval defaults to 300ms
 * @param maxInterval defaults to 10s
 * @param maxRetries defaults to 3
 * @param shouldRetry defaults to server error: 5xx
 */
export function createRetryPlugin({
  shouldHandleRequest,
  initialInterval = 300,
  maxInterval = 10_000,
  maxRetries = 3,
  shouldRetry = isServerOrUnknownError,
}: Partial<RetryPluginOptions> = {}) {
  return {
    shouldHandleRequest,
    handler: new RetryHandler({
      initialInterval,
      maxInterval,
      maxRetries,
      shouldRetry,
    }),
  };
}
