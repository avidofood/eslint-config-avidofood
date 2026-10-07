# Changelog

## 5.0.0

### Breaking changes

- The config needs ESLint 10. For ESLint 9, use version 4.

### Changed

- `eslint-plugin-import` does not support ESLint 10. `eslint-plugin-import-x` replaces it. It has the same rules and is registered as `import`, so the rule names stay `import/...`.
- ESLint 10 reports `globalThis` in `no-shadow-restricted-names` by default. The config keeps the earlier behavior.
- The import rules use the node resolver of airbnb through `importXResolverCompat`, as before. Packages with `main` and `jsnext:main` resolve the same way.
- Known difference: `import/no-named-as-default` in eslint-plugin-import-x does not check names that a module re-exports with `export * from` or `export { name } from`. eslint-plugin-import did.
- The other rules work as in 4.0.0.
- Releases are published from GitHub Actions with npm trusted publishing.

## 4.0.0

### Breaking changes

- The config is a flat config for ESLint 9. ESLint 8 and `.eslintrc` files are no longer supported. For ESLint 8, use version 3.
- The package is an ES module. Import it in `eslint.config.js`.

### Changed

- The rules of eslint-config-airbnb-base 15.0.0 are part of this package (folder `airbnb`), because airbnb-base only supports ESLint 8. The rules are the same as in 3.2.0.
- eslint-plugin-vue 9 → 10. This adds the rules `vue/no-deprecated-delete-set`, `vue/no-deprecated-model-definition` and `vue/valid-define-options`.
- `eslint-plugin-import`, `eslint-plugin-vue` and `vue-eslint-parser` are dependencies of this package. You do not need to install them yourself.
- ESLint 9 changed the defaults of `no-unused-vars` (`caughtErrors`), `no-inner-declarations` and `no-useless-computed-key`. The config sets the ESLint 8 values, so these rules work as in 3.2.0.
- `.cjs` files are linted as CommonJS. Before, they were linted as ES modules.
- Your own `languageOptions.ecmaVersion` takes effect. The config only sets `languageOptions`, not `parserOptions`.
- The `vue/comment-directive` and `vue/jsx-uses-vars` rules now apply only to `.vue` files.

### Fixed

- The `lint` script works. It ran a command `lint`, which does not exist.
- The package has a LICENSE file.
- The new lockfile fixes all open Dependabot alerts. They came from dev dependencies.
- Tests check the config with JavaScript and Vue examples. A CI workflow runs lint and tests on Node 20, 22 and 24.

## 3.2.0 and older

No changelog. See the [commit history](https://github.com/avidofood/eslint-config-avidofood/commits/master).
