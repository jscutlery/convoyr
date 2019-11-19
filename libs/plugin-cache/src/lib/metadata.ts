import { HttpExtResponse } from '@http-ext/core';

import { METADATA_KEY } from './apply-metadata';

export interface Metadata {
  isFromCache: boolean;
  createdAt: string;
}

// @todo remove this type for ts >= 3.5
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PartialMetadata = Omit<Metadata, 'isFromCache'>;

export interface HttpExtPartialCacheResponse<TBody = unknown>
  extends HttpExtResponse<TBody> {
  [METADATA_KEY]: PartialMetadata;
}

export interface HttpExtCacheResponse<TBody = unknown>
  extends HttpExtResponse<TBody> {
  [METADATA_KEY]: Metadata;
}
