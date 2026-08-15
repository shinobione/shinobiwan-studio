import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const lyrics = read('src/services/lyrics-admin-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.ok(release.includes('build90AncestryMarker'), 'Build91+ must preserve accepted Build90 ancestry.');
assert.ok(release.includes("version: 0.19.12 · build: 90 · codename: 'studio-focus-slice4-phase9-lyrics-private-read-transient-retry-truth'"));

assert.ok(lyrics.includes('const TRANSIENT_LYRICS_READ_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);'), 'Lyrics transient HTTP allowlist must stay explicit and bounded.');
assert.ok(lyrics.includes('async function fetchLyricsJsonOnce(trackId: string): Promise<AdminLyricsSnapshot>'), 'Build90 must isolate one canonical Lyrics GET attempt.');
assert.ok(lyrics.includes("'Canonical lyrics read transport was interrupted.'"), 'Lyrics transport interruption must not be mislabeled Cloudflare Access.');
assert.ok(lyrics.includes("'LYRICS_READ_TIMEOUT'"));
assert.ok(lyrics.includes("'LYRICS_READ_TRANSPORT'"));
assert.ok(lyrics.includes('reason.status !== null && TRANSIENT_LYRICS_READ_STATUSES.has(reason.status)'), 'Only explicit transient HTTP statuses may be retried.');
assert.ok(lyrics.includes('for (let attempt = 0; attempt < 2; attempt += 1)'), 'Lyrics GETs must make at most two total attempts.');
assert.ok(lyrics.includes('if (attempt === 0 && isTransientLyricsReadError(reason)) continue;'), 'Only the first transient Lyrics GET failure may be retried.');
assert.ok(lyrics.includes('Canonical lyrics read failed after one bounded transient retry.'), 'A second transient Lyrics GET failure must surface.');
assert.ok(lyrics.includes("privateReadRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-retry'"));
assert.ok(lyrics.includes('privateReadMaxAttempts: 2'));

assert.ok(lyrics.includes("'LYRICS_READ_ACCESS_SESSION_REQUIRED'"), 'Non-JSON Access gating must remain deterministic and non-retry.');
assert.ok(lyrics.includes("response.status === 401 || response.status === 403 ? 'LYRICS_READ_ACCESS' : 'LYRICS_READ_HTTP'"), 'Lyrics 401/403 must remain deterministic Access failures.');
assert.ok(lyrics.includes("'LYRICS_READ_INVALID_RESPONSE'"), 'Invalid Lyrics JSON must stay deterministic and non-retry.');
assert.ok(!lyrics.includes("reason.code === 'LYRICS_READ_ACCESS'\n    ||"), 'Access must never enter the Lyrics retry predicate.');
assert.ok(!lyrics.includes("reason.code === 'LYRICS_READ_INVALID_RESPONSE'\n    ||"), 'Invalid JSON must never enter the Lyrics retry predicate.');

assert.ok(lyrics.includes('const payload = await getLyricsJson(trackId);'), 'Canonical user-facing Lyrics read must use the bounded helper.');
assert.ok(lyrics.includes('Promise.all([getLyricsJson(trackId), getAdminTrack(trackId)])'), 'Build83 save verification/recovery must keep using canonical Lyrics reread plus Track reread.');
assert.equal((lyrics.match(/method:\s*'POST'/g) || []).length, 2, 'Build90 ancestry permits Build94 to add one dedicated non-mutating validation POST while keeping exactly one save POST.');
assert.ok(lyrics.includes('async function postLyricsValidationOnce('), 'Build94 validation must use its dedicated non-mutating POST transport.');
assert.ok(lyrics.includes('validateLyricsWithOneTransientRetry(trackId'), 'Build94 validation must traverse the bounded validation retry transport.');
assert.ok(lyrics.includes("postLyrics<AdminLyricsSaveResponse>(trackId, 'save'"), 'Existing generic Lyrics POST transport must remain save-only after the Build94 validation split.');
assert.ok(lyrics.includes('async function postLyrics<T extends AdminLyricsValidationResponse | AdminLyricsSaveResponse>('), 'Existing generic Lyrics POST helper must remain available for the save transport.');
assert.ok(lyrics.includes("timeoutCode: 'LYRICS_SAVE_TIMEOUT'"), 'Build83 save timeout classification must remain inherited.');
assert.ok(lyrics.includes("transportCode: 'LYRICS_SAVE_TRANSPORT'"), 'Build83 save transport classification must remain inherited.');
assert.ok(lyrics.includes("lostResponsePolicy: 'private-canonical-reread-no-blind-retry'"), 'Build83 no-blind-write-retry contract must remain explicit.');
assert.ok(lyrics.includes('maxAutomaticSaveRetries: 0'), 'Build94 must keep automatic Lyrics save retries explicitly disabled.');
assert.ok(!lyrics.includes('retryLyricsSave'), 'Build90 ancestry must never introduce automatic Lyrics save retry.');
assert.ok(!lyrics.includes('retryLyricsValidation'), 'Build90 ancestry must never introduce an unbounded automatic Lyrics validation retry helper.');

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
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build90 Lyrics private-read retry guard passed as inherited ancestry: canonical Lyrics GET still retries once only for transient timeout/transport/HTTP failures while Access/CORS, deterministic 4xx and invalid JSON remain non-retry; Build94 adds one bounded non-mutating validation POST while Build83 save recovery stays single-transport and no-blind-retry.');
