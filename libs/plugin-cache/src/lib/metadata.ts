import { HttpExtResponse } from '@http-ext/core';

import { METADATA_KEY } from './apply-metadata';

export interface PartialMetadata {
  createdAt: string;
}

export interface Metadata extends PartialMetadata {
  isFromCache: boolean;
}

export interface HttpExtPartialCacheResponse<TBody = unknown>
  extends HttpExtResponse<TBody> {
  [METADATA_KEY]: PartialMetadata;
}

export interface HttpExtCacheResponse<TBody = unknown>
  extends HttpExtResponse<TBody> {
  [METADATA_KEY]: Metadata;
}
