import assert from 'node:assert/strict';
import fs from 'node:fs';

const release = fs.readFileSync('src/release.ts', 'utf8');
const health = fs.readFileSync('src/content-health.ts', 'utf8');
const home = fs.readFileSync('src/components/FocusHome.tsx', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const css = fs.readFileSync('src/phase8-content-health.css', 'utf8');
const workflow = fs.readFileSync('src/phase7-workflow.ts', 'utf8');

assert.match(release, /build:\s*74/);
assert.match(release, /codename:\s*'studio-focus-slice4-phase8-content-health-truth'/);
assert.ok(release.includes('build73AncestryMarker'));

// Build73 truth: Canvas is optional and must not reduce production readiness.
assert.ok(!health.includes("item('video'"));
assert.ok(!health.includes("'Canvas / Video'"));
assert.ok(health.includes("item('cover', 'Cover', track.assets.cover ? 20 : 0, 20"));
assert.ok(health.includes('Canvas is optional and therefore contributes no score and no attention item.'));
assert.ok(health.includes('Identity 20 + Core media 40 + Lyrics 20 + Intelligence 20'));

// Identity health mirrors the accepted workflow prerequisites, not an old metadata wish-list.
assert.ok(health.includes('Boolean(track.type.trim())'));
assert.ok(health.includes('Boolean(track.status.trim())'));
assert.ok(health.includes('Boolean(track.album?.id && track.album?.title)'));
assert.ok(health.includes('track.year == null || (track.year >= 1900 && track.year <= 2200)'));
assert.ok(!health.includes('track.genres.length > 0'));
assert.ok(!health.includes('track.languages.length > 0'));

// Production completion deliberately excludes the Release/publication stage.
assert.ok(health.includes("filter(stage => stage.id !== 'release')"));
assert.ok(health.includes('publishedProductionGaps'));
assert.ok(health.includes('productionReadyDrafts'));
assert.ok(workflow.includes("const priority: WorkflowStageId[] = ['identity', 'media', 'lyrics', 'intelligence', 'release']"));

// Global Phase8 health is read-only and routes through the accepted workflow Next Action.
for (const marker of [
  "signal('audio', 'Master audio missing'",
  "signal('cover', 'Cover missing'",
  "signal('lyricsTxt', 'Lyrics source missing'",
  "signal('syncedLyrics', 'Lyrics timing needed'",
  "signal('sonicTrace', 'SonicTrace gap'",
  "signal('releaseQuality', 'Release blockers'",
]) assert.ok(health.includes(marker), marker);
assert.ok(health.includes('label: item.nextAction.label'));
assert.ok(health.includes('section: item.nextAction.section'));
assert.ok(!health.includes('saveTrack('));
assert.ok(!health.includes('fetch('));

// Home keeps production and publication visibly separate and adds no duplicate workflow.
assert.ok(home.includes('buildCatalogContentHealth(tracks)'));
assert.ok(home.includes('PRODUCTION ATTENTION'));
assert.ok(home.includes('PRODUCTION COMPLETE'));
assert.ok(home.includes('Publication remains a separate decision'));
assert.ok(home.includes('Catalog health, without a second workflow'));
assert.ok(home.includes('Open existing Next Action →'));
assert.ok(home.includes('PUBLISHED WITH PRODUCTION GAPS'));
assert.ok(home.includes('PRODUCTION-READY DRAFTS'));
assert.ok(home.includes('workflow.nextAction'));
assert.ok(home.includes("item.nextAction.label === 'Publish track'"));
assert.ok(home.includes("item.nextAction.label === 'Fix Release'"));
assert.ok(!home.includes('saveTrack('));

assert.ok(main.includes("import './phase8-content-health.css';"));
assert.ok(css.includes('.focus-health-grid'));
assert.ok(css.includes('.focus-summary{grid-template-columns:repeat(4'));

console.log('Phase 8 Build74 content-health truth checks passed.');
