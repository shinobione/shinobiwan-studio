import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const admin = read('src/services/admin-api.ts');
const catalog = read('src/services/catalog-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  "credentials: 'include'",
  "mode: 'cors'",
  "cache: 'no-store'",
  "'/api/studio/health'",
  "'/api/studio/tracks'",
  '/api/studio/tracks/${encodeURIComponent(trackId)}',
  '/metadata/validate',
  "method: 'POST'",
  "'Content-Type': 'application/json'",
  "'X-Shinobiwan-Studio-Intent': 'metadata-validate-v1'",
  'JSON.stringify(body)',
  'expectedUpdatedAt',
  'validationOnly !== true',
  'validationEnabled: true',
  'writesEnabled: false',
  "capabilities?.write?.length",
]) {
  assert.ok(admin.includes(required), `Track Manager Studio client is missing ${required}.`);
}

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 1, 'Studio must expose exactly one explicit POST client path.');
for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) {
  assert.ok(!admin.includes(`method: '${forbiddenMethod}'`), `Studio must not expose ${forbiddenMethod}.`);
}
for (const forbiddenPath of ['/save', '/delete', '/publish', '/catalog/rebuild', '/thumbnail']) {
  assert.ok(!admin.includes(forbiddenPath), `Studio admin client must not expose production mutation path ${forbiddenPath}.`);
}

for (const required of [
  'getAdminBridgeHealth()',
  'getAdminTracks()',
  'getAdminTrack(trackId)',
  "readSource: 'private'",
  "readSource: 'public'",
  'if (publicResult.ok) return publicResult.value',
  'Private and public catalog reads failed.',
  'Private and public track reads failed.',
]) {
  assert.ok(catalog.includes(required), `Catalog fallback contract is missing ${required}.`);
}

for (const required of [
  'VALIDATION ONLY · NO WRITE',
  'Validate metadata',
  'PREVIEW · NOT SAVED',
  'Canonical manifest changed since this workspace loaded',
  'validateAdminTrackMetadata(track.id, track.updatedAt, patch)',
  'Authenticate in Track Manager',
]) {
  assert.ok(metadata.includes(required), `Metadata validation UI is missing ${required}.`);
}
assert.ok(!/Save metadata|Save changes|Publish now|Delete track/.test(metadata), 'Build 6 metadata preview must not expose a production write CTA.');
assert.ok(workspace.includes("privateRead ? 'Track Manager v5.9' : 'LaunchPAD public fallback'"), 'Workspace must identify Track Manager v5.9.');
assert.ok(workspace.includes('<MetadataValidationPanel track={track} />'), 'Metadata tab must use the validation preview panel.');

assert.ok(release.includes("version: '0.4.1'"), 'Studio release version must be 0.4.1.');
assert.ok(release.includes('build: 6'), 'Studio release build must be 6.');
assert.ok(release.includes("codename: 'metadata-validation-preview'"), 'Studio release codename must be metadata-validation-preview.');
assert.equal(pkg.version, '0.4.1', 'package.json must match Studio 0.4.1.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'The production build must run the Studio bridge regression guard.');

console.log('Studio 0.4.1 Build 6 keeps private/public reads safe and exposes exactly one validation-only metadata POST with production writes locked.');
