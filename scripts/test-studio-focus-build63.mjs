import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const app = read('src/App.tsx');
const legacyType = read('src/legacy-track-type-display.ts');
const css = read('src/studio-focus-build63-smoke2.css');
const build62Css = read('src/studio-focus-build62-closeout-corrective.css');

assert.match(release, /version:\s*'0\.19\.3'/);
assert.match(release, /build:\s*63/);
assert.match(release, /studio-focus-slice4-smoke2-corrective/);
assert.equal(pkg.version, '0.19.3');
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build63.mjs'), 'Build 63 smoke corrective guard must run in the inherited Studio Focus chain.');

assert.ok(app.includes("import { installLegacyTrackTypeDisplay } from './legacy-track-type-display';"), 'App must own the artist-facing legacy type display adapter.');
assert.ok(app.includes("import './studio-focus-build63-smoke2.css';"), 'Build 63 palette layout corrective must be loaded.');
assert.ok(app.includes('useEffect(() => installLegacyTrackTypeDisplay(), []);'), 'Legacy display adapter must follow the existing React lifecycle.');
assert.ok(app.includes("Track Manager v5.20 · bridge v1.11"), 'Build 63 fallback lineage must recognize the TM 5.20 corrective without changing bridge v1.11.');

assert.ok(legacyType.includes("\"titre d'album\""), 'Legacy French album-track value must be recognized.');
assert.ok(legacyType.includes("'Album track'"), 'Artist-facing type must use concise English Album track wording.');
assert.ok(legacyType.includes(".workspace-focus-facts > div"), 'Normalization must stay scoped to the artist-facing Track facts card.');
assert.ok(!legacyType.includes('fetch('), 'Presentation adapter must not perform network reads.');
for (const forbidden of ['saveAdminTrackMetadata', 'uploadAdminTrackAsset', 'deleteAdminTrackAsset', '/api/studio/write', 'localStorage.setItem']) {
  assert.ok(!legacyType.includes(forbidden), `Legacy type display adapter must stay presentation-only: ${forbidden}`);
}

assert.match(css, /\.assets-cover-palette\{grid-template-columns:minmax\(220px,\.42fr\) minmax\(0,1fr\)!important/, 'Desktop palette workbench must keep a stable two-column geometry.');
assert.ok(css.includes('.assets-cover-palette>.cover-palette-preview{grid-column:2!important;grid-row:1!important'), 'Palette preview must remain in the right column.');
assert.ok(css.includes('.assets-cover-palette>.primary-btn{grid-column:2!important;grid-row:2!important'), 'Save palette must appear below the palette instead of creating a third column.');
assert.ok(css.includes('@media(max-width:820px)'), 'Palette workbench must retain a stacked mobile fallback.');
for (const forbidden of ['fetch(', 'save', '/api/', 'canonicalWrite']) {
  assert.ok(!css.includes(forbidden), `Build 63 CSS must remain presentation-only: ${forbidden}`);
}

assert.ok(build62Css.includes('.rc-provider-field{display:none!important}'), 'Build 62 fake provider selector cleanup must remain inherited.');
assert.ok(build62Css.includes("content:'Sonic'"), 'Build 62 artist-facing Sonic label correction must remain inherited.');

console.log('Studio Focus Build 63 guard passed: Album track display adapter and stable palette geometry remain presentation-only while TM 5.20 lineage is recognized.');
