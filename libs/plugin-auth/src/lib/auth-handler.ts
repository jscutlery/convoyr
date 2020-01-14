import {
  createRequest,
  PluginHandler,
  PluginHandlerArgs
} from '@http-ext/core';
import { Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

export interface HandlerOptions {
  token: Observable<string>;
}

export class AuthHandler implements PluginHandler {
  private _token$: Observable<string>;

  constructor({ token }: HandlerOptions) {
    this._token$ = token;
  }

  handle({ request, next }: PluginHandlerArgs) {
    return this._token$.pipe(
      first(),
      map(token =>
        createRequest({
          ...request,
          headers: {
            ...request.headers,
            Authorization: `Bearer ${token}`
          }
        })
      ),
      switchMap(_request => next({ request: _request }))
    );
  }
}
