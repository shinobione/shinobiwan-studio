import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const durationApi = read('src/services/metadata-duration-api.ts');
const trackMetadataApi = read('src/services/track-metadata-admin-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const pkg = JSON.parse(read('package.json'));
const currentBuild = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);

assert.match(release, /build:\s*80/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase8-duration-evidence-successor-compat'"));
assert.ok(release.includes('build79AncestryMarker'), 'Build80 must preserve Build79 publication-truth ancestry.');

assert.ok(durationApi.includes('const DURATION_EVIDENCE_BRIDGES = new Set(['), 'duration validation bridge allowlist must remain explicit');
const boundedPairs = ["'5.22/1.12'", "'5.23/1.13'", "'5.24/1.14'"];
if (currentBuild >= 114) boundedPairs.push("'5.25/1.15'");
for (const pair of boundedPairs) {
  assert.ok(durationApi.includes(pair), `duration validation must retain explicitly authorized pair ${pair}`);
  assert.ok(trackMetadataApi.includes(pair), `resilient metadata save must retain explicitly authorized pair ${pair}`);
}
assert.ok(durationApi.includes('function durationEvidenceBridgeCompatible('), 'duration validation compatibility check must remain centralized');
assert.ok((durationApi.match(/durationEvidenceBridgeCompatible\(/g) || []).length >= 2, 'validation path must use the centralized compatibility check');
assert.ok(durationApi.includes('verified duration-evidence bridge'), 'unsupported validation pair feedback must remain explicit');
assert.ok(!durationApi.includes("health.trackManagerVersion !== '5.22' || health.version !== '1.12'"), 'exact v5.22-only validation gate must never return');
assert.ok(!durationApi.includes('parseFloat(health.trackManagerVersion'), 'validation compatibility must not become an unbounded numeric >= gate');
assert.ok(!durationApi.includes('saveTrack('), 'duration evidence must not introduce a generic writer');

assert.ok(trackMetadataApi.includes('const DURATION_EVIDENCE_BRIDGES = new Set(['), 'save seam must preserve an explicit bounded duration-evidence allowlist');
assert.ok(trackMetadataApi.includes("(health.capabilities?.write ?? []).includes('metadata')"), 'guarded metadata capability must remain required at the save seam');
assert.ok(trackMetadataApi.includes('expectedUpdatedAt'), 'stale-safe revision must remain part of resilient save truth');
assert.ok(trackMetadataApi.includes('const beforeRead = await getAdminTrack(trackId);'), 'canonical pre-write Track reread must remain mandatory');
assert.ok(trackMetadataApi.includes('const reread = await getAdminTrack(trackId);'), 'canonical post-write/recovery reread must remain mandatory');
assert.ok(trackMetadataApi.includes('reviewedProposalIncludesDerivedDuration: true'), 'canonical duration must remain part of exact reviewed-proposal verification');
assert.ok(trackMetadataApi.includes('manifestMatchesReviewedProposal(manifest, reviewedProposal)'), 'Build92 must verify the complete reviewed proposal instead of revision alone');
assert.ok(!trackMetadataApi.includes('retryTrackMetadataSave'), 'duration-aware metadata save must never gain blind write retry');

assert.ok(durationApi.includes('expectedUpdatedAt, metadata, evidence'), 'validation stale-safe revision plus evidence contract must remain intact');
assert.ok(durationApi.includes('saveAdminTrackMetadataResilient(trackId, expectedUpdatedAt, metadata, evidence, reviewed.proposed)'), 'duration-aware save must converge on Build92 resilient truth');
assert.ok(metadata.includes('validateAdminTrackMetadataWithAudioEvidence(track.id, track.updatedAt, patch, evidence)'), 'Metadata UI must still use duration-aware validation');
assert.ok(metadata.includes('saveAdminTrackMetadataWithAudioEvidence(track.id, validationRevision, patch, validationEvidence)'), 'Metadata UI must still use duration-aware save');
assert.ok(pkg.scripts['check:phase8']?.includes('test-phase8-duration-evidence-successor-build80.mjs'), 'Build80 guard must run in check:phase8');

console.log(`Build80 duration-evidence successor compatibility guard passed through Build${currentBuild}: accepted bridge pairs remain explicit/bounded across validation + resilient save, unknown pairs remain locked, and duration stays derived canonical evidence.`);
