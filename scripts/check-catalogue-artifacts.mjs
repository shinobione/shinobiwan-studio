import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Do not echo matched content: a failure may identify private material.
const privateName = /(?:SHINOBIWAN_CATALOGUE_|catalogue-private|catalogue-readonly-seed|\.(?:xlsx|zip)$)/i;
const privateContent = /catalogue-readonly-seed-v1|unverifiedAmuseCandidates|soundcloudRecent|sourceSheets|SHINOBIWAN_Catalogue_Reconcilie|SHINOBIWAN_CATALOGUE_PREVIEW/i;
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
      assert.ok(!privateContent.test(fs.readFileSync(file, 'utf8')), 'Private Catalogue seed signature found in runtime source or bundle.');
      count++;
    }
  }
}
assert.ok(fs.existsSync('dist/index.html'), 'Build dist before running the artifact gate.');
for (const dir of ['src', 'public', 'dist']) scan(dir);
console.log(`Catalogue artifact PASS: ${count} runtime source/build files scanned; no private pack filenames or seed signatures in Git/runtime artifacts.`);
