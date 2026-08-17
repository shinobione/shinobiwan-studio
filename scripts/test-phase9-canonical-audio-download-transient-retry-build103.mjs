import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const api = read('src/services/sonictrace-api.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(['0.19.25', '0.19.26', '0.19.27'].includes(pkg.version), 'Build103 guard accepts Build103 and bounded Build104/Build105 successors.');
if (pkg.version === '0.19.25') {
  assert.match(release, /version: '0\.19\.25'/);
  assert.match(release, /build: 103/);
} else {
  assert.match(release, /build103AncestryMarker/);
  assert.match(release, /version: 0\.19\.25 · build: 103 · codename: 'studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth'/);
  if (pkg.version === '0.19.27') assert.match(release, /build104AncestryMarker/);
}
assert.match(release, /studio-focus-slice4-phase9-(?:canonical-audio-download-transient-retry-truth|deep-audio-response-loss-fence|deep-audio-presubmit-transport-corrective)/);
assert.match(release, /build102AncestryMarker/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-canonical-audio-download-transient-retry-build103\.mjs/);

// The canonical audio fetch is a non-mutating GET that may receive exactly one bounded retry.
assert.match(api, /const TRANSIENT_CANONICAL_AUDIO_READ_STATUSES = new Set\(\[408, 425, 429, 500, 502, 503, 504\]\)/);
assert.match(api, /function isTransientCanonicalAudioReadError\(reason: unknown\): reason is SonicTraceError/);
assert.match(api, /reason\.code === 'CANONICAL_AUDIO_READ_TIMEOUT'/);
assert.match(api, /reason\.code === 'CANONICAL_AUDIO_READ_TRANSPORT'/);
assert.match(api, /function fetchCanonicalAudioOnce\(/);
assert.match(api, /Canonical audio download failed after one bounded transient retry/);
assert.match(api, /canonicalAudioReadRetryPolicy: 'one-retry-timeout-transport-transient-http-before-deep-audio-post'/);
assert.match(api, /canonicalAudioReadMaxAttempts: 2/);

const fetchStart = api.indexOf('export async function fetchCanonicalAudio(');
const fetchEnd = api.indexOf('\n\nexport async function analyzeBrowserDsp(', fetchStart);
assert.ok(fetchStart >= 0 && fetchEnd > fetchStart, 'Build103 canonical audio retry function boundary is missing.');
const fetchFunction = api.slice(fetchStart, fetchEnd);
assert.match(fetchFunction, /for \(let attempt = 0; attempt < 2; attempt \+= 1\)/);
assert.match(fetchFunction, /attempt === 0 && isTransientCanonicalAudioReadError\(reason\)/);
assert.match(fetchFunction, /attempt === 1 && firstTransientFailure && isTransientCanonicalAudioReadError\(reason\)/);

// Deterministic response failures do not enter the transient retry class.
assert.match(api, /CANONICAL_AUDIO_READ_HTTP/);
assert.match(api, /CANONICAL_AUDIO_READ_INVALID_RESPONSE/);
assert.match(api, /CANONICAL_AUDIO_READ_ACCESS/);

// Critical boundary: the expensive Deep Audio POST is still one-shot. Retrying the pre-compute GET
// must never become an automatic re-submit of /api/studio/analyze.
const deepStart = api.indexOf('export function runSonicTraceAnalysis(');
const deepEnd = api.indexOf('\n\nexport function browserOnlyAnalysis(', deepStart);
assert.ok(deepStart >= 0 && deepEnd > deepStart, 'Deep Audio function boundary is missing.');
const deepFunction = api.slice(deepStart, deepEnd);
assert.match(deepFunction, /xhr\.open\('POST', `\$\{sonicBase\(\)\}\/api\/studio\/analyze`, true\)/);
assert.doesNotMatch(deepFunction, /for \(let attempt/);
assert.doesNotMatch(deepFunction, /setTimeout\([^)]*runSonicTraceAnalysis/);
assert.match(api, /deepAudioComputeRetryPolicy: 'zero-automatic-retries'/);
assert.match(panel, /const result = await runSonicTraceAnalysis\(file, track\.id, current\.currentSourceVersion, dsp, setProgress\)/);

console.log(`Build103 canonical audio GET retry guard PASS under ${pkg.version}: one bounded pre-compute retry remains inherited while Deep Audio POST stays one-shot.`);
