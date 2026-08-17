import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const api = read('src/services/sonictrace-api.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(['0.19.26', '0.19.27', '0.19.28'].includes(pkg.version), 'Build104 guard accepts Build104 and bounded Build105/Build106 successors.');
assert.match(release, /version: '0\.19\.(?:26|27|28)'/);
assert.match(release, /build: (?:104|105|106)/);
assert.match(release, /studio-focus-slice4-phase9-(?:deep-audio-response-loss-fence|deep-audio-presubmit-transport-corrective|public-catalog-fallback-transient-retry-truth)/);
assert.match(release, /build103AncestryMarker/);
assert.match(release, /version: 0\.19\.25 · build: 103 · codename: 'studio-focus-slice4-phase9-canonical-audio-download-transient-retry-truth'/);
if (['0.19.27', '0.19.28'].includes(pkg.version)) {
  assert.match(release, /build104AncestryMarker/);
  assert.match(release, /version: 0\.19\.26 · build: 104 · codename: 'studio-focus-slice4-phase9-deep-audio-response-loss-fence'/);
}
if (pkg.version === '0.19.28') assert.match(release, /build105AncestryMarker/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-canonical-audio-download-transient-retry-build103\.mjs/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-deep-audio-response-loss-fence-build104\.mjs/);

// Build104 core truth remains: once Deep Audio upload has begun, response loss is compute-unknown and never retry-safe.
assert.match(api, /const deepAudioResponseLossFence = new Set<string>\(\)/);
assert.match(api, /function deepAudioFenceKey\(trackId: string, sourceVersion: SonicTraceSourceVersion\)/);
assert.match(api, /DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED/);
assert.match(api, /DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED/);
assert.match(api, /DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED/);
assert.match(api, /compute state unknown/i);
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
assert.match(deepFunction, /deepAudioResponseLossFence\.add\(fenceKey\)/);

if (pkg.version === '0.19.26') {
  assert.match(deepFunction, /xhr\.onerror = \(\) => \{\s*deepAudioResponseLossFence\.add\(fenceKey\)/);
  assert.match(deepFunction, /xhr\.ontimeout = \(\) => \{\s*deepAudioResponseLossFence\.add\(fenceKey\)/);
} else {
  assert.match(deepFunction, /let uploadPhaseStarted = false/);
  assert.match(deepFunction, /if \(!uploadPhaseStarted\) \{/);
  assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_PRESUBMIT_TRANSPORT/);
  assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_PRESUBMIT_TIMEOUT/);
}

// Build103 pre-compute GET retry stays bounded and separate from the compute fence.
const audioStart = api.indexOf('export async function fetchCanonicalAudio(');
const audioEnd = api.indexOf('\n\nexport async function analyzeBrowserDsp(', audioStart);
const audioFunction = api.slice(audioStart, audioEnd);
assert.match(audioFunction, /for \(let attempt = 0; attempt < 2; attempt \+= 1\)/);
assert.match(api, /canonicalAudioReadMaxAttempts: 2/);
assert.match(api, /deepAudioComputeRetryPolicy: 'zero-automatic-retries'/);
assert.match(api, /deepAudioResponseLossFence: 'in-memory-track-source-fence/);

// Visible UX must preserve UNKNOWN after true response loss and Browser DSP review without pretending compute absence.
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

console.log(`Build104 Deep Audio response-loss fence remains protected under ${pkg.version}: true post-upload response loss is UNKNOWN and fenced with zero automatic retries, while Build105+ may refine only pre-submit transport classification or unrelated read-only reliability.`);
