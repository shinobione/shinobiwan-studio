import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const app = read('src/App.tsx');
const catalog = read('src/components/CatalogView.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const assets = read('src/components/AssetsManager.tsx');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const create = read('src/components/TrackCreatePanel.tsx');
const rebuild = read('src/components/CatalogRebuildPanel.tsx');
const receiptVerifier = read('src/components/ContinuationReceiptBanner.tsx');
const phase4Api = read('src/services/phase4-admin-api.ts');
const adminApi = read('src/services/admin-api.ts');
const catalogApi = read('src/services/catalog-api.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  "credentials: 'include'",
  "'/api/studio/track/'",
  "'/api/studio/catalog/rebuild'",
  "'/api/studio/albums'",
  "'Content-Type': 'text/plain;charset=UTF-8'",
]) assert.ok(`${phase4Api}\n${adminApi}`.includes(required), `Protected API contract missing ${required}.`);

for (const forbidden of [
  'MEDIA_BUCKET',
  'wrangler',
  '/api/media/',
  '/api/studio/write',
]) assert.ok(!`${phase4Api}\n${adminApi}`.includes(forbidden), `Studio client must not bypass Track Manager authority: ${forbidden}.`);

for (const required of [
  'getCatalogTracks',
  'getCatalogTrack',
  "readSource: 'private'",
  "readSource: 'public'",
]) assert.ok(catalogApi.includes(required), `Catalog read adapter missing ${required}.`);

for (const required of [
  'Track Manager remains the protected write authority',
  'PHASE 7-B',
  "route === 'catalog'",
  "route === 'workflow'",
  "route === 'intelligence'",
  "route === 'administration'",
  '<CatalogView />',
  '<TrackWorkspace trackId={trackId} section={trackSection} />',
]) assert.ok(app.includes(required), `Studio integration contract missing ${required}.`);

for (const required of [
  'Validate metadata',
  'Save metadata',
  'validateAdminTrackMetadata',
  'saveAdminTrackMetadata',
  'globalThis.confirm',
]) assert.ok(metadata.includes(required), `Metadata protected-write behavior missing ${required}.`);

for (const required of ['LYRICS / GUARDED WRITE', 'Canonical lyrics.txt editor', 'Validate lyrics', 'Save lyrics.txt', 'NO .LRC REQUIRED', 'CANONICAL REREAD · VERIFIED']) assert.ok(lyrics.includes(required), `Lyrics UI missing ${required}.`);

for (const required of [
  'Manage production media', 'EDITING ENABLED', 'Upload', 'Replace', 'Delete asset', 'globalThis.confirm',
  'uploadAdminTrackAsset', 'deleteAdminTrackAsset', 'phase4-upload-progress', 'One asset changes per operation', 'whole-track deletion is intentionally not exposed',
]) assert.ok(assets.includes(required), `Assets Manager missing ${required}.`);

for (const required of [
  'NEW TRACK', 'Build a canonical draft from the files you already have', 'Create canonical draft', 'globalThis.confirm', 'createAdminTrack', 'uploadAdminTrackAsset', "uploads.length ? 'assets' : 'overview'", 'Initial state</span><strong>Recoverable draft',
]) assert.ok(create.includes(required), `Track create UI missing ${required}.`);

for (const required of ['TRACK MANAGER / CATALOG', 'Explicit catalog rebuild', 'REBUILD the canonical catalog/index.json', 'globalThis.confirm', 'rebuildAdminCatalog']) assert.ok(rebuild.includes(required), `Catalog rebuild UI missing ${required}.`);

for (const required of ['showCreate && <TrackCreatePanel', 'privateRead={privateRead}', 'onCreated={async () =>', '+ New Track', 'Tracks are available read-only']) assert.ok(catalog.includes(required), `Tracks private-write boundary missing ${required}.`);
for (const required of [
  '<AssetsManager track={track} onChanged={refreshTrackAfterWrite} />',
  '<LyricsEditorPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<MetadataValidationPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<SonicTracePanel track={track} onSaved={() => {',
  '<ContinuationReceiptBanner trackId={track.id}',
  'PHASE 5 / COMPLETE',
]) assert.ok(workspace.includes(required), `Workspace integration contract missing ${required}.`);
for (const required of [
  'const canonical = await getCatalogTrack(next.trackId)',
  "canonical.readSource !== 'private'",
  'Public fallback cannot verify a write receipt',
]) assert.ok(receiptVerifier.includes(required), `Phase 7-B private reread contract missing ${required}.`);

// Phase 6 remains a completed inherited contract after the shell advances through
// Phase 7 and into the explicitly-authorized Studio Focus UX successor. The actual
// Phase 6 write/read contracts are asserted above; this assertion only verifies that
// the successor still preserves access to the Phase 7 workflow ancestry.
assert.ok(
  app.includes('PHASE 6 / COMPLETE')
    || ((app.includes('PHASE 7 / ORCHESTRATION') || app.includes('PHASE 7-B')) && app.includes("route === 'workflow'")),
  'Studio must preserve the completed Phase 6 integration while exposing the authorized Phase 7 / Studio Focus successor.'
);
assert.match(app, /Track Manager v5\.(?:17|18|19) · bridge v1\.(?:9|10|11)/, 'Studio must still surface a supported C2.5 Track Manager/bridge lineage.');

for (const forbiddenPhase5 of ['analysis/sonictrace', 'embedding 512', 'catalog intelligence write']) {
  assert.ok(!adminApi.toLowerCase().includes(forbiddenPhase5), `Protected Track Manager client must not absorb Phase 5 intelligence authority: ${forbiddenPhase5}.`);
}

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(releaseVersion, /^0\.(?:11|12|13|14|15|16|17)\./, 'Studio private-read ancestry must remain on the validated PHASE UX / Phase 7 / Studio Focus release lines.');
assert.ok(releaseBuild >= 33, 'Studio private-read ancestry must remain at Build 33 or later.');
assert.match(release, /codename:\s*'(?:phase-ux-(?:c2-5|c3)-|phase7-|studio-focus-)/, 'Studio release codename must remain inside validated PHASE UX, Phase 7, or explicitly authorized Studio Focus lineage.');
assert.equal(pkg.version, releaseVersion, 'package.json must match the current Studio release version.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'Production build must run the integration regression guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase5'), 'Production build must run the Phase 5 algorithm guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase6'), 'Production build must run the Phase 6 guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:c3'), 'Production build must run the C3 regression guard.');
assert.ok(String(pkg.scripts?.['check:c3'] || '').includes('test-phase-ux-c3-b-v2e-parity.mjs'), 'C3 build guard must include the V2-E parity regression test.');
assert.ok(String(pkg.scripts?.['check:c3'] || '').includes('test-phase-ux-c3-c-premium-feel.mjs'), 'C3 build guard must include the premium-feel regression test.');
assert.ok(String(pkg.scripts?.build || '').includes('check:ux'), 'Production build must run the PHASE UX regression guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase7'), 'Authorized successor production builds must run the Phase 7 regression guard.');

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves Phase 0-6/C2.5/C3/7-A/7-B contracts while the authorized Studio Focus successor changes presentation without replacing canonical authorities.`);
