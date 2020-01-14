import { advanceTo } from 'jest-date-mock';
import { createRequest, createResponse } from '@http-ext/core';
import { marbles } from 'rxjs-marbles/jest';
import { of, from, concat, defer } from 'rxjs';

import { createAuthPlugin } from './create-auth-plugin';
import { delay, shareReplay } from 'rxjs/operators';

describe('AuthPlugin', () => {
  it('should add bearer token to each request', async () => {
    const token$ = of('TOKEN');
    const { handler } = createAuthPlugin({
      token: token$
    });

    const request = createRequest({ url: '/somewhere' });

    const next = jest
      .fn()
      .mockReturnValue(of(createResponse({ status: 200, statusText: 'Ok' })));

    await handler.handle({ request, next }).toPromise();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({
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
      const { handler } = createAuthPlugin({
        token: token$
      });

      const request = createRequest({ url: '/somewhere' });
      const response = createResponse({ status: 200, statusText: 'Ok' });
      const response$ = m.cold('r|', { r: response });
      const next = jest.fn().mockReturnValue(response$);

      const source$ = concat(wait$, handler.handle({ request, next }));

      m.expect(token$).toBeObservable('         x-a-b-c', tokens);
      m.expect(source$).toBeObservable('        -----b|', { b: response });
      m.expect(response$).toHaveSubscriptions(['-----^!']);
      m.flush();

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith({
        request: expect.objectContaining({
          headers: {
            Authorization: 'Bearer TOKEN_B'
          }
        })
      });
    })
  );

  it.todo('🚧 should call onUnauthorized callback on 401 response');
});
