# SHINOBIWAN Studio — Build98

Date: 2026-08-16  
Version: `v0.19.20`  
Build: `98`  
Codename: `studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective`  
Status: **REAL USER PASS · ACCEPTED**

## Trigger

Build97 real-user smoke created the genuine `pixels-promises` draft successfully, then exposed a pre-existing Track Manager v5.22/v5.23 generated-bundle defect: Track asset upload used `uploadEvidence` outside its lexical scope and rolled the first MP3/JPEG writes back with `ASSET_SAVE_ROLLBACK · HTTP 500`.

Track Manager corrective PR #238 produced TM v5.24 / Studio bridge v1.14 and proved the exact `create → MP3 → JPEG` reproduction in CI. Before that Worker is deployed, Studio must recognize the new bounded bridge pair anywhere it sends canonical duration evidence.

## Build98 scope

Build98 is a compatibility corrective only:

```text
accepted duration-evidence pairs
5.22 / 1.12
5.23 / 1.13
+ 5.24 / 1.14
```

The pair is added to both:

- duration-aware metadata validation;
- resilient metadata save authorization.

The Album service contract label is updated from the old single current pair to the bounded v5.23-v5.24 / v1.13-v1.14 line.

## Preserved truth

Build98 does **not** change:

- Build97 Track-create full normalized manifest verification;
- Track asset upload algorithm in Studio;
- metadata validation retry classification;
- metadata save response-loss semantics;
- any write retry count;
- Lyrics / SonicTrace / Album write algorithms;
- Track Manager or R2 from the Studio repository;
- LaunchPAD public runtime.

Metadata writes and Track create both remain at **zero automatic retries**.

## Accepted receipts

```text
Studio base before Build98       99925484dc8143f6c12eb4c049690132e1a98dbc
Safety pre                      safety/pre-build98-tm524-duration-compat-20260816
Runtime PR                      #181
Exact final head                c393e26caa9a9e7d0b3ad71fccca92b9c1ae234b
Historical CI #495              31917263004 · FAILURE · inherited Build79 label only · never merged
Final CI #496                   31917295331 · SUCCESS
Runtime merge                   5ebbf78f9d9296eaed998f1093f2ca7dad68fd1d
Runtime Pages #188              31917336845 · SUCCESS
Safety post-deploy              safety/post-build98-deployed-candidate-20260816
Safety post-acceptance          safety/post-build98-real-user-pass-20260816
TM corrective PR                LaunchPAD-APP #238
TM source merge                 aaa28c90c95b6d5dbe76e34a840d95e194e0cc65
TM deploy run #40               31919397012 · SUCCESS · admin only
TM Worker Version ID            53abb651-4f3c-46a7-a37a-055f35d340b9
Public Worker                   v2.7 · unchanged / skipped
Real-user verdict               MP3 + COVER + MP4 + TXT PASS MADAFAKA · 2026-08-16
```

The protected TM deploy verified v5.24 / bridge v1.14 and Cloudflare Access, while explicitly skipping Public Worker deployment. The deploy itself did not rebuild `catalog/index.json` or mutate existing R2 media. The genuine user flow then committed MP3, cover JPEG, MP4 and TXT assets successfully with no recurrence of `ASSET_SAVE_ROLLBACK · HTTP 500`.

Build98 is **REAL USER PASS · ACCEPTED**. Build99 remains unallocated pending a fresh read-only post-Build98 audit.
Build98 cannot be called REAL USER PASS until TM v5.24 is deployed and the genuine `Pixels & Promises` asset flow is successfully resumed.
