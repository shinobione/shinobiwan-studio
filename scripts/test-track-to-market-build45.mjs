import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync('src/components/TrackToMarketPanel.tsx', 'utf8');
const workspace = fs.readFileSync('src/components/TrackWorkspace.tsx', 'utf8');
const router = fs.readFileSync('src/router.ts', 'utf8');
const types = fs.readFileSync('src/types/studio.ts', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');
const historicalPass = fs.readFileSync('docs/TRACK-TO-MARKET-BUILD45-REAL-USER-PASS.md', 'utf8');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const originalBuild45 = version === '0.15.1' && build === 45 && codename.includes('track-to-market-bridge-v2');
const authorizedPhase7Successor = /^0\.(?:16|17)\.\d+$/.test(version) && build >= 46 && codename.startsWith('phase7-');
const authorizedStudioFocusSuccessor = /^0\.(?:17|18|19)\.\d+$/.test(version) && build >= 53 && codename.startsWith('studio-focus-');
assert.ok(originalBuild45 || authorizedPhase7Successor || authorizedStudioFocusSuccessor, `Build 45 lineage guard must run on Build 45 or an explicitly authorized Phase 7 / Studio Focus successor, got ${version} Build ${build} / ${codename}.`);

assert.match(types, /\| 'market'/, 'WorkspaceSection must preserve the native Release Campaign route token.');
assert.match(router, /'market'/, 'Router must accept the native Release Campaign workspace section.');
assert.ok(
  workspace.includes("{ label: 'Release', href: 'market'") || workspace.includes("id: 'market', label: 'Release Pack'"),
  'Track Workspace must expose the existing market route through the accepted Release artist surface or historical Release Pack tab.',
);
assert.match(workspace, /section === 'market'[\s\S]*<TrackToMarketPanel track=\{track\}/, 'Release route must render its current implementation with the canonical track.');

// The accepted Bridge V2 behavior is historical truth, not a requirement that all successors keep a popup bridge or the historical tab label forever.
for (const marker of [
  'REAL USER PASS',
  'trackId',
  'FINAL',
  'DRAFT',
  'postMessage',
  'no R2 write',
]) assert.ok(historicalPass.includes(marker), `Build 45 accepted-history document is missing ${marker}.`);

for (const forbidden of [
  'admin-api',
  'phase4-admin-api',
  'uploadTrackAsset',
  'replaceTrackAsset',
  'deleteTrackAsset',
  'saveTrackMetadata',
  'fetch(',
]) assert.ok(!panel.includes(forbidden), `Release Campaign successor must preserve the no-canonical-write boundary: ${forbidden}`);

console.log(`Build 45 accepted bridge history remains documented while Studio ${version} Build ${build} preserves the Release Campaign route and no-write authority boundary through Studio Focus.`);
