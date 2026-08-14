# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records are organized under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.3 · Build 74 — 2026-08-14

Codename: `studio-focus-slice4-phase8-content-health-truth`  
Status: **COMPLETE — PHASE 8 SLICE 1 / REAL USER PASS**

Build74 is the first accepted Phase8 runtime slice after Phase7-C program closeout.

Accepted behavior:

- legacy Content Health no longer penalizes optional Canvas;
- production readiness is Identity20 + Audio20 + Cover20 + Lyrics20 + current SonicTrace20;
- Canvas contributes 0 and creates no attention item;
- `PRODUCTION COMPLETE` excludes the Release/publication stage;
- production and publication remain separate axes;
- Home keeps `NEEDS ATTENTION / PRODUCTION COMPLETE / PUBLISHED / DRAFTS` terminology with truthful production-only counts;
- a production-ready Draft may correctly remain Draft with `Publish track` as Next Action;
- Home gains a compact read-only Content Health surface for missing audio, cover, lyrics source, lyrics timing, SonicTrace gaps and Release blockers;
- Content Health also exposes published-with-production-gaps and production-ready-Drafts cross-axis counts;
- all health actions reuse the existing Track `workflow.nextAction`; no second priority engine exists;
- no new write authority, Worker route, Track Manager deployment or R2 migration was introduced.

Exact acceptance evidence:

```text
Safety pre              safety/pre-phase8-content-health-build74-20260814-1810
Studio PR               #108
Exact tested head       da7b5498dd8e1f6120c346e07fe1b1e741d40104
Validation run          31819203565 · SUCCESS
Runtime merge           c95e33bcb0c33b18fc8e6e9a35a05ec28ad142a9
Pages deploy run        31819333501 · SUCCESS · exact merge SHA
Safety post-deploy      safety/post-build74-deployed-candidate-20260814-1827
Real-user smoke         BUILD74 PASS · 2026-08-14
Safety post-RUP         safety/post-build74-real-user-pass-20260814-1926
Track Manager           v5.22 · unchanged
Studio bridge           v1.12 · unchanged
Public Worker           v2.7 · unchanged
R2 migration            NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE8-BUILD74.md`](changelogs/CHANGELOG-PHASE8-BUILD74.md).

## Phase 7-C program closeout audit — 2026-08-14

Status: **COMPLETE — DOCS-ONLY / NO ADDITIONAL RUNTIME SLICE REQUIRED**

After Build73 REAL USER PASS, the accepted runtime was reread before allocating Build74. The audit proved the remaining workflow stages already satisfy the Phase 7-C guided-action contract:

- Lyrics already uses protected LRC Maker context, validate/save revision+ETag guards, canonical reread, `lyrics-saved` receipt and Studio private Track reread;
- Intelligence already uses current canonical audio sourceVersion, REVIEW / NOT SAVED, explicit save, Track Manager `STALE_AUDIO`, verified latest/history sidecars, `analysis-saved` receipt and Studio private Track reread;
- Release already uses the accepted Slice1 validation/confirmation/protected publication flow while Release Campaign stays review-only;
- no legitimate Slice3 runtime capability was missing.

Phase7-C therefore remains program-complete on Build73. Build74 subsequently opened Phase8 without altering those authority contracts.

Detailed audit: [`docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md).

## Accepted Phase 7-C baseline

### v0.19.3 · Build 73 — 2026-08-14

Codename: `studio-focus-slice4-phase7c-slice2-status-truth-corrective`  
Status: **COMPLETE — REAL USER PASS / PHASE 7-C PROGRAM BASELINE**

Build73 closed the Phase 7-C Runtime Slice 2 corrective chain started by Build72.

Accepted Slice2 behavior:

- Core Media is the truthful guided stage after Identity;
- missing master audio routes to Track / overview / Master audio;
- audio ready + Cover missing routes to Visuals / Cover;
- Visuals is production-ready when canonical Cover exists; Canvas is optional;
- Lyrics is production-ready only when canonical `lyrics.txt` contains recognized timestamps;
- TXT without timestamps remains `Timing needed` / attention everywhere;
- Home, Tracks, Workflow and Track Workspace use the same Phase 7 Next Action authority;
- aggregate Track Manager quality remains authoritative at Release and no longer masquerades as Identity work;
- existing Track Manager v5.22 / bridge v1.12 `asset-upload-v1` authority is reused unchanged.

Exact acceptance evidence:

```text
Build72 PR              #103
Build72 tested head     b79ce03a98fad46e6bf4c488e456af07bba951be
Build72 CI              31792368962 · SUCCESS
Build72 runtime merge   dceee27dd8f8cdc96f8f88f10c5588e283e56699
Build72 Pages           31792436456 · SUCCESS

Build73 safety pre      safety/pre-build73-status-truth-corrective-20260814-1312
Build73 PR              #105
Build73 tested head     b6dc39e7555aa040740de5efa54bd75b1e78101a
Build73 CI              31795481278 · SUCCESS
Build73 runtime merge   4684291f64d12bd514f103ba1c5050d05d0143ac
Build73 Pages           31795547072 · SUCCESS · exact merge SHA
Safety post-deploy      safety/post-build73-deployed-candidate-20260814-1318
Safety post-RUP         safety/post-build73-real-user-pass-20260814-1715
Real-user smoke         BUILD73 PASS · 2026-08-14
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](changelogs/CHANGELOG-PHASE7-C-BUILD73.md).

## Slice 2 corrective lineage

### Build 72 — guided Core Media origin

Merged/deployed candidate, superseded by accepted Build73. It introduced truthful Core Media routing and corrected stage ownership, but real-user smoke exposed contradictory status presentation between Home and Track Workspace.

Build72 remains historical candidate evidence and is not retroactively marked REAL USER PASS.

## Accepted Slice 1 predecessor

### v0.19.3 · Build 71 — 2026-08-14

Codename: `studio-focus-slice4-phase7c-duration-evidence-corrective`  
Status: **COMPLETE — REAL USER PASS**

Build71 closed Phase 7-C Runtime Slice 1 through the Build69→70→71 corrective chain. It preserved guided Metadata/Identity flow, explicit validation/confirmation, private canonical reread verification, readiness/publication separation, Album authority and derived audio-duration evidence via TM v5.22 / bridge v1.12.

Detailed record: [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

## Earlier corrective lineage

- Build70 — pre-smoke readiness/publication/Album/New Track corrective candidate, superseded by Build71.
- Build69 — Phase 7-C Runtime Slice1 origin candidate, superseded by Builds70/71.
- Build68 — Home lead priority corrective · REAL USER PASS.
- Build67 — Foundation Regression Repair closeout · REAL USER PASS.
- Build64 remains deployed **FAILED REAL USER SMOKE** evidence.
- Builds65–66 remain corrective lineage superseded by Build67.
- Build63 remains historical/superseded and is not reused.

## Detailed history

- Build74 accepted: [`changelogs/CHANGELOG-PHASE8-BUILD74.md`](changelogs/CHANGELOG-PHASE8-BUILD74.md)
- Phase8 scope audit: [`docs/PHASE-8-SCOPE-AUDIT.md`](docs/PHASE-8-SCOPE-AUDIT.md)
- Phase7-C program closeout audit: [`docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md)
- Build73 accepted: [`changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](changelogs/CHANGELOG-PHASE7-C-BUILD73.md)
- Build72 origin candidate: [`changelogs/CHANGELOG-PHASE7-C-BUILD72.md`](changelogs/CHANGELOG-PHASE7-C-BUILD72.md)
- Build71 accepted: [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- Build69 origin record: [`changelogs/CHANGELOG-PHASE7-C-BUILD69.md`](changelogs/CHANGELOG-PHASE7-C-BUILD69.md)
- Build68 accepted: [`changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md)
- Foundation repair closeout: [`docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- Current roadmap: [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- Next-session handoff: [`docs/NEXT-SESSION-HANDOFF.md`](docs/NEXT-SESSION-HANDOFF.md)

## Acceptance policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Build74 completed the full runtime acceptance chain and is the current accepted Studio runtime. Phase8 Slice1 is closed. Build75 is unused until the next bounded Phase8 scope is audited.