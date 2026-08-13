# Studio Focus Slice 4 — Build 60

Release candidate: **Studio v0.19.0 · Build 60**  
Codename: `studio-focus-slice4-sonictrace-summary`  
Date: 2026-08-13  
Status: **IMPLEMENTED / CI + DEPLOYED REAL-USER SMOKE PENDING — NOT REAL USER PASS**

## Why Build 60

Build 59 was already reserved by the parallel branch `studio-focus/build59-private-read-auth-bootstrap`. That branch was not reused, overwritten or merged into Slice 4. Slice 4 intentionally advances to Build 60 to keep build identity unambiguous.

Safety anchor before implementation:

```text
safety/pre-studio-focus-slice4-build60-20260813-1021
```

## Slice 4 goal

Make SonicTrace useful in the daily Track workflow without turning Track into an engineering dashboard.

The accepted direction is:

```text
Track
  → compact artist-facing sound conclusions
  → Details / Advanced
      → full SonicTrace diagnostics
```

The compact layer is a **read-only projection of the existing protected SonicTrace sidecar**. It does not create a new analysis format, write path, source of truth or canonical owner.

## Artist-facing SonicTrace summary

Track now exposes a compact `SOUND / SONICTRACE` card that may summarize only data already retained by the current SonicTrace contract:

- top relative genre/style matches;
- top relative mood matches;
- strongest useful production-character traits;
- compact arrangement facts such as section / hook-candidate counts;
- mastering loudness / true peak when that layer exists;
- compact instrument/palette labels.

The routine Track surface intentionally does **not** expose:

- the 512D embedding vector;
- model/GPU/CUDA/VRAM plumbing;
- raw engine provenance blocks;
- giant diagnostic payloads;
- absolute-probability claims that SonicTrace does not make.

Neural labels are presented as **relative SonicTrace matches**, consistent with the accepted CLAP calibration contract.

## Truthful profile states

The summary reuses the existing `sonicTraceProfileState()` / `sonicTraceProfileLabel()` authority rather than creating a second readiness model.

### FULL

Artist conclusions may be presented from the current canonical sidecar. Full diagnostic depth remains behind `Details / Advanced`.

### PARTIAL

Only conclusions backed by retained layers are shown. Missing Deep Audio layers remain explicitly PARTIAL.

### UNAVAILABLE

Studio does not invent genre, mood, mastering or structure results. If a browser-level basic DSP fallback exists, it can be labeled as such; otherwise no fake insight is shown.

### OUTDATED

Old artist-facing conclusions are hidden. Studio asks for a refresh because the canonical master changed after the retained scan.

### Public fallback

Private SonicTrace insight remains hidden. The Track card explicitly says `Sound insight stays private`; Studio does not reconstruct private analysis from the public LaunchPAD catalog.

## Full SonicTrace preserved

The existing `section === 'intelligence'` deep link and full `SonicTracePanel` remain intact.

No SonicTrace persistence, receipt or authority behavior changes:

- sidecars remain under `tracks/<trackId>/analysis/sonictrace/...`;
- SonicTrace save receipts remain `sonictrace + analysis-saved -> canonical-write`;
- VERIFIED still requires private Track Manager canonical reread;
- no Worker or SonicTrace backend deployment is part of Build 60.

## Production vs publication terminology

The Build 58 protected smoke exposed a semantic ambiguity: `27 To finish` looked comparable to Track Manager `2 Incomplets`, even though they represented different axes.

Build 60 clarifies the daily Studio language without replacing the accepted workflow authority.

Home now presents:

```text
PRODUCTION
Needs attention
Production complete

CATALOG / PUBLICATION
Published
Drafts
```

Tracks now exposes:

```text
Needs attention / Production complete / Published / All
```

Important semantic correction: **production completion and publication overlap**.

A published track may still appear under `Needs attention` when Studio has a useful production action such as lyrics timing or current SonicTrace analysis. Conversely, `Published` remains a publication/catalog visibility state.

The existing Phase 7-A workflow model still computes readiness; Build 60 changes artist-facing grouping and wording, not canonical truth.

## Safety / authority

Build 60 does not add:

- generic write routes;
- R2 write ownership;
- Track Manager replacement authority;
- SonicTrace backend mutations;
- Worker deployment;
- Album mutation;
- Release Campaign canonical persistence;
- Phase 7-C behavior.

Release Campaign remains browser-local/review-only with `canonicalWrite: false`.

## Validation gates

Before merge, the exact feature head must pass the complete historical + current validation chain, including the new `test-studio-focus-build60.mjs` guard, TypeScript and Vite production build.

After merge, GitHub Pages must deploy the exact merge SHA.

Only then may deployed browser smoke begin. CI/Pages success is still **NOT** REAL USER PASS.

## Real-user smoke boundary

Do not mutate production data merely to manufacture profile states.

The deployed review should confirm only naturally available evidence:

1. Home distinguishes `Needs attention / Production complete / Published / Drafts` clearly;
2. Tracks uses the same production/publication distinction and allows a published track to remain in `Needs attention` when its workflow genuinely has a next action;
3. a current SonicTrace track shows a compact truthful artist summary on Track;
4. `Details / Advanced` still opens the full SonicTrace analysis;
5. no vectors / GPU plumbing occupy the daily Track view;
6. PARTIAL / UNAVAILABLE / OUTDATED/public fallback remain truthful when those states are naturally encountered;
7. no authority/write regression is observed.

Only observed deployed behavior may later be marked REAL USER PASS.
