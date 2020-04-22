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
  Reactive <strong>HTTP extensions</strong> for Angular, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="https://rxjs-dev.firebaseapp.com/" target="blank">RxJS</a>.
</p>

# Motivation

Enriching HTTP clients with capabilities related to **security**, **performance** or **resilience** is a common need but it is also an error-prone and sometimes complex task.

🎯 **HttpExt** has been built with one goal in mind: helping you focus on your apps' features instead of the transport layer's boilerplate and matters... and without any trade-off.

- 🅰️ **HttpExt** is **Angular-ready** and makes [interceptors](https://angular.io/api/common/http/HttpInterceptor) implementation safe and easy,
- 🐍 **HttpExt** is **fully reactive** and based on [RxJS](https://rxjs-dev.firebaseapp.com/),
- 🔋 **HttpExt** has **batteries included** as it comes with some useful plugins,
- 📈 **HttpExt** is **progressive** because you can start using it without having to rewrite all your HTTP calls,
- 🧱 **HttpExt** is **easily extendable** as you can create and share your own plugins.

# How It Works

The main building block is the plugin. A plugin is a simple object that lets you intercept network communications and control or transform them easily. Like an _HttpInterceptor_ a plugin may transform outgoing request and the response stream as well before passing it to the next plugin. The library comes with a built-in [plugin collection](#built-in-plugins) to provide useful behaviors for your apps and to tackle the need to rewrite redundant logic between projects. It's also possible to [create your own plugin](#custom-plugin) for handling custom behaviors.

# Quick Start

1. Install core packages inside your project.

```bash
yarn add @http-ext/core @http-ext/angular # or npm install @http-ext/core @http-ext/angular
```

2. Install plugins packages.

```bash
yarn add @http-ext/plugin-cache @http-ext/plugin-retry @http-ext/plugin-auth # or npm install @http-ext/plugin-cache @http-ext/plugin-retry @http-ext/plugin-auth
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

## Complete Example

Checkout the [demo app workspace](./apps/sandbox) for a concrete example.

# Built-in Plugins

This project is a monorepo that includes the following packages.

| Package                                       | Name         | Description                                                       | Size                                                                   |
| --------------------------------------------- | ------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [@http-ext/plugin-auth](./libs/plugin-auth)   | Auth plugin  | Handle authentication                                             | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-auth)  |
| [@http-ext/plugin-cache](./libs/plugin-cache) | Cache plugin | Respond with cached results first then with fresh data when ready | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-cache) |
| [@http-ext/plugin-retry](./libs/plugin-retry) | Retry plugin | Retry failed requests with exponential backoff                    | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-retry) |

# Custom Plugins

You can write your own custom plugins.

## Custom Plugins Examples

### Add a custom header for requests sent to a specific origin

```ts
const addHeaders = (headers) => ({
  handle({ request, next }) {
    headers = { ...request.headers, ...headers };
    request = { ...request, headers };
    return next({ request });
  },
});

@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [
        {
          shouldHandleRequest: matchOrigin('https://github.com'),
          handler: addHeaders({ 'x-my-headers': '🚀' }),
        },
      ],
    }),
  ],
})
export class AppModule {}
```

### Reject requests to unknown origins

```ts
@NgModule({
  imports: [
    HttpExtModule.forRoot({
      plugins: [
        {
          shouldHandleRequest: not(matchOrigin('https://github.com')),
          handler: {
            handle({ request, next }) {
              return throwError(
                `🛑 requesting invalid origin. url: ${request.url}`
              );
            },
          },
        },
      ],
    }),
  ],
})
export class AppModule {}
```

## Implementing Custom Plugins

A plugin is an object that follows the `HttpExtPlugin` interface:

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

## Conditional handling

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

### Matchers

Matchers are utils functions for conditional request handling.

- _matchMethod:_ `matchMethod(expression: MethodMatchExpression) => RequestCondition`
- _matchOrigin:_ `matchOrigin(expression: OriginMatchExpression) => RequestCondition`

```ts
import { matchOrigin, HttpExtPlugin } from '@http-ext/core';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    shouldHandleRequest: matchOrigin('https://secure-origin.com'),
    handler: new LoggerHandler(),
  };
}
```

Here only requests matching `https://secure-origin.com` origin will be logged.

### Combiners

Combiners are used to compose with matchers.

- _and:_ `and(...predicates: RequestCondition[]) => RequestCondition`
- _or:_ `or(...predicates: RequestCondition[]) => RequestCondition`
- _not:_ `not(predicate: RequestCondition) => RequestCondition`

```ts
import { matchOrigin, matchMethod, and, HttpExtPlugin } from '@http-ext/core';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    shouldHandleRequest: and(
      matchMethod('GET'),
      matchOrigin('https://secure-origin.com'),
      matchOrigin('https://another-secure-origin.com')
    ),
    handler: new LoggerHandler(),
  };
}
```

Here only `GET` requests from `https://secure-origin.com` and `https://another-secure-origin.com` origins will be logged.

# Packages

This project is a monorepo that includes the following packages in addition to the [built-in plugins above](#built-in-plugins).

| Name                                | Description    | Size                                                              |
| ----------------------------------- | -------------- | ----------------------------------------------------------------- |
| [@http-ext/core](./libs/core)       | Core           | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/core)    |
| [@http-ext/angular](./libs/angular) | Angular module | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/angular) |

# Roadmap

For incoming evolutions [see our board](https://github.com/jscutlery/http-ext/projects/1).

# Changelog

For new features or breaking changes [see the changelog](CHANGELOG.md).

# Authors

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

# Contributing

See our [contributing guide](./CONTRIBUTING.md) before starting. Contributions of any kind welcome!

# Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

# License

This project is MIT licensed.
