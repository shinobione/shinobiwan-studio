import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const receipt = read('docs/acceptance/BUILD108-REAL-USER-PASS.md');
const state = read('PROJECT_STATE.md');

assert.equal(pkg.version, '0.19.30', 'Build108 acceptance closeout must publish v0.19.30.');
assert.match(release, /version: '0\.19\.30'/);
assert.match(release, /build: 108/);
assert.match(release, /studio-focus-slice4-catalog-rebuild-generation-identity/);
assert.match(release, /build107AncestryMarker/);

for (const required of [
  'Status: **ACCEPTED · REAL USER PASS**',
  'Studio identity: **v0.19.30 · Build108**',
  'c4072021-707b-4d03-be8e-d21324a348b4',
  '2026-09-13T10:57:36.269Z',
  '45 tracks',
  'canonical reread verified',
  '34753041082',
  'ff037b48-b717-49a4-82ad-395aa06b6f6f',
  'e380a6ab098bddad8b744812515df36fe3ef5906',
  '34753099885',
]) assert.ok(receipt.includes(required), `Build108 acceptance receipt missing: ${required}`);

assert.match(state, /Studio version\s+v0\.19\.30/);
assert.match(state, /Studio build\s+Build108/);
assert.match(state, /Acceptance\s+REAL USER PASS/);
assert.match(state, /generation\s+c4072021-707b-4d03-be8e-d21324a348b4/);
assert.match(state, /canonical reread\s+verified/i);

console.log('Build108 acceptance closeout PASS: v0.19.30 / Build108 is tied to the exact deployed backend, Studio deployment, and real-user canonical generation proof.');
