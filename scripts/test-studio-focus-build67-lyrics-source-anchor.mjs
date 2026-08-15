import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const css = read('src/studio-focus-build66-assets.css');

assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6'].includes(pkg.version), 'Build67 guard only accepts the validated v0.19.3-v0.19.6 Studio successor line.');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6)'/);
assert.match(release, /build:\s*67/);
assert.match(release, /codename:\s*'studio-focus-slice4-lyrics-source-anchor'/);
if (/build:\s*(?:82|83|84)/.test(release)) assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
if (/build:\s*(?:83|84)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*84/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84 must preserve accepted Build83 Phase9 ancestry.');

for (const required of [
  'workspace-lyrics-source-anchor',
  "kinds={['lyrics']}",
  'title="Lyrics TXT"',
  'This source control stays in the same place before and after upload.',
  'Master audio required for synchronization',
  "trackHref(track.id, 'overview')",
  'Add master audio →',
]) assert.ok(workspace.includes(required), `Build 67 TrackWorkspace is missing ${required}.`);

const sourceIndex = workspace.indexOf('workspace-lyrics-source-anchor');
const syncIndex = workspace.indexOf('<WorkspacePanel eyebrow="LYRICS / STUDIO"');
const detailsIndex = workspace.indexOf('<details className="workspace-lyrics-plain">');
assert.ok(sourceIndex >= 0 && syncIndex >= 0 && detailsIndex >= 0, 'Build 67 Lyrics structure markers must exist.');
assert.ok(sourceIndex < syncIndex, 'Canonical Lyrics source control must render before synchronization UI.');
assert.ok(sourceIndex < detailsIndex, 'Canonical Lyrics source control must render outside and before the secondary plain-text editor disclosure.');
assert.ok(workspace.includes("{track.assets.lyricsTxt && (\n            <details className=\"workspace-lyrics-plain\">"), 'Plain-text editor disclosure must only exist once canonical lyrics.txt is present.');

for (const required of [
  '.workspace-lyrics-source-anchor',
  '.workspace-lyrics-plain>.phase4-assets-manager,.workspace-lyrics-plain>.lyrics-sync-prerequisite{display:none!important}',
]) assert.ok(css.includes(required), `Build 67 CSS is missing ${required}.`);

assert.ok(lyrics.includes('const sourceManager = ('), 'Build 66 guarded Lyrics source implementation remains available for compatibility.');
assert.ok(!workspace.includes('uploadAdminTrackAsset'), 'TrackWorkspace must not own asset transport writes.');
assert.ok(!workspace.includes('deleteAdminTrackAsset'), 'TrackWorkspace must not own destructive asset transport writes.');

console.log(`Studio ${pkg.version} Build67 guard passed through the bounded v0.19.6 Phase9 successor: Lyrics TXT remains the permanent top-level source control before sync.`);
