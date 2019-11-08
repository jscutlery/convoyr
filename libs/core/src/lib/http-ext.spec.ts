import { of } from 'rxjs';

import { HttpExt } from './http-ext';
import { createRequest, HttpExtRequest } from './request';
import { createResponse } from './response';

/* A plugin handle that just calls through the next plugin.*/
export function createSpyPlugin(
  condition: (request: HttpExtRequest) => boolean = (request: HttpExtRequest) =>
    true
) {
  return {
    condition: jest.fn(({ request }) => condition(request)),
    handle: jest.fn(({ request, next }) => next({ request }))
  };
}

describe('HttpExt', () => {
  it('should handle multiple plugins', () => {
    const pluginA = createSpyPlugin();
    const pluginB = createSpyPlugin();
    const httpExt = new HttpExt({ plugins: [pluginA, pluginB] });

    const request = createRequest({
      url: 'https://answer-to-the-ultimate-question-of-life.com'
    });

    const response$ = httpExt.handle({
      request,
      handler: () =>
        of(
          createResponse({
            body: { answer: 42 }
          })
        )
    });
    const responseObserver = jest.fn();

    response$.subscribe(responseObserver);

    /*
     * Make sure plugin A is called with the right args.
     */
    expect(pluginA.handle).toHaveBeenCalledTimes(1);
    expect(typeof pluginA.handle.mock.calls[0][0].next).toBe('function');
    expect(pluginA.handle.mock.calls[0][0].request).toEqual(
      expect.objectContaining({
        url: 'https://answer-to-the-ultimate-question-of-life.com',
        method: 'GET'
      })
    );

    /*
     * Make sure plugin B is called with the right args.
     */
    expect(pluginB.handle).toHaveBeenCalledTimes(1);
    expect(typeof pluginB.handle.mock.calls[0][0].next).toBe('function');
    expect(pluginB.handle.mock.calls[0][0].request).toEqual(
      expect.objectContaining({
        url: 'https://answer-to-the-ultimate-question-of-life.com',
        method: 'GET'
      })
    );

    expect(responseObserver).toHaveBeenCalledTimes(1);
    expect(responseObserver).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          answer: 42
        }
      })
    );
  });

  it('should conditionally handle plugins', () => {
    const pluginA = createSpyPlugin(req =>
      req.url.startsWith('https://answer-to-the-ultimate-question-of-life.com/')
    );
    const pluginB = createSpyPlugin(req =>
      req.url.startsWith('https://something-else-that-do-not-match.com/')
    );
    const httpExt = new HttpExt({ plugins: [pluginA, pluginB] });
    const request = createRequest({
      url: 'https://answer-to-the-ultimate-question-of-life.com/'
    });

    const response$ = httpExt.handle({
      request,
      handler: () =>
        of(
          createResponse({
            body: { answer: 42 }
          })
        )
    });
    const responseObserver = jest.fn();

    response$.subscribe(responseObserver);

    /* The first plugin should match the condition and handle the request. */
    expect(pluginA.handle).toHaveBeenCalledTimes(1);

    /* The second plugin should not be called as it doesn't match the condition. */
    expect(pluginB.handle).not.toBeCalled();

    expect(responseObserver).toHaveBeenCalledTimes(1);
    expect(responseObserver).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          answer: 42
        }
      })
    );
  });

  it('should throw when a plugin condition returns an invalid value', () => {
    const plugin = createSpyPlugin(() => '' as any /* 👈🏻 invalid condition */);
    const httpExt = new HttpExt({ plugins: [plugin] });
    const request = createRequest({
      url: 'https://test.com/'
    });
    const response$ = httpExt.handle({
      request,
      handler: () => of(createResponse({ body: null }))
    });

    const errorObserver = jest.fn();

    response$.subscribe({ error: errorObserver });

    expect(errorObserver).toHaveBeenCalledTimes(1);
    expect(errorObserver).toHaveBeenCalledWith(
      `InvalidPluginConditionError: expecting boolean got string.`
    );
  });
});
