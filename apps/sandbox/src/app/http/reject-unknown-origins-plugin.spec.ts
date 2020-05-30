import { rejectUnknownOriginsPlugin } from './reject-unknown-origins-plugin';
import { createResponse, createRequest } from '@convoyr/core';
import { createPluginTester, PluginTester } from '@convoyr/core/testing';

describe('rejectUnknownOriginsPlugin', () => {
  let pluginTester: PluginTester;

  beforeEach(() => {
    pluginTester = createPluginTester({
      plugin: rejectUnknownOriginsPlugin,
    });
  });

  it('should reject unknown origins', () => {
    const httpHandlerMock = pluginTester.mockHttpHandler({
      response: createResponse({ body: null }),
    });

    const response$ = pluginTester.handleFake({
      request: createRequest({ url: 'https://rejected-origin.com' }),
      httpHandlerMock,
    });

    const observer = {
      next: jest.fn(),
      error: jest.fn(),
    };
    response$.subscribe(observer);

    expect(httpHandlerMock).not.toHaveBeenCalled();
    expect(observer.next).not.toHaveBeenCalled();
    expect(observer.error).toHaveBeenCalledTimes(1);
    expect(observer.error).toHaveBeenCalledWith(
      `🛑 Requesting invalid origin, url: https://rejected-origin.com`
    );
  });
});
