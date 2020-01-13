import {
  HttpExtResponse,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { retryBackoff } from 'backoff-rxjs';
import { Observable } from 'rxjs';

export interface HandlerOptions {
  /**
   * Initial retry interval in milliseconds.
   */
  initialInterval: number;
  /**
   * Last retry interval in milliseconds.
   */
  maxInterval: number;
  maxRetries: number;
  shouldRetry: RetryPredicate;
}

export type RetryPredicate = (response: HttpExtResponse) => boolean;

export class RetryHandler implements PluginHandler {
  private _initialInterval: number;
  private _maxInterval: number;
  private _maxRetries: number;
  private _shouldRetry: RetryPredicate;

  constructor({
    initialInterval,
    maxInterval,
    maxRetries,
    shouldRetry
  }: HandlerOptions) {
    this._initialInterval = initialInterval;
    this._maxInterval = maxInterval;
    this._maxRetries = maxRetries;
    this._shouldRetry = shouldRetry;
  }

  handle({ request, next }: PluginHandlerArgs): Observable<HttpExtResponse> {
    return next({ request }).pipe(
      retryBackoff({
        initialInterval: this._initialInterval,
        maxInterval: this._maxInterval,
        maxRetries: this._maxRetries,
        shouldRetry: this._shouldRetry
      })
    );
  }
}
