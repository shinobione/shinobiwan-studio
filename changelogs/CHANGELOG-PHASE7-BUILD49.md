# SHINOBIWAN Studio v0.16.3 · Build 49

Codename: `phase7-native-release-campaign-concept-reroll`

## Why

Build 48 real-user smoke validated the native Release Campaign review and anchored-format workflow, but exposed a missing creative-exploration action: the MASTER prompt was editable, yet there was no explicit way to abandon the current idea and request a genuinely different MASTER concept from scratch.

The original Flow tool had a first-class `Nouveau Prompt` / pack-regeneration action. Build 49 restores that useful behavior natively in Studio without reintroducing the standalone TTM bridge.

The same smoke also exposed a small but pointless workflow friction: Studio prepares a premium Google Flow handoff, but the user still had to leave Studio and open Flow manually. Build 49 therefore adds a direct safe new-tab shortcut to the Google Flow workspace.

## Added

- `New MASTER concept` action beside the MASTER provider handoff.
- Eight deliberately distinct concept families to prevent cosmetic prompt rewording.
- Explicit `CREATIVE RESET` instruction: ignore the previous MASTER prompt, composition, scene, subject and visual metaphor.
- Current canonical track context and current SHINOBIWAN logo-reference state remain binding.
- Browser-local `masterConceptIndex` persistence across refreshes.
- Concept number shown in the editable MASTER handoff.
- Export provenance records the active MASTER concept index.
- `Open Google Flow ↗` direct shortcut to `https://labs.google/fx/fr/tools/flow/` from the MASTER action row.
- Flow opens in a separate tab with `noopener noreferrer`, preserving the active Studio draft and imported campaign state.

## Non-destructive behavior

A concept reroll changes **only the editable MASTER prompt**.

It does not clear or replace:

- the imported MASTER 16:9;
- the accepted 1:1 derivative;
- the accepted 9:16 derivative;
- canonical cover/media in R2;
- any Track Manager state.

The user may explore/copy multiple new ideas in Flow/Gemini/ChatGPT Images while the accepted campaign remains visible. Only an explicit new MASTER import replaces the local campaign source and clears derivative slots, preserving the Build 48 contract.

Opening Google Flow is also state-neutral: it does not change provider selection, prompts, imported visuals or canonical data.

## Safety

- browser-local only;
- no new API/fetch path;
- external Flow navigation is a plain safe hyperlink, not an integration token/API;
- no R2 write;
- no Track Manager mutation;
- no standalone TTM bridge dependency;
- Build 48 MASTER → anchored 1:1 / anchored 9:16 contract preserved.

Rollback: `safety/pre-build49-master-concept-reroll-20260812`.

Real-user acceptance remains pending.
