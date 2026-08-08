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
  "const ALLOWED_BRIDGE_WRITE_CAPABILITIES = new Set(['metadata', 'lyrics'])",
  "'Content-Type': 'text/plain;charset=UTF-8'",
  'intent: METADATA_VALIDATION_INTENT',
  'intent: METADATA_SAVE_INTENT',
  'expectedUpdatedAt',
  "recognizedWriteCapabilities: ['metadata', 'lyrics'] as const",
  "writeCapabilities: ['metadata'] as const",
  'lyricsWriteEnabled: false',
  "writeCapabilities.includes('metadata')",
  'clientVerified',
  'validationEnabled: true',
  'writesEnabled: true',
]) {
  assert.ok(admin.includes(required), `Track Manager Studio client is missing ${required}.`);
}

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Studio Build 11 must keep exactly the two production-proven metadata POST clients.');
assert.ok(!admin.includes("'X-Shinobiwan-Studio-Intent'"), 'Metadata POSTs must not reintroduce the custom header/preflight path.');
assert.ok(!admin.includes("'Content-Type': 'application/json'"), 'Metadata POSTs must remain CORS-safelisted text/plain.');
for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) {
  assert.ok(!admin.includes(`method: '${forbiddenMethod}'`), `Studio must not expose ${forbiddenMethod}.`);
}
for (const forbiddenPath of ['/lyrics/validate', '/lyrics/save', '/delete', '/publish', '/catalog/rebuild', '/thumbnail', '/audio/upload', '/cover/upload', '/video/upload']) {
  assert.ok(!admin.includes(forbiddenPath), `Phase 4B.2A must not expose runtime path ${forbiddenPath}.`);
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
  'Save metadata',
  'METADATA SAVED',
  'CANONICAL REREAD · VERIFIED',
  'saveAdminTrackMetadata(track.id, validationRevision, patch)',
]) {
  assert.ok(metadata.includes(required), `Production-proven metadata UI is missing ${required}.`);
}
assert.ok(!/Publish now|Delete track|Upload audio|Replace cover/.test(metadata), 'Metadata UI must not expose unrelated production write CTAs.');

for (const required of [
  "privateRead ? 'Track Manager v5.11 · bridge v1.3' : 'LaunchPAD public fallback'",
  '<MetadataValidationPanel track={track} onSaved={refreshTrackAfterMetadataSave} />',
  'Publishing writes still locked',
]) {
  assert.ok(workspace.includes(required), `Workspace Build 11 contract is missing ${required}.`);
}

for (const required of [
  "Track Manager v5.11 · bridge v1.3",
  'PHASE 4B.2A · LYRICS CAPABILITY PREP',
  'Lyrics writes remain locked.',
  'Lyrics capability prep is compatibility-only.',
  'Lyrics capability recognized · not active',
  'lyrics.txt stays canonical.',
]) {
  assert.ok(app.includes(required), `Dashboard Build 11 contract is missing ${required}.`);
}

assert.ok(release.includes("version: '0.5.2'"), 'Studio release version must be 0.5.2.');
assert.ok(release.includes('build: 11'), 'Studio release build must be 11.');
assert.ok(release.includes("codename: 'lyrics-write-capability-awareness'"), 'Studio release codename must describe lyrics capability awareness.');
assert.equal(pkg.version, '0.5.2', 'package.json must match Studio 0.5.2.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'The production build must run the Studio bridge regression guard.');

console.log('Studio 0.5.2 Build 11 can recognize a future lyrics write capability without exposing any lyrics validation/save client; metadata remains the only active production write.');
