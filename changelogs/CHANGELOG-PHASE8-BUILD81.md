# SHINOBIWAN Studio v0.19.3 · Build 81

Codename: `studio-focus-slice4-phase8-semantic-truth-cleanup`  
Date: 2026-08-15  
Status: **CANDIDATE — CI + DEPLOY + BROWSER SMOKE REQUIRED**

## Why Build81 exists

A fresh post-Build80 Phase8 audit found two surviving UI controls/labels that did not match the real product semantics:

1. Track Workspace still labelled the SonicTrace / audio-intelligence production stage as `Sound`, even though the product and destination are SonicTrace.
2. Release Campaign exposed a `Premium provider` selector (`Google Flow`, `Gemini`, `ChatGPT Images`, `Other premium provider`) even though provider selection never changed the MASTER, 1:1, 9:16 or motion prompt builders. It only changed UI/provenance labels while the UI always exposed the Google Flow shortcut.

Both were false semantic signals rather than missing capabilities.

## Build81 corrective

### Sonic wording truth

- Track production stage `Sound` → `Sonic`.
- Full intelligence subpage eyebrow `TRACK / SOUND` → `TRACK / SONIC`.
- SonicTrace behavior, readiness and routing remain unchanged.

### Release Campaign provider truth

- removes the decorative mutable provider selector;
- replaces it with visible `PROVIDER-AGNOSTIC` truth;
- MASTER copy action is now provider-neutral (`Copy MASTER handoff`);
- Google Flow remains available as an explicit convenience shortcut only;
- prompt builders are unchanged and remain provider-agnostic;
- old browser-local drafts still restore their prompts/assets/copy, but old provider provenance is not interpreted as current prompt behavior;
- browser-local draft/export provenance is normalized to `provider-agnostic external image handoff`;
- Release Campaign remains browser-local/review-only with `canonicalWrite: false`.

## Preserved Release Campaign contract

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

- 9:16 is never derived from 1:1;
- `New MASTER concept` remains non-destructive;
- Google Flow opens in a separate safe tab;
- no provider-specific prompt behavior is invented;
- no canonical Track/Album/R2 write is introduced.

## Safety

```text
Accepted baseline        Build80 REAL USER PASS
Safety pre               safety/pre-build81-semantic-truth-20260815-0113
Track Manager            v5.23
Studio bridge            v1.13
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 unchanged
Worker deploy            NONE
R2 migration/write       NONE
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.
