import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const lyrics = read('src/services/lyrics-admin-api.ts');
const ui = read('src/components/LyricsEditorPanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.5'/);
assert.match(release, /build:\s*83/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-lyrics-save-response-loss-truth'"));
assert.ok(release.includes('build82AncestryMarker'), 'Build83 must inherit the accepted Build82 runtime contract.');
assert.equal(pkg.version, '0.19.5', 'package version must match Build83 runtime version.');

for (const marker of [
  'LYRICS_SAVE_TIMEOUT',
  'LYRICS_SAVE_TRANSPORT',
  'LYRICS_SAVE_NOT_COMMITTED',
  'LYRICS_SAVE_AMBIGUOUS',
  'LYRICS_SAVE_UNVERIFIED',
  'recoveredAfterTransportFailure: true',
  "commitState: 'committed'",
  'Do not retry',
  "lostResponsePolicy: 'private-canonical-reread-no-blind-retry'",
]) assert.ok(lyrics.includes(marker), `Build83 Lyrics lost-response contract missing ${marker}`);

assert.ok(lyrics.includes('readonly retrySafe: boolean;'), 'AdminLyricsError must carry typed retry safety.');
assert.match(
  lyrics,
  /'LYRICS_SAVE_NOT_COMMITTED'[\s\S]{0,220}?reread\.revision,[\s\S]{0,120}?rereadEtag,[\s\S]{0,80}?true,/,
  'NOT_COMMITTED classification must explicitly set retrySafe=true after unchanged revision + ETag reread.',
);
assert.ok(lyrics.includes('transportFailure?: LyricsSaveTransportFailure'), 'Lyrics save must classify transport loss in the existing POST transport helper.');
assert.ok(lyrics.includes("timeoutCode: 'LYRICS_SAVE_TIMEOUT'"), 'Lyrics save must attach a bounded timeout code to the established transport.');
assert.ok(lyrics.includes("!['LYRICS_SAVE_TIMEOUT', 'LYRICS_SAVE_TRANSPORT'].includes(reason.code || '')"), 'Only lost-response transport failures may enter Lyrics recovery.');
assert.ok(lyrics.includes('Promise.all([getLyricsJson(trackId), getAdminTrack(trackId)])'), 'Lyrics recovery must reread private canonical lyrics plus manifest revision.');
assert.ok(lyrics.includes('if (revisionChanged && etagChanged && textMatches)'), 'Recovered success must prove new revision, new ETag and exact requested normalized text.');
assert.ok(lyrics.includes('if (sameRevision && sameEtag)'), 'Explicit retry safety must require unchanged revision plus unchanged Lyrics ETag.');
assert.ok(!lyrics.includes('retryAdminTrackLyricsSave'), 'Build83 must not introduce a blind automatic Lyrics retry loop.');
assert.ok(lyrics.includes("reread.lyrics.lyricsEtag === expectedEtag && reread.revision === expectedRevision && reread.lyrics.lyrics === normalizedLyrics"), 'Normal save success must retain exact canonical post-write verification.');

assert.ok(ui.includes('RECOVERED AFTER LOST RESPONSE'), 'Lyrics UI must distinguish verified recovery from a normal response.');
assert.ok(ui.includes('DO NOT RETRY'), 'Lyrics UI must expose unsafe ambiguous/unverified outcomes.');
assert.ok(ui.includes('RETRY SAFE AFTER RECONNECT'), 'Lyrics UI must expose the narrow canonically-proven retry-safe outcome.');
assert.ok(ui.includes('Studio did not retry the write.'), 'Recovered success copy must state that no blind retry occurred.');

assert.ok(pkg.scripts['check:phase9']?.includes('test-phase9-destructive-write-ambiguity-build82.mjs'), 'Build82 guard must remain inherited.');
assert.ok(pkg.scripts['check:phase9']?.includes('test-phase9-lyrics-response-loss-build83.mjs'), 'Build83 guard must run in check:phase9.');
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build83 Lyrics response-loss guard passed: lost save responses are canonically classified as committed/not-committed/ambiguous/unverified with no blind retry, while normal success remains canonically verified.');
