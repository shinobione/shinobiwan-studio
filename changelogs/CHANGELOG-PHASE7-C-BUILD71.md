# SHINOBIWAN Studio v0.19.3 · Build 71

Codename: `studio-focus-slice4-phase7c-duration-evidence-corrective`
Date: 2026-08-14
Status: **COMPLETE — REAL USER PASS**
Accepted: **2026-08-14**

## Trigger

Build70 real-user smoke on `uNTouCHaBLe` exposed a canonical contradiction:

- the canonical master audio was readable in-browser at about **3:55**;
- the final canonical lyrics timestamp was **03:48.593**;
- Track Manager quality still reported `duration <= 0` and final timestamp beyond audio end.

The user input was valid. The root cause was Track Manager v5.21 persisting the audio asset/revision without deriving `manifest.duration`, while metadata quality validation had no browser audio-duration evidence.

## Backend corrective

Track Manager **v5.22 / Studio bridge v1.12** adds bounded browser-measured audio duration as **derived evidence**, not as a generic editable metadata field.

Preserved authority:

- Track Manager remains the protected canonical write authority;
- Studio remains orchestrator, not a generic R2 writer;
- `expectedUpdatedAt` stale protection remains mandatory;
- no new generic mutation route;
- Album membership/order remains owned by `album.trackIds`;
- Lyrics authority remains canonical `lyrics.txt`;
- public Worker remains v2.7 and was not deployed.

Backend evidence:

```text
LaunchPAD/TM PR       #232
Backend tested head  888d29e9b7064346311ed3c959669a327505204d
Cloudflare CI        31757006174 · SUCCESS
LaunchPAD CI         31757006198 · SUCCESS
Overflow CI          31757006309 · SUCCESS
Backend merge        be7d970f6577e0e54eade04a5ef764a733baed42
Admin deploy run     31789368122 · SUCCESS · target=admin
TM Worker Version ID df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Track Manager        v5.22
Studio bridge        v1.12
Public Worker        v2.7 · deploy steps SKIPPED
```

## Build71 behavior

### Existing tracks with broken duration

`Validate metadata` measures the currently protected canonical master in-browser using credentialed metadata loading.

The measurement is sent separately as evidence to TM v5.22. When the manifest duration differs, the normalized proposal reports `duration` as a **derived repair**. The exact reviewed evidence is retained for the subsequent explicit Save/Publish against the same canonical revision.

After save, Studio privately rereads the exact current Track and verifies the persisted duration before reporting `CANONICAL REREAD · VERIFIED`.

### Future audio uploads / New Track

The existing guarded `asset-upload-v1` multipart path measures the selected audio File before upload and carries `audioDuration` / `audioReadable=true` without adding custom headers or weakening the existing CORS-simple upload transport.

TM v5.22 derives `manifest.duration` at the same guarded audio-upload revision. Build70 `Create & Publish` therefore receives canonical duration without a second manual metadata repair step.

If browser metadata cannot be measured, Studio invents nothing and quality remains blocked truthfully.

## Build69 + Build70 lineage preserved

Build71 is the accepted end of the Phase 7-C Runtime Slice 1 corrective chain:

```text
Build 69  guided Metadata / Identity runtime Slice 1
Build 70  pre-smoke readiness / publication / Album semantics / New Track corrective
Build 71  canonical audio-duration evidence corrective · REAL USER PASS
```

Build69 introduced the guided flow. Build70 fixed the first real-user UX/product-model findings. Build71 fixed the deeper Track Manager duration contract discovered during Build70 smoke.

Historical candidates are not retroactively marked accepted; **Build71 is the accepted runtime containing the validated cumulative behavior**.

## Studio evidence

```text
Safety before change  safety/pre-build71-duration-evidence-fix-20260814-0216
Feature branch        agent/build71-duration-evidence-fix
PR                    #101
Exact tested head     4298a07e13983786833240dd69a61a72dc09636e
Studio validation     31757665434 · SUCCESS
Runtime merge         0b3c3d452076708c698de71d9c691b5e459f7c17
Pages deploy run      31789774785 · SUCCESS · exact merge SHA
Post-deploy checkpoint safety/post-build71-deployed-candidate-20260814-1152
Real-user smoke       BUILD71 PASS · 2026-08-14
```

## Real-user acceptance

The deployed Build71 / TM5.22 stack was exercised by the user and explicitly accepted with:

`@GitHub BUILD71 PASS`

This closes the smoke gate opened by the Build69 → Build70 → Build71 chain.

Accepted outcomes include:

- production readiness remains separate from publication state;
- canonical Album membership drives Album-track semantics;
- exact quality errors/warnings are visible rather than summarized only as counts;
- New Track no longer sends the forbidden Track-side Album cache through generic create metadata;
- safe `Create draft` / `Create & Publish` orchestration is retained;
- canonical audio duration can be repaired from measured evidence without manual duration entry or unnecessary re-upload;
- false `duration <= 0` / lyrics-end-after-audio blockers are removed when the canonical master proves a valid duration;
- explicit publication remains guarded and canonical reread verified.

## Acceptance rule

**CI GREEN ≠ DEPLOYED CANDIDATE ≠ REAL USER PASS.**

Build71 has completed all three stages and is therefore the **current accepted Studio runtime**.
