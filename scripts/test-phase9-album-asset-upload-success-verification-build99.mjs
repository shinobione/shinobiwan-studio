import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const albumApi = read('src/services/album-admin-api.ts');
const workspace = read('src/components/AlbumsWorkspace.tsx');
const pkg = JSON.parse(read('package.json'));

assert.ok(['0.19.21', '0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26'].includes(pkg.version), 'Build99 guard accepts Build99 and bounded successors through Build104.');
if (pkg.version === '0.19.21') {
  assert.ok(release.includes("version: '0.19.21'"), 'Build99 release version mismatch.');
  assert.ok(release.includes('build: 99'), 'Build99 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'"), 'Build99 codename mismatch.');
}
assert.ok(release.includes('build98AncestryMarker'), 'Build99+ must preserve accepted Build98 ancestry.');
assert.ok(release.includes("version: 0.19.20 · build: 98 · codename: 'studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective'"), 'Accepted Build98 identity must remain immutable in Build99 ancestry.');
if (['0.19.22', '0.19.23', '0.19.24', '0.19.25', '0.19.26'].includes(pkg.version)) {
  assert.ok(release.includes('build99AncestryMarker'), 'Build100+ must preserve accepted Build99 ancestry.');
  assert.ok(release.includes("version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'"), 'Accepted Build99 identity must remain immutable in successor ancestry.');
}
if (['0.19.23', '0.19.24', '0.19.25', '0.19.26'].includes(pkg.version)) assert.ok(release.includes('build100AncestryMarker'), 'Build101+ must preserve accepted Build100 ancestry.');
if (['0.19.24', '0.19.25', '0.19.26'].includes(pkg.version)) assert.ok(release.includes('build101AncestryMarker'), 'Build102+ must preserve Build101 candidate ancestry.');
if (['0.19.25', '0.19.26'].includes(pkg.version)) assert.ok(release.includes('build102AncestryMarker'), 'Build103+ must preserve accepted Build102 ancestry.');
if (pkg.version === '0.19.26') assert.ok(release.includes('build103AncestryMarker'), 'Build104 must preserve accepted Build103 ancestry.');

// Build99 closes only normal-success Album asset verification. It does not claim exact selected-byte proof.
for (const field of [
  'kind?: AdminAlbumAssetKind;',
  'path?: string | null;',
  'size?: number | null;',
  'contentType?: string | null;',
  'etag?: string | null;',
]) assert.ok(albumApi.includes(field), `Album asset write response must expose server evidence ${field}`);

assert.ok(albumApi.includes('expectedAsset?: ExpectedAlbumAssetVerification'), 'Shared Album verifier must accept an operation-specific expected asset postcondition.');
assert.ok(albumApi.includes('const assetState = options.expectedAsset ? reread.album?.assets?.[options.expectedAsset.kind] : null;'), 'Build99 must inspect canonical private asset state after success.');
assert.ok(albumApi.includes('const assetPathMatches = !options.expectedAsset || manifest?.assets?.[options.expectedAsset.kind] === options.expectedAsset.path;'), 'Build99 must verify the canonical manifest slot/path.');
assert.ok(albumApi.includes('const assetPresent = !options.expectedAsset || assetState?.present === true;'), 'Build99 must verify canonical asset presence.');
assert.ok(albumApi.includes('const assetSizeMatches = !options.expectedAsset || options.expectedAsset.size == null || assetState?.size === options.expectedAsset.size;'), 'Build99 must compare server response size when available.');
assert.ok(albumApi.includes('const assetContentTypeMatches = !options.expectedAsset || !options.expectedAsset.contentType || assetState?.contentType === options.expectedAsset.contentType;'), 'Build99 must compare server response content type when available.');
assert.ok(albumApi.includes('const assetEtagMatches = !options.expectedAsset || !options.expectedAsset.etag || assetState?.etag === options.expectedAsset.etag;'), 'Build99 must compare server response ETag when available.');
assert.ok(albumApi.includes('clientVerified = revisionMatches && trackIdsMatch && mismatchedMetadata.length === 0 && assetPathMatches && assetPresent && assetSizeMatches && assetContentTypeMatches && assetEtagMatches;'), 'Build99 success must require all canonical asset postconditions, not revision alone.');

assert.ok(albumApi.includes('payload.kind !== kind || !payload.path'), 'Album upload response must identify the requested slot and canonical path before verification.');
assert.ok(albumApi.includes('return verify(albumId, payload, { expectedAsset: {'), 'Album upload normal success must pass server evidence into the private canonical verifier.');
assert.ok(albumApi.includes('kind, path: payload.path, size: payload.size ?? null, contentType: payload.contentType ?? null, etag: payload.etag ?? null'), 'Build99 must preserve the bounded server response fingerprint for reread comparison.');
assert.ok(!albumApi.includes('if (!payload.saved || !payload.updatedAt) throw new AlbumAdminError(\'Track Manager returned an invalid Album asset upload response.\'); return verify(albumId, payload);'), 'Revision-only Album upload success verification must not return.');

assert.ok(albumApi.includes("assetUploadSuccessVerificationPolicy: 'server-response-revision-slot-path-presence-fingerprint-plus-private-reread'"));
assert.ok(albumApi.includes("assetUploadExactBytesPolicy: 'not-covered-no-client-digest'"), 'Build99 must not overclaim selected-byte proof.');
assert.ok(albumApi.includes("assetUploadLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry'"), 'Build99 must leave Album upload lost-response causality explicitly unsolved.');
assert.ok(albumApi.includes('maxAutomaticAssetUploadRetries: 0'), 'Album asset upload must retain zero automatic retries.');
assert.ok(!albumApi.includes('retryAdminAlbumAssetUpload'), 'Build99 must not add a blind Album asset retry helper.');

// Accepted earlier truths remain intact.
assert.ok(albumApi.includes("createSuccessVerificationPolicy: 'canonical-reread-revision-plus-requested-metadata'"), 'Build96 Album create truth must remain intact.');
assert.ok(albumApi.includes('maxAutomaticCreateRetries: 0'), 'Build96 Album create zero-retry boundary must remain intact.');
assert.ok(albumApi.includes("transport: 'Track Manager v5.23-v5.24 / bridges v1.13-v1.14'"), 'Build98 bounded TM compatibility line must remain intact.');
assert.ok(workspace.includes("const coverResult = await uploadAdminAlbumAsset(album.id, 'cover', revision, cover);"), 'Daily Albums cover upload must keep using the shared service.');
assert.ok(workspace.includes('if (!coverResult.clientVerified || !coverResult.updatedAt)'), 'Daily Albums must refuse unverified cover success.');
assert.ok(workspace.includes('if (!thumbnailResult.clientVerified)'), 'Daily Albums must refuse unverified thumbnail success.');

for (const inherited of [
  'test-phase9-album-create-success-verification-build96.mjs',
  'test-phase9-track-create-success-verification-build97.mjs',
  'test-phase9-tm524-duration-evidence-compat-build98.mjs',
  'test-phase9-album-asset-upload-success-verification-build99.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Build99 must remain inside the repository-native full build gate.');

console.log('Phase9 Build99 Album asset upload success-verification guard passed through Build104: normal success proves response revision + requested slot/path + canonical presence and available server fingerprint fields, while exact selected-byte and lost-response causality remain explicitly out of scope with zero automatic retries.');
