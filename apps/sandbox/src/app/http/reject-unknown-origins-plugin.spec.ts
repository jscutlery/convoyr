import { createRequest, createResponse, ConvoyrResponse } from '@convoyr/core';
import { createPluginTester, PluginTester } from '@convoyr/core/testing';
import { ObserverSpy } from '@hirez_io/observer-spy';
import { rejectUnknownOriginsPlugin } from './reject-unknown-origins-plugin';

describe('rejectUnknownOriginsPlugin', () => {
  let pluginTester: PluginTester;
  let observerSpy: ObserverSpy<ConvoyrResponse>;

  beforeEach(() => {
    observerSpy = new ObserverSpy();
    pluginTester = createPluginTester({
      plugin: rejectUnknownOriginsPlugin,
    });
  });

  it('should reject unknown origins', () => {
    const httpHandlerMock = pluginTester.createHttpHandlerMock({
      response: createResponse({ body: null }),
    });

    const response$ = pluginTester.handleFake({
      request: createRequest({ url: 'https://rejected-origin.com' }),
      httpHandlerMock,
    });

    response$.subscribe(observerSpy);

    expect(httpHandlerMock).not.toHaveBeenCalled();
    expect(observerSpy.receivedError()).toBe(true);
    expect(observerSpy.receivedError).toBe(true);
    expect(observerSpy.getError()).toBe(
      `🛑 Requesting invalid origin, url: https://rejected-origin.com`
    );
  });
});
