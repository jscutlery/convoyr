import { PluginHandler, PluginHandlerArgs } from '@http-ext/core';
import { normalize } from 'normalizr';
import { map } from 'rxjs/operators';

export interface HandlerOptions {
  schemas: SchemaDictionary;
}

export interface SchemaDictionary {
  [url: string]: any;
}

export class NormalizerHandler implements PluginHandler {
  private _schemas: SchemaDictionary;

  constructor({ schemas }: HandlerOptions) {
    this._schemas = schemas;
  }

  handle({ request, next }: PluginHandlerArgs) {
    return next({ request }).pipe(
      map((response) => {
        const schema = this._schemas[request.url];
        return normalize(response, schema);
      })
    );
  }
}
