import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const receipt = read('docs/acceptance/BUILD108-REAL-USER-PASS.md');
const state = read('PROJECT_STATE.md');

assert.ok(['0.19.30', '0.19.31', '0.19.32'].includes(pkg.version), 'Build108 acceptance closeout must remain valid under accepted Build109 and Build110 successors.');
if (pkg.version === '0.19.30') {
  assert.match(release, /version: '0\.19\.30'/);
  assert.match(release, /build: 108/);
  assert.match(release, /studio-focus-slice4-catalog-rebuild-generation-identity/);
} else if (pkg.version === '0.19.31') {
  assert.match(release, /version: '0\.19\.31'/);
  assert.match(release, /build: 109/);
  assert.match(release, /studio-focus-slice4-track-create-operation-identity/);
  assert.match(release, /build108AncestryMarker/);
} else {
  assert.match(release, /version: '0\.19\.32'/);
  assert.match(release, /build: 110/);
  assert.match(release, /studio-focus-build110-human-first-premium-ux/);
  assert.match(release, /build108AncestryMarker/);
  assert.match(release, /build109AncestryMarker/);
}
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

assert.match(state, /Build108\s+COMPLETE|Build108 remains the accepted predecessor|Build108 remains/);
assert.match(state, /Build109/);
assert.match(state, /Acceptance\s+REAL USER PASS/);

console.log('Build108 acceptance closeout PASS as immutable accepted ancestry under the current Studio successor runtime.');
