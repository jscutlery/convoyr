import {
  createRequest,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { Observable, of, defer } from 'rxjs';
import { first, map, switchMap, withLatestFrom, tap } from 'rxjs/operators';
import { setHeader } from './set-header';

export interface HandlerOptions {
  token: Observable<string>;
}

export class AuthHandler implements PluginHandler {
  private _token$: Observable<string>;

  constructor({ token }: HandlerOptions) {
    this._token$ = token;
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
        switchMap(request => next({ request }))
      );
    });
  }
}
