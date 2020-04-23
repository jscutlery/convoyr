import { PluginHandler, PluginHandlerArgs } from '@convoyr/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

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
      return of(originalRequest).pipe(
        withLatestFrom(this._token$),
        map(([request, token]) => {
          /* Don't add header if token is null or undefined. */
          if (token == null) {
            return request;
          }

          return setHeader({
            request,
            key: 'Authorization',
            value: `Bearer ${token}`,
          });
        }),
        switchMap((request) => next({ request })),
        catchError((response) => {
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
