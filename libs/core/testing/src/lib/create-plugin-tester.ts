import {
  createResponse,
  ConvoyrResponse,
  PluginHandler,
  ConvoyrRequest,
  PluginHandlerArgs,
  NextHandler,
} from '@convoyr/core';
import { Observable, of, isObservable } from 'rxjs';

export type TestResponse = ConvoyrResponse | Observable<ConvoyrResponse>;

export function createPluginTester({ handler }: { handler: PluginHandler }) {
  return new PluginTester({ handler });
}

export class PluginTester {
  private _handler: PluginHandler;

  constructor({ handler }: { handler: PluginHandler }) {
    this._handler = handler;
  }

  mockHttpHandler({
    response = createResponse({ status: 200, statusText: 'ok' }),
  }: {
    response?: TestResponse;
  } = {}): jest.Mock<Observable<ConvoyrResponse<unknown>>> {
    const fakeHttpResponse = isObservable(response) ? response : of(response);
    return jest.fn(() => fakeHttpResponse);
  }

  handleFake<T = Observable<ConvoyrResponse<unknown>>>({
    request,
    httpHandlerMock,
  }: {
    request: ConvoyrRequest;
    httpHandlerMock: jest.Mock<T>;
  }): T {
    return this._handler.handle({
      request,
      next: { handle: httpHandlerMock as any },
    }) as any;
  }
}
