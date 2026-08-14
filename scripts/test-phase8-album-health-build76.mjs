import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const health = read('src/album-health.ts');
const view = read('src/components/AlbumHealthWorkspace.tsx');
const app = read('src/App.tsx');
const pkg = JSON.parse(read('package.json'));

function expect(condition, message) {
  if (!condition) throw new Error(`Build76 guard failed: ${message}`);
}

expect(/build:\s*(?:76|77|78)/.test(release), 'release identity must remain Build76 or an explicit bounded successor');
expect(
  release.includes("studio-focus-slice4-phase8-album-health-truth")
  || release.includes("studio-focus-slice4-phase8-album-health-visual-polish")
  || release.includes("studio-focus-slice4-phase8-album-health-cache-drift-human-ux"),
  'Build76 Album Health lineage must remain exact',
);
expect(release.includes('build75AncestryMarker'), 'Build75 accepted ancestry marker must remain explicit');
if (/build:\s*(?:77|78)/.test(release)) expect(release.includes('build76AncestryMarker'), 'visual successors must preserve explicit Build76 ancestry');
if (/build:\s*78/.test(release)) expect(release.includes('build77AncestryMarker'), 'Build78 must preserve explicit Build77 ancestry');

expect(health.includes('buildCatalogAlbumHealth'), 'shared Album health authority must exist');
expect(health.includes("tracks.length > 0 && tracks.every(track => track.readSource === 'private')"), 'cross-model integrity must require protected private Track truth');
expect(health.includes('Canonical Album membership authority is album.trackIds'), 'album.trackIds authority must be explicit');
expect(health.includes("track.album.id !== album.id"), 'forward track-side compatibility-cache drift must be detected');
expect(health.includes("track.album.id === album.id && !canonicalSet.has(track.id)"), 'reverse compatibility-cache drift must be detected');
expect(health.includes('isProductionWorkflowReady(item)'), 'member production health must reuse the accepted Track production truth');
expect(!health.includes('saveAdminAlbum'), 'Album health engine must not introduce an Album write');
expect(!health.includes('fetch('), 'Album health engine must stay a pure read-model computation');
expect(!health.includes('SonicTrace'), 'Album health engine must not duplicate C3-B sonic/project intelligence');

expect(view.includes('PHASE 8 / ALBUM HEALTH'), 'Albums surface must expose the Phase8 Album Health context');
expect(view.includes('Cross-model checks unverified'), 'public fallback must be presented as unverified, not as broken canonical state');
expect(view.includes('trackHref(action.trackId, action.section)'), 'member production gaps must route through existing Track next-action context');
expect(view.includes('<AlbumsWorkspace />'), 'existing canonical Albums editor must remain the write surface');
expect(!view.includes('saveAdminAlbum'), 'Album Health view must not call Album writes');
expect(!view.includes('getSonicTrace'), 'Album Health view must not duplicate Catalog Intelligence');

expect(app.includes("route === 'albums' && <AlbumHealthWorkspace />"), 'Albums route must mount the bounded Album Health wrapper');
expect(pkg.scripts['check:phase8']?.includes('test-phase8-content-health-build74.mjs'), 'Build74 guard must remain');
expect(pkg.scripts['check:phase8']?.includes('test-phase8-health-drilldown-build75.mjs'), 'Build75 guard must remain');
expect(pkg.scripts['check:phase8']?.includes('test-phase8-album-health-build76.mjs'), 'Build76 guard must run in check:phase8');

console.log('Build76 Phase8 Album Health truth guard passed through bounded successors.');
