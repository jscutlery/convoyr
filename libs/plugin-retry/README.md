# @convoyr/plugin-retry

> A retry plugin for [Convoyr](https://github.com/jscutlery/convoyr).

This plugin retries failed network requests using a configurable back-off strategy.

## Requirements

The plugin requires `@convoyr/core` and `@convoyr/angular` to be installed.

## Installation

```bash
yarn add @convoyr/plugin-retry
```

or

```bash
npm install @convoyr/plugin-retry
```

## Usage

The whole configuration object is optional.

```ts
import { ConvoyModule } from '@convoyr/angular';
import { createRetryPlugin } from '@convoyr/plugin-retry';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConvoyModule.forRoot({
      plugins: [createRetryPlugin()],
    }),
  ],
  bootstrap: [AppComponent],
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
import { MemoryStorage } from '@convoyr/plugin-cache';

@NgModule({
  imports: [
    ConvoyModule.forRoot({
      plugins: [
        createRetryPlugin({
          initialIntervalMs: 500,
          maxIntervalMs: 20_000,
          maxRetries: 10,
          shouldRetry: (response) => response.status !== 404,
          shouldHandleRequest: ({ request }) =>
            request.url.includes('api.github.com'),
        }),
      ],
    }),
  ],
})
export class AppModule {}
```
