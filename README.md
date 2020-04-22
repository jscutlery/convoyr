<p align="center">
  <img width="110" src="https://github.com/jscutlery/http-ext/blob/master/logo.png?raw=true" alt="http-ext logo" />
</p>

<div align="center">
  <a href="https://github.com/jscutlery/http-ext/actions" rel="nofollow">
    <img src="https://github.com/jscutlery/http-ext/workflows/Build%20&%20Test/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/jscutlery/http-ext" rel="nofollow">
    <img src="https://badgen.net/codecov/c/github/jscutlery/http-ext" />
  </a>
  <a href="https://github.com/jscutlery/http-ext/blob/master/LICENSE" rel="nofollow">
    <img src="https://badgen.net/npm/license/@http-ext/core">
  </a>
  <a href="https://www.npmjs.com/package/@http-ext/core" rel="nofollow">
    <img src="https://badgen.net/npm/v/@http-ext/core">
  </a>
</div>

<p align="center">
  Reactive <strong>HTTP extensions</strong> for Angular, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="http://reactivex.io/rxjs" target="blank">RxJS</a>.
</p>

## Philosophy

HttpExt is a reactive library built on the top of the Angular HTTP client that aims to enhance its capabilities. The main building block is a plugin which is a simple object that let you intercept network communications in a fancy way. Like an _HttpInterceptor_ a plugin may transform outgoing request and the response stream as well before passing it to the next plugin. The library comes with a built-in [plugin collection](https://github.com/jscutlery/http-ext#ecosystem) to provide useful behaviors for your apps and to tackle the need to rewrite redundant logic between projects. It's also possible to [create your own plugin](https://github.com/jscutlery/http-ext#custom-plugin) for handling custom behaviors.

## Examples

Checkout the [demo app workspace](./apps/sandbox) for a concrete example.

## Ecosystem

This project is a monorepo that includes the following packages.

| Name                                          | Description    | Goal                     | Size                                                                   |
| --------------------------------------------- | -------------- | ------------------------ | ---------------------------------------------------------------------- |
| [@http-ext/core](./libs/core)                 | Core           | Plugins handler          | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/core)         |
| [@http-ext/angular](./libs/angular)           | Angular module | HttpClient compatibility | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/angular)      |
| [@http-ext/plugin-auth](./libs/plugin-auth)   | Auth plugin    | Authenticate requests    | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-auth)  |
| [@http-ext/plugin-cache](./libs/plugin-cache) | Cache plugin   | Cache HTTP resources     | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-cache) |
| [@http-ext/plugin-retry](./libs/plugin-retry) | Retry plugin   | Retry failed requests    | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-retry) |

## Quick start

1. Install core packages inside your project.

```bash
yarn add @http-ext/core @http-ext/angular

# or

npm install @http-ext/core @http-ext/angular
```

2. Install plugins packages.

```bash
yarn add @http-ext/plugin-cache @http-ext/plugin-retry @http-ext/plugin-auth

# or

npm install @http-ext/plugin-cache @http-ext/plugin-retry @http-ext/plugin-auth
```

3. Import the module and define plugins you want to use.

```ts
import { HttpExtModule } from '@http-ext/angular';
import { createCachePlugin } from '@http-ext/plugin-cache';
import { createRetryPlugin } from '@http-ext/plugin-retry';
import { createRetryPlugin } from '@http-ext/plugin-auth';
import { AuthService } from './auth/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      deps: [AuthService],
      config(authService: AuthService) {
        return {
          plugins: [
            createCachePlugin(),
            createRetryPlugin(),
            createAuthPlugin({
              token: authService.getToken(),
            }),
          ],
        };
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Custom plugin

A plugin is an object that follow the `HttpExtPlugin` interface:

```ts
export interface HttpExtPlugin {
  shouldHandleRequest?: RequestCondition;
  handler: PluginHandler;
}
```

All the logic is hold by the `handler` object which follow the following interface:

```ts
export interface PluginHandler {
  handle({ request, next }: PluginHandlerArgs): SyncOrAsync<HttpExtResponse>;
}
```

The `handle` method lets you manipulate request and the response stream as well before passing it to the next plugin using the `next` function. The `SyncOrAsync<HttpExtResponse>` allows you to deal with:

- synchronous response,
- Promise based response,
- Observable based response.

Note that HttpExt internally transforms the response to a stream using Observables. Here is an example using a literal `handler` object and returns a Promise based response:

```ts
import { HttpExtPlugin, PluginHandler } from '@http-ext/core';
import { LoggerHandler } from './handler';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    shouldHandleRequest: ({ request }) => request.url.includes('api.github.com')
    handler: {
      async handle({ request, next }) {
        const response = await next({ request }).toPromise();
        console.log({ response });
        return response;
      }
    }
  };
}
```

In this example the `handler` will be executed only if the URL includes `api.github.com`. Note that the `shouldHandleRequest` function is optional. Learn more about [conditional handling](https://github.com/jscutlery/http-ext#conditional-handling).

The following example uses a class to implement the `PluginHandler` interface and an Observable for handling the response:

```ts
import { PluginHandler, PluginHandlerArgs } from '@http-ext/core';
import { tap } from 'rxjs/operators';

export class LoggerHandler implements PluginHandler {
  handle({ request, next }: PluginHandlerArgs) {
    return next({ request }).pipe(
      tap((response) => {
        console.log({ response });
      })
    );
  }
}

export function createLoggerPlugin(): HttpExtPlugin {
  return { handler: new LoggerHandler() };
}
```

By piping the `next` function you can manipulate the response stream and leverage reactive powers using RxJS operators.

### Conditional handling

The `shouldHandleRequest` function checks for each outgoing request if the plugin handler should be executed:

```ts
export function createLoggerPlugin(): HttpExtPlugin {
  return {
    shouldHandleRequest: ({ request }) => {
      return request.method === 'GET' && request.url.includes('api.github.com');
    },
    handler: new LoggerHandler(),
  };
}
```

Here only `GET` requests with URL including `api.github.com` will be handled by the plugin.

Note that the `shouldHandleRequest` function is optional, but if not provided HttpExt will execute the plugin handler for **all outgoing requests**. For this reason it's better to provide the function and to be strict as possible. See the section below for handling exactly what you need using built-in matchers.

#### Matchers

Matchers are utils functions for conditional request handling.

- _matchOrigin:_ `matchOrigin(expression: OriginMatchExpression) => RequestCondition`
- _matchMethod:_ `matchMethod(expression: MethodMatchExpression) => RequestCondition`

```ts
import { matchOrigin } from '@http-ext/core';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    shouldHandleRequest: matchOrigin('https://secure-origin.com'),
    handler: new LoggerHandler(),
  };
}
```

Here only requests matching `https://secure-origin.com` origin will be logged.

#### Operators

Operators are used to compose with matchers.

- _and:_ `and(...predicates: RequestCondition[]) => RequestCondition`
- _or:_ `or(...predicates: RequestCondition[]) => RequestCondition`

```ts
import { matchOrigin, and } from '@http-ext/core';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    shouldHandleRequest: and(
      matchOrigin('https://secure-origin.com'),
      matchOrigin('https://another-secure-origin.com')
    ),
    handler: new LoggerHandler(),
  };
}
```

Here requests from `https://secure-origin.com` and `https://another-secure-origin.com` origins will be logged.

## Roadmap

For incoming evolutions [see our board](https://github.com/jscutlery/http-ext/projects/1).

## Changelog

For new features or breaking changes [see the changelog](CHANGELOG.md).

## Authors

<table border="0">
  <tr>
    <td align="center">
      <a href="https://github.com/yjaaidi" style="color: white">
        <img src="https://github.com/yjaaidi.png?s=150" width="150"/>
      </a>
      <p style="margin: 0;"><strong>Younes Jaaidi</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/yjaaidi">@yjaaidi</a></p>
    </td>
    <td align="center">
      <a href="https://github.com/edbzn" style="color: white">
        <img src="https://github.com/edbzn.png?s=150" width="150"/>
      </a>
      <p style="margin: 0;"><strong>Edouard Bozon</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/edbzn">@edbzn</a></p>
    </td>
  </tr>
</table>

## Contributing

See our [contributing guide](./CONTRIBUTING.md) before starting. Contributions of any kind welcome!

## Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

This project is MIT licensed.
