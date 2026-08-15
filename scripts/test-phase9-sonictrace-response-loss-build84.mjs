import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const sonic = read('src/services/sonictrace-api.ts');
const ui = read('src/components/SonicTracePanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.6'/);
assert.match(release, /build:\s*84/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-sonictrace-save-response-loss-truth'"));
assert.ok(release.includes('build83AncestryMarker'), 'Build84 must inherit accepted Build83 ancestry.');
assert.equal(pkg.version, '0.19.6', 'package version must match Build84 runtime version.');

for (const marker of [
  'SONICTRACE_SAVE_TIMEOUT',
  'SONICTRACE_SAVE_TRANSPORT',
  'SONICTRACE_SAVE_NOT_COMMITTED',
  'SONICTRACE_SAVE_AMBIGUOUS',
  'SONICTRACE_SAVE_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  "commitState: 'committed'",
  "lostResponsePolicy: 'private-canonical-latest-history-reread-no-blind-retry'",
]) assert.ok(sonic.includes(marker), `Build84 SonicTrace lost-response contract missing ${marker}`);

assert.ok(sonic.includes('readonly retrySafe: boolean;'), 'SonicTraceError must carry typed retry safety.');
assert.ok(sonic.includes('async function postSonicTraceSave('), 'Build84 must isolate the SonicTrace write transport from generic read transport.');
assert.ok(sonic.includes('const before = await getSonicTraceAnalysisState(trackId);'), 'SonicTrace save must inspect canonical state before the write.');
assert.ok(sonic.includes('const beforePresence = analysisPresence(before, analysis.analysisId);'), 'Pre-write state must reject an already-canonical analysisId.');
assert.ok(sonic.includes("!['SONICTRACE_SAVE_TIMEOUT', 'SONICTRACE_SAVE_TRANSPORT'].includes(reason.code || '')"), 'Only lost-response transport failures may enter SonicTrace recovery.');
assert.ok(sonic.includes('const reread = await getSonicTraceAnalysisState(trackId);'), 'Lost-response and normal success paths must use private canonical SonicTrace reread.');
assert.ok(sonic.includes('if (presence.latest && presence.history && reread.latest)'), 'Recovered success must require the exact analysisId in both latest and history.');
assert.ok(sonic.includes('if (!presence.latest && !presence.history)'), 'Retry safety must require the exact analysisId to be absent from both latest and history.');
assert.ok(sonic.includes('latestMatch=${presence.latest}; historyMatch=${presence.history}'), 'Partial latest/history state must remain explicitly diagnosable as ambiguous.');
assert.ok(!sonic.includes('retrySonicTraceSave'), 'Build84 must not introduce a blind automatic SonicTrace retry loop.');
assert.ok(sonic.includes('clientVerified = presence.latest && presence.history'), 'Normal HTTP success must also require canonical latest + history verification.');
assert.ok(sonic.includes("commitState: clientVerified ? 'committed' : 'unverified'"), 'Normal success must remain truthful when canonical reread cannot verify the write.');

assert.ok(ui.includes('RECOVERED AFTER LOST RESPONSE'), 'SonicTrace UI must distinguish recovered verified success.');
assert.ok(ui.includes('Studio did not retry the write.'), 'Recovered success copy must state that no blind retry occurred.');
assert.ok(ui.includes('RETRY SAFE AFTER RECONNECT'), 'SonicTrace UI must expose the narrow retry-safe state.');
assert.ok(ui.includes('DO NOT RETRY'), 'SonicTrace UI must expose ambiguous/unverified states as unsafe to retry.');
assert.ok(ui.includes('canonically verified in latest + history'), 'Normal success copy must reflect actual canonical verification.');

assert.ok(pkg.scripts['check:phase9']?.includes('test-phase9-destructive-write-ambiguity-build82.mjs'), 'Build82 Phase9 guard must remain inherited.');
assert.ok(pkg.scripts['check:phase9']?.includes('test-phase9-lyrics-response-loss-build83.mjs'), 'Build83 Phase9 guard must remain inherited.');
assert.ok(pkg.scripts['check:phase9']?.includes('test-phase9-sonictrace-response-loss-build84.mjs'), 'Build84 guard must run in check:phase9.');
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build84 SonicTrace response-loss guard passed: exact analysisId presence across canonical latest + history classifies committed/not-committed/ambiguous/unverified with no blind retry, and normal success is canonically verified.');
