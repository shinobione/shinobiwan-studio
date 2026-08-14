import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const view = read('src/components/AlbumHealthWorkspace.tsx');
const css = read('src/phase8-album-health.css');
const health = read('src/album-health.ts');
const pkg = JSON.parse(read('package.json'));

function expect(condition, message) {
  if (!condition) throw new Error(`Build77 guard failed: ${message}`);
}

expect(release.includes('build: 77'), 'release identity must be Build77');
expect(release.includes("codename: 'studio-focus-slice4-phase8-album-health-visual-polish'"), 'Build77 codename must be exact');
expect(release.includes('build76AncestryMarker'), 'Build76 functional ancestry must remain explicit');

expect(view.includes('getPublicAlbumVisuals'), 'Album cards must reuse proven canonical/public artwork projection');
expect(view.includes('source?.accent || DEFAULT_ACCENT'), 'Album primary palette must drive the visual card');
expect(view.includes('source?.accent2 || DEFAULT_ACCENT_2'), 'Album secondary palette must drive the visual card');
expect(view.includes('phase8-album-art'), 'Album cover identity must be visible');
expect(view.includes('PRIMARY_MEMBER_ACTIONS = 3'), 'production-gap actions must stay compact by default');
expect(view.includes('<details className="phase8-album-more">'), 'additional Track actions must be progressive disclosure');
expect(view.includes('Album manifest clean · Track work remains'), 'manifest health and Track work must stay semantically separate');
expect(view.includes('No second authority, no automatic repair.'), 'read-only authority boundary must remain user-facing');
expect(view.includes('<AlbumsWorkspace />'), 'canonical Album editor must remain the write surface');
expect(!view.includes('saveAdminAlbum'), 'visual corrective must not add Album writes');
expect(!view.includes('uploadAdminAlbumAsset'), 'visual corrective must not add asset writes');

expect(css.includes('align-items: start;'), 'Album grid must stop stretching short cards to tall row siblings');
expect(css.includes('--album-accent'), 'Album palette custom properties must style cards');
expect(css.includes('.phase8-album-card:hover'), 'premium hover treatment must exist');
expect(css.includes('.phase8-album-track-action:hover'), 'Track action feedback must exist');
expect(css.includes('@media (prefers-reduced-motion: reduce)'), 'premium motion must remain reduced-motion safe');
expect(css.includes('.phase8-album-summary'), 'summary must use the compact Build77 ribbon');
expect(!css.includes('.phase8-album-kpis'), 'Build76 generic KPI grid must not remain the primary layout');

expect(health.includes('buildCatalogAlbumHealth'), 'Build76 Album Health truth engine must remain unchanged');
expect(!health.includes('saveAdminAlbum'), 'truth engine must remain read-only');
expect(pkg.scripts['check:phase8']?.includes('test-phase8-album-health-visual-build77.mjs'), 'Build77 guard must run in check:phase8');

console.log('Build77 Phase8 Album Health visual corrective guard passed.');
