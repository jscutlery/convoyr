import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse,
  PluginHandler
} from '@http-ext/core';
import { concat, Observable, of } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { shareReplay } from 'rxjs/operators';

import { AuthHandler } from './auth-handler';

export function createPluginTester({ handler }: { handler: PluginHandler }) {
  const next = jest
    .fn()
    .mockReturnValue(of(createResponse({ status: 200, statusText: 'Ok' })));
  return {
    next,
    handle({ request }: { request: HttpExtRequest }) {
      return handler.handle({ request, next }) as Observable<HttpExtResponse>;
    }
  };
}

describe('AuthPlugin', () => {
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

  xit('should call onUnauthorized callback on 401 response', () => {
    const token$ = of('TOKEN');
    const onUnauthorizedSpy = jest.fn();

    const pluginTester = createPluginTester({
      handler: new AuthHandler({
        token: token$,
        onUnauthorized: onUnauthorizedSpy
      } as any)
    });

    const response = createResponse({
      status: 401,
      statusText: 'Unauthorized'
    });
    const response$ = of(response);

    pluginTester.next.mockReturnValue(response$);

    expect(onUnauthorizedSpy).toBeCalledWith(
      expect.objectContaining({ response })
    );
  });
});
