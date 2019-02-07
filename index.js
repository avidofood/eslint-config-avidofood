module.exports = {
    "extends": ["airbnb-base", "plugin:vue/base", "plugin:vue/essential", "plugin:vue/strongly-recommended"],
    "parserOptions": {
        "parser": "babel-eslint",
    },
    rules: {
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        indent: ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            // MemberExpression: null,
            FunctionDeclaration: {
              parameters: 1,
              body: 1
            },
            FunctionExpression: {
              parameters: 1,
              body: 1
            },
            CallExpression: {
              arguments: 1
            },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
            ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
            ignoreComments: false
          }],
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        'vue/require-prop-types': 'off', //in future I need this,
        'vue/require-default-prop': 'off', //in future I can fix this
        'no-mixed-spaces-and-tabs': 'off', //we want to use js keychain dots of methods ...
        'import/no-unresolved': 'off',
        'import/first': 'off',
        'no-undef': 'off', //bug in app.js because required vue..
        'import/no-extraneous-dependencies': 'off', //some are set to devDepen
        'no-use-before-define': 'off',
        'prefer-destructuring': ['error', {
            VariableDeclarator: {
              array: false,
              object: true,
            },
            AssignmentExpression: {
              array: true,
              object: false, //that was stupid in canvas..
            },
          }, {
            enforceForRenamedProperties: false,
        }],
        'no-tabs': 'off', //why shouldn't I use tab?
    },
    "globals": {
        "trans": false //ignores trans in vue
    }
};