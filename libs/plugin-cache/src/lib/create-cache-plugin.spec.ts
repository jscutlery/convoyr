import {
  createRequest,
  createResponse,
  HttpExtRequest,
  HttpExtResponse
} from '@http-ext/core';
import { StorageAdapter } from '@http-ext/plugin-cache';
import { advanceTo, clear as clearDate } from 'jest-date-mock';
import { concat, EMPTY, of } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { delay, finalize } from 'rxjs/operators';

import { refineMetadata } from './apply-metadata';
import { createCachePlugin } from './create-cache-plugin';
import { MemoryAdapter } from './store-adapters/memory-adapter';

describe('CachePlugin', () => {
  let request: HttpExtRequest;
  let response: HttpExtResponse;

  beforeEach(() => {
    request = createRequest({ url: 'https://ultimate-answer.com' });
    response = createResponse({ body: { answer: 42 } });
  });

  afterEach(() => clearDate());

  it(
    'should serve cache with metadata when hydrated',
    marbles(m => {
      const cachePlugin = createCachePlugin({ addCacheMetadata: true });
      const handler = cachePlugin.handler;
      const networkResponse = refineMetadata({ response });
      const cacheResponse = refineMetadata({
        response,
        cacheMetadata: {
          createdAt: '2019-01-01T00:00:00.000Z'
        }
      });
      /* Force `_createCacheDate` to match given metadata */
      advanceTo(new Date('2019-01-01T00:00:00.000Z'));

      /* Simulate final handler */
      const next = () => m.cold('-r|', { r: response });

      /* Run two requests with the same URL to fire cache response */
      const requestA$ = handler.handle({ request, next });
      const requestB$ = handler.handle({ request, next });

      /* Execute requests in order */
      const responses$ = concat(requestA$, requestB$);

      const values = { n: networkResponse, c: cacheResponse };
      /*                         👇 Second time cache is served first */
      const expected$ = m.cold('-ncn|', values);

      m.expect(responses$).toBeObservable(expected$);
    })
  );

  it('should not apply metadata to response by default', () => {
    const cachePlugin = createCachePlugin();
    const cacheResponse = cachePlugin.handler.handle({
      request,
      next: () => of(response)
    });
    const spyObserver = jest.fn();

    cacheResponse.subscribe(spyObserver);

    expect(spyObserver).toBeCalledTimes(1);
    expect(spyObserver).toBeCalledWith(
      expect.objectContaining({ body: { answer: 42 } })
    );
  });

  it('should use `MemoryAdapter` storage by default', () => {
    const cachePlugin = createCachePlugin();

    expect(cachePlugin.handler['_storage']).toBeDefined();
    expect(cachePlugin.handler['_storage']).toBeInstanceOf(MemoryAdapter);
  });

  it('should use given request condition', () => {
    const spyCondition = jest.fn().mockReturnValue(true);
    const cachePlugin = createCachePlugin({ condition: spyCondition });

    cachePlugin.condition({ request });

    expect(spyCondition).toHaveBeenCalledWith({ request });
  });

  it('should cache only GET requests by default', () => {
    const cachePlugin = createCachePlugin();
    const getRequest: HttpExtRequest = { ...request, method: 'GET' };
    const postRequest: HttpExtRequest = { ...request, method: 'POST' };
    const putRequest: HttpExtRequest = { ...request, method: 'PUT' };
    const patchRequest: HttpExtRequest = { ...request, method: 'PATCH' };
    const deleteRequest: HttpExtRequest = { ...request, method: 'DELETE' };

    expect(cachePlugin.condition({ request: getRequest })).toBe(true);
    expect(cachePlugin.condition({ request: postRequest })).toBe(false);
    expect(cachePlugin.condition({ request: putRequest })).toBe(false);
    expect(cachePlugin.condition({ request: patchRequest })).toBe(false);
    expect(cachePlugin.condition({ request: deleteRequest })).toBe(false);
  });

  it('should use given storage implementation to store cache', async () => {
    const spyStorage = {
      get: jest.fn().mockReturnValue(EMPTY),
      set: jest.fn(),
      delete: jest.fn()
    };
    const cachePlugin = createCachePlugin({
      storage: spyStorage as StorageAdapter
    });
    const next = () => of(response);

    const handler$ = cachePlugin.handler.handle({ request, next });
    await handler$.toPromise();

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
    'should unset cache when ttl expired',
    marbles(m => {
      const spyStorage = new MemoryAdapter();
      spyStorage.get = jest.fn(spyStorage.get);
      spyStorage.set = jest.fn(spyStorage.set);
      spyStorage.delete = jest.fn(spyStorage.delete);

      const cachePlugin = createCachePlugin({
        addCacheMetadata: false,
        maxAge: '1h'
      });
      const handler = cachePlugin.handler;

      /* Fake date based on marbles test scheduler. */
      const realDate = Date;
      global.Date = jest.fn(() => new realDate(m.scheduler.now())) as any;

      const next = () => m.cold('-r|', { r: response });

      const requestA$ = handler.handle({ request, next });
      const requestB$ = handler.handle({ request, next });

      /* Wait an hour between the two calls. */
      const responses$ = concat(
        requestA$,
        EMPTY.pipe(delay(3600 * 1000)),
        requestB$
      );

      /* No response from cache as it expired...
       *                                👇 */
      const expected$ = m.cold('-r 3600s -r|', { r: response });

      m.expect(responses$).toBeObservable(expected$);
    })
  );

  it('should throw if ttl is invalid', () => {
    const createPlugin = () =>
      createCachePlugin({
        maxAge: 'kd' /* 👈 invalid ttl */
      });

    expect(createPlugin).toThrowError(
      'InvalidTtlError: "kd" is not a valid ttl.'
    );
  });

  it('should throw if ttl unit is invalid', () => {
    const createPlugin = () =>
      createCachePlugin({
        maxAge: '1c' /* 👈 invalid ttl unit */
      });

    expect(createPlugin).toThrowError(
      'InvalidTtlError: "1c" is not a valid ttl.'
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
      });
      const response2$ = cachePlugin.handler.handle({
        request: requestB,
        next: nextFn
      });
      const response3$ = cachePlugin.handler.handle({
        request: requestA,
        next: nextFn
      });

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
