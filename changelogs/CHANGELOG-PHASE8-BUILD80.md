# SHINOBIWAN Studio v0.19.3 · Build 80

Codename: `studio-focus-slice4-phase8-duration-evidence-successor-compat`  
Date: 2026-08-14  
Status: **CANDIDATE — CI + DEPLOY + BROWSER SMOKE REQUIRED**

## Why Build80 exists

The Build79 browser smoke correctly exposed the Album publication blocker for `Pulse Dominion`:

```text
Track “Neon Swagger” must be Published (currently Draft).
```

Following that truthful blocker to `Neon Swagger` exposed the next real defect. Studio measured canonical audio duration and entered the duration-aware metadata path, but `metadata-duration-api.ts` rejected the active Track Manager successor before validation:

```text
Canonical audio-duration repair requires Track Manager v5.22 / Studio bridge v1.12;
active bridge is 5.23 / 1.13.
```

TM v5.23 / bridge v1.13 preserves the v5.22 duration-evidence contract and adds Album publication truth. The Studio client had incorrectly pinned the duration-aware path to the predecessor version pair.

## Corrective

Build80 replaces the exact v5.22-only gate with an explicit bounded compatibility allowlist:

```text
Track Manager v5.22 / Studio bridge v1.12
Track Manager v5.23 / Studio bridge v1.13
```

Unknown/future pairs remain locked. Build80 does **not** use a generic numeric `>=` compatibility rule.

The existing safety contract remains unchanged:

- canonical audio duration stays derived evidence, never a manual metadata field;
- `expectedUpdatedAt` stale protection remains required;
- guarded `metadata` write capability remains required;
- duration-aware validation/save still use the existing Track Manager metadata endpoints;
- post-save private canonical reread remains mandatory;
- canonical duration and revision remain part of client verification;
- no generic `saveTrack` writer is introduced;
- no Worker, Public Worker or R2 migration is required for this Studio-only corrective.

## Regression guard

`test-phase8-duration-evidence-successor-build80.mjs` proves:

- both known compatible bridge pairs are explicitly allowlisted;
- v5.23 / 1.13 cannot be rejected by the old v5.22-only literal gate;
- unknown future pairs are not implicitly accepted;
- metadata capability, stale revision and canonical reread protections remain intact.

The historical Build71 duration-evidence guard was updated to assert the durable contract rather than the obsolete exact predecessor-version literal.

## Safety

```text
Last accepted Studio baseline  Build75 REAL USER PASS
Build79                        deployed candidate · browser blocker path verified, full smoke NOT PASS
Build80 safety pre             safety/pre-build80-duration-evidence-successor-compat-20260814-2358
Track Manager                  v5.23
Studio bridge                  v1.13
TM Worker Version ID           439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker                  v2.7 unchanged
New write route                NONE
R2 migration/manual mutation   NONE
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.
