# SHINOBIWAN Studio v0.13.0 · Build 38

Codename: `phase-ux-c3-deep-audio-resilience`

Date: 2026-08-11

## C3-A — Deep Audio resilience and truthful status

- distinguishes `FULL`, `PARTIAL`, `UNAVAILABLE` and `OUTDATED` SonicTrace profile states;
- does not treat a non-null mastering object as ready when its measurements report `provenance: unavailable`;
- validates the persisted embedding as a real finite 512D vector before calling it ready;
- distinguishes coordinator transport/offline failures from coordinator processing failures;
- removes the misleading catch-all `Deep Audio is offline` wording;
- successful partial Deep Audio responses retain Neural / embedding / structure layers and surface warnings;
- Browser-DSP-only fallbacks are labeled `UNAVAILABLE` for Deep Audio rather than generic `PARTIAL`;
- missing mastering values render as `—`, never fabricated `0.0 LUFS` / `0.0 dBTP`;
- adds explicit unavailable badge styling;
- adds `check:c3` to the production build.

## Contracts unchanged

- SonicTrace schemaVersion remains `1`;
- Track Manager/R2 SonicTrace persistence is unchanged;
- no Worker change or deploy is required;
- no R2 write is performed by the release itself;
- source audio remains temporary-only;
- C2.5 Albums and canonical Lyrics contracts are untouched;
- Phase 7 remains locked.

## Real-user acceptance

Build 38 is not C3-complete until the local SonicTrace coordinator is updated/restarted and Studio completes a real canonical scan against the new SonicTrace Build 06 backend.
