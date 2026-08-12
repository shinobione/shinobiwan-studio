import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));
const receipts = read('src/phase7-receipts.ts');
const workspace = read('src/components/TrackWorkspace.tsx');
const embeddedLyrics = read('src/components/EmbeddedLyricsStudio.tsx');
const market = read('src/components/TrackToMarketPanel.tsx');
const app = read('src/App.tsx');
const main = read('src/main.tsx');
const styles = read('src/phase7-receipts.css');

assert.match(release, /version:\s*'0\.17\.0'/, 'Phase 7-B must publish Studio 0.17.0.');
assert.match(release, /build:\s*48/, 'Phase 7-B must be Build 48 after the Build 47 TTM V3 corrective.');
assert.match(release, /codename:\s*'phase7-b-contextual-receipts'/, 'Phase 7-B codename mismatch.');
assert.equal(pkg.version, '0.17.0', 'package.json must match Studio Build 48 release.');
for (const guard of ['test-phase7-workflow-build46.mjs', 'test-phase7-a-build47-ttm-v3.mjs', 'test-phase7-receipts-build48.mjs']) {
  assert.ok(pkg.scripts['check:phase7']?.includes(guard), `Build 48 must preserve Phase 7 guard ${guard}.`);
}

for (const marker of ["'lrc-maker' | 'sonictrace' | 'track-to-market'", "'canonical-write' | 'review-only'", "'lyrics-saved' | 'analysis-saved' | 'final-pack-received'", 'makeContinuationReceipt', 'parseStandaloneLyricsReceipt', 'Track-To-Market receipts are review-only']) assert.ok(receipts.includes(marker), `Receipt contract missing ${marker}.`);
assert.doesNotMatch(receipts, /fetch\s*\(/, 'Receipt domain model must not perform direct HTTP requests.');
assert.doesNotMatch(receipts, /method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i, 'Receipt domain model must not create a write transport.');

for (const marker of ['handleContinuationReceipt', 'receipt.trackId !== trackId', "receipt.effect === 'review-only'", 'const canonical = await getCatalogTrack(trackId)', "canonical.readSource !== 'private'", "status: 'verified'", "status: 'verification-error'", 'Track Manager private catalog reread completed', 'parseStandaloneLyricsReceipt(event.data)', 'event.origin !== lrcOrigin']) assert.ok(workspace.includes(marker), `Track Workspace receipt verification is missing ${marker}.`);

assert.ok(embeddedLyrics.includes("source: 'lrc-maker'"), 'Embedded LRC Maker must emit a typed receipt.');
assert.ok(embeddedLyrics.includes("operation: 'lyrics-saved'"), 'Embedded LRC Maker receipt must identify lyrics-saved.');
assert.ok(embeddedLyrics.includes("effect: 'canonical-write'"), 'Embedded LRC Maker save must require canonical reread.');
assert.ok(workspace.includes("source: 'sonictrace'"), 'SonicTrace completion must become a typed receipt.');
assert.ok(workspace.includes("operation: 'analysis-saved'"), 'SonicTrace receipt must identify analysis-saved.');
assert.ok(workspace.includes("effect: 'canonical-write'"), 'SonicTrace save must require canonical reread.');

for (const marker of ['MAX_PREVIEW_DATA_URL = 2_500_000', "version: '0.2.0'", 'validatedPreview', "data.trackId !== track.id", "data.releaseStatus !== 'final'", "source: 'track-to-market'", "operation: 'final-pack-received'", "effect: 'review-only'", 'No canonical write is expected or authorized']) assert.ok(market.includes(marker), `Track-To-Market V3 + receipt boundary is missing ${marker}.`);
for (const forbidden of ['updateTrackMetadata', 'uploadTrackAsset', 'deleteTrackAsset', 'saveSonicTraceAnalysis', 'rebuildCatalog']) {
  assert.ok(!market.includes(forbidden), `Track-To-Market receipt path must not import ${forbidden}.`);
  assert.ok(!receipts.includes(forbidden), `Receipt contract must not import ${forbidden}.`);
}

assert.ok(app.includes('PHASE 7-B'), 'Studio shell must identify Phase 7-B.');
assert.ok(app.includes('Verify the result'), 'Dashboard must explain canonical receipt verification.');
assert.ok(main.includes("import './track-to-market-v3.css'"), 'Build 48 must preserve Build 47 staged-preview styling.');
assert.ok(main.includes("import './phase7-receipts.css'"), 'Build 48 receipt stylesheet must be loaded.');
assert.ok(styles.includes('.continuation-receipt.verified'), 'Verified receipt state needs explicit styling.');
assert.ok(styles.includes('.continuation-receipt.review-only'), 'Review-only receipt state needs explicit styling.');
assert.ok(styles.includes('.continuation-receipt.verification-error'), 'Verification failure state needs explicit styling.');
assert.ok(styles.includes('@media(prefers-reduced-motion:reduce)'), 'Receipt UI must preserve reduced-motion accessibility.');

console.log('Studio Phase 7-B Build 48 preserves TTM V3, scopes receipts by trackId, canonically rereads real writes and keeps FINAL review-only.');