import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const receipts = read('src/phase7-receipts.ts');
const verifier = read('src/components/ContinuationReceiptBanner.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const embeddedLyrics = read('src/components/EmbeddedLyricsStudio.tsx');
const releaseCampaign = read('src/components/TrackToMarketPanel.tsx');
const styles = read('src/phase7-receipts.css');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.17\.0'/);
assert.match(release, /build:\s*50/);
assert.match(release, /phase7-b-contextual-continuation-receipts/);
assert.equal(pkg.version, '0.17.0');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-native-release-campaign-build49.mjs'), 'Build 49 native Release Campaign guard must remain active.');
assert.ok(pkg.scripts['check:phase7']?.includes('test-phase7-b-contextual-receipts-build50.mjs'), 'Build 50 receipt guard must run in the Phase 7 chain.');

for (const token of [
  "'lrc-maker'",
  "'sonictrace'",
  "'release-campaign'",
  "'lyrics-saved'",
  "'analysis-saved'",
  "'campaign-exported'",
  "'canonical-write'",
  "'review-only'",
]) assert.ok(receipts.includes(token), `Receipt contract missing ${token}.`);

assert.ok(receipts.includes('SOURCE_OPERATIONS'), 'Receipt source/operation/effect allowlist must remain explicit.');
assert.ok(receipts.includes("'release-campaign': new Map([['campaign-exported', 'review-only']])"), 'Release Campaign must remain review-only.');
assert.ok(receipts.includes("'lrc-maker': new Map([['lyrics-saved', 'canonical-write']])"), 'Lyrics receipts must require canonical verification.');
assert.ok(receipts.includes("sonictrace: new Map([['analysis-saved', 'canonical-write']])"), 'SonicTrace receipts must require canonical verification.');

assert.ok(verifier.includes('if (next.trackId !== trackId) return;'), 'Mismatched canonical trackId receipts must be ignored.');
assert.ok(verifier.includes('const epoch = ++verificationEpoch.current;'), 'Verification must use a stale-async epoch.');
assert.ok(verifier.includes('if (epoch !== verificationEpoch.current) return;'), 'Stale verification must not overwrite a newer receipt.');
assert.ok(verifier.includes('const canonical = await getCatalogTrack(next.trackId);'), 'Canonical writes must be reread through the Track read layer.');
assert.ok(verifier.includes("canonical.readSource !== 'private'"), 'Public fallback must never verify a canonical write.');
assert.ok(verifier.includes('canonical.id !== trackId'), 'Canonical reread must match the exact current trackId.');
assert.ok(verifier.includes("new URL(studioConfig.lrcMakerUrl).origin"), 'Standalone LRC Maker receipts must be origin-filtered against configured LRC Maker origin.');
assert.ok(verifier.includes("receipt.operation === 'lyrics-saved' && !canonical.assets.lyricsTxt"), 'Lyrics verification must require canonical lyrics evidence.');
assert.ok(verifier.includes("receipt.operation === 'analysis-saved' && !canonical.audioIntelligence.available"), 'SonicTrace verification must require canonical analysis evidence.');

assert.ok(embeddedLyrics.includes("source: 'lrc-maker'"), 'Embedded LRC Maker must emit a typed receipt.');
assert.ok(workspace.includes('<ContinuationReceiptBanner'), 'Track Workspace must render the contextual receipt status.');
assert.ok(workspace.includes("source: 'sonictrace'"), 'SonicTrace completion must emit a typed receipt.');
assert.ok(releaseCampaign.includes("source: 'release-campaign'"), 'Native Release Campaign must emit a review-only receipt.');
assert.ok(releaseCampaign.includes("effect: 'review-only'"), 'Release Campaign receipt may not claim canonical persistence.');
assert.ok(releaseCampaign.includes('canonicalWrite: false'), 'Native Release Campaign export must keep its no-write manifest contract.');
assert.ok(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Receipt motion must respect reduced-motion preferences.');

for (const forbidden of ['uploadTrackAsset', 'replaceTrackAsset', 'saveTrackMetadata', 'rebuildCatalog', '/api/studio/track/write', '/api/studio/write']) {
  assert.ok(!receipts.includes(forbidden), `Receipt contract must not acquire write authority: ${forbidden}`);
  assert.ok(!verifier.includes(forbidden), `Receipt verifier must remain read-only: ${forbidden}`);
}

console.log('Phase 7-B Build 50 guard passed: typed allowlisted receipts, exact trackId, private canonical reread, stale protection and review-only native Release Campaign.');
