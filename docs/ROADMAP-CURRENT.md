# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-13 after **Studio v0.19.1 · Build 61 — Studio Focus Slice 4 REAL USER PASS**.

This file is the **current roadmap authority**. Historical build detail belongs in milestone docs and [`../changelogs/`](../changelogs/README.md), not here.

## Current state

```text
Studio          v0.19.1 · Build 61    accepted current baseline
Studio Focus    Slices 1–4            REAL USER PASS
Phase 7-A       Build 46              REAL USER PASS
Phase 7-B       Build 51              REAL USER PASS
Phase 7-C                              CLOSED / NOT STARTED
```

Build 60 is historical deployed candidate evidence and is superseded by Build 61 for Slice 4 acceptance. Build 59 was reserved by a parallel branch and was never reused.

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

- Track owns day-to-day identity, canonical audio, production state and compact sound conclusions.
- Visuals owns canonical Cover / Thumbnail / Canvas; Canvas presentation is 9:16.
- Lyrics owns the embedded LRC Maker and canonical `lyrics.txt` workflow.
- Release owns the final checklist and native Release Campaign.
- full Metadata and SonicTrace diagnostics remain reachable through progressive disclosure / Details / Advanced.

### Production vs publication

```text
Production axis:   Needs attention / Production complete
Publication axis:  Published / Drafts
```

These axes intentionally overlap. A published track can still have useful production work left.

### Slice 4 accepted SonicTrace behavior

The Track page shows a compact artist-facing projection only:

- Style;
- Mood;
- Character;
- Arrangement;
- Master;
- Palette.

Truth state remains inherited from the protected SonicTrace profile contract: `FULL / PARTIAL / UNAVAILABLE / OUTDATED`. The 512D vector, engine/GPU plumbing and full diagnostics stay out of routine Track use.

Build 61 additionally fixed the desktop presentation by keeping the release/status card at the bottom of the sidebar and giving the compact SonicTrace card a deliberate artist-facing hierarchy.

Acceptance checkpoint:

```text
safety/post-studio-focus-build61-real-user-pass-20260813-1347
```

Evidence: [`STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md`](STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md).

## Studio Focus closeout — NEXT NON-FEATURE STEP

Status: **PLANNED / NOT STARTED**.

Before opening a new functional phase, perform one deliberate cross-flow closeout:

1. smoke a representative Track through Track / Visuals / Lyrics / SonicTrace detail / Release;
2. smoke a draft/private track and a published track;
3. confirm public fallback truthfulness and private-read recovery;
4. confirm contextual write receipts still require private canonical rereads;
5. verify responsive desktop/laptop/mobile presentation;
6. decide whether the separate detailed Workflow destination should remain under Advanced or be further absorbed into Home;
7. record a final Studio Focus program checkpoint.

This closeout does **not** authorize Phase 7-C and should not mutate production merely to manufacture evidence.

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
- Google Flow remains a direct premium provider handoff;
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

Status: **PLANNED / CLOSED / NOT STARTED**.

Potential direction only, not authorization:

- guided next actions from Studio;
- operation-specific guarded writes only;
- no generic Studio/R2 authority;
- explicit receipts and canonical rereads for every canonical mutation.

Start only after fresh explicit user authorization and a new safety/branch/CI/smoke cycle.

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
safety/post-studio-focus-build61-real-user-pass-20260813-1347
safety/post-studio-focus-build58-real-user-pass-20260813-0952
safety/post-studio-focus-build56-real-user-pass-20260813-0143
safety/post-studio-focus-build53-real-user-pass-20260813-0032
safety/post-phase7-b-build51-real-user-pass-20260812-2120
safety/post-phase7-a-build46-real-user-pass-20260812-0923
```

Pre-cleanup documentation safety anchor:

```text
safety/pre-docs-repo-cleanup-20260813-1413
```

## Verification policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Every new runtime slice must use exact-head CI, anti-collision reread, exact tested merge, exact merge-SHA deployment and real-user smoke. Historical candidates never receive retroactive acceptance.
