import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const admin = read('src/services/admin-api.ts');
const catalog = read('src/services/catalog-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.10'/);
assert.match(release, /build:\s*88/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-private-read-transient-retry-truth'"));
assert.ok(release.includes('build87AncestryMarker'), 'Build88 must preserve accepted Build87 ancestry.');
assert.ok(release.includes("version: 0.19.9 · build: 87 · codename: 'studio-focus-slice4-phase9-album-membership-response-loss-truth'"));
assert.equal(pkg.version, '0.19.10', 'package version must match Build88 runtime version.');

assert.ok(admin.includes("export type AdminReadFailureKind = 'access-or-cors' | 'http' | 'timeout' | 'transport' | 'invalid-response';"), 'Private reads must distinguish transport from Access/CORS.');
assert.ok(admin.includes('const TRANSIENT_ADMIN_READ_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);'), 'Build88 transient HTTP allowlist must stay explicit and bounded.');
assert.ok(admin.includes('async function fetchAdminJsonOnce<T>(path: string, timeoutMs: number): Promise<T>'), 'Build88 must isolate one bounded private-read attempt.');
assert.ok(admin.includes("throw new AdminReadError(\n        'transport',\n        'Track Manager private read transport was interrupted.'"), 'Transport errors must not be mislabeled Access/CORS.');
assert.ok(admin.includes("reason.kind === 'timeout'"));
assert.ok(admin.includes("reason.kind === 'transport'"));
assert.ok(admin.includes("reason.kind === 'http' && reason.status !== null && TRANSIENT_ADMIN_READ_STATUSES.has(reason.status)"));
assert.ok(admin.includes('for (let attempt = 0; attempt < 2; attempt += 1)'), 'Private core reads must make at most two total attempts.');
assert.ok(admin.includes('if (attempt === 0 && isTransientAdminReadError(reason))'), 'Only the first transient GET failure may be retried.');
assert.ok(admin.includes('failed after one bounded transient retry'), 'A second failure must surface rather than loop indefinitely.');
assert.ok(admin.includes("privateReadRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-retry'"));
assert.ok(admin.includes('privateReadMaxAttempts: 2'));

assert.ok(admin.includes("response.status === 401 || response.status === 403\n        ? 'access-or-cors'"), '401/403 must remain deterministic Access failures.');
assert.ok(admin.includes("'Cloudflare Access session is not available to Studio. Public catalog fallback remains active.'"), 'Non-JSON Access gating must remain explicitly classified.');
assert.ok(admin.includes("throw new AdminReadError('invalid-response', 'Track Manager private read returned invalid JSON.'"), 'Invalid JSON must stay a deterministic non-retry failure.');
assert.ok(!admin.includes("reason.kind === 'access-or-cors'\n    ||"), 'Access/CORS must never enter the transient retry predicate.');
assert.ok(!admin.includes("reason.kind === 'invalid-response'\n    ||"), 'Invalid responses must never enter the transient retry predicate.');

assert.equal((admin.match(/method:\s*'POST'/g) || []).length, 2, 'Build88 must not add or duplicate any write POST path.');
assert.ok(admin.includes('async function postAdminValidation<T>('), 'Existing validation POST transport must remain inherited.');
assert.ok(admin.includes('async function postAdminSave('), 'Existing metadata-save POST transport must remain inherited.');
assert.ok(!admin.includes('retryAdminSave'), 'Build88 must never introduce automatic write retry.');
assert.ok(!admin.includes('retryAdminValidation'), 'Build88 must never introduce automatic validation POST retry.');

for (const corePath of ["'/api/studio/health'", "'/api/studio/tracks'", '`/api/studio/tracks/${encodeURIComponent(trackId)}`']) {
  assert.ok(admin.includes(corePath), `Build88 core private-read surface missing ${corePath}.`);
}
assert.ok(catalog.includes('const privatePayload = await getAdminTracks();'), 'Catalog must still prefer the private canonical Track inventory.');
assert.ok(catalog.includes('const privatePayload = await getAdminTrack(trackId);'), 'Track detail must still prefer the private canonical Track read.');
assert.ok(catalog.includes('if (publicResult.ok) return publicResult.value;'), 'Public fallback remains available only after private read ultimately fails.');

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
  'test-phase9-album-move-response-loss-build86.mjs',
  'test-phase9-album-membership-response-loss-build87.mjs',
  'test-phase9-private-read-transient-retry-build88.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build88 private-read retry guard passed: health/catalog/track GETs retry once only for transient timeout/transport/HTTP failures, while Access/CORS, deterministic 4xx and invalid JSON remain non-retry and all write transports stay unchanged.');
