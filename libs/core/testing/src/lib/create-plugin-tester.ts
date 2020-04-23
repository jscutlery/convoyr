import {
  createResponse,
  ConvoyRequest,
  ConvoyResponse,
  PluginHandler,
  ResponseArgs,
} from '@convoy/core';
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
    handle({ request }: { request: ConvoyRequest }) {
      return handler.handle({ request, next }) as Observable<ConvoyResponse>;
    },
  };
}
