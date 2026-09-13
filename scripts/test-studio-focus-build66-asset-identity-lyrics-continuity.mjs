import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const css = read('src/studio-focus-build66-assets.css');
const main = read('src/main.tsx');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(version, /^0\.19\.\d+$/, 'Build66 asset/Lyrics contract must remain on the validated 0.19.x Studio line.');
assert.ok(build >= 66, `Build66 contract requires Build66 or later, got Build ${build}.`);
assert.equal(pkg.version, version);
assert.ok(release.includes('build: 66'), 'Build66 ancestry marker must remain present.');
assert.ok(release.includes("codename: 'studio-focus-slice4-asset-identity-lyrics-continuity'"), 'Build66 accepted codename must remain immutable in ancestry.');
for (const acceptedBuild of [81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109]) {
  assert.ok(release.includes(`build${acceptedBuild}AncestryMarker`), `Build110 successor must preserve accepted Build${acceptedBuild} ancestry marker.`);
}

for (const required of [
  'const sourceManager = (',
  "kinds={['lyrics']}",
  'Canonical lyrics.txt is present.',
  'Master audio required for synchronization',
  "trackHref(track.id, 'overview')",
  'Add master audio →',
]) assert.ok(lyrics.includes(required), `Build66 Lyrics continuity is missing ${required}.`);

for (const required of [
  'Master audio · playback + lyrics timing',
  'Main artwork · primary cover',
  'Small preview · max 2 MB · not the main cover',
  'Canonical source · lyrics.txt',
  'Video / Canvas · motion artwork',
  '.workspace-lyrics-plain>.phase4-assets-manager{display:block!important',
  '.workspace-lyrics-plain>.lyrics-sync-prerequisite{display:flex!important',
]) assert.ok(css.includes(required), `Build66 asset identity CSS is missing ${required}.`);

assert.ok(main.includes("import './studio-focus-build66-assets.css';"), 'Build66 CSS must be loaded after the inherited Studio Focus styles.');
assert.ok(!lyrics.includes('uploadAdminTrackAsset'), 'Lyrics continuity presentation must not own asset transport writes.');
assert.ok(!lyrics.includes('deleteAdminTrackAsset'), 'Lyrics continuity presentation must not own asset deletion writes.');

console.log(`Studio ${pkg.version} Build66 guard passed through Build${build}: asset roles, Lyrics source continuity and write ownership remain intact.`);
