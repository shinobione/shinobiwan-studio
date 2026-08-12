# SHINOBIWAN Studio v0.17.1 · Build 51

Codename: `phase7-b-lyrics-receipt-window-listener-corrective`

Status: **PHASE 7-B REAL-USER SMOKE CORRECTIVE CANDIDATE**. This build does not claim REAL USER PASS until the corrected Lyrics receipt is observed in the browser.

## Why

The first real-user smoke of Studio v0.17.0 · Build 50 produced a useful split result:

- Release Campaign export receipt: **PASS** — `Review receipt received`, explicitly review-only, no canonical write expected or authorized;
- native Release Campaign visuals/export surface: **PASS**;
- Workflow 7-A regression check: **PASS** — read-only queue remained operational;
- embedded LRC Maker protected save + its own canonical reread: **PASS** — the engine displayed `lyrics.txt synchronisé et relu.`;
- Phase 7-B parent continuation banner after that Lyrics save: **FAIL** — no `Verifying canonical state…` / `Canonical reread verified` banner appeared in the Track Workspace.

The failure is therefore limited to receipt delivery from the embedded Web Component into Studio, not to the protected Lyrics write itself.

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

## Acceptance

CI/Pages are necessary but not sufficient.

The Build 50 screenshots already provide real-user proof for the review-only Release Campaign receipt and Workflow regression check. Build 51 must now prove the missing canonical-write leg:

1. open an existing Track → Lyrics;
2. save via embedded LRC Maker;
3. LRC Maker may display `lyrics.txt synchronisé et relu.` or the no-change equivalent;
4. Studio must display `Verifying canonical state…`;
5. after the private reread, Studio must display `Canonical reread verified`;
6. the banner must identify `LRC Maker / lyrics saved` and remain scoped to the current canonical trackId.

Only then may Phase 7-B be closed as REAL USER PASS.
