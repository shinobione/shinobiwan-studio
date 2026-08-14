# NEXT SESSION HANDOFF — Build 72 deployed candidate

Updated: 2026-08-14 after **Phase 7-C Runtime Slice 2 · Build72 deployment**.

## Start here

Before modifying anything, verify real GitHub/deployment state again.

Current accepted Studio runtime:

```text
version               v0.19.3
build                 71
codename              studio-focus-slice4-phase7c-duration-evidence-corrective
Studio PR             #101 · merged
validated head        4298a07e13983786833240dd69a61a72dc09636e
validation run        31757665434 · SUCCESS
runtime merge         0b3c3d452076708c698de71d9c691b5e459f7c17
Pages deploy run      31789774785 · SUCCESS
Build71 user smoke    PASS · 2026-08-14
safety post-RUP       safety/post-build71-real-user-pass-20260814-1217
```

Current deployed candidate:

```text
version               v0.19.3
build                 72
codename              studio-focus-slice4-phase7c-slice2-guided-core-media
Studio PR             #103 · merged exact tested head
validated head        b79ce03a98fad46e6bf4c488e456af07bba951be
validation run        31792368962 · SUCCESS
runtime merge         dceee27dd8f8cdc96f8f88f10c5588e283e56699
Pages deploy run      31792436456 · SUCCESS · exact merge SHA
safety pre            safety/pre-phase7c-slice2-build72-20260814-1221
safety post-deploy    safety/post-build72-deployed-candidate-20260814-1230
real-user smoke       PENDING
```

Cross-stack baseline:

```text
Studio accepted      Build71 · REAL USER PASS
Studio candidate     Build72 · DEPLOYED / SMOKE PENDING
Track Manager        v5.22
Studio bridge        v1.12
TM deploy run        31789368122 · SUCCESS · admin only
TM Worker Version ID df00e4c7-bfa1-45a3-b3e8-bd2640e0a159
Public Worker        v2.7 · unchanged
LaunchPAD            2026.08.12.102 · REAL USER PASS
SonicTrace           V2-E Build 08 · REAL USER PASS
Deep Audio           2.0.3-alpha
LRC Maker            6.3.8
```

## Phase 7-C Slice 1 — CLOSED

Preserve the historical distinction:

```text
Build69  guided Metadata/Identity Slice1 origin · candidate
Build70  pre-smoke UX/product-model corrective · candidate
Build71  duration evidence corrective · REAL USER PASS
```

Do not retroactively mark Builds69/70 as REAL USER PASS. Build71 is the accepted cumulative Slice1 runtime.

## Phase 7-C Slice 2 — DEPLOYED CANDIDATE

Build72 extends guided continuation to **Core Media** while reusing the existing protected Track Manager asset operation.

Workflow order remains:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Build72 corrected two orchestration bugs:

1. missing master audio used to route to `assets`, but that section is Visuals and contains no audio uploader;
2. aggregate Track Manager quality errors were assigned to Identity, allowing media/lyrics errors to hijack the workflow priority.

Current intended behavior:

```text
master audio missing
→ Fix Core media
→ Track / overview
→ Master audio uploader
→ existing asset-upload-v1
→ protected canonical verification
→ workflow recompute

master audio ready + cover missing
→ Continue Core media
→ Visuals / assets
→ Cover uploader
→ existing asset-upload-v1
→ protected canonical verification
→ workflow recompute

Audio + Cover ready
→ next stage = Lyrics
```

Identity now owns explicit identity prerequisites only. Aggregate canonical quality remains authoritative at the Release stage.

## Build72 real-user gate

Build72 is **not accepted yet**. Required browser smoke:

1. choose a Track with missing master audio;
2. Home / Tracks / Workflow must show `Fix Core media` and land on Track / Master audio, not Visuals;
3. perform a normal guarded audio upload and confirm the operation still requires explicit confirmation and reports canonical reread verification;
4. if Cover is missing, the recomputed Next Action must become Core Media / Cover and land in Visuals;
5. after Audio + Cover are ready, Next Action must advance to Lyrics;
6. public fallback must remain unable to upload.

If this passes, Build72 can become the accepted Studio baseline. Do **not** start Phase 7-C Slice 3 before this gate closes.

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

Ordered `album.trackIds` owns membership and artistic order. Track-side Album metadata remains compatibility cache only.

### Audio duration

`manifest.duration` is a derived canonical fact from the current master audio. TM v5.22 may persist bounded browser-measured evidence only through guarded operations and only when a canonical audio asset exists.

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

## Later roadmap

```text
Phase 8   Dashboard Intelligence & Content Health
Phase 9   Security / reliability / PWA
Phase 10  Progressive extraction
```

There is no official Phase 11.

Rolling UX backlog includes premium interaction feel: tactile press/release, restrained glow/focus, coherent hover/active states and smooth reduced-motion-safe transitions.

## Historical landmines

- Build62 = Studio Focus closeout REAL USER PASS.
- Build63 = superseded; do not reuse.
- Build64 = deployed candidate / FAILED REAL USER SMOKE.
- Builds65–66 = corrective lineage superseded by Build67.
- Build67 = Foundation Regression Repair REAL USER PASS.
- Build68 = Home lead priority REAL USER PASS.
- Build69 = Phase 7-C Slice1 origin candidate.
- Build70 = pre-smoke corrective candidate.
- Build71 = current accepted runtime REAL USER PASS.
- Build72 = deployed Slice2 candidate / smoke pending.
- old Studio PR #84 / #87 are closed historical branches; do not revive them.

## Files to read before working

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE7-C-BUILD72.md`
- `changelogs/CHANGELOG-PHASE7-C-BUILD71.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Build71 is accepted. Build72 is deployed candidate and awaits real-user smoke. Phase 7-C Slice 3 must not start before Build72 acceptance.**
