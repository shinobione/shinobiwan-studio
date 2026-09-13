import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import path from 'node:path';
import * as kernel from '../src/vendor/catalog-projection-kernel.mjs';
const revive = (_, v) => v && typeof v === 'object' && 'number' in v ? Number(v.number) : v;
const baseline = JSON.parse(fs.readFileSync('scripts/fixtures/build107-baseline.json','utf8'), revive);
for (const test of baseline.cases) {
  const before = structuredClone(test.args);
  assert.deepEqual(kernel[test.fn](...test.args), test.expected, test.name);
  assert.deepEqual(kernel[test.fn](...test.args), test.expected, `${test.name}: repeatability`);
  assert.deepEqual(test.args, before, `${test.name}: no mutation`);
}
const source = fs.readFileSync('src/catalog-intelligence.ts','utf8');
const implementations = fs.readdirSync('src', {recursive:true}).filter(file => /\.(?:ts|tsx|js|mjs)$/.test(file) && /\* 37 \+ 11/.test(fs.readFileSync(path.join('src',file),'utf8'))).map(file => file.replaceAll('\\','/'));
assert.deepEqual(implementations, ['vendor/catalog-projection-kernel.mjs'], 'Only the vendored production solver');
assert.match(source, /import \{ normalize as normalizeVector, dot, powerComponent \} from '\.\/vendor\/catalog-projection-kernel.mjs'/);
assert.doesNotMatch(source, /function (?:normalizeVector|dot|powerComponent)\(/);
assert.doesNotMatch(source, /iteration < 42|index \* 37/);
const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll("'./vendor/catalog-projection-kernel.mjs'", JSON.stringify(new URL('../src/vendor/catalog-projection-kernel.mjs',import.meta.url).href));
const module = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
for (const {entries, expected} of baseline.studioCatalogs) {
  const before = structuredClone(entries);
  assert.deepEqual(module.analyzeCatalog(entries), expected);
  assert.deepEqual(entries, before);
}
console.log(`PASS Build107: ${baseline.cases.length} exact kernel cases and ${baseline.studioCatalogs.length} unchanged whole catalogs.`);
