import { ConvoyrResponse } from '@convoyr/core';
import { createSpyPlugin } from '@convoyr/core/testing';
import { ObserverSpy } from '@hirez_io/observer-spy';
import { of } from 'rxjs';
import { Convoyr } from './convoyr';
import { invalidOriginMatchExpression } from './matchers/match-origin/invalid-origin-match-expression';
import { matchOrigin } from './matchers/match-origin/match-origin';
import { ConvoyrRequest, createRequest } from './request';
import { createResponse } from './response';
import { invalidPluginConditionError } from './throw-invalid-plugin-condition';

describe('Convoyr', () => {
  let observerSpy: ObserverSpy<ConvoyrResponse>;

  beforeEach(() => {
    observerSpy = new ObserverSpy();
  });

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

    response$.subscribe(observerSpy);

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

    expect(observerSpy.getValuesLength()).toBe(1);
    expect(observerSpy.receivedComplete()).toBe(true);
    expect(observerSpy.getLastValue()).toEqual(
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

    response$.subscribe(observerSpy);

    /* The first plugin should match the condition and handle the request. */
    expect(pluginA.handler.handle).toHaveBeenCalledTimes(1);

    /* The second plugin should not be called as it doesn't match the condition. */
    expect(pluginB.handler.handle).not.toBeCalled();

    expect(observerSpy.getValuesLength()).toBe(1);
    expect(observerSpy.getLastValue()).toEqual(
      expect.objectContaining({
        body: {
          answer: 42,
        },
      })
    );
  });

  describe('Plugin condition error handling', () => {
    let request: ConvoyrRequest;

    beforeEach(() => {
      request = createRequest({
        url: 'https://test.com/',
      });
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

      expect(observerSpy.receivedNext()).toBe(false);
      expect(observerSpy.receivedError()).toBe(true);
      expect(observerSpy.getError()).toEqual(
        invalidPluginConditionError(typeof '')
      );
      expect((convoyr as any)._logErrorNotification).toHaveBeenCalledWith(
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

      expect(observerSpy.receivedNext()).toBe(false);
      expect(observerSpy.receivedError()).toBe(true);
      expect(observerSpy.getError()).toEqual(invalidOriginMatchExpression(42));
      expect((convoyr as any)._logErrorNotification).toHaveBeenCalledWith(
        invalidOriginMatchExpression(42)
      );
    });
  });
});
