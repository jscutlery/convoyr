import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpExtPlugin } from './plugin';
import { HttpExtRequest } from './request';
import { NextFn } from './request-handler';
import { HttpExtResponse } from './response';
import { throwIfInvalidPluginCondition } from './throw-invalid-plugin-condition';
import { fromSyncOrAsync } from './utils/from-sync-or-async';
import { isFunction } from './utils/is-function';

export function invalidHandleRequestConditionError() {
  return new Error('"shouldHandleRequest" should be a function.');
}

export interface HttpExtConfig {
  plugins: HttpExtPlugin[];
}

export class Convoy {
  private _plugins: HttpExtPlugin[];

  constructor({ plugins }: HttpExtConfig) {
    this._plugins = plugins;
  }

  handle({
    request,
    httpHandler,
  }: {
    request: HttpExtRequest;
    httpHandler: NextFn;
  }): Observable<HttpExtResponse> {
    return this._handle({
      request,
      plugins: this._plugins,
      httpHandler,
    });
  }

  private _handle({
    request,
    plugins,
    httpHandler,
  }: {
    request: HttpExtRequest;
    plugins: HttpExtPlugin[];
    httpHandler: NextFn;
  }): Observable<HttpExtResponse> {
    if (plugins.length === 0) {
      return httpHandler({ request });
    }

    const [plugin] = plugins;
    const { handler } = plugin;

    /**
     * Calls next plugins recursively.
     */
    const next: NextFn = (args) => {
      const response = this._handle({
        request: args.request,
        plugins: plugins.slice(1),
        httpHandler,
      });
      return fromSyncOrAsync(response);
    };

    /**
     * Handle plugin if plugin's condition tells so.
     */
    return this._shouldHandle({ request, plugin }).pipe(
      mergeMap(throwIfInvalidPluginCondition),
      mergeMap((shouldHandle) => {
        if (shouldHandle === false) {
          return next({ request });
        }

        return fromSyncOrAsync(handler.handle({ request, next }));
      })
    );
  }

  /**
   * Tells if the given plugin should be handled or not depending on plugins condition.
   */
  private _shouldHandle({
    request,
    plugin,
  }: {
    request: HttpExtRequest;
    plugin: HttpExtPlugin;
  }): Observable<boolean> {
    if (
      plugin.shouldHandleRequest != null &&
      !isFunction(plugin.shouldHandleRequest)
    ) {
      throw invalidHandleRequestConditionError();
    }

    if (plugin.shouldHandleRequest == null) {
      return of(true);
    }

    return fromSyncOrAsync(plugin.shouldHandleRequest({ request }));
  }
}
