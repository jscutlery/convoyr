import { createRequest, createResponse } from '@convoyr/core';
import { createPluginTester } from '@convoyr/core/testing';
import { concat, of, throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { shareReplay } from 'rxjs/operators';
import { AuthHandler } from './auth-handler';

describe('AuthPlugin', () => {
  it.each([null, undefined])(
    'should not add bearer token if token is %s',
    async (token: string) => {
      const token$ = of(token);

      const pluginTester = createPluginTester({
        handler: new AuthHandler({ token: token$ }),
      });

      const request = createRequest({ url: '/somewhere' });
      const httpHandlerMock = pluginTester.mockHttpHandler();

      await pluginTester
        .handleFake({
          request,
          httpHandlerMock,
        })
        .toPromise();

      expect(httpHandlerMock).toHaveBeenCalledTimes(1);
      expect(httpHandlerMock).toHaveBeenCalledWith({
        request: expect.objectContaining({
          url: '/somewhere',
          headers: {},
        }),
      });
    }
  );

  it('should add bearer token to each request', async () => {
    /* Providing an observable with a replay buffer containing an old token
     * Let's make sure we are using the latest available token. */
    const token$ = of('OLD_TOKEN', 'TOKEN');

    const pluginTester = createPluginTester({
      handler: new AuthHandler({ token: token$ }),
    });

    const request = createRequest({ url: '/somewhere' });
    const httpHandlerMock = pluginTester.mockHttpHandler();

    await pluginTester.handleFake({ request, httpHandlerMock }).toPromise();

    expect(httpHandlerMock).toHaveBeenCalledTimes(1);
    expect(httpHandlerMock).toHaveBeenCalledWith({
      request: expect.objectContaining({
        url: '/somewhere',
        headers: {
          Authorization: 'Bearer TOKEN',
        },
      }),
    });
  });

  it(
    'should grab the last token value only and run request once',
    marbles((m) => {
      const wait$ = m.cold('-----|');
      const tokens = {
        x: null,
        a: 'TOKEN_A',
        b: 'TOKEN_B',
        c: 'TOKEN_C',
      };
      /* Simulate state management with shareReplay. */
      const token$ = m
        .hot('x-a-b-c', tokens)
        .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

      const pluginTester = createPluginTester({
        handler: new AuthHandler({ token: token$ }),
      });

      const request = createRequest({ url: '/somewhere' });
      const response = createResponse({ status: 200, statusText: 'Ok' });
      const response$ = m.cold('r|', { r: response });
      const httpHandlerMock = pluginTester.mockHttpHandler({
        response: response$,
      });

      const source$ = concat(
        wait$,
        pluginTester.handleFake({ request, httpHandlerMock })
      );

      m.expect(token$).toBeObservable('         x-a-b-c', tokens);
      m.expect(source$).toBeObservable('        -----b|', { b: response });
      m.expect(response$).toHaveSubscriptions(['-----^!']);
      m.flush();

      expect(httpHandlerMock).toHaveBeenCalledTimes(1);
      expect(httpHandlerMock).toHaveBeenCalledWith({
        request: expect.objectContaining({
          headers: {
            Authorization: 'Bearer TOKEN_B',
          },
        }),
      });
    })
  );

  // it('should call onUnauthorized callback on 401 response', async () => {
  //   const token$ = of('TOKEN');
  //   const onUnauthorizedSpy = jest.fn();

  //   const pluginTester = createPluginTester({
  //     handler: new AuthHandler({
  //       token: token$,
  //       onUnauthorized: onUnauthorizedSpy,
  //     }),
  //   });

  //   const request = createRequest({ url: '/somewhere' });
  //   const unauthorizedResponse = createResponse({
  //     status: 401,
  //     statusText: 'Unauthorized',
  //   });

  //   const observer = {
  //     next: jest.fn(),
  //     error: jest.fn(),
  //   };

  //   pluginTester
  //     .handle({ request, response: throwError(unauthorizedResponse) })
  //     .subscribe(observer);

  //   expect(observer.next).not.toHaveBeenCalled();
  //   expect(observer.error).toHaveBeenCalledTimes(1);
  //   expect(observer.error).toHaveBeenCalledWith(unauthorizedResponse);
  //   expect(onUnauthorizedSpy).toBeCalledWith(
  //     expect.objectContaining(unauthorizedResponse)
  //   );
  // });
});
