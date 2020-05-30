import { SpyPlugin, createSpyPlugin } from './create-spy-plugin';
import { createRequest, createResponse } from '@convoyr/core';
import { of } from 'rxjs';

describe('createSpyPlugin', () => {
  let spyPlugin: SpyPlugin;
  beforeEach(() => {
    spyPlugin = createSpyPlugin();
  });

  it('should create a spy plugin that just pass through the next plugin', () => {
    const request = createRequest({ url: 'test' });
    const nextSpy = {
      handle: jest.fn(() => of(createResponse({ body: null }))),
    };

    expect(jest.isMockFunction(spyPlugin.shouldHandleRequest)).toBeTruthy();
    expect(jest.isMockFunction(spyPlugin.handler.handle)).toBeTruthy();

    spyPlugin.handler.handle({ request, next: nextSpy });

    expect(nextSpy.handle).toHaveBeenCalledTimes(1);
  });
});
