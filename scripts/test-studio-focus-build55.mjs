import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const catalog = read('src/components/CatalogView.tsx');
const workflow = read('src/phase7-workflow.ts');
const main = read('src/main.tsx');
const css = read('src/studio-focus-readability.css');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.17\.\d+$/);
assert.ok(build >= 55, `Build 55 readability ancestry requires Build 55 or later, got ${build}.`);
assert.ok(codename.startsWith('studio-focus-'), `Build 55 readability ancestry must remain under Studio Focus, got ${codename}.`);
assert.equal(pkg.version, version);
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build55.mjs'), 'Build 55 readability guard must run in the Studio Focus chain.');
assert.ok(main.indexOf("import './studio-focus-readability.css';") > main.indexOf("import './studio-focus.css';"), 'Readability corrective must layer after the accepted Build 54 Studio Focus stylesheet.');

for (const marker of [
  'grid-template-columns:repeat(auto-fill,minmax(240px,1fr))',
  '.catalog-surface .catalog-card-title strong{font-size:1.08rem',
  '.catalog-surface .catalog-card-title span{font-size:.84rem',
  '.catalog-surface .catalog-status{padding:6px 9px;font-size:.68rem',
  '.catalog-surface .catalog-toolbar label>span{font-size:.7rem',
  '.catalog-surface .catalog-toolbar input,',
  '.catalog-production-filters span{font-size:.79rem',
  '.catalog-production-state span{padding:8px 4px 8px 13px;font-size:.68rem',
  '.catalog-next-action>div>strong{margin-top:4px;font-size:.94rem',
  '.catalog-next-action>div>small{margin-top:4px;font-size:.75rem',
  '.catalog-continue-btn{min-height:40px;padding-inline:14px;font-size:.78rem',
  '@media(min-width:1280px)',
  '@media(max-width:720px)',
]) assert.ok(css.includes(marker), `Build 55 readability layer is missing ${marker}.`);

assert.ok(!css.includes('aspect-ratio:'), 'Build 55 must not crop or reshape canonical square cover art.');
assert.ok(!css.includes('object-fit:'), 'Build 55 must not override canonical cover rendering.');
assert.ok(!css.includes('display:none'), 'Build 55 readability corrective must not hide production information.');
assert.ok(!css.includes('visibility:hidden'), 'Build 55 readability corrective must not hide production information.');

for (const protectedCatalog of [
  'buildCatalogWorkflow(tracks)',
  "useState<ProductionFilter>('to-finish')",
  'trackHref(track.id, workflow.nextAction.section)',
  '<TrackCreatePanel privateRead={privateRead}',
]) assert.ok(catalog.includes(protectedCatalog), `Build 55 must preserve Build 54 production behavior: ${protectedCatalog}.`);

for (const protectedWorkflow of [
  'export function buildCatalogWorkflow',
  'track.assets.audio',
  'track.assets.cover',
  'track.assets.lyricsTxt',
  'track.publishing.publishable',
]) assert.ok(workflow.includes(protectedWorkflow), `Build 55 must not replace Phase 7-A readiness authority: ${protectedWorkflow}.`);

console.log(`Studio Focus Build 55 ancestry passed under ${version} Build ${build}: denser covers and larger artist-facing Tracks copy remain intact while successor presentation fixes evolve.`);
