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
Studio                v0.19.10 · Build88 · REAL USER PASS
Codename              studio-focus-slice4-phase9-private-read-transient-retry-truth
Runtime PR            #144
Exact tested head     808b0c63fc22f17a04a9c544b934d97c791d3a73
Validation            31871980725 · SUCCESS
Runtime merge         9d4f0a7ba4cd17de1d4d6c69e4abe6bc706c7633
Runtime Pages         31872073050 · SUCCESS
Candidate docs PR     #145
Candidate docs merge  316ad1b0784d72fb7d29d92c5deaedb56d262e49
Candidate docs Pages  31872540118 · SUCCESS
Acceptance docs PR    #146
Acceptance docs merge aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages 31881075352 · SUCCESS
Real-user smoke       BUILD88 PASS MADAFAKA · 2026-08-15
Track Manager         v5.23 · DEPLOYED
Studio bridge         v1.13
TM admin Worker       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.10 · Build88 remains the current accepted runtime.** Build88 changes only the core private **GET** transport used by Track Manager bridge health, Track inventory and Track detail. Timeout, transport interruption, and HTTP `408/425/429/500/502/503/504` may receive **one** bounded retry; Access/CORS, deterministic ordinary 4xx and invalid JSON are never retried. Public fallback is unchanged. **No write retry was introduced.** The bounded normal-browser regression received explicit **`BUILD88 PASS MADAFAKA`** on 2026-08-15.

## Current deployed candidate

```text
Studio                v0.19.11 · Build89 · DEPLOYED CANDIDATE
Codename              studio-focus-slice4-phase9-album-private-read-transient-retry-truth
Runtime PR            #147
Exact tested head     8b73d19d8fced35642ee243cff0ac19d983fd0de
Validation            31881635973 · SUCCESS
Runtime merge         b7ae769c66e9adccef79c80467cc8fd0a8534820
Runtime Pages         31881682269 · SUCCESS
Real-user smoke       PENDING
Worker deploy         NONE
Track Manager change  NONE
R2 migration/write    NONE caused by deployment
```

Build89 applies the same bounded GET-only retry truth to canonical Album collection/detail reads. The helper also serves private Album visual discovery and existing canonical Album rereads used by guarded verification/recovery. **Album POST/write transports are unchanged.** Lyrics and SonicTrace private reads remain separate future audit families.

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
Phase 9 Slice8      Build89 · DEPLOYED CANDIDATE · smoke pending
Build90             UNALLOCATED
Phase 10            FUTURE
```

The immediate next action is the bounded normal-browser **Build89 Album private-read smoke**. Do not allocate Build90 while acceptance is pending.

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

Build88 accepted core Track-read contract and Build89 candidate Album-read contract use the same bounded classification:

```text
timeout                         → retry once max
transport/fetch interruption     → retry once max
HTTP 408/425/429/500/502/503/504 → retry once max
401/403                         → Access/CORS · NO RETRY
other deterministic 4xx          → HTTP · NO RETRY
non-JSON Access/gating response  → Access/CORS · NO RETRY
invalid JSON                     → invalid-response · NO RETRY
```

The contract is GET-only and capped at two total attempts. Build88 applies it to health/Tracks. Build89 applies it to Album collection/detail reads. Neither build authorizes POST/write retry.

### Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` is the sole membership/artistic-order authority. Track-side Album metadata is compatibility/cache data only.

Build85 accepted failure contract for **metadata save only**:

```text
metadata save response lost
→ private canonical Album reread
   ├─ new revision + exact metadata + stable non-metadata shape → COMMITTED / VERIFIED
   ├─ original revision unchanged                              → NOT COMMITTED / retry may be safe
   ├─ revision changed but exact postcondition unproven        → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable                                       → UNVERIFIED / DO NOT RETRY
```

Build86 accepted failure contract for **Album move only**:

```text
move response unavailable
→ private target + source? + Track reread
   ├─ exact target/source membership + Track cache + stable shapes → COMMITTED / VERIFIED
   ├─ exact pre-write target/source/Track state unchanged          → NOT COMMITTED / retry may be safe
   ├─ partial/mixed changed state                                  → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable                                           → UNVERIFIED / DO NOT RETRY
```

Build87 accepted failure contract for **Album bulk membership / ordered tracklist save only**:

```text
membership response unavailable
→ private Album + union(previous, requested) Track reread
   ├─ new Album revision + exact order + expected Track caches → COMMITTED / VERIFIED
   ├─ exact pre-write Album + Track state unchanged            → NOT COMMITTED / retry may be safe
   ├─ partial/mixed changed state                              → AMBIGUOUS / DO NOT RETRY
   └─ reread unavailable                                       → UNVERIFIED / DO NOT RETRY
```

Build89 does not change any of those write contracts. Album create and binary upload remain separate future audit families requiring stronger causality/digest proof before lost-response recovery can be safely added.

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

### Release Campaign

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

Release Campaign is provider-agnostic. Google Flow is a convenience shortcut. Campaign drafts remain browser-local and ZIP export remains review-only.

## Build89 candidate receipts

```text
Safety pre              safety/pre-phase9-album-private-read-retry-build89-20260815-1307
Safety pre-PR           safety/post-build89-prepr-20260815-1310
Runtime PR              #147
Exact tested head       8b73d19d8fced35642ee243cff0ac19d983fd0de
Validation              31881635973 · SUCCESS
Runtime merge           b7ae769c66e9adccef79c80467cc8fd0a8534820
Runtime Pages           31881682269 · SUCCESS · exact runtime merge SHA
Safety post-deploy      safety/post-build89-deployed-candidate-20260815-1319
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         PENDING
```

Detailed candidate record: [`changelogs/CHANGELOG-BUILD89.md`](changelogs/CHANGELOG-BUILD89.md).

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
Acceptance docs PR      #146
Acceptance docs merge   aebb168883c1f291b97e1d309b4028bb1d78861c
Acceptance docs Pages   31881075352 · SUCCESS
Safety post-acceptance  safety/post-build88-real-user-pass-20260815-1253
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
Real-user smoke         BUILD88 PASS MADAFAKA · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD88.md`](changelogs/CHANGELOG-BUILD88.md).

## Build87 acceptance receipts

```text
Runtime PR              #141
Exact tested head       5f155d312b0af7227325a78480bfd424a96e7859
Validation              31870328730 · SUCCESS · first run
Runtime merge           b9e1f121c7dc111ee6db06fd4d00227426d96ce7
Runtime Pages           31870370403 · SUCCESS
Real-user smoke         BUILD87 PASS · 2026-08-15
```

Detailed record: [`changelogs/CHANGELOG-BUILD87.md`](changelogs/CHANGELOG-BUILD87.md).

## Accepted predecessors

Build86, Build85, Build84, Build83 and Build82 remain accepted Phase9 predecessors. See `CHANGELOG.md` and detailed per-build records for historical receipts.

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
