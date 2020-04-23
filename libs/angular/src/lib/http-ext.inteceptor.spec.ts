import {
  HttpHandler,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
} from '@angular/common/http';
import { createRequest, createResponse, Convoy } from '@convoy/core';
import { EMPTY, of } from 'rxjs';

import { HttpExtInterceptor } from './convoy.interceptor';

function asMock<TReturn, TArgs extends any[]>(
  value: (...TArgs) => TReturn
): jest.Mock<TReturn, TArgs> {
  return value as jest.Mock<TReturn, TArgs>;
}

describe('HttpExtInterceptor', () => {
  let httpExt: Convoy;
  let interceptor: HttpExtInterceptor;
  let next: HttpHandler;

  beforeEach(() => {
    interceptor = new HttpExtInterceptor({ plugins: [] });

    httpExt = interceptor['_httpExt'];

    /* Mock `Convoy.handle`. */
    jest.spyOn(httpExt, 'handle');

    next = {
      /* Just to avoid pipe error. */
      handle: jest.fn().mockReturnValue(EMPTY),
    };
  });

  /* Create an Angular HttpRequest and hand it to interceptor. */
  beforeEach(() => {
    const ngRequest = new HttpRequest('GET', 'https://test.com');

    /* Go! */
    interceptor.intercept(ngRequest, next);
  });

  it('should convert Angular HttpRequest to HttpExtRequest before handing it to plugins', () => {
    /* Check that request is transformed from Angular HttpRequest to HttpExtRequest and forwarded to `httpExt`. */
    expect(httpExt.handle).toHaveBeenCalledTimes(1);
    expect(httpExt.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        request: createRequest({ url: 'https://test.com', method: 'GET' }),
      })
    );
  });

  it('should convert HttpExtRequest to Angular HttpRequest after plugins transformations', () => {
    /* Check that request is transformed from HttpExtRequest to Angular HttpRequest when forwarded to Angular. */
    expect(next.handle).toHaveBeenCalledTimes(1);

    const forwardedNgRequest = asMock(next.handle).mock.calls[0][0];

    expect(forwardedNgRequest).toBeInstanceOf(HttpRequest);
    expect(forwardedNgRequest).toEqual(
      expect.objectContaining({
        method: 'GET',
        url: 'https://test.com',
      })
    );
  });

  it('should ignore HttpEvents except HttpResponse', () => {
    const httpSentEvent: HttpSentEvent = { type: 0 };
    const httpProgressEvent: HttpProgressEvent = {
      type: 3,
      loaded: 1,
      total: 0,
    };
    asMock(next.handle).mockReturnValue(
      of(
        httpSentEvent /* 👈🏻 Simulate some of Angular HttpEvents. */,
        httpProgressEvent,
        new HttpResponse({ body: { answer: 42 } })
      )
    );
    const { request, httpHandler } = asMock(httpExt.handle).mock.calls[0][0];
    const observer = jest.fn();

    httpHandler({ request }).subscribe(observer);

    /* Verify that Angular extra events are ignored in the final handler. */
    expect(observer).toHaveBeenCalledTimes(1);
    const response = observer.mock.calls[0][0];
    expect(response).toEqual(createResponse({ body: { answer: 42 } }));
  });

  it('should convert Angular HttpResponse to HttpExtResponse before handling it back to plugins', () => {
    asMock(next.handle).mockReturnValue(
      of(new HttpResponse({ body: { answer: 42 } }))
    );
    const { request, httpHandler } = asMock(httpExt.handle).mock.calls[0][0];
    const observer = jest.fn();

    httpHandler({ request }).subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);
    const response = observer.mock.calls[0][0];

    /* 😜 Just making sure that it's not an Angular HttpResponse. */
    expect(response).not.toBeInstanceOf(HttpResponse);
    expect(response).toEqual(
      createResponse({
        status: 200,
        statusText: 'OK',
        body: {
          answer: 42,
        },
      })
    );
  });

  it('should convert plugin HttpExtResponse to Angular HttpResponse', () => {
    asMock(next.handle).mockReturnValue(
      of(new HttpResponse({ body: { answer: 42 } }))
    );
    const request = new HttpRequest('GET', 'https://test.com');
    const observer = jest.fn();

    interceptor.intercept(request, next).subscribe(observer);

    const response = observer.mock.calls[0][0];

    /* Check there is no raw HttpExtResponse given to the interceptor. */
    expect(response).toBeInstanceOf(HttpResponse);
    expect(response).toEqual(expect.objectContaining({ body: { answer: 42 } }));
  });
});
