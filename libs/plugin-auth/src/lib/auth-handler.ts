import { PluginHandler, PluginHandlerArgs } from '@http-ext/core';
import { defer, Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

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
        first(),
        map(token =>
          setHeader({
            request: originalRequest,
            key: 'Authorization',
            value: `Bearer ${token}`
          })
        ),
        switchMap(request => next({ request })),
        tap(response => {
          if (response.status === 401) {
            this?._onUnauthorized(response);
          }
        })
      );
    });
  }
}
