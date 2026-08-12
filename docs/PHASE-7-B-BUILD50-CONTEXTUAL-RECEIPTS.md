# PHASE 7-B — Contextual Continuation Receipts (Build 50 → Build 51)

Initial implementation: **Studio v0.17.0 · Build 50**

Accepted corrective: **Studio v0.17.1 · Build 51**

Initial codename: `phase7-b-contextual-continuation-receipts`

Accepted corrective codename: `phase7-b-lyrics-receipt-window-listener-corrective`

State in this document: **PHASE 7-B COMPLETE — REAL USER PASS · 2026-08-12**.

## Goal

Phase 7-B connects specialist completion back to the canonical Track Workspace without making specialist/local success messages authoritative.

The invariant is:

```text
specialist completes an operation
        ↓
contextual receipt
        ↓
exact canonical trackId + allowlisted source/operation
        ↓
canonical write?
   ├── no  → review-only state
   └── yes → private Track Manager reread
                  ↓
             canonical evidence
                  ↓
               VERIFIED
```

A child tool cannot promote its own optimistic state into canonical Studio truth.

## Typed receipt allowlist

| Source | Operation | Effect | Verification |
|---|---|---|---|
| `lrc-maker` | `lyrics-saved` | `canonical-write` | private Track reread + canonical `lyrics.txt` evidence |
| `sonictrace` | `analysis-saved` | `canonical-write` | private Track reread + persisted Audio Intelligence evidence |
| `release-campaign` | `campaign-exported` | `review-only` | no canonical write expected |

Unsupported combinations are invalid.

## Exact Track isolation

Receipts are scoped to the Track Workspace currently open.

If:

`receipt.trackId !== currentWorkspace.trackId`

Studio ignores the receipt.

This prevents a completion from a previous/other Track context from updating the visible Workspace.

## Private canonical reread

Canonical-write receipts are not trusted directly.

Studio calls the existing `getCatalogTrack(trackId)` read layer and requires:

- returned Track ID equals the current canonical trackId;
- `readSource === 'private'`;
- operation-specific evidence exists.

A LaunchPAD/public fallback may keep Studio readable when private access is unavailable, but **it can never verify a canonical write**.

## Stale async protection

Each canonical verification increments a local verification epoch.

A slow reread is discarded when a newer receipt/Track context has superseded it. Therefore a stale async result cannot overwrite a more recent completion state.

## LRC Maker

### Embedded

The existing LRC Maker 6.3.8 engine keeps its guarded save authority/path. Its `lyrics-saved` completion is converted to the typed Phase 7-B receipt.

Build 51 captures the existing bubbling/composed `lyrics-saved` event at `window` scope rather than depending on a React ref attached to the upgraded custom-element host. Exact `detail.trackId` filtering remains mandatory.

### Standalone fallback

The existing `shinobiwan:lyrics-saved:v1` message remains supported, but the message is accepted only when its browser origin equals the configured LRC Maker origin. It is then converted to the same typed receipt and still requires private canonical reread.

### Canonical Lyrics authority remains frozen

```text
tracks/<slug>/lyrics.txt = UNIQUE source canonique
timestamps in lyrics.txt = synchronized lyrics
.lrc                      = export / compatibility only
```

Phase 7-B does not introduce any second Lyrics source.

## SonicTrace

A successful existing SonicTrace save emits `sonictrace / analysis-saved / canonical-write`.

Studio no longer treats the child panel callback itself as authoritative. The receipt triggers private reread and checks that canonical Audio Intelligence is exposed before `VERIFIED`.

The existing SonicTrace sidecar/history/freshness authority is unchanged.

## Native Release Campaign

Builds 50/51 preserve the current Build 48/49 native workflow:

```text
MASTER FINAL 16:9
  ├── anchored 1:1
  └── anchored 9:16
```

The Release Campaign draft and imported outputs remain browser-local/non-canonical.

Export emits only:

`release-campaign / campaign-exported / review-only`

The ZIP manifest continues to record `canonicalWrite: false`.

No visual FINAL is implicitly written to R2 or promoted to canonical cover/media.

## Receipt UI

Track Workspace displays a compact contextual banner with four truthful states:

- **Verifying canonical state…** — private reread in progress;
- **Canonical reread verified** — canonical write evidence reread successfully;
- **Review receipt received** — review-only result, no canonical write expected;
- **Receipt not canonically verified** — private reread/evidence failed.

The banner is dismissible and respects `prefers-reduced-motion`.

## Preserved authorities

- GitHub = code authority.
- R2 = canonical data/media authority.
- Track Manager = protected canonical write authority.
- Studio = orchestrator.
- LaunchPAD = public experience/read fallback.
- SonicTrace = Audio Intelligence engine.
- LRC Maker = Lyrics engine.

Phase 7-B adds orchestration signals only. It does not centralize writes.

## Safety / rollback

Initial Build 50 implementation base:

`ef9eaa3e73fa704e8777a904d923e78648bb3001`

Build 50 pre-change checkpoint:

`safety/pre-phase7-b-build50-20260812-1826`

Build 51 pre-corrective checkpoint:

`safety/pre-build51-lyrics-receipt-corrective-20260812-2102`

Build 51 candidate checkpoint:

`safety/phase7-b-build51-candidate-20260812-2112`

Final Phase 7-B REAL USER PASS checkpoint:

`safety/post-phase7-b-build51-real-user-pass-20260812-2120`

Old receipt PRs #60 and #62 remain closed/superseded and were not merged/cherry-picked in bulk.

No Cloudflare Worker deployment, public Worker modification, production R2 mutation, schema migration or Phase 7-C work is part of Builds 50/51.

## CI policy

Build 50 added `scripts/test-phase7-b-contextual-receipts-build50.mjs`. Build 51 added `scripts/test-phase7-b-lyrics-receipt-build51.mjs` and keeps the inherited regression chain:

- private-read contract;
- Phase 5 algorithms;
- Phase 6 Lyrics;
- C3 / Catalog Intelligence / premium feel;
- historical PHASE UX and C2.5 guards;
- Phase 7-A Workflow;
- Build 47 staged-review no-write history;
- Build 48 native Release Campaign;
- Build 49 concept-reroll/Flow handoff;
- Build 50 receipt contract;
- Build 51 Lyrics receipt capture corrective;
- TypeScript;
- Vite production build.

Historical tests were changed only where their phase/version STOP assumptions had become obsolete. Their functional safety assertions remain.

## Build 50 real-user smoke result — 2026-08-12

Observed on deployed Studio v0.17.0 · Build 50:

- Release Campaign `campaign-exported / review-only`: **PASS** — browser showed `Review receipt received` and explicitly stated that no canonical write is expected or authorized;
- native Release Campaign three-format campaign/export surface: **PASS**;
- Workflow 7-A read-only regression check: **PASS**;
- embedded LRC Maker protected save + its own canonical reread: **PASS** — browser showed `lyrics.txt synchronisé et relu.`;
- parent Phase 7-B Lyrics continuation banner: **FAIL** — the Workspace did not show `Verifying canonical state…` or `Canonical reread verified` after that successful embedded save.

Therefore Build 50 remains historical partial-smoke evidence and is **not** the accepted Phase 7-B release.

## Build 51 corrective

Studio v0.17.1 · Build 51 is the bounded corrective for that single failed browser seam.

LRC Maker 6.3.8 already dispatches a composed, bubbling `lyrics-saved` CustomEvent from the `<shinobiwan-lyrics-studio>` Web Component after its guarded save and canonical reread.

Build 50 captured that event through a React ref attached to the custom-element host. The real browser smoke showed that this receipt-delivery path was not reliable enough.

Build 51 changes only the capture point:

- remove dependency on the React custom-element ref;
- listen at `window` scope for the existing bubbling/composed `lyrics-saved` event;
- keep exact `detail.trackId` filtering;
- keep the same typed `lrc-maker / lyrics-saved / canonical-write` receipt;
- keep the same private canonical Track reread and Lyrics evidence gate;
- keep stale/mismatched receipt protection;
- add a dedicated guard that prevents regression back to ref-bound receipt capture.

No LRC Maker deployment/version change, Worker deploy, R2 mutation, Track Manager endpoint change, generic write authority or Phase 7-C work is part of Build 51.

Build 51 corrective PR: **#68**.

Exact CI-green head:

`1188cea8532e95a88676a8fc94a47b71fde69dd0`

Merged Build 51 main:

`f00ac7043e0b0d451d5df220032e4da21ab69323`

GitHub Pages build + deploy completed successfully before the final user smoke.

## Build 51 real-user acceptance — PASS

Observed on deployed Studio v0.17.1 · Build 51 on 2026-08-12:

- Track Workspace identifies the current track correctly;
- embedded LRC Maker reports `Aucun changement — lyrics.txt est déjà à jour.` on the no-op save path;
- parent receipt banner appears as `LRC MAKER / LYRICS SAVED`;
- final banner state is **`Canonical reread verified`**;
- banner detail states: `Lyrics save completed. Track Manager private reread succeeded. Studio is displaying canonical state, not optimistic child state.`;
- canonical Lyrics status remains synchronized.

The transient `Verifying canonical state…` state may complete too quickly for a screenshot, but the final verified state is only set after the same guarded private reread and canonical evidence checks.

Together with the Build 50 Release Campaign and Workflow proofs, this closes the complete Phase 7-B acceptance matrix.

## Phase 7-B closeout

**PHASE 7-B = COMPLETE — REAL USER PASS.**

Build 51 is the accepted Phase 7-B release. Full closeout: `docs/PHASE-7-B-BUILD51-REAL-USER-PASS.md`.

## Phase 7-C

**PLANNED / NOT STARTED / EXPLICITLY CLOSED.**

Phase 7-C remains behind a fresh explicit post-7-B authorization. This closeout does not start it and does not grant any new write authority.
