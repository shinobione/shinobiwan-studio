import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const catalog = read('src/components/CatalogView.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const css = read('src/studio-focus-workshop.css');
const catalogApi = read('src/services/catalog-api.ts');

assert.match(release, /version:\s*'0\.18\.1'/);
assert.match(release, /build:\s*58/);
assert.match(release, /studio-focus-slice3-smoke-corrective/);
assert.equal(pkg.version, '0.18.1');
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build58.mjs'), 'Build 58 guard must run in the Studio Focus chain.');

for (const marker of [
  'PRIVATE TRACKS HIDDEN',
  'Studio is showing the LaunchPAD public catalog only.',
  'Nothing has been deleted',
  'Retry private read',
  'Open Track Manager ↗',
  "disabled={!privateRead}",
  "setProductionFilter('released')",
  "setProductionFilter('to-finish')",
]) assert.ok(catalog.includes(marker), `Build 58 truthful public catalog fallback is missing ${marker}.`);
assert.ok(catalog.includes("privateRead ? counts.toFinish : '—'"), 'Public fallback must not present a false zero To finish count.');
assert.ok(catalog.includes("privateRead ? counts.ready : '—'"), 'Public fallback must not present a false zero Ready count.');
assert.ok(catalogApi.includes("readSource: 'public'"), 'Public catalog fallback contract must remain explicit.');
assert.ok(catalogApi.includes("publishing: {\n      catalogVisible: true"), 'Public fallback must remain a projection of public/released catalog state, not invent private tracks.');

for (const marker of [
  'PUBLIC READ-ONLY FALLBACK',
  'Private production tools are temporarily locked.',
  'LYRICS STUDIO LOCKED',
  'Restore private read to open the synchronization engine.',
  '<EmbeddedLyricsStudio trackId={track.id}',
  'Unlock SonicTrace via Track Manager ↗',
  'Canvas ready · 9:16',
]) assert.ok(workspace.includes(marker), `Build 58 Track Workspace corrective is missing ${marker}.`);
assert.ok(workspace.includes("const canEmbedLyrics = privateRead && Boolean(track.assets.audio && track.assets.lyricsTxt);"), 'Lyrics Studio must keep the validated private-read + canonical asset gate.');
assert.ok(workspace.includes("section === 'intelligence'"), 'SonicTrace legacy deep link must remain available.');

assert.ok(css.includes('.workspace-focus-video-preview{aspect-ratio:9/16'), 'Canonical Canvas preview must use the LaunchPAD-compatible 9:16 frame.');
assert.ok(!css.includes('.workspace-focus-video-preview{aspect-ratio:16/9'), 'Build 58 must remove the incorrect 16:9 Canvas preview frame.');
assert.ok(css.includes('.workspace-focus-video-preview video{width:100%;height:100%;display:block;object-fit:contain'), '9:16 Canvas preview must avoid cropping the canonical video.');
assert.ok(css.includes('.catalog-private-read-notice'), 'Tracks public-fallback warning must be styled.');
assert.ok(css.includes('.workspace-private-read-notice'), 'Track Workspace public-fallback warning must be styled.');
assert.ok(css.includes('.workspace-lyrics-lock'), 'Lyrics private-read lock state must be styled.');

for (const forbidden of ['saveAdminTrackMetadata', 'uploadAdminTrackAsset', 'deleteAdminTrackAsset', 'replaceTrackAsset', '/api/studio/write']) {
  assert.ok(!catalog.includes(forbidden), `Build 58 fallback UX must not acquire canonical write authority: ${forbidden}`);
}

console.log('Studio Focus Build 58 guard passed: public fallback is truthful, private tracks are never faked as zero/deleted, Lyrics/SonicTrace access states are explicit, and canonical Canvas preview is 9:16 without changing write authority.');
