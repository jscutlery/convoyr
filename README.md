<div align="center">
  <h1>http-ext</h1>
  <a href="https://github.com/jscutlery/http-ext/actions">
    <img src="https://github.com/jscutlery/http-ext/workflows/Build%20&%20Test/badge.svg" />
  </a>
  <a href="https://codecov.io/gh/jscutlery/http-ext">
    <img src="https://codecov.io/gh/jscutlery/http-ext/branch/master/graph/badge.svg" />
  </a>
</div>

<p align="center">
  Enhanced HTTP capabilities, based on <a href="https://www.typescriptlang.org" target="blank">TypeScript</a> and <a href="http://reactivex.io/rxjs" target="blank">RxJS</a>.
</p>

## Philosophy

Http-ext is an **extensible** library that aims to enhance HTTP capabilities. It comes with the idea of **plugin** that let you intercept network communications in a fancy way. The reactive nature of this library allows you to create and compose various behaviors on the top of HTTP. Http-ext has a collection of built-in plugins that bring powerful features to your application.

## Ecosystem

This project is a monorepo that includes the following packages.

| Name                                                                           | Description           | Goal                  |
| ------------------------------------------------------------------------------ | --------------------- | --------------------- |
| [@http-ext/core](https://www.npmjs.com/package/@http-ext/core)                 | Core module           | Extensibility         |
| [@http-ext/angular](https://www.npmjs.com/package/@http-ext/angular)           | Angular module        | Angular compatibility |
| [@http-ext/test-utils](https://www.npmjs.com/package/@http-ext/test-utils)     | Testing module        | Testability           |
| [@http-ext/plugin-cache](https://www.npmjs.com/package/@http-ext/plugin-cache) | Cache plugin          | Performance           |
| @http-ext/plugin-retry                                                         | Retry back-off plugin | Resilience            |
| @http-ext/plugin-authentication                                                | Authentication plugin | Security              |

## Documentation

_Work in progress..._

## Changelog

This library follows the semantic versioning specification. Changelog is available [here](CHANGELOG.md).

## Authors

<table border="0">
  <tr>
    <td align="center">
      <a href="https://github.com/yjaaidi" style="color: white">
        <img src="https://github.com/yjaaidi.png?s=150" width="150"/>
      </a>
      <p><strong>Younes Jaaidi</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/yjaaidi">@yjaaidi</a></p>
    </td>
    <td align="center">
      <a href="https://github.com/Edouardbozon" style="color: white">
        <img src="https://github.com/Edouardbozon.png?s=150" width="150"/>
      </a>
      <p><strong>Edouard Bozon</strong></p>
      <p><strong>twitter: </strong><a href="https://twitter.com/edouardbozon">@edouardbozon</a></p>
    </td>
  </tr>
</table>

## License

This project is MIT licensed.
