# PHASE 7-B — REAL USER SMOKE CHECKLIST

Candidate: Studio `v0.17.0 · Build 48`

Build 48 inherits the deployed Build 47 Track-To-Market V3 corrective, so the final smoke covers both the staged FINAL preview and the new continuation receipt semantics.

## 1 — LRC Maker receipt

1. Open a canonical Track with audio + `lyrics.txt`.
2. Open **Lyrics**.
3. Make/save a legitimate synchronization change through the embedded LRC Maker.
4. Expected receipt:
   - `Verifying canonical state…`
   - then `Canonical reread verified`.
5. The same canonical `trackId` remains active and the Track state reflects the reread.

## 2 — SonicTrace receipt

1. Open **SonicTrace** on a Track with canonical audio.
2. Run/review and save through the existing guarded flow.
3. Expected receipt:
   - `Verifying canonical state…`
   - then `Canonical reread verified`.
4. Analysis remains sourced from canonical SonicTrace/Track state.

## 3 — Track-To-Market V3 + receipt

1. Open **Release Pack**.
2. Open Track-To-Market V0.2 and return a matching FINAL.
3. Studio should preserve/display the Build 47 staged FINAL preview and provenance.
4. Expected continuation receipt: `Review receipt received`.
5. Receipt must say no canonical write is expected/authorized.
6. No canonical cover/R2/Track Manager mutation occurs.

## Guard expectations

Normal use should not expose these, but the automated guard verifies them:

- mismatched `trackId` receipt ignored;
- non-FINAL TTM return rejected;
- stale verification cannot overwrite a newer receipt;
- public fallback reread cannot manufacture a green canonical-write verification;
- TTM preview remains validated/capped/transient.

## PASS condition

Phase 7-B may be marked REAL USER PASS only after the user confirms the receipt behavior and inherited TTM V3 staged review are coherent.

CI/deployment alone is not acceptance.
