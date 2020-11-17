# @convoyr/plugin-auth

> A auth plugin for [Convoyr](https://github.com/jscutlery/convoyr).

This plugin takes care of handling authorization by:

- adding the `Authorization` header with the given token automatically for each request matching a custom condition,
- triggering a custom token expiration logic on `401 Unauthorized` http responses.

This plugins helps avoiding all the http interceptor boilerplate required to add the authorization token and detect token expiration.

Using matchers like `matchOrigin`, we'll ensure that the token is sent to the right API.
This also helps using different tokens for different APIs in the same app.

## Requirements

The plugin requires `@convoyr/core` and `@convoyr/angular` to be installed.

## Installation

```bash
yarn add @convoyr/plugin-cache @convoyr/core
```

or

```bash
npm install @convoyr/plugin-cache @convoyr/core
```

## Usage

```ts
import { ConvoyrModule } from '@convoyr/angular';
import { createAuthPlugin } from '@convoyr/plugin-auth';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConvoyrModule.forRoot({
      deps: [AuthService],
      config: (authService: AuthService) => ({
        plugins: [
          createAuthPlugin({
            shouldHandleRequest: matchOrigin('https://secure-origin.com'),
            token: authService.getToken(), // Returns an Observable<string>.
            onUnauthorized: () => authService.markTokenExpired(),
          }),
        ],
      }),
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Available options

You can give a partial configuration object it will be merged with default values.

| Property              | Type                 | Required | Default value | Description                                                                                  |
| --------------------- | -------------------- | -------- | ------------- | -------------------------------------------------------------------------------------------- |
| `token`               | `Observable<string>` | Yes      | `undefined`   | The bearer token that will be added to every matching request in the `Authorization` header. |
| `onUnauthorized`      | `OnUnauthorized`     | No       | `undefined`   | A function executed when an unauthorized response is thrown.                                 |
| `shouldHandleRequest` | `RequestCondition`   | No       | `undefined`   | Predicate function to know which request the plugin should handle.                           |

To know more about the `shouldHandleRequest` property check-out the [conditional handling section](https://github.com/jscutlery/convoyr/blob/master/docs/custom-plugin.md#conditional-handling).
