<div align="center">
  <h1>HttpExt</h1>
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
  Enhanced HTTP capabilities, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="http://reactivex.io/rxjs" target="blank">RxJS</a>.
</p>

## Philosophy

HttpExt is a reactive and extensible library built on the top of the Angular `HttpClient`. The main building block is a plugin which is a simple object that let you intercept network communications in a fancy way. The goal is to provide useful behaviors to extend the power of HTTP. You can create your own plugin or directly use the built-in plugin collection to start as fast as possible.

## Ecosystem

This project is a monorepo that includes the following packages.

| Name                                          | Description           | Goal                       | Size                                                                   |
| --------------------------------------------- | --------------------- | -------------------------- | ---------------------------------------------------------------------- |
| [@http-ext/core](./libs/core)                 | Core module           | Generic plugins handler    | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/core)         |
| [@http-ext/angular](./libs/angular)           | Angular module        | `HttpClient` compatibility | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/angular)      |
| [@http-ext/plugin-cache](./libs/plugin-cache) | Cache plugin          | Fast and reactive UI       | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-cache) |
| [@http-ext/plugin-retry](./libs/plugin-retry) | Retry plugin          | Network resilience         | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-retry) |
| [@http-ext/plugin-auth](./libs/plugin-auth)   | Authentication plugin | Authentication made easy   | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-auth)  |

## Quick start

1. Install packages inside your project.

```bash
yarn add @http-ext/core @http-ext/angular @http-ext/plugin-cache @http-ext/plugin-retry
```

or

```bash
npm install @http-ext/core @http-ext/angular @http-ext/plugin-cache @http-ext/plugin-retry
```

2. Import the module and define plugins you want to use.

```ts
import { HttpExtModule } from '@http-ext/angular';
import { createCachePlugin } from '@http-ext/plugin-cache';
import { createRetryPlugin } from '@http-ext/plugin-retry';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [createCachePlugin(), createRetryPlugin()]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Custom plugin

A plugin is the main piece in HttpExt, it lets you intercept network requests and add your custom logic on the top. Its form is a plain object that implement the `HttpExtPlugin` interface. This object exposes the following properties:

- The `condition` function for conditional request handling.
- The `handler` object that encapsulates the plugin logic.

```ts
import { HttpExtPlugin } from '@http-ext/core';
import { LoggerHandler } from './handler';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    condition: ({ request }) => request.url.includes('api.github.com')
    handler: new LoggerHandler()
  };
}
```

In this example the handler will be executed only if the URL includes `api.github.com`. Note that the condition function is optional. Learn more about [conditional handling](https://github.com/jscutlery/http-ext#conditional-handling).

The handler is where all the plugin logic is put. It needs to implement the `PluginHandler` interface and it let you access both `HttpExtRequest` and `HttpExtResponse` objects.

```ts
import { PluginHandler } from '@http-ext/core';
import { tap } from 'rxjs/operators';

export class LoggerHandler implements PluginHandler {
  handle({ request, next }) {
    /* Here you can access the request. */
    console.log(`[${request.method}] ${request.url}`);

    /* By piping the next function you can manipulate the response. */
    return next({ request }).pipe(
      tap(response => {
        console.log(`[${response.status}] ${request.url}`);
      })
    );
  }
}
```

The response is accessible through piping the `next` function. Here you can transform the response stream as well.

### Conditional handling

The `condition` function checks for each request if the plugin handler should be executed.

```ts
export function createLoggerPlugin(): HttpExtPlugin {
  return {
    /* Here you can access the request object and decide which request you need to handle */
    condition: ({ request }) => {
      return request.method === 'GET' && request.url.includes('api.github.com');
    },
    handler: new LoggerHandler()
  };
}
```

The `condition` function is optional, if it's not provided the plugin will handle **all requests** executed through the HTTP client. It's important to think about which requests the plugin should be bound.

> Imagine you want to build an authentication plugin that add the authorization token to the request headers and you forget to add conditional handling. The token will potentially leak to other insecure origins which obviously result in a serious security issue.

### Matchers

A `Matcher` is a declarative way to do conditional handling. It's a safer approach than a raw condition and should be used in prior.

```ts
import { matchOrigin } from '@http-ext/core';

export function createLoggerPlugin(): HttpExtPlugin {
  return {
    condition: matchOrigin('https://secure-origin.com'),
    handler: new LoggerHandler()
  };
}
```

Here only requests matching `https://secure-origin.com` origin will be logged.

Built-in matchers:

- `matchOrigin(arg: string | string[] | RegExp | MatchOriginPredicate)`
- `matchMethod(arg: HttpMethod | HttpMethod[])`

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
