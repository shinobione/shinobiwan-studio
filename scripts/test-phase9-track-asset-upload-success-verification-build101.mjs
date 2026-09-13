import fs from 'node:fs';
import assert from 'node:assert/strict';

const release = fs.readFileSync('src/release.ts', 'utf8');
const service = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');
const assets = fs.readFileSync('src/components/AssetsManager.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);

assert.ok(currentBuild >= 101, `Build101 guard requires Build101 or a successor, got Build${currentBuild}.`);
assert.match(release, /studio-focus-(?:slice4-|build)/);
assert.match(release, /build100AncestryMarker/);
for (let build = 101; build <= Math.min(currentBuild - 1, 110); build += 1) {
  assert.match(release, new RegExp(`build${build}AncestryMarker`), `Build${currentBuild} must preserve Build${build} ancestry.`);
}
assert.equal(pkg.version, release.match(/version:\s*'([^']+)'/)?.[1]);
assert.match(pkg.scripts['check:phase9'], /test-phase9-track-asset-upload-success-verification-build101\.mjs/);

assert.match(assets, /uploadAdminTrackAsset\(track\.id, def\.kind, revision, file/);
assert.match(service, /const sizeVerified = payload\.size == null \|\| asset\?\.size === payload\.size/);
assert.match(service, /const contentTypeVerified = !payload\.contentType \|\| asset\?\.contentType === payload\.contentType/);
assert.match(service, /const etagVerified = !payload\.etag \|\| normalizeAssetEtag\(asset\?\.etag\) === normalizeAssetEtag\(payload\.etag\)/);
assert.match(service, /manifest\?\.updatedAt === payload\.updatedAt/);
assert.match(service, /manifest\?\.assets\?\.\[kind\] === payload\.filename/);
assert.match(service, /asset\?\.present === true/);
assert.match(service, /ASSET_UPLOAD_UNVERIFIED/);
assert.match(service, /Do not retry until the track is reloaded and inspected/);

assert.match(service, /ASSET_UPLOAD_NOT_COMMITTED/);
assert.match(service, /ASSET_UPLOAD_AMBIGUOUS/);
assert.match(service, /recoveredAfterTransportFailure: true/);
assert.doesNotMatch(service, /for \(let attempt.*uploadViaFetch/s);

console.log(`Build101 Track asset upload success verification guard PASS through bounded Build${currentBuild} successor`);
