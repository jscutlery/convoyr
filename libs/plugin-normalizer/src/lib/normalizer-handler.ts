import { PluginHandler, PluginHandlerArgs } from '@http-ext/core';
import { normalize, Schema } from 'normalizr';
import { map } from 'rxjs/operators';

export interface HandlerOptions {
  schemas: SchemaDictionary;
}

export interface SchemaDictionary {
  [url: string]: Schema;
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

        if (schema == null) {
          return response;
        }

        return { ...response, body: normalize(response.body, schema) };
      })
    );
  }
}
