import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const service = read('src/services/track-metadata-admin-api.ts');
const duration = read('src/services/metadata-duration-api.ts');
const admin = read('src/services/admin-api.ts');
const pkg = JSON.parse(read('package.json'));

assert.match(release, /version:\s*'0\.19\.14'/);
assert.match(release, /build:\s*92/);
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-track-metadata-response-loss-truth'"));
assert.ok(release.includes('build91AncestryMarker'), 'Build92 must preserve accepted Build91 ancestry.');
assert.ok(release.includes("version: 0.19.13 · build: 91 · codename: 'studio-focus-slice4-phase9-sonictrace-private-read-transient-retry-truth'"));
assert.equal(pkg.version, '0.19.14', 'package version must match Build92 runtime version.');

assert.ok(service.includes("const METADATA_SAVE_INTENT = 'metadata-save-v1';"), 'Build92 must preserve the canonical Track metadata save intent.');
assert.equal((service.match(/method:\s*'POST'/g) || []).length, 1, 'Build92 resilient service must own exactly one metadata save POST transport.');
assert.ok(service.includes('globalThis.setTimeout(() => controller.abort(), 12000)'), 'Track metadata save must retain a finite 12s transport timeout.');
assert.ok(service.includes("timedOut ? 'TRACK_METADATA_SAVE_TIMEOUT' : 'TRACK_METADATA_SAVE_TRANSPORT'"), 'Timeout and transport loss must be typed separately.');
assert.ok(service.includes("'TRACK_METADATA_SAVE_INVALID_RESPONSE'"), 'Invalid save JSON/shape must remain typed.');
assert.ok(service.includes("'TRACK_METADATA_SAVE_NOT_COMMITTED'"), 'Unchanged canonical revision must classify not committed.');
assert.ok(service.includes("'TRACK_METADATA_SAVE_AMBIGUOUS'"), 'Changed but unproven canonical state must classify ambiguous.');
assert.ok(service.includes("'TRACK_METADATA_SAVE_UNVERIFIED'"), 'Unavailable canonical reread must classify unverified.');
assert.ok(service.includes("'TRACK_METADATA_ACCESS_SESSION_REQUIRED'"), 'Access gating must remain deterministic and must not enter response-loss recovery.');

assert.ok(service.includes('const beforeRead = await getAdminTrack(trackId);'), 'Build92 must privately snapshot the canonical Track before POST.');
assert.ok(service.includes('before.updatedAt !== expectedUpdatedAt'), 'Build92 must reject stale pre-write Track revision.');
assert.ok(service.includes('reviewedProposal.slug !== trackId || reviewedProposal.updatedAt !== expectedUpdatedAt'), 'Reviewed proposal must be anchored to exact Track + revision.');
assert.ok(duration.includes('const reviewed = await validateAdminTrackMetadataWithAudioEvidence(trackId, expectedUpdatedAt, metadata, evidence);'), 'Callable save must refresh the exact non-mutating proposal immediately before POST.');
assert.ok(duration.includes('saveAdminTrackMetadataResilient(trackId, expectedUpdatedAt, metadata, evidence, reviewed.proposed)'), 'Both duration-aware and plain metadata save paths must converge on Build92 resilient save truth.');
assert.ok(!duration.includes('postSaveWithEvidence'), 'Superseded duration-aware save transport must not remain callable/dead in the wrapper.');
assert.ok(!duration.includes('saveAdminTrackMetadata(trackId'), 'Build92 wrapper must not bypass resilient save via the old generic save helper.');

assert.ok(service.includes('delete comparable.updatedAt;'));
assert.ok(service.includes('delete comparable.updatedBy;'));
assert.ok(service.includes('stableJson(comparableManifest(manifest)) === stableJson(comparableManifest(reviewedProposal))'), 'Exact reviewed manifest postcondition must ignore only expected runtime revision/user fields.');
assert.ok(service.includes('const sameRevision = manifest?.updatedAt === before.updatedAt;'));
assert.ok(service.includes('const exactPostcondition = manifestMatchesReviewedProposal(manifest, reviewedProposal);'));
assert.ok(service.includes('if (!sameRevision && exactPostcondition && manifest?.updatedAt)'), 'New revision + exact reviewed proposal must recover committed truth.');
assert.ok(service.includes('if (sameRevision)'), 'Original revision must classify not committed after lost response.');
assert.ok(service.includes("commitState: 'committed'"));
assert.ok(service.includes("commitState: 'not-committed'"));
assert.ok(service.includes("'ambiguous'"));
assert.ok(service.includes("'unverified'"));
assert.ok(service.includes('RETRY SAFE AFTER RECONNECT'));
assert.ok(service.includes('DO NOT RETRY'));
assert.ok(service.includes('Studio did not retry the write.'));

assert.ok(service.includes('if (payload.noChange === true)'), 'Normal no-change response must receive canonical verification.');
assert.ok(service.includes('manifest?.updatedAt !== expectedUpdatedAt || !exactPostcondition'), 'Normal no-change must stay at original revision and exact reviewed proposal.');
assert.ok(service.includes('const revisionMatches = Boolean(payload.updatedAt && manifest?.updatedAt === payload.updatedAt);'), 'Normal saved response must verify exact server revision.');
assert.ok(service.includes('if (!revisionMatches || !exactPostcondition)'), 'Normal success must verify exact revision + reviewed proposal.');
assert.ok(service.includes("recoveredCatalogReceiptPolicy: 'do-not-claim-derived-catalog-rebuild-after-lost-response'"), 'Lost-response recovery must not fabricate a derived catalog rebuild receipt.');
assert.ok(service.includes('catalogRebuilt: false'), 'Recovered response must not claim independently unobservable catalog rebuild success.');

assert.ok(service.includes("lostResponsePolicy: 'private-canonical-revision-reviewed-proposal-reread-no-blind-retry'"));
assert.ok(service.includes('reviewedProposalIncludesDerivedDuration: true'));
assert.ok(service.includes('validationRemainsNonMutating: true'));
assert.ok(service.includes('maxAutomaticWriteRetries: 0'));
assert.ok(!service.includes('retryTrackMetadataSave'), 'Build92 must never introduce automatic Track metadata save retry.');
assert.ok(!service.includes('for (let attempt'), 'Build92 write recovery must not use retry loops.');

assert.ok(admin.includes('export async function validateAdminTrackMetadata('), 'Existing metadata validation must remain available and non-mutating.');
assert.ok(admin.includes('export async function saveAdminTrackMetadata('), 'Historical generic save helper may remain for compatibility, but the Studio metadata UI wrapper must not call it.');

for (const inherited of [
  'test-phase9-destructive-write-ambiguity-build82.mjs',
  'test-phase9-lyrics-response-loss-build83.mjs',
  'test-phase9-sonictrace-response-loss-build84.mjs',
  'test-phase9-album-metadata-response-loss-build85.mjs',
  'test-phase9-album-move-response-loss-build86.mjs',
  'test-phase9-album-membership-response-loss-build87.mjs',
  'test-phase9-private-read-transient-retry-build88.mjs',
  'test-phase9-album-private-read-transient-retry-build89.mjs',
  'test-phase9-lyrics-private-read-transient-retry-build90.mjs',
  'test-phase9-sonictrace-private-read-transient-retry-build91.mjs',
  'test-phase9-track-metadata-response-loss-build92.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must include ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Phase9 guards must remain in the full build gate.');

console.log('Phase9 Build92 Track metadata response-loss guard passed: exact reviewed proposal + canonical Track revision classify committed/not-committed/ambiguous/unverified with zero automatic write retries, duration evidence included, and normal success also canonically verified.');
