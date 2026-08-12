# SHINOBIWAN Studio v0.16.3 · Build 49

Codename: `phase7-native-release-campaign-concept-reroll`

## Why

Build 48 real-user smoke validated the native Release Campaign review and anchored-format workflow, but exposed a missing creative-exploration action: the MASTER prompt was editable, yet there was no explicit way to abandon the current idea and request a genuinely different MASTER concept from scratch.

The original Flow tool had a first-class `Nouveau Prompt` / pack-regeneration action. Build 49 restores that useful behavior natively in Studio without reintroducing the standalone TTM bridge.

## Added

- `New MASTER concept` action beside the MASTER provider handoff.
- Eight deliberately distinct concept families to prevent cosmetic prompt rewording.
- Explicit `CREATIVE RESET` instruction: ignore the previous MASTER prompt, composition, scene, subject and visual metaphor.
- Current canonical track context and current SHINOBIWAN logo-reference state remain binding.
- Browser-local `masterConceptIndex` persistence across refreshes.
- Concept number shown in the editable MASTER handoff.
- Export provenance records the active MASTER concept index.

## Non-destructive behavior

A concept reroll changes **only the editable MASTER prompt**.

It does not clear or replace:

- the imported MASTER 16:9;
- the accepted 1:1 derivative;
- the accepted 9:16 derivative;
- canonical cover/media in R2;
- any Track Manager state.

The user may explore/copy multiple new ideas in Flow/Gemini/ChatGPT Images while the accepted campaign remains visible. Only an explicit new MASTER import replaces the local campaign source and clears derivative slots, preserving the Build 48 contract.

## Safety

- browser-local only;
- no new HTTP/fetch path;
- no R2 write;
- no Track Manager mutation;
- no standalone TTM bridge dependency;
- Build 48 MASTER → anchored 1:1 / anchored 9:16 contract preserved.

Rollback: `safety/pre-build49-master-concept-reroll-20260812`.

Real-user acceptance remains pending.
