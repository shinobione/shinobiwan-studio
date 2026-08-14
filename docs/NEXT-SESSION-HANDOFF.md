# NEXT SESSION HANDOFF — Build81 semantic truth · deployed candidate

Updated: 2026-08-15 after Build81 exact-head CI + exact merge-SHA Pages deployment.

## Start here

Before modifying anything, verify real GitHub/deployment state again.

Current release truth:

```text
Studio accepted baseline   v0.19.3 · Build80 · REAL USER PASS
Studio current candidate   v0.19.3 · Build81 · DEPLOYED CANDIDATE
Build81 codename           studio-focus-slice4-phase8-semantic-truth-cleanup
Build81 tested head        bdc79b8dd3fffb41c8368990d50fd733afe87fe3
Build81 CI                 31850313391 · SUCCESS
Build81 runtime merge      20d587fe1b1d1a5405cd346571c8d5a0eb1d2fa4
Build81 Pages              31850382728 · SUCCESS · exact runtime merge SHA
Build81 safety pre         safety/pre-build81-semantic-truth-20260815-0113
Build81 safety post        safety/post-build81-deployed-candidate-20260815-0129
Build81 browser smoke      PENDING
Track Manager              v5.23 · DEPLOYED
Studio bridge              v1.13
TM Worker Version ID       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker              v2.7 · unchanged
LaunchPAD public           2026.08.12.102 · REAL USER PASS
SonicTrace                 V2-E Build08 · REAL USER PASS
Deep Audio                 2.0.3-alpha
LRC Maker                  6.3.8
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## Why Build81 exists

Fresh post-Build80 code audit proved two focused backlog items were still real:

### 1. Sonic wording drift

Track Workspace still called the SonicTrace/audio-intelligence production stage `Sound` and used `TRACK / SOUND` on the full analysis page.

Build81 changes those visible semantics to:

```text
Sonic
TRACK / SONIC
```

No readiness, routing or SonicTrace behavior changed.

### 2. Decorative Release Campaign provider selector

Release Campaign offered:

```text
Google Flow
Gemini
ChatGPT Images
Other premium provider
```

but the selected value was never passed to `buildFreshMasterPrompt`, `buildVariantPrompt` or `buildMotionPrompt`. It therefore did not materially change prompt semantics or output behavior.

Build81 removes the mutable selector and states the real contract instead:

```text
External image handoff
PROVIDER-AGNOSTIC
```

Google Flow remains a convenience shortcut only. MASTER/1:1/9:16/motion prompts remain provider-agnostic.

Old browser-local campaign drafts still restore their prompts, images and copy. Their old provider string is not interpreted as current prompt behavior. New local/export provenance uses `provider-agnostic external image handoff`.

## Release Campaign contract preserved

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

- 9:16 never derives from 1:1;
- New MASTER concept is non-destructive;
- drafts remain browser-local;
- ZIP remains review-only;
- `canonicalWrite: false` remains true;
- no Track Manager/R2 writer is introduced.

## Required Build81 browser smoke

Do not mark Build81 accepted until the user tests it.

Recommended smoke:

1. hard refresh Studio and verify `Build 81`;
2. open any Track → Track overview and confirm the production stage says `Sonic`, not `Sound`;
3. open full SonicTrace analysis and confirm the eyebrow says `TRACK / SONIC`;
4. open Track → Release and inspect Release Campaign;
5. confirm the `Premium provider` dropdown is gone;
6. confirm the read-only `PROVIDER-AGNOSTIC` explanation is visible;
7. confirm `Copy MASTER handoff` still works and `Open Google Flow ↗` remains available;
8. if an old local Release Campaign draft exists, confirm its images/prompts still restore;
9. confirm no campaign navigation/import/copy action writes canonical R2.

If clean, explicit acceptance can be recorded as:

```text
BUILD81 PASS
```

## Accepted lineage underneath Build81

```text
Phase 7-A   Build46   REAL USER PASS
Phase 7-B   Build51   REAL USER PASS
Phase 7-C   Build71   Slice1 REAL USER PASS
Phase 7-C   Build73   Slice2/program REAL USER PASS
Phase 8     Build74   Content Health Truth REAL USER PASS
Phase 8     Build75   Health Drill-down REAL USER PASS
Phase 8     Build80   cumulative Album Health/publication REAL USER PASS
```

Builds76–79 remain historical candidates/superseded corrective steps, not retroactive RUPs.

## Frozen architecture

- GitHub = application-code authority.
- Cloudflare R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private cockpit/orchestrator, never a generic R2 writer.
- LaunchPAD = public listener UX.
- SonicTrace = audio intelligence.
- LRC Maker = lyrics synchronization.
- canonical `trackId` = R2 slug everywhere.
- public fallback is read-only and never verifies canonical writes.

## Focused backlog after Build81

Still unresolved until separately reproduced/audited:

- asset-selection error previously observed on `Magnetic Midnight`;
- premium interaction feel backlog: tactile press/release, restrained glow/focus, coherent hover/active, smooth reduced-motion-safe transitions.

The `Sound → Sonic` and decorative provider-selector backlog items are implemented in Build81 but are not closed until Build81 REAL USER PASS.

## Later roadmap

**Phase 9 — Security / reliability / PWA**: Access/CORS hardening, retries/timeouts, anti-loss/ambiguous-write behavior, degraded/offline UX, PWA resilience.

**Phase 10 — Progressive extraction**: potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE8-BUILD81.md`
- `changelogs/CHANGELOG-PHASE8-BUILD80.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Build80 remains the accepted REAL USER PASS baseline. Build81 is merged/deployed candidate and must receive explicit browser PASS before further runtime work.**
