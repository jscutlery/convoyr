// tslint:disable-next-line: nx-enforce-module-boundaries
import { RequestHandlerFn } from 'libs/http-ext/src/lib/http-ext';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { HttpExtRequest } from 'libs/http-ext/src/lib/request';
// tslint:disable-next-line: nx-enforce-module-boundaries
import { HttpExtResponse } from 'libs/http-ext/src/lib/response';
import { Observable } from 'rxjs';

import { CacheResponse } from '../cache-plugin';

export type CacheStrategyType = 'cacheThenNetwork';

export interface CacheStrategy {
  handle({
    request,
    next
  }: {
    request: HttpExtRequest<unknown>;
    next: RequestHandlerFn;
  }): Observable<HttpExtResponse<unknown>>;
  handle({
    request,
    next
  }: {
    request: HttpExtRequest<unknown>;
    next: RequestHandlerFn;
  }): Observable<CacheResponse<HttpExtResponse<unknown>>>;
}
