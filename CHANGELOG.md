# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current deployed candidate

### v0.19.5 · Build83 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-save-response-loss-truth`  
Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

Build83 extends Phase9 reliability to the native canonical `lyrics.txt` save path.

Candidate behavior:

- Lyrics save timeout / transport loss is classified separately from ordinary server errors;
- the write is **never blindly retried** after response loss;
- Studio privately rereads canonical Lyrics + Track manifest;
- new revision + new ETag + exact requested normalized text = recovered `COMMITTED / VERIFIED`;
- unchanged revision + unchanged ETag = `NOT COMMITTED`, explicit retry may be safe;
- changed but causality/postcondition unproven = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal HTTP success still requires exact canonical revision + ETag + normalized-text verification;
- no Track Manager, Worker, public Worker, R2 migration, SonicTrace, LRC Maker or LaunchPAD change was required.

Exact candidate evidence:

```text
Safety pre               safety/pre-phase9-lyrics-response-loss-build83-20260815-0319
Studio PR                #129
Exact tested head        beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Validation               31856653579 · SUCCESS
Runtime merge            b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages            31856698097 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build83-deployed-candidate
Real-user smoke          PENDING
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
```

Detailed candidate record: [`changelogs/CHANGELOG-BUILD83.md`](changelogs/CHANGELOG-BUILD83.md).

## Current accepted release

### v0.19.4 · Build82 — 2026-08-15

Codename: `studio-focus-slice4-phase9-destructive-write-ambiguity-guard`  
Status: **REAL USER PASS — ACCEPTED**

Build82 opened Phase9 with bounded response-loss truth for destructive asset deletion.

Accepted behavior:

- Track asset delete captures canonical pre-write revision/state;
- Album asset delete captures canonical pre-write revision/state;
- a lost response or timeout is **never blindly retried**;
- private canonical reread classifies committed / not committed / ambiguous / unverified;
- normal success also requires exact new revision + canonical asset absence;
- no generic retry framework or second write authority was introduced;
- no Track Manager, Worker, public Worker or R2 migration change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-destructive-ambiguity-build82-20260815-0216
Studio PR                #126
Exact tested head        07fbcb4efdcd57e79614825d7c45bccd4ab2d860
Validation               31854468795 · SUCCESS
Runtime merge            7a0d52fcc0bf862478c459f0648afc1c6690b34f
Runtime Pages            31854528438 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build82-deployed-candidate-20260815-0248
Candidate docs PR        #127
Candidate docs CI        31854668980 · SUCCESS
Candidate docs merge     077ef8bb19920c439971325604a2d30e015e41c1
Candidate docs Pages     31854709308 · SUCCESS
Real-user smoke          BUILD82 PASS · 2026-08-15
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE
```

Detailed accepted record: [`changelogs/CHANGELOG-PHASE9-BUILD82.md`](changelogs/CHANGELOG-PHASE9-BUILD82.md).

## Accepted predecessor

### v0.19.3 · Build81 — 2026-08-15

Status: **REAL USER PASS — Phase8 closeout**

Build81 closed the Phase8 semantic-truth cleanup:

- Track production/intelligence wording `Sound` → `Sonic`;
- decorative Release Campaign `Premium provider` selector removed because provider choice never changed prompt builders;
- Release Campaign remains provider-agnostic and browser-local/review-only.

Detailed record: [`changelogs/CHANGELOG-PHASE8-BUILD81.md`](changelogs/CHANGELOG-PHASE8-BUILD81.md).

## Accepted Phase8 lineage

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health drill-down                            REAL USER PASS
Build76  Album Health truth                           historical candidate
Build77  Album Health visual polish                   historical candidate
Build78  humanized Track-side Album mismatch UX      historical candidate
Build79  Album publication truth                      historical candidate
Build80  cumulative Album Health/publication fix     REAL USER PASS
Build81  semantic truth cleanup                       REAL USER PASS / Phase8 closeout
```

Historical candidates remain historical evidence; they are not retroactively relabelled accepted.

## Phase 7-C baseline

Phase7-C remains program-complete on Build73. Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

All Phase8/9 health and guidance surfaces continue to preserve the same canonical authority boundaries.

## Next bounded action

**Do not allocate Build84 yet.**

Complete the normal Build83 real-user browser Lyrics regression smoke first. Do not deliberately interrupt a production write to manufacture a lost-response condition.

After explicit Build83 PASS, run a fresh Phase9 audit. Current leading candidates are SonicTrace analysis save response-loss truth, broader guarded Album-write response-loss truth, then Access/CORS and degraded/offline/PWA resilience.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.
