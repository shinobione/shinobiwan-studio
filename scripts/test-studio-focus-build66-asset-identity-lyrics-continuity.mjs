import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const css = read('src/studio-focus-build66-assets.css');
const main = read('src/main.tsx');

assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6', '0.19.7', '0.19.8', '0.19.9', '0.19.10', '0.19.11', '0.19.12', '0.19.13', '0.19.14'].includes(pkg.version), 'Build66 guard only accepts the validated v0.19.3-v0.19.14 Studio successor line.');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6|7|8|9|10|11|12|13|14)'/);
assert.match(release, /build:\s*66/);
assert.match(release, /codename:\s*'studio-focus-slice4-asset-identity-lyrics-continuity'/);
if (/build:\s*(?:82|83|84|85|86|87|88|89|90|91|92)/.test(release)) assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
if (/build:\s*(?:83|84|85|86|87|88|89|90|91|92)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*(?:84|85|86|87|88|89|90|91|92)/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84+ must preserve accepted Build83 Phase9 ancestry.');
if (/build:\s*(?:85|86|87|88|89|90|91|92)/.test(release)) assert.ok(release.includes('build84AncestryMarker'), 'Build85+ must preserve accepted Build84 Phase9 ancestry.');
if (/build:\s*(?:86|87|88|89|90|91|92)/.test(release)) assert.ok(release.includes('build85AncestryMarker'), 'Build86+ must preserve accepted Build85 Phase9 ancestry.');
if (/build:\s*(?:87|88|89|90|91|92)/.test(release)) assert.ok(release.includes('build86AncestryMarker'), 'Build87+ must preserve accepted Build86 Phase9 ancestry.');
if (/build:\s*(?:88|89|90|91|92)/.test(release)) assert.ok(release.includes('build87AncestryMarker'), 'Build88+ must preserve accepted Build87 Phase9 ancestry.');
if (/build:\s*(?:89|90|91|92)/.test(release)) assert.ok(release.includes('build88AncestryMarker'), 'Build89+ must preserve accepted Build88 Phase9 ancestry.');
if (/build:\s*(?:90|91|92)/.test(release)) assert.ok(release.includes('build89AncestryMarker'), 'Build90+ must preserve accepted Build89 Phase9 ancestry.');
if (/build:\s*(?:91|92)/.test(release)) assert.ok(release.includes('build90AncestryMarker'), 'Build91+ must preserve accepted Build90 Phase9 ancestry.');
if (/build:\s*92/.test(release)) assert.ok(release.includes('build91AncestryMarker'), 'Build92 must preserve accepted Build91 Phase9 ancestry.');

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

console.log(`Studio ${pkg.version} Build66 guard passed through the bounded v0.19.14 Phase9 successor: asset roles, Lyrics source continuity and write ownership remain intact.`);
