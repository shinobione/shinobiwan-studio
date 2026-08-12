import assert from 'node:assert/strict';
import fs from 'node:fs';

const panel = fs.readFileSync('src/components/TrackToMarketPanel.tsx', 'utf8');
const workspace = fs.readFileSync('src/components/TrackWorkspace.tsx', 'utf8');
const router = fs.readFileSync('src/router.ts', 'utf8');
const types = fs.readFileSync('src/types/studio.ts', 'utf8');
const config = fs.readFileSync('src/services/config.ts', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const originalBuild45 = version === '0.15.1' && build === 45 && codename.includes('track-to-market-bridge-v2');
const authorizedPhase7Successor = /^0\.16\.\d+$/.test(version) && build >= 46 && codename.startsWith('phase7-');
assert.ok(originalBuild45 || authorizedPhase7Successor, `Track-To-Market Bridge V2 guard must run on Build 45 or an explicitly authorized Phase 7 successor, got ${version} Build ${build} / ${codename}.`);

assert.match(types, /\| 'market'/, 'WorkspaceSection must expose the Release Pack route.');
assert.match(router, /'market'/, 'Router must accept the Release Pack workspace section.');
assert.match(workspace, /id: 'market', label: 'Release Pack'/, 'Track Workspace must expose the Release Pack tab.');
assert.match(workspace, /section === 'market'[\s\S]*<TrackToMarketPanel track=\{track\}/, 'Release Pack route must render the bridge panel with the current canonical track.');
assert.match(config, /trackToMarketUrl:[\s\S]*Track-To-Market-Engine/, 'Studio config must define the standalone TTME target.');
assert.match(main, /import '\.\/track-to-market\.css';/, 'Build 45 Track-To-Market styles must remain loaded.');

assert.match(panel, /const TTME_ORIGIN = 'https:\/\/shinobione\.github\.io'/, 'Bridge origin must be explicit.');
assert.match(panel, /shinobiwan:track-to-market:ready/);
assert.match(panel, /shinobiwan:track-to-market:input/);
assert.match(panel, /shinobiwan:track-to-market:pack/);
assert.match(panel, /data\.releaseStatus !== 'final'/, 'Non-FINAL returns must be rejected.');
assert.match(panel, /data\.trackId !== track\.id/, 'Returned pack trackId must match the current track.');
assert.match(panel, /lyrics: track\.lyricsRaw \|\| ''/, 'Canonical lyrics must travel in the Bridge V2 payload, not the URL.');
assert.doesNotMatch(panel, /searchParams\.set\('lyrics'/, 'Long lyrics must not be copied into the query string.');
assert.match(panel, /Build 45 does not write it to R2 or Track Manager/, 'UI must state the review-only boundary.');

for (const forbidden of [
  'admin-api',
  'phase4-admin-api',
  'uploadTrackAsset',
  'replaceTrackAsset',
  'deleteTrackAsset',
  'saveTrackMetadata',
  'fetch(',
]) assert.ok(!panel.includes(forbidden), `Review-only TTME panel must not import/call write surface: ${forbidden}`);

console.log('Track-To-Market Bridge V2 passed route, origin, FINAL gate, trackId, lyrics transport and no-write guards through the authorized Phase 7 successor.');