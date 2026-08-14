# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records are organized under [`changelogs/`](changelogs/README.md).

## Current deployed candidate

### v0.19.3 · Build 72 — 2026-08-14

Codename: `studio-focus-slice4-phase7c-slice2-guided-core-media`  
Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

Phase 7-C Runtime Slice 2:

- Core Media becomes the truthful Next Action after Identity;
- missing master audio now routes to Track / overview, where the canonical Master audio uploader actually lives;
- audio ready + cover missing routes to Visuals / assets;
- aggregate Track Manager quality errors no longer masquerade as Identity work;
- Identity owns explicit identity prerequisites while final Release retains the aggregate canonical quality gate;
- existing Track Manager v5.22 / bridge v1.12 `asset-upload-v1` authority is reused unchanged;
- no new Worker route, Track Manager bump, public Worker deployment or deployment-time R2 mutation.

Exact candidate evidence:

```text
Accepted baseline       Build71 · REAL USER PASS
Safety pre              safety/pre-phase7c-slice2-build72-20260814-1221
Feature branch          agent/phase7c-slice2-guided-core-media-build72
PR                      #103
Tested head             b79ce03a98fad46e6bf4c488e456af07bba951be
Studio CI               31792368962 · SUCCESS
Runtime merge           dceee27dd8f8cdc96f8f88f10c5588e283e56699
Pages deploy            31792436456 · SUCCESS · exact merge SHA
Safety post-deploy      safety/post-build72-deployed-candidate-20260814-1230
Track Manager           v5.22 · unchanged
Studio bridge           v1.12 · unchanged
Public Worker           v2.7 · unchanged
Real-user smoke         PENDING
```

Detailed candidate record: [`changelogs/CHANGELOG-PHASE7-C-BUILD72.md`](changelogs/CHANGELOG-PHASE7-C-BUILD72.md).

## Current accepted release

### v0.19.3 · Build 71 — 2026-08-14

Codename: `studio-focus-slice4-phase7c-duration-evidence-corrective`  
Status: **COMPLETE — REAL USER PASS**

Build71 closes the Phase 7-C Runtime Slice 1 corrective chain started by Build69 and refined by Build70.

Accepted cumulative behavior:

- Metadata/Identity Next Actions open the guided Metadata context directly;
- normalized proposal review and explicit confirmation remain mandatory;
- private canonical reread is required before a write is VERIFIED;
- production readiness is independent from publication state;
- canonical Album membership drives Album-track semantics;
- exact quality errors/warnings are visible;
- New Track no longer sends Track-side Album cache through generic create metadata;
- `Create draft` / guarded `Create & Publish` remain available;
- canonical audio duration is a derived fact, not manually editable metadata;
- Studio can measure protected canonical audio duration and submit bounded evidence to TM v5.22;
- future audio uploads can persist derived duration on the same guarded revision;
- public fallback remains read-only and public Worker v2.7 was not redeployed.

Exact acceptance evidence:

```text
Studio tested head      4298a07e13983786833240dd69a61a72dc09636e
Studio validation       31757665434 · SUCCESS
Studio PR               #101
Studio merge            0b3c3d452076708c698de71d9c691b5e459f7c17
Pages deploy            31789774785 · SUCCESS
Real-user smoke         BUILD71 PASS · 2026-08-14
Safety pre              safety/pre-build71-duration-evidence-fix-20260814-0216
Safety post-deploy      safety/post-build71-deployed-candidate-20260814-1152
Safety post-RUP         safety/post-build71-real-user-pass-20260814-1217

Track Manager           v5.22
Studio bridge           v1.12
Backend tested head     888d29e9b7064346311ed3c959669a327505204d
Backend merge           be7d970f6577e0e54eade04a5ef764a733baed42
Admin deploy run        31789368122 · SUCCESS · admin only
TM Worker Version ID    df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker           v2.7 · unchanged
```

Detailed record: [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md).

## Corrective lineage

### Build 70 — pre-smoke corrective

Merged/deployed candidate, superseded by accepted Build71. It separated readiness from publication, clarified Album-track semantics, exposed exact quality blockers and repaired the New Track generic-Album create bug while adding guarded `Create & Publish` orchestration.

### Build 69 — Phase 7-C Runtime Slice 1 origin

Merged/deployed candidate, superseded by Builds70/71. It introduced guided Metadata/Identity routing, normalized proposal review, explicit confirmation, protected save and private canonical reread workflow recomputation.

Historical candidates are preserved rather than retroactively marked REAL USER PASS.

## Accepted predecessor

### v0.19.3 · Build 68 — 2026-08-14

Home lead priority corrective · **REAL USER PASS**.

```text
Safety before change  safety/pre-build68-home-lead-priority-20260813-2228
PR                    #96
Tested head           cf5131f489d72ca5fae72544dacd9eaecc78077f
Validation run        31741483430 · SUCCESS
Runtime merge         5c0428e500b4e6d5c9d1069bb440eac78b79955e
Pages deploy run      31743413418 · SUCCESS
Real-user smoke       PASS · 2026-08-14
Post-pass checkpoint  safety/post-build68-home-real-user-pass-20260814-0005
```

## Earlier accepted lineage

- Build 67 — Foundation Regression Repair closeout · REAL USER PASS.
- Build 62 — Studio Focus program closeout · REAL USER PASS.
- Build 64 remains deployed **FAILED REAL USER SMOKE** evidence.
- Builds 65–66 remain corrective lineage superseded by Build67.
- Build 63 remains historical/superseded and is not reused.

## Detailed history

- Build72 deployed candidate: [`changelogs/CHANGELOG-PHASE7-C-BUILD72.md`](changelogs/CHANGELOG-PHASE7-C-BUILD72.md)
- Build71 accepted: [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- Build69 origin record: [`changelogs/CHANGELOG-PHASE7-C-BUILD69.md`](changelogs/CHANGELOG-PHASE7-C-BUILD69.md)
- Build68 accepted: [`changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md`](changelogs/CHANGELOG-STUDIO-FOCUS-BUILD68.md)
- Foundation repair closeout: [`docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md)
- Build64 failed-smoke record: [`docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md`](docs/STUDIO-BUILD64-FOUNDATION-REGRESSION-REPAIR.md)
- Build30→61 milestone logs: [`changelogs/README.md`](changelogs/README.md)
- Current roadmap: [`docs/ROADMAP-CURRENT.md`](docs/ROADMAP-CURRENT.md)
- Next-session handoff: [`docs/NEXT-SESSION-HANDOFF.md`](docs/NEXT-SESSION-HANDOFF.md)

## Acceptance policy

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Build71 has completed the full chain and remains the current accepted Studio runtime. Build72 is deployed and awaits real-user smoke.
