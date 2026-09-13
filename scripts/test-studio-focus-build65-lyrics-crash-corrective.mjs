import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const adapter = read('src/legacy-track-type-display-auto.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
assert.match(version, /^0\.19\.\d+$/, 'Build65 corrective must remain on the validated 0.19.x Studio line.');
assert.ok(build >= 65, `Build65 corrective requires Build65 or later, got Build ${build}.`);
assert.equal(pkg.version, version);
assert.ok(release.includes('build: 65'), 'Build65 ancestry marker must remain present.');
assert.ok(release.includes("codename: 'studio-focus-slice4-lyrics-crash-corrective'"), 'Build65 accepted codename must remain immutable in ancestry.');
for (const acceptedBuild of [81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109]) {
  assert.ok(release.includes(`build${acceptedBuild}AncestryMarker`), `Build110 successor must preserve accepted Build${acceptedBuild} ancestry marker.`);
}

for (const required of [
  "heading.textContent?.trim() !== 'Add lyrics to begin'",
  'if (!details.open) details.open = true;',
  "summary.textContent?.trim() !== 'Add lyrics.txt / plain-text editor'",
  "summary.textContent = 'Add lyrics.txt / plain-text editor';",
  'installBuild65MissingLyricsPresentation',
]) assert.ok(adapter.includes(required), `Build65 missing-lyrics adapter is missing ${required}.`);

assert.equal((adapter.match(/summary\.textContent\s*=\s*'Add lyrics\.txt \/ plain-text editor'/g) || []).length, 1, 'Build65 must have one summary text mutation only.');
assert.ok(!adapter.includes("if (summary) summary.textContent = 'Add lyrics.txt / plain-text editor';"), 'Build64 unconditional summary mutation must never return.');
assert.match(adapter, /if \(summary && summary\.textContent\?\.trim\(\) !== 'Add lyrics\.txt \/ plain-text editor'\) \{\s*summary\.textContent = 'Add lyrics.txt \/ plain-text editor';\s*\}/, 'Summary mutation must stay guarded by an exact value comparison.');

for (const required of [
  "kinds={['lyrics']}",
  'title="Add lyrics.txt"',
  'existing guarded Track asset operation',
]) assert.ok(lyrics.includes(required), `Guarded lyrics upload path is missing ${required}.`);

assert.ok(!adapter.includes('fetch('), 'Presentation adapter must not add network reads.');
assert.ok(!adapter.includes('saveAdminTrackMetadata'), 'Presentation adapter must not add canonical writes.');
assert.ok(!adapter.includes('uploadAdminTrackAsset'), 'Presentation adapter must not own asset writes.');

console.log(`Studio ${pkg.version} Build65 guard passed through Build${build}: missing-lyrics presentation remains idempotent and AssetsManager owns guarded TXT upload.`);
