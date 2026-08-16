import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function replaceOnce(path, before, after) {
  const source = read(path);
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${path}: expected exactly one marker, found ${count}`);
  write(path, source.replace(before, after));
}

const phase4Path = 'src/services/phase4-admin-api.ts';
const oldSuccess = `  if (!payload.saved || !payload.updatedAt || !payload.filename) throw new Phase4AdminError('Track Manager returned an invalid asset upload response.');
  const reread = await getAdminTrack(trackId);
  const manifest = reread.track?.manifest;
  const asset = reread.track?.assets?.[kind];
  const durationVerified = payload.duration == null || manifest?.duration === payload.duration;
  const clientVerified = manifest?.updatedAt === payload.updatedAt && manifest?.assets?.[kind] === payload.filename && asset?.present === true && durationVerified;
  return { ...payload, clientVerified };
`;
const newSuccess = `  if (!payload.saved || !payload.updatedAt || !payload.filename) throw new Phase4AdminError('Track Manager returned an invalid asset upload response.');
  try {
    const reread = await getAdminTrack(trackId);
    const manifest = reread.track?.manifest;
    const asset = reread.track?.assets?.[kind];
    const durationVerified = payload.duration == null || manifest?.duration === payload.duration;
    const sizeVerified = payload.size == null || asset?.size === payload.size;
    const contentTypeVerified = !payload.contentType || asset?.contentType === payload.contentType;
    const etagVerified = !payload.etag || asset?.etag === payload.etag;
    const clientVerified = manifest?.updatedAt === payload.updatedAt
      && manifest?.assets?.[kind] === payload.filename
      && asset?.present === true
      && sizeVerified
      && contentTypeVerified
      && etagVerified
      && durationVerified;
    if (!clientVerified) {
      const mismatches = [
        manifest?.updatedAt === payload.updatedAt ? null : 'canonical revision',
        manifest?.assets?.[kind] === payload.filename ? null : 'manifest asset filename',
        asset?.present === true ? null : 'private asset presence',
        sizeVerified ? null : 'asset size',
        contentTypeVerified ? null : 'asset content type',
        etagVerified ? null : 'asset ETag',
        durationVerified ? null : 'canonical duration',
      ].filter(Boolean).join(', ');
      throw new Phase4AdminError(
        \`Track Manager reported asset upload success, but the canonical reread did not verify the exact new revision plus server asset fingerprint (\${mismatches || 'unknown mismatch'}). Do not retry.\`,
        null,
        'ASSET_UPLOAD_UNVERIFIED',
        manifest?.updatedAt || null,
        null,
        false,
        \`response updatedAt=\${payload.updatedAt}; filename=\${payload.filename}; size=\${payload.size ?? 'n/a'}; contentType=\${payload.contentType ?? 'n/a'}; etag=\${payload.etag ?? 'n/a'}\`,
      );
    }
    return { ...payload, clientVerified: true, retrySafe: false };
  } catch (reason) {
    if (reason instanceof Phase4AdminError) throw reason;
    throw new Phase4AdminError(
      'Track Manager reported asset upload success, but Studio could not complete the canonical asset reread. Do not retry until the track is reloaded and inspected.',
      null,
      'ASSET_UPLOAD_UNVERIFIED',
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }
`;
replaceOnce(phase4Path, oldSuccess, newSuccess);

const pkgPath = 'package.json';
const pkg = JSON.parse(read(pkgPath));
if (pkg.version !== '0.19.22') throw new Error(`package version expected 0.19.22, got ${pkg.version}`);
pkg.version = '0.19.23';
const guard = 'node scripts/test-phase9-track-asset-upload-success-verification-build101.mjs';
if (!pkg.scripts['check:phase9'].endsWith('node scripts/test-phase9-album-first-track-intake-build100.mjs')) {
  throw new Error('check:phase9 Build100 tail marker changed');
}
pkg.scripts['check:phase9'] += ` && ${guard}`;
write(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

replaceOnce(
  'src/release.ts',
  `  version: '0.19.22',\n  build: 100,\n  codename: 'studio-focus-slice4-phase9-album-first-track-intake',`,
  `  version: '0.19.23',\n  build: 101,\n  codename: 'studio-focus-slice4-phase9-track-asset-upload-success-verification-truth',`,
);
replaceOnce(
  'src/release.ts',
  `export const build99AncestryMarker = \"version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'\";`,
  `export const build99AncestryMarker = \"version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'\";\nexport const build100AncestryMarker = \"version: 0.19.22 · build: 100 · codename: 'studio-focus-slice4-phase9-album-first-track-intake'\";`,
);

write('scripts/test-phase9-track-asset-upload-success-verification-build101.mjs', `import fs from 'node:fs';\nimport assert from 'node:assert/strict';\n\nconst release = fs.readFileSync('src/release.ts', 'utf8');\nconst service = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');\nconst assets = fs.readFileSync('src/components/AssetsManager.tsx', 'utf8');\nconst pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));\n\nassert.match(release, /version: '0\\.19\\.23'/);\nassert.match(release, /build: 101/);\nassert.match(release, /track-asset-upload-success-verification-truth/);\nassert.match(release, /build100AncestryMarker/);\nassert.equal(pkg.version, '0.19.23');\nassert.match(pkg.scripts['check:phase9'], /test-phase9-track-asset-upload-success-verification-build101\\.mjs/);\n\n// Daily Track Visuals/Assets must still use the guarded service.\nassert.match(assets, /uploadAdminTrackAsset\\(track\\.id, def\\.kind, revision, file/);\n\n// A normal HTTP success is not enough: reread must match the response fingerprint.\nassert.match(service, /const sizeVerified = payload\\.size == null \\|\\| asset\\?\\.size === payload\\.size/);\nassert.match(service, /const contentTypeVerified = !payload\\.contentType \\|\\| asset\\?\\.contentType === payload\\.contentType/);\nassert.match(service, /const etagVerified = !payload\\.etag \\|\\| asset\\?\\.etag === payload\\.etag/);\nassert.match(service, /manifest\\?\\.updatedAt === payload\\.updatedAt/);\nassert.match(service, /manifest\\?\\.assets\\?\\.\\[kind\\] === payload\\.filename/);\nassert.match(service, /asset\\?\\.present === true/);\nassert.match(service, /ASSET_UPLOAD_UNVERIFIED/);\nassert.match(service, /Do not retry until the track is reloaded and inspected/);\n\n// Existing response-loss semantics remain bounded and retry-safe only when non-commit is proven.\nassert.match(service, /ASSET_UPLOAD_NOT_COMMITTED/);\nassert.match(service, /ASSET_UPLOAD_AMBIGUOUS/);\nassert.match(service, /recoveredAfterTransportFailure: true/);\nassert.doesNotMatch(service, /for \\(let attempt.*uploadViaFetch/s);\n\nconsole.log('Build101 Track asset upload success verification guard PASS');\n`);

write('changelogs/CHANGELOG-BUILD101.md', `# CHANGELOG — Studio v0.19.23 · Build101\n\nDate: 2026-08-16\nStatus: **SOURCE CANDIDATE · NOT DEPLOYED**\nCodename: \`studio-focus-slice4-phase9-track-asset-upload-success-verification-truth\`\n\n## Why\n\nFresh post-Build100 audit found one bounded Studio-only truth gap in the daily Track asset path. Track Manager already returns canonical upload evidence (new revision, filename, size, content type and ETag), but Studio's normal-success reread only checked revision + manifest filename + presence (+ audio duration). A successful HTTP response could therefore be labelled client-verified without proving the server fingerprint against private canonical asset state.\n\n## Build101 contract\n\nAfter a normal successful Track asset upload, Studio now requires the private canonical reread to match:\n\n- the exact new manifest revision returned by Track Manager;\n- the canonical manifest asset filename;\n- private asset presence;\n- server-reported size when present;\n- server-reported content type when present;\n- server-reported ETag when present;\n- server-reported audio duration when present.\n\nAny mismatch or unreadable post-success canonical reread is **UNVERIFIED / DO NOT RETRY**. The selected daily UI continues to use \`uploadAdminTrackAsset\`.\n\n## Explicit non-scope\n\n- no Track Manager/admin Worker change;\n- no Public Worker change;\n- no R2 schema or media mutation caused by this release itself;\n- no automatic upload retry;\n- no change to the accepted lost-response recovery contract;\n- no client-side digest / exact-byte cryptographic proof;\n- no Album upload behavior change.\n\nBuild100 remains the accepted predecessor until Build101 passes source CI, deploys as a candidate and receives an explicit real-user smoke verdict.\n`);

console.log('Build101 candidate patch applied');
