# SHINOBIWAN STUDIO — Canonical Project State

Updated: 2026-08-15 after **Build85 deployed candidate** publication. Real-user acceptance is pending.

This file is the short current checkpoint. It is the first project-state document to read after `AGENTS.md`.

## Current accepted runtime

```text
Studio version          v0.19.6
Studio build            Build84
Codename                studio-focus-slice4-phase9-sonictrace-save-response-loss-truth
Acceptance              REAL USER PASS
Runtime PR              #132
Exact tested head       377de51416d4aea258830e55e894707d9f3f6512
Final runtime CI        31858911420 · SUCCESS
Runtime merge SHA       b7cf745e11adee1eb77900a32b9b6ca8ea80e000
Runtime Pages           31858977765 · SUCCESS
Real-user smoke         BUILD84 PASS · 2026-08-15
```

Build84 remains the latest **accepted** runtime until Build85 receives explicit real-user browser acceptance.

## Current deployed candidate

```text
Studio version          v0.19.7
Studio build            Build85
Codename                studio-focus-slice4-phase9-album-metadata-response-loss-truth
Acceptance              DEPLOYED CANDIDATE · REAL USER SMOKE PENDING
Runtime PR              #135
Exact tested head       4bbfb93dfc9333eb1e8fc3a35b62699611e69367
Final runtime CI        31863267911 · SUCCESS
Runtime merge SHA       1199f6a0e26da88e54f64a369985c2a72267e5a5
Runtime Pages           31863313848 · SUCCESS · exact runtime merge SHA
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by deployment
```

## Current ecosystem baseline

```text
Track Manager           v5.23 · DEPLOYED
Studio bridge           v1.13
TM admin Worker         439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker           v2.7 · unchanged
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

Build85 changes only Studio client-side canonical **Album metadata save** verification / response-loss classification. It does **not** change Album create, membership/order, move, upload, asset deletion, Track Manager, Workers, R2 schema/data, LaunchPAD, SonicTrace Deep Audio or LRC Maker.

## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1          COMPLETE · Build82 REAL USER PASS
Phase 9 Slice2          COMPLETE · Build83 REAL USER PASS
Phase 9 Slice3          COMPLETE · Build84 REAL USER PASS
Phase 9 Slice4          Build85 DEPLOYED CANDIDATE · smoke pending
Phase 10                FUTURE
Official Phase 11       NONE
```

## Build82–84 accepted behavior

- **Build82** hardens destructive Track/Album asset deletion ambiguity with private canonical reread and no blind retry.
- **Build83** hardens canonical `lyrics.txt` save response-loss truth with exact revision + ETag + normalized requested text verification.
- **Build84** hardens SonicTrace analysis save response-loss truth using exact `analysisId` presence across canonical latest + history.

## Build85 candidate behavior

The fresh post-Build84 audit proved **Album metadata save only** as the smallest coherent remaining Album write-truth gap. The deployed Track Manager already stale-guards, writes, verifies and rolls back this transaction; Build85 changes no backend behavior.

```text
Album metadata save response lost / timeout
→ NEVER blind automatic retry
→ private canonical Album reread
   ├─ new revision + exact requested metadata + stable non-metadata shape
   │    → COMMITTED / VERIFIED
   ├─ original revision unchanged
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ revision changed but exact metadata-only postcondition unproven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Stable non-metadata shape includes canonical identity, ordered `trackIds`, assets and `createdAt`, preventing unrelated membership/media drift from being mistaken for metadata-save recovery.

Normal HTTP success also requires exact server-returned revision + requested metadata + stable non-metadata shape before Studio calls the save verified.

## Current blockers

No code, CI or deployment blocker remains for Build85.

**Acceptance blocker:** real-user browser smoke is pending. Do not promote Build85 to REAL USER PASS before an explicit verdict.

## Exact next action

Run the bounded **Build85 normal-browser Album metadata regression smoke**:

1. hard refresh Studio and verify `v0.19.7 · Build85`;
2. open an existing safe canonical Album;
3. note its current revision;
4. edit one harmless metadata field such as heading/description/accent;
5. click **Save metadata** normally;
6. expect **`Album metadata saved and canonically verified.`**;
7. confirm the revision advances and the saved value survives canonical reload;
8. sanity-check normal Albums / Track / Lyrics / SonicTrace navigation.

Do **not** deliberately cut network or Cloudflare Access during the save merely to manufacture response loss.

After explicit PASS: close Build85 as REAL USER PASS, then run a fresh Phase9 audit before allocating Build86. Album membership/move/upload/create response-loss truth and Access/read/PWA resilience remain candidates, not commitments.

## Frozen stop lines

- GitHub = code authority.
- R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private orchestrator, never a generic R2 writer.
- Public fallback = read-only and never canonical-write verification.
- No blind retry after ambiguous writes.
- No destructive production smoke merely to prove a guard.
- `lyrics.txt` remains the unique canonical lyrics source.
- `album.trackIds` remains the sole Album membership/artistic-order authority.
- Operation-specific response-loss recovery must never be generalized without a fresh audit.

## Relevant safety references

```text
safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
safety/post-build82-deployed-candidate-20260815-0248
safety/pre-phase9-lyrics-response-loss-build83-20260815-0319
safety/post-build83-real-user-pass-20260815-0406
safety/post-build83-rup-docs-closeout-20260815-0412
safety/pre-phase9-sonictrace-response-loss-build84-20260815-0413
safety/post-build84-deployed-candidate-20260815-0425
safety/post-build84-candidate-docs-closeout-20260815-0429
safety/post-build84-real-user-pass-20260815-0435
safety/post-build84-rup-docs-closeout-20260815-0441
safety/pre-phase9-album-metadata-response-loss-build85-20260815-0555
safety/post-build85-deployed-candidate-20260815-0602
```

## Acceptance vocabulary

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Build84 is **REAL USER PASS**. Build85 is **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**. Build86 is **UNALLOCATED**.
