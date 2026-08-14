# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-14 after **Phase 8 Slice 1 / Build74 REAL USER PASS**.

This file is the **current roadmap authority**. Historical build detail belongs in milestone docs and [`../changelogs/`](../changelogs/README.md).

## Current state

```text
Studio accepted    v0.19.3 · Build 74    Phase 8 Slice 1 · REAL USER PASS
Phase 7-A          Build 46              REAL USER PASS
Phase 7-B          Build 51              REAL USER PASS
Phase 7-C          Slice 1               COMPLETE · REAL USER PASS via Build71
Phase 7-C          Slice 2               COMPLETE · REAL USER PASS via Build73
Phase 7-C          Program               COMPLETE · no Slice3 runtime required
Phase 8            Slice 1               COMPLETE · REAL USER PASS via Build74
Next runtime       Phase 8               next bounded sub-scope to audit
Next build         Build 75              UNUSED / do not allocate before fresh audit
Track Manager      v5.22                 duration evidence corrective · DEPLOYED
Studio bridge      v1.12
TM admin Worker    df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker      v2.7                  unchanged
LaunchPAD          2026.08.12.102        C3-C · REAL USER PASS
SonicTrace         V2-E Build 08         REAL USER PASS
Deep Audio         2.0.3-alpha
LRC Maker          6.3.8
```

### Immediate gate

Build74 is the **current accepted Studio baseline**.

Phase8 Slice1 is closed. Before any Build75 mutation:

1. reread real GitHub state;
2. define the next bounded Phase8 sub-scope;
3. prove it does not duplicate the accepted Build74 Content Health layer, C3-B SonicTrace Intelligence, or Phase7 `workflow.nextAction`;
4. create a fresh safety checkpoint from accepted `main`;
5. preserve the exact-head CI → anti-drift → exact merge-SHA deployment → real-user smoke gate.

No Track Manager / Worker deployment or R2 migration occurred for Build74.

## Frozen architecture

- GitHub = application-code authority.
- Cloudflare R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private artist cockpit/orchestrator.
- LaunchPAD = public listener experience.
- SonicTrace = audio-intelligence engine.
- LRC Maker = lyrics synchronization engine.
- canonical `trackId` is identical across the toolchain.
- no generic Studio write route and no second R2 owner.
- public fallback is read-only and never invents private state or verifies a write.

## Accepted foundations

```text
Phase 0   architecture/data contracts                         ✅
Phase 1   Studio shell                                        ✅
Phase 2   Catalog                                             ✅
Phase 3   Track Workspace                                     ✅
Phase 4   Track Manager integration                           ✅
Phase 5   SonicTrace / Catalog Intelligence                   ✅
Phase 6   Lyrics / LRC                                        ✅ REAL USER VALIDATED
PHASE UX                                                       ✅ REAL USER VALIDATED
Phase 7-A Workflow Overview                                   ✅ REAL USER PASS
Phase 7-B Contextual continuation receipts                    ✅ REAL USER PASS
Studio Focus Slices 1–4 + program closeout                    ✅ REAL USER PASS
Foundation Regression Repair · Build 67 + TM5.21              ✅ REAL USER PASS
Build 68 Home lead priority corrective                        ✅ REAL USER PASS
Phase 7-C Runtime Slice 1 · Builds69→71                       ✅ REAL USER PASS
Phase 7-C Runtime Slice 2 · Builds72→73                       ✅ REAL USER PASS
Phase 7-C Program closeout audit                              ✅ COMPLETE · NO EXTRA RUNTIME SLICE
Phase 8 Slice 1 · Content Health Truth · Build74              ✅ REAL USER PASS
```

Historical numbering discipline:

- Build59 was reserved and never reused.
- Build60 was superseded by Build61 for Slice4 acceptance.
- Build62 is the Studio Focus program closeout.
- Build63 is historical/superseded and must not be reused.
- Build64 remains deployed **FAILED REAL USER SMOKE** evidence.
- Builds65–66 are corrective lineage superseded by Build67.
- Build67 is the accepted Foundation Regression Repair baseline underneath later builds.
- Build68 is the accepted Home lead priority corrective predecessor.
- Build69 is the first Phase 7-C Runtime Slice1 candidate.
- Build70 is the pre-smoke readiness/publication/Album/New Track corrective candidate.
- **Build71 is the accepted cumulative Phase 7-C Runtime Slice1 runtime.**
- Build72 is the deployed Phase 7-C Runtime Slice2 origin candidate.
- **Build73 is the accepted cumulative Phase 7-C Runtime Slice2 runtime and Phase 7-C program baseline.**
- **Build74 is the accepted first genuine Phase8 runtime slice.**
- **Build75 is currently unused.** Do not reserve/implement it until the next Phase8 scope is proven.

Historical candidates are preserved rather than retroactively relabeled as accepted.

## Daily product model

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Workflow remains under Advanced. Home owns daily continuation, production/publication counters, abbreviated attention queue and the Phase8 read-only Content Health surface. Workflow owns the full detailed searchable/filterable production queue.

### Home lead rule — accepted

```text
last opened track
  └─ unfinished? → use as lead
       otherwise ↓
first unfinished workflow item
  └─ none? → PRODUCTION QUEUE CLEAR
```

A production-complete track must never be promoted as the Home lead merely because it was the last track visited.

## Track Workspace

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace conclusions.
- **Visuals** — canonical Cover / Thumbnail / Canvas; Cover is required, Canvas is optional.
- **Lyrics** — permanent top-level canonical `LYRICS TXT` source control, embedded LRC Maker and secondary plain-text editor. Ready requires recognized timestamps.
- **Release** — final checklist + browser-local Release Campaign.
- full Metadata and SonicTrace diagnostics remain under progressive disclosure / Details / Advanced.

Production and publication are separate axes:

```text
Production axis:   Needs attention / Production complete
Publication axis:  Published / Drafts
```

A published track may still have production/catalog work pending; a Draft may be 100% production-ready. Publication is not part of readiness scoring.

## Phase 8 Slice 1 — Content Health Truth · COMPLETE / REAL USER PASS

Accepted Build74 goal: expose **global, actionable catalog health** on top of the mature production-state model without creating a new write authority and without duplicating the C3-B SonicTrace map or Phase7 workflow priority.

### Accepted readiness model

```text
Identity        20
Master audio    20
Cover           20
Lyrics TXT      10
Lyrics timing   10
SonicTrace      20
Canvas           0 · optional
```

Build74 removes the legacy readiness penalty for Canvas and keeps Cover as the required Visual production asset.

### Accepted global health signals

- missing canonical audio;
- missing required cover;
- missing canonical `lyrics.txt`;
- lyrics timing missing;
- SonicTrace missing or outdated;
- canonical Release quality blockers;
- published tracks that still have production gaps;
- Draft tracks already production-ready.

Every actionable signal routes through the affected Track's **existing** `workflow.nextAction`. Content Health is read-only and must not become a second action-priority engine.

### Accepted Home truth

```text
NEEDS ATTENTION      = production gaps only
PRODUCTION COMPLETE  = production stages complete, excluding publication
PUBLISHED            = public catalog axis
DRAFTS               = publication axis
```

Therefore this is valid and intentional:

```text
Production complete  YES
Draft                YES
Next Action          Publish track
```

### Exact Build74 acceptance evidence

```text
Safety pre              safety/pre-phase8-content-health-build74-20260814-1810
PR                      #108
Exact tested head       da7b5498dd8e1f6120c346e07fe1b1e741d40104
Validation              31819203565 · SUCCESS
Runtime merge           c95e33bcb0c33b18fc8e6e9a35a05ec28ad142a9
Pages                   31819333501 · SUCCESS · exact merge SHA
Safety post-deploy      safety/post-build74-deployed-candidate-20260814-1827
Real-user smoke         BUILD74 PASS · 2026-08-14
Safety post-RUP         safety/post-build74-real-user-pass-20260814-1926
TM / bridge             v5.22 / v1.12 · unchanged
TM Worker Version ID    df00e4c7-bfa1-45a3-b3e8-bd2640e0a159 · unchanged
Public Worker           v2.7 · unchanged
R2 migration            NONE
```

Accepted record: [`../changelogs/CHANGELOG-PHASE8-BUILD74.md`](../changelogs/CHANGELOG-PHASE8-BUILD74.md).

## Phase 7-B receipt authority — preserved

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Canonical-write verification requires exact current `trackId`, allowlisted source/operation/effect, private canonical Track Manager reread, returned ID match, operation-specific evidence and stale async protection.

Public fallback never confirms a canonical write.

## Native Release Campaign — preserved contract

```text
Canonical Track context
        ↓
MASTER FINAL 16:9
        ├── 1:1 generated independently from MASTER
        └── 9:16 generated independently from MASTER
```

Rules:

- 9:16 is never derived from 1:1;
- MASTER and derivatives stay browser-local until a separately authorized persistence design exists;
- `New MASTER concept` is non-destructive;
- prompt generation is provider-agnostic;
- Google Flow remains a convenience handoff;
- ZIP export is review-only;
- `release-campaign / campaign-exported / review-only` remains the receipt;
- manifest remains `canonicalWrite: false`.

## Phase 7-C — Guided end-to-end actions · PROGRAM COMPLETE

Contract: [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md).  
Program closeout audit: [`PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md).

### Runtime Slice 1 — COMPLETE · REAL USER PASS

Cumulative Slice1 chain:

```text
Build69  guided Metadata / Identity routing + private reread semantics
Build70  readiness/publication split + Album semantics + New Track safe publish flow
Build71  derived canonical audio duration evidence + TM5.22/bridge1.12 · REAL USER PASS
```

Accepted record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

### Runtime Slice 2 — COMPLETE · REAL USER PASS via Build73

Truthful stage ownership:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Core Media guidance:

```text
master audio missing
→ Fix Core media
→ Track / overview
→ Master audio uploader
→ existing asset-upload-v1
→ protected canonical verification
→ workflow recompute

master audio ready + cover missing
→ Continue Core media
→ Visuals / assets
→ Cover uploader
→ existing asset-upload-v1
→ protected canonical verification
→ workflow recompute

Audio + Cover ready
→ workflow advances to Lyrics
```

Build73 status truth:

```text
Visuals ready = canonical cover present
Canvas        = optional
Lyrics ready  = canonical lyrics.txt + recognized timestamps
TXT only      = attention / Timing needed
```

Track Workspace `Continue` follows the same Phase7 `workflow.nextAction` authority as Home / Tracks / Workflow.

Accepted record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD73.md).

### Program closeout audit — COMPLETE, no Slice3 runtime

The accepted Build73 code was reread before allocating Build74. Lyrics, Intelligence and Release already satisfied the guided-action contract, so no synthetic Slice3 was created.

Audit safety anchor:

```text
safety/pre-phase7c-program-closeout-audit-20260814-1747
```

## Next Phase8 sub-scope — NOT YET ALLOCATED

Build74 closes **Content Health Truth**, not all of Phase8.

The next Phase8 scope must start with a real-code audit. Candidate directions may include richer catalog-level intelligence or decision support, but only if they add capability beyond:

- Build74 global Content Health;
- existing C3-B SonicTrace map/catalog intelligence;
- existing Phase7 `workflow.nextAction` priority;
- existing Home production/publication counters.

Do **not** build another dashboard just to restate the same signals.

The next accepted design should preferably remain read-only unless a concrete capability proves a guarded write is necessary.

## Later roadmap

### Phase 9 — Security / reliability / PWA

Access/CORS hardening, retries/timeouts, anti-loss behavior, degraded/offline UX and PWA resilience.

### Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

### Premium interaction feel — rolling backlog

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

## Canonical data contracts

### Lyrics

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export / compatibility only
```

### Albums

```text
albums/<album-id>/manifest.json
albums/<album-id>/cover/<filename>
albums/<album-id>/thumbnail/thumbnail.webp
```

Ordered `album.trackIds` owns membership and artistic order. Track-side Album data remains a compatibility cache only.

### Audio duration

`manifest.duration` is a derived canonical fact from the current master audio. It is not a manual free-form metadata field.

TM v5.22 can accept bounded browser-measured audio evidence through existing guarded operations, under the current track/revision and canonical-audio prerequisites.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in sidecars.

## Important checkpoints

```text
safety/post-build74-real-user-pass-20260814-1926
safety/post-build74-deployed-candidate-20260814-1827
safety/pre-phase8-content-health-build74-20260814-1810
safety/post-phase7c-program-closeout-20260814-1810
safety/pre-phase7c-program-closeout-audit-20260814-1747
safety/post-build73-rup-docs-closeout-20260814-1726
safety/post-build73-real-user-pass-20260814-1715
safety/post-build73-deployed-candidate-20260814-1318
safety/pre-build73-status-truth-corrective-20260814-1312
safety/post-build72-deployed-candidate-20260814-1230
safety/pre-phase7c-slice2-build72-20260814-1221
safety/post-build71-real-user-pass-20260814-1217
safety/post-build71-deployed-candidate-20260814-1152
safety/pre-build71-duration-evidence-fix-20260814-0216
safety/pre-phase7c-slice1-build69-20260814-0013
safety/post-build68-home-real-user-pass-20260814-0005
```

Phase 7-C contract opening anchors:

```text
Studio:    safety/pre-phase7c-guided-actions-20260813-1837
LaunchPAD: safety/pre-phase7c-guided-actions-20260813-1837
```

## Verification policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Every runtime phase/slice must use exact-head CI, anti-drift reread, exact tested merge, exact merge-SHA deployment and real-user smoke. Historical candidates never receive retroactive acceptance. Docs-only closeouts must stay docs-only and must not silently advance runtime acceptance.