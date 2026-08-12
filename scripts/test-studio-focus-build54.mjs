import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const catalog = read('src/components/CatalogView.tsx');
const focusCss = read('src/studio-focus.css');
const workflow = read('src/phase7-workflow.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const releaseVersion = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const releaseBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(releaseVersion, /^0\.(?:17|18)\.\d+$/);
assert.ok(releaseBuild >= 54, 'Build 54 production-library ancestry must remain active in successor corrective builds.');
assert.ok(codename.startsWith('studio-focus-'), `Build 54 production-library ancestry must remain under Studio Focus, got ${codename}.`);
assert.equal(pkg.version, releaseVersion);
assert.ok(pkg.scripts['check:focus']?.includes('test-studio-focus-build54.mjs'), 'Build 54 guard must run in the Studio Focus chain.');

for (const marker of [
  'TRACKS / PRODUCTION LIBRARY',
  'Pick up a track. Finish the next thing.',
  "type ProductionFilter = 'to-finish' | 'ready' | 'released' | 'all'",
  "useState<ProductionFilter>('to-finish')",
  'buildCatalogWorkflow(tracks)',
  'To finish',
  'Ready',
  'Released',
  'Audio',
  'Cover',
  'Lyrics',
  'Canvas',
  'Release',
  'catalog-next-action',
  'catalog-continue-btn',
  'workflow.nextAction.section',
  '>+ New Track</button>',
]) assert.ok(catalog.includes(marker), `Build 54 Tracks production library is missing ${marker}.`);

assert.ok(catalog.includes('trackHref(track.id, workflow.nextAction.section)'), 'Continue must deep-link to the accepted workflow next action.');
assert.ok(catalog.includes('<TrackCreatePanel privateRead={privateRead}'), 'New Track must keep the existing guarded intake owner.');
assert.ok(!catalog.includes("type ContentFilter ="), 'Legacy implementation-oriented content filters must not remain in the daily Tracks surface.');
assert.ok(!catalog.includes('private canonical'), 'Daily Tracks result copy must not expose private-read implementation jargon when healthy.');
assert.ok(!catalog.includes('public fallback'), 'Daily Tracks result copy must not expose public-fallback implementation jargon when healthy.');
assert.ok(!catalog.includes('fetch('), 'Tracks must use the validated catalog service rather than direct network access.');

for (const marker of [
  '.catalog-production-filters',
  '.catalog-production-state',
  '.catalog-next-action',
  '.catalog-continue-btn',
  '@media(max-width:720px)',
]) assert.ok(focusCss.includes(marker), `Build 54 responsive Tracks styling is missing ${marker}.`);

for (const protectedWorkflow of [
  "type WorkflowStageId = 'identity' | 'media' | 'lyrics' | 'intelligence' | 'release'",
  'export function buildCatalogWorkflow',
  'track.assets.audio',
  'track.assets.cover',
  'track.assets.lyricsTxt',
  'track.timestampsAvailable',
  'track.audioIntelligence.available',
  'track.publishing.publishable',
]) assert.ok(workflow.includes(protectedWorkflow), `Build 54 must reuse the accepted Phase 7-A readiness model: ${protectedWorkflow}.`);

console.log(`Studio Focus Build 54 ancestry passed under ${releaseVersion} Build ${releaseBuild}: the production-first Tracks library and workflow-derived continuation remain intact.`);
