import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const styles = read('src/release-campaign.css');
const main = read('src/main.tsx');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.(?:16|17|18|19)\.\d+$/, 'Release handoff successors must remain on an explicitly authorized Studio release line.');
assert.ok(build >= 48, `Release handoff successor must preserve Build 48 or later, got Build ${build}.`);
assert.ok(codename.startsWith('phase7-') || codename.startsWith('studio-focus-'), `Release handoff successor must remain inside Phase 7 or Studio Focus lineage, got ${codename}.`);
assert.equal(pkg.version, version, 'package.json must match Studio release version.');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-native-release-campaign-build48.mjs'));
assert.ok(main.includes("import './release-campaign.css';"));

for (const marker of [
  'Prompts ready for Flow',
  'Copy 16:9 prompt',
  'Copy 1:1 prompt',
  'Copy 9:16 prompt',
  'Open Google Flow ↗',
  "buildVariantPrompt(track, '1:1')",
  "buildVariantPrompt(track, '9:16')",
]) assert.ok(panel.includes(marker), `Build111 Release handoff is missing ${marker}.`);

for (const marker of [
  'REFERENCE IMAGES REQUIRED: attach the accepted MASTER 16:9 artwork as the primary composition reference',
  'official SHINOBIWAN logo as the branding reference',
  'not a new cover inspired by it',
]) assert.ok(engine.includes(marker), `Anchored derivative contract is missing ${marker}.`);

for (const obsolete of [
  'JSZip',
  'Import MASTER 16:9',
  'Import returned 1:1',
  'Import returned 9:16',
  'Export complete Release Campaign ZIP',
  'Campaign Review',
  'Platform text',
  'logoInput',
  'masterInput',
  'squareInput',
  'verticalInput',
]) assert.ok(!panel.includes(obsolete), `Build111 must retire obsolete Release Campaign UI: ${obsolete}`);

assert.ok(!('jszip' in (pkg.dependencies || {})), 'Build111 must remove obsolete ZIP packaging dependency.');
assert.ok(!fs.existsSync('src/release-campaign-storage.ts'), 'Build111 must retire obsolete browser-local image campaign storage.');
assert.ok(!styles.includes('.rc-review-grid'), 'Three-image review grid must not survive Build111.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'Release handoff must retain reduced-motion handling.');

for (const forbidden of [
  'studioConfig.trackToMarketUrl',
  'uploadTrackAsset',
  'replaceTrackAsset',
  'deleteTrackAsset',
  'saveTrackMetadata',
  'phase4-admin-api',
  'admin-api',
  'fetch(',
]) assert.ok(!panel.includes(forbidden), `Release handoff must preserve the no-canonical-write boundary: ${forbidden}`);

console.log(`Build 48 Release Campaign ancestry survives Studio ${version} Build ${build}: MASTER→anchored 1:1/9:16 and no-write boundaries remain while obsolete local image packaging is retired.`);
