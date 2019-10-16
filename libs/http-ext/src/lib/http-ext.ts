import { Observable } from 'rxjs';

import { Plugin } from './plugin';
import { HttpExtRequest } from './request';
import { HttpExtResponse } from './response';
import { fromSyncOrAsync } from './utils/from-sync-or-async';
import { isBoolean } from './utils/is-boolean';
import { isFunction } from './utils/is-function';

export type RequestHandlerFn = ({
  request: Request
}) => Observable<HttpExtResponse>;

export function invalidPluginConditionError(type: string) {
  return new Error(
    `invalidPluginConditionError: expecting boolean got ${type}.`
  );
}

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

    this._throwIfInvalidPluginCondition({
      plugin,
      request,
    });

    /**
     * Skip plugin if plugin's condition tells so.
     */
    if (this._shouldSkip({ request, plugin })) {
      const response = next({ request });
      return fromSyncOrAsync(response);
    }

    return fromSyncOrAsync(plugin.handle({ request, next }));
  }

  /**
   * Tells if the given plugin should be skipped or not depending on plugins condition.
   */
  private _shouldSkip({
    request,
    plugin
  }: {
    request: HttpExtRequest;
    plugin: Plugin;
  }): boolean {
    return (
      isFunction(plugin.condition) && plugin.condition({ request }) === false
    );
  }

  /**
   * Throw an exception if the plugin condition return type is invalid.
   */
  private _throwIfInvalidPluginCondition({
    plugin,
    request
  }: {
    plugin: Plugin;
    request: HttpExtRequest;
  }): void {
    if (
      isFunction(plugin.condition) &&
      isBoolean(plugin.condition({ request })) === false
    ) {
      const type = typeof plugin.condition({ request });
      throw invalidPluginConditionError(type);
    }
  }
}
