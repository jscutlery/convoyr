import { Observable } from 'rxjs';

import { Plugin } from './plugin';
import { Request } from './request';
import { Response } from './response';
import { fromSyncOrAsync } from './utils/from-sync-or-async';
import { isFunction } from './utils/is-function';

export type RequestHandlerFn = ({ request: Request }) => Observable<Response>;

export class HttpExt {
  private _plugins: Plugin[];

  constructor({ plugins }: { plugins: Plugin[] }) {
    this._plugins = plugins;
  }

  handle({
    request,
    handler
  }: {
    request: Request;
    handler: RequestHandlerFn;
  }): Observable<Response> {
    return this._handle({ request, plugins: this._plugins, handler });
  }

  private _handle({
    request,
    plugins,
    handler
  }: {
    request: Request;
    plugins: Plugin[];
    handler: RequestHandlerFn;
  }): Observable<Response> {
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
    request: Request<unknown>;
    plugin: Plugin;
  }): boolean {
    return (
      isFunction(plugin.condition) && plugin.condition({ request }) === false
    );
  }
}
