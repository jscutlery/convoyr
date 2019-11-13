import { HttpExtResponse } from '@http-ext/core';

import { METADATA_KEY } from './apply-metadata';

export interface Metadata {
  isFromCache: boolean;
  createdAt: string;
}

export type PartialMetadata = Omit<Metadata, 'isFromCache'>;

export interface HttpExtCacheResponse extends HttpExtResponse {
  [METADATA_KEY]: Metadata;
}

export interface HttpExtPartialCacheResponse extends HttpExtResponse {
  [METADATA_KEY]: PartialMetadata;
}

export type CacheOrNetworkResponse = HttpExtResponse | HttpExtCacheResponse;
