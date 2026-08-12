import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync('src/components/TrackToMarketPanel.tsx', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.ok(build >= 47, 'TTM V3 staged-preview ancestry requires Build 47 or later.');
if (build === 47) {
  assert.equal(version, '0.16.1');
  assert.equal(codename, 'phase7-a-ttm-v3-staged-preview');
} else {
  assert.ok(codename.startsWith('phase7-'), 'TTM V3 must remain inherited by an explicit Phase 7 successor.');
}
assert.match(main, /import '\.\/track-to-market-v3\.css';/);

assert.match(panel, /version: '0\.2\.0'/, 'Studio must send Bridge V3 input protocol.');
assert.match(panel, /artworkStrategy: 'integrated'/, 'Studio must default new TTM sessions to integrated premium artwork.');
assert.match(panel, /previewDataUrl/, 'Studio must consume actual FINAL artwork preview.');
assert.match(panel, /validatedPreview/, 'Preview payload must be validated before rendering.');
assert.match(panel, /MAX_PREVIEW_DATA_URL = 2_500_000/, 'Preview payload must have a defensive size cap.');
assert.match(panel, /data\.releaseStatus !== 'final'/, 'DRAFT returns must remain rejected.');
assert.match(panel, /data\.trackId !== track\.id/, 'Bridge returns must match canonical trackId.');
assert.match(panel, /event\.source !== child/, 'Bridge origin must also match the exact opened child window.');
assert.match(panel, /Brand treatment/, 'Studio must show branding provenance.');
assert.match(panel, /Stage \+ review only/, 'UI must keep the no-write boundary explicit.');

for (const forbidden of ['admin-api', 'phase4-admin-api', 'uploadTrackAsset', 'replaceTrackAsset', 'deleteTrackAsset', 'saveTrackMetadata', 'fetch(']) {
  assert.ok(!panel.includes(forbidden), `TTM V3 staging must remain read/review-only under the successor: ${forbidden}`);
}

console.log(`Build 47 TTM V3 staged-preview remains inherited by Studio ${version} Build ${build} with protocol, preview, FINAL/trackId and no-write guards intact.`);