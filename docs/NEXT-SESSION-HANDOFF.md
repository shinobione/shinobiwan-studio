# NEXT SESSION HANDOFF — Build 68 → Phase 7-C Runtime Slice 1

Updated: 2026-08-13 after PR #96 merge and exact Pages deployment verification.

## Start here

Before modifying anything, verify real GitHub/deployment state again.

Expected Studio state:

```text
main                 5c0428e500b4e6d5c9d1069bb440eac78b79955e
version              v0.19.3
build                68
codename             studio-focus-slice4-home-lead-priority
PR                   #96 · merged
validated head       cf5131f489d72ca5fae72544dacd9eaecc78077f
validation run       31741483430 · SUCCESS
Pages deploy run     31743413418 · SUCCESS
Build 68 user smoke PENDING
```

Accepted baseline underneath Build 68:

```text
Studio Build 67      Foundation Regression Repair · REAL USER PASS
Track Manager        v5.21 · bridge v1.11 · repair scope REAL USER PASS
TM deploy run        31728992790 · admin only
TM Worker Version ID 0e1b9a3f-eabd-432e-8872-24ff0a9c085f
Public Worker        v2.7 · unchanged
LaunchPAD            2026.08.12.102 · REAL USER PASS
SonicTrace           V2-E Build 08 · REAL USER PASS
Deep Audio           2.0.3-alpha
LRC Maker            6.3.8
```

## First mandatory action — Build 68 real-user Home smoke

Do **not** start Phase 7-C runtime implementation until the user has actually checked Build 68 in the browser.

Smoke:

1. hard-refresh Studio;
2. verify a production-complete last-opened track such as `Magnetic Midnight` no longer remains the large Home lead;
3. verify an unfinished track becomes lead when one exists;
4. if no track needs attention, verify `PRODUCTION QUEUE CLEAR`;
5. verify Home counters/navigation remain intact.

If the user reports PASS:

- record Build 68 as REAL USER PASS in README / ROADMAP / CHANGELOG / Build68 changelog;
- create a post-Build68 acceptance checkpoint if tooling permits;
- only then resume Phase 7-C runtime Slice 1 under fresh explicit authorization.

If the user reports FAIL:

- keep Build 68 as deployed candidate/failed smoke evidence;
- do not start Phase 7-C;
- diagnose and correct Home only.

## Frozen architecture

- GitHub = code authority.
- Cloudflare R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private cockpit/orchestrator, never a generic R2 writer.
- LaunchPAD = public listener UX.
- SonicTrace = audio intelligence.
- LRC Maker = lyrics synchronization.
- canonical `trackId` = R2 slug everywhere.
- public fallback is read-only and can never verify canonical writes.

### Lyrics

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronization authority
.lrc                      = export / compatibility only
```

### Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` owns membership and artistic order. Track-side Album metadata is compatibility cache only.

### SonicTrace

```text
tracks/<slug>/analysis/sonictrace/latest.json
tracks/<slug>/analysis/sonictrace/history/<analysisId>.json
```

## Phase 7-B receipt rules — preserve exactly

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

A canonical write is VERIFIED only after exact trackId, allowlisted operation/effect, private Track Manager reread, same returned trackId, operation-specific evidence and stale async protection.

## Release Campaign — preserve exactly

- MASTER FINAL 16:9.
- 1:1 and 9:16 each derive independently from MASTER.
- 9:16 never derives from 1:1.
- browser-local drafts.
- ZIP review-only.
- `canonicalWrite: false`.
- no silent R2 promotion.

## Phase 7-C Runtime Slice 1 — Guided Metadata / Identity completion

Phase 7-C contract is already locked in [`PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`](PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md).

Runtime Slice 1 has **not started**.

Target flow:

```text
Home / Tracks / Workflow Next Action
→ Track guided Metadata / Identity context
→ edit
→ Validate metadata
→ review normalized proposal
→ explicit human confirmation
→ existing guarded metadata save
→ backend + Studio private canonical reread
→ VERIFIED
→ recompute Workflow / Next Action from canonical state
```

Mandatory constraints:

- no generic Studio/R2 writer;
- reuse existing production-proven Track Manager metadata operation;
- private read required;
- advertised capability/op required;
- exact current trackId required;
- fresh revision / ETag / state token required;
- stale = hard stop;
- explicit human confirmation before mutation;
- no mutation on load;
- no blind retry;
- ambiguous result → canonical reread before retry decision;
- success-looking UI is not VERIFIED until canonical reread proves it;
- Next Action recomputes from canonical reread, not optimistic local state;
- public fallback remains read-only;
- Phase 7-B receipts remain unchanged;
- Release Campaign remains review-only;
- no Worker / R2 / Track Manager bump unless implementation audit proves it genuinely necessary.

## Required implementation process after Build 68 PASS

1. verify GitHub real state and deployments;
2. create a fresh safety branch from current Studio main;
3. create a dedicated feature branch;
4. choose the next coherent unused build number;
5. document the candidate;
6. add a focused regression guard while preserving all prior guards;
7. open Draft PR;
8. require exact-head CI;
9. anti-drift check before merge;
10. merge the exact tested head;
11. verify exact merge-SHA Pages deployment;
12. obtain real-user browser smoke;
13. stop after Slice 1 and require fresh authorization before Slice 2.

## Historical landmines

- Build 62 = Studio Focus closeout REAL USER PASS.
- Build 63 = superseded; do not reuse.
- Build 64 = deployed candidate / FAILED REAL USER SMOKE.
- Builds 65–66 = corrective lineage superseded by Build 67.
- Build 67 = accepted Foundation Regression Repair REAL USER PASS.
- Build 68 = deployed Home lead candidate until browser smoke says otherwise.
- old Studio PR #84 / #87 are closed historical branches; do not revive them.

## Files to read before working

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`
- `changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Build 68 browser smoke first. Phase 7-C runtime Slice 1 only after that smoke passes and the user gives fresh explicit authorization in the active conversation.**
