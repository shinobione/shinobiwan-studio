# SHINOBIWAN Studio

Private artist production cockpit and orchestrator for the SHINOBIWAN toolchain.

## Start here

For project continuation, do **not** reconstruct state from old chat transcripts or the full historical docs tree.

Read:

1. [`AGENTS.md`](AGENTS.md)
2. [`PROJECT_STATE.md`](PROJECT_STATE.md)
3. [`ROADMAP.md`](ROADMAP.md)
4. [`DECISIONS.md`](DECISIONS.md)
5. [`QA.md`](QA.md)

Then verify the real GitHub state before mutation.

## Current accepted state

```text
Studio                v0.19.12 · Build90 · REAL USER PASS
Codename              studio-focus-slice4-phase9-lyrics-private-read-transient-retry-truth
Runtime PR            #150
Exact tested head     48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01
Validation            31884568681 · SUCCESS · first run
Runtime merge         8a851a7d53d3b4f45359c7036011684441bb25bb
Runtime Pages         31884614863 · SUCCESS · exact merge SHA
Candidate docs PR     #151
Candidate docs merge  442b488511d77da15592a37d6e8d2dca0ed30fb8
Candidate docs Pages  31885123431 · SUCCESS
Acceptance docs PR    #152 · closeout in progress
Real-user smoke       BUILD90 PASS MADAFAKA · 2026-08-15
Track Manager         v5.23 · DEPLOYED
Studio bridge         v1.13
TM admin Worker       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.12 · Build90 is the current accepted runtime.** Build90 extends bounded private **GET** retry truth to canonical Lyrics reads only. Timeout, transport interruption, and HTTP `408/425/429/500/502/503/504` may receive one bounded retry; Access/CORS, deterministic ordinary 4xx, non-JSON Access gating and invalid JSON are never retried. Existing Lyrics validation/save POSTs, Build83 lost-response recovery and the no-blind-write-retry rule remain unchanged. The bounded normal-browser regression received explicit **`BUILD90 PASS MADAFAKA`** on 2026-08-15.

The repository currently publishes **no formal GitHub Release objects and no Git tags**. Runtime release identity is carried by code, docs and Pages.

## Product model

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Track Workspace:

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace summary.
- **Visuals** — cover, thumbnail and Canvas. Cover is required; Canvas is optional.
- **Lyrics** — canonical `lyrics.txt`, embedded LRC Maker and text editing.
- **Release** — final production check + browser-local Release Campaign.
- **Sonic / Details / Advanced** — full SonicTrace analysis and deliberately requested technical depth.

Production and publication remain separate axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Draft
```

## Accepted workflow authority

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same `workflow.nextAction` authority. Studio does not introduce a second queue, priority engine or generic writer.

## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             ACTIVE
Phase 9 Slice1      Build82 · REAL USER PASS
Phase 9 Slice2      Build83 · REAL USER PASS
Phase 9 Slice3      Build84 · REAL USER PASS
Phase 9 Slice4      Build85 · REAL USER PASS
Phase 9 Slice5      Build86 · REAL USER PASS
Phase 9 Slice6      Build87 · REAL USER PASS
Phase 9 Slice7      Build88 · REAL USER PASS
Phase 9 Slice8      Build89 · REAL USER PASS
Phase 9 Slice9      Build90 · REAL USER PASS
Build91             UNALLOCATED
Phase 10            FUTURE
```

The immediate next action is a **fresh bounded post-Build90 Phase9 reliability audit**. No Build91 is allocated before that audit proves a concrete smallest coherent gap.

## Frozen authority model

- **GitHub** — application-code authority.
- **Cloudflare R2** — canonical catalog/media/data authority.
- **Track Manager** — protected canonical Track/Album write authority.
- **Studio** — private cockpit/orchestrator, never a generic R2 writer.
- **LaunchPAD** — public listener UX.
- **SonicTrace** — audio intelligence.
- **LRC Maker** — lyrics synchronization.
- canonical `trackId` = the same R2 slug across the toolchain.
- public fallback is read-only and never verifies canonical writes.

## Canonical contracts

### Private reads

Build88 core Track reads, Build89 Album reads and Build90 Lyrics read all use the same bounded classification within their own domain-specific helpers:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

The contract is GET-only and capped at two total attempts. Build88 applies it to bridge health / Track inventory / Track detail; Build89 to canonical Album collection/detail; Build90 to canonical Lyrics read. None authorizes POST/write retry.

### Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` is the sole membership/artistic-order authority. Track-side Album metadata is compatibility/cache data only.

Build85 accepted failure contract for **metadata save only**:

```text
metadata save response lost
→ private canonical Album reread
   ├─ new revision + exact metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / retry may be safe
   ├─ revision changed but exact postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal metadata success also requires exact response revision + requested metadata + stable non-metadata shape. Build85 does not apply this contract to Album create, membership, move or upload.

Build86 accepted failure contract for **Album move only**:

```text
move response unavailable
→ private target + source? + Track reread
   ├─ exact target/source membership + Track cache + stable shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write target/source/Track state unchanged
   │    → NOT COMMITTED / retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Build86 does not generalize this contract to Album bulk membership, create or upload.

Build87 accepted failure contract for **Album bulk membership / ordered tracklist save only**:

```text
membership response unavailable
→ private Album + union(previous, requested) Track reread
   ├─ new Album revision + exact requested ordered trackIds
   │  + exact expected Track caches + stable non-membership shapes
   │    → COMMITTED / VERIFIED
   ├─ exact pre-write Album + Track state unchanged
   │    → NOT COMMITTED / retry may be safe after fresh reload
   ├─ partial/mixed changed state
   │    → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Requested Tracks must exist. A historically missing prior Track can still be removed. Removed Tracks whose cache claimed the Album converge to transitional `Singles`; unrelated cache claims remain unchanged. Build87 does not generalize this contract to Album create or binary upload.

Build89 changes only canonical Album GET behavior. It does not alter the Build85/86/87 write contracts. Album create and binary upload remain separate operation-specific audit families requiring stronger causality/digest proof before lost-response recovery can be safely added.

### Lyrics

```text
tracks/<slug>/lyrics.txt
```

`lyrics.txt` is the unique canonical source. Recognized timestamps define synchronization. `.lrc` is optional export/compatibility only.

Build83 accepted failure contract:

```text
save response lost
→ private canonical reread
   ├─ exact new revision + ETag + requested text → COMMITTED / VERIFIED
   ├─ unchanged revision + ETag                  → NOT COMMITTED / retry may be safe
   ├─ changed but exact postcondition unproven   → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable                         → UNVERIFIED / DO NOT RETRY
```

Build90 changes only the canonical Lyrics GET used by normal reading and by the Lyrics side of Build83 verification/recovery. It does not retry validation or save POSTs.

The bounded normal-browser Build90 smoke confirmed the deployed version, normal canonical `lyrics.txt` loading on an existing Track and surrounding Track / Albums / SonicTrace / Lyrics navigation. Acceptance did not manufacture a network or Access failure branch.

### Audio duration

`manifest.duration` is a derived canonical fact from the current master audio, never a free-form metadata field.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in analysis sidecars.

Build84 accepted failure contract:

```text
save response lost
→ private canonical reread of latest + history
   ├─ requested analysisId in both    → COMMITTED / VERIFIED
   ├─ requested analysisId in neither → NOT COMMITTED / retry may be safe
   ├─ requested analysisId in one     → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable              → UNVERIFIED / DO NOT RETRY
```

SonicTrace private reads remain a separate future audit family and are not changed by Build90.

### Release Campaign

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

Release Campaign is provider-agnostic. Google Flow is a convenience shortcut. Campaign drafts remain browser-local and ZIP export remains review-only.

## Build90 acceptance receipts

```text
Safety pre              safety/pre-phase9-lyrics-private-read-retry-build90-20260815-1419
Safety pre-PR           safety/post-build90-prepr-20260815-1424
Runtime PR              #150
Exact tested head       48ca1dc25951d65ead05c4f80bd1f9e6bf8c5d01
Validation              31884568681 · SUCCESS · first run
Runtime merge           8a851a7d53d3b4f45359c7036011684441bb25bb
Runtime Pages           31884614863 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build90-deployed-candidate-20260815-1429
Candidate docs PR       #151
Candidate docs merge    442b488511d77da15592a37d6e8d2dca0ed30fb8
Candidate docs Pages    31885123431 · SUCCESS
Safety post-acceptance  safety/post-build90-real-user-pass-20260815-1512
Acceptance docs PR      #152
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD90 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD90.md`](changelogs/CHANGELOG-BUILD90.md).

## Build89 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-private-read-retry-build89-20260815-1307
Safety pre-PR           safety/post-build89-prepr-20260815-1310
Runtime PR              #147
Exact tested head       8b73d19d8fced35642ee243cff0ac19d983fd0de
Validation              31881635973 · SUCCESS
Runtime merge           b7ae769c66e9adccef79c80467cc8fd0a8534820
Runtime Pages           31881682269 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build89-deployed-candidate-20260815-1319
Candidate docs PR       #148
Candidate docs merge    a7894dad8f4b4015ca1cba47b12781bab417fdcf
Candidate docs Pages    31882384329 · SUCCESS
Safety post-acceptance  safety/post-build89-real-user-pass-20260815-1404
Acceptance docs PR      #149
Acceptance docs merge   07bfd3c6b4fa19ccea0656b9ce194f239b7f7c65
Acceptance docs Pages   31884092117 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD89 PASS MADAFAKA · 2026-08-15
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD89.md`](changelogs/CHANGELOG-BUILD89.md).

## Build88 acceptance receipts

```text
Safety pre              safety/pre-phase9-private-read-retry-build88-20260815-0916
Runtime PR              #144
Exact tested head       808b0c63fc22f17a04a9c544b934d97c791d3a73
Validation              31871980725 · SUCCESS
Runtime merge           9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Runtime Pages           31872073050 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build88-deployed-candidate-20260815-0932
Candidate docs PR       #145
Candidate docs merge    316ad1b0784d72fb7d29d92c5deaedb56d262e49
Candidate docs Pages    31872540118 · SUCCESS
Safety post-acceptance  safety/post-build88-real-user-pass-20260815-1253
Acceptance docs PR      #146
Acceptance docs merge   aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages   31881075352 · SUCCESS
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD88 PASS MADAFAKA · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD88.md`](changelogs/CHANGELOG-BUILD88.md).

## Build87 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-membership-response-loss-build87-20260815-0837
Safety pre-PR           safety/post-build87-prepr-20260815-0844
Runtime PR              #141
Exact tested head       5f155d312b0af7227325a78480bfd424a96e7859
Validation              31870328730 · SUCCESS · first run
Runtime merge           b9e1f121c7dc111ee6db06fd4d00227426d96ce7
Runtime Pages           31870370403 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build87-deployed-candidate-20260815-0853
Candidate docs PR       #142
Candidate docs merge    453be9e9d72c9d90cd97ad5f57be02821efec12a
Candidate docs Pages    31870838391 · SUCCESS
Safety post-acceptance  safety/post-build87-real-user-pass-20260815-0903
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD87 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD87.md`](changelogs/CHANGELOG-BUILD87.md).

## Build86 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-move-response-loss-build86-20260815-0757
Runtime PR              #138
Exact tested head       0d99d17631e3f72a360f404a1269cc05cda33dd8
Validation              31868536718 · SUCCESS · first run
Runtime merge           866ebf9c2a501d11102ed994717b50f6d8189b0d
Runtime Pages           31868570112 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build86-deployed-candidate-20260815-0808
Candidate docs PR       #139
Candidate docs merge    9a03c33f6ecb472ab49c3631dd9688e3c6f03bf7
Candidate docs Pages    31869026213 · SUCCESS
Safety post-acceptance  safety/post-build86-real-user-pass-20260815-0823
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD86 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD86.md`](changelogs/CHANGELOG-BUILD86.md).

## Build85 acceptance receipts

```text
Safety pre              safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
Runtime PR              #135
Exact tested head       4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Validation              31863267911 · SUCCESS · first run
Runtime merge           1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages           31863313848 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #136
Candidate docs merge    40917edc6a341ca7d19907d8afe59123f44c8d03
Candidate docs Pages    31863566190 · SUCCESS
Safety post-deploy      safety/post-build85-deployed-candidate-20260815-0602
Safety post-acceptance  safety/post-build85-real-user-pass-20260815-0748
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD85 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD85.md`](changelogs/CHANGELOG-BUILD85.md).

## Accepted predecessors

Build84 remains the accepted Phase9 Slice3 predecessor:

```text
Studio                  v0.19.6 · Build84 · REAL USER PASS
Runtime PR              #132
Validation              31858911420 · SUCCESS
Runtime merge           b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS
Real-user smoke         BUILD84 PASS · 2026-08-15
```

Build83 and Build82 remain accepted Phase9 predecessors. See `CHANGELOG.md` and detailed per-build records for historical receipts.

## Documentation

### Canonical current truth

- [Agent startup contract](AGENTS.md)
- [Project state](PROJECT_STATE.md)
- [Roadmap](ROADMAP.md)
- [Decisions](DECISIONS.md)
- [QA / acceptance](QA.md)
- [Integration safety](docs/INTEGRATION_SAFETY.md)
- [Concise changelog](CHANGELOG.md)

### Historical evidence

- [Documentation map](docs/README.md)
- [Detailed changelog archive](changelogs/README.md)

Old `docs/ROADMAP-CURRENT.md` and `docs/NEXT-SESSION-HANDOFF.md` paths are retained as compatibility pointers only.

## Acceptance policy

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

A runtime is accepted only after exact-head CI, exact merge-SHA deployment and explicit real-user validation where required. Merge, Pages deployment, Worker deployment and R2 mutation remain separate states.
