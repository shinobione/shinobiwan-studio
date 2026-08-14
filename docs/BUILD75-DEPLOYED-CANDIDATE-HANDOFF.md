# Build75 deployed-candidate handoff

Date: 2026-08-14  
Status: **HISTORICAL DEPLOYED-CANDIDATE HANDOFF — SUPERSEDED BY BUILD75 REAL USER PASS**

Build75 subsequently completed the browser smoke and is now the current accepted Studio runtime. The authoritative accepted record is [`../changelogs/CHANGELOG-PHASE8-BUILD75.md`](../changelogs/CHANGELOG-PHASE8-BUILD75.md).

## Exact runtime receipts

```text
Studio                 v0.19.3 · Build75
Codename               studio-focus-slice4-phase8-health-drilldown
Safety pre             safety/pre-phase8-health-drilldown-build75-20260814-1946
PR                     #110
Final tested head      e0cbc92b7d42de2354201da525852c5efe4c6d20
Final CI               31826276973 · SUCCESS
Runtime merge          e6c2649583446087d0d256b48e556e9c6e93ede9
Pages                  31826452231 · SUCCESS · exact merge SHA
Safety post-deploy     safety/post-build75-deployed-candidate-20260814-1959
Candidate docs PR      #111
Candidate docs CI      31826672166 · SUCCESS
Candidate docs merge   b2bc1cab42849f12afc58cf3b1abbb8c45fb8a3e
Candidate docs Pages   31826760916 · SUCCESS
Real-user smoke        BUILD75 PASS · 2026-08-14
Safety post-RUP        safety/post-build75-real-user-pass-20260814-2048
```

Historical discovery run:

```text
Initial head           d7af7700c652f11a42c36d6aa0495649e92a9eb1
Initial CI             31826089546 · FAILURE
Cause                  inherited Phase7 literal read-only boundary copy removed
Corrected head         fa09c903d122c1e33440335e5c1c691c7c7c698d
Corrected CI           31826190402 · SUCCESS
```

The old Phase7 guard was preserved, not weakened.

## Accepted Build75 behavior

```text
Home Content Health count
→ #/workflow/health/<bounded-id>
→ existing Workflow queue filtered to every affected Track
→ existing stages
→ existing workflow.nextAction
→ existing guarded Track Workspace
```

Supported health drill-downs:

- Master audio missing;
- Cover missing;
- Lyrics source missing;
- Lyrics timing needed;
- SonicTrace missing/outdated;
- Release blockers;
- Published with production gaps;
- Production-ready Drafts.

No second queue or priority model exists. Search and the existing Workflow Queue selector remain available on top of the health filter.

Build75 also corrected stale read-only shell labels to `PHASE 8` and `Track Manager v5.22 · bridge v1.12`.

## Cross-stack unchanged

```text
Track Manager          v5.22
Studio bridge          v1.12
TM Worker Version ID   df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker          v2.7
LaunchPAD              2026.08.12.102 · REAL USER PASS
SonicTrace             V2-E Build 08 · REAL USER PASS
LRC Maker              6.3.8
R2 mutation/migration  NONE
```

No Worker deployment occurred for Build75.

## Final status

```text
CI GREEN               ✅
DEPLOYED CANDIDATE     ✅
REAL USER PASS         ✅ BUILD75 PASS
```

This file remains as the pre-acceptance handoff evidence only. Current continuation belongs in [`NEXT-SESSION-HANDOFF.md`](NEXT-SESSION-HANDOFF.md).
