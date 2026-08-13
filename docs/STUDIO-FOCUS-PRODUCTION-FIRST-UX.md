# SHINOBIWAN STUDIO — STUDIO FOCUS / PRODUCTION-FIRST UX

Status: **SLICES 1–4 COMPLETE · REAL USER PASS · PROGRAM CLOSEOUT PENDING**  
Current accepted release: **Studio v0.19.1 · Build 61**  
Updated: 2026-08-13

This document is the active product/UX contract for Studio Focus. Historical build detail belongs in milestone docs and [`../changelogs/`](../changelogs/README.md).

## Product rule

> When everything works, technical machinery should disappear. When something fails, enough technical detail must remain available to understand and recover safely.

Studio is an artist production tool first; Track Manager, R2, SonicTrace and LRC Maker keep their validated authority underneath.

## Accepted build chain

| Slice / Build | Purpose | State |
|---|---|---|
| Build 53 / Slice 1 | artist-first shell + Home | **REAL USER PASS** |
| Build 54 / Slice 2A | Tracks production-library base | superseded by accepted Slice 2 |
| Build 55 / Slice 2B | density/readability | superseded at smoke |
| Build 56 / Slice 2C | readable full production chips | **REAL USER PASS** |
| Build 57 / Slice 3A | Track · Visuals · Lyrics · Release regrouping | deployed smoke evidence, not accepted |
| Build 58 / Slice 3B | truthful fallback + 9:16 Canvas + Lyrics recovery | **REAL USER PASS** |
| Build 60 / Slice 4A | compact SonicTrace + production/publication semantics | deployed candidate, not accepted |
| Build 61 / Slice 4B | sidebar + SonicTrace presentation corrective | **REAL USER PASS** |

Build 59 was reserved by parallel work and was deliberately not reused.

## 1 — Artist-first shell

Accepted daily navigation:

```text
Home
Tracks
Albums

Advanced ▾
  Workflow
  Intelligence
  System
```

Normal production should not require subsystem knowledge.

### Home

Home answers:

- where did I leave off?;
- what needs attention?;
- what is production complete?;
- what is already published?;
- what should I do next?

### Tracks

Tracks is the main visual production library with readable cover cards, complete production chips and one clear continuation action.

Current filter language intentionally separates two axes:

```text
Production:  Needs attention / Production complete
Publication: Published / Drafts
```

A published track may still need useful production work.

## 2 — Track Workshop

Accepted artist-facing navigation:

```text
Track · Visuals · Lyrics · Release
```

Historical route tokens remain supported for deep links/backward compatibility; the visible UX does not need to expose them.

### Track

Track combines the information actually needed while working on a song:

- identity and release basics;
- canonical master playback;
- compact production state;
- protected audio management;
- compact artist-facing SonicTrace conclusions;
- secondary metadata and full diagnostics behind progressive disclosure.

### Visuals

Visuals owns the canonical visual identity:

- Cover;
- Thumbnail;
- Canvas/video;
- canonical Canvas preview in **9:16**;
- protected existing Track Manager asset APIs only.

Release-campaign format generation remains under Release, not mixed into canonical Visuals state.

### Lyrics

Lyrics keeps the validated embedded LRC Maker as the primary timing surface when private read is available.

Canonical rule:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps    = synchronization authority
.lrc                      = optional export / compatibility only
```

Public fallback may preview public lyrics but cannot expose the canonical save/sync surface. Canonical save success remains VERIFIED only after exact-track private Track Manager reread.

### Release

Release combines:

- final Audio / Cover / Lyrics / Canvas / Metadata readiness;
- native Release Campaign;
- campaign copy/tags/provenance;
- non-canonical ZIP export.

Release Campaign remains `canonicalWrite: false`.

## 3 — SonicTrace as an assistant, not a dashboard

The routine Track page shows a compact artist summary only when evidence exists.

Accepted hierarchy:

```text
Style · Mood · Character
Arrangement · Master
Palette
```

Profile truth remains the existing SonicTrace authority:

- **FULL** — current complete retained evidence;
- **PARTIAL** — useful but explicitly limited retained layers;
- **UNAVAILABLE** — no fake Deep Audio conclusions;
- **OUTDATED** — stale conclusions are hidden until current audio is analyzed.

The routine Track UX intentionally hides:

- 512D vectors;
- GPU/CUDA/VRAM plumbing;
- raw engine provenance;
- giant diagnostic payloads.

`Details / Advanced` remains the deliberate path to full SonicTrace diagnostics.

## 4 — Progressive disclosure is the global UX architecture

### Level 1 — Artist

Daily actions, current state, one clear next step.

### Level 2 — Detail

Metadata, asset safety details, full SonicTrace, receipts, provenance and troubleshooting.

### Level 3 — Infrastructure

Worker/bridge diagnostics, capability matrices, engine internals and administrative recovery.

Normal operation should not require Level 3 visibility.

## 5 — Truthful degraded states

Studio must never make a degraded read look like data loss or success.

When PRIVATE READ is unavailable:

- explain that private tracks/tools are hidden, not deleted;
- do not show unavailable private counters as truthful zero;
- public fallback remains read-only;
- Lyrics synchronization surface remains locked;
- private SonicTrace analysis remains hidden;
- no canonical receipt may be VERIFIED from public fallback.

## 6 — Authority boundaries

Studio Focus must not:

- replace Track Manager as protected canonical write authority;
- invent a generic Studio/R2 write route;
- weaken private canonical rereads;
- make public fallback authoritative;
- invent/reconstruct private tracks from public data;
- silently mutate Album membership/order from Intelligence;
- store source audio in SonicTrace analysis sidecars;
- make browser-local Release Campaign drafts look canonical.

## 7 — Accepted Slice 4 polish

Build 61 is the accepted Slice 4 baseline after deployed real-user smoke confirmed:

- bottom-anchored `PHASE 7-B · FOCUS` release/status card in desktop sidebar;
- compact release/status presentation rather than a stranded text block;
- readable SonicTrace hierarchy;
- truthful FULL state;
- `Details / Advanced` retained;
- no authority/data regression in the exercised scope.

Acceptance checkpoint:

```text
safety/post-studio-focus-build61-real-user-pass-20260813-1347
```

Evidence: [`STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md`](STUDIO-FOCUS-BUILD61-REAL-USER-PASS.md).

## 8 — Program closeout

Status: **PLANNED / NOT STARTED**.

Before declaring the whole Studio Focus program closed, perform a representative cross-flow deployed review:

1. Home continuation + Needs attention;
2. Tracks filters and card readability;
3. Track canonical audio/details;
4. Visuals Cover + 9:16 Canvas;
5. Lyrics private-read engine + truthful public lock state;
6. compact SonicTrace + full Advanced diagnostics;
7. Release checklist + review-only Release Campaign;
8. laptop/mobile/responsive pass;
9. decide whether Workflow should remain under Advanced or be further absorbed into Home.

No production mutation is required merely to manufacture this closeout.

## 9 — Later premium-feel polish

Keep a rolling non-semantic polish backlog:

- tactile click/press feedback;
- restrained glow;
- premium hover/active transitions;
- panel/tab transitions;
- smooth but fast state changes;
- `prefers-reduced-motion` support.

Polish must never hide state, invent success or slow the production workflow.

## Roadmap boundary

Studio Focus acceptance does **not** authorize Phase 7-C.

**Phase 7-C remains CLOSED / NOT STARTED** until fresh explicit authorization and its own safety branch, tests, PR, CI, deployment and real-user smoke.
