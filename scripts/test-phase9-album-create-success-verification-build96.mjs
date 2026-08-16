import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const albumApi = read('src/services/album-admin-api.ts');
const focused = read('src/components/AlbumsWorkspace.tsx');
const legacy = read('src/components/AlbumManager.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(['0.19.18', '0.19.19', '0.19.20'].includes(pkg.version), 'Build96 guard accepts Build96 and its bounded Build97/Build98 successors.');
assert.ok(release.includes('build95AncestryMarker'), 'Build96+ must preserve accepted Build95 ancestry.');
assert.ok(release.includes("version: 0.19.17 · build: 95 · codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'"), 'Accepted Build95 identity must remain immutable in ancestry.');
if (pkg.version === '0.19.18') {
  assert.ok(release.includes("version: '0.19.18'"), 'Build96 release version mismatch.');
  assert.ok(release.includes('build: 96'), 'Build96 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-create-success-verification-truth'"), 'Build96 codename mismatch.');
}
if (['0.19.19', '0.19.20'].includes(pkg.version)) {
  assert.ok(release.includes('build96AncestryMarker'), 'Build97+ must preserve accepted Build96 ancestry.');
  assert.ok(release.includes("version: 0.19.18 · build: 96 · codename: 'studio-focus-slice4-phase9-album-create-success-verification-truth'"), 'Accepted Build96 identity must remain immutable in ancestry.');
}
if (pkg.version === '0.19.20') assert.ok(release.includes('build97AncestryMarker'), 'Build98 must preserve Build97 ancestry while inheriting Build96 Album create truth.');

// Build96 tightens only normal-success canonical verification for Album create.
assert.ok(albumApi.includes("const payload = await writeJson('/api/studio/albums', { intent: INTENT.create, album });"), 'Album create must retain the existing Track Manager write intent and transport.');
assert.ok(albumApi.includes('const { id, ...metadata } = album;'), 'Album create must separate immutable id from the exact requested metadata postcondition.');
assert.ok(albumApi.includes('return verify(id, payload, { expectedMetadata: metadata });'), 'Album create normal success must reread and compare the exact requested metadata.');
assert.ok(!albumApi.includes('return verify(album.id, payload);'), 'Revision-only Album create verification must not return.');
assert.ok(albumApi.includes('function metadataMismatch('), 'Build96 must reuse the existing exact metadata comparator rather than introduce a second truth model.');
assert.ok(albumApi.includes("createSuccessVerificationPolicy: 'canonical-reread-revision-plus-requested-metadata'"));
assert.ok(albumApi.includes("createLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry'"), 'Build96 must state that create lost-response recovery remains out of scope.');
assert.ok(albumApi.includes('maxAutomaticCreateRetries: 0'), 'Album create must retain zero automatic retries.');
assert.ok(!albumApi.includes('retryAdminAlbumCreate'), 'Build96 must not add an Album create retry helper.');

// Upload is deliberately not generalized: exact-byte proof still requires stronger digest/operation identity.
assert.ok(albumApi.includes("form.set('intent', INTENT.upload)"), 'Album asset upload must retain its existing transport.');
assert.ok(albumApi.includes('return verify(albumId, payload);'), 'Build96 must leave upload verification semantics unchanged.');

// Both existing create surfaces inherit the service fix and still refuse unverified success.
for (const [name, source] of [['focused', focused], ['legacy', legacy]]) {
  assert.ok(source.includes('createAdminAlbum'), `${name} Album create surface must keep using the shared canonical create service.`);
  assert.match(source, /if\s*\(\s*!\w+\.clientVerified\s*\)/, `${name} Album create surface must reject a create that the canonical reread cannot verify.`);
}

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
  'test-phase9-album-move-response-loss-build86.mjs',
  'test-phase9-album-membership-response-loss-build87.mjs',
  'test-phase9-private-read-transient-retry-build88.mjs',
  'test-phase9-album-private-read-transient-retry-build89.mjs',
  'test-phase9-lyrics-private-read-transient-retry-build90.mjs',
  'test-phase9-sonictrace-private-read-transient-retry-build91.mjs',
  'test-phase9-track-metadata-response-loss-build92.mjs',
  'test-phase9-track-metadata-validation-transient-retry-build93.mjs',
  'test-phase9-lyrics-validation-transient-retry-build94.mjs',
  'test-phase9-albums-daily-resilient-convergence-build95.mjs',
  'test-phase9-album-create-success-verification-build96.mjs',
  'test-phase9-track-create-success-verification-build97.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Build96 must remain inside the repository-native full build gate.');

console.log('Phase9 Build96 Album create success-verification guard passed: normal success now proves revision + exact requested metadata, while create lost-response recovery and binary upload remain explicitly out of scope with zero automatic create retries.');