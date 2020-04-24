/**
 * @hack relative import of `createSpyPlugin`:
 *   If we import `@convoyr/core/testing`, it fails building the core library.
 *   Somehow, `convoyr.spec.ts` is considered part of `@convoyr/core` by ng-packagr and creates an import loop between core and core/testing.
 */
import { createSpyPlugin } from '../../testing/src/index';
import { of } from 'rxjs';

import { Convoyr } from './convoyr';
import { createRequest } from './request';
import { createResponse } from './response';

describe('Convoyr', () => {
  it('should handle multiple plugins', () => {
    const pluginA = createSpyPlugin();
    const pluginB = createSpyPlugin();
    const convoyr = new Convoyr({ plugins: [pluginA, pluginB] });

    const request = createRequest({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
    });

    const response$ = convoyr.handle({
      request,
      httpHandler: {
        handle: () =>
          of(
            createResponse({
              body: { answer: 42 },
            })
          ),
      },
    });
    const responseObserver = jest.fn();

    response$.subscribe(responseObserver);

    /*
     * Make sure plugin A is called with the right args.
     */
    expect(pluginA.handler.handle).toHaveBeenCalledTimes(1);
    expect(typeof pluginA.handler.handle.mock.calls[0][0].next).toBe('object');
    expect(typeof pluginA.handler.handle.mock.calls[0][0].next.handle).toBe(
      'function'
    );
    expect(pluginA.handler.handle.mock.calls[0][0].request).toEqual(
      expect.objectContaining({
        url: 'https://answer-to-the-ultimate-question-of-life.com',
        method: 'GET',
      })
    );

    /*
     * Make sure plugin B is called with the right args.
     */
    expect(pluginB.handler.handle).toHaveBeenCalledTimes(1);
    expect(typeof pluginB.handler.handle.mock.calls[0][0].next).toBe('object');
    expect(typeof pluginB.handler.handle.mock.calls[0][0].next.handle).toBe(
      'function'
    );
    expect(pluginB.handler.handle.mock.calls[0][0].request).toEqual(
      expect.objectContaining({
        url: 'https://answer-to-the-ultimate-question-of-life.com',
        method: 'GET',
      })
    );

    expect(responseObserver).toHaveBeenCalledTimes(1);
    expect(responseObserver).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          answer: 42,
        },
      })
    );
  });

  it('should conditionally handle plugins', () => {
    const pluginA = createSpyPlugin((req) =>
      req.url.startsWith('https://answer-to-the-ultimate-question-of-life.com/')
    );
    const pluginB = createSpyPlugin((req) =>
      req.url.startsWith('https://something-else-that-do-not-match.com/')
    );
    const convoyr = new Convoyr({ plugins: [pluginA, pluginB] });
    const request = createRequest({
      url: 'https://answer-to-the-ultimate-question-of-life.com/',
    });

    const response$ = convoyr.handle({
      request,
      httpHandler: {
        handle: () =>
          of(
            createResponse({
              body: { answer: 42 },
            })
          ),
      },
    });
    const responseObserver = jest.fn();

    response$.subscribe(responseObserver);

    /* The first plugin should match the condition and handle the request. */
    expect(pluginA.handler.handle).toHaveBeenCalledTimes(1);

    /* The second plugin should not be called as it doesn't match the condition. */
    expect(pluginB.handler.handle).not.toBeCalled();

    expect(responseObserver).toHaveBeenCalledTimes(1);
    expect(responseObserver).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          answer: 42,
        },
      })
    );
  });

  it('should throw when a plugin condition returns an invalid value', () => {
    const plugin = createSpyPlugin(() => '' as any /* 👈🏻 invalid condition */);
    const convoyr = new Convoyr({ plugins: [plugin] });
    const request = createRequest({
      url: 'https://test.com/',
    });
    const response$ = convoyr.handle({
      request,
      httpHandler: { handle: () => of(createResponse({ body: null })) },
    });

    const errorObserver = jest.fn();

    response$.subscribe({ error: errorObserver });

    expect(errorObserver).toHaveBeenCalledTimes(1);
    expect(errorObserver).toHaveBeenCalledWith(
      `InvalidPluginConditionError: expect boolean got string.`
    );
  });
});
