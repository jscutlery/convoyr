# @http-ext/plugin-cache

A cache plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin cache network requests using the `stale-while-revalidate` strategy. First the plugin returns the data from cache (stale), then sends the `GET` request (revalidate), and finally comes with fresh data again. This technique drastically improve UI reactivity.

## Requirements

The plugin requires `@http-ext/core` and `@http-ext/angular` to be installed.

## Installation

```bash
yarn add `@http-ext/plugin-cache`
```

## Usage

The plugin is configurable by providing an object.

```ts
import { HttpExtModule, matchMethod } from '@http-ext/angular';
import { cachePlugin, CachePluginOptions } from '@http-ext/plugin-cache';

const cacheConfiguration: CachePluginOptions = {
  addCacheMetadata: false,
  storeAdapter: new MemoryAdapter(),
  condition: matchMethod('GET')
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [cachePlugin(cacheConfiguration)]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Default options

:construction:

### Available options

:construction:
