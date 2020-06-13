import {
  Convoyr,
  ConvoyrPlugin,
  ConvoyrRequest,
  ConvoyrResponse,
  createResponse,
} from '@convoyr/core';
import { Observable } from 'rxjs';
import { fromSyncOrAsync } from '@convoyr/core';

export type TestResponse = ConvoyrResponse | Observable<ConvoyrResponse>;

export interface PluginTesterArgs {
  plugin: ConvoyrPlugin;
}

export function createPluginTester({ plugin }: PluginTesterArgs) {
  return new PluginTester({ plugin });
}

export class PluginTester {
  private _convoyr: Convoyr;

  constructor({ plugin }: PluginTesterArgs) {
    this._convoyr = this._createConvoyr(plugin);
  }

  createHttpHandlerMock({
    response = createResponse({ status: 200, statusText: 'ok' }),
  }: {
    response?: TestResponse;
  } = {}): jest.Mock<Observable<ConvoyrResponse<unknown>>> {
    return jest.fn(() => fromSyncOrAsync(response));
  }

  handleFake({
    request,
    httpHandlerMock,
  }: {
    request: ConvoyrRequest;
    httpHandlerMock: jest.Mock<Observable<ConvoyrResponse>>;
  }): Observable<ConvoyrResponse> {
    return this._convoyr.handle({
      request,
      httpHandler: { handle: httpHandlerMock },
    });
  }

  private _createConvoyr(plugin: ConvoyrPlugin): Convoyr {
    const convoyr = new Convoyr({
      plugins: [plugin],
    });

    /* Mock error logging in test environment to not pollute console output. */
    (convoyr as any)._logErrorNotification = jest.fn();

    return convoyr;
  }
}
