import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, EMPTY } from 'rxjs';

import { HttpExt } from './http-ext';
import { HttpExtInterceptor } from './http-ext.interceptor';
import { createRequest } from './request';
import { createResponse } from './response';

function asMock<TReturn, TArgs extends any[]>(
  value: (...TArgs) => TReturn
): jest.Mock<TReturn, TArgs> {
  return value as jest.Mock<TReturn, TArgs>;
}

describe('HttpExtInterceptor', () => {
  let httpExt: HttpExt;
  let interceptor: HttpExtInterceptor;
  let next: HttpHandler;

  beforeEach(() => {
    httpExt = new HttpExt({ plugins: [] });

    /* Mock `HttpExt.handle`. */
    jest.spyOn(httpExt, 'handle');

    interceptor = new HttpExtInterceptor({ httpExt });
    next = {
      /* Just to avoid pipe error */
      handle: jest.fn().mockReturnValue(EMPTY)
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
        request: createRequest({ url: 'https://test.com', method: 'GET' })
      })
    );
  });

  it('should convert HttpExtRequest to Angular HttpRequest after plugins transformations', () => {
    /* Check that request is transformed from HttpExtRequest to Angular HttpRequest when forwarded to Angular. */
    expect(next.handle).toHaveBeenCalledTimes(1);

    const forwardedNgRequest = (next.handle as jest.Mock).mock.calls[0][0];
    forwardedNgRequest.headers.get('test');

    expect(forwardedNgRequest).toBeInstanceOf(HttpRequest);
    expect(forwardedNgRequest).toEqual(
      expect.objectContaining({
        method: 'GET',
        url: 'https://test.com'
      })
    );
  });

  it.todo('🚧 should ignore HttpEvents except HttpResponse');

  it('should convert Angular HttpResponse to HttpExtResponse before handing it back to plugins', () => {
    asMock(next.handle).mockReturnValue(
      of(
        new HttpResponse({
          body: {
            answer: 42
          }
        })
      )
    );
    const { request, handler } = asMock(httpExt.handle).mock.calls[0][0];

    const observer = jest.fn();

    handler({ request }).subscribe(observer);

    expect(observer).toHaveBeenCalledTimes(1);
    const response = observer.mock.calls[0][0];

    /* 😜 just making sure that it's not an Angular HttpResponse. */
    expect(response).not.toBeInstanceOf(HttpResponse);
    expect(response).toEqual(
      createResponse({
        status: 200,
        statusText: 'OK',
        data: {
          answer: 42
        }
      })
    );
  });

  it.todo('🚧 should convert plugin HttpExtResponse to Angular HttpResponse');
});
