# @http-ext/plugin-cache

> A cache plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin cache network requests using the `stale-while-revalidate` strategy. First the plugin returns the data from cache (stale), then sends the `GET` request (revalidate), and finally comes with fresh data again. This technique drastically improve UI reactivity.

## Requirements

The plugin requires `@http-ext/core` and `@http-ext/angular` to be installed.

## Installation

```bash
yarn add @http-ext/plugin-cache
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

| Property           | Type               | Default value         |
| ------------------ | ------------------ | --------------------- |
| `addCacheMetadata` | `boolean`          | `false`               |
| `storage`          | `StorageAdapter`   | `new MemoryAdapter()` |
| `condition`        | `RequestCondition` | `matchMethod('GET')`  |

Here is an example passing a configuration object.

```ts
import { LocalStorageAdapter } from '@http-ext/plugin-cache';

@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [
        cachePlugin({
          addCacheMetadata: true,
          storage: new LocalStorageAdapter()
        })
      ]
    })
  ]
})
export class AppModule {}
```

To know more about the `condition` property check-out the [conditional handling section](https://github.com/jscutlery/http-ext#conditional-handling).

### Metadata

You can add cache metadata to the response body. Be careful this option changes the body's shape and breaks existing code that need to access to the response body.

Here is an example showing a response body with `addCacheMetadata` set to `false` (default).

```json
{ "answer": 42 }
```

The same response body with `addCacheMetadata` set to `true`.

```json
{
  "data": { "answer": 42 },
  "cacheMetadata": {
    "createdAt": "2019-11-24T16:41:19.537Z",
    "isFromCache": true
  }
}
```

The response body is modified, data are moved in a dedicated object and cache metadata are added.

### Available storage

To cache HTTP responses we need to use a storage. This plugin comes with two built-in storage:

- `LocalStorageAdapter` that persists the cache between user's sessions.
- `MemoryAdapter` that looses its cache between user's sessions.

### Custom storage

You can add your own storage by implementing the following interface.

```ts
interface StorageAdapter {
  get(key: string): string;
  set(key: string, value: string): void;
}
```
