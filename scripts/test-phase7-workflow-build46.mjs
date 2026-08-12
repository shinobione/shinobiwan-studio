import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const app = read('src/App.tsx');
const router = read('src/router.ts');
const types = read('src/types/studio.ts');
const workflow = read('src/phase7-workflow.ts');
const view = read('src/components/WorkflowView.tsx');
const styles = read('src/phase7-workflow.css');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';

assert.ok(build >= 46, 'Phase 7-A ancestry requires Studio Build 46 or a later successor.');
if (build === 46) {
  assert.equal(version, '0.16.0', 'Phase 7-A Build 46 version mismatch.');
  assert.equal(codename, 'phase7-a-workflow-overview', 'Phase 7-A Build 46 codename mismatch.');
} else {
  assert.match(codename, /^phase7-/, 'A post-Build-46 successor must remain on the Phase 7 lineage.');
}
assert.equal(pkg.version, version, 'package.json must match Studio release version.');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-workflow-build46.mjs'), 'Phase 7-A ancestry guard must stay wired into package scripts.');
assert.ok(pkg.scripts.build.includes('check:phase7'), 'Production build must execute the Phase 7 guards.');

assert.ok(types.includes("| 'workflow'"), 'StudioRoute must include workflow.');
assert.ok(router.includes("'workflow',"), 'Router must recognize #/workflow.');
assert.ok(app.includes("{ route: 'workflow', label: 'Workflow'"), 'Workflow must have a first-class Studio navigation entry.');
assert.ok(app.includes("{route === 'workflow' && <WorkflowView />}"), 'App must render the Phase 7 Workflow view.');
assert.ok(app.includes('PHASE 7-'), 'Studio shell must remain visibly on the Phase 7 lineage.');

for (const marker of [
  "type WorkflowStageId = 'identity' | 'media' | 'lyrics' | 'intelligence' | 'release'",
  'track.assets.audio',
  'track.assets.cover',
  'track.assets.lyricsTxt',
  'track.timestampsAvailable',
  'track.audioIntelligence.available',
  'track.audioIntelligence.outdated',
  'track.publishing.publishable',
  'track.publishing.catalogVisible',
  'export function buildTrackWorkflow',
  'export function buildCatalogWorkflow',
]) assert.ok(workflow.includes(marker), `Phase 7 workflow model is missing ${marker}.`);

assert.ok(view.includes("import { getCatalogTracks } from '../services/catalog-api'"), 'Phase 7-A must read the existing canonical catalog service.');
assert.ok(view.includes('trackHref(track.id, item.nextAction.section)'), 'Next Action must deep-link to the existing guarded Track Workspace.');
assert.ok(view.includes('This first Phase 7 slice is read-only'), 'Phase 7-A read-only boundary must remain explicit in the user surface.');
assert.ok(view.includes('no writes'), 'Workflow result line must retain the no-write boundary.');
assert.ok(styles.includes('.phase7-stage.state-blocked'), 'Blocked workflow stages need explicit styling.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'Phase 7-A must inherit reduced-motion accessibility.');

const forbiddenImports = [
  'updateTrackMetadata',
  'uploadTrackAsset',
  'deleteTrackAsset',
  'saveSonicTrace',
  'createAdminTrack',
  'rebuildCatalog',
  'updateAlbum',
];
for (const symbol of forbiddenImports) {
  assert.ok(!view.includes(symbol), `Phase 7-A Workflow must not import mutation surface ${symbol}.`);
  assert.ok(!workflow.includes(symbol), `Phase 7-A readiness model must not import mutation surface ${symbol}.`);
}

assert.doesNotMatch(view, /fetch\s*\(/, 'Phase 7-A view must not issue direct HTTP requests.');
assert.doesNotMatch(
  view,
  /method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i,
  'Phase 7-A view must not declare a write HTTP method.'
);
assert.doesNotMatch(
  workflow,
  /method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i,
  'Phase 7-A readiness model must not declare a write HTTP method.'
);

console.log('Studio Phase 7-A Build 46 workflow remains inherited, read-only, canonical and deep-linked under the current Phase 7 successor.');