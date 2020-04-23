import {
  HttpHandler,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
} from '@angular/common/http';
import { createRequest, createResponse, Convoyr } from '@convoyr/core';
import { EMPTY, of } from 'rxjs';

import { ConvoyrInterceptor } from './convoyr.interceptor';

function asMock<TReturn, TArgs extends any[]>(
  value: (...TArgs) => TReturn
): jest.Mock<TReturn, TArgs> {
  return value as jest.Mock<TReturn, TArgs>;
}

describe('ConvoyrInterceptor', () => {
  let convoyr: Convoyr;
  let interceptor: ConvoyrInterceptor;
  let next: HttpHandler;

  beforeEach(() => {
    interceptor = new ConvoyrInterceptor({ plugins: [] });

    convoyr = interceptor['_convoy'];

    /* Mock `Convoyr.handle`. */
    jest.spyOn(convoyr, 'handle');

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

  it('should convert Angular HttpRequest to ConvoyRequest before handing it to plugins', () => {
    /* Check that request is transformed from Angular HttpRequest to ConvoyRequest and forwarded to `convoyr`. */
    expect(convoyr.handle).toHaveBeenCalledTimes(1);
    expect(convoyr.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        request: createRequest({ url: 'https://test.com', method: 'GET' }),
      })
    );
  });

  it('should convert ConvoyRequest to Angular HttpRequest after plugins transformations', () => {
    /* Check that request is transformed from ConvoyRequest to Angular HttpRequest when forwarded to Angular. */
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
    const { request, httpHandler } = asMock(convoyr.handle).mock.calls[0][0];
    const observer = jest.fn();

    httpHandler({ request }).subscribe(observer);

    /* Verify that Angular extra events are ignored in the final handler. */
    expect(observer).toHaveBeenCalledTimes(1);
    const response = observer.mock.calls[0][0];
    expect(response).toEqual(createResponse({ body: { answer: 42 } }));
  });

  it('should convert Angular HttpResponse to ConvoyrResponse before handling it back to plugins', () => {
    asMock(next.handle).mockReturnValue(
      of(new HttpResponse({ body: { answer: 42 } }))
    );
    const { request, httpHandler } = asMock(convoyr.handle).mock.calls[0][0];
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

  it('should convert plugin ConvoyrResponse to Angular HttpResponse', () => {
    asMock(next.handle).mockReturnValue(
      of(new HttpResponse({ body: { answer: 42 } }))
    );
    const request = new HttpRequest('GET', 'https://test.com');
    const observer = jest.fn();

    interceptor.intercept(request, next).subscribe(observer);

    const response = observer.mock.calls[0][0];

    /* Check there is no raw ConvoyrResponse given to the interceptor. */
    expect(response).toBeInstanceOf(HttpResponse);
    expect(response).toEqual(expect.objectContaining({ body: { answer: 42 } }));
  });
});
