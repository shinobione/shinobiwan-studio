import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');

const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.version, '0.19.3', 'Build 64 must use Studio v0.19.3.');

const release = read('src/release.ts');
for (const required of [
  "version: '0.19.3'",
  'build: 64',
  "codename: 'foundation-regression-repair'",
]) assert.ok(release.includes(required), `Build 64 release identity is missing ${required}.`);

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
  'Track Manager v5.21 / bridge v1.11 only',
]) assert.ok(albumApi.includes(required), `Build 64 Album API contract is missing ${required}.`);

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

console.log('Studio v0.19.3 Build 64 foundation regression repair contract verified.');
