import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const integration = read('src/services/lrc-maker.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const health = read('src/content-health.ts');
const admin = read('src/services/admin-api.ts');
const readability = read('src/readability.css');
const lyricsCss = read('src/lyrics-editor.css');

for (const required of [
  "url.searchParams.set('studio', 'lyrics-v1')",
  "url.searchParams.set('trackId', trackId)",
  "url.searchParams.set('returnPath', returnPath)",
  "url.hash = '#/synchronizer/'",
  'carriesAudioOrLyricsInUrl: false',
  "canonicalFilename: 'lyrics.txt'",
  'separateLrcRequired: false',
]) assert.ok(integration.includes(required), `Contextual LRC Maker contract missing ${required}.`);

for (const forbidden of ['lyrics=', 'audio=', 'blob:', 'lyrics.lrc']) {
  assert.ok(!integration.includes(forbidden), `Context URL must not carry ${forbidden}.`);
}

for (const required of [
  'openContextualLrcMaker(track.id)',
  'shinobiwan:lyrics-saved:v1',
  'event.origin !== globalThis.location.origin',
  'void refreshTrackAfterWrite()',
  'const syncedLyrics = track.timestampsAvailable;',
  'Only timestamps inside canonical lyrics.txt define synchronized health.',
]) assert.ok(workspace.includes(required), `Studio Lyrics workspace contract missing ${required}.`);

assert.ok(health.includes('const syncedLyrics = track.timestampsAvailable;'), 'Content Health must derive synchronization only from canonical timestamps.');
assert.ok(!health.includes('Boolean(track.assets.lyricsLrc)'), 'Optional .lrc must not contribute to Content Health.');
assert.ok(admin.includes("'lyrics-sync'"), 'The v1.7 guarded write capability must not force public fallback.');

const tinyFonts = [...`${lyricsCss}\n${readability}`.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
  .map(match => Number(match[1]))
  .filter(size => size < 11);
assert.deepEqual(tinyFonts, [], `Phase 6 must preserve the 11px readability floor; found ${tinyFonts.join(', ')}.`);

console.log('Phase 6 Lyrics contract passed: minimal context, canonical timestamps only, guarded refresh and 11px readability floor.');
