import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const move = read('src/services/album-move-admin-api.ts');
const albums = read('src/components/AlbumManager.tsx');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(release.includes('build86AncestryMarker'), 'Successor builds must preserve accepted Build86 ancestry.');
assert.ok(release.includes("version: 0.19.8 · build: 86 · codename: 'studio-focus-slice4-phase9-album-move-response-loss-truth'"), 'Build86 accepted runtime identity must remain immutable in ancestry.');
assert.ok(release.includes('build85AncestryMarker'), 'Build86 ancestry must preserve accepted Build85 ancestry.');

for (const marker of [
  'ALBUM_MOVE_TIMEOUT',
  'ALBUM_MOVE_TRANSPORT',
  'ALBUM_MOVE_INVALID_RESPONSE',
  'ALBUM_MOVE_NOT_COMMITTED',
  'ALBUM_MOVE_AMBIGUOUS',
  'ALBUM_MOVE_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  "commitState: 'committed'",
  "lostResponsePolicy: 'private-canonical-target-source-track-reread-no-blind-retry'",
]) assert.ok(move.includes(marker), `Build86 Album move lost-response contract missing ${marker}`);

assert.ok(move.includes('const before = await captureMoveSnapshot(targetAlbumId, input);'), 'Album move must capture canonical target/source/Track state before POST.');
assert.ok(move.includes('before.target.updatedAt !== input.expectedTargetUpdatedAt'), 'Move must reject stale target revision before write.');
assert.ok(move.includes('before.source?.updatedAt !== input.expectedSourceUpdatedAt'), 'Cross-Album move must reject stale source revision before write.');
assert.ok(move.includes('expectedTargetTrackIds: insertAt(before.target.trackIds, input.trackId, input.targetIndex)'), 'Move recovery must compute exact target artistic order before POST.');
assert.ok(move.includes('before.source.trackIds.filter(value => value !== input.trackId)'), 'Move recovery must compute exact source removal postcondition.');
assert.ok(move.includes('async function postAlbumMove('), 'Build86 must isolate Album move transport with timeout classification.');
assert.ok(move.includes("LOST_RESPONSE_CODES.has(reason.code || '')"), 'Only timeout/transport/invalid-response ambiguity may enter canonical recovery.');
assert.ok(move.includes('const after = await readMoveState(targetAlbumId, effectiveSourceId, input.trackId);'), 'Lost response must reread canonical target/source/Track state.');
assert.ok(move.includes('committedPostcondition(before, after, targetAlbumId)'), 'Recovered success must require the exact operation-specific committed postcondition.');
assert.ok(move.includes('notCommittedPostcondition(before, after)'), 'Retry safety must require the exact pre-write state to remain canonical.');
assert.ok(move.includes('after.track.album?.id === targetAlbumId'), 'Committed move must verify the Track compatibility cache points to target.');
assert.ok(move.includes('albumShapeMatches(before.target, after.target)'), 'Target metadata/assets shape must remain stable under membership-only move.');
assert.ok(move.includes('trackShapeMatches(before.track, after.track)'), 'Track non-album shape must remain stable under compatibility-cache update.');
assert.ok(!move.includes('retryAlbumMove'), 'Build86 must not introduce blind automatic Album move retry.');
assert.ok(move.includes('responseRevisionsMatch'), 'Normal server success must verify exact returned target/source revisions.');
assert.ok(move.includes('payloadTrackIdsMatch'), 'Normal server success must verify exact target/source tracklists returned by Track Manager.');
assert.ok(move.includes("'ALBUM_MOVE_AMBIGUOUS'"), 'Normal success mismatch must stay unsafe rather than being called verified.');

assert.ok(albums.includes("from '../services/album-move-admin-api'"), 'AlbumManager must use the resilient Build86 move service.');
assert.ok(albums.includes('moveAdminAlbumTrackResilient(targetId'), 'AlbumManager cross-Album move must use resilient transport.');
assert.ok(albums.includes('RECOVERED AFTER LOST RESPONSE · Album move is canonically verified across target, source and Track cache.'), 'AlbumManager must distinguish recovered move success.');
assert.ok(albums.includes('Studio did not retry the write.'), 'Recovered move UI must state that Studio did not retry.');
assert.ok(metadata.includes("from '../services/album-move-admin-api'"), 'Metadata authority repair must use the same resilient move service.');
assert.ok(metadata.includes('moveAdminAlbumTrackResilient(fresh.id'), 'sourceAlbumId:null membership repair must be covered by Build86.');
assert.ok(metadata.includes('RECOVERED AFTER LOST RESPONSE'), 'Authority repair UI must distinguish recovered success.');
assert.ok(move.includes('RETRY SAFE AFTER RECONNECT'), 'Move service must expose narrow retry-safe outcome.');
assert.ok(move.includes('DO NOT RETRY'), 'Move service must expose ambiguous/unverified outcomes as unsafe.');

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
  'test-phase9-album-move-response-loss-build86.mjs',
  'test-phase9-album-membership-response-loss-build87.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build86 Album move response-loss guard passed as inherited ancestry through Build87: exact target/source membership + Track cache still classify committed/not-committed/ambiguous/unverified without blind retry.');
