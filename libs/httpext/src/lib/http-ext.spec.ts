import { of } from 'rxjs';

import { Request, Response } from './http';
import { HttpExt } from './http-ext';

describe('HttpExt', () => {
  function createSpyPlugin() {
    return {
      handle: jest.fn(({ request, next }) => next({ request }))
    };
  }

  const httpResponse: Response = {
    data: { answer: 42 },
    status: 200,
    statusText: 'ok',
    headers: {}
  };

  const httpRequest: Request = {
    url: 'https://answer-to-the-ultimate-question-of-life.com',
    method: 'GET',
    body: null,
    headers: {},
    params: {}
  };

  it('should handle multiple plugins', done => {
    const pluginA = createSpyPlugin();
    const mockHandleA = pluginA.handle;
    const pluginB = createSpyPlugin();
    const mockHandleB = pluginB.handle;
    const httpExt = new HttpExt({ plugins: [pluginA, pluginB] });
    const handler = (req: Request) => of(httpResponse);

    const response = httpExt.handle({ request: httpRequest, handler });

    expect(mockHandleA.mock.calls.length).toBe(1);
    expect(typeof mockHandleA.mock.calls[0][0].next).toBe('function');
    expect(mockHandleA.mock.calls[0][0].request).toEqual({
      url: 'https://answer-to-the-ultimate-question-of-life.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });
    expect(mockHandleA.mock.calls.length).toBe(1);
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
});
