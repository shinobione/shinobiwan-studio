# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-14 during **Phase 7-C Runtime Slice 1 · Build 69 implementation candidate**.

This file is the **current roadmap authority**. Historical build detail belongs in milestone docs and [`../changelogs/`](../changelogs/README.md).

## Current state

```text
Studio accepted    v0.19.3 · Build 68    Home lead priority fix · REAL USER PASS
Studio candidate   v0.19.4 · Build 69    Phase 7-C Slice 1 guided metadata · PR #99
Phase 7-A          Build 46              REAL USER PASS
Phase 7-B          Build 51              REAL USER PASS
Phase 7-C                                STARTED · contract locked
Phase 7-C Slice 1  Build 69              IMPLEMENTATION CANDIDATE · CI/DEPLOY/SMOKE REQUIRED
Track Manager      v5.21                 repair scope · REAL USER PASS
Studio bridge      v1.11
Public Worker      v2.7                  unchanged
LaunchPAD          2026.08.12.102        C3-C · REAL USER PASS
SonicTrace         V2-E Build 08         REAL USER PASS
Deep Audio         2.0.3-alpha
LRC Maker          6.3.8
```

### Immediate gate

Build 68 has passed its required real-user Home smoke and remains the accepted Studio baseline.

Build 69 is authorized and implemented as PR #99, but it **must not be accepted** until final exact-head CI, anti-drift, exact tested-head merge, exact merge-SHA Pages deployment and real-user browser smoke all pass.

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

## Accepted foundations / current candidate

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
Phase 7-C Guided end-to-end actions                           🚧 CONTRACT LOCKED
Phase 7-C Runtime Slice 1 · Build 69                          🚧 IMPLEMENTATION CANDIDATE
```

Historical numbering discipline:

- Build 59 was reserved and never reused.
- Build 60 is superseded by Build 61 for Slice 4 acceptance.
- Build 62 is the Studio Focus program closeout.
- Build 63 is historical/superseded and must not be reused.
- Build 64 is deployed **FAILED REAL USER SMOKE** evidence.
- Builds 65 and 66 are corrective lineage superseded by Build 67.
- Build 67 is the accepted Foundation Regression Repair baseline underneath Build 68.
- Build 68 is the current accepted Studio runtime.
- Build 69 is the first Phase 7-C runtime candidate and is not accepted yet.

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

Workflow remains under Advanced. Home owns daily continuation, counters and the abbreviated attention queue; Workflow owns the full detailed searchable/filterable production queue.

### Home lead rule — Build 68 preserved by Build 69

```text
last opened track
  └─ unfinished? → use as lead
       otherwise ↓
first unfinished workflow item
  └─ none? → PRODUCTION QUEUE CLEAR
```

A production-complete track must never be promoted as the Home lead merely because it was the last track visited.

Build 69 changes only the destination semantics for an Identity/Metadata Next Action: Home now keeps `metadata` as the direct destination instead of collapsing it to overview.

## Track Workspace

```text
Track · Visuals · Lyrics · Release
```

- **Track** — identity, canonical master audio, production state and compact SonicTrace conclusions.
- **Visuals** — canonical Cover / Thumbnail / Canvas; Canvas preview is 9:16.
- **Lyrics** — permanent top-level canonical `LYRICS TXT` source control, embedded LRC Maker and secondary plain-text editor.
- **Release** — final checklist + browser-local Release Campaign.
- full Metadata and SonicTrace diagnostics remain under progressive disclosure / Details / Advanced.

Production and publication remain separate overlapping axes:

```text
Production axis:   Needs attention / Production complete
Publication axis:  Published / Drafts
```

## Build 68 — accepted baseline

Status: **COMPLETE · REAL USER PASS**.

```text
Safety before change  safety/pre-build68-home-lead-priority-20260813-2228
Feature branch        agent/build68-home-lead-priority
PR                     #96
Tested head            cf5131f489d72ca5fae72544dacd9eaecc78077f
Validation             31741483430 · SUCCESS
Runtime merge          5c0428e500b4e6d5c9d1069bb440eac78b79955e
Pages deployment       31743413418 · SUCCESS
Real-user smoke        PASS · 2026-08-14
Post-pass checkpoint   safety/post-build68-home-real-user-pass-20260814-0005
```

Detailed record: [`../changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`](../changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md).

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

## Phase 7-C — Guided end-to-end actions

Status: **STARTED · RUNTIME SLICE 1 BUILD 69 IMPLEMENTATION CANDIDATE**.

Contract: [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md).

Frozen rules:

- Studio guides one truthful Next Action at a time;
- canonical mutations reuse existing operation-specific protected Track Manager authority;
- private read + advertised capability are required;
- fresh revision / ETag / state token protections remain mandatory;
- explicit human confirmation before canonical mutation;
- ambiguous write failure → canonical reread before retry decision;
- apparent success is not VERIFIED until private canonical reread proves it;
- workflow/Next Action recomputes from canonical reread state, never optimistic local state;
- Phase 7-B receipts remain authoritative for specialist continuations;
- Release Campaign remains review-only.

### Runtime Slice 1 — Build 69 Guided Metadata / Identity

Implemented candidate flow:

```text
Home / Tracks / Workflow Next Action
→ Track guided Metadata / Identity context
→ edit
→ Validate metadata
→ review normalized proposal
→ explicit confirmation
→ existing guarded metadata save
→ backend + Studio private canonical reread
→ VERIFIED
→ recompute Workflow / Next Action
```

Implementation audit result: **no Worker or Track Manager version bump required**. Existing TM v5.21 / bridge v1.11 metadata validate/save authority is reused.

Build 69 candidate specifics:

- version `v0.19.4 · Build 69`;
- codename `studio-focus-phase7c-slice1-guided-metadata`;
- safety `safety/pre-phase7c-slice1-build69-20260814-0013`;
- feature branch `agent/phase7c-runtime-slice1`;
- Draft PR #99;
- initial `v0.20.0 / phase7c-*` candidate CI correctly exposed inherited release-line whitelist collisions and caused no production deployment;
- Build 69 was normalized to the `v0.19.4 / studio-focus-*` compatibility lineage rather than widening every historical C3 / TTME / PHASE UX guard;
- historical C3 / TTME / PHASE UX guard files are restored unchanged from `main`;
- the current private-read integration guard alone is extended for PHASE 7-C / TM5.21 / bridge v1.11;
- final exact-head CI still required before merge.

Candidate record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD69.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD69.md).

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Global actionable catalog health on top of the mature production-state model.

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

Ordered `album.trackIds` owns membership and artistic order.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

Source audio is not persisted in sidecars.

## Important checkpoints

```text
safety/pre-phase7c-slice1-build69-20260814-0013
safety/post-build68-home-real-user-pass-20260814-0005
safety/pre-build68-home-lead-priority-20260813-2228
safety/post-build67-lyrics-source-anchor-20260813-2205
safety/post-studio-focus-program-closeout-20260813-1720
safety/post-studio-focus-build61-real-user-pass-20260813-1347
safety/post-studio-focus-build58-real-user-pass-20260813-0952
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

Phase 7-C contract opening anchors:

```text
Studio:    safety/pre-phase7c-guided-actions-20260813-1837
LaunchPAD: safety/pre-phase7c-guided-actions-20260813-1837
```

## Verification policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Every runtime slice must use exact-head CI, anti-drift reread, exact tested merge, exact merge-SHA deployment and real-user smoke. Historical candidates never receive retroactive acceptance.
