import { createRequest, createResponse } from '@convoyr/core';
import { isObservable } from 'rxjs';
import { createPluginTester, PluginTester } from './create-plugin-tester';
import { createSpyPlugin } from './create-spy-plugin';

describe('PluginTester', () => {
  const request = createRequest({ url: 'http://test.com' });
  const spyPlugin = createSpyPlugin(() => true);

  let pluginTester: PluginTester;
  beforeEach(() => (pluginTester = createPluginTester({ plugin: spyPlugin })));

  it('should mock the Http handler with a default ok response', async () => {
    const httpHandlerMock = pluginTester.mockHttpHandler();

    const httpResponse$ = httpHandlerMock();

    expect(jest.isMockFunction(httpHandlerMock)).toBeTruthy();
    expect(isObservable(httpResponse$)).toBeTruthy();
    expect(await httpResponse$.toPromise()).toEqual(
      createResponse({ status: 200, statusText: 'ok' })
    );
  });

  it('should run the plugin correctly', async () => {
    const httpHandlerMock = pluginTester.mockHttpHandler({
      response: createResponse({ body: 'Edward Whymper' }),
    });

    const response$ = pluginTester.handleFake({
      request,
      httpHandlerMock,
    });

    expect(isObservable(response$)).toBeTruthy();

    const response = await response$.toPromise();

    expect(spyPlugin.shouldHandleRequest).toHaveBeenCalledTimes(1);
    expect(spyPlugin.shouldHandleRequest.mock.calls[0][0]).toEqual({
      request,
    });
    expect(spyPlugin.handler.handle).toBeCalledTimes(1);
    expect(spyPlugin.handler.handle.mock.calls[0][0]).toEqual({
      next: { handle: expect.any(Function) },
      request,
    });
    expect(response).toEqual(
      expect.objectContaining({
        body: 'Edward Whymper',
      })
    );
  });
});
