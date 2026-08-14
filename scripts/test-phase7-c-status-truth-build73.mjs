import assert from 'node:assert/strict';
import fs from 'node:fs';

const release = fs.readFileSync('src/release.ts', 'utf8');
const home = fs.readFileSync('src/components/FocusHome.tsx', 'utf8');
const workspace = fs.readFileSync('src/components/TrackWorkspace.tsx', 'utf8');
const workflow = fs.readFileSync('src/phase7-workflow.ts', 'utf8');

assert.match(release, /build:\s*73/);
assert.match(release, /codename:\s*'studio-focus-slice4-phase7c-slice2-status-truth-corrective'/);
assert.ok(release.includes('build72AncestryMarker'));

// Canvas is optional: a canonical cover is enough to mark Visuals ready everywhere.
assert.ok(home.includes("if (step === 'visuals') return Boolean(track.assets.cover);"));
assert.ok(!home.includes("track.assets.cover && track.assets.video"));
assert.ok(workspace.includes("{ label: 'Visuals', ready: Boolean(track.assets.cover)"));
assert.ok(workspace.includes("'Cover ready · Canvas optional'"));

// Lyrics are not production-ready until canonical TXT contains recognized timestamps.
assert.ok(home.includes("if (step === 'lyrics') return Boolean(track.assets.lyricsTxt && track.timestampsAvailable);"));
assert.ok(workspace.includes("{ label: 'Lyrics', ready: Boolean(track.assets.lyricsTxt && syncedLyrics)"));
assert.ok(workspace.includes("track.assets.lyricsTxt && syncedLyrics ? 'ready' : 'attention'"));
assert.ok(workspace.includes("track.assets.lyricsTxt ? 'Timing needed' : 'Missing'"));
assert.ok(workflow.includes("detail: 'TXT ready · timing missing'"));

// The Track Workspace Continue action follows the same Phase 7 workflow authority as Home/Tracks/Workflow.
assert.ok(workspace.includes("!workflow.ready && <a href={trackHref(track.id, workflow.nextAction.section)}>Continue →</a>"));
assert.ok(!workspace.includes("attention[0] && <a href={trackHref(track.id, healthDestination(attention[0].id))}>Continue →</a>"));

console.log('Build 73 status-truth corrective checks passed.');
