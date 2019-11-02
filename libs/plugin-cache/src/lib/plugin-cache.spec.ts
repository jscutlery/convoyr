import {
  createRequest,
  createResponse,
  HttpExtPlugin
} from '@http-ext/http-ext';
import { concat } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { _addMetadata } from './add-cache-metadata';
import { cachePlugin as createCachePlugin } from './plugin-cache';

describe('CachePlugin', () => {
  let cachePlugin: HttpExtPlugin;

  beforeEach(
    () => (cachePlugin = createCachePlugin({ addCacheMetadata: true }))
  );

  it(
    'should serve cache response when hydrated',
    marbles(m => {
      const request = createRequest({ url: 'https://test.com' });
      const response = createResponse({ body: { answer: 42 } });
      const networkResponse = _addMetadata({ isFromCache: false })(response);
      const cacheResponse = _addMetadata({ isFromCache: true })(response);

      /* Simulate network request */
      const next = () => m.cold('-r|', { r: response });

      /* Run two requests with the same URL to fire cache response */
      const request1$ = cachePlugin.handle({ request, next }) as any;
      const request2$ = cachePlugin.handle({ request, next }) as any;

      /* Execute requests handler in order */
      const response$ = concat(request1$, request2$);

      /*                         👇 Second time cache is served first */
      const expected$ = m.cold('-ncn|', {
        n: networkResponse,
        c: cacheResponse
      });

      m.expect(response$).toBeObservable(expected$);
    })
  );

  it.todo('should not append metadata to response by default');
  it.todo('should use the memory cache provider by default');
  it.todo('should store cache using the given provider');
  it.todo('should allow retry with exponential time span');
});
