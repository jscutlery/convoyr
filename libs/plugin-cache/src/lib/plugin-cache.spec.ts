import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/core';
import { concat, of } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { refineMetadata } from './apply-metadata';
import { cachePlugin as createCachePlugin } from './plugin-cache';
import { MemoryAdapter } from './store-adapters/memory-adapter';
import { LocalStorageAdapter } from './store-adapters/local-storage-adapter';

describe('CachePlugin', () => {
  let request: HttpExtRequest;
  let response: HttpExtResponse;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
    response = createResponse({ body: { answer: 42 } });
  });

  it(
    'should serve cache with metadata when hydrated',
    marbles(m => {
      const cachePlugin = createCachePlugin({
        addCacheMetadata: true
      });

      /* @todo find a sexier way to test metadata */
      const networkResponse = refineMetadata({ response });
      const cacheResponse = refineMetadata({
        response,
        cacheMetadata: {
          createdAt: '2019-11-13T12:39:51.972Z'
        }
      });
      spyOn(Date.prototype, 'toISOString').and.returnValue(
        '2019-11-13T12:39:51.972Z'
      );

      /* Simulate final handler */
      const next = () => m.cold('-r|', { r: response });

      /* Run two requests with the same URL to fire cache response */
      const requestA$ = cachePlugin.handler.handle({ request, next }) as any;
      const requestB$ = cachePlugin.handler.handle({ request, next }) as any;

      /* Execute requests in order */
      const responses$ = concat(requestA$, requestB$);

      const values = { n: networkResponse, c: cacheResponse };
      /*                         👇 Second time cache is served first */
      const expected$ = m.cold('-n-n|', values);

      m.expect(responses$).toBeObservable(expected$);
    })
  );

  it('should not apply metadata to response by default', () => {
    const cachePlugin = createCachePlugin();
    const next = () => of(response);

    const cacheResponse = cachePlugin.handler.handle({ request, next }) as any;
    const spyObserver = jest.fn();

    cacheResponse.subscribe(spyObserver);

    expect(spyObserver).toBeCalledTimes(1);
    expect(spyObserver).toBeCalledWith(
      expect.objectContaining({ body: { answer: 42 } })
    );
  });

  it('should use `MemoryAdapter` storage by default', () => {
    const cachePlugin = createCachePlugin();

    expect((cachePlugin as any).handler._storage).toBeDefined();
    expect((cachePlugin as any).handler._storage).toBeInstanceOf(MemoryAdapter);
  });

  it('should use given request condition', () => {
    const spyCondition = jest.fn().mockReturnValue(true);
    const cachePlugin = createCachePlugin({ condition: spyCondition });

    cachePlugin.condition({ request });

    expect(spyCondition).toHaveBeenCalledWith({ request });
  });

  it('should cache only GET requests by default', () => {
    const cachePlugin = createCachePlugin();
    const getRequest = { ...request, method: 'GET' as any };
    const postRequest = { ...request, method: 'POST' as any };
    const putRequest = { ...request, method: 'PUT' as any };
    const patchRequest = { ...request, method: 'PATCH' as any };
    const deleteRequest = { ...request, method: 'DELETE' as any };

    expect(cachePlugin.condition({ request: getRequest })).toBe(true);
    expect(cachePlugin.condition({ request: postRequest })).toBe(false);
    expect(cachePlugin.condition({ request: putRequest })).toBe(false);
    expect(cachePlugin.condition({ request: patchRequest })).toBe(false);
    expect(cachePlugin.condition({ request: deleteRequest })).toBe(false);
  });

  it('should use given storage implementation to store cache', () => {
    const spyStorage = { set: jest.fn() };
    const cachePlugin = createCachePlugin({
      storage: spyStorage as any
    });
    const next = () => of(response);

    const handler = cachePlugin.handler.handle({ request, next }) as any;
    handler.subscribe();

    const cacheKey = spyStorage.set.mock.calls[0][0];
    const cachedData = spyStorage.set.mock.calls[0][1];

    expect(spyStorage.set).toBeCalledTimes(1);
    expect(cacheKey).toBe('https://ultimate-answer.com');
    expect(JSON.parse(cachedData)).toEqual(
      expect.objectContaining({
        cacheMetadata: {
          createdAt: expect.any(String)
        },
        response: expect.objectContaining({
          body: { answer: 42 }
        })
      })
    );
  });

  it(
    'should handle query string in store key',
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

      const response1$ = cachePlugin.handler.handle({
        request: requestA,
        next: nextFn
      }) as any;
      const response2$ = cachePlugin.handler.handle({
        request: requestB,
        next: nextFn
      }) as any;
      const response3$ = cachePlugin.handler.handle({
        request: requestA,
        next: nextFn
      }) as any;

      const stream$ = concat(response1$, response2$, response3$);
      /*                           👇 Cache is fired here */
      const expected$ = m.cold('-a-baa|', {
        a: createResponse({ body: { answer: 'A' } }),
        b: createResponse({ body: { answer: 'B' } })
      });
      m.expect(stream$).toBeObservable(expected$);
    })
  );
});
