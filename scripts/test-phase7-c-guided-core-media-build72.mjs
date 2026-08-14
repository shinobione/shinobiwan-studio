import assert from 'node:assert/strict';
import fs from 'node:fs';

const release = fs.readFileSync('src/release.ts', 'utf8');
const workflow = fs.readFileSync('src/phase7-workflow.ts', 'utf8');
const workspace = fs.readFileSync('src/components/TrackWorkspace.tsx', 'utf8');
const assets = fs.readFileSync('src/components/AssetsManager.tsx', 'utf8');
const phase4Api = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');

assert.match(release, /build:\s*72/);
assert.match(release, /codename:\s*'studio-focus-slice4-phase7c-slice2-guided-core-media'/);
assert.ok(release.includes("build71AncestryMarker"));

// Workflow truth: aggregate release quality must not masquerade as an Identity problem.
assert.ok(workflow.includes('do not collapse every canonical quality error into Identity'));
assert.ok(workflow.includes("const audioMissing = !track.assets.audio"));
assert.ok(workflow.includes("const coverMissing = !track.assets.cover"));
assert.ok(workflow.includes("detail: coverMissing ? 'Missing audio + cover · start with master audio' : 'Missing audio'"));
assert.match(workflow, /audioMissing[\s\S]*?section:\s*'overview'/);
assert.match(workflow, /coverMissing[\s\S]*?section:\s*'assets'/);
assert.ok(workflow.includes("const priority: WorkflowStageId[] = ['identity', 'media', 'lyrics', 'intelligence', 'release']"));
assert.ok(workflow.includes('const errors = qualityErrorCount(track);'));
assert.ok(workflow.includes('quality error${errors === 1 ? \'\' : \'s\'} block release'));

// The routed destinations must contain the operation-specific surfaces they claim to open.
assert.ok(workspace.includes("section === 'overview'"));
assert.ok(workspace.includes("kinds={['audio']}"));
assert.ok(workspace.includes('title="Master audio"'));
assert.ok(workspace.includes("section === 'assets'"));
assert.ok(workspace.includes("kinds={['cover', 'thumbnail', 'video']}"));
assert.ok(workspace.includes('title="Visual assets"'));

// Existing Track Manager asset authority is reused unchanged.
assert.ok(assets.includes('globalThis.confirm('));
assert.ok(assets.includes('uploadAdminTrackAsset(track.id, def.kind, revision, file'));
assert.ok(assets.includes("Canonical reread: {result.clientVerified ? 'Verified' : 'Check required'}"));
assert.ok(phase4Api.includes("await requireManage('assets')"));
assert.ok(phase4Api.includes('const before = await getAdminTrack(trackId);'));
assert.ok(phase4Api.includes("'STALE_MANIFEST'"));
assert.ok(phase4Api.includes("'ASSET_UPLOAD_AMBIGUOUS'"));
assert.ok(phase4Api.includes('const reread = await getAdminTrack(trackId);'));
assert.ok(phase4Api.includes('durationVerified'));
assert.ok(!phase4Api.includes('saveTrack('));

console.log('Phase 7-C Slice 2 Build 72 guided Core Media checks passed.');
