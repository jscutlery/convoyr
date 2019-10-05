import { Observable } from 'rxjs';

import { Request } from './http';
import { Plugin } from './plugin';
import { fromSyncOrAsync } from './utils/from-sync-or-async';

export type NextFn = ({ req: Request }) => Observable<Response>;

export class HttpExt {
  private _plugins: Plugin[];

  constructor({ plugins }: { plugins: Plugin[] }) {
    this._plugins = plugins;
  }

  handle({
    req,
    handler
  }: {
    req: Request<unknown>;
    handler: (req: Request<unknown>) => Observable<any>;
  }) {
    return this._handle({ req, plugins: this._plugins, handler });
  }

  private _handle({
    req,
    plugins,
    handler
  }: {
    req: Request;
    plugins: Plugin[];
    handler;
  }) {
    if (plugins.length === 0) {
      return handler(req);
    }

    const next: NextFn = args => {
      const res = this._handle({
        req: args.req,
        plugins: plugins.slice(1),
        handler
      });
      return fromSyncOrAsync(res);
    };

    return plugins[0].handle({ req, next });
  }
}
