import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(version, /^0\.19\.\d+$/, 'Build64 foundation contract must remain on the validated 0.19.x Studio line.');
assert.ok(build >= 64, `Build64 foundation contract requires Build64 or later, got Build ${build}.`);
assert.equal(pkg.version, version);
for (const required of ['build: 64', "codename: 'foundation-regression-repair'"]) assert.ok(release.includes(required), `Build64 release ancestry is missing ${required}.`);
for (const acceptedBuild of [81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109]) {
  assert.ok(release.includes(`build${acceptedBuild}AncestryMarker`), `Build110 successor must preserve accepted Build${acceptedBuild} ancestry marker.`);
}

const metadata = read('src/components/MetadataValidationPanel.tsx');
for (const required of [
  'Canonical membership/order is owned by <code>album.trackIds</code>',
  'Verify / repair membership',
  'getAdminAlbum(claimedAlbumId)',
  'getAdminAlbums()',
  'moveAdminAlbumTrackResilient(fresh.id',
  'sourceAlbumId: null',
  'expectedTargetUpdatedAt: fresh.updatedAt',
  'CACHE-ONLY CLAIM',
  'Canonical owner conflict',
]) assert.ok(metadata.includes(required), `Build64 Album authority repair is missing ${required}.`);
assert.ok(!metadata.includes('albumId: string;'), 'Generic Track metadata form must not expose editable albumId.');
assert.ok(!metadata.includes('albumTitle: string;'), 'Generic Track metadata form must not expose editable albumTitle.');
assert.ok(!/buildPatch[\s\S]*?return \{[\s\S]*?\balbum\s*:/.test(metadata), 'Generic Track metadata patch must not write track.album.');

const albumApi = read('src/services/album-admin-api.ts');
for (const required of [
  'adminAlbumMediaUrl',
  '/api/studio/albums/${encodeURIComponent(albumId)}/media/${kind}',
  'getAdminTrack(input.trackId)',
  'trackCacheMatches',
  'Track Manager v5.23-v5.24 / bridges v1.13-v1.14',
]) assert.ok(albumApi.includes(required), `Build64 Album API contract is missing current bounded successor ${required}.`);

const albumVisuals = read('src/services/public-albums-api.ts');
for (const required of [
  'getAdminAlbums()',
  "adminAlbumMediaUrl(album.id, 'cover')",
  "adminAlbumMediaUrl(album.id, 'thumbnail')",
  'if (!id || visuals.has(id)) continue',
]) assert.ok(albumVisuals.includes(required), `Build64 private Album visual repair is missing ${required}.`);

const lyrics = read('src/components/LyricsEditorPanel.tsx');
for (const required of [
  "kinds={['lyrics']}",
  'title="Add lyrics.txt"',
  'existing guarded Track asset operation',
]) assert.ok(lyrics.includes(required), `Build64 missing-lyrics repair is missing ${required}.`);

const presentation = read('src/legacy-track-type-display-auto.ts');
for (const required of [
  "heading.textContent?.trim() !== 'Add lyrics to begin'",
  'details.open = true',
  "summary.textContent = 'Add lyrics.txt / plain-text editor'",
]) assert.ok(presentation.includes(required), `Build64 visible Lyrics source control is missing ${required}.`);

console.log(`Studio ${pkg.version} Build64 foundation regression repair contract remains protected through Build${build}.`);
