import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync('src/components/TrackToMarketPanel.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');
const historical = fs.readFileSync('docs/PHASE-7-A-TTM-V3-BUILD47.md', 'utf8');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.(?:16|17)\.\d+$/, 'Build 47 successor lineage must remain on an explicitly authorized Studio release line.');
assert.ok(build >= 47, `Build 47 successor must remain Build 47 or later, got ${build}.`);
assert.ok(codename.startsWith('phase7-') || codename.startsWith('studio-focus-'), `Build 47 successor codename must remain Phase 7 or the authorized Studio Focus presentation successor, got ${codename}.`);

for (const marker of [
  "version: '0.2.0'",
  "artworkStrategy: 'integrated'",
  'previewDataUrl',
  "releaseStatus === 'final'",
  'exact child Window',
  'Nothing in Build 47 persists the staged result',
  'Track Manager writes',
  'canonical cover objects',
]) assert.ok(historical.includes(marker), `Build 47 historical contract is missing ${marker}.`);

for (const forbidden of [
  'admin-api',
  'phase4-admin-api',
  'uploadTrackAsset',
  'replaceTrackAsset',
  'deleteTrackAsset',
  'saveTrackMetadata',
  'fetch(',
]) assert.ok(!panel.includes(forbidden), `Build 47+ Release Pack surface must remain non-canonical: ${forbidden}`);

console.log(`Build 47 Bridge V3 historical contract remains documented while ${version} Build ${build} preserves the no-write boundary through Studio Focus.`);
