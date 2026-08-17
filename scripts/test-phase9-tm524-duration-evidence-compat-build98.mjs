import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const duration = read('src/services/metadata-duration-api.ts');
const save = read('src/services/track-metadata-admin-api.ts');
const phase4 = read('src/services/phase4-admin-api.ts');
const album = read('src/services/album-admin-api.ts');
const pkg = JSON.parse(read('package.json'));
if (['0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27', '0.19.28'].includes(pkg.version)) assert.ok(release.includes('build99AncestryMarker'), 'Build100+ must preserve accepted Build99 ancestry.');

assert.ok(['0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27', '0.19.28'].includes(pkg.version), 'Build98 guard accepts Build98 and bounded successors through Build106.');
if (pkg.version === '0.19.20') {
  assert.ok(release.includes("version: '0.19.20'"), 'Build98 release version mismatch.');
  assert.ok(release.includes('build: 98'), 'Build98 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'"), 'Build98 codename mismatch.');
}
assert.ok(release.includes('build97AncestryMarker'), 'Build98+ must preserve Build97 candidate ancestry.');
if (['0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27', '0.19.28'].includes(pkg.version)) {
  assert.ok(release.includes('build98AncestryMarker'), 'Build99+ must preserve accepted Build98 ancestry.');
  assert.ok(release.includes("version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'"), 'Build98 accepted runtime identity must remain immutable in successor ancestry.');
}
if (['0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27', '0.19.28'].includes(pkg.version)) assert.ok(release.includes('build100AncestryMarker'), 'Build101+ must preserve Build100 ancestry.');
if (['0.19.24', '0.19.25', '0.19.26', '0.19.27', '0.19.28'].includes(pkg.version)) assert.ok(release.includes('build101AncestryMarker'), 'Build102+ must preserve Build101 candidate ancestry while retaining the stronger Track asset verification boundary.');
if (['0.19.25', '0.19.26', '0.19.27', '0.19.28'].includes(pkg.version)) assert.ok(release.includes('build102AncestryMarker'), 'Build103+ must preserve accepted Build102 ancestry.');
if (['0.19.26', '0.19.27', '0.19.28'].includes(pkg.version)) assert.ok(release.includes('build103AncestryMarker'), 'Build104+ must preserve accepted Build103 ancestry.');
if (['0.19.27', '0.19.28'].includes(pkg.version)) assert.ok(release.includes('build104AncestryMarker'), 'Build105+ must preserve rejected Build104 candidate ancestry.');
if (pkg.version === '0.19.28') assert.ok(release.includes('build105AncestryMarker'), 'Build106 must preserve accepted Build105 ancestry.');
assert.ok(release.includes("version: 0.19.19 · build: 97 · codename: 'studio-focus-slice4-phase9-track-create-success-verification-truth'"), 'Build97 runtime identity must remain immutable in Build98 ancestry.');

for (const pair of ["'5.22/1.12'", "'5.23/1.13'", "'5.24/1.14'"]) {
  assert.ok(duration.includes(pair), `Duration validation must support bounded pair ${pair}.`);
  assert.ok(save.includes(pair), `Duration-aware resilient save must support bounded pair ${pair}.`);
}
assert.ok(duration.includes('Track Manager v5.24 / v1.14'), 'Human-facing validation compatibility copy must mention TM5.24/bridge1.14.');
assert.ok(save.includes('v5.24 / v1.14'), 'Human-facing save compatibility copy must mention TM5.24/bridge1.14.');
assert.ok(!duration.includes('parseFloat(health.trackManagerVersion'), 'Build98 must not widen compatibility to an unbounded numeric version gate.');
assert.ok(!save.includes('parseFloat(health.trackManagerVersion'), 'Build98 save compatibility must stay an explicit allowlist.');

assert.ok(duration.includes('runMetadataValidationWithOneTransientRetry'), 'Build93 validation retry truth must remain intact.');
assert.ok(duration.includes('maxAutomaticWriteRetries: 0'), 'Build98 must keep metadata writes at zero automatic retries.');
assert.ok(save.includes('manifestMatchesReviewedProposal(manifest, reviewedProposal)'), 'Build92 exact proposal postcondition must remain intact.');
assert.ok(!save.includes('retryTrackMetadataSave'), 'Build98 must not add blind Track metadata retry.');
assert.ok(phase4.includes("trackCreateSuccessVerificationPolicy: 'server-normalized-manifest-plus-private-reread-exact-match'"), 'Build97 Track create normal-success truth must remain intact.');
assert.ok(phase4.includes('maxAutomaticTrackCreateRetries: 0'), 'Build97 Track create zero-retry boundary must remain intact.');
assert.ok(album.includes("transport: 'Track Manager v5.23-v5.24 / bridges v1.13-v1.14'"), 'Album service contract label must describe the bounded current TM successor line.');

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
  'test-phase9-tm524-duration-evidence-compat-build98.mjs',
  'test-phase9-album-asset-upload-success-verification-build99.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);

console.log('Build98 TM5.24/bridge1.14 compatibility corrective guard passed through Build106: duration evidence stays explicitly bounded, Build97 create truth remains intact, and writes retain zero automatic retries.');
