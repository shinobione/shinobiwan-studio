import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const embedded = read('src/components/EmbeddedLyricsStudio.tsx');
const verifier = read('src/components/ContinuationReceiptBanner.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.17\.1'/);
assert.match(release, /build:\s*51/);
assert.match(release, /phase7-b-lyrics-receipt-window-listener-corrective/);
assert.equal(pkg.version, '0.17.1');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-b-contextual-receipts-build50.mjs'), 'Build 50 receipt contract must remain active.');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-b-lyrics-receipt-build51.mjs'), 'Build 51 Lyrics receipt corrective guard must run in the Phase 7 chain.');

for (const marker of [
  "globalThis.addEventListener('lyrics-saved', listener)",
  "globalThis.removeEventListener('lyrics-saved', listener)",
  'if (detail?.trackId !== trackId) return;',
  "source: 'lrc-maker'",
  "operation: 'lyrics-saved'",
  "effect: 'canonical-write'",
  'sourceRevision: detail.updatedAt',
]) assert.ok(embedded.includes(marker), `Build 51 embedded Lyrics receipt hardening is missing ${marker}.`);

assert.ok(!embedded.includes('useRef'), 'Build 51 must not depend on a React ref to capture the LRC Maker custom event.');
assert.ok(!embedded.includes('hostRef'), 'Build 51 must not bind receipt delivery to a custom-element host ref.');
assert.ok(verifier.includes("canonical.readSource !== 'private'"), 'Build 51 must keep private canonical reread as the verification authority.');
assert.ok(verifier.includes("receipt.operation === 'lyrics-saved' && !canonical.assets.lyricsTxt"), 'Build 51 must keep operation-specific canonical Lyrics evidence.');

for (const forbidden of ['uploadTrackAsset', 'replaceTrackAsset', 'saveTrackMetadata', '/api/studio/track/write', '/api/studio/write']) {
  assert.ok(!embedded.includes(forbidden), `Build 51 Lyrics receipt listener must not acquire write authority: ${forbidden}`);
}

console.log('Phase 7-B Build 51 guard passed: embedded LRC Maker save receipts are captured at window scope, exact-track filtered, and still require the inherited private canonical reread before VERIFIED.');
