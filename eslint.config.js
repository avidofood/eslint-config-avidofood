import avidofood from './index.js';

export default [
    {
        // The airbnb rules are copied as they are, see airbnb/README.md
        ignores: ['airbnb/**'],
    },
    ...avidofood,
    {
        // This package is ESM, so relative imports need the file extension
        rules: {
            'import/extensions': 'off',
        },
    },
];
