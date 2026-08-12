# Build 48 — Native Release Campaign

Date: 2026-08-12  
Target: `Studio v0.16.2 · Build 48`  
Codename: `phase7-native-release-campaign`

## Why this build exists

Real-user review of Track-To-Market V0.2 / Studio Build 47 confirmed that the standalone bridge is technically sound but the product boundary is wrong for daily use: too much of the workflow is prompt handoff + import + ZIP in a separate page.

The useful capability belongs in the Track Workspace itself.

Build 48 therefore absorbs the release-campaign workflow into Studio while keeping Track-To-Market standalone untouched as rollback/reference until the native path passes real-user smoke.

## Frozen visual decision — sequential anchored generation

The validated 16:9 artwork is the single visual MASTER.

```text
MASTER FINAL 16:9
    ├── provider generation: coherent 1:1 version, reference = MASTER 16:9
    └── provider generation: coherent 9:16 version, reference = MASTER 16:9
```

Both derivatives start from the same MASTER. The 9:16 output must never use the 1:1 output as its primary reference because that would create cumulative visual drift.

This restores the useful behavior from the original Flow prototype, where format-generation calls reused the selected base artwork media ID as the image reference for both 1:1 and 9:16.

## Build 48 scope

### Native in Studio

- canonical Track context already loaded by Track Workspace;
- editable premium MASTER prompt;
- optional SHINOBIWAN logo reference upload;
- logo-reference handoff instructions;
- premium MASTER 16:9 import with no automatic overlay;
- dimension/aspect verification;
- anchored 1:1 handoff generated from MASTER;
- anchored 9:16 handoff generated from MASTER;
- independent 1:1 and 9:16 import/replacement;
- three-format campaign review;
- deterministic SoundCloud/social/tag pack from canonical context;
- campaign provenance;
- campaign ZIP export;
- browser-local draft persistence only.

### Explicitly not in Build 48

- no automatic control of Flow/ChatGPT/Gemini subscriptions;
- no direct provider API key in GitHub Pages;
- no R2 write;
- no Track Manager mutation;
- no canonical cover replacement;
- no automatic publish;
- no Album mutation;
- no requirement for Local AI / Cloudflare generation.

## Provider handoffs

### MASTER 16:9

The provider handoff must explicitly state:

- exact track title;
- relevant canonical music context;
- intended 16:9 format;
- when a logo is loaded, attach that file as a reference image;
- logo lettering/silhouette/proportions are authoritative;
- no fake replacement logo;
- imported FINAL must already look finished and must not depend on a generic Studio text overlay.

### 1:1 anchored derivative

The prompt must explicitly require the user to attach the accepted 16:9 MASTER as reference and ask for a coherent square re-composition, not a crude crop.

Preserve:

- exact track title spelling;
- SHINOBIWAN logo identity and treatment;
- central subject / visual metaphor;
- palette;
- lighting;
- material language;
- typography style;
- overall campaign identity.

The model may reframe/extend/recompose to make the square composition intentional.

### 9:16 anchored derivative

Same rules, independently anchored to the 16:9 MASTER. The vertical composition may extend/reframe the scene but must clearly belong to the same campaign.

## Asset truthfulness

Studio distinguishes:

- `MASTER 16:9`;
- `SQUARE 1:1`;
- `VERTICAL 9:16`.

Each imported image is inspected in-browser for actual pixel dimensions. A tolerance is allowed for provider-specific output sizes, but obviously wrong aspect ratios must be shown as warnings rather than silently labeled correct.

## Draft persistence

Browser-local persistence may retain the working campaign between refreshes. It must be labeled local/non-canonical.

Canonical R2 assets remain untouched until a later explicit persistence design is authorized.

## Export pack

The exported campaign pack should contain, when available:

```text
visuals/master-16x9.<ext>
visuals/square-1x1.<ext>
visuals/vertical-9x16.<ext>
references/shinobiwan-logo.<ext>
prompts/master-16x9.txt
prompts/variant-1x1.txt
prompts/variant-9x16.txt
copy/soundcloud.txt
copy/social.txt
copy/tags.txt
release-campaign.json
```

## Motion follow-up

After Build 48 real-user validation, add an optional 8s motion handoff anchored to the MASTER. Requirements already frozen:

- same visual identity;
- exact title/logo remain stable unless deliberately animated;
- restrained cinematic motion;
- first and last frames visually compatible for looping;
- motion remains optional unless future release-readiness rules require it.

## Standalone Track-To-Market status

Do not delete it during Build 48.

It remains:

- rollback path;
- reference implementation for prompt/provenance/export behavior;
- source for anything missed during the native migration.

After native smoke passes, mark standalone TTM deprecated for normal Studio workflow rather than continuing feature development in two UIs.

## Safety / rollback

Rollback anchor:

`safety/pre-build48-native-release-campaign-20260812-1707`

No canonical write authority changes in this build.
