import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const catalog = read('src/components/CatalogView.tsx');
const polish = read('src/c2-5-a-polish.css');
const main = read('src/main.tsx');
const embed = read('src/components/EmbeddedLyricsStudio.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

for (const required of [
  'let catalogCache: StudioTrack[] | null = null',
  'let catalogRequest: Promise<StudioTrack[]> | null = null',
  'void requestCatalog().catch(() => {})',
  'function CatalogLoadingState()',
  'catalog-loading-orb',
  'catalog-skeleton-grid',
  "await loadCatalog(true)",
]) assert.ok(catalog.includes(required), `Catalog UX/performance guard missing ${required}.`);

for (const required of [
  '.intelligence-track-list {',
  'overflow-x: hidden',
  '.intelligence-track-list button:hover {',
  'transform: none',
  '.catalog-loading-orb {',
  '.catalog-skeleton-grid {',
  '@media (prefers-reduced-motion: reduce)',
]) assert.ok(polish.includes(required), `C2.5-A polish stylesheet missing ${required}.`);

assert.ok(main.indexOf("import './c2-5-a-polish.css';") > main.indexOf("import './readability.css';"),
  'C2.5-A corrective CSS must load after established Studio styles.');
assert.ok(embed.includes("const EMBED_VERSION = '6.3.8';"), 'Studio must cache-bust and consume LRC Maker embed 6.3.8.');
assert.ok(release.includes("version: '0.10.9'") && release.includes('build: 31'), 'Studio release must be v0.10.9 Build 31.');
assert.ok(release.includes("codename: 'phase-ux-c2-5-a-lrc-638'"), 'Build 31 must identify the LRC 6.3.8 corrective integration.');
assert.equal(pkg.version, '0.10.9', 'package.json must match Studio v0.10.9.');

console.log('Studio PHASE UX C2.5-A polish guard passed: Catalog warm/cache+skeleton, Intelligence hover overflow fix, LRC embed 6.3.8 and Build 31 release markers protected.');
