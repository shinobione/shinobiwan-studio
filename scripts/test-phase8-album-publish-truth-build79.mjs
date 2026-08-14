import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const api = read('src/services/album-admin-api.ts');
const workspace = read('src/components/AlbumsWorkspace.tsx');
const pkg = JSON.parse(read('package.json'));

function expect(condition, message) {
  if (!condition) throw new Error(`Build79 guard failed: ${message}`);
}

expect(release.includes('build: 79'), 'release identity must be Build79');
expect(release.includes("codename: 'studio-focus-slice4-phase8-album-publish-truth'"), 'Build79 codename must be exact');
expect(release.includes('build78AncestryMarker'), 'Build78 candidate ancestry must remain explicit');

expect(api.includes('export interface AdminAlbumQuality'), 'Album quality payload must be typed');
expect(api.includes('function albumQualityBlockers('), 'backend Album quality blockers must reach a human formatter');
expect(api.includes('Track “${label}” must be Published (currently ${titleCase(track.status)}).'), 'member Track status blocker must be explicit');
expect(api.includes('Album cover is required before publication.'), 'cover blocker must be explicit');
expect(api.includes('Missing Track reference:'), 'broken member reference blocker must be explicit');
expect(api.includes('function metadataMismatch('), 'client must compare requested Album metadata to canonical reread');
expect(api.includes('expectedMetadata?: AdminAlbumMetadataPatch'), 'metadata reread verification must receive the requested patch');
expect(api.includes('return verify(albumId, payload, { expectedMetadata: metadata });'), 'metadata save must verify the requested fields');
expect(api.includes('Canonical Album reread mismatch:'), 'canonical mismatch must produce a visible verification warning');
expect(api.includes("transport: 'Track Manager v5.23 / bridge v1.13 only'"), 'Album write transport must target TM5.23 / bridge1.13');
expect(api.includes('verificationDetail?: string | null'), 'Worker verification details must survive the client boundary');
expect(api.includes('quality?: AdminAlbumQuality | null'), 'Worker quality details must survive the client boundary');

expect(workspace.includes('const message = errorMessage(reason);'), 'mutation errors must be captured before canonical reload');
expect(workspace.includes('await load().catch(() => {});\n      setError(message);'), 'canonical reload must happen before restoring the visible error');
expect(workspace.includes('Album status ${requestedStatus.toUpperCase()} saved and canonically verified.'), 'status changes need an explicit verified success notice');
expect(workspace.includes('if (!result.clientVerified) throw new AlbumAdminError'), 'false-positive canonical verification must stay a hard failure');
expect(!workspace.includes("setError(errorMessage(reason));\n      await load().catch(() => {});"), 'old error-erasing mutation order must not return');

expect(api.includes("metadata: 'album-metadata-save-v1'"), 'existing scoped Album metadata operation must remain the write path');
expect(!api.includes('/publish'), 'Build79 must not introduce a separate Album publish write route');
expect(pkg.scripts['check:phase8']?.includes('test-phase8-album-publish-truth-build79.mjs'), 'Build79 guard must run in check:phase8');

console.log('Build79 Album publish truth guard passed: blocker feedback + strict status reread + visible failure persistence.');
