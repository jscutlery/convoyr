import { HttpExtPlugin } from '@http-ext/http-ext';
import { defer, EMPTY, merge, of } from 'rxjs';
import { delay, shareReplay, takeUntil, tap } from 'rxjs/operators';

const cache = {};

export function cachePlugin(): HttpExtPlugin {
  return {
    handle({ request, next }) {
      const real$ = next({ request }).pipe(
        delay(1000),
        tap(response => (cache[request.url] = response)),
        shareReplay({
          refCount: true,
          bufferSize: 1
        })
      );

      const fromCache$ = defer(() => {
        const response = cache[request.url];
        return response ? of(response) : EMPTY;
      }).pipe(takeUntil(real$));

      /* Order is important here because if we subscribe to fromCache$ first, it will subscribe to real$
       * and `takeUntil` will immediately unsubscribe from it because the result is synchronous.
       * If real$ is first, it will subscribe and the subscription will be shared with the `takeUntil`
       * thanks to shareReplay. */
      return merge(real$, fromCache$);
    }
  };
}
