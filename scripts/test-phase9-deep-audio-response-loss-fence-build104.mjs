import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const api = read('src/services/sonictrace-api.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.equal(pkg.version, '0.19.26');
assert.match(release, /version: '0\.19\.26'/);
assert.match(release, /build: 104/);
assert.match(release, /studio-focus-slice4-phase9-deep-audio-response-loss-fence/);
assert.match(release, /build103AncestryMarker/);
assert.match(release, /version: 0\.19\.25 · build: 103 · codename: 'studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth'/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-canonical-audio-download-transient-retry-build103\.mjs/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-deep-audio-response-loss-fence-build104\.mjs/);

// Build104 must classify response loss after submit as compute-unknown, never retry-safe.
assert.match(api, /const deepAudioResponseLossFence = new Set<string>\(\)/);
assert.match(api, /function deepAudioFenceKey\(trackId: string, sourceVersion: SonicTraceSourceVersion\)/);
assert.match(api, /DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED/);
assert.match(api, /DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED/);
assert.match(api, /DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED/);
assert.match(api, /Compute state is unknown/);
assert.match(api, /reload Studio before any explicit new submission/i);

const deepStart = api.indexOf('export function runSonicTraceAnalysis(');
const deepEnd = api.indexOf('\n\nexport function browserOnlyAnalysis(', deepStart);
assert.ok(deepStart >= 0 && deepEnd > deepStart, 'Build104 Deep Audio function boundary is missing.');
const deepFunction = api.slice(deepStart, deepEnd);
assert.equal((deepFunction.match(/xhr\.open\('POST'/g) || []).length, 1, 'Deep Audio must still own exactly one POST transport.');
assert.equal((deepFunction.match(/xhr\.send\(form\)/g) || []).length, 1, 'Deep Audio must still submit at most once per call.');
assert.doesNotMatch(deepFunction, /for \(let attempt/);
assert.doesNotMatch(deepFunction, /setTimeout\([^)]*runSonicTraceAnalysis/);
assert.ok(deepFunction.indexOf('deepAudioResponseLossFence.has(fenceKey)') < deepFunction.indexOf("xhr.open('POST'"), 'Reload-required fence must run before creating another Deep Audio POST.');
assert.match(deepFunction, /xhr\.onerror = \(\) => \{\s*deepAudioResponseLossFence\.add\(fenceKey\)/);
assert.match(deepFunction, /xhr\.ontimeout = \(\) => \{\s*deepAudioResponseLossFence\.add\(fenceKey\)/);

// Build103 pre-compute GET retry stays bounded and separate from the compute fence.
const audioStart = api.indexOf('export async function fetchCanonicalAudio(');
const audioEnd = api.indexOf('\n\nexport async function analyzeBrowserDsp(', audioStart);
const audioFunction = api.slice(audioStart, audioEnd);
assert.match(audioFunction, /for \(let attempt = 0; attempt < 2; attempt \+= 1\)/);
assert.match(api, /canonicalAudioReadMaxAttempts: 2/);
assert.match(api, /deepAudioComputeRetryPolicy: 'zero-automatic-retries'/);
assert.match(api, /deepAudioResponseLossPolicy: 'unknown-after-timeout-or-transport-reload-before-manual-resubmit'/);
assert.match(api, /deepAudioResponseLossFence: 'in-memory-track-source-fence-cleared-by-page-reload'/);

// Visible UX must tell the truth: response loss is UNKNOWN, browser DSP does not prove compute absence,
// and an explicit page reload is required before another Deep Audio submit for that source.
assert.match(panel, /function deepFailureIsResponseLoss\(error: unknown\)/);
for (const code of [
  'DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED',
  'DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED',
  'DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED',
]) assert.match(panel, new RegExp(code));
assert.match(panel, /DEEP AUDIO STATE UNKNOWN/);
assert.match(panel, /may already have run or may still be running/);
assert.match(panel, /will not submit a second Deep Audio POST/);
assert.match(panel, /saving it does not prove Deep Audio did not run/);
assert.match(panel, /Reload Studio before any explicit re-scan/);

console.log('Build104 Deep Audio response-loss fence PASS: timeout/transport after submit becomes UNKNOWN, no second POST is allowed in-page, reload is required for manual resubmit, and Build103 GET retry remains bounded.');
