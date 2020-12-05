# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.0.0](https://github.com/jscutlery/convoyr/compare/v4.0.0...v5.0.0) (2020-12-05)


### ⚠ BREAKING CHANGES

* **testing:** This breakes `PluginTester` references, the `mockHttpHandler` function should be renamed in `createHttpHandlerMock`.

### Bug Fixes

* **core:** 🐞 handle synchronous error and log notification ([1ec3f72](https://github.com/jscutlery/convoyr/commit/1ec3f723cf9a918c2ac8e3389328d47ed01a6a0f))


* **testing:** 🛠  rename to `createHttpHandlerMock` fn ([03a3308](https://github.com/jscutlery/convoyr/commit/03a3308221f35c411b5359e5bc598214bcebcb95))

# [4.0.0](https://github.com/jscutlery/convoyr/compare/v3.2.0...v4.0.0) (2020-05-30)


### Features

* **testing:** ✅ run Convoyr core in `PluginTester` ([6f646b1](https://github.com/jscutlery/convoyr/commit/6f646b10ef5d8340bff9071090fd3fd950024e8a))


### BREAKING CHANGES

* **testing:** PluginTester args are changed to the following `PluginTesterArgs` interface. Now the plugin-tester executes the `shouldHandleRequest` function throught Convoyr core.





# [3.2.0](https://github.com/jscutlery/convoyr/compare/v3.1.0...v3.2.0) (2020-05-23)


### Bug Fixes

* **core:** 🐞 infer body correctly for `ConvoyrResponse` ([c6f92f0](https://github.com/jscutlery/convoyr/commit/c6f92f09f8eef2876121fda31b2a78f4bda76fe1))


### Features

* **core:** ✅ add `matchPath` matcher ([af9c348](https://github.com/jscutlery/convoyr/commit/af9c348106c2061bfcb9fb0a9ea1a8fc669d396d))





# [3.1.0](https://github.com/jscutlery/convoyr/compare/v3.0.0...v3.1.0) (2020-05-20)


### Features

* **core:** ✅ add `matchResponseType` matcher ([3071358](https://github.com/jscutlery/convoyr/commit/30713584c7fd099a1bf5f7e97b4e7b23c81c0b86))





# [3.0.0](https://github.com/jscutlery/convoyr/compare/v2.2.0...v3.0.0) (2020-04-24)


### Features

* ✅ `NextFn` to `NextHandler` object ([530cb97](https://github.com/jscutlery/convoyr/commit/530cb97dab4404bfc9e2ad5b035a855a73b95a39))


### BREAKING CHANGES

* The `NextFn` type used for calling the next plugin and
the final HTTP handler is removed in favor of an object following the `NextHandler` interface.





# [2.2.0](https://github.com/jscutlery/convoyr/compare/v2.1.1...v2.2.0) (2020-04-23)

### Features

- **core:** ✅ add `not` operator ([1375107](https://github.com/jscutlery/convoyr/commit/1375107e16852f2b896872254af55be5e9174fc3))
- **core:** ✅ handle async conditions in `and` operator ([d0574a0](https://github.com/jscutlery/convoyr/commit/d0574a0074685841bbd778c1cad2193673b3b40e))
- **core:** ✅ handle async conditions in `or` operator ([172b321](https://github.com/jscutlery/convoyr/commit/172b32116249d8a0de01d541c4ded4eae10199b8))

## [2.1.1](https://github.com/jscutlery/convoyr/compare/v2.1.0...v2.1.1) (2020-04-16)

**Note:** Version bump only for package @convoyr/core

# [2.1.0](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.1.0) (2020-04-11)

**Note:** Version bump only for package @convoyr/core

## [2.0.2](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.0.2) (2020-04-08)

**Note:** Version bump only for package @convoyr/core

## [2.0.1](https://github.com/jscutlery/convoyr/compare/v2.0.0...v2.0.1) (2020-04-07)

**Note:** Version bump only for package @convoyr/core

# [2.0.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v2.0.0) (2020-04-01)

### Features

- ✅ rename `condition` to `shouldHandleRequest` ([9e93b5d](https://github.com/jscutlery/convoyr/commit/9e93b5d20e4c3cb0ef94b5b6a1440565b685b6c7))
- **core:** ✅ deprecate `condition` in favor of `shouldHandleRequest` ([11b7fbb](https://github.com/jscutlery/convoyr/commit/11b7fbb9b818b15699c3c441245b3a299c6f4851))

### BREAKING CHANGES

- rename `condition` to `shouldHandleRequest`

Co-authored-by: Edouard Bozon <bozonedouard@gmail.com>

# [1.2.0](https://github.com/jscutlery/convoyr/compare/v1.1.0...v1.2.0) (2020-03-31)

### Features

- **core:** ✅ deprecate `condition` in favor of `shouldHandleRequest` ([11b7fbb](https://github.com/jscutlery/convoyr/commit/11b7fbb9b818b15699c3c441245b3a299c6f4851))

# [1.1.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v1.1.0) (2020-01-14)

**Note:** Version bump only for package @convoyr/core

# [1.0.0](https://github.com/jscutlery/convoyr/compare/v0.1.1...v1.0.0) (2020-01-06)

### Features

- **plugin-cache:** ✅ add maxSize to MemoryStorage ([f7eb752](https://github.com/jscutlery/convoyr/commit/f7eb75250b189d9398070574e6b19a9f5a36aa38))
- ✅ handle plugin-cache request condition ([9e1bff6](https://github.com/jscutlery/convoyr/commit/9e1bff644d3b4cb4b52ec2e20bb793fa050f7517))

* feat!: :white_check_mark: use an object as plugin handler ([47a5e9f](https://github.com/jscutlery/convoyr/commit/47a5e9f87d9c4256578a005d77516cb2d7034327))

### BREAKING CHANGES

- the plugin handler become an object

## [0.1.1](https://github.com/jscutlery/convoyr/compare/v0.1.0...v0.1.1) (2019-11-20)

**Note:** Version bump only for package @convoyr/core

# 0.1.0 (2019-11-19)

### Bug Fixes

- :beetle: use path mapping to internally expose `_createSpyPlugin` ([9f1e845](https://github.com/jscutlery/convoyr/commit/9f1e8459738c2d0571cde0e95d4f9be19d64a440))

### Features

- :white_check_mark: split packages ([77b22c0](https://github.com/jscutlery/convoyr/commit/77b22c01f5de59f02aa28e8bd3fd46e2c49d3bff))

## 0.0.1 (2019-10-11)

**Note:** Version bump only for package @jscutlery/core
