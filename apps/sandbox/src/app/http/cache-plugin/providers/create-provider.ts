import { IndexedDBProvider } from './indexedDB-provider';
import { LocalStorageProvider } from './local-storage-provider';
import { MemoryProvider } from './memory-provider';
import { CacheProvider, CacheProviderType } from './provider';

export function createCacheProvider(
  cacheProviderType: CacheProviderType
): CacheProvider {
  switch (cacheProviderType) {
    case 'memory':
      return new MemoryProvider();
    case 'localStorage':
      return new LocalStorageProvider();
    case 'indexedDB':
      return new IndexedDBProvider();

    default:
      throw invalidCacheProviderError(cacheProviderType);
  }
}

export function invalidCacheProviderError(cacheProviderType: string) {
  const cacheProviders: CacheProviderType[] = [
    'memory',
    'localStorage',
    'indexedDB'
  ];

  return new Error(
    `InvalidCacheProviderError: couldn't create ${cacheProviderType} cache provider, valid providers are ${cacheProviders.toString()}`
  );
}
