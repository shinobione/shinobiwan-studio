import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const release = read('src/release.ts');
const durationApi = read('src/services/metadata-duration-api.ts');
const metadata = read('src/components/MetadataValidationPanel.tsx');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /build:\s*80/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase8-duration-evidence-successor-compat'"));
assert.ok(release.includes('build79AncestryMarker'), 'Build80 must preserve Build79 publication-truth ancestry.');

assert.ok(durationApi.includes('const DURATION_EVIDENCE_BRIDGES = new Set(['), 'duration evidence bridge allowlist must be explicit');
assert.ok(durationApi.includes("'5.22/1.12'"), 'accepted TM5.22 / bridge1.12 pair must remain supported');
assert.ok(durationApi.includes("'5.23/1.13'"), 'TM5.23 / bridge1.13 successor must be supported');
assert.ok(durationApi.includes('function durationEvidenceBridgeCompatible('), 'compatibility check must be centralized');
assert.ok((durationApi.match(/durationEvidenceBridgeCompatible\(/g) || []).length >= 3, 'validation and save paths must both use the same compatibility check');
assert.ok(durationApi.includes('verified duration-evidence bridge'), 'unsupported pair feedback must remain explicit');
assert.ok(!durationApi.includes("health.trackManagerVersion !== '5.22' || health.version !== '1.12'"), 'exact v5.22-only gate must never return');
assert.ok(!durationApi.includes('parseFloat(health.trackManagerVersion'), 'compatibility must not become an unbounded numeric >= gate');
assert.ok(!durationApi.includes('saveTrack('), 'duration evidence must not introduce a generic writer');
assert.ok(durationApi.includes("(health.capabilities?.write ?? []).includes('metadata')"), 'guarded metadata capability must remain required');
assert.ok(durationApi.includes('expectedUpdatedAt, metadata, evidence'), 'stale-safe revision plus evidence contract must remain intact');
assert.ok(durationApi.includes('const reread = await getAdminTrack(trackId);'), 'canonical reread must remain mandatory after save');
assert.ok(durationApi.includes('reread.track?.manifest?.duration'), 'canonical duration must remain part of client verification');

assert.ok(metadata.includes('validateAdminTrackMetadataWithAudioEvidence(track.id, track.updatedAt, patch, evidence)'), 'Metadata UI must still use duration-aware validation');
assert.ok(metadata.includes('saveAdminTrackMetadataWithAudioEvidence(track.id, validationRevision, patch, validationEvidence)'), 'Metadata UI must still use duration-aware save');
assert.ok(pkg.scripts['check:phase8']?.includes('test-phase8-duration-evidence-successor-build80.mjs'), 'Build80 guard must run in check:phase8');

console.log('Build80 duration-evidence successor compatibility guard passed: TM5.22/1.12 and TM5.23/1.13 are bounded-compatible, unknown pairs remain locked.');
