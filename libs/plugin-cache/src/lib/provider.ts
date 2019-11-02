import { HttpExtResponse } from '@http-ext/http-ext';

export interface CacheProvider {
  type: string;
  get(url: string): HttpExtResponse;
  set(url: string, response: HttpExtResponse): void;
}
