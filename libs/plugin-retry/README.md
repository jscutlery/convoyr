# @http-ext/plugin-retry

> A retry plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin retries failed network requests using a configurable back-off strategy.

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

| Property            | Type               | Default value   | Description                                                        |
| ------------------- | ------------------ | --------------- | ------------------------------------------------------------------ |
| `initialIntervalMs` | `number`           | `200`           | Duration before the first retry.                                   |
| `maxIntervalMs`     | `number`           | `60000`         | Maximum time span before retrying.                                 |
| `maxRetries`        | `number`           | `10`            | Maximum number of retries.                                         |
| `shouldRetry`       | `RetryPredicate`   | `isServerError` | Predicate function to know which failed request should be retried. |
| `condition`         | `RequestCondition` | `() => true`    | Predicate function to know which request the plugin should handle. |

Here is an example passing a configuration object.

```ts
import { MemoryStorage } from '@http-ext/plugin-cache';

@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [
        createRetryPlugin({
          initialIntervalMs: 1000,
          maxIntervalMs: 120000,
          maxRetries: 15,
          shouldRetry: response => response.status !== 404,
          condition: ({ request }) => request.url.includes('api.github.com')
        })
      ]
    })
  ]
})
export class AppModule {}
```
