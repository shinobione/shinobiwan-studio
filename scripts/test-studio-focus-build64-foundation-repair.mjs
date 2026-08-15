import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');

const pkg = JSON.parse(read('package.json'));
assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6'].includes(pkg.version), 'Build64 guard only accepts the validated v0.19.3-v0.19.6 Studio successor line.');

const release = read('src/release.ts');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6)'/);
for (const required of [
  'build: 64',
  "codename: 'foundation-regression-repair'",
]) assert.ok(release.includes(required), `Build 64 release ancestry is missing ${required}.`);
if (/build:\s*(?:82|83|84)/.test(release)) assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
if (/build:\s*(?:83|84)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*84/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84 must preserve accepted Build83 Phase9 ancestry.');

const metadata = read('src/components/MetadataValidationPanel.tsx');
for (const required of [
  'Canonical membership/order is owned by <code>album.trackIds</code>',
  'Verify / repair membership',
  'getAdminAlbum(claimedAlbumId)',
  'getAdminAlbums()',
  'moveAdminAlbumTrack(fresh.id',
  'sourceAlbumId: null',
  'expectedTargetUpdatedAt: fresh.updatedAt',
  'CACHE-ONLY CLAIM',
  'Canonical owner conflict',
]) assert.ok(metadata.includes(required), `Build 64 Album authority repair is missing ${required}.`);
assert.ok(!metadata.includes('albumId: string;'), 'Generic Track metadata form must not expose editable albumId.');
assert.ok(!metadata.includes('albumTitle: string;'), 'Generic Track metadata form must not expose editable albumTitle.');
assert.ok(!/buildPatch[\s\S]*?return \{[\s\S]*?\balbum\s*:/.test(metadata), 'Generic Track metadata patch must not write track.album.');

const albumApi = read('src/services/album-admin-api.ts');
for (const required of [
  'adminAlbumMediaUrl',
  '/api/studio/albums/${encodeURIComponent(albumId)}/media/${kind}',
  'getAdminTrack(input.trackId)',
  'trackCacheMatches',
  'Track Manager v5.23 / bridge v1.13 only',
]) assert.ok(albumApi.includes(required), `Build 64 Album API contract is missing current bounded successor ${required}.`);

const albumVisuals = read('src/services/public-albums-api.ts');
for (const required of [
  'getAdminAlbums()',
  "adminAlbumMediaUrl(album.id, 'cover')",
  "adminAlbumMediaUrl(album.id, 'thumbnail')",
  'if (!id || visuals.has(id)) continue',
]) assert.ok(albumVisuals.includes(required), `Build 64 private Album visual repair is missing ${required}.`);

const lyrics = read('src/components/LyricsEditorPanel.tsx');
for (const required of [
  "kinds={['lyrics']}",
  'title="Add lyrics.txt"',
  'existing guarded Track asset operation',
]) assert.ok(lyrics.includes(required), `Build 64 missing-lyrics repair is missing ${required}.`);

const presentation = read('src/legacy-track-type-display-auto.ts');
for (const required of [
  "heading.textContent?.trim() !== 'Add lyrics to begin'",
  'details.open = true',
  "summary.textContent = 'Add lyrics.txt / plain-text editor'",
]) assert.ok(presentation.includes(required), `Build 64 visible Lyrics source control is missing ${required}.`);

console.log(`Studio ${pkg.version} Build64 foundation regression repair contract remains protected through the bounded v0.19.6 Phase9 successor.`);
