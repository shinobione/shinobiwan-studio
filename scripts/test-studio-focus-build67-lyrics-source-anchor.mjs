import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const lyrics = read('src/components/LyricsEditorPanel.tsx');
const css = read('src/studio-focus-build66-assets.css');

assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6', '0.19.7', '0.19.8', '0.19.9', '0.19.10', '0.19.11', '0.19.12', '0.19.13', '0.19.14'].includes(pkg.version), 'Build67 guard only accepts the validated v0.19.3-v0.19.14 Studio successor line.');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6|7|8|9|10|11|12|13|14)'/);
assert.match(release, /build:\s*67/);
assert.match(release, /codename:\s*'studio-focus-slice4-lyrics-source-anchor'/);
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

console.log(`Studio ${pkg.version} Build67 guard passed through the bounded v0.19.14 Phase9 successor: Lyrics TXT remains the permanent top-level source control before sync.`);
