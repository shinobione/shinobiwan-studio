import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const admin = read('src/services/admin-api.ts');
const lyricsApi = read('src/services/lyrics-admin-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const app = read('src/App.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  "credentials: 'include'",
  "mode: 'cors'",
  "cache: 'no-store'",
  "'/api/studio/health'",
  '/metadata/validate',
  '/metadata/save',
  "const ALLOWED_BRIDGE_WRITE_CAPABILITIES = new Set(['metadata', 'lyrics'])",
  "'Content-Type': 'text/plain;charset=UTF-8'",
  "writeCapabilities.includes('metadata')",
  'clientVerified',
]) assert.ok(admin.includes(required), `Metadata client contract is missing ${required}.`);

for (const required of [
  "const LYRICS_VALIDATION_INTENT = 'lyrics-validate-v1'",
  "const LYRICS_SAVE_INTENT = 'lyrics-save-v1'",
  '/lyrics`',
  '/lyrics/${suffix}',
  "suffix: 'validate' | 'save'",
  "'Content-Type': 'text/plain;charset=UTF-8'",
  'expectedUpdatedAt',
  'expectedLyricsEtag',
  "health.capabilities?.read",
  "health.capabilities?.validate",
  "health.capabilities?.write",
  "includes('lyrics')",
  'getAdminTrackLyrics',
  'validateAdminTrackLyrics',
  'saveAdminTrackLyrics',
  'getAdminTrack(trackId)',
  'clientVerified',
  "canonicalFilename: 'lyrics.txt'",
  'separateLrcRequired: false',
]) assert.ok(lyricsApi.includes(required), `Lyrics client contract is missing ${required}.`);

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Metadata client must keep exactly validate + save POSTs.');
assert.equal((lyricsApi.match(/method:\s*'POST'/g) || []).length, 1, 'Lyrics helper must use one generic POST transport for validate/save.');
for (const source of [admin, lyricsApi]) {
  assert.ok(!source.includes("'X-Shinobiwan-Studio-Intent'"), 'Studio writes must not reintroduce the custom-header preflight path.');
  assert.ok(!source.includes("'Content-Type': 'application/json'"), 'Studio writes must remain CORS-simple text/plain.');
  for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) assert.ok(!source.includes(`method: '${forbiddenMethod}'`), `Studio Build 12 must not expose ${forbiddenMethod}.`);
}

for (const required of [
  'METADATA / GUARDED WRITE',
  'Validate metadata',
  'Save metadata',
  'METADATA SAVED',
]) assert.ok(metadata.includes(required), `Metadata UI is missing ${required}.`);

for (const required of [
  'LYRICS / GUARDED WRITE',
  'Canonical lyrics.txt editor',
  'Validate lyrics',
  'Save lyrics.txt',
  'expected manifest revision + lyrics ETag',
  'NO .LRC REQUIRED',
  'CANONICAL REREAD · VERIFIED',
  'saveAdminTrackLyrics',
]) assert.ok(lyrics.includes(required), `Lyrics UI is missing ${required}.`);
assert.ok(lyrics.includes('globalThis.confirm'), 'Lyrics production save must require explicit confirmation.');
assert.ok(!/Upload audio|Delete track|Replace cover|Publish now/.test(lyrics), 'Lyrics editor must not expose unrelated Track Manager operations.');

for (const required of [
  '<LyricsEditorPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<MetadataValidationPanel track={track} onSaved={refreshTrackAfterWrite} />',
  "Track Manager v5.12 · bridge v1.4",
  'Asset replace/upload/delete stays in Track Manager until the final Phase 4 Assets integration.',
]) assert.ok(workspace.includes(required), `Workspace Build 12 contract is missing ${required}.`);

for (const required of [
  'PHASE 4B.2C · GUARDED LYRICS SAVE',
  'Metadata + lyrics writes active.',
  'Track Manager v5.12 · bridge v1.4',
  'Metadata + Lyrics',
  'Phase 5, which is outside the current delivery scope.',
]) assert.ok(app.includes(required), `Dashboard Build 12 contract is missing ${required}.`);

for (const forbiddenFutureRuntime of ['/catalog/rebuild', '/assets/upload', '/assets/delete', '/tracks/create']) {
  assert.ok(!lyricsApi.includes(forbiddenFutureRuntime) && !admin.includes(forbiddenFutureRuntime), `Build 12 must not prematurely expose final Phase 4 operation ${forbiddenFutureRuntime}.`);
}

assert.ok(release.includes("version: '0.6.0'"), 'Studio release version must be 0.6.0.');
assert.ok(release.includes('build: 12'), 'Studio release build must be 12.');
assert.ok(release.includes("codename: 'guarded-lyrics-save'"), 'Studio release codename must describe guarded lyrics save.');
assert.equal(pkg.version, '0.6.0', 'package.json must match Studio 0.6.0.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'Production build must run the integration regression guard.');

console.log('Studio 0.6.0 Build 12 exposes only the production-proven metadata write and guarded canonical lyrics.txt read/validate/save; remaining Phase 4 operations stay locked.');
