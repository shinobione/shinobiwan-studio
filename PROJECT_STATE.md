# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after **Build89 deployed candidate** publication. Real-user acceptance is pending.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.10
Studio build            Build88
Codename                studio-focus-slice4-phase9-private-read-transient-retry-truth
Acceptance              REAL USER PASS
Runtime PR              #144
Exact tested head       808b0c63fc22f17a04a9c544b934d97c791d3a73
Final runtime CI        31871980725 · SUCCESS
Runtime merge SHA       9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Runtime Pages           31872073050 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #145
Candidate docs merge    316ad1b0784d72fb7d29d92c5deaedb56d262e49
Candidate docs Pages    31872540118 · SUCCESS · exact docs merge SHA
Acceptance docs PR      #146
Acceptance docs merge   aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages   31881075352 · SUCCESS
Real-user smoke         BUILD88 PASS MADAFAKA · 2026-08-15
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
```

Build88 remains the latest **accepted** Studio runtime until Build89 receives explicit real-user browser acceptance.

## Current deployed candidate

```text
Studio version          v0.19.11
Studio build            Build89
Codename                studio-focus-slice4-phase9-album-private-read-transient-retry-truth
Acceptance              DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #147
Exact tested head       8b73d19d8fced35642ee243cff0ac19d983fd0de
Final runtime CI        31881635973 · SUCCESS
Runtime merge SHA       b7ae769c66e9adccef79c80467cc8fd0a8534820
Runtime Pages           31881682269 · SUCCESS · exact runtime merge SHA
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
```

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

Build88 changes only the Studio core private Track Manager **GET** transport for bridge health, Track inventory and Track detail. It distinguishes transient transport from Access/CORS and permits at most one bounded retry for timeout/transport/selected transient HTTP failures. It does **not** retry writes.

Build89 changes only the Studio canonical Album collection/detail private **GET** helper. The same bounded one-retry policy now protects Album inventory/detail/private visual discovery and existing canonical Album rereads, while all Album POST/write transports remain unchanged. Lyrics and SonicTrace private reads remain separate future audit families.

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
Phase 9 Slice8          Build89 DEPLOYED CANDIDATE · smoke pending
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82–84 accepted behavior

- **Build82** hardens destructive Track/Album asset deletion ambiguity with private canonical reread and no blind retry.
- **Build83** hardens canonical `lyrics.txt` save response-loss truth with exact revision + ETag + normalized requested text verification.
- **Build84** hardens SonicTrace analysis save response-loss truth using exact `analysisId` presence across canonical latest + history.

## Build85 accepted behavior

Album metadata save lost-response truth is operation-specific: new revision + exact requested metadata + stable non-metadata shape is verified committed; unchanged original revision is not committed/retry-safe; changed but unproven is ambiguous; unreadable canonical state is unverified. No blind retry.

## Build86 accepted behavior

Album move response-loss truth requires exact target/source membership plus Track compatibility cache and stable shapes. Exact unchanged target/source/Track state is retry-safe not-committed; partial/mixed state is ambiguous. No blind retry.

## Build87 accepted behavior

Album bulk membership / ordered tracklist save privately verifies the Album plus every affected Track compatibility cache. Requested Tracks must exist; historically missing prior Tracks may be removed. No blind retry after lost response.

## Build88 accepted behavior

The fresh post-Build87 audit proved the core private read transport as the smallest coherent reliability gap. Before Build88, a non-timeout `fetch()` rejection was mislabeled `access-or-cors`, and the catalog layer could immediately downgrade to public fallback after one transient private failure.

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

There are at most **two total attempts**. A second failure surfaces immediately. Build88 introduces no generic retry framework and no automatic write retry.

The bounded normal-browser smoke received explicit **`BUILD88 PASS MADAFAKA`** on 2026-08-15 after Home / Tracks private inventory, normal private Track detail and Albums / Track / Lyrics / SonicTrace navigation regression checks. Acceptance did not manufacture network/Access failure branches.

## Build89 deployed candidate behavior

The fresh post-Build88 audit compared Album create, Album upload, broader private-read resilience and degraded/offline/PWA behavior.

The smallest coherent gap was **Album collection/detail private reads**:

- the Album helper already had a finite timeout;
- non-timeout browser `fetch()` rejection was still mislabeled `access-or-cors`;
- no bounded transient retry existed;
- the same helper owns Album inventory, Album detail, private visual discovery and existing canonical Album rereads used by write verification/recovery.

Build89 now applies the same narrow GET-only classification:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

Maximum attempts: **2 total**. A second failure surfaces immediately.

Build89 explicitly does **not** change:

- Album create response-loss semantics;
- Album binary upload response-loss semantics;
- any Album POST/write retry behavior;
- Lyrics private-read behavior;
- SonicTrace private-read behavior;
- Track Manager / Workers / R2 schema/data.

Album create remains deferred because absent→present creation lacks a persisted operation identifier/pre-write revision sufficient to prove exact causality after a lost response without a backend contract change. Binary upload remains deferred because Studio lacks an exact precomputable digest/ETag contract for the selected bytes after a lost response.

## Current blockers

**Build89 real-user browser smoke is the only active blocker.**

Historical CI runs `31881467538` and `31881538488` were red only because inherited Phase7-C / Studio Focus successor allowlists stopped at Build88. Those heads were never merged. Final runtime CI `31881635973` passed the complete chain on exact head `8b73d19d8fced35642ee243cff0ac19d983fd0de`.

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue remains resolved since Build62 and covered by regression guards.

## Exact next action

Run the bounded **normal-browser Build89 smoke**:

1. hard refresh Studio and verify `v0.19.11 · Build89`;
2. open **Albums** and verify the normal private Album inventory loads;
3. open at least one canonical Album detail;
4. verify private artwork / metadata load normally;
5. quick Track / Lyrics / SonicTrace navigation sanity.

Do **not** deliberately cut network or invalidate Cloudflare Access merely to manufacture the retry branch. Automated guards own the failure-path classification proof.

**Do not allocate Build90 while Build89 acceptance is pending.**

## Frozen stop lines

- GitHub = code authority.
- R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private orchestrator, never a generic R2 writer.
- Public fallback = read-only and never canonical-write verification.
- No blind retry after ambiguous writes.
- GET retry must never become write retry without a new operation-specific audit.
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
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build88 is **REAL USER PASS**. Build89 is **DEPLOYED CANDIDATE**. Build90 is **UNALLOCATED**.
