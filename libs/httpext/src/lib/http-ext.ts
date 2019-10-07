import { Observable } from 'rxjs';

import { Request } from './http';
import { Plugin } from './plugin';
import { fromSyncOrAsync } from './utils/from-sync-or-async';

export type NextFn = ({ request: Request }) => Observable<Response>;

export class HttpExt {
  private _plugins: Plugin[];

  constructor({ plugins }: { plugins: Plugin[] }) {
    this._plugins = plugins;
  }

  handle({
    request,
    handler
  }: {
    request: Request<unknown>;
    handler: (request: Request<unknown>) => Observable<any>;
  }) {
    return this._handle({ request, plugins: this._plugins, handler });
  }

  private _handle({
    request,
    plugins,
    handler
  }: {
    request: Request;
    plugins: Plugin[];
    handler;
  }) {
    if (plugins.length === 0) {
      return handler(request);
    }

    const next: NextFn = args => {
      const response = this._handle({
        request: args.request,
        plugins: plugins.slice(1),
        handler
      });
      return fromSyncOrAsync(response);
    };

    return plugins[0].handle({ request, next });
  }
}
