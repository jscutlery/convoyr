import { CacheProvider } from './provider';

export class IndexedDBProvider implements CacheProvider {
  get(url) {
    throw new Error('todo');
  }

  set(url, response) {
    throw new Error('todo');
  }
}
