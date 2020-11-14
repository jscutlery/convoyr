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
  <a href="https://www.npmjs.com/package/@convoyr/core" rel="nofollow">
    <img src="https://badgen.net/npm/v/@convoyr/core">
  </a>
</div>

<p align="center">
  Reactive <strong>HTTP extensions</strong> for Angular.
</p>

# Motivation

Enriching HTTP clients with capabilities related to **security**, **performance** or **resilience** is a common need but it is also an error-prone and sometimes complex task.

**Convoyr** has been built with one goal in mind: helping you focus on your apps' features instead of the transport layer's boilerplate and matters... and without any trade-off.

- 🅰️ **Convoyr** is **Angular-ready** and makes [interceptors](https://angular.io/api/common/http/HttpInterceptor) implementation safe and easy,
- ⚡️ **Convoyr** is **fully reactive** and based on [RxJS](https://rxjs-dev.firebaseapp.com/),
- 🔋 **Convoyr** has **batteries included** as it comes with some useful plugins,
- 📈 **Convoyr** is **progressive** because you can start using it without having to rewrite all your HTTP calls,
- 🧱 **Convoyr** is **easily extendable** as you can create and share your own plugins.

# Quick Start

1. Install core packages inside your project.

```bash
yarn add @convoyr/core @convoyr/angular # or npm install @convoyr/core @convoyr/angular
```

2. Install plugins packages.

```bash
yarn add @convoyr/plugin-cache @convoyr/plugin-retry # or npm install @convoyr/plugin-cache @convoyr/plugin-retry
```

3. Import the module and define plugins you want to use.

```ts
import { ConvoyrModule } from '@convoyr/angular';
import { createCachePlugin } from '@convoyr/plugin-cache';
import { createRetryPlugin } from '@convoyr/plugin-retry';

@NgModule({
  imports: [
    ConvoyrModule.forRoot({
      plugins: [
        createCachePlugin(),
        createRetryPlugin(),
      ],
    }),
  ]
})
export class AppModule {}
```

# How It Works

The main building block is the plugin. A plugin is a simple object that lets you intercept network communications and control or transform them easily. Like an `HttpInterceptor` a plugin may transform outgoing request and the response stream as well before passing it to the next plugin. The library comes with a built-in [plugin collection](#built-in-plugins) to provide useful behaviors for your apps and to tackle the need to rewrite redundant logic between projects. It's also possible to [create your own plugin](./docs/custom-plugin.md#implementing-custom-plugins) for handling custom behaviors.

# Built-in Plugins

This project is a monorepo that includes the following packages.

| Package                                      | Name         | Description                                                       |
| -------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| [@convoyr/plugin-auth](./libs/plugin-auth)   | Auth plugin  | Handle authentication                                             |
| [@convoyr/plugin-cache](./libs/plugin-cache) | Cache plugin | Respond with cached results first then with fresh data when ready |
| [@convoyr/plugin-retry](./libs/plugin-retry) | Retry plugin | Retry failed requests with exponential backoff                    |

# Custom Plugins

Follow the guide to [create your own custom plugins](./docs/custom-plugin.md).

# Resources

Here is a list of useful resources related to Convoyr.

- 📝 Blog post [Introducing Convoyr, the reactive HTTP extensions for Angular](https://www.codamit.dev/introducing-convoyr)
- 📝 Blog post [Plugin Testing in Convoyr](https://www.codamit.dev/plugin-testing-in-convoyr)

# Roadmap

For incoming evolutions [see our board](https://github.com/jscutlery/convoyr/projects/1).

# Changelog

For new features or breaking changes [see the changelog](CHANGELOG.md).

# Contributing

See our [contributing guide](./CONTRIBUTING.md) before starting. Contributions of any kind welcome!

# Contributors

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://marmicode.io/"><img src="https://avatars2.githubusercontent.com/u/2674658?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Younes Jaaidi</b></sub></a><br /><a href="https://github.com/jscutlery/convoyr/issues?q=author%3Ayjaaidi" title="Bug reports">🐛</a> <a href="https://github.com/jscutlery/convoyr/commits?author=yjaaidi" title="Code">💻</a> <a href="https://github.com/jscutlery/convoyr/commits?author=yjaaidi" title="Documentation">📖</a> <a href="#example-yjaaidi" title="Examples">💡</a> <a href="#ideas-yjaaidi" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://www.codamit.dev/"><img src="https://avatars0.githubusercontent.com/u/8522558?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Edouard Bozon</b></sub></a><br /><a href="https://github.com/jscutlery/convoyr/issues?q=author%3Aedbzn" title="Bug reports">🐛</a> <a href="https://github.com/jscutlery/convoyr/commits?author=edbzn" title="Code">💻</a> <a href="https://github.com/jscutlery/convoyr/commits?author=edbzn" title="Documentation">📖</a> <a href="#example-edbzn" title="Examples">💡</a> <a href="#ideas-edbzn" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://www.it-dir.co"><img src="https://avatars0.githubusercontent.com/u/2479323?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pierre-Edouard Galtier</b></sub></a><br /><a href="https://github.com/jscutlery/convoyr/commits?author=pegaltier" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

# License

This project is MIT licensed.
