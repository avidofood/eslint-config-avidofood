## eslint-config-avidofood

This package provides shareable [ESLint](https://eslint.org/) configurations for JavaScript and Vue projects that conform with my coding style.

The config contains:

- the rules of [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) 15
- the `strongly-recommended` rules of [eslint-plugin-vue](https://eslint.vuejs.org/) for Vue 3
- my changes: 4 spaces, single quotes, semicolons, and some rules turned off (see `index.js`)

### Installation

Version 4 needs ESLint 9. Install ESLint and this package as development dependencies:

    npm install --save-dev eslint@9 eslint-config-avidofood

Create `eslint.config.js` in the root of your project:

```js
import avidofood from 'eslint-config-avidofood';

export default [
    ...avidofood,
    {
        // Your own rules override the rules of this package
        rules: {},
    },
];
```

If your `package.json` has no `"type": "module"`, name the file `eslint.config.mjs`.

Then lint your project with `npx eslint .`. ESLint 9 lints `.js`, `.mjs`, `.cjs` and `.vue` files without the old `--ext` option. The config lints `.cjs` files as CommonJS.

See the ESLint [configuration guide](https://eslint.org/docs/latest/use/configure/) for details.

### Upgrade from version 3

1. Install ESLint 9 and version 4 of this package.
2. Remove `eslint-plugin-import`, `eslint-plugin-vue` and `eslint-config-airbnb-base` from your dependencies. This package brings the plugins it needs.
3. Create `eslint.config.js` as shown above.
4. Delete `.eslintrc.js` or the `eslintConfig` entry in `package.json`. ESLint 9 ignores them.
5. Remove `--ext` from your lint script.

The rules are the same as in version 3.2.0. Version 4 adds three rules from eslint-plugin-vue 10: `vue/no-deprecated-delete-set`, `vue/no-deprecated-model-definition` and `vue/valid-define-options`.

### Older ESLint versions

- ESLint 8: use version 3 (`npm install --save-dev eslint-config-avidofood@3`).
- ESLint 6 and older: use version 1.1.0.

### Development and releases

Run `npm test` and `npm run lint`.

To release, set the new version in `package.json`, add it to `CHANGELOG.md` and merge into `master`. Then push a tag with the version number, for example `git tag 4.0.1 && git push origin 4.0.1`. The `Release` workflow runs the lint and the tests and publishes the package to npm with npm trusted publishing, so it needs no npm token and no 2FA prompt. Run the workflow by hand to check the setup. That run publishes nothing.

On npmjs.com, the trusted publisher of the package points to this repository, the workflow `release.yml` and the environment `npm-publish`. Under "Allowed actions", it must allow `npm publish`. A new trusted publisher expires if it does not publish within 2 days, so create it right before a release.

### License

MIT. The folder `airbnb` contains the rules of eslint-config-airbnb-base 15.0.0 under the MIT license of Airbnb, see `airbnb/README.md`. That package only supports ESLint 8, so this package includes its rules.
