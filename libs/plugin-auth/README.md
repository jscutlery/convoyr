# @http-ext/plugin-auth

> A auth plugin for [HttpExt](https://github.com/jscutlery/http-ext).

This plugin takes care of handling authorization by:
- adding the `Authorization` header with the given token automatically for each request matching a custom condition,
- triggering a custom token expiration logic on `401 Unauthorized` http responses.

This plugins helps avoiding all the http interceptor boilerplate required to add the authorization token and detect token expiration.

Using matchers like `matchOrigin`, we'll ensure that the token is sent to the right API.
This also helps using different tokens for different APIs in the same app.

## Requirements

The plugin requires `@http-ext/core` and `@http-ext/angular` to be installed.

## Installation

```bash
yarn add @http-ext/plugin-cache @http-ext/core
```

or

```bash
npm install @http-ext/plugin-cache @http-ext/core
```

## Usage

```ts
import { HttpExtModule } from '@http-ext/angular';
import { createAuthPlugin } from '@http-ext/plugin-auth';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      deps: [AuthService],
      config: (authService: AuthService) =>
        createAuthPlugin({
          shouldHandleRequest: matchOrigin('https://secure-origin.com'),
          token: authService.getToken(), // Returns an Observable<string>.
          onUnauthorized: () => authService.markTokenExpired()
        })
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Available options

You can give a partial configuration object it will be merged with default values.

| Property         | Type                 | Required | Default value                          | Description                                                                                  |
| ---------------- | -------------------- | ---------| ---------------------------------------| -------------------------------------------------------------------------------------------- |
| `token`          | `Observable<string>` | Yes      | `undefined`                            | The bearer token that will be added to every matching request in the `Authorization` header. |
| `onUnauthorized` | `OnUnauthorized`     | No       | `undefined`                            | A function executed when an unauthorized response is thrown.                                 |
| `condition`      | `RequestCondition`   | No       | `matchOrigin('https://my-origin.com')` | Predicate function to know which request the plugin should handle.                           |

To know more about the `condition` property check-out the [conditional handling section](https://github.com/jscutlery/http-ext#conditional-handling).
