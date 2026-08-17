import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const api = read('src/services/sonictrace-api.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.equal(pkg.version, '0.19.27');
assert.match(release, /version: '0\.19\.27'/);
assert.match(release, /build: 105/);
assert.match(release, /studio-focus-slice4-phase9-deep-audio-presubmit-transport-corrective/);
assert.match(release, /build103AncestryMarker/);
assert.match(release, /build104AncestryMarker/);
assert.match(release, /version: 0\.19\.26 · build: 104 · codename: 'studio-focus-slice4-phase9-deep-audio-response-loss-fence'/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-deep-audio-response-loss-fence-build104\.mjs/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-deep-audio-presubmit-transport-build105\.mjs/);

const deepStart = api.indexOf('export function runSonicTraceAnalysis(');
const deepEnd = api.indexOf('\n\nexport function browserOnlyAnalysis(', deepStart);
assert.ok(deepStart >= 0 && deepEnd > deepStart, 'Build105 Deep Audio function boundary is missing.');
const deepFunction = api.slice(deepStart, deepEnd);

// Build105 corrective: XHR transport error is not automatically proof that submit began.
assert.match(deepFunction, /let uploadPhaseStarted = false/);
assert.match(deepFunction, /let uploadCompleted = false/);
assert.match(deepFunction, /xhr\.upload\.onloadstart = \(\) => \{ uploadPhaseStarted = true; \}/);
assert.match(deepFunction, /if \(event\.loaded > 0\) uploadPhaseStarted = true/);
assert.match(deepFunction, /xhr\.upload\.onload = \(\) => \{ uploadPhaseStarted = true; uploadCompleted = true; \}/);
assert.match(deepFunction, /if \(!uploadPhaseStarted\) \{/);
assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_PRESUBMIT_TRANSPORT/);
assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_PRESUBMIT_TIMEOUT/);
assert.match(deepFunction, /this attempt is not fenced/);
assert.match(deepFunction, /retrySafe[\s\S]*true|true,[\s\S]*POST \/api\/studio\/analyze failed before XMLHttpRequest upload loadstart/);

// Once upload starts, Build104 ambiguity protection remains intact.
assert.match(deepFunction, /deepAudioResponseLossFence\.add\(fenceKey\)/);
assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_TRANSPORT_UNVERIFIED/);
assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_TIMEOUT_UNVERIFIED/);
assert.match(deepFunction, /DEEP_AUDIO_COMPUTE_RELOAD_REQUIRED/);
assert.match(deepFunction, /compute state unknown/);
assert.match(deepFunction, /uploadCompleted=\$\{uploadCompleted\}/);
assert.ok(deepFunction.indexOf('deepAudioResponseLossFence.has(fenceKey)') < deepFunction.indexOf("xhr.open('POST'"));

// No automatic Deep Audio retry was introduced by the corrective.
assert.equal((deepFunction.match(/xhr\.open\('POST'/g) || []).length, 1);
assert.equal((deepFunction.match(/xhr\.send\(form\)/g) || []).length, 1);
assert.doesNotMatch(deepFunction, /for \(let attempt/);
assert.doesNotMatch(deepFunction, /setTimeout\([^)]*runSonicTraceAnalysis/);
assert.match(api, /deepAudioComputeRetryPolicy: 'zero-automatic-retries'/);
assert.match(api, /deepAudioPreSubmitTransportPolicy: 'no-fence-manual-rescan-allowed-zero-automatic-retries'/);
assert.match(api, /deepAudioResponseLossPolicy: 'unknown-only-after-upload-start-reload-before-manual-resubmit'/);

// Visible UX must separate pre-submit unreachable from true response-loss ambiguity.
assert.match(panel, /function deepFailureIsPreSubmitTransport\(error: unknown\)/);
assert.match(panel, /DEEP_AUDIO_COMPUTE_PRESUBMIT_TRANSPORT/);
assert.match(panel, /DEEP_AUDIO_COMPUTE_PRESUBMIT_TIMEOUT/);
assert.match(panel, /unreachable before Deep Audio upload began/);
assert.match(panel, /did not arm the duplicate-compute fence/);
assert.match(panel, /explicit re-scan is allowed/);
assert.match(panel, /DEEP AUDIO STATE UNKNOWN/);
assert.match(panel, /will not submit a second Deep Audio POST/);

console.log('Build105 Deep Audio pre-submit transport corrective PASS: pre-upload unreachable no longer becomes false UNKNOWN, while response loss after upload start remains fenced with zero automatic retries.');
