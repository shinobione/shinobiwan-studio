import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const durationApi = read('src/services/metadata-duration-api.ts');
const trackMetadataApi = read('src/services/track-metadata-admin-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /build:\s*80/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase8-duration-evidence-successor-compat'"));
assert.ok(release.includes('build79AncestryMarker'), 'Build80 must preserve Build79 publication-truth ancestry.');

assert.ok(durationApi.includes('const DURATION_EVIDENCE_BRIDGES = new Set(['), 'duration validation bridge allowlist must remain explicit');
assert.ok(durationApi.includes("'5.22/1.12'"), 'accepted TM5.22 / bridge1.12 validation pair must remain supported');
assert.ok(durationApi.includes("'5.23/1.13'"), 'TM5.23 / bridge1.13 validation successor must remain supported');
assert.ok(durationApi.includes("'5.24/1.14'"), 'TM5.24 / bridge1.14 corrective successor must remain supported');
assert.ok(durationApi.includes('function durationEvidenceBridgeCompatible('), 'duration validation compatibility check must remain centralized');
assert.ok((durationApi.match(/durationEvidenceBridgeCompatible\(/g) || []).length >= 2, 'validation path must use the centralized compatibility check');
assert.ok(durationApi.includes('verified duration-evidence bridge'), 'unsupported validation pair feedback must remain explicit');
assert.ok(!durationApi.includes("health.trackManagerVersion !== '5.22' || health.version !== '1.12'"), 'exact v5.22-only validation gate must never return');
assert.ok(!durationApi.includes('parseFloat(health.trackManagerVersion'), 'validation compatibility must not become an unbounded numeric >= gate');
assert.ok(!durationApi.includes('saveTrack('), 'duration evidence must not introduce a generic writer');

assert.ok(trackMetadataApi.includes("const DURATION_EVIDENCE_BRIDGES = new Set(['5.22/1.12', '5.23/1.13', '5.24/1.14']);"), 'Build92 save seam must preserve the same bounded duration-evidence bridge pairs');
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

console.log('Build80 duration-evidence successor compatibility guard passed through Build92: TM5.22/1.12, TM5.23/1.13 and TM5.24/1.14 remain bounded-compatible across validation + resilient save, unknown pairs remain locked, and duration stays derived canonical evidence.');
