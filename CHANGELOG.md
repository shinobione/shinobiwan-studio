# SHINOBIWAN Studio — Changelog

This file is the **current concise changelog**. Detailed per-build records live under [`changelogs/`](changelogs/README.md).

## Current accepted release

### v0.19.5 · Build83 — 2026-08-15

Codename: `studio-focus-slice4-phase9-lyrics-save-response-loss-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build83 extends Phase9 reliability to the native canonical `lyrics.txt` save path.

Accepted behavior:

- Lyrics save timeout / transport loss is classified separately from ordinary server errors;
- the write is **never blindly retried** after response loss;
- Studio privately rereads canonical Lyrics + Track manifest;
- new revision + new ETag + exact requested normalized text = recovered `COMMITTED / VERIFIED`;
- unchanged revision + unchanged ETag = `NOT COMMITTED`, explicit retry may be safe;
- changed but causality/postcondition unproven = `AMBIGUOUS / DO NOT RETRY`;
- reread unavailable = `UNVERIFIED / DO NOT RETRY`;
- normal HTTP success still requires exact canonical revision + ETag + normalized-text verification;
- no Track Manager, Worker, public Worker, R2 migration, SonicTrace, LRC Maker or LaunchPAD change was required.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-lyrics-response-loss-build83-20260815-0319
Studio PR                #129
Exact tested head        beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Validation               31856653579 · SUCCESS
Runtime merge            b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages            31856698097 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build83-deployed-candidate
Candidate docs PR        #130
Candidate docs merge     afc526a59e5a2715929d200a32abbd49195b50bf
Candidate docs Pages     31856972224 · SUCCESS
Safety post-acceptance   safety/post-build83-real-user-pass-20260815-0406
Real-user smoke          BUILD83 PASS · 2026-08-15
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by deployment
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD83.md`](changelogs/CHANGELOG-BUILD83.md).

## Accepted predecessor

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

Detailed accepted record: [`changelogs/CHANGELOG-PHASE9-BUILD82.md`](changelogs/CHANGELOG-PHASE9-BUILD82.md).

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

**Build84 is unallocated.**

Run a fresh Phase9 reliability audit before selecting another runtime slice. Current leading candidates are SonicTrace analysis save response-loss truth, broader guarded Album-write response-loss truth, Access/CORS hardening, and degraded/offline/PWA resilience.

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.
