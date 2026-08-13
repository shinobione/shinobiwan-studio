# Studio v0.19.3 · Build 65 — Lyrics crash corrective

Status: **CANDIDATE · REAL USER PASS PENDING**  
Date: 2026-08-13

Build 64 deployed successfully but failed real-user smoke on Tracks without `lyrics.txt`.

Observed:
- a missing-lyrics Track could remain on `Loading Track Workspace…` when opened directly on the Lyrics route;
- navigating to Lyrics on another Track without `lyrics.txt` could freeze the page;
- Pulse Dominion private Album artwork and the guarded Album membership repair were observed working during the same smoke.

Root cause: the Build 64 presentation `MutationObserver` unconditionally rewrote the Lyrics `<summary>` text. Replacing `textContent` emitted another child-list mutation, recursively re-entering the observer.

Build 65 keeps the guarded TXT upload path but makes the presentation mutation idempotent:
- open the missing-lyrics `<details>` only when closed;
- rewrite the summary text only when it differs;
- subsequent observer callbacks make no DOM mutation.

No Track Manager, Worker, R2, Album authority or Phase 7-C runtime change is included. Track Manager remains v5.21 / bridge v1.11; public Worker v2.7 remains unchanged.

Acceptance requires exact-head CI, exact Pages deployment and a new browser smoke on Tracks with and without lyrics. Build 64 remains a failed deployed candidate and is not REAL USER PASS.
