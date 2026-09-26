import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const catalog = read('src/components/CatalogView.tsx');
const polish = read('src/c2-5-a-polish.css');
const main = read('src/main.tsx');
const embed = read('src/components/EmbeddedLyricsStudio.tsx');

for (const required of [
  "from '../services/shared-private-reads'",
  'await getCatalogTracks(force)',
  'generation !== loadGeneration.current',
  'function CatalogLoadingState()',
  'catalog-loading-orb',
  'catalog-skeleton-grid',
  "await loadCatalog(true)",
]) assert.ok(catalog.includes(required), `Catalog UX/performance guard missing ${required}.`);
assert.ok(!catalog.includes('catalogCache'), 'Settled private/public snapshots must not persist across navigation.');
assert.ok(!catalog.includes('void requestCatalog()'), 'Importing Tracks must not issue eager background GETs.');

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

console.log('Studio PHASE UX C2.5-A polish guard passed: Catalog pending-read sharing+skeleton, Intelligence hover overflow fix and LRC embed 6.3.8 remain protected. CPU slice 4 supersedes eager settled caching.');
