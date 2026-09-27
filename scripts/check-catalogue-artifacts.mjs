import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

// Do not echo matched content: a failure may identify private material.
const privateName = /(?:SHINOBIWAN_CATALOGUE_|catalogue-private|catalogue-readonly-seed|\.(?:xlsx|zip)$)/i;
// A2.2 necessarily ships schema keys. Detect embedded data, not parser vocabulary.
const privateContent = /SHINOBIWAN_Catalogue_Reconcilie|SHINOBIWAN_CATALOGUE_PREVIEW|["']schemaVersion["']\s*:\s*["']catalogue-readonly-seed-v1|\b[A-Z]{2}[A-Z0-9]{3}\d{7}\b/;
function embeddedSnapshot(content, file) {
  if (privateContent.test(content)) return true;
  const ast = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.JS);
  let found = false;
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const props = new Map(node.properties.filter(ts.isPropertyAssignment).map(p => [p.name.getText(ast).replace(/["']/g, ''), p.initializer]));
      if (['recordings','releases','appearances'].every(k => props.has(k)) && [...props.values()].some(v => ts.isArrayLiteralExpression(v) && v.elements.length > 0)) found = true;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast); return found;
}
// Keep the leak guard itself under executable regression coverage.
assert.ok(embeddedSnapshot('{"schemaVersion":"catalogue-readonly-seed-v1","recordings":[{}]}', 'probe.json'));
assert.ok(embeddedSnapshot('const x={recordings:[{}],releases:[],appearances:[]}', 'probe.js'));
assert.ok(!embeddedSnapshot('const schema="catalogue-readonly-seed-v1"; const x={recordings:recordings,releases:releases,appearances:appearances}', 'probe.js'));
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const staged = execFileSync('git', ['diff', '--cached', '--name-only', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
assert.ok(![...tracked, ...staged].some(file => privateName.test(file)), 'Private Catalogue source filename found in Git.');

let count = 0;
function scan(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    assert.ok(!privateName.test(entry.name), 'Private Catalogue asset filename found.');
    assert.ok(!entry.isSymbolicLink(), 'Runtime artifact scan must not follow external symlinks.');
    if (entry.isDirectory()) scan(file);
    else {
      const content = fs.readFileSync(file, 'utf8');
      assert.ok(!embeddedSnapshot(content, file), 'Private Catalogue data signature found in runtime source or bundle.');
      if (file.endsWith('.map')) {
        const map = JSON.parse(content);
        for (const source of map.sourcesContent ?? []) if (source) assert.ok(!embeddedSnapshot(source, 'map-source.js'), 'Private Catalogue data found in source map.');
      }
      count++;
    }
  }
}
assert.ok(fs.existsSync('dist/index.html'), 'Build dist before running the artifact gate.');
for (const dir of ['src', 'public', 'dist']) scan(dir);
console.log(`Catalogue artifact PASS: ${count} runtime source/build files scanned; no private pack filenames or seed signatures in Git/runtime artifacts.`);
