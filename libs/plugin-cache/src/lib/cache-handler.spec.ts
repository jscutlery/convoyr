import {
  ConvoyrRequest,
  ConvoyrResponse,
  createRequest,
  createResponse,
} from '@convoyr/core';
import { createPluginTester } from '@convoyr/core/testing';
import { ObserverSpy } from '@hirez_io/observer-spy';
import { advanceTo, clear } from 'jest-date-mock';
import { concat } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { WithCacheMetadata } from './cache-response';
import { createCachePlugin } from './create-cache-plugin';
import { MemoryStorage } from './storages/memory-storage';

function createMemoryStorageSpy() {
  const spyStorage = new MemoryStorage();
  spyStorage.get = jest.fn(spyStorage.get);
  spyStorage.set = jest.fn(spyStorage.set);
  spyStorage.delete = jest.fn(spyStorage.delete);

  return spyStorage;
}

describe('CachePlugin', () => {
  let request: ConvoyrRequest;
  let response: ConvoyrResponse;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
    response = createResponse({ body: { answer: 42 } });
  });

  afterEach(() => clear());

  it(
    'should serve cache with metadata when hydrated',
    marbles((m) => {
      const pluginTester = createPluginTester({
        plugin: createCachePlugin({
          addCacheMetadata: true,
          storage: new MemoryStorage(),
        }),
      });

      /* Mock date. */
      advanceTo(new Date('2019-01-01T00:00:00.000Z'));

      const response$ = m.cold('-r|', { r: response });
      const httpHandlerMock = pluginTester.createHttpHandlerMock({
        response: response$,
      });

      /* Run two requests with the same URL to fire cache response. */
      const responseA$ = pluginTester.handleFake({
        request,
        httpHandlerMock,
      });
      const responseB$ = pluginTester.handleFake({
        request,
        httpHandlerMock,
      });

      /* Execute requests in order. */
      const responses$ = concat(responseA$, responseB$);

      const networkResponse = createResponse({
        body: {
          data: { answer: 42 },
          cacheMetadata: {
            isFromCache: false,
          },
        } as WithCacheMetadata,
      });

      const cacheResponse = createResponse({
        body: {
          data: { answer: 42 },
          cacheMetadata: {
            createdAt: new Date('2019-01-01T00:00:00.000Z'),
            isFromCache: true,
          },
        } as WithCacheMetadata,
      });

      const values = { n: networkResponse, c: cacheResponse };

      /*                         👇 Second time cache is served first */
      const expected$ = m.cold('-ncn|', values);

      m.expect(responses$).toBeObservable(expected$);
    })
  );

  it('should not apply metadata to response body', () => {
    const pluginTester = createPluginTester({
      plugin: createCachePlugin({
        addCacheMetadata: false,
        storage: new MemoryStorage(),
      }),
    });

    const observerSpy = new ObserverSpy<ConvoyrResponse>();
    const httpHandlerMock = pluginTester.createHttpHandlerMock({ response });

    pluginTester
      .handleFake({ request, httpHandlerMock })
      .subscribe(observerSpy);

    expect(httpHandlerMock).toBeCalledTimes(1);
    expect(observerSpy.getLastValue()).toEqual(
      expect.objectContaining({ body: { answer: 42 } })
    );
  });

  it('should use given storage implementation to store cache', async () => {
    const storage = createMemoryStorageSpy() as any;
    const pluginTester = createPluginTester({
      plugin: createCachePlugin({
        addCacheMetadata: false,
        storage,
      }),
    });

    const httpHandlerMock = pluginTester.createHttpHandlerMock({ response });
    const handler$ = pluginTester.handleFake({ request, httpHandlerMock });

    advanceTo(new Date('2019-01-01T00:00:00.000Z'));

    await handler$.toPromise();

    const cacheKey = storage.set.mock.calls[0][0];
    const cachedData = storage.set.mock.calls[0][1];

    expect(storage.set).toBeCalledTimes(1);
    expect(cacheKey).toBe('{"u":"https://ultimate-answer.com"}');
    expect(JSON.parse(cachedData)).toEqual(
      expect.objectContaining({
        createdAt: '2019-01-01T00:00:00.000Z',
        response: expect.objectContaining({
          body: { answer: 42 },
        }),
      })
    );
  });

  it(
    'should handle query string in store key',
    marbles((m) => {
      const pluginTester = createPluginTester({
        plugin: createCachePlugin({
          addCacheMetadata: false,
          storage: new MemoryStorage(),
        }),
      });

      const requestA = createRequest({
        url: 'https://ultimate-answer.com',
        params: { q: 'a' },
      });
      const requestB = createRequest({
        url: 'https://ultimate-answer.com',
        params: { q: 'b' },
      });

      const responseA$ = m.cold('-n|', {
        n: createResponse({ body: { answer: 'A' } }),
      });
      const responseB$ = m.cold('-n|', {
        n: createResponse({ body: { answer: 'B' } }),
      });

      const httpHandlerMockA = pluginTester.createHttpHandlerMock({
        response: responseA$,
      });
      const httpHandlerMockB = pluginTester.createHttpHandlerMock({
        response: responseB$,
      });

      const response1$ = pluginTester.handleFake({
        request: requestA,
        httpHandlerMock: httpHandlerMockA,
      });
      const response2$ = pluginTester.handleFake({
        request: requestB,
        httpHandlerMock: httpHandlerMockB,
      });
      const response3$ = pluginTester.handleFake({
        request: requestA,
        httpHandlerMock: httpHandlerMockA,
      });

      const stream$ = concat(response1$, response2$, response3$);
      /*                           👇 Cache is fired here */
      const expected$ = m.cold('-a-baa|', {
        a: createResponse({ body: { answer: 'A' } }),
        b: createResponse({ body: { answer: 'B' } }),
      });
      m.expect(stream$).toBeObservable(expected$);
    })
  );
});
