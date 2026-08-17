import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const app = read('src/App.tsx');
const health = read('src/components/AlbumHealthWorkspace.tsx');
const workspace = read('src/components/AlbumsWorkspace.tsx');
const metadata = read('src/services/album-metadata-admin-api.ts');
const membership = read('src/services/album-membership-admin-api.ts');
const move = read('src/services/album-move-admin-api.ts');
const pkg = JSON.parse(read('package.json'));
if (['0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build99AncestryMarker'), 'Build100+ must preserve accepted Build99 ancestry.');

assert.ok(['0.19.17', '0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version), 'Build95 guard accepts Build95 and bounded successors through Build105.');
assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 ancestry.');
assert.ok(
  release.includes("version: 0.19.16 · build: 94 · codename: 'studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth'"),
  'Build94 accepted runtime identity must remain immutable in ancestry.',
);
if (pkg.version === '0.19.17') {
  assert.ok(release.includes("version: '0.19.17'"), 'Build95 runtime version mismatch.');
  assert.ok(release.includes('build: 95'), 'Build95 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'"), 'Build95 codename mismatch.');
}
if (['0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) {
  assert.ok(release.includes('build95AncestryMarker'), 'Build96+ must preserve accepted Build95 ancestry.');
  assert.ok(release.includes("version: 0.19.17 · build: 95 · codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'"), 'Build95 accepted runtime identity must remain immutable in ancestry.');
}
if (['0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build96AncestryMarker'), 'Build97+ must preserve accepted Build96 ancestry while inheriting Build95 daily Albums truth.');
if (['0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build97AncestryMarker'), 'Build98+ must preserve Build97 ancestry while inheriting Build95 daily Albums truth.');
if (['0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build98AncestryMarker'), 'Build99+ must preserve accepted Build98 ancestry while inheriting Build95 daily Albums truth.');
if (['0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build100AncestryMarker'), 'Build101+ must preserve Build100 ancestry while inheriting Build95 daily Albums truth.');
if (['0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build101AncestryMarker'), 'Build102+ must preserve Build101 candidate ancestry while inheriting Build95 daily Albums truth.');
if (['0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build102AncestryMarker'), 'Build103+ must preserve accepted Build102 ancestry while inheriting Build95 daily Albums truth.');
if (['0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build103AncestryMarker'), 'Build104+ must preserve accepted Build103 ancestry while inheriting Build95 daily Albums truth.');
if (pkg.version === '0.19.27') assert.ok(release.includes('build104AncestryMarker'), 'Build105 must preserve rejected Build104 candidate ancestry while inheriting Build95 daily Albums truth.');

// Prove this is the actual daily Albums route, not only a legacy/advanced editor.
assert.ok(app.includes("import { AlbumHealthWorkspace } from './components/AlbumHealthWorkspace';"), 'App must retain AlbumHealthWorkspace as the daily Albums shell.');
assert.ok(app.includes("{route === 'albums' && <AlbumHealthWorkspace />}"), 'Daily Albums route must render AlbumHealthWorkspace.');
assert.ok(health.includes("import { AlbumsWorkspace } from './AlbumsWorkspace';"), 'AlbumHealthWorkspace must retain the focused AlbumsWorkspace.');
assert.ok(health.includes('<AlbumsWorkspace />'), 'Daily Albums shell must render AlbumsWorkspace.');

// Build95 closes the wiring gap: the daily editor must consume the already-accepted Build85/86/87 resilient services.
for (const marker of [
  "import { saveAdminAlbumMetadataResilient } from '../services/album-metadata-admin-api';",
  "import { saveAdminAlbumMembershipResilient } from '../services/album-membership-admin-api';",
  "import { moveAdminAlbumTrackResilient } from '../services/album-move-admin-api';",
  'saveAdminAlbumMetadataResilient(album.id, album.updatedAt!, patch)',
  'saveAdminAlbumMembershipResilient(album.id, album.updatedAt!, ids)',
  'moveAdminAlbumTrackResilient(targetId, {',
]) assert.ok(workspace.includes(marker), `Daily Albums resilient convergence missing ${marker}`);

assert.ok(!workspace.includes('saveAdminAlbumMetadata(album.id'), 'Daily Albums metadata must not bypass Build85 resilient truth.');
assert.ok(!workspace.includes('saveAdminAlbumMembership(album.id'), 'Daily Albums tracklist must not bypass Build87 resilient truth.');
assert.ok(!workspace.includes('moveAdminAlbumTrack(targetId'), 'Daily Albums move must not bypass Build86 resilient truth.');

for (const marker of [
  'RECOVERED AFTER LOST RESPONSE · Album metadata is canonically verified. Studio did not retry the write.',
  'RECOVERED AFTER LOST RESPONSE · Album tracklist is canonically verified across Album + Track caches. Studio did not retry the write.',
  'RECOVERED AFTER LOST RESPONSE · Album move is canonically verified across target, source and Track cache. Studio did not retry the write.',
  'Album tracklist saved and canonically verified across Album + Track caches.',
  'Track moved and canonically verified across target, source and Track cache.',
]) assert.ok(workspace.includes(marker), `Daily Albums recovered/verified truth copy missing ${marker}`);

// The accepted engines themselves must remain operation-specific and no-blind-retry.
assert.ok(metadata.includes("lostResponsePolicy: 'private-canonical-revision-metadata-shape-reread-no-blind-retry'"), 'Build85 metadata lost-response contract must remain intact.');
assert.ok(membership.includes("lostResponsePolicy: 'private-canonical-album-track-cache-reread-no-blind-retry'"), 'Build87 membership lost-response contract must remain intact.');
assert.ok(move.includes("lostResponsePolicy: 'private-canonical-target-source-track-reread-no-blind-retry'"), 'Build86 move lost-response contract must remain intact.');
assert.ok(!metadata.includes('retryAlbumMetadataSave'), 'Build95 must not introduce metadata blind retry.');
assert.ok(!membership.includes('retryAlbumMembership'), 'Build95 must not introduce membership blind retry.');
assert.ok(!move.includes('retryAlbumMove'), 'Build95 must not introduce move blind retry.');

// Deliberately frozen out-of-scope daily operations: Build95 must not pretend create/upload/delete gained new response-loss semantics.
for (const marker of [
  'createAdminAlbum,',
  'deleteAdminAlbumAsset,',
  'uploadAdminAlbumAsset,',
  'const result = await createAdminAlbum(',
  'const coverResult = await uploadAdminAlbumAsset(',
  'const result = await deleteAdminAlbumAsset(',
]) assert.ok(workspace.includes(marker), `Build95 must leave create/upload/delete scope unchanged: missing ${marker}`);

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
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build95 daily Albums resilient-service convergence guard passed through Build105: the actual Albums route still consumes accepted Build85/86/87 mutation truth without widening create/upload/delete scope.');
