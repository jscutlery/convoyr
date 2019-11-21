<div align="center">
  <h1>HttpExt</h1>
  <a href="https://github.com/jscutlery/http-ext/actions" rel="nofollow">
    <img src="https://github.com/jscutlery/http-ext/workflows/Build%20&%20Test/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/jscutlery/http-ext" rel="nofollow">
    <img src="https://badgen.net/codecov/c/github/jscutlery/http-ext" />
  </a>
  <a href="https://github.com/jscutlery/@http-ext/blob/master/LICENSE" rel="nofollow">
    <img alt="" src="https://badgen.net/npm/license/@http-ext/core">
  </a>
  <a href="https://www.npmjs.com/package/@http-ext/core" rel="nofollow">
    <img alt="" src="https://badgen.net/npm/v/@http-ext/core">
  </a>
</div>

<p align="center">
  Enhanced HTTP capabilities, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="http://reactivex.io/rxjs" target="blank">RxJS</a>.
</p>

## Philosophy

HttpExt is a **reactive** and **extensible** library built on the top of HTTP. The main building block is a **plugin** which is a simple function that let you intercept network communications in a fancy way. The goal is to provide useful behaviors to extend the power of HTTP. You can create your own plugin or directly use the built-in collection to start as fast as possible.

This library only supports the Angular's `HttpClient` but it's planned to also support the [Axios client](https://github.com/axios/axios) to run HttpExt both on the browser and the server.

## Ecosystem

This project is a monorepo that includes the following packages.

| Name                                                                           | Description           | Goal                  | Size                                                                   |
| ------------------------------------------------------------------------------ | --------------------- | --------------------- | -                                                                      |
| [@http-ext/core](https://www.npmjs.com/package/@http-ext/core)                 | Core module           | Extensibility         | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/core)         |
| [@http-ext/angular](https://www.npmjs.com/package/@http-ext/angular)           | Angular module        | Angular compatibility | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/angular)      |
| [@http-ext/plugin-cache](https://www.npmjs.com/package/@http-ext/plugin-cache) | Cache plugin          | Fast and reactive UI  | ![cost](https://badgen.net/bundlephobia/minzip/@http-ext/plugin-cache) |
| @http-ext/plugin-retry                                                         | Retry back-off plugin | Resilience            |                                                                        |
| @http-ext/plugin-authentication                                                | Authentication plugin | Security              |                                                                        |

## Quick start

Install packages inside your project.

```bash
yarn add @http-ext/core @http-ext/angular @http-ext/plugin-cache
```

Import the module and define plugins you want to use.

```ts
import { HttpExtModule } from '@http-ext/angular';
import { cachePlugin } from '@http-ext/plugin-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpExtModule.forRoot({
      plugins: [cachePlugin({ addCacheMetadata: true })]
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Road-map

Check-out [the board](https://github.com/jscutlery/http-ext/projects/1) for incoming evolutions.

## Changelog

Changes are [available here](CHANGELOG.md).

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
      <a href="https://github.com/Edouardbozon" style="color: white">
        <img src="https://github.com/Edouardbozon.png?s=150" width="150"/>
      </a>
      <p style="margin: 0;"><strong>Edouard Bozon</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/edouardbozon">@edouardbozon</a></p>
    </td>
  </tr>
</table>

## Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

This project is MIT licensed.
