import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const workspace = read('src/components/AlbumsWorkspace.tsx');
const membership = read('src/services/album-membership-admin-api.ts');
const c25d = read('scripts/test-phase-ux-c2-5-d-albums.mjs');
const pkg = JSON.parse(read('package.json'));

assert.ok(['0.19.22', '0.19.23'].includes(pkg.version), 'Build100 guard accepts Build100 and its bounded Build101 successor.');
if (pkg.version === '0.19.22') {
  assert.ok(release.includes("version: '0.19.22'"), 'Build100 release version mismatch.');
  assert.ok(release.includes('build: 100'), 'Build100 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-first-track-intake'"), 'Build100 codename mismatch.');
}
assert.ok(release.includes('build99AncestryMarker'), 'Build100+ must preserve accepted Build99 ancestry.');
assert.ok(release.includes("version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'"), 'Accepted Build99 identity must remain immutable in Build100+ ancestry.');
if (pkg.version === '0.19.23') {
  assert.ok(release.includes('build100AncestryMarker'), 'Build101 must preserve accepted Build100 ancestry.');
  assert.ok(release.includes("version: 0.19.22 · build: 100 · codename: 'studio-focus-slice4-phase9-album-first-track-intake'"), 'Accepted Build100 identity must remain immutable in Build101 ancestry.');
}

// Canonical Album manifests, not Track compatibility caches, decide whether a Track is available for intake.
assert.ok(workspace.includes('const canonicalOwnerByTrackId = useMemo(() => {'), 'Build100 must derive canonical ownership from loaded Albums.');
assert.ok(workspace.includes('for (const summary of albums)'), 'Build100 owner map must inspect canonical Album summaries.');
assert.ok(workspace.includes('for (const trackId of summary.trackIds)'), 'Build100 owner map must use album.trackIds authority.');
assert.ok(workspace.includes('canonicalOwnerByTrackId.has(track.id)'), 'Build100 intake candidates must exclude Tracks owned by another canonical Album.');
assert.ok(workspace.includes('!ids.includes(track.id)'), 'Build100 intake candidates must exclude Tracks already staged/current in this Album.');
assert.ok(!workspace.includes("track.album.id === 'singles' && !ids.includes(track.id)"), 'Build100 must not trust the Track-side Singles cache as canonical ownership authority.');

assert.ok(workspace.includes("const [intakeTrackId, setIntakeTrackId] = useState('');"), 'Build100 must expose a bounded local intake selection.');
assert.ok(workspace.includes('function stageTrackIntake()'), 'Build100 must stage the selected Track locally before any write.');
const stageStart = workspace.indexOf('function stageTrackIntake()');
const stageEnd = workspace.indexOf('\n\n  async function saveMetadata()', stageStart);
assert.ok(stageStart >= 0 && stageEnd > stageStart, 'Build100 staging function boundary is missing.');
const stageFunction = workspace.slice(stageStart, stageEnd);
for (const forbidden of ['fetch(', 'saveAdminAlbumMembershipResilient(', 'moveAdminAlbumTrackResilient(', 'uploadAdminAlbumAsset(']) {
  assert.ok(!stageFunction.includes(forbidden), `Build100 staging must not perform writes: ${forbidden}`);
}
assert.ok(stageFunction.includes('setIds(current => current.includes(trackId) ? current : [...current, trackId])'), 'Build100 staging must only append the selected Track to local ordered ids.');
assert.ok(stageFunction.includes("setIntakeTrackId('')"), 'Build100 must clear the local picker after staging.');

assert.ok(workspace.includes('Add tracks from Singles / unassigned'), 'Daily Albums Tracklist must explain the guarded intake surface.');
assert.ok(workspace.includes('Add to tracklist'), 'Daily Albums Tracklist must expose a local staging action.');
assert.ok(workspace.includes('Nothing is written until Save tracklist.'), 'Build100 UI must state the write boundary explicitly.');
assert.ok(!workspace.includes('Add an unowned track…'), 'The historical unguarded ownership-assignment wording/path must not return.');
assert.ok(c25d.includes("!focusedAlbumUi.includes('Add an unowned track…')"), 'C2.5-D must keep the old unguarded intake path forbidden.');

// The only write remains the accepted Build87 resilient membership transaction.
assert.ok(workspace.includes('saveAdminAlbumMembershipResilient(album.id, album.updatedAt!, ids)'), 'Build100 Save tracklist must retain Build87 resilient membership authority.');
assert.ok(membership.includes('const unionTrackIds = [...new Set([...album.trackIds, ...expectedTrackIds])]'), 'Build87 must keep rereading newly requested Track IDs as part of the guarded snapshot.');
assert.ok(membership.includes("if (requested.has(trackId)) return { id: album.id, title: album.title };"), 'Build87 must keep assigning requested Tracks through the Album compatibility cache only after Album authority owns them.');
assert.ok(membership.includes("lostResponsePolicy: 'private-canonical-album-track-cache-reread-no-blind-retry'"), 'Build100 must preserve Build87 lost-response truth.');
assert.ok(!workspace.includes('saveAdminAlbumMembership('), 'Daily UI must not bypass the resilient membership service.');

for (const inherited of [
  'test-phase9-album-membership-response-loss-build87.mjs',
  'test-phase9-albums-daily-resilient-convergence-build95.mjs',
  'test-phase9-album-asset-upload-success-verification-build99.mjs',
  'test-phase9-album-first-track-intake-build100.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Build100 must remain inside the repository-native full build gate.');

console.log('Phase9 Build100 Album first-track intake guard passed: the daily Album Tracklist can stage canonically unowned Tracks, while Build87 remains the sole guarded membership write and Track caches never become ownership authority.');
