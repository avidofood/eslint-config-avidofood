# airbnb-base rules

These files are the rules of [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) 15.0.0, under the MIT license in `LICENSE.md` (Copyright (c) 2012 Airbnb).

eslint-config-airbnb-base only supports ESLint 8. `../index.js` turns these files into a flat config for ESLint 9.

Changes against 15.0.0:

- The files end in `.cjs`, because this package is an ES module.
- `style.cjs`: `function-paren-newline` is set to `multiline-arguments` directly. The original chose this value with `semver` for ESLint 6 and newer.
