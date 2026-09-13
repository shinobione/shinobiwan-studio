import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const service = read('src/services/catalog-rebuild-identity.ts');
const panel = read('src/components/CatalogRebuildPanel.tsx');
const phase4 = read('src/services/phase4-admin-api.ts');
const release = read('src/release.ts');
const pkg = JSON.parse(read('package.json'));

assert.ok(['0.19.29', '0.19.30'].includes(pkg.version), 'Build108 guard accepts the Build107-hosted candidate and accepted Build108 successor.');
if (pkg.version === '0.19.29') {
  assert.match(release, /version: '0\.19\.29'/);
  assert.match(release, /build: 107/);
  assert.match(release, /studio-focus-slice4-phase10-shared-catalog-projection-kernel/);
} else {
  assert.match(release, /version: '0\.19\.30'/);
  assert.match(release, /build: 108/);
  assert.match(release, /studio-focus-slice4-catalog-rebuild-generation-identity/);
  assert.match(release, /build107AncestryMarker/);
  assert.match(release, /version: '0\.19\.29' · build: 107 · codename: 'studio-focus-slice4-phase10-shared-catalog-projection-kernel'/);
}
assert.match(pkg.scripts['check:build108'], /test-build108-catalog-generation-identity\.mjs/);
assert.match(pkg.scripts.build, /check:build108/);

for (const required of [
  "const CATALOG_REBUILD_INTENT = 'catalog-rebuild-v1';",
  'globalThis.crypto?.randomUUID?.()',
  "operationIdentity: 'browser-uuid-v4'",
  "canonicalProof: 'private-catalog-generation-id'",
  'maxAutomaticWriteRetries: 0',
  "lostResponsePolicy: 'reread-generation-id-no-blind-retry'",
  'operationId,',
  'catalogProjection',
  'CATALOG_REBUILD_TIMEOUT',
  'CATALOG_REBUILD_TRANSPORT',
  'CATALOG_REBUILD_AMBIGUOUS',
  'CATALOG_REBUILD_UNVERIFIED',
  'CATALOG_REBUILD_IDENTITY_MISMATCH',
  'CATALOG_REBUILD_SUPERSEDED',
  'sameGeneration(state, operationId)',
  'recoveredAfterTransportFailure: true',
]) assert.ok(service.includes(required), `Build108 Studio contract missing: ${required}`);

assert.match(service, /body: JSON\.stringify\(\{[\s\S]*intent: CATALOG_REBUILD_INTENT,[\s\S]*confirm: 'REBUILD',[\s\S]*operationId,/);
assert.match(service, /const payload = await getAdminTracks\(\) as AdminTracksWithCatalogProjection/);
assert.match(service, /state\.generationId\?\.toLowerCase\(\) === operationId/);
assert.match(service, /if \(!payload\.rebuilt \|\| payload\.operationId\?\.toLowerCase\(\) !== operationId \|\| payload\.catalogGenerationId\?\.toLowerCase\(\) !== operationId\)/);
assert.doesNotMatch(service, /for \(let attempt/);
assert.doesNotMatch(service, /while \(/);
assert.doesNotMatch(service, /setTimeout\([^)]*=>[^)]*postCatalogRebuild/);

assert.match(panel, /catalog-rebuild-identity/);
assert.match(panel, /CATALOG REBUILD RECOVERED/);
assert.match(panel, /generation \{result\.catalogGenerationId \|\| '—'\}/);
assert.match(panel, /operation UUID/);

// Build108 must not silently widen generic Phase4 write retry behavior.
assert.match(phase4, /trackCreateLostResponsePolicy: 'private-creation-operation-id-exact-match-no-blind-retry'/);
assert.match(phase4, /maxAutomaticTrackCreateRetries: 0/);

console.log(`Build108 Studio catalog generation identity PASS under ${pkg.version}: explicit rebuilds use one browser UUID, response-loss recovery proves the exact private canonical generationId, mismatches remain non-retryable, and no unrelated write family was widened.`);
