import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/http-ext';
import { concat, of, throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { _addMetadata } from './add-cache-metadata';
import { cachePlugin as createCachePlugin } from './plugin-cache';
import { MemoryAdapter } from './store-adapters/memory-adapter';

const objectContaining = jasmine.objectContaining;

describe('CachePlugin', () => {
  let request: HttpExtRequest;
  let response: HttpExtResponse;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
    response = createResponse({ body: { answer: 42 } });
  });

  it(
    'should serve cache when hydrated',
    marbles(m => {
      const cachePlugin = createCachePlugin({ addCacheMetadata: true });
      const networkResponse = _addMetadata({ isFromCache: false })(response);
      const cacheResponse = _addMetadata({ isFromCache: true })(response);

      /* Simulate final handler */
      const next = () => m.cold('-r|', { r: response });

      /* Run two requests with the same URL to fire cache response */
      const requestA$ = cachePlugin.handle({ request, next }) as any;
      const requestB$ = cachePlugin.handle({ request, next }) as any;

      /* Execute requests in order */
      const responses$ = concat(requestA$, requestB$);

      const values = { n: networkResponse, c: cacheResponse };
      /*                         👇 Second time cache is served first */
      const expected$ = m.cold('-ncn|', values);

      m.expect(responses$).toBeObservable(expected$);
    })
  );

  it('should not apply metadata by default', () => {
    const cachePlugin = createCachePlugin();
    const next = () => of(response);

    const cacheResponse = cachePlugin.handle({ request, next }) as any;
    const spyObserver = jest.fn();

    cacheResponse.subscribe(spyObserver);

    expect(spyObserver).toBeCalledTimes(1);
    expect(spyObserver).toBeCalledWith(
      objectContaining({ body: { answer: 42 } })
    );
  });

  it('should use `MemoryCacheProvider` by default', () => {
    const cachePlugin = createCachePlugin();

    expect((cachePlugin as any)._storeAdapter).toBeDefined();
    expect((cachePlugin as any)._storeAdapter).toBeInstanceOf(MemoryAdapter);
  });

  it('should store the cache using given adapter', () => {
    const spyAdapter = { set: jest.fn() };
    const cachePlugin = createCachePlugin({
      storeAdapter: spyAdapter as any
    });
    const next = () => of(response);

    const handler = cachePlugin.handle({ request, next }) as any;
    handler.subscribe();

    const cacheKey = spyAdapter.set.mock.calls[0][0];
    const cachedResponse = spyAdapter.set.mock.calls[0][1];

    expect(spyAdapter.set).toBeCalledTimes(1);
    expect(cacheKey).toBe('https://ultimate-answer.com');
    expect(JSON.parse(cachedResponse)).toEqual(
      objectContaining({ body: { answer: 42 } })
    );
  });

  xit(
    'WIP: should use query params as store key',
    marbles(m => {
      const cachePlugin = createCachePlugin();
      const nextFn = jest.fn().mockImplementation(({ request: _request }) => {
        return {
          a: m.cold('-n|', { n: createResponse({ body: { answer: 'A' } }) }),
          b: m.cold('-n|', { n: createResponse({ body: { answer: 'B' } }) })
        }[_request.params.q];
      });

      const requestA = createRequest({
        url: 'https://ultimate-answer.com',
        params: { q: 'a' }
      });
      const requestB = createRequest({
        url: 'https://ultimate-answer.com',
        params: { q: 'b' }
      });

      const response1$ = cachePlugin.handle({
        request: requestA,
        next: nextFn
      }) as any;
      const response2$ = cachePlugin.handle({
        request: requestB,
        next: nextFn
      }) as any;
      const response3$ = cachePlugin.handle({
        request: requestA,
        next: nextFn
      }) as any;

      const stream$ = concat(response1$, response2$, response3$);

      const expected$ = m.cold('-a-baa|', {
        a: createResponse({ body: { answer: 'A' } }),
        b: createResponse({ body: { answer: 'B' } })
      });
      m.expect(stream$).toBeObservable(expected$);
    })
  );
});
