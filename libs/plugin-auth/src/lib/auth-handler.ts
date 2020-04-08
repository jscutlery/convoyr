import { PluginHandler, PluginHandlerArgs } from '@http-ext/core';
import { defer, Observable, throwError } from 'rxjs';
import { catchError, first, map, switchMap, filter } from 'rxjs/operators';

import { OnUnauthorized } from './on-unauthorized';
import { setHeader } from './set-header';

export interface HandlerOptions {
  token: Observable<string>;
  onUnauthorized?: OnUnauthorized;
}

export class AuthHandler implements PluginHandler {
  private _token$: Observable<string>;
  private _onUnauthorized: OnUnauthorized;

  constructor({ token, onUnauthorized }: HandlerOptions) {
    this._token$ = token;
    this._onUnauthorized = onUnauthorized;
  }

  handle({ request: originalRequest, next }: PluginHandlerArgs) {
    return defer(() => {
      return this._token$.pipe(
        filter(token => token != null),
        first(),
        map(token =>
          setHeader({
            request: originalRequest,
            key: 'Authorization',
            value: `Bearer ${token}`
          })
        ),
        switchMap(request => next({ request })),
        catchError(response => {
          if (response.status === 401) {
            /* tslint:disable-next-line: no-unused-expression */
            this._onUnauthorized && this._onUnauthorized(response);
          }

          return throwError(response);
        })
      );
    });
  }
}
