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
const receiptVerifier = read('src/components/ContinuationReceiptBanner.tsx');
const sonicApi = read('src/services/sonictrace-api.ts');
const sonicPanel = read('src/components/SonicTracePanel.tsx');
const intelligenceView = read('src/components/CatalogIntelligenceView.tsx');
const intelligenceMath = read('src/catalog-intelligence.ts');
const sonicCss = read('src/sonictrace.css');
const c3bCss = read('src/c3-b-v2e-parity.css');
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
  "manage.includes(capability)",
  "'/api/studio/tracks/create'",
  '/assets/${kind}/upload',
  '/assets/${kind}/delete',
  "'/api/studio/catalog/rebuild'",
  'async function uploadViaFetch(',
  "credentials: 'include'",
  'body: formData',
  "'ASSET_UPLOAD_NOT_COMMITTED'",
  "'ASSET_UPLOAD_AMBIGUOUS'",
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

assert.ok(!phase4Api.includes('REQUIRED_MANAGE_CAPABILITIES'), 'Phase 4 must not pin Track Manager to an exact manage capability set.');
assert.ok(!phase4Api.includes('unexpected manage capability'), 'Phase 4 must accept additive manage capabilities from newer compatible Track Manager bridges.');
assert.ok(!phase4Api.includes('setRequestHeader('), 'Multipart asset upload must not add custom request headers/preflight.');
assert.ok(!phase4Api.includes("'Content-Type': 'application/json'"), 'Phase 4 JSON controls must keep the proven text/plain simple-request transport.');
for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) {
  assert.ok(!admin.includes(`method: '${forbiddenMethod}'`), `Metadata client must not expose ${forbiddenMethod}.`);
  assert.ok(!lyricsApi.includes(`method: '${forbiddenMethod}'`), `Lyrics client must not expose ${forbiddenMethod}.`);
  assert.ok(!phase4Api.includes(`method: '${forbiddenMethod}'`), `Phase 4 client must not expose ${forbiddenMethod}.`);
}

for (const required of ['Shape how this track appears', 'PROTECTED SAVE', 'Validate metadata', 'Save metadata', 'METADATA SAVED']) assert.ok(metadata.includes(required), `Metadata UI missing ${required}.`);
for (const required of ['LYRICS / GUARDED WRITE', 'Canonical lyrics.txt editor', 'Validate lyrics', 'Save lyrics.txt', 'NO .LRC REQUIRED', 'CANONICAL REREAD · VERIFIED']) assert.ok(lyrics.includes(required), `Lyrics UI missing ${required}.`);

for (const required of [
  'EDITING ENABLED', 'Upload', 'Replace', 'Delete asset', 'globalThis.confirm',
  'uploadAdminTrackAsset', 'deleteAdminTrackAsset', 'phase4-upload-progress', 'One asset changes per operation', 'whole-track deletion is intentionally not exposed',
  'kinds?: AdminAssetKind[]', 'const visibleAssets = useMemo',
]) assert.ok(assets.includes(required), `Assets Manager missing ${required}.`);

for (const required of [
  'NEW TRACK', 'Create the track you mean to release', 'Create draft', 'Create & Publish', 'globalThis.confirm',
  'createAdminTrack', 'uploadAdminTrackAsset', 'moveAdminAlbumTrack', 'validateAdminTrackMetadata', 'saveAdminTrackMetadata',
  "trackHref(effectiveSlug, 'overview')", 'Safe draft first', 'PUBLISH_QUALITY_BLOCKED',
]) assert.ok(create.includes(required), `Track create UI missing ${required}.`);
assert.ok(!create.includes('safeInitialTrackAlbum'), 'Track create must not send Album cache through generic metadata under TM v5.21.');
assert.ok(!create.includes('saveTrack('), 'Track create must not introduce a generic saveTrack write surface.');

for (const required of ['TRACK MANAGER / CATALOG', 'Explicit catalog rebuild', 'REBUILD the canonical catalog/index.json', 'globalThis.confirm', 'rebuildAdminCatalog']) assert.ok(rebuild.includes(required), `Catalog rebuild UI missing ${required}.`);

for (const required of ['showCreate && <TrackCreatePanel', 'privateRead={privateRead}', 'onCreated={async () =>', '+ New Track', 'Tracks are available read-only']) assert.ok(catalog.includes(required), `Catalog private-write boundary missing ${required}.`);
for (const required of [
  "kinds={['audio']}",
  "kinds={['cover', 'thumbnail', 'video']}",
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

for (const required of [
  'LYRICS / CANONICAL', 'lyrics.txt is the single canonical source.',
  '<CatalogRebuildPanel privateRead={privateRead} />', '<CatalogIntelligenceView />',
]) assert.ok(app.includes(required), `Studio integration contract missing ${required}.`);
// Phase 6 remains a completed inherited contract after the shell advances through
// Phase 7 and its explicitly-authorized guided-action successors. The actual
// Phase 6 write/read contracts are asserted above; this assertion only verifies that
// the successor still preserves access to the Phase 7 workflow ancestry.
assert.ok(
  app.includes('PHASE 6 / COMPLETE')
    || ((app.includes('PHASE 7 / ORCHESTRATION') || app.includes('PHASE 7-B') || app.includes('PHASE 7-C')) && app.includes("route === 'workflow'")),
  'Studio must preserve the completed Phase 6 integration while exposing the authorized Phase 7 successor.'
);
assert.match(app, /Track Manager v5\.(?:17|18|19|20|21) · bridge v1\.(?:9|10|11)/, 'Studio must still surface a supported C2.5/Phase 7 Track Manager/bridge lineage.');

for (const required of [
  "const SAVE_INTENT = 'sonictrace-analysis-save-v1'", '/api/studio/analyze', '/analysis/sonictrace',
  'fetchCanonicalAudio', 'analyzeBrowserDsp', 'runSonicTraceAnalysis', 'browserOnlyAnalysis',
  'sourceAudioRetention: false', "credentials: 'include'", "'Content-Type': 'text/plain;charset=UTF-8'",
]) assert.ok(sonicApi.includes(required), `SonicTrace client contract is missing ${required}.`);

for (const required of [
  'Analyze with SonicTrace', 'Re-scan with SonicTrace', 'Save analysis', 'REVIEW / NOT SAVED',
  'SonicTrace coordinator responded', 'SonicTrace coordinator is unreachable', 'UNAVAILABLE',
  'Browser DSP', 'append-only history', 'never stores the audio',
]) assert.ok(sonicPanel.includes(required), `SonicTrace workspace UI is missing ${required}.`);

for (const required of [
  'SONICTRACE / C3-B / CANONICAL V2-E', 'See the shape of your catalog.',
  'Position = proximity. Color = family. Zone = neighborhood.', 'CLOSEST SOUND', 'SONIC FAMILIES',
  'ALBUM / PROJECT INTELLIGENCE', 'READ ONLY · canonical order unchanged',
  'getSonicTraceCatalog', 'getAdminAlbums', 'getCatalogTracks',
]) assert.ok(intelligenceView.includes(required), `Catalog Intelligence C3-B UI is missing ${required}.`);
for (const forbidden of ['indexedDB', 'saveAdminAlbumMetadata', 'saveAdminAlbumMembership', 'moveAdminAlbumTrack']) {
  assert.ok(!intelligenceView.includes(forbidden), `Catalog Intelligence C3-B must remain canonical-read/read-only; found ${forbidden}.`);
}
for (const required of [
  'cosineSimilarity', 'nearestTracks', 'validEmbedding', 'projectTracks', 'clusterAcousticZones',
  'analyzeStyleFamilies', 'catalogInsights', 'analyzeProject', 'analyzeCatalog', 'vector.length === 512',
]) assert.ok(intelligenceMath.includes(required), `Catalog Intelligence C3-B engine missing ${required}.`);
assert.ok(!intelligenceMath.includes('indexedDB'), 'Studio C3-B intelligence math must not depend on standalone SonicTrace IndexedDB.');

for (const [label, css] of [['Phase 5', sonicCss], ['C3-B', c3bCss]]) {
  const tinyFonts = [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
    .map(match => Number(match[1]))
    .filter(size => size < 11);
  assert.deepEqual(tinyFonts, [], `${label} UI must not reintroduce microcopy below 11px; found ${tinyFonts.join(', ')}.`);
}
for (const selector of [
  '.sonic-status-grid span', '.sonic-alert', '.sonic-layers span', '.sonic-warnings',
  '.sonic-history span', '.intelligence-track-list small', '.similarity-list span', '.cluster-grid small',
]) assert.ok(readability.includes(selector), `Readability floor must explicitly cover new Phase 5 selector ${selector}.`);
assert.ok(readability.includes('--studio-micro-readable: 11px'), 'Studio readability floor must remain 11px.');

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Metadata client must keep validate + save POSTs only.');
assert.equal((lyricsApi.match(/method:\s*'POST'/g) || []).length, 1, 'Lyrics service must keep one generic POST transport.');
assert.equal((phase4Api.match(/method:\s*'POST'/g) || []).length, 2, 'Phase 4 service must keep one simple JSON POST transport and one CORS-simple fetch/FormData upload transport.');
for (const forbiddenWholeTrack of [
  '/api/studio/tracks/${encodeURIComponent(trackId)}/delete',
  '/api/studio/tracks/delete',
  'wholeTrackDeleteEnabled: true',
  'deleteWholeTrack(',
]) assert.ok(!phase4Api.includes(forbiddenWholeTrack), `Whole-track delete must not be exposed by Studio Phase 4: ${forbiddenWholeTrack}`);
for (const forbiddenPhase5 of ['analysis/sonictrace', 'embedding 512', 'catalog intelligence', 'saveSonicTrace', 'phase5Enabled: true']) {
  assert.ok(!phase4Api.toLowerCase().includes(forbiddenPhase5.toLowerCase()), `Phase 5 leaked into Phase 4 client: ${forbiddenPhase5}`);
}

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(releaseVersion, /^0\.(?:11|12|13|14|15|16|17|18|19|20)\./, 'Studio private-read ancestry must remain on the validated PHASE UX / Phase 7 successor release lines.');
assert.ok(releaseBuild >= 33, 'Studio private-read ancestry must remain at Build 33 or later.');
assert.match(release, /codename:\s*'(?:phase-ux-(?:c2-5|c3)-|phase7-|phase7c-|studio-focus-)/, 'Studio release codename must remain inside validated PHASE UX, Phase 7, Phase 7-C, or explicitly authorized Studio Focus lineage.');
assert.equal(pkg.version, releaseVersion, 'package.json must match the current Studio release version.');
assert.ok(String(pkg.scripts?.build || '').includes('check:private-read'), 'Production build must run the integration regression guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase5'), 'Production build must run the Phase 5 algorithm guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase6'), 'Production build must run the embedded Phase 6 regression guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:c3'), 'Production build must run the C3 semantics/parity guards.');
assert.ok(String(pkg.scripts?.['check:c3'] || '').includes('test-phase-ux-c3-b-v2e-parity.mjs'), 'C3 build guard must include the V2-E parity regression test.');
assert.ok(String(pkg.scripts?.['check:c3'] || '').includes('test-phase-ux-c3-c-premium-feel.mjs'), 'C3 build guard must include the premium-feel regression test.');
assert.ok(String(pkg.scripts?.build || '').includes('check:ux'), 'Production build must run the PHASE UX regression guard.');
assert.ok(String(pkg.scripts?.build || '').includes('check:phase7'), 'Authorized successor production builds must run the Phase 7 regression guard.');

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves Phase 0-6/C2.5/C3/7-A/7-B contracts while the authorized Phase 7 successor changes presentation without replacing canonical authorities.`);
