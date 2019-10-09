import { Headers } from './headers';

export interface Response<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
