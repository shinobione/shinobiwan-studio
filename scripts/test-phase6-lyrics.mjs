import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const integration = read('src/services/lrc-maker.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const health = read('src/content-health.ts');
const admin = read('src/services/admin-api.ts');
const readability = read('src/readability.css');
const lyricsCss = read('src/lyrics-editor.css');
const embedCss = read('src/lyrics-embed.css');
const embed = read('src/components/EmbeddedLyricsStudio.tsx');
const receipts = fs.existsSync('src/phase7-receipts.ts') ? read('src/phase7-receipts.ts') : '';

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
  'const syncedLyrics = track.timestampsAvailable;',
  'const canEmbedLyrics = privateRead && Boolean(track.assets.audio && track.assets.lyricsTxt);',
  "workspace-lyrics-panel--embedded",
  'Open standalone fallback ↗',
  '<strong>lyrics.txt</strong> is the only canonical source.',
  'Timestamps inside it define synchronization; LRC export remains optional.',
]) assert.ok(workspace.includes(required), `Studio Lyrics workspace contract missing ${required}.`);

const historicalStandalone = workspace.includes('shinobiwan:lyrics-saved:v1') && workspace.includes('event.origin !== globalThis.location.origin') && workspace.includes('void refreshTrackAfterWrite()');
const receiptStandalone = receipts.includes("data.type !== 'shinobiwan:lyrics-saved:v1'") && workspace.includes('parseStandaloneLyricsReceipt(event.data)') && workspace.includes('event.origin !== lrcOrigin') && workspace.includes('void handleContinuationReceipt(receipt)');
assert.ok(historicalStandalone || receiptStandalone, 'Standalone LRC Maker save must remain origin-guarded and trigger a canonical refresh/verification path.');

const historicalEmbed = workspace.includes('<EmbeddedLyricsStudio trackId={track.id} onSaved={refreshTrackAfterWrite} />') && embed.includes('void onSaved()');
const receiptEmbed = workspace.includes('<EmbeddedLyricsStudio trackId={track.id} onReceipt={handleContinuationReceipt} />') && embed.includes("source: 'lrc-maker'") && embed.includes("operation: 'lyrics-saved'") && embed.includes("effect: 'canonical-write'");
assert.ok(historicalEmbed || receiptEmbed, 'Embedded LRC Maker save must preserve canonical refresh semantics or the stricter receipt + canonical reread successor.');

for (const required of [
  "const EMBED_TAG = 'shinobiwan-lyrics-studio'",
  "const EMBED_VERSION = '6.3.8'",
  "embed/lyrics-studio.js",
  "base.searchParams.set('v', EMBED_VERSION)",
  'contextualLrcMakerUrl(trackId)',
  'Open standalone fallback ↗',
]) assert.ok(embed.includes(required), `Embedded Lyrics Studio host missing ${required}.`);

for (const staleVersion of ['6.3.2', '6.3.3', '6.3.4', '6.3.5', '6.3.6', '6.3.7']) {
  assert.ok(!embed.includes(`const EMBED_VERSION = '${staleVersion}'`), `Lyrics host must not reload stale LRC Maker ${staleVersion}.`);
}
assert.ok(!`${embed}\n${workspace}`.includes('<iframe'), 'Phase 6C must not use an iframe.');
assert.ok(!fs.existsSync('src/components/LyricsStudioPortal.tsx'), 'Phase 6C must not rely on a MutationObserver/portal injection bridge.');
assert.ok(health.includes('const syncedLyrics = track.timestampsAvailable;'), 'Content Health must derive synchronization only from canonical timestamps.');
assert.ok(!health.includes('Boolean(track.assets.lyricsLrc)'), 'Optional .lrc must not contribute to Content Health.');
assert.ok(admin.includes("'lyrics-sync'"), 'The guarded lyrics-sync capability must not force public fallback.');

const tinyFonts = [...`${lyricsCss}\n${embedCss}\n${readability}`.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)]
  .map(match => Number(match[1]))
  .filter(size => size < 11);
assert.deepEqual(tinyFonts, [], `Phase 6 must preserve the 11px readability floor; found ${tinyFonts.join(', ')}.`);

console.log('Phase 6 Lyrics contract passed under the current successor: embedded LRC Maker 6.3.8, standalone fallback, canonical timestamps and guarded canonical refresh/receipt verification remain intact.');