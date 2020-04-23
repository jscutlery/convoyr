import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ConvoyPlugin } from './plugin';
import { ConvoyRequest } from './request';
import { NextFn } from './request-handler';
import { ConvoyrResponse } from './response';
import { throwIfInvalidPluginCondition } from './throw-invalid-plugin-condition';
import { fromSyncOrAsync } from './utils/from-sync-or-async';
import { isFunction } from './utils/is-function';

export function invalidHandleRequestConditionError() {
  return new Error('"shouldHandleRequest" should be a function.');
}

export interface ConvoyConfig {
  plugins: ConvoyPlugin[];
}

export class Convoyr {
  private _plugins: ConvoyPlugin[];

  constructor({ plugins }: ConvoyConfig) {
    this._plugins = plugins;
  }

  handle({
    request,
    httpHandler,
  }: {
    request: ConvoyRequest;
    httpHandler: NextFn;
  }): Observable<ConvoyrResponse> {
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
    request: ConvoyRequest;
    plugins: ConvoyPlugin[];
    httpHandler: NextFn;
  }): Observable<ConvoyrResponse> {
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
    request: ConvoyRequest;
    plugin: ConvoyPlugin;
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
