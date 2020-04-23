# @convoyr/plugin-cache

> A cache plugin for [Convoyr](https://github.com/jscutlery/convoyr).

This plugin cache network requests using the _cache-then-network_ strategy. First the plugin returns the data from cache, then sends the request, and finally comes with fresh data again. This technique drastically improve UI reactivity.

## Requirements

The plugin requires `@convoyr/core` and `@convoyr/angular` to be installed.

## Installation

```bash
yarn add @convoyr/plugin-cache
```

or

```bash
npm install @convoyr/plugin-cache
```

## Usage

The whole configuration object is optional.

```ts
import { ConvoyrModule } from '@convoyr/angular';
import { createCachePlugin } from '@convoyr/plugin-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConvoyrModule.forRoot({
      plugins: [createCachePlugin()],
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Available options

You can give a partial configuration object it will be merged with default values.

| Property              | Type               | Default value                    | Description                                                        |
| --------------------- | ------------------ | -------------------------------- | ------------------------------------------------------------------ |
| `addCacheMetadata`    | `boolean`          | `false`                          | Add cache metadata to the response body.                           |
| `storage`             | `Storage`          | `new MemoryStorage()`            | Storage used to store the cache.                                   |
| `shouldHandleRequest` | `RequestCondition` | `isGetMethodAndJsonResponseType` | Predicate function to know which request the plugin should handle. |

Here is an example passing a configuration object.

```ts
import { createCachePlugin, MemoryStorage } from '@convoyr/plugin-cache';

@NgModule({
  imports: [
    ConvoyrModule.forRoot({
      plugins: [
        createCachePlugin({
          addCacheMetadata: true,
          storage: new MemoryStorage(),
        }),
      ],
    }),
  ],
})
export class AppModule {}
```

To know more about the `shouldHandleRequest` property check-out the [conditional handling section](https://github.com/jscutlery/convoyr#conditional-handling).

### Metadata

You can add cache metadata to the response body and use it in the application. For example you can display something that showup that data are from cache.

Be careful because this option changes the body's shape and breaks existing code that need to access to the response body.

Here is an example showing a response body with `addCacheMetadata` set to `false` (default).

```json
{ "answer": 42 }
```

The same response body with `addCacheMetadata` set to `true`.

```json
{
  "data": { "answer": 42 },
  "cacheMetadata": {
    "createdAt": "2019-11-24T00:00:00.000Z",
    "isFromCache": true
  }
}
```

Data are moved in a dedicated object and cache metadata are added.

### `MemoryStorage`

#### `MemoryStorage` options

| Property  | Type              | Default value |
| --------- | ----------------- | ------------- |
| `maxSize` | `number | string` | `100`         |

#### `MemoryStorage` max size

Default's storage size of the `MemoryStorage` is 100 requests. Above this limit, the least recently used response will be removed to free some space.

`MemoryStorage` max size can be configured when initializing the storage and the cache plugin.

```ts
ConvoyrModule.forRoot({
  plugins: [
    createCachePlugin({
      storage: new MemoryStorage({ maxSize: 2000 }),
    }),
  ],
});
```

The `maxSize` can also be configured using human readable bytes format if a `string` is passed, for example:

```ts
ConvoyrModule.forRoot({
  plugins: [
    createCachePlugin({
      storage: new MemoryStorage({ maxSize: '2000 b' }),
    }),
  ],
});
```

Supported units and abbreviations are as follows and are case-insensitive:

- `b` for bytes
- `kb` for kilobytes
- `mb` for megabytes
- `gb` for gigabytes
- `tb` for terabytes
- `pb` for petabytes

### Custom storage

You can use any other kind of storage (e.g. Redis) by implementing the `Storage` interface.
