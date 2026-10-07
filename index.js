import importPlugin from 'eslint-plugin-import';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import bestPractices from './airbnb/best-practices.cjs';
import errors from './airbnb/errors.cjs';
import node from './airbnb/node.cjs';
import style from './airbnb/style.cjs';
import variables from './airbnb/variables.cjs';
import es6 from './airbnb/es6.cjs';
import imports from './airbnb/imports.cjs';
import strict from './airbnb/strict.cjs';

// The rules of eslint-config-airbnb-base 15, which only supports ESLint 8. See airbnb/README.md.
// Same order as the "extends" list of airbnb-base, so a later file wins on the same rule.
const airbnbRules = [bestPractices, errors, node, style, variables, es6, imports, strict]
    .reduce((rules, file) => ({ ...rules, ...file.rules }), {});

// ESLint 9 changed the defaults of these rules. The options keep the behavior of ESLint 8,
// so that the rules work as in version 3.
const eslint8Defaults = {
    'no-unused-vars': ['error', {
        ...variables.rules['no-unused-vars'][1],
        caughtErrors: 'none',
    }],
    'no-inner-declarations': ['error', 'functions', { blockScopedFunctions: 'disallow' }],
    'no-useless-computed-key': ['error', { enforceForClassMembers: false }],
};

export default [
    {
        name: 'avidofood/airbnb-base',
        plugins: {
            import: importPlugin,
        },
        settings: imports.settings,
        languageOptions: {
            globals: {
                ...globals.es2015, // env es6 of airbnb-base
                ...globals.node, // env node of airbnb-base
            },
        },
        rules: {
            ...airbnbRules,
            ...eslint8Defaults,
        },
    },
    ...vue.configs['flat/strongly-recommended'],
    {
        name: 'avidofood',
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                trans: 'readonly', // ignores trans in vue
            },
        },
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            indent: ['error', 4, {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                // MemberExpression: null,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1,
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1,
                },
                CallExpression: {
                    arguments: 1,
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
                ignoreComments: false,
            }],
            'vue/html-indent': ['error', 4, {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: [],
            }],
            'vue/require-prop-types': 'off', // in future I need this,
            'vue/require-default-prop': 'off', // in future I can fix this
            'no-mixed-spaces-and-tabs': 'off', // we want to use js keychain dots of methods ...
            'import/no-unresolved': 'off',
            'import/first': 'off',
            'no-undef': 'off', // bug in app.js because required vue..
            'import/no-extraneous-dependencies': 'off', // some are set to devDepen
            'no-use-before-define': 'off',
            'prefer-destructuring': ['error', {
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
                AssignmentExpression: {
                    array: true,
                    object: false, // that was stupid in canvas..
                },
            }, {
                enforceForRenamedProperties: false,
            }],
            'no-tabs': 'off', // why shouldn't I use tab?
        },
    },
    {
        // .cjs files are CommonJS, also in projects with "type": "module"
        name: 'avidofood/commonjs',
        files: ['**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs',
        },
    },
];
