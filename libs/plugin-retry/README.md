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

| Property              | Type               | Default value            | Description                                                        |
| --------------------- | ------------------ | ------------------------ | ------------------------------------------------------------------ |
| `initialIntervalMs`   | `number`           | `300`                    | Duration before the first retry.                                   |
| `maxIntervalMs`       | `number`           | `10_000`                 | Maximum time span before retrying.                                 |
| `maxRetries`          | `number`           | `3`                      | Maximum number of retries.                                         |
| `shouldRetry`         | `RetryPredicate`   | `isServerOrUnknownError` | Predicate function to know which failed request should be retried. |
| `shouldHandleRequest` | `RequestCondition` | `() => true`             | Predicate function to know which request the plugin should handle. |

Here is an example passing a configuration object.

Keep in mind that HTTP error is not emitted while the plugin is retrying. In the following example the HTTP error will be emitted after 10 retries, then the observable completes.

```ts
import { MemoryStorage } from '@http-ext/plugin-cache';

@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [
        createRetryPlugin({
          initialIntervalMs: 500,
          maxIntervalMs: 20_000,
          maxRetries: 10,
          shouldRetry: response => response.status !== 404,
          shouldHandleRequest: ({ request }) =>
            request.url.includes('api.github.com')
        })
      ]
    })
  ]
})
export class AppModule {}
```
