import { HttpExt } from './http-ext';
import { HttpExtInterceptor } from './http-ext.interceptor';
import { createRequest } from './request';
import { HttpRequest } from '@angular/common/http';

describe('HttpExtInterceptor', () => {
  it('should call handler', () => {
    const httpExt = new HttpExt({ plugins: [] });
    const interceptor = new HttpExtInterceptor({ httpExt });
    const ngRequest = new HttpRequest('GET', 'https://test.com');
    const next = {
      handle: jest.fn()
    };

    /* Making a passthrough mock `HttpExt`. */
    jest
      .spyOn(httpExt, 'handle')
      .mockImplementation(({ request, handler }) => handler({ request }));

    /* Go! */
    interceptor.intercept(ngRequest, next);

    /* Check that request is transformed from Angular HttpRequest to HttpExtRequest and forwarded to `httpExt`. */
    expect(httpExt.handle).toHaveBeenCalledTimes(1);
    expect(httpExt.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        request: createRequest({ url: 'https://test.com', method: 'GET' })
      })
    );

    /* Check that request is transformed from HttpExtRequest to Angular HttpRequest when forwarded to Angular. */
    expect(next.handle).toHaveBeenCalledTimes(1);

    const forwardedNgRequest = next.handle.mock.calls[0][0];
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

  it.todo(
    '🚧 should convert HttpResponse to HttpExtResponse before handing it to plugin'
  );

  it.todo('🚧 should convert plugin HttpExtResponse to HttpResponse');
});
