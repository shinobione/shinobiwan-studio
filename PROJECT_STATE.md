# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after explicit **`BUILD93 PASS MADAFAKA`** real-user browser acceptance. Acceptance-docs closeout is in progress.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.15
Studio build            Build93
Codename                studio-focus-slice4-phase9-track-metadata-validation-transient-retry-truth
Acceptance              REAL USER PASS
Runtime PR              #162
Exact tested head       fcbe4c59a3a364d9665eba2ed432f37475116364
Final runtime CI        31898542379 · SUCCESS
Historical CI #457      31898251689 · FAILURE · Phase7-C successor cap only · never merged
Historical CI #458      31898329621 · FAILURE · Focus Build64 successor cap only · never merged
Runtime merge SHA       6c1ceb7d59971ec6c7e251532054392f02c08157
Runtime Pages           31898639778 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #163
Candidate docs CI       31899284370 · SUCCESS
Candidate docs merge    6464659428e34a679c8acfeb481bfaca78e05bc7
Candidate docs Pages    31899342536 · SUCCESS · exact docs merge SHA
Acceptance docs PR      PENDING
Acceptance docs CI      PENDING
Acceptance docs merge   PENDING
Acceptance docs Pages   PENDING
Real-user smoke         BUILD93 PASS MADAFAKA · 2026-08-15
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
```

Build93 is the latest **accepted** Studio runtime. Build92 remains its accepted predecessor.

## Current ecosystem baseline

```text
Track Manager           v5.23 · DEPLOYED
Studio bridge           v1.13
TM admin Worker         439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker           v2.7 · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build88 changes only the Studio core private Track Manager **GET** transport for bridge health, Track inventory and Track detail. It distinguishes transient transport from Access/CORS and permits at most one bounded retry for timeout/transport/selected transient HTTP failures. It does **not** retry writes and does not change Track Manager, Workers, R2 schema/data, LaunchPAD, SonicTrace Deep Audio or LRC Maker.

Build89 changes only canonical Album collection/detail private **GET** behavior. The same helper also serves private Album visual discovery and existing canonical Album rereads. It adds no Album POST/write retry, no Track Manager/Worker change and no R2 schema/data migration.

Build90 changes only canonical Lyrics private **GET** behavior. The same GET is used by normal Lyrics loading and by Build83 canonical save verification/recovery rereads. It adds no Lyrics validate/save POST retry, no SonicTrace read change, no Track Manager/Worker change and no R2 schema/data migration.

Build91 changes only private Track Manager SonicTrace **GET** behavior for canonical latest/history state and the SonicTrace catalog. Existing Build84 save POST/lost-response recovery, Deep Audio analysis, canonical audio download, Track Manager, Workers and R2 schema/data remain unchanged.

Build92 changes only the Studio-side canonical Track **metadata save** truth. It revalidates the exact normalized proposal immediately before POST, including derived audio duration when present, then uses private canonical Track reread to classify a lost save response without retrying the write. It changes no Track Manager/Worker route and causes no R2 schema/data migration by deployment.

Build93 changes only the Studio-side non-mutating Track **metadata validation** transport. Visible Validate and Build92 fresh pre-save validation may receive one bounded retry after timeout, browser transport interruption or HTTP `408/425/429/500/502/503/504`. Access/deterministic ordinary 4xx and invalid JSON/proposal remain non-retry. Build92 `metadata-save-v1` remains zero automatic write retries.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1          COMPLETE · Build82 REAL USER PASS
Phase 9 Slice2          COMPLETE · Build83 REAL USER PASS
Phase 9 Slice3          COMPLETE · Build84 REAL USER PASS
Phase 9 Slice4          COMPLETE · Build85 REAL USER PASS
Phase 9 Slice5          COMPLETE · Build86 REAL USER PASS
Phase 9 Slice6          COMPLETE · Build87 REAL USER PASS
Phase 9 Slice7          COMPLETE · Build88 REAL USER PASS
Phase 9 Slice8          COMPLETE · Build89 REAL USER PASS
Phase 9 Slice9          COMPLETE · Build90 REAL USER PASS
Phase 9 Slice10         COMPLETE · Build91 REAL USER PASS
Phase 9 Slice11         COMPLETE · Build92 REAL USER PASS
Phase 9 Slice12         COMPLETE · Build93 REAL USER PASS
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82–84 accepted behavior

- **Build82** hardens destructive Track/Album asset deletion ambiguity with private canonical reread and no blind retry.
- **Build83** hardens canonical `lyrics.txt` save response-loss truth with exact revision + ETag + normalized requested text verification.
- **Build84** hardens SonicTrace analysis save response-loss truth using exact `analysisId` presence across canonical latest + history.

## Build85 accepted behavior

The fresh post-Build84 audit proved **Album metadata save only** as the smallest coherent remaining Album write-truth gap. The deployed Track Manager already stale-guards, writes, verifies and rolls back this transaction; Build85 changes no backend behavior.

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision + exact requested metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ revision changed but exact metadata-only postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Stable non-metadata shape includes canonical identity, ordered `trackIds`, assets and `createdAt`, preventing unrelated membership/media drift from being mistaken for metadata-save recovery.

Normal HTTP success also requires exact server-returned revision + requested metadata + stable non-metadata shape before Studio calls the save verified.

The bounded normal-browser smoke confirmed the deployed Build85 path loads an existing canonical Album, performs a harmless metadata edit/save with canonical verification, advances the canonical revision, persists the saved value after reload, and preserves surrounding Albums / Track / Lyrics / SonicTrace navigation.

## Build86 accepted behavior

The fresh post-Build85 audit selected **Album move** as the smallest coherent remaining reliability gap. The deployed Track Manager already stale-guards target/source, computes deterministic target order/source removal, updates the Track compatibility cache, rebuilds catalog, rereads the target/source/Track triplet and rolls back touched state on transaction failure. Build86 changes no backend behavior.

```text
Album move response unavailable
→ NEVER blind automatic retry
→ private canonical target + source? + Track reread
   ├─ exact new target revision/order
   │  + exact source revision/removal when source exists
   │  + Track cache points to target
   │  + stable non-membership Album/Track shapes
   │    → COMMITTED / VERIFIED
   ├─ exact target/source/Track pre-write state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed/changed state without exact proof
   │    → AMBIGUOUS / DO NOT RETRY
   └─ canonical reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal HTTP success also requires exact server-returned target/source revisions, exact ordered target/source `trackIds`, Track cache target and stable non-membership shapes.

The bounded normal-browser smoke confirmed one genuine safe Album move, canonical source removal, target insertion/order persistence after reload, Track compatibility-cache convergence to the target Album, and surrounding Track / Visuals / Lyrics / SonicTrace / Albums navigation sanity.

## Build87 accepted behavior

The fresh post-Build86 audit selected **Album bulk membership / ordered tracklist save** as the smallest coherent remaining reliability gap. Before Build87, Studio used a generic write transport and normal success only reread the Album manifest; it did not prove every Track compatibility cache affected by membership.

Build87 privately snapshots the Album and every Track in the union of previous/requested `album.trackIds`, then applies operation-specific postconditions:

```text
Album membership response unavailable
→ NEVER blind automatic retry
→ private canonical Album + affected Track-cache reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + stable Album non-membership shape
   │  + every Track cache equals its expected postcondition
   │  + stable Track non-album shapes
   │    → COMMITTED / VERIFIED
   ├─ exact Album + Track pre-write state unchanged
   │    → NOT COMMITTED / explicit retry may be safe after fresh reload
   ├─ partial/mixed/changed state without exact proof
   │    → AMBIGUOUS / DO NOT RETRY
   └─ canonical reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Requested Tracks must exist. A historically missing prior Track may still be removed safely. Removed Tracks previously cached to the Album converge to transitional `Singles`; unrelated cache claims remain unchanged.

Normal HTTP success also requires exact returned revision/order, exact canonical Album order, every affected Track cache and stable shapes, plus `trackCachesUpdated` agreement when supplied by Track Manager.

The bounded normal-browser smoke received explicit **`BUILD87 PASS MADAFAKA`** on 2026-08-15 after a normal safe Album tracklist regression. Acceptance did not require deliberately interrupting network/Access or manufacturing a response-loss branch.

## Build88 accepted behavior

The fresh post-Build87 audit proved the core private read transport as the smallest coherent reliability gap. Before Build88, a non-timeout `fetch()` rejection was mislabeled `access-or-cors`, and the catalog layer could immediately downgrade to public fallback after one transient private failure.

Build88 preserves the existing finite per-attempt timeouts and applies this GET-only classification:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

There are at most **two total attempts**. A second failure surfaces immediately. Public fallback behavior remains in `catalog-api.ts`; it is consulted only after the private helper ultimately fails. Build88 introduces no generic retry framework and no automatic write retry.

The bounded normal-browser smoke received explicit **`BUILD88 PASS MADAFAKA`** on 2026-08-15 after Home / Tracks private inventory, normal private Track detail and Albums / Track / Lyrics / SonicTrace navigation regression checks. Acceptance did **not** require deliberately cutting network, invalidating Cloudflare Access, or manufacturing transient failure branches.

## Build89 accepted behavior

The fresh post-Build88 audit compared Album create, Album upload, broader private-read resilience and degraded/offline/PWA behavior. The smallest coherent gap was **canonical Album collection/detail private reads**.

Before Build89, the Album helper already had a finite timeout but any non-timeout browser `fetch()` rejection was still classified as `access-or-cors` and received no retry. The same helper owns Album inventory, Album detail, private visual discovery and canonical Album rereads used by existing guarded verification/recovery.

Build89 applies the same narrow GET-only classification:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

There are at most **two total attempts** and a second failure surfaces immediately.

Build89 deliberately does **not** change Album create/upload response-loss semantics, any Album POST/write path, Lyrics private-read behavior or SonicTrace private-read behavior. Album create still lacks a persisted operation identifier/pre-write revision sufficient to prove exact causality after a lost response without backend contract work. Album binary upload still lacks a client-side exact digest/ETag contract sufficient to prove selected bytes after a lost response.

The bounded normal-browser smoke received explicit **`BUILD89 PASS MADAFAKA`** on 2026-08-15 after Albums private inventory, canonical Album detail, artwork/metadata loading and surrounding Track / Lyrics / SonicTrace navigation checks. Acceptance did **not** deliberately cut network, invalidate Cloudflare Access or manufacture a transient failure branch.

## Build90 accepted behavior

The fresh post-Build89 audit compared Lyrics private reads, SonicTrace private reads, Album create/upload and degraded/offline/PWA work. The smallest coherent gap was the single canonical Lyrics GET behind `getLyricsJson()`.

Before Build90, canonical Lyrics reads had a finite 7-second timeout but any non-timeout browser `fetch()` rejection was still presented as a Cloudflare Access/authentication problem and received no retry. The POST validation/save transport was already separate and remains untouched.

Build90 applies the bounded GET-only classification:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

There are at most **two total attempts**. A second transient failure surfaces immediately.

Build83 write truth remains unchanged: `lyrics-validate-v1` / `lyrics-save-v1` POSTs are not retried, `LYRICS_SAVE_TIMEOUT` / `LYRICS_SAVE_TRANSPORT` remain intact, and lost saves still classify committed / not committed / ambiguous / unverified through private canonical Lyrics + Track reread. The only improvement is that the Lyrics side of that reread may survive one transient GET failure.

The bounded normal-browser smoke received explicit **`BUILD90 PASS MADAFAKA`** on 2026-08-15 after deployed version verification, canonical `lyrics.txt` loading on an existing Track, and surrounding Track / Albums / SonicTrace / Lyrics navigation sanity. Acceptance intentionally did **not** cut network, invalidate Cloudflare Access or manufacture transient failure branches.

## Build91 accepted behavior

The fresh post-Build90 audit compared SonicTrace private reads, Album create/upload and degraded/offline/PWA work. The smallest coherent gap was the private Track Manager SonicTrace GET helper shared by canonical latest/history state and the SonicTrace catalog.

Before Build91, those reads had finite 12-second / 20-second timeouts, but any non-timeout browser `fetch()` rejection was still presented as a Cloudflare Access/authentication problem and received no retry.

Build91 applies the bounded GET-only classification:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

There are at most **two total attempts**. A second transient failure surfaces immediately. The private helper is GET-only and cannot accept an arbitrary request method.

Build84 write truth remains unchanged: `sonictrace-analysis-save-v1` POSTs are not retried, `SONICTRACE_SAVE_TIMEOUT` / `SONICTRACE_SAVE_TRANSPORT` remain intact, and lost saves still classify committed / not committed / ambiguous / unverified through private canonical latest/history reread. The only improvement is that those canonical readbacks may survive one transient GET failure.

The bounded normal-browser smoke received explicit **`BUILD91 PASS MADAFAKA`** on 2026-08-15 after deployed version verification, normal canonical SonicTrace latest/history loading on an existing Track, a normal SonicTrace catalog/Intelligence read, and surrounding Track / Albums / Lyrics / SonicTrace navigation sanity. Acceptance intentionally did **not** cut network, invalidate Cloudflare Access or manufacture transient failure branches.

SonicTrace Deep Audio health/analysis XHR, canonical audio download, Album create/upload semantics, Track Manager, Workers and R2 schema/data remain unchanged.

## Build92 accepted behavior

The fresh post-Build91 audit rechecked Album asset upload, Album create, degraded/offline/PWA resilience, and smaller unprotected reliability gaps. Album upload still lacks a request-side digest/operation identifier sufficient to prove exact selected bytes after response loss; Album create still lacks a persisted operation identifier sufficient to attribute absent→present causally to one lost POST; PWA/offline remains cross-cutting. The smaller proven gap was the existing canonical Track metadata save.

Build92 repeats the same non-mutating metadata validation immediately before the write and anchors the save to the exact normalized `proposed` manifest at the exact expected Track revision. When canonical audio evidence exists, the reviewed proposal includes the already-supported derived `duration`; duration remains derived evidence and is not a generic editable metadata field.

```text
Track metadata save response unavailable
→ NEVER blind automatic retry
→ private canonical Track reread
   ├─ new revision + exact reviewed proposal
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry safe after reconnect
   ├─ changed revision but exact reviewed proposal unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ canonical reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal `saved:true` also requires canonical revision === server `updatedAt` plus the exact reviewed proposal. Normal `noChange:true` requires the original revision plus the exact reviewed proposal. Any mismatch is ambiguous; an unreadable reread is unverified.

The proposal comparison ignores only runtime `updatedAt` and `updatedBy`; all other normalized manifest state represented by the proposal must match. Build92 adds no write retry loop.

Track Manager rebuilds `catalog/index.json` inside the server transaction, but the private Track reread endpoint reconstructs Track state from manifests rather than reading that derived index. Therefore a recovered-after-lost-response result verifies the canonical Track manifest but intentionally does **not** fabricate an independently unobservable `catalogRebuilt:true` receipt. Normal HTTP responses retain the server's actual catalog receipt.

No Track create, Track asset upload/delete, Album create/upload, Lyrics/SonicTrace write, Track Manager/Worker, R2 schema/data or PWA/offline behavior changed.

The bounded normal-browser smoke received explicit **`BUILD92 PASS MADAFAKA`** on 2026-08-15 after deployed version verification, one harmless reversible metadata edit through Validate → one normal Save, `CANONICAL REREAD · VERIFIED`, persistence after reload, and surrounding Track / Albums / Lyrics / SonicTrace navigation sanity. Acceptance intentionally did **not** cut network, invalidate Cloudflare Access or manufacture a response-loss branch.

## Build93 accepted behavior

The fresh post-Build92 audit again compared Album asset upload, Album create, degraded/offline/PWA resilience and smaller reliability gaps. The smaller proven gap was the non-mutating Track metadata validation seam already used by both the visible Validate action and Build92 fresh pre-save proposal refresh.

Before Build93, both plain and duration-aware `metadata-validate-v1` had finite 7-second timeouts but only one attempt. A transient browser transport interruption could also be presented as a Cloudflare Access problem in the plain path.

Build93 applies one bounded retry to this non-mutating validation only:

```text
metadata-validate-v1 attempt 1
├─ timeout                            → retry once max
├─ transport interruption             → retry once max
├─ HTTP 408/425/429/500/502/503/504  → retry once max
├─ Access / deterministic ordinary 4xx → NO RETRY
├─ invalid JSON / invalid proposal    → NO RETRY
└─ success                            → return reviewed proposal

attempt 2 failure → surface immediately
```

Maximum total attempts are two. Plain and duration-aware validation use the same bounded policy. Build92 `metadata-save-v1` remains zero automatic write retries and its operation-specific response-loss truth is unchanged.

Historical CI `31898251689` failed only at the inherited Phase7-C Build69 successor cap. Historical CI `31898329621` then passed Phase7-C, Phase8 and Phase9 Build82→93 and failed only at the inherited Focus Build64 successor cap. Focus64–67 were widened only to recognize v0.19.15/Build93 while retaining functional assertions. Neither red head was merged. Final CI `31898542379` passed the complete repository-native chain on exact head `fcbe4c59a3a364d9665eba2ed432f37475116364`.

Runtime PR #162 merged that exact tested head at `6c1ceb7d59971ec6c7e251532054392f02c08157`. Pages `31898639778` completed build + deploy successfully on that exact merge SHA. Candidate docs PR #163 passed CI `31899284370`, merged at `6464659428e34a679c8acfeb481bfaca78e05bc7`, and Pages `31899342536` deployed that exact docs merge successfully.

The bounded normal-browser regression received the explicit verdict **`BUILD93 PASS MADAFAKA`** on 2026-08-15. Acceptance did **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture a transient retry; automated guards own the timeout/transport/transient-HTTP failure-path proof and two-attempt bound.

## Current blockers

**No active code / CI / deploy / real-user acceptance blocker after `BUILD93 PASS MADAFAKA`.**

The only current closure task is this documentation/receipt promotion. Build94 remains unallocated.

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue remains resolved since Build62 and covered by regression guards.

## Exact next action

1. finish Build93 acceptance-docs PR / CI / merge / Pages closeout;
2. create the final immutable post-closeout safety checkpoint;
3. run a fresh, read-only post-Build93 Phase9 reliability audit;
4. allocate Build94 **only if** that audit proves a smallest coherent gap.

Remaining audit candidates include Album asset upload response-loss truth, Album create response-loss truth, degraded/offline/PWA resilience, and any newly proven smaller bounded reliability gap. None is pre-selected.

## Frozen stop lines

- GitHub = code authority.
- R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private orchestrator, never a generic R2 writer.
- Public fallback = read-only and never canonical-write verification.
- No blind retry after ambiguous writes.
- GET retry must never become write retry without a new operation-specific audit.
- Non-mutating validation retry must never be generalized into write retry.
- No destructive production smoke merely to prove a guard.
- `lyrics.txt` remains the unique canonical lyrics source.
- `album.trackIds` remains the sole Album membership/artistic-order authority.
- Operation-specific response-loss recovery must never be generalized without a fresh audit.

## Relevant safety references

```text
safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
safety/post-build82-deployed-candidate-20260815-0248
safety/pre-phase9-lyrics-response-loss-build83-20260815-0319
safety/post-build83-real-user-pass-20260815-0406
safety/post-build83-rup-docs-closeout-20260815-0412
safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413
safety/post-build84-deployed-candidate-20260815-0425
safety/post-build84-candidate-docs-closeout-20260815-0429
safety/post-build84-real-user-pass-20260815-0435
safety/post-build84-rup-docs-closeout-20260815-0441
safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
safety/post-build85-deployed-candidate-20260815-0602
safety/post-build85-candidate-docs-closeout-20260815-0608
safety/post-build85-real-user-pass-20260815-0748
safety/post-build85-rup-docs-closeout-20260815-0755
safety/pre-phase9-album-move-response-loss-build86-20260815-0757
safety/post-build86-deployed-candidate-20260815-0808
safety/post-build86-candidate-docs-closeout-20260815-0818
safety/post-build86-real-user-pass-20260815-0823
safety/post-build86-rup-docs-closeout-20260815-0828
safety/pre-phase9-album-membership-response-loss-build87-20260815-0837
safety/post-build87-prepr-20260815-0844
safety/post-build87-deployed-candidate-20260815-0853
safety/post-build87-candidate-docs-closeout-20260815-0901
safety/post-build87-real-user-pass-20260815-0903
safety/post-build87-rup-docs-closeout-20260815-0912
safety/pre-phase9-private-read-retry-build88-20260815-0916
safety/post-build88-deployed-candidate-20260815-0932
safety/post-build88-candidate-docs-closeout-20260815-0942
safety/post-build88-real-user-pass-20260815-1253
safety/post-build88-rup-docs-closeout-20260815-1304
safety/pre-phase9-album-private-read-retry-build89-20260815-1307
safety/post-build89-prepr-20260815-1310
safety/post-build89-deployed-candidate-20260815-1319
safety/post-build89-candidate-docs-closeout-20260815-1336
safety/post-build89-real-user-pass-20260815-1404
safety/post-build89-rup-docs-closeout-20260815-1416
safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419
safety/post-build90-prepr-20260815-1424
safety/post-build90-deployed-candidate-20260815-1429
safety/post-build90-candidate-docs-closeout-20260815-1440
safety/post-build90-real-user-pass-20260815-1512
safety/post-build90-rup-docs-closeout-20260815-1524
safety/post-build90-receipts-closeout-20260815-1528
safety/pre-phase9-sonictrace-private-read-retry-build91-20260815-1546
safety/post-build91-prepr-20260815-1555
safety/post-build91-deployed-candidate-20260815-1559
safety/post-build91-candidate-docs-closeout-20260815-1608
safety/post-build91-real-user-pass-20260815-1700
safety/post-build91-rup-docs-closeout-20260815-1716
safety/post-build91-receipts-closeout-20260815-1720
safety/pre-phase9-track-metadata-response-loss-build92-20260815-1722
safety/post-build92-prepr-20260815-1740
safety/post-build92-deployed-candidate-20260815-1748
safety/post-build92-candidate-docs-closeout-20260815-1803
safety/post-build92-real-user-pass-20260815-1819
safety/post-build92-rup-docs-closeout-20260815-1841
safety/post-build92-receipts-closeout-20260815-1844
safety/pre-phase9-track-metadata-validation-retry-build93-20260815-1914
safety/post-build93-prepr-20260815-1921
safety/post-build93-prepr-final-20260815-1923
safety/post-build93-green-premerge-20260815-1931
safety/post-build93-deployed-candidate-20260815-1936
safety/post-build93-candidate-docs-prepr-20260815-1946
safety/post-build93-candidate-docs-closeout-20260815-1949
safety/post-build93-real-user-pass-20260815-2010
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build93 is **REAL USER PASS / ACCEPTED**. Build94 is **UNALLOCATED**.