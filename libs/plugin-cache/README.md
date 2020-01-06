# @http-ext/plugin-cache

> A cache plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin cache network requests using the *cache-then-network* strategy. First the plugin returns the data from cache, then sends the request, and finally comes with fresh data again. This technique drastically improve UI reactivity.

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

| Property           | Type                    | Default value         |
| ------------------ | ----------------------- |---------------------- |
| `addCacheMetadata` | `boolean`               | `false`               |
| `storage`          | `Storage`               | `new MemoryStorage()` |
| `condition`        | `RequestCondition`      | `matchMethod('GET')`  |

Here is an example passing a configuration object.

```ts
import { MemoryStorage } from '@http-ext/plugin-cache';

@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [
        cachePlugin({
          addCacheMetadata: true,
          storage: new MemoryStorage()
        })
      ]
    })
  ]
})
export class AppModule {}
```

To know more about the `condition` property check-out the [conditional handling section](https://github.com/jscutlery/http-ext#conditional-handling).

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

### Custom storage

To use an other storage than available ones (e.g. Redis) you need to implement the `Storage` interface and then pass it to the plugin configuration.
`