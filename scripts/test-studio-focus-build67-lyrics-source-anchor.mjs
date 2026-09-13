import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const css = read('src/studio-focus-build66-assets.css');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(version, /^0\.19\.\d+$/, 'Build67 Lyrics source contract must remain on the validated 0.19.x Studio line.');
assert.ok(build >= 67, `Build67 contract requires Build67 or later, got Build ${build}.`);
assert.equal(pkg.version, version);
assert.ok(release.includes('build: 67'), 'Build67 ancestry marker must remain present.');
assert.ok(release.includes("codename: 'studio-focus-slice4-lyrics-source-anchor'"), 'Build67 accepted codename must remain immutable in ancestry.');
for (const acceptedBuild of [81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109]) {
  assert.ok(release.includes(`build${acceptedBuild}AncestryMarker`), `Build110 successor must preserve accepted Build${acceptedBuild} ancestry marker.`);
}

for (const required of [
  'workspace-lyrics-source-anchor',
  "kinds={['lyrics']}",
  'title="Lyrics TXT"',
  'This source control stays in the same place before and after upload.',
  'Master audio required for synchronization',
  "trackHref(track.id, 'overview')",
  'Add master audio →',
]) assert.ok(workspace.includes(required), `Build67 TrackWorkspace is missing ${required}.`);

const sourceIndex = workspace.indexOf('workspace-lyrics-source-anchor');
const syncIndex = workspace.indexOf('<WorkspacePanel eyebrow="LYRICS / STUDIO"');
const detailsIndex = workspace.indexOf('<details className="workspace-lyrics-plain">');
assert.ok(sourceIndex >= 0 && syncIndex >= 0 && detailsIndex >= 0, 'Build67 Lyrics structure markers must exist.');
assert.ok(sourceIndex < syncIndex, 'Canonical Lyrics source control must render before synchronization UI.');
assert.ok(sourceIndex < detailsIndex, 'Canonical Lyrics source control must render outside and before the secondary plain-text editor disclosure.');
assert.ok(workspace.includes("{track.assets.lyricsTxt && (\n            <details className=\"workspace-lyrics-plain\">"), 'Plain-text editor disclosure must only exist once canonical lyrics.txt is present.');

for (const required of [
  '.workspace-lyrics-source-anchor',
  '.workspace-lyrics-plain>.phase4-assets-manager,.workspace-lyrics-plain>.lyrics-sync-prerequisite{display:none!important}',
]) assert.ok(css.includes(required), `Build67 CSS is missing ${required}.`);

assert.ok(lyrics.includes('const sourceManager = ('), 'Build66 guarded Lyrics source implementation remains available for compatibility.');
assert.ok(!workspace.includes('uploadAdminTrackAsset'), 'TrackWorkspace must not own asset transport writes.');
assert.ok(!workspace.includes('deleteAdminTrackAsset'), 'TrackWorkspace must not own destructive asset transport writes.');

console.log(`Studio ${pkg.version} Build67 guard passed through Build${build}: Lyrics TXT remains the permanent top-level source control before sync.`);
