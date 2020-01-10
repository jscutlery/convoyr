# @http-ext/plugin-retry

> A retry plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin retries network requests using a configurable interval back-off strategy.

## Requirements

The plugin requires `@http-ext/core` and `@http-ext/angular` to be installed.

## Installation

```bash
yarn add @http-ext/plugin-retry
```

or

```bash
npm install @http-ext/plugin-retry
```

## Usage

The whole configuration object is optional.

```ts
import { HttpExtModule } from '@http-ext/angular';
import { createRetryPlugin } from '@http-ext/plugin-retry';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [createRetryPlugin()]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Available options

You can give a partial configuration object it will be merged with default values.

| Property           | Type      | Default value |
| ------------------ | --------- | ------------- |
| `addCacheMetadata` | `boolean` | `false`       |

Here is an example passing a configuration object.

```ts
import { MemoryStorage } from '@http-ext/plugin-cache';

@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [createRetryPlugin({})]
    })
  ]
})
export class AppModule {}
```
