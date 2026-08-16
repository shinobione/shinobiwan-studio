import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const phase4 = read('src/services/phase4-admin-api.ts');
const intake = read('src/components/TrackCreatePanel.tsx');
const albumApi = read('src/services/album-admin-api.ts');
const pkg = JSON.parse(read('package.json'));
if (pkg.version === '0.19.22') assert.ok(release.includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 ancestry.');

assert.ok(['0.19.19', '0.19.20', '0.19.21', '0.19.22'].includes(pkg.version), 'Build97 guard accepts Build97 and its bounded Build98/Build99 successors.');
if (pkg.version === '0.19.19') {
  assert.ok(release.includes("version: '0.19.19'"), 'Build97 release version mismatch.');
  assert.ok(release.includes('build: 97'), 'Build97 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-track-create-success-verification-truth'"), 'Build97 codename mismatch.');
}
if (['0.19.20', '0.19.21', '0.19.22'].includes(pkg.version)) assert.ok(release.includes('build97AncestryMarker'), 'Build98+ must preserve Build97 Track create ancestry.');
if (['0.19.21', '0.19.22'].includes(pkg.version)) assert.ok(release.includes('build98AncestryMarker'), 'Build99 must preserve accepted Build98 ancestry while inheriting Build97 Track create truth.');
assert.ok(release.includes('build96AncestryMarker'), 'Build97 must preserve accepted Build96 ancestry.');
assert.ok(release.includes("version: 0.19.18 · build: 96 · codename: 'studio-focus-slice4-phase9-album-create-success-verification-truth'"), 'Accepted Build96 identity must remain immutable in ancestry.');

assert.ok(phase4.includes("const payload = await postSimple<TrackCreateResponse>('/api/studio/tracks/create', {"), 'Track create must retain the existing Track Manager transport and intent.');
assert.ok(phase4.includes('const responseManifest = payload.track;'), 'Build97 must anchor normal-success verification to the server-normalized create manifest.');
assert.ok(phase4.includes("!responseManifest?.updatedAt || responseManifest.slug !== slug || responseManifest.status !== 'draft'"), 'Create response must prove trackId, draft state and canonical revision before verification.');
assert.ok(phase4.includes('const canonicalManifest = reread.track?.manifest;'), 'Build97 must retain a second private canonical Track reread.');
assert.ok(phase4.includes('canonicalManifest?.updatedAt === responseManifest.updatedAt'), 'Track create verification must require the exact server/canonical revision.');
assert.ok(phase4.includes('stableCreateManifestJson(canonicalManifest) === stableCreateManifestJson(responseManifest)'), 'Track create verification must compare the complete normalized response/canonical manifest shape.');
assert.ok(phase4.includes('function stableCreateManifestJson(value: unknown): string'), 'Build97 must use deterministic whole-manifest comparison independent of key order.');
assert.ok(!phase4.includes("const clientVerified = reread.track?.manifest?.slug === slug && reread.track?.manifest?.status === 'draft';"), 'Legacy slug+draft-only create verification must not return.');

assert.ok(phase4.includes("trackCreateSuccessVerificationPolicy: 'server-normalized-manifest-plus-private-reread-exact-match'"));
assert.ok(phase4.includes("trackCreateLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry'"), 'Build97 must not pretend create response-loss causality is solved.');
assert.ok(phase4.includes('maxAutomaticTrackCreateRetries: 0'), 'Track create must retain zero automatic retries.');
assert.ok(!phase4.includes('retryAdminTrackCreate'), 'Build97 must not add a Track create retry helper.');

assert.ok(intake.includes("const result = await createAdminTrack(effectiveSlug, metadataPatch(resolution, 'draft'));"), 'Daily New Track intake must keep using the shared create service.');
assert.ok(intake.includes("if (!result.clientVerified) throw new Phase4AdminError('The draft was created but its canonical reread could not be verified."), 'Daily New Track intake must stop before uploads when create verification fails.');

assert.ok(phase4.includes("const clientVerified = manifest?.updatedAt === payload.updatedAt && manifest?.assets?.[kind] === payload.filename && asset?.present === true && durationVerified;"), 'Track asset upload normal-success verification must remain unchanged.');
assert.ok(albumApi.includes("createSuccessVerificationPolicy: 'canonical-reread-revision-plus-requested-metadata'"), 'Accepted Build96 Album create verification must remain intact.');
assert.ok(albumApi.includes('maxAutomaticCreateRetries: 0'), 'Accepted Build96 Album create retry boundary must remain intact.');

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
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Build97 must remain inside the repository-native full build gate.');

console.log('Phase9 Build97 Track create success-verification guard passed: normal success proves the complete server-normalized create manifest against Studio private canonical reread while create lost-response recovery stays out of scope with zero automatic retries.');
