# @http-ext/plugin-cache

> A cache plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin cache network requests using the `stale-while-revalidate` strategy. First the plugin returns the data from cache (stale), then sends the `GET` request (revalidate), and finally comes with fresh data again. This technique drastically improve UI reactivity.

## Requirements

The plugin requires `@http-ext/core` and `@http-ext/angular` to be installed.

## Installation

```bash
yarn add `@http-ext/plugin-cache`
```

## Usage

The whole configuration object is optional.

```ts
import { HttpExtModule } from '@http-ext/angular';
import { cachePlugin } from '@http-ext/plugin-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [cachePlugin()]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Available options

You can give a partial configuration object it will be merged with default values.

| Property           | Type               | Default value         |                                                                      |
| ------------------ | ------------------ | --------------------- | -------------------------------------------------------------------- |
| `addCacheMetadata` | `boolean`          | `false`               | Provide cache metadata in response body, this change the body shape. |
| `storeAdapter`     | `StoreAdapter`     | `new MemoryAdapter()` | Provide the store where responses are cached.                        |
| `condition`        | `RequestCondition` | `matchMethod('GET')`  | Conditional cache handling.                                          |

### Available stores

The plugin comes with two built-in store adapters:

- `MemoryAdapter`
- `LocalStorageAdapter`

The `LocalStorageAdapter` persists the cache between user's sessions while the `MemoryAdapter` loose its cache between user's sessions.

### Custom store adapter

You can create your own adapter to use the storage you need by implementing the following interface.

```ts
interface StoreAdapter {
  get(key: string): string;
  set(key: string, value: string): void;
}
```
