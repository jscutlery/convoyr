<p align="center">
  <img width="110" src="https://github.com/jscutlery/convoyr/blob/master/logo.png?raw=true" alt="convoyr logo" />
</p>

<div align="center">
  <a href="https://github.com/jscutlery/convoyr/actions" rel="nofollow">
    <img src="https://github.com/jscutlery/convoyr/workflows/Build%20&%20Test/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/jscutlery/convoyr" rel="nofollow">
    <img src="https://badgen.net/codecov/c/github/jscutlery/convoyr" />
  </a>
  <a href="https://github.com/jscutlery/convoyr/blob/master/LICENSE" rel="nofollow">
    <img src="https://badgen.net/npm/license/@convoyr/core">
  </a>
  <a href="https://www.npmjs.com/package/@convoyr/core" rel="nofollow">
    <img src="https://badgen.net/npm/v/@convoyr/core">
  </a>
</div>

<p align="center">
  Reactive <strong>HTTP extensions</strong> for Angular, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="https://rxjs-dev.firebaseapp.com/" target="blank">RxJS</a>.
</p>

# Motivation

Enriching HTTP clients with capabilities related to **security**, **performance** or **resilience** is a common need but it is also an error-prone and sometimes complex task.

🎯 **Convoyr** has been built with one goal in mind: helping you focus on your apps' features instead of the transport layer's boilerplate and matters... and without any trade-off.

- 🅰️ **Convoyr** is **Angular-ready** and makes [interceptors](https://angular.io/api/common/http/HttpInterceptor) implementation safe and easy,
- ⚡️ **Convoyr** is **fully reactive** and based on [RxJS](https://rxjs-dev.firebaseapp.com/),
- 🔋 **Convoyr** has **batteries included** as it comes with some useful plugins,
- 📈 **Convoyr** is **progressive** because you can start using it without having to rewrite all your HTTP calls,
- 🧱 **Convoyr** is **easily extendable** as you can create and share your own plugins.

# How It Works

The main building block is the plugin. A plugin is a simple object that lets you intercept network communications and control or transform them easily. Like an _HttpInterceptor_ a plugin may transform outgoing request and the response stream as well before passing it to the next plugin. The library comes with a built-in [plugin collection](#built-in-plugins) to provide useful behaviors for your apps and to tackle the need to rewrite redundant logic between projects. It's also possible to [create your own plugin](#custom-plugin) for handling custom behaviors. Learn more about [convoyr](https://www.codamit.dev/introducing-convoyr).

# Quick Start

1. Install core packages inside your project.

```bash
yarn add @convoyr/core @convoyr/angular # or npm install @convoyr/core @convoyr/angular
```

2. Install plugins packages.

```bash
yarn add @convoyr/plugin-cache @convoyr/plugin-retry @convoyr/plugin-auth # or npm install @convoyr/plugin-cache @convoyr/plugin-retry @convoyr/plugin-auth
```

3. Import the module and define plugins you want to use.

```ts
import { ConvoyrModule } from '@convoyr/angular';
import { createCachePlugin } from '@convoyr/plugin-cache';
import { createRetryPlugin } from '@convoyr/plugin-retry';
import { createRetryPlugin } from '@convoyr/plugin-auth';
import { AuthService } from './auth/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ConvoyrModule.forRoot({
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

| Package                                      | Name         | Description                                                       |
| -------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| [@convoyr/plugin-auth](./libs/plugin-auth)   | Auth plugin  | Handle authentication                                             |
| [@convoyr/plugin-cache](./libs/plugin-cache) | Cache plugin | Respond with cached results first then with fresh data when ready |
| [@convoyr/plugin-retry](./libs/plugin-retry) | Retry plugin | Retry failed requests with exponential backoff                    |

# Custom Plugins

You can write your own custom plugins.

## Custom Plugins Examples

### Add a custom header for requests sent to a specific origin

```ts
const addHeaders = (headers) => ({
  handle({ request, next }) {
    headers = { ...request.headers, ...headers };
    request = { ...request, headers };
    return next.handle({ request });
  },
});

@NgModule({
  imports: [
    ConvoyrModule.forRoot({
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
    ConvoyrModule.forRoot({
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

A plugin is an object that follows the `ConvoyrPlugin` interface:

```ts
export interface ConvoyrPlugin {
  shouldHandleRequest?: RequestCondition;
  handler: PluginHandler;
}
```

All the logic is hold by the `handler` object which follow the following interface:

```ts
export interface PluginHandler {
  handle({ request, next }: PluginHandlerArgs): SyncOrAsync<ConvoyrResponse>;
}
```

The `handle` method lets you manipulate request and the response stream as well before passing it to the next plugin using the `next` function. The `SyncOrAsync<ConvoyrResponse>` allows you to deal with:

- synchronous response,
- Promise based response,
- Observable based response.

Note that Convoyr internally transforms the response to a stream using Observables. Here is an example using a literal `handler` object and returns a Promise based response:

```ts
import { ConvoyrPlugin, PluginHandler } from '@convoyr/core';
import { LoggerHandler } from './handler';

export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: ({ request }) => request.url.includes('api.github.com')
    handler: {
      async handle({ request, next }) {
        const response = await next.handle({ request }).toPromise();
        console.log({ response });
        return response;
      }
    }
  };
}
```

In this example the `handler` will be executed only if the URL includes `api.github.com`. Note that the `shouldHandleRequest` function is optional. Learn more about [conditional handling](https://github.com/jscutlery/convoyr#conditional-handling).

The following example uses a class to implement the `PluginHandler` interface and an Observable for handling the response:

```ts
import { PluginHandler, PluginHandlerArgs } from '@convoyr/core';
import { tap } from 'rxjs/operators';

export class LoggerHandler implements PluginHandler {
  handle({ request, next }: PluginHandlerArgs) {
    return next.handle({ request }).pipe(
      tap((response) => {
        console.log({ response });
      })
    );
  }
}

export function createLoggerPlugin(): ConvoyrPlugin {
  return { handler: new LoggerHandler() };
}
```

By piping the `next` function you can manipulate the response stream and leverage reactive powers using RxJS operators.

## Conditional handling

The `shouldHandleRequest` function checks for each outgoing request if the plugin handler should be executed:

```ts
export function createLoggerPlugin(): ConvoyrPlugin {
  return {
    shouldHandleRequest: ({ request }) => {
      return request.method === 'GET' && request.url.includes('api.github.com');
    },
    handler: new LoggerHandler(),
  };
}
```

Here only `GET` requests with URL including `api.github.com` will be handled by the plugin.

Note that the `shouldHandleRequest` function is optional, but if not provided Convoyr will execute the plugin handler for **all outgoing requests**. For this reason it's better to provide the function and to be strict as possible. See the section below for handling exactly what you need using built-in matchers.

### Matchers

Matchers are utils functions for conditional request handling.

- _matchResponseType:_ `matchResponseType(expression: ResponseTypeMatchExpression) => RequestCondition`
- _matchMethod:_ `matchMethod(expression: MethodMatchExpression) => RequestCondition`
- _matchOrigin:_ `matchOrigin(expression: OriginMatchExpression) => RequestCondition`
- _matchPath:_ `matchOrigin(expression: string) => RequestCondition`

```ts
import { matchOrigin, ConvoyrPlugin } from '@convoyr/core';

export function createLoggerPlugin(): ConvoyrPlugin {
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
import { matchOrigin, matchMethod, and, ConvoyrPlugin } from '@convoyr/core';

export function createLoggerPlugin(): ConvoyrPlugin {
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

## Plugin Testing

Here only `GET` requests from `https://secure-origin.com` and `https://another-secure-origin.com` origins will be logged.

# Packages

This project is a monorepo that includes the following packages in addition to the [built-in plugins above](#built-in-plugins).

| Name                               | Description    |
| ---------------------------------- | -------------- |
| [@convoyr/core](./libs/core)       | Core           |
| [@convoyr/angular](./libs/angular) | Angular module |

# Roadmap

For incoming evolutions [see our board](https://github.com/jscutlery/convoyr/projects/1).

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
<table>
  <tr>
    <td align="center"><a href="https://www.it-dir.co"><img src="https://avatars0.githubusercontent.com/u/2479323?v=4" width="100px;" alt=""/><br /><sub><b>Pierre-Edouard Galtier</b></sub></a><br /><a href="https://github.com/jscutlery/convoyr/commits?author=pegaltier" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

# License

This project is MIT licensed.
