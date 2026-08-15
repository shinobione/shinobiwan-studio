import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const adapter = read('src/legacy-track-type-display-auto.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');

assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6', '0.19.7', '0.19.8'].includes(pkg.version), 'Build65 guard only accepts the validated v0.19.3-v0.19.8 Studio successor line.');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6|7|8)'/);
assert.match(release, /build:\s*65/);
assert.match(release, /codename:\s*'studio-focus-slice4-lyrics-crash-corrective'/);
if (/build:\s*(?:82|83|84|85|86)/.test(release)) assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
if (/build:\s*(?:83|84|85|86)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*(?:84|85|86)/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84+ must preserve accepted Build83 Phase9 ancestry.');
if (/build:\s*(?:85|86)/.test(release)) assert.ok(release.includes('build84AncestryMarker'), 'Build85+ must preserve accepted Build84 Phase9 ancestry.');
if (/build:\s*86/.test(release)) assert.ok(release.includes('build85AncestryMarker'), 'Build86 must preserve accepted Build85 Phase9 ancestry.');

for (const required of [
  "heading.textContent?.trim() !== 'Add lyrics to begin'",
  'if (!details.open) details.open = true;',
  "summary.textContent?.trim() !== 'Add lyrics.txt / plain-text editor'",
  "summary.textContent = 'Add lyrics.txt / plain-text editor';",
  'installBuild65MissingLyricsPresentation',
]) assert.ok(adapter.includes(required), `Build 65 missing-lyrics adapter is missing ${required}.`);

assert.equal((adapter.match(/summary\.textContent\s*=\s*'Add lyrics\.txt \/ plain-text editor'/g) || []).length, 1, 'Build 65 must have one summary text mutation only.');
assert.ok(!adapter.includes("if (summary) summary.textContent = 'Add lyrics.txt / plain-text editor';"), 'Build 64 unconditional summary mutation must never return.');
assert.match(adapter, /if \(summary && summary\.textContent\?\.trim\(\) !== 'Add lyrics\.txt \/ plain-text editor'\) \{\s*summary\.textContent = 'Add lyrics\.txt \/ plain-text editor';\s*\}/, 'Summary mutation must stay guarded by an exact value comparison.');

for (const required of [
  "kinds={['lyrics']}",
  'title="Add lyrics.txt"',
  'existing guarded Track asset operation',
]) assert.ok(lyrics.includes(required), `Guarded lyrics upload path is missing ${required}.`);

assert.ok(!adapter.includes('fetch('), 'Presentation adapter must not add network reads.');
assert.ok(!adapter.includes('saveAdminTrackMetadata'), 'Presentation adapter must not add canonical writes.');
assert.ok(!adapter.includes('uploadAdminTrackAsset'), 'Presentation adapter must not own asset writes.');

console.log(`Studio ${pkg.version} Build65 guard passed through the bounded v0.19.8 Phase9 successor: missing-lyrics presentation remains idempotent and AssetsManager owns guarded TXT upload.`);
