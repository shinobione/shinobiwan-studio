# Studio Focus Slice 4 — Compact SonicTrace Artist Summary

Build: **60**  
Release: **v0.19.0**  
Codename: `studio-focus-slice4-sonictrace-summary`  
Date: 2026-08-13  
State: **IMPLEMENTED CANDIDATE — REAL USER PASS PENDING**

## Authorization

Slice 4 was started only after fresh explicit user authorization on 2026-08-13.

Build 59 was already reserved by a parallel branch and was deliberately not reused. Slice 4 uses Build 60.

Pre-implementation safety branch:

```text
safety/pre-studio-focus-slice4-build60-20260813-1021
```

Feature branch:

```text
studio-focus/build60-slice4-sonictrace-summary
```

## Product decision

SonicTrace should feel like an **assistant inside Track**, not a second product dashboard.

The daily hierarchy is:

```text
Track
├── identity / canonical master
├── production state
├── compact SonicTrace artist summary
└── progressive details
    └── full SonicTrace analysis
```

## Data source

The compact card reads the existing protected SonicTrace sidecar through the already validated Studio service adapter:

```text
GET /api/studio/tracks/<trackId>/analysis/sonictrace
```

Canonical persistence remains:

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

No new persistence format is introduced.

## Artist-summary contract

The compact model may derive presentation from existing retained fields only:

- `semanticSummary.topGenres`;
- `semanticSummary.topMoods`;
- `semanticSummary.topInstruments`;
- `semanticSummary.traits`;
- `semanticSummary.arrangement`;
- `semanticSummary.hookCount`;
- retained mastering measurements.

It does not turn relative CLAP matches into absolute probabilities.

The 512D embedding remains available to the intelligence/catalog machinery but is deliberately absent from routine Track presentation.

## Truthfulness rules

The implementation directly reuses the accepted Studio profile state authority:

```text
FULL
PARTIAL
UNAVAILABLE
OUTDATED
```

No duplicate profile classifier is introduced.

### FULL

Current complete profile. Compact conclusions may be shown.

### PARTIAL

Only evidence-backed conclusions are shown. The card explicitly states that the useful profile has limits.

### UNAVAILABLE

No fake Deep Audio conclusions. A clearly labeled browser-DSP fallback may appear only when actually retained.

### OUTDATED

Previous conclusions are not presented as current. The card asks for a refresh of the current canonical master.

### No analysis

The Track card explains that SonicTrace has not analyzed the current track yet and links to the existing analysis surface.

### Public fallback

Private analysis is not exposed or guessed from public LaunchPAD data.

## Progressive disclosure

The full diagnostic path remains the existing Workspace `intelligence` section and `SonicTracePanel`.

The compact card links to it with `Details / Advanced` when analysis exists or `Analyze sound` when it does not.

This preserves the accepted Studio Focus mental model:

```text
Track · Visuals · Lyrics · Release
```

SonicTrace does not return as a daily top-level Track tab.

## Production / publication clarity

Build 60 also resolves the ambiguity discovered immediately before Slice 4 authorization.

Before:

```text
Studio Home: 27 To finish / 6 Ready / 31 Released
Track Manager: 2 Incomplets / 31 Published
```

Those numbers looked comparable even though they described different models.

After:

```text
Production axis
- Needs attention
- Production complete

Publication axis
- Published
- Drafts
```

`Needs attention + Production complete` partitions the production workflow.

`Published` is independent and can overlap either production state. A published song can therefore remain `Needs attention` without being administratively incomplete or unpublished.

Tracks uses the same corrected semantics rather than excluding published tracks from production filters.

## Authority unchanged

Build 60 is presentation/read-only for SonicTrace summary.

It does not change:

- Track Manager protected write ownership;
- R2 canonical ownership;
- SonicTrace sidecar persistence;
- Phase 7-B receipt verification;
- LRC Maker canonical lyrics rules;
- Album membership/order authority;
- Release Campaign `canonicalWrite: false`;
- Worker runtime;
- Phase 7-C state.

## Validation

A dedicated Build 60 guard verifies:

- release/build/codename identity;
- compact Track integration;
- reuse of existing FULL/PARTIAL/UNAVAILABLE/OUTDATED authority;
- protected sidecar read;
- preservation of full Advanced diagnostics;
- absence of embedding vector rendering;
- absence of new write APIs;
- stale/unavailable truthfulness;
- production/publication filter separation;
- responsive presentation.

Historical Studio Focus guards are only widened where necessary to recognize the authorized v0.19 Build 60 successor or new labels. Their underlying architecture/readability/private-fallback/write-authority assertions remain enforced.

## Acceptance state

This document does **not** mark Slice 4 accepted.

Required sequence remains:

```text
exact-head CI GREEN
→ main collision recheck
→ merge tested head
→ exact merge-SHA Pages GREEN
→ real-user deployed smoke
→ only observed behavior documented as REAL USER PASS
```

Until that final deployed review, Build 60 is a candidate only.
