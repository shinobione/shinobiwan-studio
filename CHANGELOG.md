# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.3 · Build81 — 2026-08-15

Codename: `studio-focus-slice4-phase8-semantic-truth-cleanup`  
Status: **REAL USER PASS — ACCEPTED**

Build81 closes two semantic mismatches proven by fresh code audit:

- Track production/intelligence wording `Sound` → `Sonic`;
- decorative Release Campaign `Premium provider` selector removed because provider choice never changed prompt builders.

Accepted behavior:

- Track progression says `Sonic`;
- full SonicTrace view says `TRACK / SONIC`;
- Release Campaign visibly states `PROVIDER-AGNOSTIC`;
- Google Flow remains a convenience shortcut only;
- MASTER/1:1/9:16/motion prompts remain provider-agnostic;
- old browser-local Release Campaign drafts still restore prompts/assets/copy;
- campaign export remains review-only with `canonicalWrite: false`;
- no Worker/backend/R2 change.

Exact acceptance evidence:

```text
Safety pre               safety/pre-build81-semantic-truth-20260815-0113
Studio PR                #123
Exact tested head        bdc79b8dd3fffb41c8368990d50fd733afe87fe3
Validation               31850313391 · SUCCESS
Runtime merge            20d587fe1b1d1a5405cd346571c8d5a0eb1d2fa4
Runtime Pages            31850382728 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build81-deployed-candidate-20260815-0129
Candidate docs PR        #124
Candidate docs merge     b151eadcec376f8bbebc0378f7e51d92c62b0a31
Candidate docs Pages     31850596471 · SUCCESS
Real-user smoke          BUILD81 PASS · 2026-08-15
Safety post-RUP          safety/post-build81-real-user-pass-20260815-0159
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE8-BUILD81.md`](changelogs/CHANGELOG-PHASE8-BUILD81.md).

## Accepted predecessor

### v0.19.3 · Build80 — 2026-08-15

Status: **REAL USER PASS — cumulative Album Health/publication baseline**

Build80 accepted the cumulative Builds76→80 Album Health/publication lineage after fixing the obsolete Studio duration-evidence bridge pin and completing the browser sequence:

```text
Neon Swagger → Published
Pulse Dominion → Published
```

TM v5.23 / bridge1.13 remains the deployed protected backend baseline.

Detailed record: [`changelogs/CHANGELOG-PHASE8-BUILD80.md`](changelogs/CHANGELOG-PHASE8-BUILD80.md).

## Accepted Phase8 lineage

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health Drill-down                            REAL USER PASS
Build76  Album Health truth                           candidate
Build77  Album Health visual polish                   candidate
Build78  humanized Track-side Album mismatch UX      candidate
Build79  Album publication truth                      candidate
Build80  cumulative Album Health/publication fix     REAL USER PASS
Build81  semantic truth cleanup                       REAL USER PASS
```

Historical candidates remain historical evidence; they are not retroactively relabelled accepted.

## Phase 7-C baseline

Phase7-C remains program-complete on Build73. Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

All Phase8 health surfaces continue to reuse the same `workflow.nextAction` authority. Studio remains an orchestrator, not a second workflow engine or generic writer.

Detailed Phase7-C records:

- [`changelogs/CHANGELOG-PHASE7-C-BUILD73.md`](changelogs/CHANGELOG-PHASE7-C-BUILD73.md)
- [`changelogs/CHANGELOG-PHASE7-C-BUILD71.md`](changelogs/CHANGELOG-PHASE7-C-BUILD71.md)
- [`docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-7-C-PROGRAM-CLOSEOUT-AUDIT.md)

## Next bounded audit

Build82 is unused. The first remaining focused issue is the asset-selection error previously observed on `Magnetic Midnight`; reproduce it before designing a fix.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.
