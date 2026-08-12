# Studio v0.15.1 · Build 45 — Track-To-Market Bridge V2

Status: **IMPLEMENTED CANDIDATE — REAL USER SMOKE PENDING**

This is a bounded integration slice outside Phase 7. Phase 7 remains locked.

## Goal

Expose Track-To-Market from the canonical Track Workspace without adding another write authority.

## User flow

1. Open a canonical track in Studio.
2. Open the new `Release Pack` workspace section.
3. Click `Open Track-To-Market`.
4. Studio opens the standalone GitHub Pages app with short bootstrap metadata (`trackId`, title, genres).
5. Track-To-Market v0.1.5 sends its ready handshake through Bridge V2.
6. Studio replies with full context through `postMessage`, including canonical lyrics.
7. The user explores DRAFT or imports a premium FINAL cover in Track-To-Market.
8. Only a FINAL Track-To-Market export returns a pack message to Studio.
9. Build 45 displays that FINAL pack in transient review state only.

## FINAL gate

Studio accepts the return only when:

- origin is `https://shinobione.github.io`;
- the message type is `shinobiwan:track-to-market:pack`;
- returned `trackId` equals the currently open canonical track;
- `releaseStatus === 'final'`.

A non-FINAL return is rejected and produces no canonical action.

## No-write boundary

`TrackToMarketPanel.tsx` intentionally imports no mutation service.

Build 45 does **not**:

- upload a cover;
- write release metadata;
- write R2;
- call Track Manager mutation APIs;
- change Album membership/order;
- alter LaunchPAD;
- alter SonicTrace persistence;
- alter lyrics.

Returned FINAL data lives only in React component state until a later guarded persistence contract is explicitly designed and accepted.

## Data sent

Short URL bootstrap:

- source=studio
- trackId
- title
- genres

Bridge V2 message payload:

- canonical `trackId`
- title
- genres
- BPM/key/energy/mood summary as audio-style hint
- mood/themes/era/palette summary as visual-direction hint
- canonical `lyricsRaw`

Long lyrics are never inserted into the URL.

## Safety checkpoint

` safety/pre-track-to-market-build45-20260812 `

## Regression guard

`scripts/test-track-to-market-build45.mjs` checks:

- route and tab wiring;
- explicit GitHub Pages origin;
- Bridge V2 message names;
- matching trackId requirement;
- FINAL-only return requirement;
- lyrics-over-postMessage;
- absence of known write APIs / fetch usage in the panel.

## Real-user smoke

Build 45 is accepted only after a real browser smoke verifies:

1. `Release Pack` opens from a canonical track;
2. TTME opens with the correct title/genres/trackId;
3. full lyrics arrive after the handshake;
4. FINAL export returns to the original Studio tab;
5. Studio shows the received FINAL provider/source details;
6. no canonical track data changes during the test.
