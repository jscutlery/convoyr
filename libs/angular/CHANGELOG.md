# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/jscutlery/convoyr/compare/v3.1.0...v3.2.0) (2020-05-23)


### Bug Fixes

* 📦 update angular monorepo to v9.1.9 ([ebbf2c3](https://github.com/jscutlery/convoyr/commit/ebbf2c3a0813b6070b263ef6a0d2b697112876ad))
* **angular:** 🐞 handle and convert `HttpErrorResponse` ([84dfb74](https://github.com/jscutlery/convoyr/commit/84dfb7485009b9bedfcab71142895fbc3e7abc62))





# [3.1.0](https://github.com/jscutlery/convoyr/compare/v3.0.0...v3.1.0) (2020-05-20)


### Bug Fixes

* 📦 update angular monorepo to v9.1.4 ([1d36585](https://github.com/jscutlery/convoyr/commit/1d365857e34d46231ddb2ecbf11b9385608f2309))
* 📦 update angular monorepo to v9.1.5 ([c31b271](https://github.com/jscutlery/convoyr/commit/c31b2718efd2101982fe1d69db753e221f61ebe0))
* 📦 update angular monorepo to v9.1.6 ([abe038d](https://github.com/jscutlery/convoyr/commit/abe038d6363b600e3f1116b605e739a22b0b85f8))
* 📦 update angular monorepo to v9.1.7 ([1cd5b38](https://github.com/jscutlery/convoyr/commit/1cd5b38c66c1f70e62fbc5e0829839b5c5273810))





# [3.0.0](https://github.com/jscutlery/convoyr/compare/v2.2.0...v3.0.0) (2020-04-24)


### Features

* ✅ `NextFn` to `NextHandler` object ([530cb97](https://github.com/jscutlery/convoyr/commit/530cb97dab4404bfc9e2ad5b035a855a73b95a39))


### BREAKING CHANGES

* The `NextFn` type used for calling the next plugin and
the final HTTP handler is removed in favor of an object following the `NextHandler` interface.





# [2.2.0](https://github.com/jscutlery/convoyr/compare/v2.1.1...v2.2.0) (2020-04-23)

### Bug Fixes

- 📦 update angular monorepo to v9.1.3 ([fb3a984](https://github.com/jscutlery/convoyr/commit/fb3a984655ebbb0df68b43d32efcd57bc952a615))

## [2.1.1](https://github.com/jscutlery/convoyr/compare/v2.1.0...v2.1.1) (2020-04-16)

### Bug Fixes

- 📦 update angular monorepo to v9.1.2 ([a5a5b8f](https://github.com/jscutlery/convoyr/commit/a5a5b8f3688f98122d3e53167d3a975f076d80f8))

# [2.1.0](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.1.0) (2020-04-11)

**Note:** Version bump only for package @convoyr/angular

## [2.0.2](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.0.2) (2020-04-08)

**Note:** Version bump only for package @convoyr/angular

## [2.0.1](https://github.com/jscutlery/convoyr/compare/v2.0.0...v2.0.1) (2020-04-07)

**Note:** Version bump only for package @convoyr/angular

# [2.0.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v2.0.0) (2020-04-01)

**Note:** Version bump only for package @convoyr/angular

# [1.2.0](https://github.com/jscutlery/convoyr/compare/v1.1.0...v1.2.0) (2020-03-31)

**Note:** Version bump only for package @convoyr/angular

# [1.1.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v1.1.0) (2020-01-14)

**Note:** Version bump only for package @convoyr/angular

# [1.0.0](https://github.com/jscutlery/convoyr/compare/v0.1.1...v1.0.0) (2020-01-06)

- feat!: :white_check_mark: use an object as plugin handler ([47a5e9f](https://github.com/jscutlery/convoyr/commit/47a5e9f87d9c4256578a005d77516cb2d7034327))

### BREAKING CHANGES

- the plugin handler become an object

## [0.1.1](https://github.com/jscutlery/convoyr/compare/v0.1.0...v0.1.1) (2019-11-20)

**Note:** Version bump only for package @convoyr/angular

# 0.1.0 (2019-11-19)

### Bug Fixes

- :beetle: package dependency build ([b510752](https://github.com/jscutlery/convoyr/commit/b51075254dc2e337e3e8b5ef293156abf4bf54ff))
- :beetle: use path mapping to internally expose `_createSpyPlugin` ([9f1e845](https://github.com/jscutlery/convoyr/commit/9f1e8459738c2d0571cde0e95d4f9be19d64a440))
- 🐞 fix AOT issue "Expression form not supported" when using inline type with `@Inject` ([5a93caf](https://github.com/jscutlery/convoyr/commit/5a93caf536df1df9e01e3049cc2d8aed2f088eba))
- 🐞 fix AOT issue due to logic in `forRoot` ([9f2a093](https://github.com/jscutlery/convoyr/commit/9f2a093dda9b5f42b47fefcdefa735f1582380be))

### Features

- :white_check_mark: split packages ([77b22c0](https://github.com/jscutlery/convoyr/commit/77b22c01f5de59f02aa28e8bd3fd46e2c49d3bff))
