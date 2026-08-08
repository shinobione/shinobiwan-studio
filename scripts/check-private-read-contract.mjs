import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const admin = read('src/services/admin-api.ts');
const catalog = read('src/services/catalog-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const app = read('src/App.tsx');
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
  '/metadata/save',
  "const METADATA_VALIDATION_INTENT = 'metadata-validate-v1'",
  "const METADATA_SAVE_INTENT = 'metadata-save-v1'",
  "const ALLOWED_BRIDGE_WRITE_CAPABILITIES = new Set(['metadata'])",
  "'Content-Type': 'text/plain;charset=UTF-8'",
  'intent: METADATA_VALIDATION_INTENT',
  'intent: METADATA_SAVE_INTENT',
  'JSON.stringify(body)',
  'expectedUpdatedAt',
  'validationOnly !== true',
  "metadataValidationTransport: 'text/plain-simple-request'",
  "metadataWriteTransport: 'text/plain-simple-request'",
  "recognizedWriteCapabilities: ['metadata'] as const",
  "writeCapabilities: ['metadata'] as const",
  "writeCapabilities.includes('metadata')",
  'clientVerified',
  'verificationWarning',
  'validationEnabled: true',
  'writesEnabled: true',
]) {
  assert.ok(admin.includes(required), `Track Manager Studio client is missing ${required}.`);
}

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Studio Build 10 must preserve exactly two explicit POST client paths: metadata validate and metadata save.');
assert.ok(!admin.includes("'X-Shinobiwan-Studio-Intent'"), 'Metadata POSTs must not reintroduce the custom header/preflight path.');
assert.ok(!admin.includes("'Content-Type': 'application/json'"), 'Metadata POSTs must remain CORS-safelisted text/plain.');
for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) {
  assert.ok(!admin.includes(`method: '${forbiddenMethod}'`), `Studio must not expose ${forbiddenMethod}.`);
}
for (const forbiddenPath of ['/delete', '/publish', '/catalog/rebuild', '/thumbnail', '/audio/upload', '/cover/upload', '/lyrics/save', '/video/upload']) {
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
  'METADATA / GUARDED WRITE',
  'Validate metadata',
  'PREVIEW · READY FOR SAVE',
  'Save metadata',
  'METADATA SAVED',
  'CANONICAL REREAD · VERIFIED',
  'Canonical manifest changed since this workspace loaded',
  'validateAdminTrackMetadata(track.id, track.updatedAt, patch)',
  'saveAdminTrackMetadata(track.id, validationRevision, patch)',
  'globalThis.confirm(',
  'Audio, cover, thumbnail, lyrics and video assets are not touched',
  'Reload canonical workspace',
]) {
  assert.ok(metadata.includes(required), `Metadata guarded-write UI is missing ${required}.`);
}
assert.ok(!/Publish now|Delete track|Upload audio|Replace cover/.test(metadata), 'Build 10 metadata UI must not expose unrelated production write CTAs.');

for (const required of [
  "privateRead ? 'Track Manager v5.11 · bridge v1.3' : 'LaunchPAD public fallback'",
  '<MetadataValidationPanel track={track} onSaved={refreshTrackAfterMetadataSave} />',
  'async function refreshTrackAfterMetadataSave()',
  'Publishing writes still locked',
]) {
  assert.ok(workspace.includes(required), `Workspace Build 10 contract is missing ${required}.`);
}

for (const required of [
  "Track Manager v5.11 · bridge v1.3",
  'PHASE 4B.1B · PRODUCTION PROVEN',
  '<strong>Metadata</strong>',
  '1 guarded production write.',
  'Guarded metadata save is production-proven.',
  'Production-proven · everything else locked',
]) {
  assert.ok(app.includes(required), `Dashboard Build 10 contract is missing ${required}.`);
}

assert.ok(release.includes("version: '0.5.1'"), 'Studio release version must be 0.5.1.');
assert.ok(release.includes('build: 10'), 'Studio release build must be 10.');
assert.ok(release.includes("codename: 'metadata-save-production-proven'"), 'Studio release codename must describe the production-proven metadata save.');
assert.equal(pkg.version, '0.5.1', 'package.json must match Studio 0.5.1.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'The production build must run the Studio bridge regression guard.');

console.log('Studio 0.5.1 Build 10 preserves the production-proven metadata-only write contract while all media, delete, publish and standalone rebuild writes remain absent.');
