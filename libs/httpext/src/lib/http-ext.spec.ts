import { of, Observable } from 'rxjs';

import { Request, Response } from './http';
import { HttpExt } from './http-ext';

describe('HttpExt', () => {
  let handler: (request: Request<any>) => Observable<Response<any>>;

  function createSpyPlugin(
    condition: (request: Request) => boolean = (request: Request) => true
  ) {
    return {
      condition: jest.fn(({ request }) => condition(request)),
      handle: jest.fn(({ request, next }) => next({ request }))
    };
  }

  beforeEach(() => {
    handler = request =>
      of({
        data: { answer: 42 },
        status: 200,
        statusText: 'ok',
        headers: {}
      });
  });

  it('should handle multiple plugins', done => {
    const pluginA = createSpyPlugin();
    const mockHandleA = pluginA.handle;
    const pluginB = createSpyPlugin();
    const mockHandleB = pluginB.handle;
    const httpExt = new HttpExt({ plugins: [pluginA, pluginB] });
    const request: Request = {
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    };

    const response = httpExt.handle({ request, handler });

    expect(mockHandleA.mock.calls.length).toBe(1);
    expect(typeof mockHandleA.mock.calls[0][0].next).toBe('function');
    expect(mockHandleA.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });
    expect(mockHandleB.mock.calls.length).toBe(1);
    expect(typeof mockHandleB.mock.calls[0][0].next).toBe('function');
    expect(mockHandleB.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });

    response.subscribe(resp => {
      expect(resp).toEqual({
        data: { answer: 42 },
        status: 200,
        statusText: 'ok',
        headers: {}
      });
      done();
    });
  });

  it('should conditionally handle plugins', done => {
    const pluginA = createSpyPlugin(req =>
      req.url.includes('the-ultimate-question-of-life')
    );
    const pluginB = createSpyPlugin(req =>
      req.url.includes('something-else-that-do-not-match')
    );
    const httpExt = new HttpExt({ plugins: [pluginA, pluginB] });
    const request: Request = {
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    };

    const response = httpExt.handle({ request, handler });

    expect(pluginA.condition.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });
    expect(pluginA.condition.mock.results[0].value).toBeTruthy();
    expect(pluginA.handle.mock.calls.length).toBe(1);
    expect(pluginA.handle.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });

    expect(pluginB.condition.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
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
        statusText: 'ok',
        headers: {}
      });
      done();
    });
  });
});
