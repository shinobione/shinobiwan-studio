# Studio Focus Build 68 — Home lead priority corrective

Status: **COMPLETE — REAL USER PASS**  
Date: 2026-08-13  
Accepted: 2026-08-14  
Version: **v0.19.3 · Build 68**  
Codename: `studio-focus-slice4-home-lead-priority`

## Problem

Focus Home previously preferred the last-opened track before considering whether that track still needed production work. A production-complete track such as `Magnetic Midnight` could therefore remain the large Home lead indefinitely even while its own status said the production checklist was complete.

The fallback also allowed a completed `workflow[0]` item to become the lead when the actual attention queue was empty.

## Corrective behavior

Home lead selection now follows:

```text
last opened track
  └─ unfinished? → use as lead
       otherwise ↓
first unfinished workflow item
  └─ none? → PRODUCTION QUEUE CLEAR
```

Consequences:

- last-opened continuity is preserved only for unfinished work;
- completed tracks no longer masquerade as Next Action;
- when nothing needs attention, Home explicitly shows `PRODUCTION QUEUE CLEAR`;
- summary counters remain visible;
- workflow calculation and canonical data contracts are unchanged.

## Scope / authority

Studio presentation/orchestration only.

No change to:

- Track Manager routes or write authority;
- Cloudflare R2;
- Album/Lyrics/SonicTrace contracts;
- LaunchPAD public Worker;
- Phase 7-B receipt semantics;
- Release Campaign review-only authority.

## Exact evidence

```text
Safety before change  safety/pre-build68-home-lead-priority-20260813-2228
Feature branch        agent/build68-home-lead-priority
PR                    #96
Tested head           cf5131f489d72ca5fae72544dacd9eaecc78077f
Validation run        31741483430 · SUCCESS
Merge commit          5c0428e500b4e6d5c9d1069bb440eac78b79955e
Runtime Pages deploy  31743413418 · SUCCESS
Real-user smoke       PASS · 2026-08-14
Post-pass checkpoint  safety/post-build68-home-real-user-pass-20260814-0005
```

The docs-only merge that follows this acceptance does not alter the Build 68 runtime identity or its tested/deployed runtime SHA.

## Real-user acceptance

Build 68 is accepted after browser smoke confirmed the Home lead-priority corrective behaves as intended:

1. a production-complete last-opened track no longer owns the Home lead merely because it was visited most recently;
2. an unfinished track becomes lead when one exists;
3. an empty attention queue produces `PRODUCTION QUEUE CLEAR`;
4. Home counters/navigation remain intact.

**Build 68 is therefore the current accepted Studio baseline.**

Phase 7-C remains **STARTED at contract level / Runtime Slice 1 NOT STARTED**. This Build 68 acceptance does not itself authorize or implement Runtime Slice 1.
