import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const membership = read('src/services/album-membership-admin-api.ts');
const albums = read('src/components/AlbumManager.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(release.includes('build87AncestryMarker'), 'Successor builds must preserve accepted Build87 ancestry.');
assert.ok(release.includes("version: 0.19.9 · build: 87 · codename: 'studio-focus-slice4-phase9-album-membership-response-loss-truth'"), 'Build87 accepted runtime identity must remain immutable in ancestry.');
assert.ok(release.includes('build86AncestryMarker'), 'Build87 ancestry must preserve accepted Build86 ancestry.');

for (const marker of [
  'ALBUM_MEMBERSHIP_TIMEOUT',
  'ALBUM_MEMBERSHIP_TRANSPORT',
  'ALBUM_MEMBERSHIP_INVALID_RESPONSE',
  'ALBUM_MEMBERSHIP_NOT_COMMITTED',
  'ALBUM_MEMBERSHIP_AMBIGUOUS',
  'ALBUM_MEMBERSHIP_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  "commitState: 'committed'",
  "lostResponsePolicy: 'private-canonical-album-track-cache-reread-no-blind-retry'",
]) assert.ok(membership.includes(marker), `Build87 Album membership lost-response contract missing ${marker}`);

assert.ok(membership.includes('const before = await captureMembershipSnapshot(albumId, expectedUpdatedAt, requestedTrackIds);'), 'Membership save must capture canonical Album + affected Track state before POST.');
assert.ok(membership.includes('album.updatedAt !== expectedUpdatedAt'), 'Membership save must reject stale Album revision before write.');
assert.ok(membership.includes('const unionTrackIds = [...new Set([...album.trackIds, ...expectedTrackIds])];'), 'Membership recovery must cover the union of previous and requested Track caches.');
assert.ok(membership.includes("if (requested.has(trackId)) return { id: album.id, title: album.title };"), 'Requested Tracks must converge to the canonical Album cache.');
assert.ok(membership.includes("return { id: 'singles', title: 'Singles' };"), 'Removed Tracks owned by the Album must converge to transitional Singles cache.');
assert.ok(membership.includes('reason instanceof AdminReadError && reason.status === 404'), 'A missing prior Track must be represented explicitly rather than turning every cleanup into a read failure.');
assert.ok(membership.includes('if (requested.has(trackId)) {'), 'Missing Tracks may never be introduced into the requested canonical tracklist.');
assert.ok(membership.includes("'ALBUM_TRACK_MISSING'"), 'Requested missing Track must lock the membership write with an explicit code.');
assert.ok(membership.includes('return { trackId, before: null, expectedAlbum: null, shouldChange: false };'), 'A missing prior Track that is being removed must remain removable without a fake cache write.');
assert.ok(membership.includes('delete stable.updatedBy;'), 'Track stable-shape verification must ignore updatedBy, which Track Manager changes with a legitimate cache write.');
assert.ok(membership.includes('async function postAlbumMembership('), 'Build87 must isolate Album membership transport with timeout classification.');
assert.ok(membership.includes("LOST_RESPONSE_CODES.has(reason.code || '')"), 'Only timeout/transport/invalid-response ambiguity may enter canonical membership recovery.');
assert.ok(membership.includes('const after = await readMembershipState(albumId, trackedIds);'), 'Lost response must reread canonical Album + all affected Track caches.');
assert.ok(membership.includes('committedPostcondition(before, after)'), 'Recovered success must require the exact operation-specific membership postcondition.');
assert.ok(membership.includes('notCommittedPostcondition(before, after)'), 'Retry safety must require the exact Album + Track cache pre-write state.');
assert.ok(membership.includes('albumShapeMatches(before.album, after.album)'), 'Album metadata/assets shape must remain stable under membership-only save.');
assert.ok(membership.includes('trackShapeMatches(expected.before, afterTrack)'), 'Track non-album shape must remain stable under compatibility-cache updates.');
assert.ok(membership.includes('afterTrack.updatedAt === expected.before.updatedAt'), 'Tracks that require no cache mutation must remain revision-stable.');
assert.ok(!membership.includes('retryAlbumMembership'), 'Build87 must not introduce blind automatic membership retry.');
assert.ok(membership.includes('responseRevisionMatches'), 'Normal success must verify the exact returned Album revision.');
assert.ok(membership.includes('responseTrackIdsMatch'), 'Normal success must verify the exact returned ordered tracklist.');
assert.ok(membership.includes('responseCacheCountMatches'), 'Normal success must cross-check the server Track cache update count when provided.');
assert.ok(membership.includes("'ALBUM_MEMBERSHIP_AMBIGUOUS'"), 'Normal success mismatch must remain unsafe rather than being called verified.');

assert.ok(albums.includes("from '../services/album-membership-admin-api'"), 'AlbumManager must use the resilient Build87 membership service.');
assert.ok(albums.includes('saveAdminAlbumMembershipResilient(album.id'), 'AlbumManager tracklist save must use resilient transport.');
assert.ok(albums.includes('RECOVERED AFTER LOST RESPONSE · Album tracklist is canonically verified across Album + Track caches.'), 'AlbumManager must distinguish recovered membership success.');
assert.ok(albums.includes('Studio did not retry the write.'), 'Recovered membership UI must state that Studio did not retry.');
assert.ok(albums.includes('Album tracklist saved and canonically verified across Album + Track caches.'), 'Normal membership success copy must reflect full canonical verification.');
assert.ok(membership.includes('RETRY SAFE AFTER RECONNECT'), 'Membership service must expose the narrow retry-safe outcome.');
assert.ok(membership.includes('DO NOT RETRY'), 'Membership service must expose ambiguous/unverified outcomes as unsafe.');

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
  'test-phase9-album-move-response-loss-build86.mjs',
  'test-phase9-album-membership-response-loss-build87.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build87 Album membership response-loss guard passed: accepted ordered Album membership + every affected Track cache contract remains inherited under the current successor runtime.');
