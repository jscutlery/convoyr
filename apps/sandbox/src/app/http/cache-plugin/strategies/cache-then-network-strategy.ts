import { defer, EMPTY, merge, of } from 'rxjs';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';

import { _addCacheMetadata } from '../add-cache-metadata';
import { CacheProvider } from '../providers/provider';
import { CacheStrategy } from './strategy';

export class CacheThenNetworkStrategy implements CacheStrategy {
  constructor(
    private withCacheInfo: boolean,
    private cacheProvider: CacheProvider
  ) {}

  handle({ request, next }) {
    const real$ = next({ request }).pipe(
      tap(response => this.cacheProvider.set(request.url, response)),
      shareReplay({
        refCount: true,
        bufferSize: 1
      })
    );

    const fromCache$ = defer(() => {
      const response = this.cacheProvider.get(request.url);
      return response ? of(response) : EMPTY;
    }).pipe(takeUntil(real$));

    const withCacheInfo = this.withCacheInfo;
    /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to real$
     * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
     * If real$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
     * thanks to shareReplay. */
    return merge(
      _addCacheMetadata({ source$: real$, withCacheInfo, isFromCache: false }),
      _addCacheMetadata({
        source$: fromCache$,
        withCacheInfo,
        isFromCache: true
      })
    );
  }
}
