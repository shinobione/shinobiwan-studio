# Studio v0.19.3 · Build 67 — Lyrics source anchor

Status: **COMPLETE · REAL USER PASS**  
Date: 2026-08-13

## Trigger

Build 66 fixed asset identity and kept the Lyrics TXT control logically available, but real-user review showed one remaining UX problem: the canonical Lyrics upload/replacement field still lived inside the secondary `Open plain-text lyrics editor` disclosure. That made the primary source control feel hidden at the bottom of the page.

## Corrective

Build 67 moves the canonical Lyrics TXT asset control into the top-level Lyrics flow, immediately after the Lyrics status card and before synchronization.

- `LYRICS TXT` is now always visible in the same top-level position whether `lyrics.txt` is missing or present.
- Missing source: the field offers the guarded canonical TXT upload.
- Present source: the same field exposes replacement/removal without changing position.
- `Master audio required for synchronization` remains a visible top-level prerequisite when TXT exists but audio is missing.
- The `Open plain-text lyrics editor` disclosure now represents only the secondary text editor.
- The embedded LRC engine remains below the canonical source block.

## Safety / authority

No Track Manager API, Worker, R2 path, catalog authority, stale guard, confirmation, rollback or canonical reread behavior changed. Track Manager v5.21 / bridge v1.11 remains the write authority. Public fallback remains read-only.

## Acceptance evidence

```text
PR #94 tested head  6c1d801b14ae8daedfb246da539a42125f7c80d9
Validation run      31738652169 · SUCCESS
Studio main         5f061a460f17e27b9c2f06fdcbdda2f34e07e240
Pages run           31738982707 · SUCCESS
```

Build 67 is the accepted Studio runtime after the final real-user browser pass. Full closeout: [`../docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md`](../docs/STUDIO-FOUNDATION-REGRESSION-REPAIR-CLOSEOUT-REAL-USER-PASS.md).
