import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const duration = read('src/services/metadata-duration-api.ts');
const saveService = read('src/services/track-metadata-admin-api.ts');
const panel = read('src/components/MetadataValidationPanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.15'/);
assert.match(release, /build:\s*93/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-track-metadata-validation-transient-retry-truth'"));
assert.ok(release.includes('build92AncestryMarker'), 'Build93 must preserve accepted Build92 ancestry.');
assert.ok(release.includes("version: 0.19.14 · build: 92 · codename: 'studio-focus-slice4-phase9-track-metadata-response-loss-truth'"));
assert.equal(pkg.version, '0.19.15', 'package version must match Build93 runtime version.');

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

console.log('Phase9 Build93 Track metadata validation retry guard passed: visible and pre-save metadata-validate-v1 paths retry once only for transient timeout/transport/HTTP failures, while Access/invalid responses remain non-retry and Build92 save stays at zero automatic write retries.');
