import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const storage = read('src/release-campaign-storage.ts');
const styles = read('src/release-campaign.css');
const main = read('src/main.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.(?:16|17|18|19)\.\d+$/, 'Native Release Campaign successors must remain on an explicitly authorized Studio release line.');
assert.ok(build >= 48, `Native Release Campaign successor must preserve Build 48 or later, got Build ${build}.`);
assert.ok(codename.startsWith('phase7-') || codename.startsWith('studio-focus-'), `Native Release Campaign successor must remain inside Phase 7 or the authorized Studio Focus presentation lineage, got ${codename}.`);
assert.equal(pkg.version, version, 'package.json must match Studio release version.');
assert.equal(pkg.dependencies.jszip, '3.10.1');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-native-release-campaign-build48.mjs'));
assert.ok(main.includes("import './release-campaign.css';"));

assert.ok(panel.includes('MASTER → coherent formats'), 'Native Release Campaign hero must replace the standalone TTM handoff UX.');
assert.ok(panel.includes('Import MASTER 16:9'));
assert.ok(panel.includes('Copy coherent 1:1 prompt'));
assert.ok(panel.includes('Copy coherent 9:16 prompt'));
assert.ok(panel.includes('Download MASTER reference'));
assert.ok(panel.includes('Export complete Release Campaign ZIP'));
assert.ok(panel.includes('browser-local'), 'Browser-local/non-canonical truthfulness must remain visible.');
assert.ok(panel.includes('canonicalWrite: false'), 'Export manifest must explicitly remain non-canonical.');
assert.ok(panel.includes('indexedDB') === false, 'Persistence implementation should stay isolated from the UI component.');
assert.ok(panel.includes("buildVariantPrompt(track, '1:1')"));
assert.ok(panel.includes("buildVariantPrompt(track, '9:16')"));

assert.ok(engine.includes('REFERENCE IMAGE REQUIRED: attach the accepted MASTER 16:9 artwork as the primary image reference'), 'Anchored derivative prompts must explicitly require the MASTER reference.');
assert.ok(engine.includes("format === '1:1'"));
assert.ok(engine.includes('vertical 9:16'));
assert.ok(engine.includes('not a new cover inspired by it'), 'Variant prompt must forbid campaign redesign/drift.');
assert.ok(engine.includes('campaignReady'));
assert.ok(engine.includes("inspectAspect(draft.square, '1:1')"));
assert.ok(engine.includes("inspectAspect(draft.vertical, '9:16')"));

assert.ok(storage.includes("indexedDB.open(DB_NAME, DB_VERSION)"), 'Native campaign must preserve refreshes through browser-local IndexedDB drafts.');
assert.ok(styles.includes('.rc-review-grid'), 'Three-format review grid must be styled.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'Native campaign UI must retain reduced-motion handling.');

for (const forbidden of [
  'studioConfig.trackToMarketUrl',
  'shinobiwan:track-to-market:ready',
  'shinobiwan:track-to-market:pack',
  'uploadTrackAsset',
  'replaceTrackAsset',
  'deleteTrackAsset',
  'saveTrackMetadata',
  'phase4-admin-api',
  'admin-api',
  'fetch(',
]) assert.ok(!panel.includes(forbidden), `Native Release Campaign must not depend on standalone bridge or canonical write surface: ${forbidden}`);

console.log(`Build 48 native Release Campaign contract preserved through Studio ${version} Build ${build}: MASTER→anchored 1:1/9:16, browser-local persistence, ZIP export and no-write boundaries survive Studio Focus.`);
