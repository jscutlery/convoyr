import { Observable } from 'rxjs';
import { PluginHandler, PluginHandlerArgs } from '@http-ext/core';

export interface HandlerOptions {
  token: Observable<string>;
}

export class AuthHandler implements PluginHandler {
  private _token$: Observable<string>;

  constructor({ token }: HandlerOptions) {
    this._token$ = token;
  }

  handle({ request, next }: PluginHandlerArgs) {
    return next({ request });
  }
}
