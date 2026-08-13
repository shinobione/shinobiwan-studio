import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const adapter = read('src/legacy-track-type-display-auto.ts');
const lyrics = read('src/components/LyricsEditorPanel.tsx');

assert.equal(pkg.version, '0.19.3');
assert.match(release, /version:\s*'0\.19\.3'/);
assert.match(release, /build:\s*65/);
assert.match(release, /codename:\s*'studio-focus-slice4-lyrics-crash-corrective'/);

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

console.log('Studio v0.19.3 Build 65 guard passed: missing-lyrics presentation is idempotent and the guarded TXT upload path remains owned by AssetsManager.');
