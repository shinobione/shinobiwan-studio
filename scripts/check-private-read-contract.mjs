import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const admin = read('src/services/admin-api.ts');
const lyricsApi = read('src/services/lyrics-admin-api.ts');
const phase4Api = read('src/services/phase4-admin-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const assets = read('src/components/AssetsManager.tsx');
const create = read('src/components/TrackCreatePanel.tsx');
const rebuild = read('src/components/CatalogRebuildPanel.tsx');
const catalog = read('src/components/CatalogView.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const sonicApi = read('src/services/sonictrace-api.ts');
const sonicPanel = read('src/components/SonicTracePanel.tsx');
const intelligenceView = read('src/components/CatalogIntelligenceView.tsx');
const intelligenceMath = read('src/catalog-intelligence.ts');
const sonicCss = read('src/sonictrace.css');
const readability = read('src/readability.css');
const app = read('src/App.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  "credentials: 'include'", "mode: 'cors'", "cache: 'no-store'", "'/api/studio/health'",
  '/metadata/validate', '/metadata/save',
  "const ALLOWED_BRIDGE_WRITE_CAPABILITIES = new Set(['metadata', 'lyrics', 'lyrics-sync', 'sonictrace-analysis'])",
  "'Content-Type': 'text/plain;charset=UTF-8'", "writeCapabilities.includes('metadata')", 'clientVerified',
]) assert.ok(admin.includes(required), `Metadata client contract is missing ${required}.`);

for (const required of [
  "const LYRICS_VALIDATION_INTENT = 'lyrics-validate-v1'", "const LYRICS_SAVE_INTENT = 'lyrics-save-v1'",
  '/lyrics`', '/lyrics/${suffix}', "'Content-Type': 'text/plain;charset=UTF-8'", 'expectedUpdatedAt', 'expectedLyricsEtag',
  'getAdminTrackLyrics', 'validateAdminTrackLyrics', 'saveAdminTrackLyrics', 'getAdminTrack(trackId)', 'clientVerified',
  "canonicalFilename: 'lyrics.txt'", 'separateLrcRequired: false',
]) assert.ok(lyricsApi.includes(required), `Lyrics client contract is missing ${required}.`);

for (const required of [
  "const TRACK_CREATE_INTENT = 'track-create-v1'",
  "const ASSET_UPLOAD_INTENT = 'asset-upload-v1'",
  "const ASSET_DELETE_INTENT = 'asset-delete-v1'",
  "const CATALOG_REBUILD_INTENT = 'catalog-rebuild-v1'",
  "const REQUIRED_MANAGE_CAPABILITIES = new Set(['track-create', 'assets', 'catalog-rebuild'])",
  "manage.includes(capability)",
  "'/api/studio/tracks/create'",
  '/assets/${kind}/upload',
  '/assets/${kind}/delete',
  "'/api/studio/catalog/rebuild'",
  'new XMLHttpRequest()',
  'xhr.withCredentials = true',
  'xhr.upload.onprogress',
  "formData.set('expectedUpdatedAt', expectedUpdatedAt)",
  "formData.set('file', file)",
  "'Content-Type': 'text/plain;charset=UTF-8'",
  'getAdminTrack(slug)',
  'getAdminTrack(trackId)',
  'getAdminTracks()',
  'clientVerified',
  'wholeTrackDeleteEnabled: false',
  'phase5Enabled: false',
]) assert.ok(phase4Api.includes(required), `Phase 4 operations client is missing ${required}.`);

assert.ok(!phase4Api.includes('setRequestHeader('), 'Multipart asset upload must not add custom request headers/preflight.');
assert.ok(!phase4Api.includes("'Content-Type': 'application/json'"), 'Phase 4 JSON controls must keep the proven text/plain simple-request transport.');
for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) {
  assert.ok(!admin.includes(`method: '${forbiddenMethod}'`), `Metadata client must not expose ${forbiddenMethod}.`);
  assert.ok(!lyricsApi.includes(`method: '${forbiddenMethod}'`), `Lyrics client must not expose ${forbiddenMethod}.`);
  assert.ok(!phase4Api.includes(`method: '${forbiddenMethod}'`), `Phase 4 client must not expose ${forbiddenMethod}.`);
}

for (const required of ['METADATA / GUARDED WRITE', 'Validate metadata', 'Save metadata', 'METADATA SAVED']) assert.ok(metadata.includes(required), `Metadata UI missing ${required}.`);
for (const required of ['LYRICS / GUARDED WRITE', 'Canonical lyrics.txt editor', 'Validate lyrics', 'Save lyrics.txt', 'NO .LRC REQUIRED', 'CANONICAL REREAD · VERIFIED']) assert.ok(lyrics.includes(required), `Lyrics UI missing ${required}.`);

for (const required of [
  'TRACK MANAGER / ASSETS', 'Canonical Assets Manager', 'Upload', 'Replace', 'Delete asset', 'globalThis.confirm',
  'uploadAdminTrackAsset', 'deleteAdminTrackAsset', 'phase4-upload-progress', 'One asset per operation', 'Whole-track deletion is intentionally not exposed.',
]) assert.ok(assets.includes(required), `Assets Manager missing ${required}.`);

for (const required of [
  'TRACK MANAGER / CREATE', 'Create canonical draft', 'Create draft track', 'globalThis.confirm', 'createAdminTrack', "trackHref(effectiveSlug, 'assets')", 'always starts as <strong>draft</strong>',
]) assert.ok(create.includes(required), `Track create UI missing ${required}.`);

for (const required of ['TRACK MANAGER / CATALOG', 'Explicit catalog rebuild', 'REBUILD the canonical catalog/index.json', 'globalThis.confirm', 'rebuildAdminCatalog']) assert.ok(rebuild.includes(required), `Catalog rebuild UI missing ${required}.`);

for (const required of ['<TrackCreatePanel privateRead={privateRead} onCreated={loadCatalog} />', 'Track Manager v5.15 / bridge v1.7', 'All mutations remain locked.']) assert.ok(catalog.includes(required), `Catalog Build 15 contract missing ${required}.`);
for (const required of [
  '<AssetsManager track={track} onChanged={refreshTrackAfterWrite} />',
  '<LyricsEditorPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<MetadataValidationPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<SonicTracePanel track={track} onSaved={refreshTrackAfterWrite} />',
  'Track Manager v5.15 · bridge v1.7',
  'PHASE 5 / COMPLETE',
]) assert.ok(workspace.includes(required), `Workspace Build 15 contract missing ${required}.`);

for (const required of [
  'PHASE 6 · COMPLETE', 'Canonical Lyrics workflow.', 'Track Manager v5.15 · bridge v1.7', 'Context · timestamps · guarded save',
  '<CatalogRebuildPanel privateRead={privateRead} />', '<CatalogIntelligenceView />', 'stop before Phase 7',
]) assert.ok(app.includes(required), `Dashboard Build 15 contract missing ${required}.`);

for (const required of [
  "const SAVE_INTENT = 'sonictrace-analysis-save-v1'", '/api/studio/analyze', '/analysis/sonictrace',
  'fetchCanonicalAudio', 'analyzeBrowserDsp', 'runSonicTraceAnalysis', 'browserOnlyAnalysis',
  'sourceAudioRetention: false', "credentials: 'include'", "'Content-Type': 'text/plain;charset=UTF-8'",
]) assert.ok(sonicApi.includes(required), `SonicTrace client contract is missing ${required}.`);

for (const required of [
  'Analyze with SonicTrace', 'Re-scan with SonicTrace', 'Save analysis', 'REVIEW / NOT SAVED',
  'SonicTrace Deep Audio is offline', 'Browser DSP', 'append-only history', 'never stores the audio',
]) assert.ok(sonicPanel.includes(required), `SonicTrace workspace UI is missing ${required}.`);

for (const required of ['Catalog Intelligence', '512D INDEX', 'SIMILARITY / NEIGHBORS', 'CLUSTERS / DETERMINISTIC']) assert.ok(intelligenceView.includes(required), `Catalog Intelligence UI is missing ${required}.`);
for (const required of ['cosineSimilarity', 'nearestTracks', 'clusterTracks', 'vector.length === 512']) assert.ok(intelligenceMath.includes(required), `Catalog Intelligence engine is missing ${required}.`);

const tinyPhase5Fonts = [...sonicCss.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
  .map(match => Number(match[1]))
  .filter(size => size < 11);
assert.deepEqual(tinyPhase5Fonts, [], `Phase 5 UI must not reintroduce microcopy below 11px; found ${tinyPhase5Fonts.join(', ')}.`);
for (const selector of [
  '.sonic-status-grid span', '.sonic-alert', '.sonic-layers span', '.sonic-warnings',
  '.sonic-history span', '.intelligence-track-list small', '.similarity-list span', '.cluster-grid small',
]) assert.ok(readability.includes(selector), `Readability floor must explicitly cover new Phase 5 selector ${selector}.`);
assert.ok(readability.includes('--studio-micro-readable: 11px'), 'Studio readability floor must remain 11px.');

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Metadata client must keep validate + save POSTs only.');
assert.equal((lyricsApi.match(/method:\s*'POST'/g) || []).length, 1, 'Lyrics service must keep one generic POST transport.');
assert.equal((phase4Api.match(/method:\s*'POST'/g) || []).length, 1, 'Phase 4 service must keep one generic simple JSON POST transport; uploads use XHR/FormData.');
for (const forbiddenWholeTrack of [
  '/api/studio/tracks/${encodeURIComponent(trackId)}/delete',
  '/api/studio/tracks/delete',
  'wholeTrackDeleteEnabled: true',
  'deleteWholeTrack(',
]) assert.ok(!phase4Api.includes(forbiddenWholeTrack), `Whole-track delete must not be exposed by Studio Phase 4: ${forbiddenWholeTrack}`);
for (const forbiddenPhase5 of ['analysis/sonictrace', 'embedding 512', 'catalog intelligence', 'saveSonicTrace', 'phase5Enabled: true']) {
  assert.ok(!phase4Api.toLowerCase().includes(forbiddenPhase5.toLowerCase()), `Phase 5 leaked into Phase 4 client: ${forbiddenPhase5}`);
}

assert.ok(release.includes("version: '0.9.5'"), 'Studio release version must be 0.9.5.');
assert.ok(release.includes('build: 20'), 'Studio release build must be 20.');
assert.ok(release.includes("codename: 'phase6-native-lyrics-sync-restore'"), 'Studio release codename must freeze the Phase 6 native Lyrics sync restoration.');
assert.equal(pkg.version, '0.9.5', 'package.json must match Studio 0.9.5.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'Production build must run the integration regression guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase5'), 'Production build must run the Phase 5 algorithm guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase6'), 'Production build must run the embedded Phase 6 regression guard.');

console.log('Studio 0.9.5 Build 20 preserves prior contracts and consumes LRC Maker 6.3.4 native synchronization flow.');
