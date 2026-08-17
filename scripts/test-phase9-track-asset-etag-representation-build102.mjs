import fs from 'node:fs';
import assert from 'node:assert/strict';

const release = fs.readFileSync('src/release.ts', 'utf8');
const service = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const build102 = /version: '0\.19\.24'/.test(release) && /build: 102/.test(release) && /track-asset-etag-representation-corrective/.test(release);
const build103Successor = /version: '0\.19\.25'/.test(release) && /build: 103/.test(release) && /canonical-audio-download-transient-retry-truth/.test(release);
const build104Successor = /version: '0\.19\.26'/.test(release) && /build: 104/.test(release) && /deep-audio-response-loss-fence/.test(release);
assert.ok(build102 || build103Successor || build104Successor, 'Build102 ETag contract must remain inherited by Build102 or bounded Build103/Build104 successors.');
assert.match(release, /build101AncestryMarker/);
if (build103Successor || build104Successor) assert.match(release, /build102AncestryMarker/);
if (build104Successor) assert.match(release, /build103AncestryMarker/);
assert.ok(['0.19.24', '0.19.25', '0.19.26'].includes(pkg.version));
assert.match(pkg.scripts['check:phase9'], /test-phase9-track-asset-etag-representation-build102\.mjs/);

// Real-user Build101 smoke proved Track Manager's quoted httpEtag and the private reread's raw R2 etag
// identify the same committed object. Normalize only symmetric outer HTTP quotes before exact comparison.
assert.match(service, /function normalizeAssetEtag\(value: string \| null \| undefined\): string \| null/);
assert.match(service, /trimmed\.startsWith\('\"'\) && trimmed\.endsWith\('\"'\)/);
assert.match(service, /trimmed\.slice\(1, -1\)/);
assert.match(service, /const etagVerified = !payload\.etag \|\| normalizeAssetEtag\(asset\?\.etag\) === normalizeAssetEtag\(payload\.etag\)/);
assert.match(service, /responseEtag=\$\{payload\.etag \?\? 'n\/a'\}; canonicalEtag=\$\{asset\?\.etag \?\? 'n\/a'\}/);

// Build101's safety contract remains intact: canonical revision, filename, presence, size/content type,
// duration and ETag still all have to verify; there is still no automatic upload retry.
assert.match(service, /manifest\?\.updatedAt === payload\.updatedAt/);
assert.match(service, /manifest\?\.assets\?\.\[kind\] === payload\.filename/);
assert.match(service, /asset\?\.present === true/);
assert.match(service, /ASSET_UPLOAD_UNVERIFIED/);
assert.match(service, /ASSET_UPLOAD_NOT_COMMITTED/);
assert.match(service, /ASSET_UPLOAD_AMBIGUOUS/);
assert.match(service, /recoveredAfterTransportFailure: true/);
assert.doesNotMatch(service, /for \(let attempt.*uploadViaFetch/s);

console.log('Build102 Track asset ETag representation corrective guard PASS through bounded Build104 successor');
