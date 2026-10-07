import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { ESLint } from 'eslint';
import config from '../index.js';

const require = createRequire(import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });

const lint = async (code, filePath) => {
    const [result] = await eslint.lintText(code, { filePath });
    if (result.messages.some((message) => message.fatal)) {
        throw new Error(result.messages.map((message) => message.message).join('\n'));
    }
    return result.messages.map((message) => message.ruleId);
};

const cleanScript = `import { ref } from 'vue';

const settings = { width: 0 };

export default function useWidth(options) {
    const { width } = options;
    const value = ref(width ?? settings.width);
    return trans(value);
}
`;

const cleanComponent = `<template>
    <section class="video">
        <h1 v-if="title">
            {{ title }}
        </h1>
    </section>
</template>

<script>
export default {
    props: {
        title: String,
    },
};
</script>
`;

test('accepts clean JavaScript', async () => {
    assert.deepEqual(await lint(cleanScript, 'src/clean.js'), []);
});

test('accepts a clean Vue component', async () => {
    assert.deepEqual(await lint(cleanComponent, 'src/CleanVideo.vue'), []);
});

test('requires 4 spaces, single quotes and semicolons', async () => {
    const rules = await lint('function a() {\n  return "b"\n}\n\na();\n', 'src/style.js');
    assert.ok(rules.includes('indent'));
    assert.ok(rules.includes('quotes'));
    assert.ok(rules.includes('semi'));
});

test('requires 4 spaces in Vue templates', async () => {
    const rules = await lint(cleanComponent.replace('    <section', '  <section'), 'src/IndentVideo.vue');
    assert.ok(rules.includes('vue/html-indent'));
});

test('keeps the airbnb rules', async () => {
    const rules = await lint('var a = 1;\nexport default a;\n', 'src/var.js');
    assert.ok(rules.includes('no-var'));
});

test('keeps the import rules', async () => {
    const rules = await lint('import a from \'./a\';\nimport a2 from \'./a\';\n\nexport default [a, a2];\n', 'src/imports.js');
    assert.ok(rules.includes('import/no-duplicates'));
});

test('keeps the Vue rules', async () => {
    const rules = await lint(cleanComponent.replace('v-if="title"', 'v-if="title" v-for="item in items"'), 'src/IfForVideo.vue');
    assert.ok(rules.includes('vue/no-use-v-if-with-v-for'));
});

test('destructures objects but not arrays in declarations', async () => {
    const objectRules = await lint('const options = {};\nconst width = options.width;\n\nexport default width;\n', 'src/object.js');
    assert.ok(objectRules.includes('prefer-destructuring'));
    const arrayRules = await lint('const list = [];\nconst first = list[0];\n\nexport default first;\n', 'src/array.js');
    assert.deepEqual(arrayRules, []);
});

test('turns off the rules that avidofood turned off', async () => {
    const code = 'import missing from \'does-not-exist\';\n\nexport default missing + undefinedGlobal;\n';
    assert.deepEqual(await lint(code, 'src/off.js'), []);
});

test('keeps the earlier behavior of no-shadow-restricted-names, changed in ESLint 10', async () => {
    const rules = await lint('export default function a(globalThis) {\n    return globalThis;\n}\n', 'src/shadow.js');
    assert.ok(!rules.includes('no-shadow-restricted-names'));

    const undefinedShadow = await lint('export default function a(undefined) {\n    return undefined;\n}\n', 'src/undefined.js');
    assert.ok(undefinedShadow.includes('no-shadow-restricted-names'));
});

test('keeps the ESLint 8 behavior of rules whose defaults changed in ESLint 9', async () => {
    const caught = await lint('try {\n    JSON.parse(\'{}\');\n} catch (error) {\n    JSON.parse(\'[]\');\n}\n', 'src/caught.js');
    assert.ok(!caught.includes('no-unused-vars'));

    const inner = await lint('export default function a(b) {\n    if (b) {\n        function c() {\n            return b;\n        }\n        return c();\n    }\n    return 0;\n}\n', 'src/inner.js');
    assert.ok(inner.includes('no-inner-declarations'));

    const computed = await lint('export default class A {\n    [\'b\']() {\n        return this;\n    }\n}\n', 'src/computed.js');
    assert.ok(!computed.includes('no-useless-computed-key'));
});

test('lints .cjs files as CommonJS', async () => {
    const [commonjs] = await eslint.lintText('module.exports = { a: 1 };\n', { filePath: 'src/commonjs.cjs' });
    assert.deepEqual(commonjs.messages, []);

    const [esm] = await eslint.lintText('export default 1;\n', { filePath: 'src/esm.cjs' });
    assert.ok(esm.messages.some((message) => message.fatal));
});

test('lets a project set its own ECMAScript version', async () => {
    const es2020 = new ESLint({
        overrideConfigFile: true,
        overrideConfig: [...config, { languageOptions: { ecmaVersion: 2020 } }],
    });
    const code = 'export default 1_000;\n';

    const [old] = await es2020.lintText(code, { filePath: 'src/old.js' });
    assert.ok(old.messages.some((message) => message.fatal));
    assert.deepEqual(await lint(code, 'src/latest.js'), []);
});

test('declares every required peer dependency of eslint-plugin-vue', async () => {
    const own = await readJson(new URL('../package.json', import.meta.url));
    const plugin = await readJson(require.resolve('eslint-plugin-vue/package.json'));
    const optional = plugin.peerDependenciesMeta ?? {};
    const required = Object.keys(plugin.peerDependencies)
        .filter((name) => !optional[name]?.optional);

    required.forEach((name) => {
        assert.ok(own.dependencies[name] || own.peerDependencies[name], `${name} is missing`);
    });
});
