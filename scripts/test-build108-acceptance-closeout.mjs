import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const receipt = read('docs/acceptance/BUILD108-REAL-USER-PASS.md');
const state = read('PROJECT_STATE.md');
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);

assert.ok(currentBuild >= 108, `Build108 acceptance closeout requires Build108 or a successor, got Build${currentBuild}.`);
assert.equal(pkg.version, release.match(/version:\s*'([^']+)'/)?.[1]);
assert.match(release, /build107AncestryMarker/);
if (currentBuild === 108) {
  assert.match(release, /version: '0\.19\.30'/);
  assert.match(release, /build: 108/);
  assert.match(release, /studio-focus-slice4-catalog-rebuild-generation-identity/);
} else {
  assert.match(release, /build108AncestryMarker/);
}
for (let build = 109; build <= Math.min(currentBuild - 1, 110); build += 1) {
  assert.match(release, new RegExp(`build${build}AncestryMarker`), `Build${currentBuild} must preserve Build${build} ancestry after accepted Build108.`);
}

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

assert.match(state, /Build108\s+COMPLETE|Build108 remains the accepted predecessor|Build108 remains/);
assert.match(state, /Build109/);
assert.match(state, /Acceptance\s+REAL USER PASS/);

console.log(`Build108 acceptance closeout PASS as immutable accepted ancestry under Studio Build${currentBuild}.`);
