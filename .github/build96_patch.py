from pathlib import Path
import re

ROOT = Path('.')


def load(path):
    return (ROOT / path).read_text(encoding='utf-8')


def save(path, text):
    (ROOT / path).write_text(text, encoding='utf-8')


def replace1(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one literal match, got {count}')
    return text.replace(old, new, 1)


def sub1(text, pattern, repl, label, flags=0):
    out, count = re.subn(pattern, repl, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f'{label}: expected one regex match, got {count}')
    return out


# Runtime: create normal-success verification only.
p = 'src/services/album-admin-api.ts'
t = load(p)
old_create = "export async function createAdminAlbum(album: { id: string } & AdminAlbumMetadataPatch) { assertId(album.id); await requireManage('album-create'); const payload = await writeJson('/api/studio/albums', { intent: INTENT.create, album }); if (!payload.created || !payload.album) throw new AlbumAdminError('Track Manager returned an invalid Album create response.'); return verify(album.id, payload); }"
new_create = """export async function createAdminAlbum(album: { id: string } & AdminAlbumMetadataPatch) {
  assertId(album.id);
  await requireManage('album-create');
  const payload = await writeJson('/api/studio/albums', { intent: INTENT.create, album });
  if (!payload.created || !payload.album) throw new AlbumAdminError('Track Manager returned an invalid Album create response.');
  const { id, ...metadata } = album;
  return verify(id, payload, { expectedMetadata: metadata });
}"""
t = replace1(t, old_create, new_create, 'Album create success verification')
t = replace1(
    t,
    "  privateReadMaxAttempts: 2,\n});",
    "  privateReadMaxAttempts: 2,\n  createSuccessVerificationPolicy: 'canonical-reread-revision-plus-requested-metadata',\n  createLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry',\n  maxAutomaticCreateRetries: 0,\n});",
    'Album create policy metadata',
)
save(p, t)

# Release identity + accepted Build95 ancestry.
p = 'src/release.ts'
t = load(p)
t = replace1(
    t,
    "  version: '0.19.17',\n  build: 95,\n  codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence',\n  releasedAt: '2026-08-15',",
    "  version: '0.19.18',\n  build: 96,\n  codename: 'studio-focus-slice4-phase9-album-create-success-verification-truth',\n  releasedAt: '2026-08-16',",
    'Build96 release identity',
)
t = replace1(
    t,
    "export const build94AncestryMarker = \"version: 0.19.16 · build: 94 · codename: 'studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth'\";",
    "export const build94AncestryMarker = \"version: 0.19.16 · build: 94 · codename: 'studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth'\";\nexport const build95AncestryMarker = \"version: 0.19.17 · build: 95 · codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'\";",
    'Build95 ancestry marker',
)
save(p, t)

# Package identity + Phase9 guard.
p = 'package.json'
t = load(p)
t = replace1(t, '"version": "0.19.17"', '"version": "0.19.18"', 'package version')
t = replace1(
    t,
    'node scripts/test-phase9-albums-daily-resilient-convergence-build95.mjs",',
    'node scripts/test-phase9-albums-daily-resilient-convergence-build95.mjs && node scripts/test-phase9-album-create-success-verification-build96.mjs",',
    'package Phase9 Build96 guard',
)
save(p, t)

# Known inherited successor caps.
p = 'scripts/test-phase7-c-guided-metadata-build69.mjs'
t = load(p)
t = t.replace('|16|17)', '|16|17|18)')
t = t.replace('|94|95)', '|94|95|96)')
t = replace1(
    t,
    'phase9-albums-daily-resilient-service-convergence))',
    'phase9-albums-daily-resilient-service-convergence|phase9-album-create-success-verification-truth))',
    'Build69 codename successor',
)
t = replace1(
    t,
    "if (/build:\\s*95/.test(release)) assert.ok(release.includes('build94AncestryMarker'), 'Build95 must preserve accepted Build94 Phase9 ancestry.');",
    "if (/build:\\s*(?:95|96)/.test(release)) assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 Phase9 ancestry.');\nif (/build:\\s*96/.test(release)) assert.ok(release.includes('build95AncestryMarker'), 'Build96 must preserve accepted Build95 Phase9 ancestry.');",
    'Build69 Build95/96 ancestry',
)
t = t.replace('Build82-Build95 Phase9 successor compatibility', 'Build82-Build96 Phase9 successor compatibility')
t = t.replace('Build95 preserves Build94 accepted ancestry while converging the daily Albums UI onto accepted resilient mutation services.', 'Build96 preserves Build95 accepted ancestry while tightening Album create normal-success verification without widening response-loss semantics.')
save(p, t)

# Focus 64-67 successor caps follow the same bounded pattern.
for p in [
    'scripts/test-studio-focus-build64-foundation-repair.mjs',
    'scripts/test-studio-focus-build65-lyrics-crash-corrective.mjs',
    'scripts/test-studio-focus-build66-asset-identity-lyrics-continuity.mjs',
    'scripts/test-studio-focus-build67-lyrics-source-anchor.mjs',
]:
    t = load(p)
    t = t.replace("'0.19.17'].includes(pkg.version)", "'0.19.17', '0.19.18'].includes(pkg.version)")
    t = t.replace('v0.19.3-v0.19.17', 'v0.19.3-v0.19.18')
    t = t.replace('|16|17)', '|16|17|18)')
    t = t.replace('|94|95)', '|94|95|96)')
    t = replace1(
        t,
        "if (/build:\\s*95/.test(release)) assert.ok(release.includes('build94AncestryMarker'), 'Build95 must preserve accepted Build94 Phase9 ancestry.');",
        "if (/build:\\s*(?:95|96)/.test(release)) assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 Phase9 ancestry.');\nif (/build:\\s*96/.test(release)) assert.ok(release.includes('build95AncestryMarker'), 'Build96 must preserve accepted Build95 Phase9 ancestry.');",
        f'{p} Build95/96 ancestry',
    )
    t = t.replace('v0.19.17 Phase9 successor', 'v0.19.18 Phase9 successor')
    save(p, t)

# Build93 bounded successor.
p = 'scripts/test-phase9-track-metadata-validation-transient-retry-build93.mjs'
t = load(p)
t = replace1(
    t,
    "assert.ok(['0.19.15', '0.19.16', '0.19.17'].includes(pkg.version), 'Build93 guard accepts Build93 and its bounded Build94/Build95 successors.');\nif (pkg.version === '0.19.17') assert.ok(release.includes('build94AncestryMarker'), 'Build95 must preserve accepted Build94 ancestry while inheriting Build93 validation truth.');",
    "assert.ok(['0.19.15', '0.19.16', '0.19.17', '0.19.18'].includes(pkg.version), 'Build93 guard accepts Build93 and its bounded Build94/Build95/Build96 successors.');\nif (['0.19.17', '0.19.18'].includes(pkg.version)) assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 ancestry while inheriting Build93 validation truth.');\nif (pkg.version === '0.19.18') assert.ok(release.includes('build95AncestryMarker'), 'Build96 must preserve accepted Build95 ancestry while inheriting Build93 validation truth.');",
    'Build93 successor cap',
)
save(p, t)

# Build94 bounded successor.
p = 'scripts/test-phase9-lyrics-validation-transient-retry-build94.mjs'
t = load(p)
t = replace1(
    t,
    "assert.ok(['0.19.16', '0.19.17'].includes(pkg.version), 'Build94 guard accepts Build94 and its bounded Build95 successor.');",
    "assert.ok(['0.19.16', '0.19.17', '0.19.18'].includes(pkg.version), 'Build94 guard accepts Build94 and its bounded Build95/Build96 successors.');\nif (pkg.version === '0.19.18') assert.ok(release.includes('build95AncestryMarker'), 'Build96 must preserve accepted Build95 ancestry while inheriting Build94 validation truth.');",
    'Build94 successor cap',
)
save(p, t)

# Build95 becomes accepted ancestry under bounded Build96.
p = 'scripts/test-phase9-albums-daily-resilient-convergence-build95.mjs'
t = load(p)
old = """assert.ok(release.includes(\"version: '0.19.17'\"), 'Build95 must publish Studio v0.19.17.');
assert.ok(release.includes('build: 95'), 'Build95 release identity is missing.');
assert.ok(release.includes(\"codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'\"), 'Build95 codename mismatch.');
assert.ok(release.includes('build94AncestryMarker'), 'Build95 must preserve accepted Build94 ancestry.');
assert.ok(
  release.includes(\"version: 0.19.16 · build: 94 · codename: 'studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth'\"),
  'Build94 accepted runtime identity must remain immutable in ancestry.',
);"""
new = """assert.ok(['0.19.17', '0.19.18'].includes(pkg.version), 'Build95 guard accepts Build95 and its bounded Build96 successor.');
assert.ok(release.includes('build94AncestryMarker'), 'Build95+ must preserve accepted Build94 ancestry.');
assert.ok(
  release.includes(\"version: 0.19.16 · build: 94 · codename: 'studio-focus-slice4-phase9-lyrics-validation-transient-retry-truth'\"),
  'Build94 accepted runtime identity must remain immutable in ancestry.',
);
if (pkg.version === '0.19.17') {
  assert.ok(release.includes(\"version: '0.19.17'\"), 'Build95 runtime version mismatch.');
  assert.ok(release.includes('build: 95'), 'Build95 release identity is missing.');
  assert.ok(release.includes(\"codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'\"), 'Build95 codename mismatch.');
}
if (pkg.version === '0.19.18') {
  assert.ok(release.includes('build95AncestryMarker'), 'Build96 must preserve accepted Build95 ancestry.');
  assert.ok(release.includes(\"version: 0.19.17 · build: 95 · codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'\"), 'Build95 accepted runtime identity must remain immutable in ancestry.');
}"""
t = replace1(t, old, new, 'Build95 successor header')
t = t.replace('Phase9 Build95 daily Albums resilient-service convergence guard passed:', 'Phase9 Build95 daily Albums resilient-service convergence guard passed as accepted ancestry:')
save(p, t)

# New Build96 guard.
new_guard = r'''import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const release = read('src/release.ts');
const albumApi = read('src/services/album-admin-api.ts');
const focused = read('src/components/AlbumsWorkspace.tsx');
const legacy = read('src/components/AlbumManager.tsx');
const pkg = JSON.parse(read('package.json'));

assert.equal(pkg.version, '0.19.18', 'Build96 package version must be v0.19.18.');
assert.ok(release.includes("version: '0.19.18'"), 'Build96 release version mismatch.');
assert.ok(release.includes('build: 96'), 'Build96 release identity is missing.');
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-create-success-verification-truth'"), 'Build96 codename mismatch.');
assert.ok(release.includes('build95AncestryMarker'), 'Build96 must preserve accepted Build95 ancestry.');
assert.ok(release.includes("version: 0.19.17 · build: 95 · codename: 'studio-focus-slice4-phase9-albums-daily-resilient-service-convergence'"), 'Accepted Build95 identity must remain immutable in ancestry.');

// Build96 tightens only normal-success canonical verification for Album create.
assert.ok(albumApi.includes("const payload = await writeJson('/api/studio/albums', { intent: INTENT.create, album });"), 'Album create must retain the existing Track Manager write intent and transport.');
assert.ok(albumApi.includes('const { id, ...metadata } = album;'), 'Album create must separate immutable id from the exact requested metadata postcondition.');
assert.ok(albumApi.includes('return verify(id, payload, { expectedMetadata: metadata });'), 'Album create normal success must reread and compare the exact requested metadata.');
assert.ok(!albumApi.includes('return verify(album.id, payload);'), 'Revision-only Album create verification must not return.');
assert.ok(albumApi.includes('function metadataMismatch('), 'Build96 must reuse the existing exact metadata comparator rather than introduce a second truth model.');
assert.ok(albumApi.includes("createSuccessVerificationPolicy: 'canonical-reread-revision-plus-requested-metadata'"));
assert.ok(albumApi.includes("createLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry'"), 'Build96 must state that create lost-response recovery remains out of scope.');
assert.ok(albumApi.includes('maxAutomaticCreateRetries: 0'), 'Album create must retain zero automatic retries.');
assert.ok(!albumApi.includes('retryAdminAlbumCreate'), 'Build96 must not add an Album create retry helper.');

// Upload is deliberately not generalized: exact-byte proof still requires stronger digest/operation identity.
assert.ok(albumApi.includes("form.set('intent', INTENT.upload)"), 'Album asset upload must retain its existing transport.');
assert.ok(albumApi.includes('return verify(albumId, payload);'), 'Build96 must leave upload verification semantics unchanged.');

// Both existing create surfaces inherit the service fix and still refuse unverified success.
for (const [name, source] of [['focused', focused], ['legacy', legacy]]) {
  assert.ok(source.includes('createAdminAlbum'), `${name} Album create surface must keep using the shared canonical create service.`);
  assert.ok(source.includes('result.clientVerified'), `${name} Album create surface must reject a create that the canonical reread cannot verify.`);
}

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
  'test-phase9-track-metadata-validation-transient-retry-build93.mjs',
  'test-phase9-lyrics-validation-transient-retry-build94.mjs',
  'test-phase9-albums-daily-resilient-convergence-build95.mjs',
  'test-phase9-album-create-success-verification-build96.mjs',
]) assert.ok(pkg.scripts['check:phase9']?.includes(inherited), `Phase9 gate must retain ${inherited}`);
assert.ok(pkg.scripts.build?.includes('npm run check:phase9'), 'Build96 must remain inside the repository-native full build gate.');

console.log('Phase9 Build96 Album create success-verification guard passed: normal success now proves revision + exact requested metadata, while create lost-response recovery and binary upload remain explicitly out of scope with zero automatic create retries.');
'''
save('scripts/test-phase9-album-create-success-verification-build96.mjs', new_guard)

# Candidate changelog.
changelog = '''# SHINOBIWAN Studio — Build96

Date: 2026-08-16  
Version: `v0.19.18`  
Build: `96`  
Codename: `studio-focus-slice4-phase9-album-create-success-verification-truth`  
Status: **IMPLEMENTED CANDIDATE · CI PENDING**

## Fresh-audit decision

The post-Build95 read-only audit compared the remaining heavy reliability candidates against smaller operation-specific seams.

- Full Album create lost-response recovery still lacks a persisted operation identifier capable of proving causality after an absent→present transition.
- Album binary upload still lacks request-side digest / operation identity sufficient to prove that canonical bytes are exactly the selected bytes after response loss.
- Deep Audio automatic retry remains unsafe while duplicate expensive compute cannot be excluded.

The smaller proven gap is on **normal successful Album create**. `createAdminAlbum()` already performed a private canonical reread, but it called the shared `verify()` helper without the requested metadata. A matching response/canonical revision could therefore set `clientVerified=true` without proving that the requested `title`, `type`, `year`, `releaseDate` or any other supplied create metadata actually matched canonical state.

## Build96 scope

Build96 changes only Studio-side normal-success verification:

```text
album-create-v1 HTTP success
→ existing private canonical Album reread
→ require exact returned/canonical revision
→ require every requested metadata key/value to match canonical manifest
   ├─ exact → clientVerified=true
   └─ mismatch / reread unavailable → clientVerified=false + existing warning
```

The implementation reuses the existing `metadataMismatch()` + `verify(... expectedMetadata ...)` path already used by Album metadata save. It does not create a second comparison model.

## Explicit non-goals

Build96 does **not** add:

- Album create response-loss recovery;
- any automatic Album create retry;
- operation IDs;
- Album asset upload digest/response-loss recovery;
- Track Manager / Worker changes;
- R2 schema/data changes;
- Album metadata/membership/move algorithm changes;
- Lyrics, Track metadata, SonicTrace or Deep Audio behavior changes;
- LaunchPAD or LRC Maker changes.

Create lost-response policy remains explicit: `not-covered-no-operation-id-no-blind-retry`, with `maxAutomaticCreateRetries: 0`.

## Safety

```text
Accepted base main      00a0d891a020268c1531b7d2ea232ac4200dc7d7
Safety pre              safety/pre-phase9-album-create-success-verification-build96-20260816
Feature branch          phase9/build96-album-create-success-verification
Worker deploy           NONE planned
Track Manager change    NONE
R2 migration/write      NONE caused by implementation
```

CI, merge, Pages and real-user acceptance remain separate states.
'''
save('changelogs/CHANGELOG-BUILD96.md', changelog)

# Sanity checks before committing.
checks = {
    'src/services/album-admin-api.ts': [
        'return verify(id, payload, { expectedMetadata: metadata });',
        "createLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry'",
        'maxAutomaticCreateRetries: 0',
    ],
    'src/release.ts': ["version: '0.19.18'", 'build: 96', 'build95AncestryMarker'],
    'package.json': ['"version": "0.19.18"', 'test-phase9-album-create-success-verification-build96.mjs'],
    'scripts/test-phase9-album-create-success-verification-build96.mjs': ['Build96 Album create success-verification guard passed'],
    'changelogs/CHANGELOG-BUILD96.md': ['IMPLEMENTED CANDIDATE · CI PENDING'],
}
for path, needles in checks.items():
    text = load(path)
    for needle in needles:
        if needle not in text:
            raise SystemExit(f'{path}: missing Build96 marker {needle}')

for temp in [ROOT / '.github/build96_patch.py', ROOT / '.github/workflows/build96-patch-once.yml']:
    if temp.exists():
        temp.unlink()

print('Build96 bounded patch applied and verified.')
