import { createRequest, createResponse } from '@convoyr/core';
import { isObservable } from 'rxjs';
import { createPluginTester, PluginTester } from './create-plugin-tester';
import { createSpyPlugin } from './create-spy-plugin';

describe('PluginTester', () => {
  const request = createRequest({ url: 'http://test.com' });
  let pluginTester: PluginTester;
  let pluginHandler: {
    handle: jest.Mock<any, [any]>;
  };

  beforeEach(() => (pluginHandler = createSpyPlugin().handler));
  beforeEach(
    () => (pluginTester = createPluginTester({ handler: pluginHandler }))
  );

  it('should mock the Http handler', () => {
    const httpHandlerMock = pluginTester.mockHttpHandler();

    expect(jest.isMockFunction(httpHandlerMock)).toBeTruthy();
  });

  it('should run the Http handler using mock implementation', async () => {
    const httpHandlerMock = pluginTester.mockHttpHandler({
      response: createResponse({ body: 'Edward Whymper' }),
    });

    const fakeHandler$ = pluginTester.handleFake({
      request,
      httpHandlerMock,
    });

    expect(isObservable(fakeHandler$)).toBe(true);

    const response = await fakeHandler$.toPromise();

    expect(pluginHandler.handle).toBeCalledTimes(1);
    expect(pluginHandler.handle.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        next: { handle: httpHandlerMock },
        request,
      })
    );
    expect(response).toEqual(
      expect.objectContaining({
        body: 'Edward Whymper',
      })
    );
  });
});
