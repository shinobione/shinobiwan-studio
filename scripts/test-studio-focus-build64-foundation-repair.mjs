import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');

const pkg = JSON.parse(read('package.json'));
assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6', '0.19.7', '0.19.8', '0.19.9', '0.19.10', '0.19.11', '0.19.12', '0.19.13', '0.19.14', '0.19.15', '0.19.16', '0.19.17'].includes(pkg.version), 'Build64 guard only accepts the validated v0.19.3-v0.19.17 Studio successor line.');

const release = read('src/release.ts');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6|7|8|9|10|11|12|13|14|15|16|17)'/);
for (const required of [
  'build: 64',
  "codename: 'foundation-regression-repair'",
]) assert.ok(release.includes(required), `Build 64 release ancestry is missing ${required}.`);
if (/build:\s*(?:82|83|84|85|86|87|88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
if (/build:\s*(?:83|84|85|86|87|88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*(?:84|85|86|87|88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84+ must preserve accepted Build83 Phase9 ancestry.');
if (/build:\s*(?:85|86|87|88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build84AncestryMarker'), 'Build85+ must preserve accepted Build84 Phase9 ancestry.');
if (/build:\s*(?:86|87|88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build85AncestryMarker'), 'Build86+ must preserve accepted Build85 Phase9 ancestry.');
if (/build:\s*(?:87|88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build86AncestryMarker'), 'Build87+ must preserve accepted Build86 Phase9 ancestry.');
if (/build:\s*(?:88|89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build87AncestryMarker'), 'Build88+ must preserve accepted Build87 Phase9 ancestry.');
if (/build:\s*(?:89|90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build88AncestryMarker'), 'Build89+ must preserve accepted Build88 Phase9 ancestry.');
if (/build:\s*(?:90|91|92|93|94|95)/.test(release)) assert.ok(release.includes('build89AncestryMarker'), 'Build90+ must preserve accepted Build89 Phase9 ancestry.');
if (/build:\s*(?:91|92|93|94|95)/.test(release)) assert.ok(release.includes('build90AncestryMarker'), 'Build91+ must preserve accepted Build90 Phase9 ancestry.');
if (/build:\s*(?:92|93|94|95)/.test(release)) assert.ok(release.includes('build91AncestryMarker'), 'Build92+ must preserve accepted Build91 Phase9 ancestry.');
if (/build:\s*(?:93|94|95)/.test(release)) assert.ok(release.includes('build92AncestryMarker'), 'Build93+ must preserve accepted Build92 Phase9 ancestry.');
if (/build:\s*(?:94|95)/.test(release)) assert.ok(release.includes('build93AncestryMarker'), 'Build94+ must preserve accepted Build93 Phase9 ancestry.');
if (/build:\s*95/.test(release)) assert.ok(release.includes('build94AncestryMarker'), 'Build95 must preserve accepted Build94 Phase9 ancestry.');

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

console.log(`Studio ${pkg.version} Build64 foundation regression repair contract remains protected through the bounded v0.19.17 Phase9 successor.`);