import {
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { retryBackoff, RetryBackoffConfig } from 'backoff-rxjs';
import { Observable } from 'rxjs';

export type HandlerOptions = RetryBackoffConfig;

export class RetryHandler implements PluginHandler {
  private _initialInterval: number;
  private _maxInterval: number;
  private _maxRetries: number;

  constructor({ initialInterval, maxInterval, maxRetries }: HandlerOptions) {
    this._initialInterval = initialInterval;
    this._maxInterval = maxInterval;
    this._maxRetries = maxRetries;
  }

  handle({
    request,
    next
  }: PluginHandlerArgs): Observable<HttpExtResponse<unknown>> {
    return next({ request }).pipe(
      retryBackoff({
        initialInterval: this._initialInterval,
        maxInterval: this._maxInterval,
        maxRetries: this._maxRetries,
        shouldRetry: (response: HttpExtResponse) => {
          return response.status !== 404;
        }
      })
    );
  }
}
