# SHINOBIWAN Studio — Build98

Date: 2026-08-16  
Version: `v0.19.20`  
Build: `98`  
Codename: `studio-focus-slice4-phase9-tm524-duration-evidence-compat-corrective`  
Status: **IMPLEMENTED CANDIDATE · CI PENDING · REAL USER SMOKE BLOCKED ON TM DEPLOY**

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

## Safety

```text
Studio accepted/candidate base  99925484dc8143f6c12eb4c049690132e1a98dbc
Safety pre                     safety/pre-build98-tm524-duration-compat-20260816
Feature branch                 phase9/build98-tm524-duration-evidence-compat
TM v5.24 merged source         aaa28c90c95b6d5dbe76e34a840d95e194e0cc65
TM production deployment       PENDING MANUAL PROTECTED WORKFLOW
Worker change in Studio PR     NONE
R2 mutation from Studio PR     NONE
```

Build98 cannot be called REAL USER PASS until TM v5.24 is deployed and the genuine `Pixels & Promises` asset flow is successfully resumed.
