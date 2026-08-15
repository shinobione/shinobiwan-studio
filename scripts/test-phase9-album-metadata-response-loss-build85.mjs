import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const metadata = read('src/services/album-metadata-admin-api.ts');
const ui = read('src/components/AlbumManager.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(release.includes('build85AncestryMarker'), 'Successor builds must preserve accepted Build85 ancestry.');
assert.ok(
  release.includes("version: 0.19.7 · build: 85 · codename: 'studio-focus-slice4-phase9-album-metadata-response-loss-truth'"),
  'Build85 accepted runtime identity must remain immutable in ancestry.',
);
assert.ok(release.includes('build84AncestryMarker'), 'Build85 ancestry must preserve accepted Build84 ancestry.');

for (const marker of [
  'ALBUM_METADATA_SAVE_TIMEOUT',
  'ALBUM_METADATA_SAVE_TRANSPORT',
  'ALBUM_METADATA_SAVE_NOT_COMMITTED',
  'ALBUM_METADATA_SAVE_AMBIGUOUS',
  'ALBUM_METADATA_SAVE_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  "commitState: 'committed'",
  "lostResponsePolicy: 'private-canonical-revision-metadata-shape-reread-no-blind-retry'",
]) assert.ok(metadata.includes(marker), `Build85 Album metadata lost-response contract missing ${marker}`);

assert.ok(metadata.includes('const beforeRead = await getAdminAlbum(albumId);'), 'Album metadata save must capture canonical pre-write state.');
assert.ok(metadata.includes('before.updatedAt !== expectedUpdatedAt'), 'Album metadata save must reject stale pre-write state.');
assert.ok(metadata.includes('async function postAlbumMetadataSave('), 'Build85 must isolate the Album metadata write transport.');
assert.ok(metadata.includes("!['ALBUM_METADATA_SAVE_TIMEOUT', 'ALBUM_METADATA_SAVE_TRANSPORT'].includes(reason.code || '')"), 'Only lost-response transport failures may enter metadata recovery.');
assert.ok(metadata.includes('const sameRevision = manifest?.updatedAt === before.updatedAt;'), 'Recovery must compare the canonical revision to the exact pre-write revision.');
assert.ok(metadata.includes('const metadataMatches = metadataMismatch(manifest, metadata).length === 0;'), 'Recovery must verify the exact requested metadata postcondition.');
assert.ok(metadata.includes('const shapeMatches = stableShapeMatches(before, manifest);'), 'Recovery must prove Album membership/assets/id/createdAt did not drift under a metadata-only write.');
assert.ok(metadata.includes('if (!sameRevision && metadataMatches && shapeMatches && manifest?.updatedAt)'), 'Recovered success must require a new revision + requested metadata + stable non-metadata shape.');
assert.ok(metadata.includes('if (sameRevision)'), 'Retry safety must require the exact original Album revision to remain canonical.');
assert.ok(!metadata.includes('retryAlbumMetadataSave'), 'Build85 must not introduce blind automatic retry.');
assert.ok(metadata.includes('const revisionMatches = manifest?.updatedAt === payload.updatedAt;'), 'Normal success must verify the exact server-returned revision.');
assert.ok(metadata.includes("commitState: clientVerified ? 'committed' : 'unverified'"), 'Normal success must remain unverified if canonical reread cannot prove the write.');

assert.ok(ui.includes('saveAdminAlbumMetadataResilient'), 'AlbumManager must retain the Build85 resilient metadata service.');
assert.ok(ui.includes('RECOVERED AFTER LOST RESPONSE'), 'Album metadata UI must retain recovered verified success truth.');
assert.ok(ui.includes('Studio did not retry the write.'), 'Recovered metadata success must state that no blind retry occurred.');
assert.ok(metadata.includes('RETRY SAFE AFTER RECONNECT'), 'Metadata service must expose the narrow retry-safe outcome.');
assert.ok(metadata.includes('DO NOT RETRY'), 'Metadata service must expose ambiguous/unverified outcomes as unsafe to retry.');
assert.ok(ui.includes('Album metadata saved and canonically verified.'), 'Normal metadata success copy must reflect canonical verification.');

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build85 Album metadata response-loss guard passed as inherited ancestry: canonical pre-revision + requested metadata + stable non-metadata shape still classify committed/not-committed/ambiguous/unverified without blind retry.');
