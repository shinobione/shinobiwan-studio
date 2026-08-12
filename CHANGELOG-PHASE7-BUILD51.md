# SHINOBIWAN Studio v0.17.1 · Build 51

Codename: `phase7-b-lyrics-receipt-window-listener-corrective`

Status: **PHASE 7-B COMPLETE — REAL USER PASS · 2026-08-12**.

## Why

The first real-user smoke of Studio v0.17.0 · Build 50 produced a useful split result:

- Release Campaign export receipt: **PASS** — `Review receipt received`, explicitly review-only, no canonical write expected or authorized;
- native Release Campaign visuals/export surface: **PASS**;
- Workflow 7-A regression check: **PASS** — read-only queue remained operational;
- embedded LRC Maker protected save + its own canonical reread: **PASS** — the engine displayed `lyrics.txt synchronisé et relu.`;
- Phase 7-B parent continuation banner after that Lyrics save: **FAIL** — no `Verifying canonical state…` / `Canonical reread verified` banner appeared in the Track Workspace.

The failure was limited to receipt delivery from the embedded Web Component into Studio, not to the protected Lyrics write itself.

## Root cause boundary

LRC Maker 6.3.8 already dispatches a composed, bubbling `lyrics-saved` CustomEvent from the `<shinobiwan-lyrics-studio>` Web Component after its guarded save and canonical reread.

Build 50 listened for that event through a React `ref` attached to the upgraded custom-element host. The real browser smoke showed that this delivery path was not reliable enough: the embedded engine completed the save, but Studio did not receive/display the continuation receipt.

## Corrective

Build 51 removes the receipt listener's dependency on a React custom-element ref.

`EmbeddedLyricsStudio` now listens at `window` scope for the bubbling/composed `lyrics-saved` event and still requires:

- exact `detail.trackId === current trackId`;
- the existing typed `lrc-maker / lyrics-saved / canonical-write` receipt;
- the existing Phase 7-B private canonical Track reread;
- operation-specific canonical Lyrics evidence before `VERIFIED`;
- stale/mismatched receipt protection inherited from Build 50.

The embedded Web Component itself is unchanged. LRC Maker remains 6.3.8.

## Safety

- based on merged Build 50 main `8fd96f3e0f551f1ee286bbe72abcf1f453ecc176`;
- rollback checkpoint: `safety/pre-build51-lyrics-receipt-corrective-20260812-2102`;
- no Worker deployment;
- no R2 mutation;
- no Track Manager endpoint change;
- no new write authority;
- no LRC Maker deployment/version change;
- Release Campaign remains review-only;
- Phase 7-C remains NOT STARTED.

## CI / deployment

- Build 51 corrective PR: **#68**;
- exact CI-green head: `1188cea8532e95a88676a8fc94a47b71fde69dd0`;
- merged main commit: `f00ac7043e0b0d451d5df220032e4da21ab69323`;
- GitHub Pages Build 51 build + deploy: **SUCCESS** before the final browser smoke.

## Real-user acceptance

The Build 50 screenshots already provided real-user proof for the review-only Release Campaign receipt, native campaign surface/export and Workflow regression check.

The deployed Build 51 browser retest then proved the missing canonical-write leg on `Tachy Psychia`:

```text
LRC MAKER / LYRICS SAVED
Canonical reread verified
Lyrics save completed. Track Manager private reread succeeded.
Studio is displaying canonical state, not optimistic child state.
```

The embedded LRC engine simultaneously reported the canonical no-change result (`Aucun changement — lyrics.txt est déjà à jour.`), confirming that a no-op save still produces a truthful continuation receipt without inventing a write result.

The final verified state is only reachable after the Phase 7-B verifier completes the private canonical Track reread and Lyrics evidence gate.

## Acceptance checkpoints

Candidate checkpoint:

`safety/phase7-b-build51-candidate-20260812-2112`

Final REAL USER PASS checkpoint:

`safety/post-phase7-b-build51-real-user-pass-20260812-2120`

## Closeout

**PHASE 7-B — COMPLETE · REAL USER PASS.**

Build 51 is the accepted Phase 7-B release. Build 50 remains historical partial-smoke evidence.

Phase 7-C remains **PLANNED / NOT STARTED / EXPLICITLY CLOSED** pending a fresh explicit authorization.
