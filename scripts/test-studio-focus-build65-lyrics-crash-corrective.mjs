import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
if (pkg.version === '0.19.22') assert.ok(read('src/release.ts').includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 Phase9 ancestry.');
if (['0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) assert.ok(read('src/release.ts').includes('build98AncestryMarker'), 'Build99 must preserve accepted Build98 Phase9 ancestry.');
const adapter = read('src/legacy-track-type-display-auto.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');

assert.ok(['0.19.3', '0.19.4', '0.19.5', '0.19.6', '0.19.7', '0.19.8', '0.19.9', '0.19.10', '0.19.11', '0.19.12', '0.19.13', '0.19.14', '0.19.15', '0.19.16', '0.19.17', '0.19.18', '0.19.19', '0.19.20', '0.19.21', '0.19.22', '0.19.23'].includes(pkg.version), 'Build65 guard only accepts the validated v0.19.3-v0.19.21 Studio successor line.');
assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23)'/);
assert.match(release, /build:\s*65/);
assert.match(release, /codename:\s*'studio-focus-slice4-lyrics-crash-corrective'/);
if (/build:\s*(?:82|83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
if (/build:\s*(?:83|84|85|86|87|88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*(?:84|85|86|87|88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84+ must preserve accepted Build83 Phase9 ancestry.');
if (/build:\s*(?:85|86|87|88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build84AncestryMarker'), 'Build85+ must preserve accepted Build84 Phase9 ancestry.');
if (/build:\s*(?:86|87|88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build85AncestryMarker'), 'Build86+ must preserve accepted Build85 Phase9 ancestry.');
if (/build:\s*(?:87|88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build86AncestryMarker'), 'Build87+ must preserve accepted Build86 Phase9 ancestry.');
if (/build:\s*(?:88|89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build87AncestryMarker'), 'Build88+ must preserve accepted Build87 Phase9 ancestry.');
if (/build:\s*(?:89|90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build88AncestryMarker'), 'Build89+ must preserve accepted Build88 Phase9 ancestry.');
if (/build:\s*(?:90|91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build89AncestryMarker'), 'Build90+ must preserve accepted Build89 Phase9 ancestry.');
if (/build:\s*(?:91|92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build90AncestryMarker'), 'Build91+ must preserve accepted Build90 Phase9 ancestry.');
if (/build:\s*(?:92|93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build91AncestryMarker'), 'Build92+ must preserve accepted Build91 Phase9 ancestry.');
if (/build:\s*(?:93|94|95|96|97|98)/.test(release)) assert.ok(release.includes('build92AncestryMarker'), 'Build93+ must preserve accepted Build92 Phase9 ancestry.');
if (/build:\s*(?:94|95|96|97|98)/.test(release)) assert.ok(release.includes('build93AncestryMarker'), 'Build94+ must preserve accepted Build93 Phase9 ancestry.');
if (/build:\s*(?:95|96|97|98)/.test(release)) assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 Phase9 ancestry.');
if (/build:\s*(?:96|97)/.test(release)) assert.ok(release.includes('build95AncestryMarker'), 'Build96+ must preserve accepted Build95 Phase9 ancestry.');
if (/build:\s*(?:97|98)/.test(release)) assert.ok(release.includes('build96AncestryMarker'), 'Build97+ must preserve accepted Build96 Phase9 ancestry.');
if (/build:\s*98/.test(release)) assert.ok(release.includes('build97AncestryMarker'), 'Build98 must preserve Build97 Phase9 ancestry.');

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

console.log(`Studio ${pkg.version} Build65 guard passed through the bounded v0.19.18 Phase9 successor: missing-lyrics presentation remains idempotent and AssetsManager owns guarded TXT upload.`);