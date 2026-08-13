# SHINOBIWAN Studio v0.18.1 · Build 58 — Studio Focus / Slice 3 Smoke Corrective

Date: 2026-08-13

Status: **COMPLETE — REAL USER PASS**

## Reason

Build 57 introduced the intended `Track · Visuals · Lyrics · Release` Track Workshop regrouping, but deployed browser smoke exposed three UX faults around public fallback truthfulness, Canvas presentation and specialist-access clarity.

Build 58 corrects those faults without changing the underlying canonical model.

## Correctives

### Tracks public fallback

When Studio cannot obtain Track Manager PRIVATE READ and falls back to LaunchPAD public catalog:

- do not present unavailable private `To finish` / `Ready` counts as truthful zero;
- display `—` for those private-only counts;
- automatically show the public `Released` projection instead of an empty default `To finish` view;
- state explicitly that draft/private tracks are hidden, not deleted;
- provide `Open Track Manager ↗` and `Retry private read` recovery actions;
- when PRIVATE READ returns, restore the `To finish` production filter.

No draft is reconstructed from stale/local data. Public fallback remains public-only.

### Track Workspace public fallback

- show a persistent `PUBLIC READ-ONLY FALLBACK` notice when `track.readSource !== 'private'`;
- explain that canonical editing, private drafts, Lyrics Studio synchronization and full SonicTrace analysis require Track Manager PRIVATE READ;
- provide the same Track Manager + retry actions;
- avoid presenting `View full SonicTrace analysis` as available while the private analysis layer is locked.

The historical `intelligence` deep link remains valid.

### Lyrics

- keep `EmbeddedLyricsStudio` unchanged as the primary engine when PRIVATE READ + canonical audio + `lyrics.txt` are available;
- keep Phase 7-B save receipt/private reread semantics unchanged;
- in public fallback, show `LYRICS STUDIO LOCKED` instead of silently making raw text look like the primary engine;
- retain optional public lyrics text only behind a preview disclosure;
- provide Track Manager + retry actions.

No LRC Maker code/version or canonical Lyrics authority changes.

### Canvas

- correct the Visuals canonical Canvas preview from **16:9** to **9:16**;
- match the LaunchPAD Canvas presentation contract;
- use `object-fit: contain` so the canonical video is not cropped;
- keep Release Campaign 16:9 / 1:1 / 9:16 visual-pack semantics unchanged — this corrective concerns the canonical Track Canvas preview only.

## Explicitly unchanged

- Track Manager remains protected canonical write authority;
- R2 remains canonical data/media authority;
- no Worker deployment;
- no new write endpoint;
- no public fallback authority expansion;
- no stale private catalog resurrection;
- canonical `trackId` unchanged;
- LRC Maker 6.3.8 engine unchanged;
- Phase 7-B private canonical rereads/receipts unchanged;
- SonicTrace persistence unchanged;
- Release Campaign remains browser-local/review-only with `canonicalWrite: false`;
- legacy Workspace deep links remain compatible;
- Phase 7-C remains closed.

## Safety

Build 57 deployed candidate merge:

`43c9dda178ce3e6d496d845c7e25e2422886ed7e`

Pre-corrective checkpoint:

`safety/pre-build58-slice3-smoke-corrective-20260813-0226`

PR:

`#77 — Studio v0.18.1 Build 58 — Slice 3 smoke corrective`

Accepted Build 58 merge:

`7d68e86413c5d5100eca6ad6d3414a9660aaaca9`

Dedicated Build 58 guard verifies:

- public fallback cannot fake private counts as zero;
- private drafts are described as hidden rather than deleted;
- Track Manager/retry recovery actions remain present;
- embedded Lyrics Studio/private-read gate remains intact;
- SonicTrace deep-link compatibility remains intact;
- canonical Canvas preview is 9:16 and non-cropping;
- no canonical write authority is added.

## Deployed real-user acceptance

Real-user browser review on 2026-08-13 observed the Build 58 corrective sequence end to end.

### Public fallback

Observed before authentication recovery:

- `PRIVATE TRACKS HIDDEN` displayed;
- `To finish` / `Ready` private-only counters displayed `—`, not false zero;
- `31 Released` remained visible as the truthful public projection;
- Track Workspace displayed `PUBLIC READ-ONLY FALLBACK`;
- Lyrics displayed `LYRICS STUDIO LOCKED` instead of masquerading raw text as the primary synchronizer;
- Visuals displayed the canonical Canvas vertically in 9:16.

### PRIVATE READ recovery

After Cloudflare Access authentication through Track Manager, direct `/api/studio/health` navigation returned authenticated Studio bridge JSON with bridge `1.11` and Track Manager `5.19`.

Returning to Studio restored private production state. Home displayed:

```text
To finish  27
Ready       6
Released   31
```

This proved Studio was no longer limited to the 31-track LaunchPAD public projection.

### Embedded Lyrics restoration

`Magnetic Midnight!` → Lyrics then rendered the embedded LRC engine again with audio loaded and canonical authority:

```text
tracks/magnetic-midnight/lyrics.txt
```

No production save was required merely to manufacture acceptance evidence.

A fresh SonicTrace analysis/write was not part of this smoke. Build 58 does not change SonicTrace persistence or canonical sidecar authority; that unchanged specialist path remains covered by its accepted baseline and CI guards.

Full acceptance record:

`docs/STUDIO-FOCUS-BUILD58-REAL-USER-PASS.md`

## Acceptance result

1. public fallback clearly explains why private tracks are absent — **PASS**;
2. private-only counts do not show misleading zero while private read is unavailable — **PASS**;
3. authenticated Track Manager PRIVATE READ returns the protected production state — **PASS**;
4. Visuals Canvas renders vertically in 9:16 — **PASS**;
5. Lyrics public fallback clearly shows the engine is locked, not missing — **PASS**;
6. after PRIVATE READ returns, the embedded Lyrics Studio renders again — **PASS**;
7. public/private authority remains truthful; no public fallback becomes a write owner — **PASS**;
8. no production media/Album/catalog mutation or Worker deployment was needed for acceptance — **PASS**.

**Studio Focus Slice 3 is COMPLETE — REAL USER PASS.**

CI green alone did not grant this status; the deployed real-user smoke did.
