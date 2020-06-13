/**
 * @hack relative import of `createSpyPlugin`:
 *   If we import `@convoyr/core/testing`, it fails building the core library.
 *   Somehow, `convoyr.spec.ts` is considered part of `@convoyr/core` by ng-packagr and creates an import loop between core and core/testing.
 */
import { createSpyPlugin } from '../../testing/src/index';
import { of } from 'rxjs';
import { Convoyr } from './convoyr';
import { invalidOriginMatchExpression } from './matchers/match-origin/invalid-origin-match-expression';
import { matchOrigin } from './matchers/match-origin/match-origin';
import { ConvoyrRequest, createRequest } from './request';
import { createResponse } from './response';
import { invalidPluginConditionError } from './throw-invalid-plugin-condition';

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
    const pluginA = createSpyPlugin({
      shouldHandleRequest: ({ request: req }) =>
        req.url.startsWith(
          'https://answer-to-the-ultimate-question-of-life.com/'
        ),
    });
    const pluginB = createSpyPlugin({
      shouldHandleRequest: ({ request: req }) =>
        req.url.startsWith('https://something-else-that-do-not-match.com/'),
    });
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

  describe('Plugin condition error handling', () => {
    let request: ConvoyrRequest;
    let observerSpy: any;

    beforeEach(() => {
      request = createRequest({
        url: 'https://test.com/',
      });

      observerSpy = {
        next: jest.fn(),
        error: jest.fn(),
      };
    });

    it('should handle condition error when `shouldHandleRequest` returns an invalid value', () => {
      const plugin = createSpyPlugin({
        shouldHandleRequest: () => '' as any /* 👈🏻 invalid condition */,
      });

      const convoyr = new Convoyr({ plugins: [plugin] });
      (convoyr as any)._logErrorNotification = jest.fn();

      const response$ = convoyr.handle({
        request,
        httpHandler: { handle: () => of(createResponse({ body: null })) },
      });
      response$.subscribe(observerSpy);

      expect(observerSpy.next).not.toHaveBeenCalled();
      expect(observerSpy.error).toHaveBeenCalledTimes(1);
      expect((convoyr as any)._logErrorNotification).toHaveBeenCalledWith(
        invalidPluginConditionError(typeof '')
      );
      expect(observerSpy.error).toHaveBeenCalledWith(
        invalidPluginConditionError(typeof '')
      );
    });

    it('should handle matcher error when used with an invalid argument', () => {
      const plugin = createSpyPlugin({
        shouldHandleRequest: matchOrigin(
          42 as any /* 👈🏻 invalid matcher argument */
        ),
      });

      const convoyr = new Convoyr({ plugins: [plugin] });
      (convoyr as any)._logErrorNotification = jest.fn();

      const response$ = convoyr.handle({
        request,
        httpHandler: { handle: () => of(createResponse({ body: null })) },
      });

      response$.subscribe(observerSpy);

      expect(observerSpy.next).not.toHaveBeenCalled();
      expect(observerSpy.error).toHaveBeenCalledTimes(1);
      expect((convoyr as any)._logErrorNotification).toHaveBeenCalledWith(
        invalidOriginMatchExpression(42)
      );
      expect(observerSpy.error).toHaveBeenCalledWith(
        invalidOriginMatchExpression(42)
      );
    });
  });
});
