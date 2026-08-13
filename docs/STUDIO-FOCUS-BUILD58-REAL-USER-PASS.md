# SHINOBIWAN Studio v0.18.1 · Build 58 — Studio Focus Slice 3 REAL USER PASS

Date: 2026-08-13

Status: **COMPLETE — REAL USER PASS**

Accepted release:

```text
Studio v0.18.1 · Build 58
codename: studio-focus-slice3-smoke-corrective
merge: 7d68e86413c5d5100eca6ad6d3414a9660aaaca9
PR: #77
```

## Why Build 58 existed

Build 57 introduced the artist-facing Track Workshop regrouping:

```text
Track · Visuals · Lyrics · Release
```

Its first deployed smoke was not accepted because Studio happened to be in LaunchPAD public-read fallback and the UI made that degraded state look like data loss, the canonical Canvas preview was framed as 16:9 instead of 9:16, and Lyrics fallback made the embedded synchronization engine look absent.

Build 58 corrected those presentation/recovery faults without changing canonical ownership.

## Real-user evidence

The deployed Build 58 browser smoke on 2026-08-13 observed the following sequence.

### 1. Public fallback is truthful

Before Cloudflare Access was restored, Tracks showed the LaunchPAD public catalog only.

Observed:

- `PRIVATE TRACKS HIDDEN` notice visible;
- Draft / To finish / Ready described as hidden rather than deleted;
- private-only `To finish` and `Ready` counters rendered as `—`, not misleading zero;
- `31 Released` remained visible as the public projection;
- `Open Track Manager ↗` and `Retry private read` recovery actions were visible.

This proves the degraded public state no longer masquerades as the complete production library.

### 2. Lyrics fallback is explicit

On `Magnetic Midnight!` while private read was unavailable, the Lyrics workspace showed:

```text
LYRICS STUDIO LOCKED
Restore private read to open the synchronization engine.
```

The public text preview remained secondary. Studio did not expose a canonical save/sync surface from public fallback.

### 3. Canonical Canvas preview is 9:16

The Visuals workspace rendered the canonical Canvas vertically in the intended 9:16 presentation with the full video contained rather than cropped.

The native Release Campaign 16:9 / 1:1 / 9:16 campaign-pack contract was not changed by this corrective.

### 4. Cloudflare Access / private bridge recovery is real

After authenticating through Track Manager, direct navigation to:

```text
https://launchpad-r2-api.jerryquinet.workers.dev/api/studio/health
```

returned the authenticated Studio bridge JSON with:

- `ok: true`;
- service `launchpad-r2-track-manager-studio-bridge`;
- Studio bridge `1.11`;
- Track Manager `5.19`;
- an authenticated user identity present;
- expected read/validate/write/manage capability groups.

No Worker deployment or configuration change was needed to restore the session.

### 5. Studio private production state returns

After the Access session was restored and Studio was revisited, Home returned to private production state.

Observed production counters:

```text
To finish  27
Ready       6
Released   31
```

This is direct evidence that Studio was no longer limited to the 31-track public catalog projection and was again reading the protected production library.

No private tracks were reconstructed from local/public data.

### 6. Embedded Lyrics Studio returns

Returning to `Magnetic Midnight!` → Lyrics after private read restoration showed the embedded LRC Maker engine again.

Observed:

- `LYRICS STUDIO / EMBEDDED LRC ENGINE`;
- `Synchronize inside Studio`;
- audio loaded;
- contextual track `Magnetic Midnight!`;
- canonical authority displayed as `tracks/magnetic-midnight/lyrics.txt`;
- `Sauvegarder lyrics.txt` available through the existing protected Lyrics route.

No save was required merely to manufacture acceptance evidence.

## What this pass does and does not claim

This acceptance is for the **deployed Build 58 Slice 3 corrective behavior actually exercised by the real user**:

- truthful public fallback;
- hidden-private-track explanation;
- non-fake private counters;
- explicit Lyrics lock state;
- 9:16 canonical Canvas presentation;
- Cloudflare Access/private-read recovery;
- restoration of the protected production library;
- restoration of the embedded Lyrics Studio.

A fresh SonicTrace analysis/write was **not** performed as part of this smoke. Build 58 did not change SonicTrace persistence or canonical sidecar authority; its SonicTrace change was limited to avoiding an optimistic full-analysis promise while public private-analysis access is unavailable. Existing CI/guard coverage and the previously accepted SonicTrace baseline remain the authority for that unchanged specialist path.

No production media mutation, Album mutation, catalog rebuild or Worker deployment was performed for this acceptance.

## Architecture still frozen

- GitHub remains application-code authority;
- R2 remains canonical catalog/media/data authority;
- Track Manager remains protected canonical write authority;
- Studio remains cockpit/orchestrator;
- LaunchPAD remains public listener experience;
- SonicTrace remains audio-intelligence engine;
- LRC Maker remains lyrics synchronization engine;
- canonical `trackId` remains identical across the toolchain;
- `tracks/<slug>/lyrics.txt` remains the unique canonical lyrics source;
- Phase 7-B private canonical reread/receipt rules remain unchanged;
- native Release Campaign remains review-only with `canonicalWrite: false`;
- Phase 7-C remains CLOSED / NOT STARTED.

## Safety ancestry

```text
Build 57 candidate merge:
43c9dda178ce3e6d496d845c7e25e2422886ed7e

Pre-Build58 checkpoint:
safety/pre-build58-slice3-smoke-corrective-20260813-0226

Accepted Build 58 merge:
7d68e86413c5d5100eca6ad6d3414a9660aaaca9
```

A post-acceptance checkpoint is created only from the final documented/accepted `main` after this closeout PR is merged.

## Outcome

**Studio Focus Slice 3 is closed as REAL USER PASS.**

Build 57 remains historical deployed smoke evidence and never receives retroactive acceptance.

Slice 4 may now be considered the next Studio Focus roadmap item, but it remains **NOT STARTED** until separately authorized. Phase 7-C remains explicitly closed.
