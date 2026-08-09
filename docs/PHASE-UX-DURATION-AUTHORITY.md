# PHASE UX — Duration authority audit

Date: 2026-08-09
Scope: final integration parity correction; not Phase 7.

## Current sources and behavior

The current manifest field `duration` is the durable catalog value. Track Manager owns that manifest and already accepts duration in its normal protected editor/import flows. LaunchPAD and Studio read that same field; Studio has no second duration field.

The browser can also observe the duration of the current canonical audio object after `loadedmetadata`:

- Track Manager uses observed duration as quality evidence and prefers it over the manifest when checking timestamps;
- batch intake fills a missing duration from the selected audio before creation;
- LRC Maker knows `audioRef.duration` while synchronizing canonical audio;
- Studio browser DSP records `durationSeconds` and the Track Workspace audio player can observe the same value.

The C1 audit identified an inconsistency in the dedicated Lyrics Studio routes: `studioLyricsQuality()` compared the final timestamp only with `manifest.duration` and did not receive the duration already observed by LRC Maker. A stale manifest could therefore reject valid synchronized lyrics even though the canonical audio was longer.

## Authority decision

There remains one durable source: Track Manager's R2 manifest.

Observed browser duration is evidence about the current canonical audio object, not another persisted model. It may be used for display and validation only when it is finite, positive, associated with the current protected audio context and transmitted in the same guarded validation/save request.

For Lyrics validation the reliable reference order is:

1. valid observed duration from the currently loaded canonical audio;
2. manifest duration when no observation is available;
3. no end-of-audio assertion when neither value is available.

A disagreement must produce explicit evidence (`manifestDuration`, `observedAudioDuration`, tolerance and selected reference). It must never silently rewrite the manifest. The existing Track Manager metadata workflow remains the deliberate repair authority.

## Deployed C2 corrective contract

No new route or schema was added. The existing `lyrics/sync/validate` and `lyrics/sync/save` request bodies accept optional `observedAudioDuration`.

The Track Manager bridge now:

- reject non-finite, zero, negative or implausible values;
- use a small quality tolerance consistent with current Track Manager audio checks;
- validate timestamps against observed canonical-audio evidence when supplied;
- emit a warning when manifest and observation materially disagree;
- preserve manifest concurrency and lyrics ETag guards;
- never mutate duration as a side effect of a lyrics save.

LRC Maker `6.3.6` sends `audioRef.duration` only after the protected canonical audio has loaded. Standalone mode and manual/local audio did not gain a production write path.

Track Manager `v5.16` / Studio bridge `v1.8` was deployed admin-only from source `1bbe0293e4e17968bb7e191f58e7ae1cdd95dadf` by workflow `31324447727` (Worker Version ID `5a83c6dd-cfb4-4be6-ab8d-16b5c34bdc2b`). The public Worker was not deployed.

The C2 real-user smoke passed canonical playback, timestamp navigation, synchronized `lyrics.txt` save and canonical reread. The false end-of-audio rejection is resolved without a manifest-duration side effect.

## Studio C1 behavior

Studio `0.10.7` / Build `29` displays the duration observed by the Track Workspace canonical audio element. When that value disagrees with the manifest by more than one second, both values are shown. This is read-only and does not change R2.

## Safety boundary

- `trackId` remains the canonical R2 slug.
- Track Manager remains the only R2 write authority.
- No automatic duration repair is authorized.
- The completed C2 deployment targeted the private admin Worker only; the public Worker remains unchanged.
- No Phase 7 runtime is introduced.
