import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/http-ext';
import { concat, of } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { _addMetadata } from './add-cache-metadata';
import { cachePlugin as createCachePlugin } from './plugin-cache';
import { MemoryCacheProvider } from './providers/memory-provider';

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

    expect((cachePlugin as any)._cacheProvider).toBeDefined();
    expect((cachePlugin as any)._cacheProvider).toBeInstanceOf(
      MemoryCacheProvider
    );
  });

  it('should store the cache using given provider', () => {
    const spyProvider = { set: jest.fn() };
    const cachePlugin = createCachePlugin({
      cacheProvider: spyProvider as any
    });
    const next = () => of(response);

    const handler = cachePlugin.handle({ request, next }) as any;
    handler.subscribe();

    const cacheKey = spyProvider.set.mock.calls[0][0];
    const cachedResponse = JSON.parse(spyProvider.set.mock.calls[0][1]);

    expect(spyProvider.set).toBeCalledTimes(1);
    expect(cacheKey).toBe('https://ultimate-answer.com');
    expect(cachedResponse).toEqual(objectContaining({ body: { answer: 42 } }));
  });
});
