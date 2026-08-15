import assert from 'node:assert/strict';
import fs from 'node:fs';

const release = fs.readFileSync('src/release.ts', 'utf8');
const home = fs.readFileSync('src/components/FocusHome.tsx', 'utf8');
const catalog = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');
const workflowView = fs.readFileSync('src/components/WorkflowView.tsx', 'utf8');
const workflow = fs.readFileSync('src/phase7-workflow.ts', 'utf8');
const workspace = fs.readFileSync('src/components/TrackWorkspace.tsx', 'utf8');
const metadata = fs.readFileSync('src/components/MetadataValidationPanel.tsx', 'utf8');
const intake = fs.readFileSync('src/components/TrackCreatePanel.tsx', 'utf8');
const health = fs.readFileSync('src/content-health.ts', 'utf8');
const adminApi = fs.readFileSync('src/services/admin-api.ts', 'utf8');
const durationEvidence = fs.readFileSync('src/services/audio-duration-evidence.ts', 'utf8');
const metadataDurationApi = fs.readFileSync('src/services/metadata-duration-api.ts', 'utf8');
const phase4Api = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');

assert.match(release, /version:\s*'0\.19\.(?:3|4|5|6|7|8|9)'/);
assert.match(release, /build:\s*(?:69|70|71|72|73|82|83|84|85|86|87)/);
assert.match(
  release,
  /codename:\s*'(?:studio-focus-slice4-(?:phase7c-slice1-guided-metadata|phase7c-presmoke-publication-intake-fix|phase7c-duration-evidence-corrective|phase7c-slice2-guided-core-media|phase7c-slice2-status-truth-corrective|phase9-destructive-write-ambiguity-guard|phase9-lyrics-save-response-loss-truth|phase9-sonictrace-save-response-loss-truth|phase9-album-metadata-response-loss-truth|phase9-album-move-response-loss-truth|phase9-album-membership-response-loss-truth))'/,
);
if (/build:\s*(?:82|83|84|85|86|87)/.test(release)) {
  assert.ok(release.includes('build69AncestryMarker'), 'Phase9 successors must preserve Build69 guided-metadata ancestry.');
  assert.ok(release.includes('build73AncestryMarker'), 'Phase9 successors must preserve accepted Phase7-C program ancestry.');
  assert.ok(release.includes('build81AncestryMarker'), 'Phase9 successors must preserve accepted Build81 ancestry.');
}
if (/build:\s*(?:83|84|85|86|87)/.test(release)) assert.ok(release.includes('build82AncestryMarker'), 'Build83+ must preserve accepted Build82 Phase9 ancestry.');
if (/build:\s*(?:84|85|86|87)/.test(release)) assert.ok(release.includes('build83AncestryMarker'), 'Build84+ must preserve accepted Build83 Phase9 ancestry.');
if (/build:\s*(?:85|86|87)/.test(release)) assert.ok(release.includes('build84AncestryMarker'), 'Build85+ must preserve accepted Build84 Phase9 ancestry.');
if (/build:\s*(?:86|87)/.test(release)) assert.ok(release.includes('build85AncestryMarker'), 'Build86+ must preserve accepted Build85 Phase9 ancestry.');
if (/build:\s*87/.test(release)) assert.ok(release.includes('build86AncestryMarker'), 'Build87 must preserve accepted Build86 Phase9 ancestry.');
assert.ok(!home.includes("if (section === 'metadata' || section === 'versions') return 'overview';"));
assert.ok(home.includes("if (section === 'versions') return 'overview';"));
assert.ok(catalog.includes('trackHref(track.id, workflow.nextAction.section)'));
assert.ok(workflowView.includes('trackHref(track.id, item.nextAction.section)'));
assert.ok(metadata.includes('validateAdminTrackMetadataWithAudioEvidence(track.id, track.updatedAt, patch, evidence)'));
assert.ok(metadata.includes('saveAdminTrackMetadataWithAudioEvidence(track.id, validationRevision, patch, validationEvidence)'));
assert.ok(metadata.includes('Normalized proposal preview'));
assert.ok(metadata.includes('globalThis.confirm('));
assert.ok(metadata.includes('CANONICAL REREAD · VERIFIED'));
assert.ok(adminApi.includes("writeCapabilities.includes('metadata')"));
assert.ok(adminApi.includes('const reread = await getAdminTrack(trackId);'));
assert.ok(!adminApi.includes('saveTrack('));
assert.ok(workspace.includes('PHASE 7-C / GUIDED METADATA'));
assert.ok(workspace.includes('buildTrackWorkflow(track)'));
assert.ok(workspace.includes("section === 'metadata' && (item.id !== trackId || item.readSource !== 'private')"));
assert.ok(workspace.includes('Public fallback cannot verify this write.'));
assert.ok(workspace.includes('CURRENT NEXT ACTION'));
assert.ok(workspace.includes("privateRead ? 'PRIVATE CANONICAL' : 'LOCKED · PUBLIC FALLBACK'"));
assert.ok(!health.includes("item('publication'"));
assert.ok(health.includes('production readiness deliberately excludes publication state'));
assert.ok(workflow.includes("label: 'Publish track'"));
assert.ok(workflow.includes('Production ready · draft · publish when ready'));
assert.ok(metadata.includes('albumBoundType'));
assert.ok(metadata.includes('Derived from the current Album binding'));
assert.ok(metadata.includes('qualityIssues'));
assert.ok(metadata.includes('Why publication is blocked'));
assert.ok(metadata.includes('Prepare publication'));
assert.ok(!intake.includes('safeInitialTrackAlbum'));
assert.ok(intake.includes('Create & Publish'));
assert.ok(intake.includes('validateAdminTrackMetadata'));
assert.ok(intake.includes('saveAdminTrackMetadata'));
assert.ok(intake.includes('PUBLISH_QUALITY_BLOCKED'));
assert.ok(!intake.includes('saveTrack('));

// Build 71: duration remains derived evidence, not generic editable metadata.
assert.ok(durationEvidence.includes("audio.crossOrigin = 'use-credentials'"));
assert.ok(durationEvidence.includes('loadedmetadata'));
assert.ok(durationEvidence.includes('measureAudioFileEvidence'));
assert.ok(metadata.includes('measureCanonicalAudioEvidence(audioUrl)'));
assert.ok(metadata.includes('CANONICAL DURATION REPAIR PROPOSED'));
assert.ok(metadata.includes("derivedFields.includes('duration')"));
assert.ok(metadata.includes("proposalValue(validation.proposed, 'duration')"));
assert.ok(metadataDurationApi.includes("'5.22/1.12'"));
assert.ok(metadataDurationApi.includes("'5.23/1.13'"));
assert.ok(metadataDurationApi.includes('durationEvidenceBridgeCompatible'));
assert.ok(!metadataDurationApi.includes("health.trackManagerVersion !== '5.22' || health.version !== '1.12'"));
assert.ok(metadataDurationApi.includes('expectedUpdatedAt, metadata, evidence'));
assert.ok(metadataDurationApi.includes('reread.track?.manifest?.duration'));
assert.ok(phase4Api.includes("formData.set('audioDuration', String(audioEvidence.audio.duration))"));
assert.ok(phase4Api.includes("formData.set('audioReadable', 'true')"));
assert.ok(phase4Api.includes('durationVerified'));
assert.ok(!metadata.includes('name="duration"'));
assert.ok(!adminApi.match(/AdminMetadataPatch[\s\S]{0,500}\| 'duration'/));
assert.ok(!metadataDurationApi.includes('saveTrack('));

console.log('Phase 7-C Slice 1 lineage through Build73 remains protected through bounded Build82/Build83/Build84/Build85/Build86/Build87 Phase9 successor compatibility.');
