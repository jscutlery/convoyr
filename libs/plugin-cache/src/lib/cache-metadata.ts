export interface CacheMetadataBase {
  createdAt?: Date;
}

/* Adds computed fields like isFromCache. */
export interface CacheMetadata extends CacheMetadataBase {
  isFromCache: boolean;
}

export function createCacheMetadata(args: CacheMetadataBase): CacheMetadata {
  return {
    createdAt: args.createdAt,
    isFromCache: true
  };
}

export function createEmptyCacheMetadata(): CacheMetadata {
  return {
    isFromCache: false
  };
}
