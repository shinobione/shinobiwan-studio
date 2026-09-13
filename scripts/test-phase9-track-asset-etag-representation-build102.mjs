import fs from 'node:fs';
import assert from 'node:assert/strict';

const release = fs.readFileSync('src/release.ts', 'utf8');
const service = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);

assert.ok(currentBuild >= 102, `Build102 ETag contract requires Build102 or a successor, got Build${currentBuild}.`);
assert.match(release, /build101AncestryMarker/);
for (let build = 102; build <= Math.min(currentBuild - 1, 110); build += 1) {
  assert.match(release, new RegExp(`build${build}AncestryMarker`), `Build${currentBuild} must preserve Build${build} ancestry.`);
}
if (currentBuild === 102) {
  assert.match(release, /version: '0\.19\.24'/);
  assert.match(release, /build: 102/);
  assert.match(release, /track-asset-etag-representation-corrective/);
}
assert.equal(pkg.version, release.match(/version:\s*'([^']+)'/)?.[1]);
assert.match(pkg.scripts['check:phase9'], /test-phase9-track-asset-etag-representation-build102\.mjs/);

assert.match(service, /function normalizeAssetEtag\(value: string \| null \| undefined\): string \| null/);
assert.match(service, /trimmed\.startsWith\('\"'\) && trimmed\.endsWith\('\"'\)/);
assert.match(service, /trimmed\.slice\(1, -1\)/);
assert.match(service, /const etagVerified = !payload\.etag \|\| normalizeAssetEtag\(asset\?\.etag\) === normalizeAssetEtag\(payload\.etag\)/);
assert.match(service, /responseEtag=\$\{payload\.etag \?\? 'n\/a'\}; canonicalEtag=\$\{asset\?\.etag \?\? 'n\/a'\}/);

assert.match(service, /manifest\?\.updatedAt === payload\.updatedAt/);
assert.match(service, /manifest\?\.assets\?\.\[kind\] === payload\.filename/);
assert.match(service, /asset\?\.present === true/);
assert.match(service, /ASSET_UPLOAD_UNVERIFIED/);
assert.match(service, /ASSET_UPLOAD_NOT_COMMITTED/);
assert.match(service, /ASSET_UPLOAD_AMBIGUOUS/);
assert.match(service, /recoveredAfterTransportFailure: true/);
assert.doesNotMatch(service, /for \(let attempt.*uploadViaFetch/s);

console.log(`Build102 Track asset ETag representation corrective guard PASS through bounded Build${currentBuild} successor`);
