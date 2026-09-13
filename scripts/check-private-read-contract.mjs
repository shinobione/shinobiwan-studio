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

assert.ok(!phase4Api.includes('REQUIRED_MANAGE_CAPABILITIES'), 'Phase 4 must accept additive backend capabilities.');
assert.ok(!phase4Api.includes('unexpected manage capability'), 'Phase 4 must accept additive backend capabilities.');
assert.ok(!phase4Api.includes('setRequestHeader('), 'Multipart asset upload must stay CORS-simple.');
assert.ok(!phase4Api.includes("'Content-Type': 'application/json'"), 'Phase 4 JSON controls must keep the proven text/plain transport.');

for (const forbiddenMethod of ['PUT', 'PATCH', 'DELETE']) {
  assert.ok(!admin.includes(`method: '${forbiddenMethod}'`), `Metadata client must not expose ${forbiddenMethod}.`);
  assert.ok(!lyricsApi.includes(`method: '${forbiddenMethod}'`), `Lyrics client must not expose ${forbiddenMethod}.`);
  assert.ok(!phase4Api.includes(`method: '${forbiddenMethod}'`), `Phase 4 client must not expose ${forbiddenMethod}.`);
}

for (const required of ['validateAdminTrackMetadataWithAudioEvidence', 'saveAdminTrackMetadataWithAudioEvidence', 'globalThis.confirm']) {
  assert.ok(metadata.includes(required), `Metadata UI contract is missing ${required}.`);
}
for (const required of ['validateAdminTrackLyrics', 'saveAdminTrackLyrics', 'globalThis.confirm']) {
  assert.ok(lyrics.includes(required), `Lyrics UI contract is missing ${required}.`);
}
for (const required of ['uploadAdminTrackAsset', 'deleteAdminTrackAsset', 'globalThis.confirm', 'kinds?: AdminAssetKind[]']) {
  assert.ok(assets.includes(required), `Assets Manager contract is missing ${required}.`);
}
for (const required of [
  'createAdminTrack', 'uploadAdminTrackAsset', 'moveAdminAlbumTrack', 'validateAdminTrackMetadata', 'saveAdminTrackMetadata',
  "trackHref(effectiveSlug, 'overview')", 'globalThis.confirm', 'PUBLISH_QUALITY_BLOCKED',
]) assert.ok(create.includes(required), `Track create contract is missing ${required}.`);
assert.ok(!create.includes('safeInitialTrackAlbum'), 'Track create must not send Album cache through generic metadata.');
assert.ok(!create.includes('saveTrack('), 'Track create must not introduce a generic saveTrack write surface.');

for (const required of ['rebuildAdminCatalog', 'globalThis.confirm']) assert.ok(rebuild.includes(required), `Catalog rebuild contract is missing ${required}.`);
for (const required of ['showCreate && <TrackCreatePanel', 'privateRead={privateRead}', 'onCreated={async () =>', '+ New Track']) {
  assert.ok(catalog.includes(required), `Catalog private-write boundary missing ${required}.`);
}

for (const required of [
  "kinds={['audio']}",
  "kinds={['cover', 'thumbnail', 'video']}",
  '<LyricsEditorPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<MetadataValidationPanel track={track} onSaved={refreshTrackAfterWrite} />',
  '<SonicTracePanel track={track} onSaved={() => {',
  '<ContinuationReceiptBanner trackId={track.id}',
]) assert.ok(workspace.includes(required), `Workspace integration contract missing ${required}.`);

for (const required of [
  'const canonical = await getCatalogTrack(next.trackId)',
  "canonical.readSource !== 'private'",
  'Public fallback cannot verify a write receipt',
]) assert.ok(receiptVerifier.includes(required), `Continuation receipt private-reread contract missing ${required}.`);

for (const required of [
  '<TrackWorkspace trackId={trackId} section={trackSection} />',
  '<WorkflowView />',
  '<CatalogRebuildPanel privateRead={privateRead} />',
  '<CatalogIntelligenceView />',
  "SUPPORTED_PRIVATE_READ_LINEAGE = 'Track Manager v5.24 · bridge v1.14'",
]) assert.ok(app.includes(required), `Studio shell integration contract missing ${required}.`);

for (const required of [
  "const SAVE_INTENT = 'sonictrace-analysis-save-v1'", '/api/studio/analyze', '/analysis/sonictrace',
  'fetchCanonicalAudio', 'analyzeBrowserDsp', 'runSonicTraceAnalysis', 'browserOnlyAnalysis',
  'sourceAudioRetention: false', "credentials: 'include'", "'Content-Type': 'text/plain;charset=UTF-8'",
]) assert.ok(sonicApi.includes(required), `SonicTrace client contract is missing ${required}.`);

for (const required of ['runSonicTraceAnalysis', 'saveSonicTraceAnalysis']) {
  assert.ok(sonicPanel.includes(required), `SonicTrace workspace contract is missing ${required}.`);
}

for (const required of ['getSonicTraceCatalog', 'getAdminAlbums', 'getCatalogTracks']) {
  assert.ok(intelligenceView.includes(required), `Catalog Intelligence read contract is missing ${required}.`);
}
for (const forbidden of ['indexedDB', 'saveAdminAlbumMetadata', 'saveAdminAlbumMembership', 'moveAdminAlbumTrack']) {
  assert.ok(!intelligenceView.includes(forbidden), `Catalog Intelligence must remain read-only; found ${forbidden}.`);
}
for (const required of [
  'cosineSimilarity', 'nearestTracks', 'validEmbedding', 'projectTracks', 'clusterAcousticZones',
  'analyzeStyleFamilies', 'catalogInsights', 'analyzeProject', 'analyzeCatalog', 'vector.length === 512',
]) assert.ok(intelligenceMath.includes(required), `Catalog Intelligence engine missing ${required}.`);
assert.ok(!intelligenceMath.includes('indexedDB'), 'Studio intelligence math must not depend on standalone SonicTrace IndexedDB.');

for (const [label, css] of [['Phase 5', sonicCss], ['C3-B', c3bCss]]) {
  const tinyFonts = [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
    .map(match => Number(match[1]))
    .filter(size => size < 11);
  assert.deepEqual(tinyFonts, [], `${label} UI must not reintroduce microcopy below 11px; found ${tinyFonts.join(', ')}.`);
}
for (const selector of [
  '.sonic-status-grid span', '.sonic-alert', '.sonic-layers span', '.sonic-warnings',
  '.sonic-history span', '.intelligence-track-list small', '.similarity-list span', '.cluster-grid small',
]) assert.ok(readability.includes(selector), `Readability floor must cover ${selector}.`);
assert.ok(readability.includes('--studio-micro-readable: 11px'), 'Studio readability floor must remain 11px.');

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Metadata client must keep validate + save POSTs only.');
assert.equal((lyricsApi.match(/method:\s*'POST'/g) || []).length, 2, 'Lyrics service must keep validation + save POST transports only.');
assert.ok(lyricsApi.includes("postLyrics<AdminLyricsSaveResponse>(trackId, 'save'"), 'Lyrics generic POST transport must remain save-only.');
assert.ok(lyricsApi.includes('validateLyricsWithOneTransientRetry(trackId'), 'Lyrics validation must keep bounded transient retry.');
assert.equal((phase4Api.match(/method:\s*'POST'/g) || []).length, 2, 'Phase 4 service must keep one simple JSON POST transport and one fetch/FormData upload transport.');

for (const forbiddenWholeTrack of [
  '/api/studio/tracks/${encodeURIComponent(trackId)}/delete',
  '/api/studio/tracks/delete',
  'wholeTrackDeleteEnabled: true',
  'deleteWholeTrack(',
]) assert.ok(!phase4Api.includes(forbiddenWholeTrack), `Whole-track delete must not be exposed by Studio Phase 4: ${forbiddenWholeTrack}`);

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(releaseVersion, /^0\.(?:11|12|13|14|15|16|17|18|19|20)\./, 'Studio private-read ancestry must remain on the validated release lines.');
assert.ok(releaseBuild >= 33, 'Studio private-read ancestry must remain at Build 33 or later.');
assert.match(release, /codename:\s*'(?:phase-ux-(?:c2-5|c3)-|phase7-|phase7c-|studio-focus-)/, 'Studio release codename must remain inside validated Studio lineage.');
assert.equal(pkg.version, releaseVersion, 'package.json must match the current Studio release version.');
for (const script of ['check:private-read', 'check:phase5', 'check:phase6', 'check:c3', 'check:ux', 'check:phase7']) {
  assert.ok(String(pkg.scripts?.build || '').includes(script), `Production build must run ${script}.`);
}
assert.ok(String(pkg.scripts?.['check:c3'] || '').includes('test-phase-ux-c3-b-v2e-parity.mjs'), 'C3 build guard must include V2-E parity.');
assert.ok(String(pkg.scripts?.['check:c3'] || '').includes('test-phase-ux-c3-c-premium-feel.mjs'), 'C3 build guard must include premium-feel regression.');

console.log(`Studio ${releaseVersion} Build ${releaseBuild} preserves canonical private-read/write authority while allowing human-facing presentation to evolve.`);
