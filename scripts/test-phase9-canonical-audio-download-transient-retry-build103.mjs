import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const api = read('src/services/sonictrace-api.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version: '0\.19\.25'/);
assert.match(release, /build: 103/);
assert.match(release, /studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth/);
assert.match(release, /build102AncestryMarker/);
assert.equal(pkg.version, '0.19.25');
assert.match(pkg.scripts['check:phase9'], /test-phase9-canonical-audio-download-transient-retry-build103\.mjs/);

// The canonical audio fetch is a non-mutating GET that may receive exactly one bounded retry.
assert.match(api, /const TRANSIENT_CANONICAL_AUDIO_READ_STATUSES = new Set\(\[408, 425, 429, 500, 502, 503, 504\]\)/);
assert.match(api, /function isTransientCanonicalAudioReadError\(reason: unknown\): reason is SonicTraceError/);
assert.match(api, /reason\.code === 'CANONICAL_AUDIO_READ_TIMEOUT'/);
assert.match(api, /reason\.code === 'CANONICAL_AUDIO_READ_TRANSPORT'/);
assert.match(api, /async function fetchCanonicalAudioOnce\(/);
assert.match(api, /for \(let attempt = 0; attempt < 2; attempt \+= 1\)/);
assert.match(api, /Canonical audio download failed after one bounded transient retry/);
assert.match(api, /canonicalAudioReadRetryPolicy: 'one-retry-timeout-transport-transient-http-before-deep-audio-post'/);
assert.match(api, /canonicalAudioReadMaxAttempts: 2/);

// Deterministic response failures do not enter the transient retry class.
assert.match(api, /CANONICAL_AUDIO_READ_HTTP/);
assert.match(api, /CANONICAL_AUDIO_READ_INVALID_RESPONSE/);
assert.match(api, /CANONICAL_AUDIO_READ_ACCESS/);

// Critical boundary: the expensive Deep Audio POST is still one-shot. Retrying the pre-compute GET
// must never become an automatic re-submit of /api/studio/analyze.
assert.match(api, /xhr\.open\('POST', `\$\{sonicBase\(\)\}\/api\/studio\/analyze`, true\)/);
assert.doesNotMatch(api, /for \(let attempt[\s\S]*?runSonicTraceAnalysis/);
assert.match(api, /deepAudioComputeRetryPolicy: 'zero-automatic-retries'/);
assert.match(panel, /const result = await runSonicTraceAnalysis\(file, track\.id, current\.currentSourceVersion, dsp, setProgress\)/);

console.log('Build103 canonical audio GET retry guard PASS: one bounded pre-compute retry, zero automatic Deep Audio POST retries.');
