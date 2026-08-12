# PHASE 7-B — REAL USER SMOKE CHECKLIST

Candidate: Studio `v0.17.0 · Build 47`

## Required checks

### 1 — Embedded Lyrics save

1. Open a canonical Track with audio + `lyrics.txt`.
2. Open **Lyrics**.
3. Make/save a legitimate synchronization change through the embedded LRC Maker.
4. Expected receipt sequence:
   - `Verifying canonical state…`
   - then `Canonical reread verified`.
5. The Track remains the same canonical `trackId` and reread state reflects the save.

### 2 — SonicTrace save

1. Open **SonicTrace** on a Track with canonical audio.
2. Run/review a scan and save it using the existing confirmation.
3. Expected receipt sequence:
   - `Verifying canonical state…`
   - then `Canonical reread verified`.
4. Analysis state remains sourced from canonical Track/SonicTrace sidecars.

### 3 — Track-To-Market FINAL

1. Open **Release Pack**.
2. Open Track-To-Market and create/return a matching FINAL pack.
3. Expected receipt:
   - `Review receipt received`.
4. It must explicitly say that no canonical write is expected/authorized.
5. The returned FINAL remains visible only as transient review state.

## Guards that should remain invisible in normal use

- wrong `trackId` receipt is ignored;
- non-FINAL Track-To-Market result is rejected;
- stale receipt verification cannot overwrite a newer one;
- a public fallback reread cannot produce a false `verified` canonical-write receipt.

## PASS condition

Phase 7-B may be marked REAL USER PASS only when the user confirms the receipt behavior is coherent and no specialist workflow regressed.

CI/deployment success alone is not acceptance.
