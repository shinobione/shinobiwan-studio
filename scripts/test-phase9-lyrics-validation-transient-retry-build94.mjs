import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const lyrics = read('src/services/lyrics-admin-api.ts');
const ui = read('src/components/LyricsEditorPanel.tsx');
const pkg = JSON.parse(read('package.json'));
if (pkg.version === '0.19.22') assert.ok(release.includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 ancestry.');

assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 ancestry.');
assert.ok(release.includes("version: 0.19.16 · build: 94 · codename: 'studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth'"));
assert.ok(['0.19.16', '0.19.17', '0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23'].includes(pkg.version), 'Build94 guard accepts Build94 and its bounded Build95/Build96/Build97/Build98 successors.');
if (['0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) assert.ok(release.includes('build95AncestryMarker'), 'Build96+ must preserve accepted Build95 ancestry while inheriting Build94 validation truth.');
if (['0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) assert.ok(release.includes('build96AncestryMarker'), 'Build97+ must preserve accepted Build96 ancestry while inheriting Build94 validation truth.');
if (['0.19.20', '0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) assert.ok(release.includes('build97AncestryMarker'), 'Build98+ must preserve Build97 ancestry while inheriting Build94 validation truth.');
if (['0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) assert.ok(release.includes('build98AncestryMarker'), 'Build99 must preserve accepted Build98 ancestry while inheriting Build94 validation truth.');

assert.ok(lyrics.includes("const LYRICS_VALIDATION_INTENT = 'lyrics-validate-v1';"), 'Build94 must preserve the canonical non-mutating Lyrics validation intent.');
assert.ok(lyrics.includes('const TRANSIENT_LYRICS_VALIDATION_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);'), 'Lyrics validation transient HTTP allowlist must stay explicit and bounded.');
assert.ok(lyrics.includes('async function postLyricsValidationOnce('), 'Build94 must isolate one non-mutating Lyrics validation attempt.');
assert.ok(lyrics.includes('async function validateLyricsWithOneTransientRetry('), 'Build94 must isolate the bounded Lyrics validation retry wrapper.');
assert.ok(lyrics.includes('for (let attempt = 0; attempt < 2; attempt += 1)'), 'Lyrics validation must make at most two total attempts.');
assert.ok(lyrics.includes('if (attempt === 0 && isTransientLyricsValidationError(reason)) continue;'), 'Only the first transient Lyrics validation failure may be retried.');
assert.ok(lyrics.includes('Lyrics validation failed after one bounded transient retry.'), 'A second transient validation failure must surface instead of looping.');

assert.ok(lyrics.includes("reason.code === 'LYRICS_VALIDATION_TIMEOUT'"), 'Lyrics validation timeout must be typed and retryable.');
assert.ok(lyrics.includes("reason.code === 'LYRICS_VALIDATION_TRANSPORT'"), 'Lyrics validation browser transport interruption must be typed and retryable.');
assert.ok(lyrics.includes('reason.status !== null && TRANSIENT_LYRICS_VALIDATION_STATUSES.has(reason.status)'), 'Only the explicit transient HTTP status allowlist may trigger HTTP retry.');
assert.ok(lyrics.includes("reason.code === 'LYRICS_VALIDATION_ACCESS_SESSION_REQUIRED' || reason.code === 'LYRICS_VALIDATION_INVALID_RESPONSE'"), 'Access and invalid-response validation failures must stay deterministic non-retry.');
assert.ok(lyrics.includes("'LYRICS_VALIDATION_ACCESS_SESSION_REQUIRED'"), 'Non-JSON Access/session gating must be typed explicitly.');
assert.ok(lyrics.includes("'LYRICS_VALIDATION_INVALID_RESPONSE'"), 'Invalid validation JSON/shape must be typed explicitly.');
assert.ok(lyrics.includes('globalThis.setTimeout(() => controller.abort(), 9000)'), 'Lyrics validation must retain the finite 9s per-attempt timeout.');

assert.ok(lyrics.includes('const payload = await validateLyricsWithOneTransientRetry(trackId, {'), 'Visible Lyrics validation service must use the bounded retry wrapper.');
assert.ok(ui.includes('validateAdminTrackLyrics(track.id, snapshot.updatedAt, snapshot.lyricsEtag, draft)'), 'Visible Lyrics Validate action must traverse the hardened Build94 service.');
assert.ok(ui.includes('Validation is non-mutating. Save is allowed only against this exact manifest revision + lyrics ETag.'), 'Build94 retry safety depends on validation remaining explicitly non-mutating.');

assert.ok(lyrics.includes("lostResponsePolicy: 'private-canonical-reread-no-blind-retry'"), 'Build83 save recovery policy must remain inherited.');
assert.ok(lyrics.includes("timeoutCode: 'LYRICS_SAVE_TIMEOUT'"), 'Lyrics save timeout classification must remain intact.');
assert.ok(lyrics.includes("transportCode: 'LYRICS_SAVE_TRANSPORT'"), 'Lyrics save transport classification must remain intact.');
assert.ok(lyrics.includes("!['LYRICS_SAVE_TIMEOUT', 'LYRICS_SAVE_TRANSPORT'].includes(reason.code || '')"), 'Only save response-loss transport failures may enter Build83 recovery.');
assert.ok(lyrics.includes('maxAutomaticSaveRetries: 0'), 'Build94 must make the zero automatic Lyrics save retry boundary explicit.');
assert.ok(!lyrics.includes('retryAdminTrackLyricsSave'), 'Build94 must not introduce a Lyrics save retry helper.');

assert.ok(lyrics.includes("validationRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-or-invalid-response-retry'"));
assert.ok(lyrics.includes('validationMaxAttempts: 2'));
assert.ok(lyrics.includes('validationNonMutating: true'));

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
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log(`Phase9 Build94 Lyrics validation retry guard passed as accepted ancestry under ${pkg.version}: non-mutating lyrics-validate-v1 retries once only for transient timeout/transport/HTTP failures, while Access/invalid responses remain non-retry and Build83 save stays at zero automatic write retries.`);