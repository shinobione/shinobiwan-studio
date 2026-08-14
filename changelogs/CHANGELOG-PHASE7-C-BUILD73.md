# SHINOBIWAN Studio v0.19.3 · Build 73

Codename: `studio-focus-slice4-phase7c-slice2-status-truth-corrective`  
Date: 2026-08-14  
Status: **CANDIDATE — BUILD72 REAL-USER-SMOKE CORRECTIVE**

## Why Build73 exists

Build72 correctly routed Zero-SUM to Lyrics because canonical `lyrics.txt` exists but recognized timestamps are missing. The real-user smoke nevertheless exposed contradictory presentation of that same canonical state:

- Home showed `Lyrics` as attention and correctly proposed `Synchronize lyrics`;
- Track Workspace showed a green `✓ Lyrics` while its own detail said `Timing needed`;
- Home required both Cover + Canvas before `Visuals` became ready, while Track Workspace and the Phase 7-C Core Media contract define Canvas as optional.

Build73 does not change the Phase 7 workflow priority or any canonical write contract. It makes all daily surfaces represent the existing contract consistently.

## Corrective behavior

```text
Visuals ready = canonical cover present
Canvas        = optional

Lyrics ready  = canonical lyrics.txt present + recognized timestamps
TXT only      = attention / Timing needed

Track Workspace Continue = Phase 7 workflow.nextAction
```

For Zero-SUM this means:

```text
Audio       ready
Visuals     ready when cover exists, regardless of optional Canvas
Lyrics      attention while timestamps are missing
SonicTrace  next only after Lyrics is synchronized
Release     remains a separate publication axis
```

## Scope / safety

- Studio presentation/orchestration only.
- No Track Manager route change.
- Track Manager remains v5.22 / Studio bridge v1.12.
- Public Worker v2.7 unchanged.
- No R2 migration or mutation from deployment.
- No new write authority.
- Build72 guided Core Media routing remains intact.
- Phase 7-B receipt verification remains intact.
- Build71 remains the last accepted REAL USER PASS until the corrective chain passes browser smoke.

Safety checkpoint: `safety/pre-build73-status-truth-corrective-20260814-1312`.

## Acceptance gate

```text
exact-head CI
→ anti-drift main
→ exact tested-head merge
→ exact merge-SHA Pages deployment
→ real-user smoke
→ only then REAL USER PASS
```

Required smoke after deployment:

1. Zero-SUM Home must show Visuals ready when cover exists even if Canvas is absent.
2. Zero-SUM Home must continue to show Lyrics as attention while timestamps are missing.
3. Track Workspace must show Lyrics as attention / `Timing needed`, not a green check.
4. The Track Workspace Continue action must route to the same Phase 7 next action as Home.
5. After successful lyric synchronization, both Home and Track Workspace must flip Lyrics to ready and the workflow must advance to SonicTrace.

**CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS.**
