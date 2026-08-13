# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-13 after **Foundation Regression Repair closeout REAL USER PASS**. The accepted runtime baseline is now **Studio v0.19.3 · Build 67** with **Track Manager v5.21 / bridge v1.11**.

This file is the **current roadmap authority**. Historical build detail belongs in milestone docs and [`../changelogs/`](../changelogs/README.md), not here.

## Current state

```text
Studio          v0.19.3 · Build 67    accepted current baseline · REAL USER PASS
Studio Focus    Slices 1–4 + closeout REAL USER PASS
Foundation Repair Build 67            COMPLETE · REAL USER PASS
Phase 7-A       Build 46              REAL USER PASS
Phase 7-B       Build 51              REAL USER PASS
Phase 7-C                              STARTED · contract locked / repair gate CLEARED / Slice 1 not started
Track Manager   v5.21                 repair scope · REAL USER PASS
Studio bridge   v1.11
Public Worker   v2.7                  unchanged
```

Build 62 remains the accepted Studio Focus program-closeout corrective, not a fifth Studio Focus slice. Build 60 is historical deployed candidate evidence and is superseded by Build 61 for Slice 4 acceptance. Build 59 was reserved by a parallel branch and was never reused. Historical Draft Build 63 is superseded and must not be reused. Build 64 is historical **FAILED REAL USER SMOKE** evidence; Builds 65 and 66 are corrective lineage superseded by Build 67.

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
- public fallback is read-only and never invents private state.

## Accepted foundations

- Phase 0 — architecture/data contracts ✅
- Phase 1 — Studio shell ✅
- Phase 2 — Catalog ✅
- Phase 3 — Track Workspace ✅
- Phase 4 — Track Manager integration ✅
- Phase 5 — SonicTrace / Catalog Intelligence ✅
- Phase 6 — Lyrics / LRC ✅ REAL USER VALIDATED
- PHASE UX ✅ REAL USER VALIDATED
- Phase 7-A — Workflow Overview ✅ REAL USER PASS
- Phase 7-B — contextual continuation receipts ✅ REAL USER PASS
- Studio Focus Slice 1 ✅ Build 53 REAL USER PASS
- Studio Focus Slice 2 ✅ Build 56 REAL USER PASS
- Studio Focus Slice 3 ✅ Build 58 REAL USER PASS
- Studio Focus Slice 4 ✅ Build 61 REAL USER PASS
- Studio Focus program closeout ✅ Build 62 REAL USER PASS
- Foundation Regression Repair ✅ Build 67 + TM5.21 REAL USER PASS
- Phase 7-C — Guided end-to-end actions 🚧 STARTED · contract locked · runtime Slice 1 not started

## Studio Focus — accepted production-first UX

### Daily navigation

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

### Track Workspace

```text
Track · Visuals · Lyrics · Release
```

- Track owns day-to-day identity, canonical audio, production state and compact SonicTrace conclusions.
- Visuals owns canonical Cover / Thumbnail / Canvas; Canvas presentation is 9:16.
- Lyrics owns a permanent top-level canonical `LYRICS TXT` source control, embedded LRC Maker synchronization and a secondary plain-text editor.
- Release owns the final checklist and native Release Campaign.
- full Metadata and SonicTrace diagnostics remain reachable through progressive disclosure / Details / Advanced.

### Production vs publication

```text
Production axis:   Needs attention / Production complete
Publication axis:  Published / Drafts
```

These axes intentionally overlap. A published track can still have useful production work left.

### Accepted SonicTrace behavior

The Track page shows a compact artist-facing projection only:

- Style;
- Mood;
- Character;
- Arrangement;
- Master;
- Palette.

Truth state remains inherited from the protected SonicTrace profile contract: `FULL / PARTIAL / UNAVAILABLE / OUTDATED`. The 512D vector, engine/GPU plumbing and full diagnostics stay out of routine Track use.

Artist-facing workflow wording is `Sonic` / `SonicTrace`, not the ambiguous legacy `Sound` label.

## Foundation Regression Repair — COMPLETE

Status: **COMPLETE · REAL USER PASS**.

A fresh real-user smoke performed before Phase 7-C runtime Slice 1 exposed foundation regressions, so runtime work was paused until repair acceptance.

Accepted repair outcomes:

1. private/draft Album artwork renders through protected canonical Album media rather than depending on the public Album projection;
2. `album.trackIds` remains the only Album membership/order authority and the generic Track metadata path no longer edits the Album cache;
3. Track Manager v5.21 removes `album` from the generic Studio metadata allowlist and provides protected Album media reads;
4. explicit membership verification/repair uses the existing guarded Album operation with fresh reads and canonical reread verification;
5. Build 64 corrected the original issues but **failed real-user smoke** because a Lyrics `MutationObserver` could self-trigger and freeze affected routes;
6. Build 65 corrected that crash without changing backend authority;
7. Build 66 clarified Audio / Cover / Thumbnail / Lyrics TXT / Video-Canvas identities and explains missing-master-audio synchronization prerequisites;
8. Build 67 permanently anchors `LYRICS TXT` above synchronization, outside the secondary plain-text disclosure;
9. final Build 67 browser review was accepted by the user.

Exact accepted repair evidence:

```text
Studio tested head   6c1d801b14ae8daedfb246da539a42125f7c80d9
Studio validation    31738652169    SUCCESS
Studio main          5f061a460f17e27b9c2f06fdcbdda2f34e07e240
Studio Pages run     31738982707    SUCCESS
Track Manager        v5.21
Studio bridge        v1.11
LaunchPAD main       813eb845b563b9a176c23f490d7fc044d4a0abc3
TM Worker run        31728992790    SUCCESS · admin only
TM Worker Version ID 0e1b9a3f-eabd-432e-8872-24ff0a9c085f
Public Worker        v2.7            unchanged
```

Closeout evidence: [`STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md).

## Studio Focus program closeout — COMPLETE

Status: **COMPLETE · REAL USER PASS**.

Accepted closeout findings and decisions remain preserved:

1. public-cover `Extract colors` works on the exercised `Magnetic Midnight` track;
2. palette preview layout remains stable when save controls appear;
3. explicit `Save palette` succeeds on the exercised legacy track;
4. the false legacy `STALE_MANIFEST` condition is fixed without removing stale revision checks;
5. legacy artist-facing `Titre d'Album` displays as `Album track` without silently changing stored metadata;
6. `Sonic` wording is accepted;
7. Release Campaign prompt generation remains provider-agnostic and the misleading Premium provider selector is gone;
8. Google Flow remains a direct convenience handoff;
9. **Workflow remains under Advanced** because Home owns the daily abbreviated production queue while Workflow owns the full detailed searchable/filterable queue.

Historical closeout evidence: [`STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md`](STUDIO-FOCUS-PROGRAM-CLOSEOUT-REAL-USER-PASS.md).

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
- accepted MASTER and derivatives are browser-local campaign state until a separately authorized persistence design exists;
- `New MASTER concept` is non-destructive;
- prompt generation is provider-agnostic;
- Google Flow remains a direct convenience handoff;
- ZIP export remains review-only;
- successful export emits `release-campaign / campaign-exported / review-only`;
- manifest remains `canonicalWrite: false`.

### Release Campaign follow-ups — later

- optional ~8s motion/loop provider handoff anchored to the selected MASTER;
- fixed title/logo and clean loop seam where relevant;
- provider/model provenance recorded rather than guessed;
- independent variant replacement;
- future guarded persistence only through existing Track Manager operation-specific authority + canonical reread.

## Phase 7-B receipt authority — preserved

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Canonical-write verification requires:

- exact current `trackId`;
- allowlisted source/operation/effect;
- private canonical Track Manager reread;
- returned ID still matching;
- operation-specific canonical evidence;
- stale async reread protection.

Public fallback never confirms a canonical write.

## Phase 7-C — Guided end-to-end actions

Status: **STARTED — CONTRACT LOCKED / FOUNDATION REPAIR GATE CLEARED / RUNTIME SLICE 1 NOT YET STARTED**.

Fresh explicit authorization was given on 2026-08-13. The executable safety/product contract is [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md).

Accepted Phase 7-C rules:

- Studio guides one truthful Next Action at a time;
- guided canonical mutations reuse existing operation-specific protected write authority rather than adding a generic Studio/R2 writer;
- private read and the operation's advertised capability are required before mutation;
- fresh revision / ETag / state token protections remain mandatory where applicable;
- explicit human confirmation remains required before a canonical mutation;
- ambiguous write failures are canonically reread before any retry;
- every successful canonical mutation must be privately reread before Studio shows it as verified;
- Phase 7-B typed receipts remain authoritative for LRC Maker / SonicTrace specialist continuations;
- Release Campaign remains review-only and `canonicalWrite: false`;
- workflow state and the next useful action are recomputed from canonical reread state, never optimistic local state.

### Phase 7-C Slice 1 — next runtime candidate

**Guided Metadata / Identity completion** around the already production-proven metadata validate/save path:

```text
Home / Tracks / Workflow Next Action
→ Track guided Metadata / Identity context
→ edit
→ validate
→ review normalized proposal
→ explicit Save confirmation
→ existing guarded metadata save
→ backend + Studio canonical reread
→ VERIFIED
→ refreshed workflow / next action
```

No new Worker route or Track Manager version bump is planned for Slice 1 unless implementation audit proves one genuinely necessary. Deployment itself performs no production data mutation; the only mutation remains an explicit user-triggered existing guarded operation.

Before runtime implementation resumes in a fresh session, verify current GitHub and deployed production state. Do not treat the repair closeout itself as a new runtime-implementation authorization.

Opening safety anchors:

```text
Studio:    safety/pre-phase7c-guided-actions-20260813-1837
LaunchPAD: safety/pre-phase7c-guided-actions-20260813-1837
```

## Later roadmap

### Phase 8 — Dashboard Intelligence & Content Health

Global actionable catalog health on top of the mature production-state model.

### Phase 9 — Security / reliability / PWA

Access/CORS hardening, retries/timeouts, anti-loss behavior, degraded/offline UX and PWA resilience.

### Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

### Premium interaction feel — rolling polish backlog

Keep improving perceived quality without changing product semantics:

- tactile button press/click feedback;
- restrained glow and focus transitions;
- premium hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows production work.

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

## Accepted checkpoints

```text
safety/post-build67-lyrics-source-anchor-20260813-2205
safety/post-studio-focus-program-closeout-20260813-1720
safety/post-studio-focus-build61-real-user-pass-20260813-1347
safety/post-studio-focus-build58-real-user-pass-20260813-0952
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

Pre-Phase-7-C opening safety anchors:

```text
Studio:    safety/pre-phase7c-guided-actions-20260813-1837
LaunchPAD: safety/pre-phase7c-guided-actions-20260813-1837
```

## Verification policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Every new runtime slice must use exact-head CI, anti-collision reread, exact tested merge, exact merge-SHA deployment and real-user smoke. Historical candidates never receive retroactive acceptance.
