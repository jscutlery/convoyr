import {
  createResponse,
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler,
  ResponseArgs,
} from '@http-ext/core';
import { Observable, of } from 'rxjs';

export function createPluginTester(
  {
    handler,
    response = { status: 200, statusText: 'Ok' },
  }: {
    handler: PluginHandler;
    response?: ResponseArgs<unknown>;
  } = {
    handler: undefined,
  }
) {
  const next = jest.fn().mockReturnValue(of(createResponse(response)));

  return {
    next,
    handle({ request }: { request: HttpExtRequest }) {
      return handler.handle({ request, next }) as Observable<HttpExtResponse>;
    },
  };
}
