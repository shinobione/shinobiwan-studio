# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after **Build87 deployed candidate** publication. Real-user acceptance is pending.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.8
Studio build            Build86
Codename                studio-focus-slice4-phase9-album-move-response-loss-truth
Acceptance              REAL USER PASS
Runtime PR              #138
Exact tested head       0d99d17631e3f72a360f404a1269cc05cda33dd8
Final runtime CI        31868536718 · SUCCESS · first run
Runtime merge SHA       866ebf9c2a501d11102ed994717b50f6d8189b0d
Runtime Pages           31868570112 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #139
Candidate docs merge    9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7
Candidate docs Pages    31869026213 · SUCCESS
Real-user smoke         BUILD86 PASS · 2026-08-15
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
```

Build86 remains the latest **accepted** Studio runtime until Build87 receives explicit real-user browser acceptance.

## Current deployed candidate

```text
Studio version          v0.19.9
Studio build            Build87
Codename                studio-focus-slice4-phase9-album-membership-response-loss-truth
Acceptance              DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #141
Exact tested head       5f155d312b0af7227325a78480bfd424a96e7859
Final runtime CI        31870328730 · SUCCESS · first run
Runtime merge SHA       b9e1f121c7dc111ee6db06fd4d00227426d96ce7
Runtime Pages           31870370403 · SUCCESS · exact runtime merge SHA
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

Build86 changes only Studio client-side canonical **Album move** response-loss classification and verification. It covers Album→Album move plus the existing `sourceAlbumId:null` authority repair. It does **not** change Album bulk membership save, create, upload/delete, Track Manager, Workers, R2 schema/data, LaunchPAD, SonicTrace Deep Audio or LRC Maker.

Build87 changes only Studio client-side canonical **Album bulk membership / ordered tracklist save** response-loss classification and verification across the Album plus every affected Track compatibility cache. It does **not** change Album create, binary upload, Track Manager, Workers, R2 schema/data, LaunchPAD, SonicTrace Deep Audio or LRC Maker.

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
Phase 9 Slice6          Build87 DEPLOYED CANDIDATE · smoke pending
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

## Build87 candidate behavior

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

## Current blockers

No code/CI/deployment blocker remains for Build87.

**Acceptance blocker:** normal real-user browser smoke is pending. Do not promote Build87 to REAL USER PASS before an explicit verdict.

The historical `Magnetic Midnight` public-cover palette `Failed to fetch` issue remains resolved since Build62 and covered by regression guards.

## Exact next action

Run the bounded **Build87 Album tracklist regression smoke**:

1. hard refresh Studio and verify `v0.19.9 · Build87`;
2. open **Albums** and select a safe canonical Album with at least two Tracks;
3. reorder two existing Tracks using ↑ / ↓ only;
4. perform one normal **Save tracklist**;
5. expect `Album tracklist saved and canonically verified across Album + Track caches.`;
6. reload/reopen the Album and verify the order persists;
7. open one or two reordered Tracks and verify they still claim the same Album;
8. quick regression: Track → Visuals → Lyrics → SonicTrace → Albums.

Do **not** deliberately cut network/Access to manufacture response loss.

After explicit Build87 PASS, close Slice6 and run another fresh bounded audit before allocating any successor. **Build88 is UNALLOCATED.**

## Frozen stop lines

- GitHub = code authority.
- R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private orchestrator, never a generic R2 writer.
- Public fallback = read-only and never canonical-write verification.
- No blind retry after ambiguous writes.
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
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build86 is **REAL USER PASS**. Build87 is **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**. Build88 is **UNALLOCATED**.
