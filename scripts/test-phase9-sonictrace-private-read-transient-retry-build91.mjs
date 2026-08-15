import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const sonic = read('src/services/sonictrace-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.ok(release.includes('build91AncestryMarker'), 'Build92+ must preserve accepted Build91 ancestry.');
assert.ok(release.includes("version: 0.19.13 · build: 91 · codename: 'studio-focus-slice4-phase9-sonictrace-private-read-transient-retry-truth'"));

assert.ok(sonic.includes('const TRANSIENT_SONICTRACE_READ_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);'), 'SonicTrace transient HTTP allowlist must stay explicit and bounded.');
assert.ok(sonic.includes('async function fetchAdminJsonOnce<T>(path: string, timeoutMs: number): Promise<T>'), 'Build91 must isolate one private SonicTrace GET attempt.');
assert.ok(sonic.includes("'Track Manager SonicTrace read transport was interrupted.'"), 'SonicTrace transport interruption must not be mislabeled Cloudflare Access.');
assert.ok(sonic.includes("'SONICTRACE_READ_TIMEOUT'"));
assert.ok(sonic.includes("'SONICTRACE_READ_TRANSPORT'"));
assert.ok(sonic.includes('reason.status !== null && TRANSIENT_SONICTRACE_READ_STATUSES.has(reason.status)'), 'Only explicit transient SonicTrace HTTP statuses may be retried.');
assert.ok(sonic.includes('for (let attempt = 0; attempt < 2; attempt += 1)'), 'SonicTrace private GETs must make at most two total attempts.');
assert.ok(sonic.includes('if (attempt === 0 && isTransientSonicTraceReadError(reason)) continue;'), 'Only the first transient SonicTrace GET failure may be retried.');
assert.ok(sonic.includes('Track Manager SonicTrace read failed after one bounded transient retry.'), 'A second transient SonicTrace GET failure must surface.');
assert.ok(sonic.includes("privateReadRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-retry'"));
assert.ok(sonic.includes('privateReadMaxAttempts: 2'));

assert.ok(sonic.includes("'SONICTRACE_READ_ACCESS_SESSION_REQUIRED'"), 'Non-JSON Access gating must remain deterministic and non-retry.');
assert.ok(sonic.includes("response.status === 401 || response.status === 403 ? 'SONICTRACE_READ_ACCESS' : 'SONICTRACE_READ_HTTP'"), 'SonicTrace 401/403 must remain deterministic Access failures.');
assert.ok(sonic.includes("'SONICTRACE_READ_INVALID_RESPONSE'"), 'Invalid SonicTrace JSON must stay deterministic and non-retry.');
assert.ok(!sonic.includes("reason.code === 'SONICTRACE_READ_ACCESS'\n    ||"), 'Access must never enter the SonicTrace retry predicate.');
assert.ok(!sonic.includes("reason.code === 'SONICTRACE_READ_INVALID_RESPONSE'\n    ||"), 'Invalid JSON must never enter the SonicTrace retry predicate.');

assert.ok(sonic.includes('const payload = await adminJson<SonicTraceAnalysisState>(`/api/studio/tracks/${encodeURIComponent(trackId)}/analysis/sonictrace`)'), 'Canonical SonicTrace latest/history state must use the bounded private-read helper.');
assert.ok(sonic.includes("const payload = await adminJson<SonicTraceCatalogResponse>('/api/studio/analysis/sonictrace', 20000);"), 'SonicTrace catalog must use the same bounded private-read helper with its existing longer timeout.');
assert.ok(!sonic.includes('async function adminJson<T>(path: string, init?: RequestInit'), 'Build91 private-read helper must not accept arbitrary request init/methods.');

assert.equal((sonic.match(/method:\s*'POST'/g) || []).length, 1, 'Build91 must not add or duplicate Track Manager SonicTrace POST transports.');
assert.ok(sonic.includes('async function postSonicTraceSave(trackId: string, analysis: SonicTraceAnalysis): Promise<SonicTraceSaveResponse>'), 'Build84 save POST transport must remain separate.');
assert.ok(sonic.includes("timedOut ? 'SONICTRACE_SAVE_TIMEOUT' : 'SONICTRACE_SAVE_TRANSPORT'"), 'Build84 save response-loss classification must remain intact.');
assert.ok(sonic.includes("lostResponsePolicy: 'private-canonical-latest-history-reread-no-blind-retry'"), 'Build84 no-blind-write-retry contract must remain explicit.');
assert.ok(sonic.includes("const SAVE_INTENT = 'sonictrace-analysis-save-v1';"), 'Build84 save intent must remain unchanged.');
assert.ok(!sonic.includes('retrySonicTraceSave'), 'Build91 must never introduce automatic SonicTrace save retry.');
assert.ok(!sonic.includes('retrySonicTraceAnalysis'), 'Build91 must never retry analysis/save as part of private-read hardening.');

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
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build91 SonicTrace private-read retry guard passed as inherited ancestry: canonical latest/history + catalog GETs retry once only for transient timeout/transport/HTTP failures while Access/CORS, deterministic 4xx and invalid JSON remain non-retry; Build84 SonicTrace save recovery stays no-blind-retry.');
