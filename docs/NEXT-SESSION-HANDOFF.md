# NEXT SESSION HANDOFF — Build81 REAL USER PASS

Updated: 2026-08-15 after explicit **BUILD81 PASS** browser validation.

## Start here

Before modifying anything, verify real GitHub/deployment state again.

Current accepted release truth:

```text
Studio                    v0.19.3 · Build81 · REAL USER PASS
Codename                  studio-focus-slice4-phase8-semantic-truth-cleanup
Build81 tested head       bdc79b8dd3fffb41c8368990d50fd733afe87fe3
Build81 CI                31850313391 · SUCCESS
Build81 runtime merge     20d587fe1b1d1a5405cd346571c8d5a0eb1d2fa4
Build81 runtime Pages     31850382728 · SUCCESS · exact runtime merge SHA
Build81 candidate docs    b151eadcec376f8bbebc0378f7e51d92c62b0a31
Build81 candidate Pages   31850596471 · SUCCESS
Build81 browser smoke     BUILD81 PASS · 2026-08-15
Build81 safety pre        safety/pre-build81-semantic-truth-20260815-0113
Build81 safety post       safety/post-build81-deployed-candidate-20260815-0129
Build81 safety post-RUP   safety/post-build81-real-user-pass-20260815-0159
Track Manager             v5.23 · DEPLOYED
Studio bridge             v1.13
TM Worker Version ID      439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker             v2.7 · unchanged
LaunchPAD public          2026.08.12.102 · REAL USER PASS
SonicTrace                V2-E Build08 · REAL USER PASS
Deep Audio                2.0.3-alpha
LRC Maker                 6.3.8
Next build                Build82 · UNUSED
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## What Build81 proved

### Sonic wording truth

The Track production stage and full analysis context now use:

```text
Sonic
TRACK / SONIC
```

The old `Sound` wording is gone from the audited Track Workspace path. SonicTrace readiness, routing and analysis behavior were not changed.

### Release Campaign provider truth

The old mutable `Premium provider` selector was decorative: its value did not alter MASTER, 1:1, 9:16 or motion prompt builders.

Build81 now states the real behavior:

```text
External image handoff
PROVIDER-AGNOSTIC
```

Google Flow remains a convenience shortcut only. Prompts remain provider-agnostic. Existing browser-local drafts keep restoring their prompts, images and copy.

### Release Campaign contract preserved

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

- 9:16 never derives from 1:1;
- New MASTER concept is non-destructive;
- drafts remain browser-local;
- ZIP remains review-only;
- `canonicalWrite: false` remains true;
- no Track Manager/R2 writer was introduced.

## Accepted lineage

```text
Phase 7-A   Build46   REAL USER PASS
Phase 7-B   Build51   REAL USER PASS
Phase 7-C   Build71   Slice1 REAL USER PASS
Phase 7-C   Build73   Slice2/program REAL USER PASS
Phase 8     Build74   Content Health Truth REAL USER PASS
Phase 8     Build75   Health Drill-down REAL USER PASS
Phase 8     Build80   cumulative Album Health/publication REAL USER PASS
Phase 8     Build81   semantic truth cleanup REAL USER PASS
```

Builds76–79 remain historical candidates/superseded corrective steps, not retroactive RUPs.

## Frozen architecture

- GitHub = application-code authority.
- Cloudflare R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private cockpit/orchestrator, never a generic R2 writer.
- LaunchPAD = public listener UX.
- SonicTrace = audio intelligence.
- LRC Maker = lyrics synchronization.
- canonical `trackId` = R2 slug everywhere.
- public fallback is read-only and never verifies canonical writes.

### Canonical Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` is sole membership/order authority. Track-side Album metadata is compatibility cache only.

### Canonical lyrics

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronization authority
.lrc                      = optional export / compatibility only
```

### Canonical audio duration

`manifest.duration` is derived from the canonical master audio. It is not free-form metadata. Duration-aware metadata paths must use an explicitly validated bridge pair and retain capability, stale-revision and private-reread guards.

## What comes next

Do **not** allocate Build82 automatically.

The first remaining focused issue is the **asset-selection error previously observed on `Magnetic Midnight`**. It must be reproduced before any fix is designed.

Fresh audit should determine whether the failure belongs to:

- canonical Visual asset selection/upload;
- Release Campaign browser-local image import;
- file decoding/dimension inspection;
- IndexedDB/browser-local draft persistence;
- Track Manager asset mutation/stale revision handling;
- or another bounded path.

Capture the exact visible error and runtime route first. Do not widen write authority while investigating.

## Rolling premium interaction backlog

Still retained:

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth reduced-motion-safe transitions.

## Later roadmap

**Phase 9 — Security / reliability / PWA**: Access/CORS hardening, retries/timeouts, anti-loss/ambiguous-write behavior, degraded/offline UX, PWA resilience.

**Phase 10 — Progressive extraction**: potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE8-BUILD81.md`
- `changelogs/CHANGELOG-PHASE8-BUILD80.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Build81 is the accepted REAL USER PASS baseline. TM v5.23 / bridge1.13 remains deployed. Build82 is unused: reproduce the next real issue before runtime mutation.**
