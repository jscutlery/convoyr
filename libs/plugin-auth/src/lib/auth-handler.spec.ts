import { createRequest, createResponse } from '@http-ext/core';
import { createPluginTester } from '@http-ext/core/testing';
import { concat, from, of, throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { shareReplay } from 'rxjs/operators';

import { AuthHandler } from './auth-handler';

describe('AuthPlugin', () => {
  it.each([null, undefined])(
    'should not add bearer token if token is %s',
    async (token: string) => {
      const token$ = of(token);

      const pluginTester = createPluginTester({
        handler: new AuthHandler({ token: token$ })
      });

      const request = createRequest({ url: '/somewhere' });

      await pluginTester.handle({ request }).toPromise();

      expect(pluginTester.next).toHaveBeenCalledTimes(1);
      expect(pluginTester.next).toHaveBeenCalledWith({
        request: expect.objectContaining({
          url: '/somewhere',
          headers: {}
        })
      });
    }
  );

  it('should add bearer token to each request', async () => {
    const token$ = of('TOKEN');

    const pluginTester = createPluginTester({
      handler: new AuthHandler({ token: token$ })
    });

    const request = createRequest({ url: '/somewhere' });

    await pluginTester.handle({ request }).toPromise();

    expect(pluginTester.next).toHaveBeenCalledTimes(1);
    expect(pluginTester.next).toHaveBeenCalledWith({
      request: expect.objectContaining({
        url: '/somewhere',
        headers: {
          Authorization: 'Bearer TOKEN'
        }
      })
    });
  });

  it(
    'should grab the last token value only and run request once',
    marbles(m => {
      const wait$ = m.cold('-----|');
      const tokens = {
        x: null,
        a: 'TOKEN_A',
        b: 'TOKEN_B',
        c: 'TOKEN_C'
      };
      /* Simulate state management with shareReplay. */
      const token$ = m
        .hot('x-a-b-c', tokens)
        .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

      const pluginTester = createPluginTester({
        handler: new AuthHandler({ token: token$ })
      });

      const request = createRequest({ url: '/somewhere' });
      const response = createResponse({ status: 200, statusText: 'Ok' });
      const response$ = m.cold('r|', { r: response });

      pluginTester.next.mockReturnValue(response$);

      const source$ = concat(wait$, pluginTester.handle({ request }));

      m.expect(token$).toBeObservable('         x-a-b-c', tokens);
      m.expect(source$).toBeObservable('        -----b|', { b: response });
      m.expect(response$).toHaveSubscriptions(['-----^!']);
      m.flush();

      expect(pluginTester.next).toHaveBeenCalledTimes(1);
      expect(pluginTester.next).toHaveBeenCalledWith({
        request: expect.objectContaining({
          headers: {
            Authorization: 'Bearer TOKEN_B'
          }
        })
      });
    })
  );

  it('should call onUnauthorized callback on 401 response', async () => {
    const token$ = of('TOKEN');
    const onUnauthorizedSpy = jest.fn();

    const pluginTester = createPluginTester({
      handler: new AuthHandler({
        token: token$,
        onUnauthorized: onUnauthorizedSpy
      })
    });

    const request = createRequest({ url: '/somewhere' });
    const unauthorizedResponse = createResponse({
      status: 401,
      statusText: 'Unauthorized'
    });

    pluginTester.next.mockReturnValue(throwError(unauthorizedResponse));

    const observer = {
      next: jest.fn(),
      error: jest.fn()
    };
    pluginTester.handle({ request }).subscribe(observer);

    expect(observer.next).not.toHaveBeenCalled();
    expect(observer.error).toHaveBeenCalledTimes(1);
    expect(observer.error).toHaveBeenCalledWith(unauthorizedResponse);
    expect(onUnauthorizedSpy).toBeCalledWith(
      expect.objectContaining(unauthorizedResponse)
    );
  });
});
