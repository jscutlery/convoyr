import {
  createRequest,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { Observable, of } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';
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
    return of(originalRequest).pipe(
      withLatestFrom(this._token$),
      first() /* `first()` used to ensure a value is emitted */,
      map(([request, token]) =>
        setHeader({ request, key: 'Authorization', value: `Bearer ${token}` })
      ),
      switchMap(request => next({ request }))
    );
  }
}
