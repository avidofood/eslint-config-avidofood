import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';
import config from '../index.js';

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
