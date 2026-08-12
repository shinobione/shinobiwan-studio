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

assert.match(release, /version:\s*'0\.16\.0'/, 'Phase 7-A must publish on Studio 0.16.x.');
assert.match(release, /build:\s*46/, 'Phase 7-A must be Build 46.');
assert.match(release, /codename:\s*'phase7-a-workflow-overview'/, 'Phase 7-A codename mismatch.');
assert.equal(pkg.version, '0.16.0', 'package.json must match Studio release version.');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-workflow-build46.mjs'), 'Phase 7 guard must be wired into package scripts.');
assert.ok(pkg.scripts.build.includes('check:phase7'), 'Production build must execute the Phase 7 guard.');

assert.ok(types.includes("| 'workflow'"), 'StudioRoute must include workflow.');
assert.ok(router.includes("'workflow',"), 'Router must recognize #/workflow.');
assert.ok(app.includes("{ route: 'workflow', label: 'Workflow'"), 'Workflow must have a first-class Studio navigation entry.');
assert.ok(app.includes("{route === 'workflow' && <WorkflowView />}"), 'App must render the Phase 7 Workflow view.');
assert.ok(app.includes('PHASE 7-A'), 'Studio shell must identify the Phase 7-A candidate.');

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
assert.ok(view.includes('This first Phase 7 slice is read-only'), 'Read-only boundary must be explicit in the user surface.');
assert.ok(view.includes('no writes'), 'Workflow result line must state the no-write boundary.');
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

console.log('Studio Phase 7-A Build 46 keeps workflow orchestration read-only, canonical and deep-linked to existing guarded specialist surfaces.');