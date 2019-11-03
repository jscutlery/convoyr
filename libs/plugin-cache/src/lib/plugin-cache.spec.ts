import {
  createRequest,
  createResponse,
  HttpExtPlugin
} from '@http-ext/http-ext';
import { concat, of } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { _addMetadata } from './add-cache-metadata';
import { cachePlugin as createCachePlugin } from './plugin-cache';

const objectContaining = jasmine.objectContaining;

describe('CachePlugin', () => {
  it(
    'should serve cache when hydrated',
    marbles(m => {
      const cachePlugin = createCachePlugin({ addCacheMetadata: true });
      const request = createRequest({ url: 'https://ultimate-answer.com' });
      const response = createResponse({ body: { answer: 42 } });
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
    const request = createRequest({ url: 'https://ultimate-answer.com' });
    const response = createResponse({ body: { answer: 42 } });
    const next = () => of(response);

    const cacheResponse = cachePlugin.handle({ request, next }) as any;
    const spyObserver = jest.fn();

    cacheResponse.subscribe(spyObserver);
    expect(spyObserver).toBeCalledWith(
      objectContaining({ body: { answer: 42 } })
    );
  });

  it.todo('should use `MemoryCacheProvider` by default');
  it.todo('should store the cache using given provider');
  it.todo('should allow retry with exponential time span');
});
