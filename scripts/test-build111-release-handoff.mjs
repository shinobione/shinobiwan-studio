import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const panel = read('src/components/TrackToMarketPanel.tsx');
const engine = read('src/release-campaign.ts');
const css = read('src/release-campaign.css');

assert.equal(pkg.version, '0.19.33', 'Build111 must publish Studio v0.19.33.');
assert.match(release, /version:\s*'0\.19\.33'/);
assert.match(release, /build:\s*111/);
assert.match(release, /phase:\s*10/);
assert.match(release, /studio-focus-build111-release-handoff/);
assert.match(release, /build110AncestryMarker/);
assert.ok(!('jszip' in (pkg.dependencies || {})), 'Build111 must not keep ZIP packaging dependency.');
assert.equal(fs.existsSync('src/release-campaign-storage.ts'), false, 'Build111 must remove obsolete browser-local campaign storage.');

for (const required of [
  'RELEASE / VISUAL HANDOFF',
  'Prompts ready for Flow',
  'Logo reference is mandatory in every visual prompt',
  'Copy 16:9 prompt',
  'Copy 1:1 prompt',
  'Copy 9:16 prompt',
  'Optional Spotify Canvas / 8s loop prompt',
  'Open Google Flow ↗',
]) assert.ok(panel.includes(required), `Build111 Release handoff is missing ${required}.`);

for (const required of [
  'BRANDING REFERENCE REQUIRED: attach the official SHINOBIWAN logo file as an image reference with this prompt.',
  'Integrate the logo naturally into the visual world',
  'The logo must always remain clearly smaller and visually subordinate to the exact track title',
  'REFERENCE IMAGES REQUIRED: attach the accepted MASTER 16:9 artwork as the primary composition reference and attach the official SHINOBIWAN logo as the branding reference.',
  'keep the logo smaller than the title throughout',
]) assert.ok(engine.includes(required), `Build111 permanent branding contract is missing ${required}.`);

for (const obsolete of [
  'JSZip',
  'logoInput',
  'masterInput',
  'squareInput',
  'verticalInput',
  'Import MASTER 16:9',
  'Import returned 1:1',
  'Import returned 9:16',
  'Campaign Review',
  'Platform text',
  'SoundCloud · max 140',
  'Tags · comma separated',
  'Export complete Release Campaign ZIP',
  'Export partial campaign ZIP',
  'release-campaign-storage',
  'buildReleaseCopy',
]) assert.ok(!panel.includes(obsolete), `Build111 must remove obsolete Release Campaign surface: ${obsolete}`);

for (const obsoleteCss of ['.rc-preview', '.rc-review-grid', '.rc-copy-card', '.rc-export-card']) {
  assert.ok(!css.includes(obsoleteCss), `Build111 CSS must remove obsolete campaign surface ${obsoleteCss}.`);
}
assert.ok(css.includes('.rc-prompt-grid'), 'Build111 must style the compact 1:1 / 9:16 prompt handoff grid.');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'), 'Build111 must preserve reduced-motion behavior.');

for (const forbidden of ['fetch(', 'uploadTrackAsset', 'replaceTrackAsset', 'deleteTrackAsset', 'saveTrackMetadata', 'admin-api', 'phase4-admin-api']) {
  assert.ok(!panel.includes(forbidden), `Build111 Release handoff must remain read-only/non-canonical: ${forbidden}`);
}

console.log('Build111 Release handoff PASS: Flow-first prompts, permanent SHINOBIWAN logo hierarchy, no redundant image re-import, no ZIP, no duplicate platform-copy generator.');
