# SHINOBIWAN Studio v0.19.3 · Build 81

Codename: `studio-focus-slice4-phase8-semantic-truth-cleanup`  
Date: 2026-08-15  
Status: **REAL USER PASS — ACCEPTED**

## Why Build81 exists

A fresh post-Build80 Phase8 audit found two surviving UI signals that did not match real product semantics:

1. Track Workspace still labelled the SonicTrace / audio-intelligence stage as `Sound`.
2. Release Campaign exposed a mutable `Premium provider` selector even though provider selection never changed the MASTER, 1:1, 9:16 or motion prompt builders.

Both were false semantic signals rather than missing capabilities.

## Accepted corrective

### Sonic wording truth

- Track production stage `Sound` → `Sonic`.
- Full intelligence eyebrow `TRACK / SOUND` → `TRACK / SONIC`.
- SonicTrace readiness, routing and analysis behavior remain unchanged.

### Release Campaign provider truth

- decorative mutable provider selector removed;
- visible `PROVIDER-AGNOSTIC` truth added;
- MASTER copy action is provider-neutral (`Copy MASTER handoff`);
- Google Flow remains an explicit convenience shortcut only;
- prompt builders remain unchanged and provider-agnostic;
- old browser-local drafts still restore prompts/assets/copy; old provider provenance is not treated as current prompt behavior;
- browser-local draft/export provenance is normalized to `provider-agnostic external image handoff`;
- Release Campaign remains browser-local/review-only with `canonicalWrite: false`.

## Release Campaign contract preserved

```text
MASTER FINAL 16:9
├── 1:1 independently anchored to MASTER
└── 9:16 independently anchored to MASTER
```

- 9:16 never derives from 1:1;
- `New MASTER concept` remains non-destructive;
- Google Flow opens in a separate safe tab;
- no provider-specific prompt behavior is invented;
- no canonical Track/Album/R2 write is introduced.

## Exact acceptance receipts

```text
Previous accepted        Build80 REAL USER PASS
Safety pre               safety/pre-build81-semantic-truth-20260815-0113
Studio PR                #123
Exact tested head        bdc79b8dd3fffb41c8368990d50fd733afe87fe3
Validation               31850313391 · SUCCESS
Runtime merge            20d587fe1b1d1a5405cd346571c8d5a0eb1d2fa4
Pages                    31850382728 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build81-deployed-candidate-20260815-0129
Candidate docs PR        #124
Candidate docs merge     b151eadcec376f8bbebc0378f7e51d92c62b0a31
Candidate docs Pages     31850596471 · SUCCESS
Real-user smoke          BUILD81 PASS · 2026-08-15
Safety post-RUP          safety/post-build81-real-user-pass-20260815-0159
Track Manager            v5.23
Studio bridge            v1.13
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 unchanged
Worker deploy            NONE
R2 migration/write       NONE
```

## Browser proof

The user explicitly returned:

```text
BUILD81 PASS
```

The tested behavior is therefore accepted as the current Studio runtime baseline.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains the project acceptance rule.
