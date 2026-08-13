import assert from 'node:assert/strict';
import fs from 'node:fs';

const release = fs.readFileSync('src/release.ts', 'utf8');
const home = fs.readFileSync('src/components/FocusHome.tsx', 'utf8');
const catalog = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');
const workflow = fs.readFileSync('src/components/WorkflowView.tsx', 'utf8');
const workspace = fs.readFileSync('src/components/TrackWorkspace.tsx', 'utf8');
const metadata = fs.readFileSync('src/components/MetadataValidationPanel.tsx', 'utf8');
const adminApi = fs.readFileSync('src/services/admin-api.ts', 'utf8');

assert.match(release, /version:\s*'0\.19\.3'/);
assert.match(release, /build:\s*69/);
assert.match(release, /codename:\s*'studio-focus-slice4-phase7c-slice1-guided-metadata'/);

// Home / Tracks / Workflow must preserve the workflow's metadata destination.
assert.ok(!home.includes("if (section === 'metadata' || section === 'versions') return 'overview';"));
assert.ok(home.includes("if (section === 'versions') return 'overview';"));
assert.ok(catalog.includes('trackHref(track.id, workflow.nextAction.section)'));
assert.ok(workflow.includes('trackHref(track.id, item.nextAction.section)'));

// The existing protected metadata operation remains the only write path.
assert.ok(metadata.includes('validateAdminTrackMetadata(track.id, track.updatedAt, patch)'));
assert.ok(metadata.includes('Normalized proposal preview'));
assert.ok(metadata.includes('globalThis.confirm('));
assert.ok(metadata.includes('saveAdminTrackMetadata(track.id, validationRevision, patch)'));
assert.ok(metadata.includes('CANONICAL REREAD · VERIFIED'));
assert.ok(adminApi.includes("writeCapabilities.includes('metadata')"));
assert.ok(adminApi.includes('const reread = await getAdminTrack(trackId);'));
assert.ok(!adminApi.includes('saveTrack('));

// Build 69 adds the guided context and forbids public fallback as post-save proof.
assert.ok(workspace.includes('PHASE 7-C / GUIDED METADATA'));
assert.ok(workspace.includes('buildTrackWorkflow(track)'));
assert.ok(workspace.includes("section === 'metadata' && (item.id !== trackId || item.readSource !== 'private')"));
assert.ok(workspace.includes('Public fallback cannot verify this write.'));
assert.ok(workspace.includes('CURRENT NEXT ACTION'));
assert.ok(workspace.includes("privateRead ? 'PRIVATE CANONICAL' : 'LOCKED · PUBLIC FALLBACK'"));

console.log('Build 69 Phase 7-C guided metadata check passed on the accepted v0.19.3 / Studio Focus Slice 4 compatibility lineage.');
