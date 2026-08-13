import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const app = read('src/App.tsx');
const home = read('src/components/FocusHome.tsx');
const focusCss = read('src/studio-focus.css');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const main = read('src/main.tsx');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.(?:17|18|19)\.\d+$/);
assert.ok(build >= 53, `Studio Focus shell successor must remain Build 53 or later, got ${build}.`);
assert.ok(codename.startsWith('studio-focus-'), `Studio Focus successor codename must remain explicit, got ${codename}.`);
assert.equal(pkg.version, version);

for (const marker of [
  "{ route: 'dashboard', label: 'Home', glyph: '⌂' }",
  "{ route: 'catalog', label: 'Tracks', glyph: '♫' }",
  "{ route: 'albums', label: 'Albums', glyph: '▣' }",
  'const ADVANCED_NAV',
  "{ route: 'workflow', label: 'Workflow', glyph: '↳' }",
  "{ route: 'intelligence', label: 'Intelligence', glyph: '◇' }",
  "{ route: 'administration', label: 'System', glyph: '⌘' }",
  '<FocusHome />',
  'focus-advanced-nav',
]) assert.ok(app.includes(marker), `Studio Focus shell is missing ${marker}.`);

assert.ok(!app.includes("{ route: 'dashboard', label: 'Dashboard'"), 'Dashboard must not return as a daily navigation label.');
assert.ok(app.includes("route === 'workflow' && <WorkflowView />"), 'Detailed Phase 7 workflow must remain available behind Advanced.');
assert.ok(app.includes("route === 'intelligence' && <CatalogIntelligenceView />"), 'Catalog Intelligence must remain available behind Advanced.');
assert.ok(app.includes('Track Manager remains the protected write authority'), 'System fallback authority wording must remain intact.');

for (const marker of [
  'Make the track. Finish the release.',
  '+ New Track',
  'CONTINUE WHERE YOU LEFT OFF',
  'What needs attention',
  'buildCatalogWorkflow(tracks)',
  'getCatalogTracks()',
  '<TrackCreatePanel privateRead={privateRead}',
  "globalThis.localStorage?.getItem(LAST_TRACK_KEY)",
]) assert.ok(home.includes(marker), `Production-first Home is missing ${marker}.`);

assert.ok(!home.includes('writeTrack'), 'Focus Home must not gain a direct Track write path.');
assert.ok(!home.includes('fetch('), 'Focus Home must use validated service adapters instead of ad-hoc network writes.');
assert.ok(main.includes("import './studio-focus.css';"), 'Studio Focus CSS must remain loaded after the validated baseline styles.');
assert.ok(focusCss.includes('.focus-advanced-nav'), 'Advanced progressive disclosure styling is missing.');
assert.ok(focusCss.includes('.focus-continue'), 'Continue surface styling is missing.');

console.log(`Studio Focus Build 53 ancestry passed under ${version} Build ${build}: production-first shell/Home remain intact while successor slices evolve artist-facing surfaces.`);
