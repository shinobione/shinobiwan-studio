# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-14 after **Phase 7-C Runtime Slice 2 · Build 72 deployment candidate**.

This file is the **current roadmap authority**. Historical build detail belongs in milestone docs and [`../changelogs/`](../changelogs/README.md).

## Current state

```text
Studio accepted    v0.19.3 · Build 71    Phase 7-C Slice 1 corrective chain · REAL USER PASS
Studio candidate   v0.19.3 · Build 72    Phase 7-C Slice 2 guided Core Media · DEPLOYED / SMOKE PENDING
Phase 7-A          Build 46              REAL USER PASS
Phase 7-B          Build 51              REAL USER PASS
Phase 7-C          Slice 1               COMPLETE · REAL USER PASS via Build71
Phase 7-C          Slice 2               DEPLOYED CANDIDATE · Build72
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

Build71 remains the **last accepted Studio baseline**.

Build72 is merged and deployed, but it must not replace Build71 as accepted until its real-user browser smoke passes. No Phase 7-C Slice 3 work should begin before that gate closes.

Build72 requires no Track Manager / Worker deployment. It reuses the already accepted Track Manager v5.22 / bridge v1.12 protected `asset-upload-v1` authority.

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

## Accepted foundations / active candidate

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
Phase 7-C Runtime Slice 1 · Builds 69→71                      ✅ REAL USER PASS
Phase 7-C Runtime Slice 2 · Build72                            🚧 DEPLOYED CANDIDATE / SMOKE PENDING
```

Historical numbering discipline:

- Build 59 was reserved and never reused.
- Build 60 is superseded by Build 61 for Slice 4 acceptance.
- Build 62 is the Studio Focus program closeout.
- Build 63 is historical/superseded and must not be reused.
- Build 64 is deployed **FAILED REAL USER SMOKE** evidence.
- Builds 65 and 66 are corrective lineage superseded by Build 67.
- Build 67 is the accepted Foundation Regression Repair baseline underneath later builds.
- Build 68 is the accepted Home lead priority corrective predecessor.
- Build 69 is the first Phase 7-C Runtime Slice 1 implementation candidate.
- Build 70 is the pre-smoke readiness/publication/Album/New Track corrective candidate.
- **Build 71 is the accepted cumulative Phase 7-C Runtime Slice 1 runtime.**
- **Build 72 is the deployed Phase 7-C Runtime Slice 2 candidate; real-user smoke is pending.**

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

Workflow remains under Advanced. Home owns daily continuation, counters and the abbreviated attention queue; Workflow owns the full detailed searchable/filterable production queue.

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
- **Visuals** — canonical Cover / Thumbnail / Canvas; Canvas preview is 9:16.
- **Lyrics** — permanent top-level canonical `LYRICS TXT` source control, embedded LRC Maker and secondary plain-text editor.
- **Release** — final checklist + browser-local Release Campaign.
- full Metadata and SonicTrace diagnostics remain under progressive disclosure / Details / Advanced.

Production and publication are separate axes:

```text
Production axis:   Needs attention / Production complete
Publication axis:  Published / Drafts
```

A draft can be **100% production ready**. Publication is not part of readiness scoring.

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

Contract: [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md).

### Runtime Slice 1 — COMPLETE · REAL USER PASS

Accepted flow:

```text
Home / Tracks / Workflow Next Action
→ Track guided Metadata / Identity context
→ edit
→ Validate metadata
→ normalized proposal + exact quality issues
→ explicit confirmation
→ existing guarded metadata save
→ backend + Studio private canonical reread
→ VERIFIED
→ recompute Workflow / Next Action
```

Cumulative Slice 1 corrective chain:

```text
Build69  guided Metadata / Identity routing + private reread semantics
Build70  readiness/publication split + Album semantics + New Track safe publish flow
Build71  derived canonical audio duration evidence + TM5.22/bridge1.12
```

Build71 acceptance evidence:

```text
Studio tested head      4298a07e13983786833240dd69a61a72dc09636e
Studio CI               31757665434 · SUCCESS
Studio PR               #101
Studio merge            0b3c3d452076708c698de71d9c691b5e459f7c17
Pages deploy            31789774785 · SUCCESS
Real-user smoke         BUILD71 PASS · 2026-08-14
Safety pre              safety/pre-build71-duration-evidence-fix-20260814-0216
Safety post-deploy      safety/post-build71-deployed-candidate-20260814-1152
Safety post-RUP         safety/post-build71-real-user-pass-20260814-1217

Track Manager           v5.22
Studio bridge           v1.12
Backend tested head     888d29e9b7064346311ed3c959669a327505204d
Backend merge           be7d970f6577e0e54eade04a5ef764a733baed42
Admin deploy            31789368122 · SUCCESS · target=admin
TM Worker Version ID    df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker           v2.7 · unchanged / deployment skipped
```

Accepted record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

### Runtime Slice 2 — Build72 Guided Core Media · DEPLOYED CANDIDATE

Build72 makes the first unresolved production prerequisite after Identity executable from Home / Tracks / Workflow without changing write authority.

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
```

Build72 also stops aggregate Track Manager quality errors from being mislabeled as Identity work. Aggregate quality remains authoritative at Release, while Media / Lyrics / Intelligence own their explicit workflow prerequisites.

Exact candidate evidence:

```text
Safety pre              safety/pre-phase7c-slice2-build72-20260814-1221
Feature branch          agent/phase7c-slice2-guided-core-media-build72
PR                      #103
Tested head             b79ce03a98fad46e6bf4c488e456af07bba951be
Studio CI               31792368962 · SUCCESS
Runtime merge           dceee27dd8f8cdc96f8f88f10c5588e283e56699
Pages deploy            31792436456 · SUCCESS · exact merge SHA
Safety post-deploy      safety/post-build72-deployed-candidate-20260814-1230
TM / bridge             v5.22 / v1.12 · unchanged
Public Worker           v2.7 · unchanged
Real-user smoke         PENDING
```

Candidate record: [`../changelogs/CHANGELOG-PHASE7-C-BUILD72.md`](../changelogs/CHANGELOG-PHASE7-C-BUILD72.md).

### Phase 7-C Slice 2 acceptance gate

Required real-user browser smoke:

1. a Track with missing audio recommends `Fix Core media` and lands on Track / Master audio, not Visuals;
2. after verified audio upload, canonical state refreshes and the Next Action advances to Cover when Cover is missing;
3. Cover continuation lands in Visuals;
4. after Audio + Cover are ready, the workflow advances to Lyrics;
5. public fallback remains read-only;
6. explicit confirmation and canonical reread verification remain visible.

Do not start Slice 3 until this gate is closed.

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
safety/post-build72-deployed-candidate-20260814-1230
safety/pre-phase7c-slice2-build72-20260814-1221
safety/post-build71-real-user-pass-20260814-1217
safety/post-build71-deployed-candidate-20260814-1152
safety/pre-build71-duration-evidence-fix-20260814-0216
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
