import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Plugin } from './plugin';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { throwIfInvalidPluginCondition } from './throw-invalid-plugin-condition';
import { fromSyncOrAsync } from './utils/from-sync-or-async';
import { isFunction } from './utils/is-function';

export type RequestHandlerFn = ({
  request: Request
}) => Observable<HttpExtResponse>;

export class HttpExt {
  private _plugins: Plugin[];

  constructor({ plugins }: { plugins: Plugin[] }) {
    this._plugins = plugins;
  }

  handle({
    request,
    handler
  }: {
    request: HttpExtRequest;
    handler: RequestHandlerFn;
  }): Observable<HttpExtResponse> {
    return this._handle({ request, plugins: this._plugins, handler });
  }

  private _handle({
    request,
    plugins,
    handler
  }: {
    request: HttpExtRequest;
    plugins: Plugin[];
    handler: RequestHandlerFn;
  }): Observable<HttpExtResponse> {
    if (plugins.length === 0) {
      return handler({ request });
    }

    const [plugin] = plugins;

    /**
     * Calls next plugins recursively.
     */
    const next: RequestHandlerFn = args => {
      const response = this._handle({
        request: args.request,
        plugins: plugins.slice(1),
        handler
      });
      return fromSyncOrAsync(response);
    };

    /**
     * Handle plugin if plugin's condition tells so.
     */
    return this._shouldHandle({ request, plugin }).pipe(
      mergeMap(throwIfInvalidPluginCondition),
      mergeMap(shouldHandle => {
        if (shouldHandle === false) {
          return next({ request });
        }

        return fromSyncOrAsync(plugin.handle({ request, next }));
      })
    );
  }

  /**
   * Tells if the given plugin should be handled or not depending on plugins condition.
   */
  private _shouldHandle({
    request,
    plugin
  }: {
    request: HttpExtRequest;
    plugin: Plugin;
  }): Observable<boolean> {
    if (!isFunction(plugin.condition)) {
      return of(true);
    }

    return fromSyncOrAsync(plugin.condition({ request }));
  }
}
