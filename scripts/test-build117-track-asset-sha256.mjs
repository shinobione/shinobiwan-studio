import fs from 'node:fs';
import assert from 'node:assert/strict';

const release = fs.readFileSync('src/release.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const assetsManager = fs.readFileSync('src/components/AssetsManager.tsx', 'utf8');
const digestClient = fs.readFileSync('src/services/phase4-track-asset-sha256-api.ts', 'utf8');
const durationApi = fs.readFileSync('src/services/metadata-duration-api.ts', 'utf8');
const metadataSaveApi = fs.readFileSync('src/services/track-metadata-admin-api.ts', 'utf8');

assert.match(release, /version:\s*'0\.19\.39'/);
assert.match(release, /build:\s*117/);
assert.match(release, /codename:\s*'studio-focus-build117-track-asset-sha256'/);
assert.match(release, /build116AncestryMarker/);
assert.equal(pkg.version, '0.19.39');
assert.equal(pkg.scripts['check:build117'], 'node scripts/test-build117-track-asset-sha256.mjs');
assert.match(pkg.scripts.build, /npm run check:build116 && npm run check:build117 && npm run check:focus/);

const legacyPhase4Import = assetsManager.match(/import \{([\s\S]*?)\} from '\.\.\/services\/phase4-admin-api';/)?.[1] || '';
assert.doesNotMatch(legacyPhase4Import, /uploadAdminTrackAsset/, 'Build117 must not import Track upload from the legacy Phase4 client.');
assert.match(assetsManager, /import \{ uploadAdminTrackAsset \} from '\.\.\/services\/phase4-track-asset-sha256-api';/);
assert.match(assetsManager, /uploadAdminTrackAsset\(track\.id, def\.kind, revision, file/);

assert.match(digestClient, /export async function sha256File\(file: File\)/);
assert.match(digestClient, /crypto\.subtle\.digest\('SHA-256', await file\.arrayBuffer\(\)\)/);
assert.match(digestClient, /const SHA256_PATTERN = \/\^\[0-9a-f\]\{64\}\$\//);
assert.match(digestClient, /formData\.set\('sha256', selectedSha256\)/);
assert.match(digestClient, /payload\.sha256 !== selectedSha256/);
assert.match(digestClient, /asset\?\.sha256 === selectedSha256/);
assert.match(digestClient, /const changed = Boolean\(manifest\?\.updatedAt && manifest\.updatedAt !== expectedUpdatedAt\)/);
assert.match(digestClient, /if \(changed && exactDigestMatch\)/);
assert.match(digestClient, /ASSET_UPLOAD_NOT_COMMITTED/);
assert.match(digestClient, /ASSET_UPLOAD_AMBIGUOUS/);
assert.match(digestClient, /ASSET_UPLOAD_UNVERIFIED/);
assert.match(digestClient, /selected-response-private-canonical-sha256-exact-match/);
assert.match(digestClient, /new-revision-plus-private-canonical-sha256-exact-match/);
assert.match(digestClient, /publicProjection: 'digest-private-only'/);
assert.match(digestClient, /transport: 'Track Manager v5\.28 · bridge v1\.18'/);
assert.match(digestClient, /maxAutomaticUploadRetries: 0/);
assert.doesNotMatch(digestClient, /for \(let attempt[\s\S]*uploadWithDigest/);

for (const pair of ["'5.26/1.16'", "'5.27/1.17'", "'5.28/1.18'"]) {
  assert.ok(durationApi.includes(pair), `Build117 duration validation must retain bounded successor bridge ${pair}.`);
  assert.ok(metadataSaveApi.includes(pair), `Build117 duration-aware save must retain bounded successor bridge ${pair}.`);
}
assert.match(durationApi, /v5\.28 \/ v1\.18/);
assert.match(metadataSaveApi, /v5\.28 \/ v1\.18/);

console.log('Build117 PASS: Studio v0.19.39 hashes the selected Track asset client-side, sends SHA-256 through asset-upload-v1, requires exact response/private-canonical digest proof, and never blindly retries an upload.');
