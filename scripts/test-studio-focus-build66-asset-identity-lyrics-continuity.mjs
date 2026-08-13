import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const css = read('src/studio-focus-build66-assets.css');
const main = read('src/main.tsx');

assert.equal(pkg.version, '0.19.3');
assert.match(release, /build:\s*66/);
assert.match(release, /codename:\s*'studio-focus-slice4-asset-identity-lyrics-continuity'/);

for (const required of [
  'const sourceManager = (',
  "kinds={['lyrics']}",
  'Canonical lyrics.txt is present.',
  'Master audio required for synchronization',
  "trackHref(track.id, 'overview')",
  'Add master audio →',
]) assert.ok(lyrics.includes(required), `Build 66 Lyrics continuity is missing ${required}.`);

for (const required of [
  'Master audio · playback + lyrics timing',
  'Main artwork · primary cover',
  'Small preview · max 2 MB · not the main cover',
  'Canonical source · lyrics.txt',
  'Video / Canvas · motion artwork',
  '.workspace-lyrics-plain>.phase4-assets-manager{display:block!important',
  '.workspace-lyrics-plain>.lyrics-sync-prerequisite{display:flex!important',
]) assert.ok(css.includes(required), `Build 66 asset identity CSS is missing ${required}.`);

assert.ok(main.includes("import './studio-focus-build66-assets.css';"), 'Build 66 CSS must be loaded after the inherited Studio Focus styles.');
assert.ok(!lyrics.includes('uploadAdminTrackAsset'), 'Lyrics continuity presentation must not own asset transport writes.');
assert.ok(!lyrics.includes('deleteAdminTrackAsset'), 'Lyrics continuity presentation must not own asset deletion writes.');

console.log('Studio v0.19.3 Build 66 guard passed: asset roles are visually distinct, Lyrics source controls persist, and missing master audio is explicit without changing write authority.');
