## eslint-config-avidofood

This package provides shareable [ESLint](http://eslint.org/) configurations for JavaScript projects that conform with my coding style.

### Installation

To make use of this config, install ESLint (>= 2.0) and this package as a development dependency of your project:

    npm install eslint eslint-config-avidofood --save-dev

Next, add an `eslintConfig` member to your project's `package.json`.  At a minimum, this config file must include an `extends` member:

```json
{
  "eslintConfig": {
    "extends": "avidofood"
  }
}
```

See the ESLint [configuration guide](http://eslint.org/docs/user-guide/configuring) for details on additional configuration options.  Any rules configured in your `package.json` file will override those provided by the `eslint-config-avidofood` package.