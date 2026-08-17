import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const catalog = read('src/services/catalog-api.ts');
const genericHttp = read('src/services/http.ts');
const publicAlbums = read('src/services/public-albums-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.equal(pkg.version, '0.19.28');
assert.match(release, /version: '0\.19\.28'/);
assert.match(release, /build: 106/);
assert.match(release, /studio-focus-slice4-phase9-public-catalog-fallback-transient-retry-truth/);
assert.match(release, /build105AncestryMarker/);
assert.match(release, /version: 0\.19\.27 · build: 105 · codename: 'studio-focus-slice4-phase9-deep-audio-presubmit-transport-corrective'/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-deep-audio-presubmit-transport-build105\.mjs/);
assert.match(pkg.scripts['check:phase9'], /test-phase9-public-catalog-fallback-transient-retry-build106\.mjs/);

// Build106 is deliberately local to public catalog fallback reads; the generic HTTP helper stays one-shot.
assert.doesNotMatch(catalog, /from '\.\/http'/);
assert.match(genericHttp, /export async function fetchJson<T>\(url: string, timeoutMs = 3500\): Promise<T>/);
assert.doesNotMatch(genericHttp, /for \(let attempt/);
assert.doesNotMatch(genericHttp, /TRANSIENT_PUBLIC_CATALOG_READ_STATUSES/);

assert.match(catalog, /type PublicCatalogReadFailureKind = 'http' \| 'timeout' \| 'transport' \| 'invalid-response'/);
assert.match(catalog, /const TRANSIENT_PUBLIC_CATALOG_READ_STATUSES = new Set\(\[408, 425, 429, 500, 502, 503, 504\]\)/);
assert.match(catalog, /async function fetchPublicCatalogJsonOnce<T>\(url: string, timeoutMs = 3500\): Promise<T>/);
assert.match(catalog, /error instanceof DOMException && error\.name === 'AbortError'/);
assert.match(catalog, /new PublicCatalogReadError\('timeout'/);
assert.match(catalog, /new PublicCatalogReadError\('transport'/);
assert.match(catalog, /new PublicCatalogReadError\('http'/);
assert.match(catalog, /new PublicCatalogReadError\('invalid-response'/);
assert.match(catalog, /reason\.kind === 'timeout'/);
assert.match(catalog, /reason\.kind === 'transport'/);
assert.match(catalog, /reason\.kind === 'http' && reason\.status !== null && TRANSIENT_PUBLIC_CATALOG_READ_STATUSES\.has\(reason\.status\)/);
assert.doesNotMatch(catalog, /reason\.kind === 'invalid-response'\s*\|\|/);

// The initial public read remains one-shot and parallel. A second GET is allowed only after private failure.
assert.match(catalog, /async function retryPublicCatalogFallbackAfterTransientFailure<T>\(/);
assert.match(catalog, /if \(initial\.ok\) return initial\.value/);
assert.match(catalog, /if \(!isTransientPublicCatalogReadError\(initial\.error\)\) throw initial\.error/);
assert.match(catalog, /return await retry\(\)/);
assert.match(catalog, /fallback failed after one bounded transient retry/);
assert.doesNotMatch(catalog, /for \(let attempt = 0; attempt < 2/);
assert.match(catalog, /publicFallbackReadRetryPolicy: 'one-retry-timeout-transport-transient-http'/);
assert.match(catalog, /publicFallbackReadMaxAttempts: 2/);
assert.match(catalog, /publicFallbackRetryAfterPrivateFailureOnly: true/);

// Only the existing public health/list/detail GET family can participate in fallback retry.
assert.match(catalog, /return fetchPublicCatalogJsonOnce<PublicHealth>\(`\$\{baseUrl\(\)\}\/health`\)/);
assert.match(catalog, /fetchPublicCatalogJsonOnce<PublicTracksResponse>\(`\$\{baseUrl\(\)\}\/tracks`, 6000\)/);
assert.match(catalog, /fetchPublicCatalogJsonOnce<PublicTrackResponse>\(`\$\{baseUrl\(\)\}\/tracks\/\$\{encodeURIComponent\(trackId\)\}`, 6000\)/);
assert.doesNotMatch(catalog, /method:\s*'POST'/);

// Private-success enrichment consumes only the already-started one-shot public result.
assert.match(catalog, /const privatePayload = await getAdminTracks\(\)[\s\S]*const publicResult = await publicResultPromise;[\s\S]*const publicTracks = publicResult\.ok \? publicResult\.value : \[\]/);
assert.match(catalog, /const privatePayload = await getAdminTrack\(trackId\)[\s\S]*const publicResult = await publicResultPromise;[\s\S]*const publicTrack = publicResult\.ok \? publicResult\.value : null/);

// Retry resolver is invoked only from private failure catch paths.
assert.match(catalog, /catch \(adminError\) \{\n    const publicResult = await publicHealth;\n    const publicValue = await retryPublicCatalogFallbackAfterTransientFailure\(publicResult, getPublicHealth\)/);
assert.match(catalog, /catch \(adminError\) \{\n    const publicResult = await publicResultPromise;\n    try \{\n      return await retryPublicCatalogFallbackAfterTransientFailure\(publicResult, getPublicTracks\)/);
assert.match(catalog, /retryPublicCatalogFallbackAfterTransientFailure\(publicResult, \(\) => getPublicTrack\(trackId\)\)/);

// Album artwork remains intentionally private-first and is not swept into Build106.
assert.match(publicAlbums, /const privatePayload = await getAdminAlbums\(\)/);
assert.match(publicAlbums, /const response = await fetch\(`\$\{base\}\/albums`/);
assert.doesNotMatch(publicAlbums, /retryPublicCatalogFallbackAfterTransientFailure/);

console.log('Build106 public catalog fallback transient retry PASS: the initial public health/list/detail reads remain one-shot, and exactly one retry is allowed only after private failure plus a bounded transient public failure; deterministic failures, generic HTTP calls, writes, and Album artwork fallback remain unchanged.');
