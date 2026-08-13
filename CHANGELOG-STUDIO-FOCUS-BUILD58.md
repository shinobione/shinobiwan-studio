# SHINOBIWAN Studio v0.18.1 · Build 58 — Studio Focus / Slice 3 Smoke Corrective

Date: 2026-08-13

Status: **CANDIDATE — CI + deployed real-user smoke required**

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

Dedicated Build 58 guard verifies:

- public fallback cannot fake private counts as zero;
- private drafts are described as hidden rather than deleted;
- Track Manager/retry recovery actions remain present;
- embedded Lyrics Studio/private-read gate remains intact;
- SonicTrace deep-link compatibility remains intact;
- canonical Canvas preview is 9:16 and non-cropping;
- no canonical write authority is added.

## Acceptance target

Deployed browser smoke must confirm:

1. public fallback clearly explains why private `To finish` tracks are absent;
2. `To finish` / `Ready` do not show misleading zero counts while private read is unavailable;
3. after Track Manager authentication + retry, the complete private library returns and the two unfinished tracks reappear if still canonical;
4. Visuals Canvas renders vertically in 9:16;
5. Lyrics public fallback clearly shows the engine is locked, not missing;
6. after PRIVATE READ returns, the embedded Lyrics Studio renders again;
7. public SonicTrace access no longer looks like a broken full-analysis promise;
8. no canonical mutation/regression occurs.

CI green alone does not grant REAL USER PASS.
