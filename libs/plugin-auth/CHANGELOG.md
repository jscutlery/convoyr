# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/jscutlery/convoyr/compare/v3.1.0...v3.2.0) (2020-05-23)

**Note:** Version bump only for package @convoyr/plugin-auth





# [3.1.0](https://github.com/jscutlery/convoyr/compare/v3.0.0...v3.1.0) (2020-05-20)

**Note:** Version bump only for package @convoyr/plugin-auth





# [3.0.0](https://github.com/jscutlery/convoyr/compare/v2.2.0...v3.0.0) (2020-04-24)


### Features

* ✅ `NextFn` to `NextHandler` object ([530cb97](https://github.com/jscutlery/convoyr/commit/530cb97dab4404bfc9e2ad5b035a855a73b95a39))


### BREAKING CHANGES

* The `NextFn` type used for calling the next plugin and
the final HTTP handler is removed in favor of an object following the `NextHandler` interface.





# [2.2.0](https://github.com/jscutlery/convoyr/compare/v2.1.1...v2.2.0) (2020-04-23)

**Note:** Version bump only for package @convoyr/plugin-auth

## [2.1.1](https://github.com/jscutlery/convoyr/compare/v2.1.0...v2.1.1) (2020-04-16)

**Note:** Version bump only for package @convoyr/plugin-auth

# [2.1.0](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.1.0) (2020-04-11)

### Bug Fixes

- **plugin-auth:** 🐞 don't send token if null or undefined ([b9eacd5](https://github.com/jscutlery/convoyr/commit/b9eacd585cb06b36d8e9e21cdf79a07c16a9258d))
- **plugin-auth:** 🐞 fix token nullish stream value ([afb73d7](https://github.com/jscutlery/convoyr/commit/afb73d70fcf38fd3bdcc4bf4aae8e036e8c7fb57))
- **plugin-auth:** 🐞 forward error instead of silently fail ([135db10](https://github.com/jscutlery/convoyr/commit/135db100e52e451dc7fe4e216af1fb14af9034ea))

### Features

- **plugin-auth:** ✅ make sure we are always using the latest token ([e1e313d](https://github.com/jscutlery/convoyr/commit/e1e313d1e1a1361cbcf78fac08c99dc7eaa42705))

## [2.0.2](https://github.com/jscutlery/convoyr/compare/v2.0.1...v2.0.2) (2020-04-08)

### Bug Fixes

- **plugin-auth:** 🐞 forward error instead of silently fail ([135db10](https://github.com/jscutlery/convoyr/commit/135db100e52e451dc7fe4e216af1fb14af9034ea))

## [2.0.1](https://github.com/jscutlery/convoyr/compare/v2.0.0...v2.0.1) (2020-04-07)

### Bug Fixes

- **plugin-auth:** 🐞 fix `onUnauthorized` function call ([fc4b030](https://github.com/jscutlery/convoyr/commit/fc4b030c1872bc6b3f4fd5ced3748099aa2e7f9e))

# [2.0.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v2.0.0) (2020-04-01)

### Features

- ✅ rename `condition` to `shouldHandleRequest` ([9e93b5d](https://github.com/jscutlery/convoyr/commit/9e93b5d20e4c3cb0ef94b5b6a1440565b685b6c7))

### BREAKING CHANGES

- rename `condition` to `shouldHandleRequest`

Co-authored-by: Edouard Bozon <bozonedouard@gmail.com>

# [1.2.0](https://github.com/jscutlery/convoyr/compare/v1.1.0...v1.2.0) (2020-03-31)

**Note:** Version bump only for package @convoyr/plugin-auth

# [1.1.0](https://github.com/jscutlery/convoyr/compare/v1.0.0...v1.1.0) (2020-01-14)

**Note:** Version bump only for package @convoyr/plugin-auth
