# SHINOBIWAN Studio v0.19.3 · Build 80

Codename: `studio-focus-slice4-phase8-duration-evidence-successor-compat`  
Date: 2026-08-15  
Status: **REAL USER PASS · ACCEPTED**

## Why Build80 exists

The Build79 browser smoke correctly exposed the Album publication blocker for `Pulse Dominion`:

```text
Track “Neon Swagger” must be Published (currently Draft).
```

Following that truthful blocker to `Neon Swagger` exposed the next real defect. Studio entered the duration-aware metadata path, but the client still hard-pinned that path to Track Manager v5.22 / bridge v1.12 while the deployed compatible successor was v5.23 / 1.13.

Build80 replaces that obsolete exact-version gate with an explicit bounded compatibility allowlist:

```text
Track Manager v5.22 / Studio bridge v1.12
Track Manager v5.23 / Studio bridge v1.13
```

Unknown/future pairs remain locked. Build80 does **not** use a generic numeric `>=` compatibility rule.

## Preserved safety contract

- canonical audio duration remains derived evidence, never free-form metadata;
- `expectedUpdatedAt` stale protection remains required;
- guarded `metadata` write capability remains required;
- duration-aware validation/save still use the existing Track Manager metadata endpoints;
- post-save private canonical reread remains mandatory;
- canonical duration and revision remain part of client verification;
- Build79 Album publication blockers and strict Album status reread remain intact;
- no generic `saveTrack` writer was introduced;
- no Worker redeploy was required for Build80;
- no Public Worker change;
- no R2 migration/manual mutation.

## Regression guard

`test-phase8-duration-evidence-successor-build80.mjs` proves:

- both known-compatible bridge pairs are explicitly allowlisted;
- v5.23 / 1.13 cannot be rejected by the obsolete v5.22-only literal gate;
- unknown future pairs are not implicitly accepted;
- metadata capability, stale revision and canonical reread protections remain intact.

## Exact receipts

```text
Studio safety pre        safety/pre-build80-duration-evidence-successor-compat-20260814-2358
Studio PR                #121
Exact tested head        3cb58fe4e108cb932a3a76474a9a00ca29724db9
Studio CI                31845088922 · SUCCESS
Runtime merge            1bb775596dc0f7a9e1c06956097793299064b976
Pages                    31845175630 · SUCCESS · exact runtime merge SHA
Real-user smoke          PASS · 2026-08-15
Smoke proof              Neon Swagger published, then Pulse Dominion published
Safety post-RUP          safety/post-build80-real-user-pass-20260815-0057
Track Manager            v5.23 · DEPLOYED
Studio bridge            v1.13
TM deploy run            31842482166 · SUCCESS · admin only
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 unchanged
New write route          NONE
R2 migration/manual      NONE
```

## Historical truth

Build79 remains a **deployed candidate / superseded diagnostic step**, not a retroactive REAL USER PASS. It successfully fixed Album blocker visibility and canonical status verification, then its browser smoke exposed the separate duration-evidence successor compatibility bug closed by Build80.

Build80 is the accepted cumulative runtime for this Album publication lineage.
