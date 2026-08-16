import fs from 'node:fs';
import assert from 'node:assert/strict';

const release = fs.readFileSync('src/release.ts', 'utf8');
const service = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');
const assets = fs.readFileSync('src/components/AssetsManager.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.match(release, /version: '0\.19\.(?:23|24)'/);
assert.match(release, /build: (?:101|102)/);
assert.match(release, /track-asset-(?:upload-success-verification-truth|etag-representation-corrective)/);
assert.match(release, /build100AncestryMarker/);
if (/build: 102/.test(release)) assert.match(release, /build101AncestryMarker/);
assert.ok(['0.19.23', '0.19.24'].includes(pkg.version));
assert.match(pkg.scripts['check:phase9'], /test-phase9-track-asset-upload-success-verification-build101\.mjs/);

// Daily Track Visuals/Assets must still use the guarded service.
assert.match(assets, /uploadAdminTrackAsset\(track\.id, def\.kind, revision, file/);

// A normal HTTP success is not enough: reread must match the response fingerprint.
assert.match(service, /const sizeVerified = payload\.size == null \|\| asset\?\.size === payload\.size/);
assert.match(service, /const contentTypeVerified = !payload\.contentType \|\| asset\?\.contentType === payload\.contentType/);
assert.match(service, /const etagVerified = !payload\.etag \|\| normalizeAssetEtag\(asset\?\.etag\) === normalizeAssetEtag\(payload\.etag\)/);
assert.match(service, /manifest\?\.updatedAt === payload\.updatedAt/);
assert.match(service, /manifest\?\.assets\?\.\[kind\] === payload\.filename/);
assert.match(service, /asset\?\.present === true/);
assert.match(service, /ASSET_UPLOAD_UNVERIFIED/);
assert.match(service, /Do not retry until the track is reloaded and inspected/);

// Existing response-loss semantics remain bounded and retry-safe only when non-commit is proven.
assert.match(service, /ASSET_UPLOAD_NOT_COMMITTED/);
assert.match(service, /ASSET_UPLOAD_AMBIGUOUS/);
assert.match(service, /recoveredAfterTransportFailure: true/);
assert.doesNotMatch(service, /for \(let attempt.*uploadViaFetch/s);

console.log('Build101 Track asset upload success verification guard PASS');
