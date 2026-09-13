import assert from 'node:assert/strict';
import fs from 'node:fs';

const release = fs.readFileSync('src/release.ts', 'utf8');
const health = fs.readFileSync('src/content-health.ts', 'utf8');
const home = fs.readFileSync('src/components/FocusHome.tsx', 'utf8');
const workflowView = fs.readFileSync('src/components/WorkflowView.tsx', 'utf8');
const router = fs.readFileSync('src/router.ts', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const css = fs.readFileSync('src/phase8-content-health.css', 'utf8');

assert.match(release, /build:\s*(?:75|76|77|78|79|110)/);
assert.ok(
  release.includes("codename: 'studio-focus-slice4-phase8-health-drilldown'")
  || release.includes("codename: 'studio-focus-slice4-phase8-album-health-truth'")
  || release.includes("codename: 'studio-focus-slice4-phase8-album-health-visual-polish'")
  || release.includes("codename: 'studio-focus-slice4-phase8-album-health-cache-drift-human-ux'")
  || release.includes("codename: 'studio-focus-slice4-phase8-album-publish-truth'")
  || release.includes("codename: 'studio-focus-build110-human-first-premium-ux'"),
);
assert.ok(release.includes('build74AncestryMarker'));
if (/build:\s*(?:76|77|78|79|110)/.test(release)) assert.ok(release.includes('build75AncestryMarker'));
if (/build:\s*(?:77|78|79|110)/.test(release)) assert.ok(release.includes('build76AncestryMarker'));
if (/build:\s*(?:78|79|110)/.test(release)) assert.ok(release.includes('build77AncestryMarker'));
if (/build:\s*(?:79|110)/.test(release)) assert.ok(release.includes('build78AncestryMarker'));

assert.ok(health.includes('export type CatalogHealthDrilldownId'));
assert.ok(health.includes('export function catalogHealthDrilldownMatches'));
assert.ok(health.includes('export function catalogHealthDrilldownLabel'));
for (const id of [
  'audio','cover','lyricsTxt','syncedLyrics','sonicTrace','releaseQuality','publishedProductionGaps','productionReadyDrafts',
]) {
  assert.ok(health.includes(`'${id}'`), `health drill-down id ${id}`);
  assert.ok(router.includes(`'${id}'`), `router allowlist id ${id}`);
}
assert.ok(health.includes("item.track.status === 'published' && item.track.publishing.catalogVisible && !isProductionWorkflowReady(item)"));
assert.ok(health.includes("item.track.status !== 'published' && isProductionWorkflowReady(item)"));
assert.ok(!health.includes('saveTrack('));
assert.ok(!health.includes('fetch('));
assert.ok(router.includes('WORKFLOW_HEALTH_DRILLDOWNS'));
assert.ok(router.includes('readWorkflowHealthDrilldown'));
assert.ok(router.includes('workflowHref'));
assert.ok(router.includes("`#/workflow/health/${drilldown}`"));
assert.ok(home.includes('workflowHref(signal.id)'));
assert.ok(home.includes("workflowHref('publishedProductionGaps')"));
assert.ok(home.includes("workflowHref('productionReadyDrafts')"));
assert.ok(home.includes('Review all ${count} affected tracks →'));
assert.ok(home.includes('Each Phase8 drill-down opens the existing Workflow queue'));
assert.ok(home.includes('workflow.nextAction'));
assert.ok(!home.includes('saveTrack('));
assert.ok(workflowView.includes('catalogHealthDrilldownMatches'));
assert.ok(workflowView.includes('catalogHealthDrilldownLabel'));
assert.ok(workflowView.includes('readWorkflowHealthDrilldown'));
assert.ok(workflowView.includes("setFilter(next ? 'all' : 'attention')"));
assert.ok(workflowView.includes("addEventListener('hashchange', syncHealthDrilldown)"));
assert.ok(workflowView.includes(".filter(item => !healthDrilldown || catalogHealthDrilldownMatches(item, healthDrilldown))"));
assert.ok(workflowView.includes('PHASE 8 / HEALTH DRILL-DOWN'));
assert.ok(workflowView.includes('Clear health filter ×'));
assert.ok(workflowView.includes('same Workflow stages and accepted Next Actions'));
assert.ok(workflowView.includes('item.nextAction.label'));
assert.ok(workflowView.includes('item.nextAction.section'));
assert.ok(!workflowView.includes('saveTrack('));
assert.match(app, /const SUPPORTED_PRIVATE_READ_LINEAGE = 'Track Manager v\d+\.\d+ · bridge v\d+\.\d+';/, 'Health drilldown must coexist with an explicit supported private-read lineage without pinning this historical guard to one backend patch.');
assert.ok(app.includes('payload.trackManagerVersion') && app.includes('payload.bridgeVersion'), 'Health drilldown shell must prefer live backend lineage when available.');
assert.ok(
  app.includes('<span className="phase-tag">PHASE 8</span>')
  || app.includes('<span className="phase-tag">PHASE {studioRelease.phase}</span>')
  || app.includes('className="studio-shell build110-human-first"'),
);
assert.ok(
  app.includes('Content health + guided actions')
  || app.includes('{studioRelease.summary}')
  || app.includes('v{studioRelease.version} · {studioRelease.build}'),
);
assert.ok(css.includes('.focus-health-axis-link'));
assert.ok(css.includes('.phase8-health-drilldown'));

console.log('Phase 8 Build75 health drill-down checks passed through the human-first Studio successor with backend patch lineage allowed to evolve.');
