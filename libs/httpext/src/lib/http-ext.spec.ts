import { create } from 'domain';
import { of } from 'rxjs';

import { HttpExt } from './http-ext';
import { createRequest, Request } from './request';
import { createResponse } from './response';

/* A plugin handle that just calls through the next plugin.*/
export function createSpyPlugin(
  condition: (request: Request) => boolean = (request: Request) => true
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
            data: { answer: 42 }
          })
        )
    });

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

    const responseObserver = jest.fn();

    response$.subscribe(responseObserver);

    expect(responseObserver).toHaveBeenCalledTimes(1);
    expect(responseObserver).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          answer: 42
        }
      })
    );
  });

  it('should conditionally handle plugins', done => {
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

    const response = httpExt.handle({
      request,
      handler: () =>
        of(
          createResponse({
            data: { answer: 42 }
          })
        )
    });

    /* The first plugin should match the condition and handle the request */
    expect(pluginA.condition.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com/',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });
    expect(pluginA.condition.mock.results[0].value).toBeTruthy();
    expect(pluginA.handle.mock.calls.length).toBe(1);
    expect(pluginA.handle.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com/',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });

    /* The second plugin shouldn't match the condition and never handle */
    expect(pluginB.condition.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com/',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });
    expect(pluginB.condition.mock.results[0].value).toBeFalsy();
    expect(pluginB.handle.mock.calls.length).toBe(0);

    response.subscribe(resp => {
      expect(resp).toEqual({
        data: { answer: 42 },
        status: 200,
        statusText: 'OK',
        headers: {}
      });
      done();
    });
  });
});
