# SHINOBIWAN STUDIO — STUDIO FOCUS PROGRAM CLOSEOUT CANDIDATE

Status: **CANDIDATE · DEPLOYED BUILD 61 REVIEW · REAL USER SMOKE PENDING**  
Prepared: 2026-08-13

This document starts the final non-feature Studio Focus closeout. It does **not** mark the program complete and does **not** authorize Phase 7-C.

## Exact baseline

```text
Studio project/runtime release   v0.19.1 · Build 61
Studio main at closeout start    70c491b3c5a1f965145e642c0384c25cc7edf1dc
LaunchPAD accepted               2026.08.12.102
Track Manager                    v5.19
Studio bridge                    v1.11
Public Worker                    v2.7
SonicTrace                       V2-E Build 08 · REAL USER PASS
Deep Audio                       2.0.3-alpha
LRC Maker                        6.3.8
```

The Studio main SHA above contains the documentation-only release-terminology correction merged in PR #83. Its GitHub Pages build/deploy completed successfully on the same SHA. The preceding LaunchPAD cross-stack README correction was merged in LaunchPAD PR #225 as `2bbf113c800d40c18c77d3d83589c0c116626f3a` and also passed its post-merge validations/deployments.

Studio release terminology is now explicit: `v0.19.1 · Build 61` is the accepted **project/runtime release identity**. The Studio repository currently publishes no formal GitHub Release objects and no Git tags.

## Safety anchor

```text
safety/pre-studio-focus-program-closeout-20260813-1508
```

The closeout branch starts from the exact post-documentation-sync Studio main above.

## Frozen boundaries

This closeout must not:

- start Phase 7-C;
- introduce a new runtime feature merely to satisfy the review;
- create a generic Studio/R2 write authority;
- redeploy a Worker without a separately justified runtime reason;
- mutate R2/catalog/media merely to manufacture smoke evidence;
- promote public fallback to canonical-write verification;
- change the canonical Lyrics, Album or SonicTrace authority contracts;
- silently promote Release Campaign output to canonical media.

`CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS` remains mandatory.

## Deployed review matrix

The final real-user pass must exercise the already-deployed Build 61 across these surfaces.

### 1. Home

Confirm:

- `Continue where you left off` / `NEXT UP` is understandable and useful;
- `Needs attention`, `Production complete`, `Published`, `Drafts` remain truthful;
- the next action leads to the expected track workspace section;
- the compact “What needs attention” queue is readable.

### 2. Tracks

Confirm:

- cover cards remain readable at normal laptop/desktop density;
- `Needs attention`, `Production complete`, `Published`, `All` filtering remains understandable;
- full Audio / Cover / Lyrics / Canvas / Release labels remain readable;
- opening a track preserves the expected continuation flow.

### 3. Track

Confirm on a representative track:

- identity and release basics are readable;
- canonical master audio loads/plays/seeks normally;
- production state remains compact and truthful;
- protected audio-management controls remain clearly secondary to artist work;
- deeper metadata remains reachable through Details / progressive disclosure.

### 4. Visuals

Confirm:

- Cover and Thumbnail are understandable canonical assets;
- Canvas/video preview uses the accepted 9:16 presentation;
- no release-campaign draft is presented as canonical Visuals state.

### 5. Lyrics

With PRIVATE READ available, confirm:

- embedded LRC Maker remains the primary synchronization engine;
- canonical audio and `lyrics.txt` context load correctly;
- normal synchronization controls remain usable;
- no save is required merely for closeout evidence.

Also exercise the truthful degraded/public-read boundary if practical without destructive setup. Public fallback must never look like writable canonical Lyrics state.

### 6. SonicTrace

Confirm:

- compact Track summary remains artist-facing: Style / Mood / Character, Arrangement / Master, Palette;
- FULL / PARTIAL / UNAVAILABLE / OUTDATED remains explicit and truthful;
- `Details / Advanced` still exposes the deeper diagnostics when deliberately requested;
- routine Track use does not expose raw 512D/GPU plumbing unnecessarily.

No fresh analysis/write is required merely to manufacture evidence.

### 7. Release

Confirm:

- final readiness checklist is clear;
- native Release Campaign is reachable and coherent;
- MASTER 16:9 → independent 1:1 + independent 9:16 sibling-derivative contract remains understandable;
- ZIP/export remains review-only and does not imply canonical write.

No campaign export is required for closeout if the existing surface and review-only boundary can be observed without mutation.

### 8. Responsive pass

Review at least:

- normal desktop;
- laptop/narrow desktop;
- mobile-sized layout.

Look specifically for clipped labels, horizontal overflow, broken sticky regions, unusable 9:16 media, or controls whose hierarchy changes incorrectly on small screens.

### 9. Workflow placement decision

**Provisional recommendation: keep Workflow under `Advanced`.**

Current Home already owns the daily production summary, continuation and a short “Needs attention” list. Workflow provides a materially different detailed read-only surface: complete queue, search, filters, stage rail and explicit per-track next action. Absorbing the whole detailed queue into Home would increase daily density and weaken progressive disclosure.

Final decision remains part of the real-user closeout. If the deployed review shows that Advanced → Workflow is hard to discover when deeper triage is needed, prefer a clearer Home deep-link rather than moving the whole Workflow surface into daily navigation.

## Representative-state requirement

The closeout should observe both:

- at least one published track;
- at least one draft/private production track when PRIVATE READ is available.

No production mutation is required simply to create a prettier test fixture.

## Acceptance rule

Only directly observed behavior may be promoted to the final Studio Focus Program checkpoint.

Until the user explicitly reports the deployed smoke result:

```text
STUDIO FOCUS PROGRAM CLOSEOUT   REAL USER SMOKE PENDING
PHASE 7-C                       CLOSED / NOT STARTED
FINAL PROGRAM CHECKPOINT        NOT CREATED
```

If any runtime defect appears, stop the closeout, keep Build 61 acceptance history intact, isolate the defect on its own safety branch/build, and repeat CI/deployment/smoke before final closeout.
