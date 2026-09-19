import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const duration = read('src/services/metadata-duration-api.ts');
const save = read('src/services/track-metadata-admin-api.ts');
const phase4 = read('src/services/phase4-admin-api.ts');
const album = read('src/services/album-admin-api.ts');
const pkg = JSON.parse(read('package.json'));
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);

assert.ok(currentBuild >= 98, `Build98 guard requires Build98 or a successor, got Build${currentBuild}.`);
assert.ok(release.includes('build97AncestryMarker'), 'Build98+ must preserve Build97 candidate ancestry.');
assert.ok(release.includes("version: 0.19.19 · build: 97 · codename: 'studio-focus-slice4-phase9-track-create-success-verification-truth'"), 'Build97 runtime identity must remain immutable in Build98 ancestry.');
if (currentBuild === 98) {
  assert.ok(release.includes("version: '0.19.20'"), 'Build98 release version mismatch.');
  assert.ok(release.includes('build: 98'), 'Build98 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'"), 'Build98 codename mismatch.');
} else {
  assert.ok(release.includes('build98AncestryMarker'), `Build${currentBuild} must preserve accepted Build98 ancestry.`);
  assert.ok(release.includes("version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'"), 'Build98 accepted runtime identity must remain immutable in successor ancestry.');
}
for (let build = 99; build <= Math.min(currentBuild - 1, 113); build += 1) {
  assert.ok(release.includes(`build${build}AncestryMarker`), `Build${currentBuild} must preserve Build${build} ancestry while inheriting Build98 compatibility truth.`);
}

const requiredPairs = ["'5.22/1.12'", "'5.23/1.13'", "'5.24/1.14'"];
if (currentBuild >= 114) requiredPairs.push("'5.25/1.15'");
if (currentBuild >= 115) requiredPairs.push("'5.26/1.16'");
if (currentBuild >= 116) requiredPairs.push("'5.27/1.17'");
if (currentBuild >= 117) requiredPairs.push("'5.28/1.18'");
for (const pair of requiredPairs) {
  assert.ok(duration.includes(pair), `Duration validation must support bounded pair ${pair}.`);
  assert.ok(save.includes(pair), `Duration-aware resilient save must support bounded pair ${pair}.`);
}
if (currentBuild >= 114) {
  assert.ok(duration.includes('v5.25 / v1.15'), 'Build114 duration validation compatibility copy must mention TM5.25/bridge1.15.');
  assert.ok(save.includes('v5.25 / v1.15'), 'Build114 save compatibility copy must mention TM5.25/bridge1.15.');
  if (currentBuild >= 115) {
    assert.ok(duration.includes('v5.26 / v1.16'), 'Build115 duration validation compatibility copy must mention TM5.26/bridge1.16.');
    assert.ok(save.includes('v5.26 / v1.16'), 'Build115 save compatibility copy must mention TM5.26/bridge1.16.');
  }
  if (currentBuild >= 116) {
    assert.ok(duration.includes('v5.27 / v1.17'), 'Build116 duration validation compatibility copy must mention TM5.27/bridge1.17.');
    assert.ok(save.includes('v5.27 / v1.17'), 'Build116 save compatibility copy must mention TM5.27/bridge1.17.');
  }
  if (currentBuild >= 117) {
    assert.ok(duration.includes('v5.28 / v1.18'), 'Build117 duration validation compatibility copy must mention TM5.28/bridge1.18.');
    assert.ok(save.includes('v5.28 / v1.18'), 'Build117 save compatibility copy must mention TM5.28/bridge1.18.');
  }
  assert.ok(album.includes("transport: 'Track Manager v5.23-v5.25 / bridges v1.13-v1.15'"), 'Album service contract label must include the bounded TM5.25 successor line.');
} else {
  assert.ok(duration.includes('Track Manager v5.24 / v1.14'), 'Human-facing validation compatibility copy must mention TM5.24/bridge1.14.');
  assert.ok(save.includes('v5.24 / v1.14'), 'Human-facing save compatibility copy must mention TM5.24/bridge1.14.');
  assert.ok(album.includes("transport: 'Track Manager v5.23-v5.24 / bridges v1.13-v1.14'"), 'Historical Album service contract label must describe the bounded TM successor line.');
}
assert.ok(!duration.includes('parseFloat(health.trackManagerVersion'), 'Build98 must not widen compatibility to an unbounded numeric version gate.');
assert.ok(!save.includes('parseFloat(health.trackManagerVersion'), 'Build98 save compatibility must stay an explicit allowlist.');

assert.ok(duration.includes('runMetadataValidationWithOneTransientRetry'), 'Build93 validation retry truth must remain intact.');
assert.ok(duration.includes('maxAutomaticWriteRetries: 0'), 'Build98 must keep metadata writes at zero automatic retries.');
assert.ok(save.includes('manifestMatchesReviewedProposal(manifest, reviewedProposal)'), 'Build92 exact proposal postcondition must remain intact.');
assert.ok(!save.includes('retryTrackMetadataSave'), 'Build98 must not add blind Track metadata retry.');
assert.ok(phase4.includes("trackCreateSuccessVerificationPolicy: 'server-normalized-manifest-plus-private-reread-exact-match'"), 'Build97 Track create normal-success truth must remain intact.');
assert.ok(phase4.includes('maxAutomaticTrackCreateRetries: 0'), 'Build97 Track create zero-retry boundary must remain intact.');

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

console.log(`Build98 bounded duration-evidence compatibility guard passed through Build${currentBuild}: explicitly authorized backend/bridge pairs remain enumerated, Build97 create truth stays intact, and writes retain zero automatic retries.`);
