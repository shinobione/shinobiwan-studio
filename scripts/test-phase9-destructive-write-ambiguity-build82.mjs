import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const trackAssets = read('src/services/phase4-admin-api.ts');
const albums = read('src/services/album-admin-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.4'/);
assert.match(release, /build:\s*82/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-destructive-write-ambiguity-guard'"));
assert.ok(release.includes('build81AncestryMarker'), 'Phase9 Build82 must preserve accepted Build81 ancestry.');

for (const marker of [
  'ASSET_DELETE_TIMEOUT',
  'ASSET_DELETE_TRANSPORT',
  'ASSET_DELETE_NOT_COMMITTED',
  'ASSET_DELETE_AMBIGUOUS',
  'ASSET_DELETE_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  'retrySafe: true',
  'Do not retry',
]) assert.ok(trackAssets.includes(marker), `Track asset delete ambiguity contract missing ${marker}`);
assert.equal((trackAssets.match(/method:\s*'POST'/g) || []).length, 2, 'Phase9 must preserve the two established Phase4 POST transports.');
assert.ok(trackAssets.includes('type SimpleTransportFailure ='), 'Shared simple POST transport must support operation-specific transport-loss classification.');
assert.ok(trackAssets.includes('transportFailure?: SimpleTransportFailure'), 'Track delete must reuse the established simple JSON POST transport instead of adding a third fetch path.');
assert.ok(trackAssets.includes("timeoutCode: 'ASSET_DELETE_TIMEOUT'"), 'Track delete must attach its timeout classification to the shared POST transport.');
assert.ok(trackAssets.includes('const before = await getAdminTrack(trackId);'), 'Track delete must capture canonical pre-write state.');
assert.ok(trackAssets.includes("!['ASSET_DELETE_TIMEOUT', 'ASSET_DELETE_TRANSPORT'].includes(reason.code || '')"), 'Only transport-loss failures may enter Track delete recovery.');
assert.ok(trackAssets.includes('const reread = await getAdminTrack(trackId);'), 'Track delete transport loss must trigger a private canonical reread.');
assert.ok(trackAssets.includes('const missing = !manifest?.assets?.[kind] && asset?.present !== true;'), 'Track recovery must verify asset absence from manifest plus asset state.');
assert.ok(trackAssets.includes('if (changed && missing)'), 'Track recovery may call a lost-response delete committed only when revision changed and asset is absent.');
assert.ok(trackAssets.includes('if (!changed && !missing)'), 'Track recovery may allow retry only when revision is unchanged and asset remains present.');
assert.ok(!trackAssets.includes('retryAdminTrackAssetDelete'), 'Build82 must not introduce an automatic destructive retry loop.');
assert.ok(trackAssets.includes('ASSET_UPLOAD_AMBIGUOUS'), 'Existing upload ambiguity contract must remain intact.');
assert.ok(!trackAssets.includes('ASSET_UPLOAD_AMIGUOUS'), 'Build82 must not regress the existing upload ambiguity code.');

for (const marker of [
  'ALBUM_ASSET_DELETE_TIMEOUT',
  'ALBUM_ASSET_DELETE_TRANSPORT',
  'ALBUM_ASSET_DELETE_NOT_COMMITTED',
  'ALBUM_ASSET_DELETE_AMBIGUOUS',
  'ALBUM_ASSET_DELETE_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  'retrySafe: true',
  'Do not retry',
]) assert.ok(albums.includes(marker), `Album asset delete ambiguity contract missing ${marker}`);
assert.ok(albums.includes('async function deleteAlbumAssetRequest('), 'Album delete must use a dedicated bounded transport.');
assert.ok(albums.includes('globalThis.setTimeout(() => controller.abort(), 30000)'), 'Album delete transport must have a finite timeout.');
assert.ok(albums.includes('const before = await getAdminAlbum(albumId);'), 'Album delete must capture canonical pre-write state.');
assert.ok(albums.includes("!['ALBUM_ASSET_DELETE_TIMEOUT', 'ALBUM_ASSET_DELETE_TRANSPORT'].includes(reason.code || '')"), 'Only transport-loss failures may enter Album delete recovery.');
assert.ok(albums.includes('const reread = await getAdminAlbum(albumId);'), 'Album delete transport loss must trigger a private canonical reread.');
assert.ok(albums.includes('const missing = !manifest?.assets?.[kind] && asset?.present !== true;'), 'Album recovery must verify asset absence from manifest plus asset state.');
assert.ok(albums.includes('if (changed && missing)'), 'Album recovery may call a lost-response delete committed only when revision changed and asset is absent.');
assert.ok(albums.includes('if (!changed && !missing)'), 'Album recovery may allow retry only when revision is unchanged and asset remains present.');
assert.ok(!albums.includes('retryAdminAlbumAssetDelete'), 'Build82 must not introduce an automatic destructive retry loop.');

assert.ok(pkg.scripts['check:phase9']?.includes('test-phase9-destructive-write-ambiguity-build82.mjs'), 'Build82 guard must run in check:phase9.');
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must be part of the repository build gate.');

console.log('Phase9 Build82 destructive-write ambiguity guard passed: Track and Album asset deletes classify lost responses through private canonical reread with no blind retry, while Phase4 transport topology remains unchanged.');