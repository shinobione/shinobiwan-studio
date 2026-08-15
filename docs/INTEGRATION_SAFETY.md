# SHINOBIWAN Studio — Integration Safety Policy

Date established: 2026-08-08  
Hardened: 2026-08-09  
Current-state overlay refreshed: 2026-08-15  
Current accepted Studio release: `v0.19.12` / Build `90` / REAL USER PASS  
Current deployed candidate: `v0.19.13` / Build `91` / REAL USER SMOKE PENDING

This policy is mandatory for work affecting LaunchPAD, Track Manager, SonicTrace, LRC Maker or shared production data.

For short current state, read root `PROJECT_STATE.md` first. This file contains the detailed safety contract.

## Protected production projects

- `shinobione/LaunchPAD-APP` (`main`)
- Track Manager runtime inside `LaunchPAD-APP`
- `shinobione/LM-IA-Analayse` (`main`)
- `shinobione/lrc-maker` (`master`)
- `shinobione/shinobiwan-studio` (`main`)

## Current production overlay

```text
Studio accepted
  v0.19.12 / Build90 / REAL USER PASS
  exact tested head 48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01
  runtime CI 31884568681 / SUCCESS / first run
  runtime merge 8a851a7d53d3b4f45359c7036011684441bb25bb
  runtime Pages 31884614863 / SUCCESS
  candidate docs PR #151
  candidate docs merge 442b488511d77da15592a37d6e8d2dca0ed30fb8
  candidate docs Pages 31885123431 / SUCCESS
  acceptance docs PR #152
  acceptance docs merge ebc501df90b8a8bf9229da4a61d7784beba13b78
  acceptance docs Pages 31887090784 / SUCCESS
  browser smoke BUILD90 PASS MADAFAKA / 2026-08-15
  Worker deploy NONE
  Track Manager change NONE
  R2 migration/write NONE caused by deployment

Studio candidate
  v0.19.13 / Build91 / DEPLOYED CANDIDATE
  exact tested head b8ee223b2d077e5d14936530be219f78ed7910ac
  runtime CI 31888303536 / SUCCESS / first run
  runtime merge 591b81a3930f1ba6d9f91f6e4f7d6e31550e5cf6
  runtime Pages 31888346988 / SUCCESS
  browser smoke PENDING
  Worker deploy NONE
  Track Manager change NONE
  R2 migration/write NONE caused by deployment

LaunchPAD
  2026.08.12.102 / REAL USER PASS

Track Manager / LaunchPAD backend
  Track Manager v5.23 / Studio bridge v1.13
  deployment run 31842482166 / SUCCESS / target admin
  Worker Version ID 439a1ce4-e458-427d-9fd6-61e888efd269
  public Worker v2.7 unchanged

SonicTrace
  V2-E Build08 / REAL USER PASS
  Deep Audio 2.0.3-alpha

LRC Maker
  6.3.8
```

Historical Phase6/Phase7/Phase8 and earlier Phase9 checkpoints remain immutable history; this overlay distinguishes current accepted production truth from the currently deployed candidate.

## Restoration checkpoints

Most relevant current references:

```text
Accepted Build81 runtime/docs:
  safety/post-build81-real-user-pass-20260815-0159
  safety/post-build81-rup-docs-closeout-20260815-0208

Before Phase9 Build82:
  safety/pre-phase9-destructive-ambiguity-build82-20260815-0216

After Build82 deployment candidate:
  safety/post-build82-deployed-candidate-20260815-0248

Before Phase9 Build83:
  safety/pre-phase9-lyrics-response-loss-build83-20260815-0319

After Build83 real-user acceptance:
  safety/post-build83-real-user-pass-20260815-0406
  safety/post-build83-rup-docs-closeout-20260815-0412

Before Phase9 Build84:
  safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413

After Build84 deployment candidate:
  safety/post-build84-deployed-candidate-20260815-0425
  safety/post-build84-candidate-docs-closeout-20260815-0429

After Build84 real-user acceptance:
  safety/post-build84-real-user-pass-20260815-0435
  safety/post-build84-rup-docs-closeout-20260815-0441

Before Phase9 Build85:
  safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555

After Build85 deployment candidate:
  safety/post-build85-deployed-candidate-20260815-0602
  safety/post-build85-candidate-docs-closeout-20260815-0608

After Build85 real-user acceptance:
  safety/post-build85-real-user-pass-20260815-0748
  safety/post-build85-rup-docs-closeout-20260815-0755

Before Phase9 Build86:
  safety/pre-phase9-album-move-response-loss-build86-20260815-0757

After Build86 deployment candidate:
  safety/post-build86-deployed-candidate-20260815-0808
  safety/post-build86-candidate-docs-closeout-20260815-0818

After Build86 real-user acceptance:
  safety/post-build86-real-user-pass-20260815-0823
  safety/post-build86-rup-docs-closeout-20260815-0828

Before Phase9 Build87:
  safety/pre-phase9-album-membership-response-loss-build87-20260815-0837

After Build87 implementation before PR:
  safety/post-build87-prepr-20260815-0844

After Build87 deployment candidate:
  safety/post-build87-deployed-candidate-20260815-0853
  safety/post-build87-candidate-docs-closeout-20260815-0901

After Build87 real-user acceptance:
  safety/post-build87-real-user-pass-20260815-0903
  safety/post-build87-rup-docs-closeout-20260815-0912

Before Phase9 Build88:
  safety/pre-phase9-private-read-retry-build88-20260815-0916

After Build88 deployment candidate:
  safety/post-build88-deployed-candidate-20260815-0932
  safety/post-build88-candidate-docs-closeout-20260815-0942

After Build88 real-user acceptance:
  safety/post-build88-real-user-pass-20260815-1253
  safety/post-build88-rup-docs-closeout-20260815-1304

Before Phase9 Build89:
  safety/pre-phase9-album-private-read-retry-build89-20260815-1307

After Build89 implementation before PR:
  safety/post-build89-prepr-20260815-1310

After Build89 deployment candidate:
  safety/post-build89-deployed-candidate-20260815-1319
  safety/post-build89-candidate-docs-closeout-20260815-1336

After Build89 real-user acceptance:
  safety/post-build89-real-user-pass-20260815-1404
  safety/post-build89-rup-docs-closeout-20260815-1416

Before Phase9 Build90:
  safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419

After Build90 implementation before PR:
  safety/post-build90-prepr-20260815-1424

After Build90 deployment candidate:
  safety/post-build90-deployed-candidate-20260815-1429
  safety/post-build90-candidate-docs-closeout-20260815-1440

After Build90 real-user acceptance:
  safety/post-build90-real-user-pass-20260815-1512
  safety/post-build90-rup-docs-closeout-20260815-1524
  safety/post-build90-receipts-closeout-20260815-1528

Before Phase9 Build91:
  safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546

After Build91 implementation before PR:
  safety/post-build91-prepr-20260815-1555

After Build91 deployment candidate:
  safety/post-build91-deployed-candidate-20260815-1559
```

Earlier accepted safety branches remain preserved in Git history.

## Mandatory sequence

For every risky integration step:

1. inspect current production branch and version/build rules;
2. create a fresh safety snapshot when crossing a new runtime/write/security boundary;
3. use a dedicated feature branch;
4. make the smallest independently reversible change;
5. update version/build metadata and relevant documentation;
6. add or extend regression guards;
7. open a dedicated PR with dependency and rollback notes;
8. run repository-native CI;
9. never merge red CI;
10. merge only the exact tested head;
11. keep source merge, web deployment, Worker deployment and R2/catalog mutation as distinct states;
12. verify a deployed dependency before enabling its consumer;
13. record REAL USER PASS separately when the roadmap requires browser validation.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## Product boundaries

### LaunchPAD

LaunchPAD remains the public listening/PWA product. Public UI maintenance may advance its Build without implying a Worker deployment.

### Track Manager

Track Manager remains the protected production R2 write/admin authority and standalone fallback.

Current private backend:

```text
Track Manager v5.23
Studio bridge v1.13
workflow run 31842482166 / SUCCESS / admin only
Worker Version ID 439a1ce4-e458-427d-9fd6-61e888efd269
public Worker v2.7 unchanged
```

### SHINOBIWAN Studio

Studio remains the private orchestrator, never a second canonical write authority.

Build83 changes only client-side canonical Lyrics save response-loss classification/recovery.

Build84 changes only client-side SonicTrace **save response-loss classification and canonical verification**. It does not alter the Deep Audio analysis computation, the Track Manager route semantics, Workers or R2 schema/data.

Build85 changes only client-side canonical **Album metadata save** response-loss classification and verification. It does not alter Album create, membership/order, move, upload, asset-delete semantics, Track Manager, Workers or R2 schema/data.

Build86 changes only client-side canonical **Album move** response-loss classification and verification for Album→Album movement plus `sourceAlbumId:null` authority repair. It does not alter bulk membership save, create, upload/delete, Track Manager, Workers or R2 schema/data.

Build87 changes only client-side canonical **Album bulk membership / ordered tracklist save** response-loss classification and complete Album + affected Track-cache verification. It does not alter Album create, binary upload/delete, Track Manager, Workers or R2 schema/data.

Build88 changes only the core private Track Manager **GET** transport for bridge health, Track inventory and Track detail. It adds one bounded retry for timeout/transport/selected transient HTTP failures and changes no POST/write retry behavior, Track Manager route, Worker or R2 data/schema.

Build89 changes only canonical Album collection/detail private **GET** behavior. The same helper also serves private Album visual discovery and existing canonical Album rereads. Build89 changes no Album POST/write transport, no Track Manager route, no Worker and no R2 data/schema.

Build90 changes only canonical Lyrics private **GET** behavior. It adds one bounded retry for timeout/transport/selected transient HTTP failures. It changes no `lyrics-validate-v1` or `lyrics-save-v1` POST behavior, no Build83 lost-response recovery rule, no Track Manager route, no Worker and no R2 data/schema.

Build91 changes only private Track Manager SonicTrace **GET** behavior for canonical latest/history state and the SonicTrace catalog. It adds one bounded retry for timeout/transport/selected transient HTTP failures. It changes no `sonictrace-analysis-save-v1` POST behavior, no Build84 lost-response recovery rule, no Deep Audio health/analysis XHR, no canonical audio download behavior, no Track Manager route, no Worker and no R2 data/schema.

### SonicTrace

SonicTrace remains the audio-intelligence compute engine. R2 sidecars hold durable catalog-linked analysis. No duplicate canonical WAV is stored in analysis persistence.

### LRC Maker

LRC Maker remains the lyrics synchronization engine against the canonical TXT authority.

## Canonical lyrics boundary

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

Canonical save uses Track Manager only, with manifest revision + lyrics ETag stale guards and private reread verification.

Build83 accepted bounded lost-response recovery:

```text
Lyrics save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of lyrics + Track manifest
   ├─ new revision + new ETag + exact requested normalized text
   │    → COMMITTED / VERIFIED
   ├─ same revision + same ETag
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ changed but exact postcondition is not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

### Build90 Lyrics private-read boundary — ACCEPTED

Build90 does not change the save transaction above. It changes only the canonical Lyrics GET used by normal loading and by the Lyrics side of Build83 verification/recovery rereads:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- the existing finite 7-second per-attempt timeout remains;
- a transport blip must not be mislabeled as Access;
- Access/CORS and invalid responses must not be hammered with automatic retries;
- `rereadLyricsTruth()` may survive one transient Lyrics GET failure but still never retries the save POST.

Build90 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Lyrics-read regression acceptance. The browser smoke did not deliberately break network or Access; automated guards own the transient failure-path proof.

## SonicTrace persistence boundary

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

The deployed Track Manager owns history → latest → reread/verification and rollback attempts. Build84 adds Studio-side truth after a lost HTTP response:

```text
SonicTrace save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of latest + history
   ├─ requested analysisId in BOTH
   │    → COMMITTED / VERIFIED
   ├─ requested analysisId in NEITHER
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ requested analysisId in only one
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Build84 is **REAL USER PASS** after explicit normal-browser regression acceptance.

### Build91 SonicTrace private-read boundary — CANDIDATE

Build91 does not change the save transaction above. It changes only private Track Manager SonicTrace GETs used by normal canonical latest/history state loading, the SonicTrace catalog and Build84 verification/recovery rereads:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- finite 12-second state and 20-second catalog per-attempt timeouts remain;
- a transport blip must not be mislabeled as Access;
- Access/CORS and invalid responses must not be hammered with automatic retries;
- the helper is GET-only and cannot accept arbitrary methods;
- Build84 verification/recovery may survive one transient SonicTrace GET failure but still never retries the save POST;
- Deep Audio health/analysis XHR and canonical audio download remain out of scope.

Build91 is **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**. Acceptance must be a normal-browser SonicTrace-read regression, not a manufactured network failure.

## Album authority boundary

```text
albums/<album-id>/manifest.json
ordered album.trackIds = sole membership + artistic-order authority
```

Track-side `album` metadata is compatibility cache only. Generic Track metadata writes must never mutate Album membership independently of guarded Album operations.

### Build85 metadata-save boundary

The deployed Track Manager metadata route already owns:

```text
expectedUpdatedAt stale guard
→ write proposed Album manifest
→ update title-dependent Track caches when required
→ rebuild catalog
→ canonical Album reread / verification
→ rollback touched Album + Track state on failure
```

Build85 changes no backend transaction. It adds client truth if the HTTP response disappears:

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision + exact requested metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ changed revision but exact metadata-only postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Stable non-metadata shape includes canonical identity, ordered `trackIds`, assets and `createdAt`. This is deliberately metadata-specific and must not be copied into membership/move/create/upload recovery without an operation-specific audit.

Build85 is **REAL USER PASS** after the explicit 2026-08-15 normal-browser Album metadata regression verdict.

### Build86 Album-move boundary — ACCEPTED

The deployed Track Manager move route already owns:

```text
target/source stale guards
→ deterministic target insert/source removal
→ write target/source Albums
→ update one Track compatibility cache when required
→ rebuild catalog
→ reread target + source? + Track
→ verify membership/cache
→ rollback touched state on failure
```

Build86 changes no backend transaction. It adds Studio-side truth if the HTTP response becomes unavailable:

```text
Album move response unavailable
→ NEVER blind automatic retry
→ private canonical target + source? + Track reread
   ├─ exact new target revision/order
   │  + exact source revision/removal when source exists
   │  + Track cache points to target
   │  + stable non-membership shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write target/source/Track state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal success also requires exact response revisions, exact target/source tracklists and Track cache verification. Build86 covers **only** `album-track-move-v1`; bulk membership save, create and upload remain separate operation-specific audit families.

Build86 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Album move regression acceptance.

### Build87 Album-membership boundary — ACCEPTED

The deployed Track Manager membership route already owns:

```text
Album stale guard
→ ownership-conflict validation
→ deterministic ordered membership
→ deterministic affected Track-cache updates
→ write Album + affected Track caches
→ rebuild catalog
→ Album reread / verification
→ rollback touched Album + Track caches + catalog on failure
```

Build87 changes no backend transaction. It adds Studio-side pre-write and post-write truth across the Album plus every Track in the union of previous/requested `album.trackIds`:

```text
Album membership response unavailable
→ NEVER blind automatic retry
→ private canonical Album + affected Track-cache reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + stable Album non-membership shape
   │  + every Track cache equals its exact expected postcondition
   │  + stable Track non-album shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write Album + Track state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Operation-specific compatibility-cache semantics:

- requested Track → cache points to the canonical Album;
- removed Track whose cache claimed that Album → transitional `Singles` cache;
- removed Track whose cache did not claim that Album → cache remains unchanged;
- historically missing prior Track may be removed and remains absent;
- missing Track may never be newly requested.

Normal success also requires exact response revision/order, exact canonical Album order, every affected Track cache and `trackCachesUpdated` agreement when the server supplies it. Build87 is deliberately limited to **bulk membership / ordered tracklist save**; Album create and binary upload remain separate audit families.

Build87 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Album tracklist regression acceptance.

### Build89 Album private-read boundary — ACCEPTED

Build89 changes no Album backend transaction. It changes only canonical Album GET classification:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- canonical Album collection/detail use the bounded helper;
- private Album visual discovery inherits the collection read;
- existing guarded Album write verification/recovery rereads inherit the canonical detail GET;
- no Album POST/write is retried by Build89;
- Album create and binary upload remain unchanged future audit families.

Build89 is **REAL USER PASS** after explicit 2026-08-15 normal-browser Album private-read regression acceptance. The browser smoke did not deliberately break network or Access; automated guards own the transient failure-path proof.

## Studio write boundary

Studio uses specialized, domain-scoped routes. Never create a generic arbitrary cross-origin `saveTrack()` or generic R2 writer.

Existing families include:

```text
metadata validate/save
canonical lyrics validate/save
track create
per-asset upload/delete
explicit catalog rebuild
SonicTrace sidecar save/read
Album metadata/membership/media guarded operations
```

Whole-track deletion remains outside the Studio bridge.

## Cloudflare Access / CORS safety

- no Cloudflare Access secret in GitHub Pages;
- no R2 credential in GitHub Pages;
- exact Studio origin remains `https://shinobione.github.io`;
- credentialed CORS never uses `*`;
- browser JSON-like control POSTs use established `text/plain;charset=UTF-8` simple-request transport where required;
- multipart uploads use browser-generated `FormData` without forced `Content-Type`;
- every private operation is capability/Access gated;
- public fallback is read-only and never verifies a write;
- no PUT/PATCH/DELETE browser method is introduced merely for convenience.

### Build88 private-read retry boundary — ACCEPTED

The core private read transport is deliberately narrow:

```text
timeout                         → one retry max
transport/fetch interruption     → one retry max
HTTP 408/425/429/500/502/503/504 → one retry max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Rules:

- maximum two total attempts;
- only bridge health, Track inventory and Track detail private GETs use this helper;
- a transport blip must not be mislabeled as an Access failure;
- Access/CORS must not be hammered with automatic retries;
- public fallback remains read-only and is reached only after the private helper ultimately fails;
- this GET retry policy does **not** authorize retrying any POST, write, upload, delete, catalog rebuild or validation operation.

Build88 changes no Track Manager/backend transaction and requires no Worker or R2 migration. Build88 is **REAL USER PASS** after explicit normal-browser private-read regression acceptance.

## Ambiguous-write policy — Phase9 authority

A lost HTTP response does **not** prove whether a write committed.

For any write hardened under Phase9:

```text
write response lost / timeout
→ NEVER automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

A retry may be presented as safe only when canonical reread proves the exact operation-specific pre-write state/postcondition allows it.

A lost-response write may be recovered as success only when the operation-specific canonical postcondition is positively verified.

Public fallback can never perform this verification.

### Build82 accepted scope

Track + Album asset delete. Recovery requires exact private canonical reread and operation-specific asset absence/revision truth. Build82 is **REAL USER PASS**.

### Build83 accepted scope

Canonical `lyrics.txt` save. Recovered success requires new manifest revision + new Lyrics ETag + exact requested normalized text. Build83 is **REAL USER PASS**.

### Build84 accepted scope

SonicTrace analysis save. Recovered success requires the requested `analysisId` in canonical latest + history. Build84 is **REAL USER PASS**.

### Build85 accepted scope

Album **metadata save only**. Recovered success requires a new Album revision + exact requested metadata + unchanged non-metadata Album shape. Explicit retry safety requires the original revision to remain canonical.

Build85 is **REAL USER PASS**. Do not generalize this into Album membership/move/create/upload behavior.

### Build86 accepted scope

Album **move only** (`album-track-move-v1`). Recovered success requires exact target/source membership/order, Track cache target and stable non-membership shapes. Explicit retry safety requires the exact pre-write target/source/Track state to remain canonical.

Build86 is **REAL USER PASS**. Do not generalize it into bulk membership/create/upload behavior.

### Build87 accepted scope

Album **bulk membership / ordered tracklist save only**. Recovered success requires exact new Album revision/order, exact expected compatibility cache for every affected Track and stable non-membership shapes. Explicit retry safety requires the exact pre-write Album + Track state to remain canonical.

Build87 is **REAL USER PASS**. Do not generalize it into Album create/upload behavior.

### Build88 accepted scope

Core private **GET retry only**. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP status allowlist. This is not an ambiguous-write recovery contract and must never be used as justification for automatically retrying writes.

Build88 is **REAL USER PASS** after the explicit 2026-08-15 normal-browser private-read regression verdict. Acceptance did not manufacture a failure branch.

### Build89 accepted scope

Canonical Album collection/detail **GET retry only**. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP allowlist. It changes no Album write retry rule.

Build89 is **REAL USER PASS** after the explicit 2026-08-15 normal-browser Album private-read regression verdict. Acceptance did not manufacture a failure branch.

### Build90 accepted scope

Canonical Lyrics **GET retry only**. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP allowlist. This is not authorization to retry `lyrics-validate-v1`, `lyrics-save-v1`, or any other write.

Build90 is **REAL USER PASS** after explicit 2026-08-15 normal-browser canonical Lyrics-read regression acceptance. Acceptance did not manufacture a failure branch.

### Build91 candidate scope

Private Track Manager SonicTrace **GET retry only** for canonical latest/history state plus the SonicTrace catalog. One retry is allowed only after timeout, transport interruption or the explicit transient HTTP allowlist. This is not authorization to retry `sonictrace-analysis-save-v1`, Deep Audio analysis, canonical audio download or any other write.

Build91 remains **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING** until normal-browser SonicTrace read acceptance.

## Destructive/media verification policy

Do not mutate a real production WAV, cover, video, Album cover or lyrics object merely to prove destructive/media code can mutate it.

Preferred proof:

- source-scope guard;
- typecheck/build;
- stale checks;
- canonical reread logic;
- explicit UI confirmation;
- disposable Draft asset only if a deliberate destructive browser smoke is truly required.

Build85 acceptance did **not** require deliberately cutting network/Access during a production metadata save just to manufacture response loss. A normal harmless metadata edit/save was sufficient for regression acceptance.

Build86 acceptance likewise did **not** require deliberately cutting network/Access during a production move. A normal legitimate safe move was sufficient for regression acceptance.

Build87 acceptance likewise did **not** require deliberately cutting network/Access. A harmless reorder of existing Tracks in one safe Album was sufficient.

Build88 acceptance likewise did **not** require deliberately cutting network or invalidating Access merely to prove the transient GET retry branch. Automated guards own that failure-path proof; browser acceptance was a normal private-read regression.

Build89 acceptance likewise did **not** require deliberately cutting network or invalidating Access. Automated guards own the transient failure-path proof; browser acceptance was a normal Album private-read regression.

Build90 acceptance likewise did **not** require deliberately cutting network or invalidating Access. Automated guards own the transient failure-path proof; browser acceptance was a normal canonical Lyrics-read regression.

Build91 candidate smoke likewise must **not** deliberately cut network or invalidate Access merely to prove the transient GET retry branch. Automated guards own that failure-path proof; browser acceptance should be a normal canonical SonicTrace-read regression.

## Version / deployment discipline

Treat separately:

1. code merged;
2. GitHub Pages deployed;
3. Worker deployed;
4. R2/catalog data changed;
5. real-user acceptance recorded.

For private Track Manager-only Worker changes, prefer `target=admin` and `confirm=DEPLOY`.

Build82, Build83, Build84, Build85, Build86, Build87, Build88, Build89, Build90 and Build91 required no Worker deployment. Build91 Pages deployment caused no intentional R2 schema/data migration.

Docs-only governance/closeout work does not create a new Studio build.

## Rollback principle

If a regression appears:

1. stop the next integration step;
2. do not compensate with unrelated media/catalog edits;
3. revert the responsible PR first where possible;
4. redeploy only the affected Worker from known-good source if backend-only;
5. use immutable safety branches only when normal revert is insufficient;
6. independently verify LaunchPAD, Track Manager, SonicTrace, LRC Maker and Studio before resuming.

## Stop line

**Build90 is the accepted Studio REAL USER PASS baseline. Build91 is DEPLOYED CANDIDATE · REAL USER SMOKE PENDING. Build92 is UNALLOCATED. Track Manager v5.23 / bridge v1.13 remains the sole deployed protected write authority.**
