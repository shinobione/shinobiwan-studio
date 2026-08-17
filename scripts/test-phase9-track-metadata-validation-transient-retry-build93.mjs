import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const duration = read('src/services/metadata-duration-api.ts');
const saveService = read('src/services/track-metadata-admin-api.ts');
const panel = read('src/components/MetadataValidationPanel.tsx');
const pkg = JSON.parse(read('package.json'));
if (['0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build99AncestryMarker'), 'Build100+ must preserve accepted Build99 ancestry.');

assert.ok(release.includes('build93AncestryMarker'), 'Build94+ must preserve accepted Build93 ancestry.');
assert.ok(release.includes("version: 0.19.15 · build: 93 · codename: 'studio-focus-slice4-phase9-track-metadata-validation-transient-retry-truth'"));
assert.ok(['0.19.15', '0.19.16', '0.19.17', '0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version), 'Build93 guard accepts Build93 and bounded successors through Build105.');
if (['0.19.17', '0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 ancestry while inheriting Build93 validation truth.');
if (['0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build95AncestryMarker'), 'Build96+ must preserve accepted Build95 ancestry while inheriting Build93 validation truth.');
if (['0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build96AncestryMarker'), 'Build97+ must preserve accepted Build96 ancestry while inheriting Build93 validation truth.');
if (['0.19.20', '0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build97AncestryMarker'), 'Build98+ must preserve Build97 ancestry while inheriting Build93 validation truth.');
if (['0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build98AncestryMarker'), 'Build99+ must preserve accepted Build98 ancestry while inheriting Build93 validation truth.');
if (['0.19.23', '0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build100AncestryMarker'), 'Build101+ must preserve Build100 ancestry while inheriting Build93 validation truth.');
if (['0.19.24', '0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build101AncestryMarker'), 'Build102+ must preserve Build101 candidate ancestry while inheriting Build93 validation truth.');
if (['0.19.25', '0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build102AncestryMarker'), 'Build103+ must preserve accepted Build102 ancestry while inheriting Build93 validation truth.');
if (['0.19.26', '0.19.27'].includes(pkg.version)) assert.ok(release.includes('build103AncestryMarker'), 'Build104+ must preserve accepted Build103 ancestry while inheriting Build93 validation truth.');
if (pkg.version === '0.19.27') assert.ok(release.includes('build104AncestryMarker'), 'Build105 must preserve rejected Build104 candidate ancestry while inheriting Build93 validation truth.');

assert.ok(duration.includes("const METADATA_VALIDATION_INTENT = 'metadata-validate-v1';"), 'Build93 must preserve the canonical non-mutating metadata validation intent.');
assert.ok(duration.includes('const TRANSIENT_METADATA_VALIDATION_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);'), 'Validation transient HTTP allowlist must stay explicit and bounded.');
assert.ok(duration.includes('async function runMetadataValidationWithOneTransientRetry<T>(attemptValidation: () => Promise<T>): Promise<T>'), 'Build93 must isolate the bounded validation retry wrapper.');
assert.ok(duration.includes('for (let attempt = 0; attempt < 2; attempt += 1)'), 'Metadata validation must make at most two total attempts.');
assert.ok(duration.includes('if (attempt === 0 && isTransientMetadataValidationError(reason))'), 'Only the first transient metadata validation failure may be retried.');
assert.ok(duration.includes('Track metadata validation failed after one bounded transient retry.'), 'A second validation failure must surface instead of looping.');

assert.ok(duration.includes("reason.code === 'TRACK_METADATA_VALIDATION_TIMEOUT' || reason.code === 'TRACK_METADATA_VALIDATION_TRANSPORT'"), 'Typed timeout/transport validation failures must be retryable.');
assert.ok(duration.includes('reason.status !== null && TRANSIENT_METADATA_VALIDATION_STATUSES.has(reason.status)'), 'Only the explicit transient HTTP status allowlist may trigger HTTP retry.');
assert.ok(duration.includes("reason.code === 'TRACK_METADATA_VALIDATION_INVALID_RESPONSE' || reason.code === 'TRACK_METADATA_VALIDATION_ACCESS_SESSION_REQUIRED'"), 'Access and invalid-response validation failures must stay deterministic non-retry.');
assert.ok(duration.includes('reason.message === PLAIN_VALIDATION_INVALID_JSON_MESSAGE || reason.message === PLAIN_VALIDATION_INVALID_SHAPE_MESSAGE'), 'Legacy plain invalid JSON/shape errors must be excluded from transient retry.');

assert.ok(duration.includes("timedOut ? 'TRACK_METADATA_VALIDATION_TIMEOUT' : 'TRACK_METADATA_VALIDATION_TRANSPORT'"), 'Duration-aware validation must type timeout vs transport separately.');
assert.ok(duration.includes("'TRACK_METADATA_VALIDATION_TRANSIENT_HTTP'"), 'Duration-aware transient HTTP without JSON must stay typed.');
assert.ok(duration.includes("'TRACK_METADATA_VALIDATION_ACCESS_SESSION_REQUIRED'"), 'Duration-aware Access gating must remain typed and non-retry.');
assert.ok(duration.includes("'TRACK_METADATA_VALIDATION_INVALID_RESPONSE'"), 'Duration-aware invalid JSON/shape must remain typed and non-retry.');
assert.equal((duration.match(/method:\s*'POST'/g) || []).length, 1, 'Build93 metadata-duration service must own exactly one non-mutating validation POST transport and no write POST.');
assert.ok(duration.includes('globalThis.setTimeout(() => controller.abort(), 7000)'), 'Metadata validation must retain the finite 7s per-attempt timeout.');

assert.ok(duration.includes('return runMetadataValidationWithOneTransientRetry(() => validateAdminTrackMetadata(trackId, expectedUpdatedAt, metadata));'), 'Plain metadata validation must use the bounded retry wrapper.');
assert.ok(duration.includes('return runMetadataValidationWithOneTransientRetry(() => postValidationWithEvidenceOnce(trackId, expectedUpdatedAt, metadata, evidence));'), 'Duration-aware metadata validation must use the same bounded retry wrapper.');
assert.ok(panel.includes('validateAdminTrackMetadataWithAudioEvidence,'), 'Visible Validate UX must consume the hardened Build93 validation wrapper.');
assert.ok(panel.includes('const result = await validateAdminTrackMetadataWithAudioEvidence(track.id, track.updatedAt, patch, evidence);'), 'Visible Validate action must traverse Build93 bounded validation.');
assert.ok(duration.includes('const reviewed = await validateAdminTrackMetadataWithAudioEvidence(trackId, expectedUpdatedAt, metadata, evidence);'), 'Build92 pre-save fresh proposal validation must inherit Build93 bounded validation.');

assert.ok(duration.includes("retryPolicy: 'one-retry-timeout-transport-transient-http-no-access-or-invalid-response-retry'"));
assert.ok(duration.includes('nonMutating: true'));
assert.ok(duration.includes('maxAttempts: 2'));
assert.ok(duration.includes('maxAutomaticWriteRetries: 0'));
assert.ok(saveService.includes('maxAutomaticWriteRetries: 0'), 'Build92 save policy must remain zero automatic write retries.');
assert.ok(!duration.includes('retryTrackMetadataSave'), 'Build93 must not introduce a Track metadata save retry helper.');
assert.equal((saveService.match(/for \(let attempt/g) || []).length, 0, 'Build92 save response-loss recovery must remain reread-based, not retry-loop based.');

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
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log(`Phase9 Build93 Track metadata validation retry guard passed as accepted ancestry under ${pkg.version}: visible and pre-save metadata-validate-v1 paths still retry once only for transient failures while Build92 save stays at zero automatic write retries.`);
