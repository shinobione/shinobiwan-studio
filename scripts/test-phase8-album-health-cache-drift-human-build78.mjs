import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const view = read('src/components/AlbumHealthWorkspace.tsx');
const health = read('src/album-health.ts');
const pkg = JSON.parse(read('package.json'));

function expect(condition, message) {
  if (!condition) throw new Error(`Build78 guard failed: ${message}`);
}

expect(/build:\s*(?:78|79)/.test(release), 'release identity must remain Build78 or its explicit Build79 successor');
expect(
  release.includes("codename: 'studio-focus-slice4-phase8-album-health-cache-drift-human-ux'")
  || release.includes("codename: 'studio-focus-slice4-phase8-album-publish-truth'"),
  'Build78/79 codename lineage must remain exact',
);
expect(release.includes('build77AncestryMarker'), 'Build77 visual ancestry must remain explicit');
if (/build:\s*79/.test(release)) expect(release.includes('build78AncestryMarker'), 'Build79 must preserve explicit Build78 ancestry');

expect(health.includes('cacheDriftTrackIds'), 'Build76 cache-drift truth must remain available internally');
expect(health.includes('Canonical Album membership authority is album.trackIds'), 'canonical Album membership authority must remain unchanged');
expect(!health.includes('saveAdminAlbum'), 'Album Health truth engine must remain read-only');

expect(view.includes('Track metadata out of sync'), 'user-facing cache drift must use human wording');
expect(view.includes('Canonical Album membership is already authoritative.'), 'UI must explain that Album membership remains correct/authoritative');
expect(view.includes('The Track-side Album reference does not match and should be normalized.'), 'UI must explain the Track-side mismatch');
expect(view.includes("trackHref(trackId, 'metadata')"), 'cache mismatch review must route directly to Track metadata');
expect(view.includes('Review track metadata →'), 'cache mismatch action must be explicit');
expect(view.includes('tracksById.get(trackId)'), 'cache mismatch must show resolved Track title when available');
expect(view.includes('Track metadata mismatch'), 'issue chip must use human wording');
expect(!view.includes('Compatibility cache'), 'internal compatibility-cache jargon must not remain user-facing');
expect(!view.includes('cache drift'), 'internal cache-drift jargon must not remain user-facing');
expect(view.includes('const albumStructuralIssue = album.coverMissing || album.emptyTracklist || album.missingTrackIds.length > 0;'), 'cache mismatch must not masquerade as an Album structural issue');
expect(view.includes('Review Album details ↓'), 'real Album structural issues must still route to the Albums editor');
expect(!view.includes('saveAdminAlbum'), 'Build78 must not add Album writes');
expect(!view.includes('uploadAdminAlbumAsset'), 'Build78 must not add asset writes');

expect(pkg.scripts['check:phase8']?.includes('test-phase8-album-health-cache-drift-human-build78.mjs'), 'Build78 guard must run in check:phase8');

console.log('Build78 Album Health cache-drift human UX guard passed through its Build79 publish-truth successor.');
