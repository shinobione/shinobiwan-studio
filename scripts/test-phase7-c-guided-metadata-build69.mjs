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
const trackMetadataApi = fs.readFileSync('src/services/track-metadata-admin-api.ts', 'utf8');
const phase4Api = fs.readFileSync('src/services/phase4-admin-api.ts', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
assert.match(version, /^0\.19\.\d+$/, 'Phase 7-C ancestry must remain on the authorized Studio Focus 0.19 successor line.');
assert.ok(build >= 69, `Phase 7-C guided metadata successor must be Build69 or later, got Build${build}.`);
assert.ok(codename.startsWith('studio-focus-'), `Phase 7-C successor must remain inside Studio Focus lineage, got ${codename}.`);
assert.equal(pkg.version, version, 'package.json must match active Studio release metadata.');
for (const marker of ['build69AncestryMarker', 'build73AncestryMarker', 'build81AncestryMarker']) {
  assert.ok(release.includes(marker), `Current successor must preserve ${marker}.`);
}
if (build >= 110) assert.ok(release.includes('build109AncestryMarker'), 'Build110+ must preserve accepted Build109 ancestry.');

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

// Duration remains derived evidence, not generic editable metadata.
assert.ok(durationEvidence.includes("audio.crossOrigin = 'use-credentials'"));
assert.ok(durationEvidence.includes('loadedmetadata'));
assert.ok(durationEvidence.includes('measureAudioFileEvidence'));
assert.ok(metadata.includes('measureCanonicalAudioEvidence(audioUrl)'));
assert.ok(metadata.includes("derivedFields.includes('duration')"));
assert.ok(metadata.includes("proposalValue(validation.proposed, 'duration')"));
assert.ok(metadataDurationApi.includes("'5.22/1.12'"));
assert.ok(metadataDurationApi.includes("'5.23/1.13'"));
assert.ok(metadataDurationApi.includes("'5.24/1.14'"));
assert.ok(metadataDurationApi.includes('durationEvidenceBridgeCompatible'));
assert.ok(!metadataDurationApi.includes("health.trackManagerVersion !== '5.22' || health.version !== '1.12'"));
assert.ok(metadataDurationApi.includes('expectedUpdatedAt, metadata, evidence'));
assert.ok(metadataDurationApi.includes('saveAdminTrackMetadataResilient(trackId, expectedUpdatedAt, metadata, evidence, reviewed.proposed)'));
assert.ok(trackMetadataApi.includes('reviewedProposalIncludesDerivedDuration: true'));
assert.ok(trackMetadataApi.includes('manifestMatchesReviewedProposal(manifest, reviewedProposal)'));
assert.ok(phase4Api.includes("formData.set('audioDuration', String(audioEvidence.audio.duration))"));
assert.ok(phase4Api.includes("formData.set('audioReadable', 'true')"));
assert.ok(phase4Api.includes('durationVerified'));
assert.ok(!metadata.includes('name="duration"'));
assert.ok(!adminApi.match(/AdminMetadataPatch[\s\S]{0,500}\| 'duration'/));
assert.ok(!metadataDurationApi.includes('saveTrack('));

console.log(`Phase 7-C guided-metadata contract remains protected through Studio ${version} Build${build}; canonical writes, workflow routing and derived duration evidence survive the human-first presentation cleanup.`);
