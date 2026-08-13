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

**PASS — 2026-08-11.**

The Build 38 C3-A semantics, carried forward into Studio `v0.13.3 · Build 41`, were validated against the updated/restarted SonicTrace `V2-E · BUILD 06` local coordinator on the canonical audio for **Stick to You**.

The unsaved review returned a truthful **FULL** profile with DSP, mastering, Neural, finite 512D embedding, structure and semantic summary all ready. Observed mastering values were `-13.7 LUFS` and `-0.8 dBTP`; Browser RMS was `-15.8 dBFS`; structure reported 9 sections. The new draft was deliberately not persisted during the smoke.

The exact historical audio that originally emitted `FFmpeg loudnorm did not return a measurement block` could not be reliably reidentified. The degraded failure branch is therefore closed by the dedicated parser/fallback and Studio-envelope regression tests in SonicTrace Build 06 together with this real-user full-stack integration smoke, rather than by fabricating a production failure.

Post-pass checkpoint: `safety/c3-a-real-user-pass-20260811-1900`.
