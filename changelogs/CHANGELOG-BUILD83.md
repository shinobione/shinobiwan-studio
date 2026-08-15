# Studio v0.19.5 · Build83 — Phase9 Lyrics save response-loss truth

Status: **REAL USER PASS — ACCEPTED**.

## Scope

Build83 hardens only the Studio-side canonical `lyrics.txt` save path when the write response is lost or times out after the request begins.

It does not change Track Manager, the Studio bridge, Cloudflare Workers, R2 schema/data, LRC Maker, SonicTrace or LaunchPAD.

## Lost-response contract

```text
Lyrics save response lost / timeout
→ NEVER blind automatic retry
→ private canonical reread of lyrics + Track manifest
   ├─ new revision + new ETag + exact requested normalized text
   │    → COMMITTED / VERIFIED
   ├─ same revision + same ETag
   │    → NOT COMMITTED / explicit retry may be safe
   ├─ canonical state changed but exact requested postcondition is not proven
   │    → AMBIGUOUS / DO NOT RETRY
   └─ private reread unavailable
        → UNVERIFIED / DO NOT RETRY
```

Normal HTTP success continues to require canonical reread of the expected revision, ETag and normalized text.

## UX truth

The native Lyrics editor distinguishes:

- recovered verified success after a lost response;
- the narrow retry-safe `NOT COMMITTED` state;
- `AMBIGUOUS` / `UNVERIFIED` states with explicit **DO NOT RETRY** guidance.

When the HTTP response was lost, Studio does not claim whether the server-side catalog rebuild flag was returned; it reports that response detail as unknown instead of inventing a value.

## Validation

Phase9 full gate keeps the accepted Build82 destructive-write ambiguity guard and adds `test-phase9-lyrics-response-loss-build83.mjs`.

Final exact-head validation:

```text
Runtime PR              #129
Exact tested head       beff9fc58c58e36ce2c2082f7bd5c041641a5e12
Final CI                31856653579 · SUCCESS
Runtime merge           b168d8cda805e5c50480a3e26c5d52e490fb7ac6
Runtime Pages           31856698097 · SUCCESS
Candidate docs PR       #130
Candidate docs merge    afc526a59e5a2715929d200a32abbd49195b50bf
Candidate docs Pages    31856972224 · SUCCESS
```

Useful pre-merge red runs were not merged. They exposed bounded historical successor allowlists and one overly syntax-literal new guard; the final head passed the complete repository-native chain including Phase9, Studio Focus, TypeScript and Vite production build.

## Real-user acceptance

The required bounded normal-browser regression smoke received the explicit verdict:

```text
BUILD83 PASS · 2026-08-15
```

Acceptance did not require deliberately interrupting a production Lyrics write merely to manufacture response loss. The ambiguity branches are protected by the Phase9 guards, typed classification and canonical reread logic.

Safety checkpoint after acceptance:

```text
safety/post-build83-real-user-pass-20260815-0406
```

## Boundaries preserved

```text
Track Manager           v5.23 · unchanged
Studio bridge           v1.13 · unchanged
TM admin Worker         439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker           v2.7 · unchanged
Worker deployment       NONE
R2 migration/write      NONE caused by deployment
LaunchPAD               unchanged
SonicTrace              unchanged
LRC Maker               unchanged
```

## Stop line

- Build83 is now **REAL USER PASS**.
- Build84 remains **UNALLOCATED**.
- Before any successor runtime work, perform a fresh bounded Phase9 reliability audit.
- SonicTrace analysis save response-loss truth remains the leading audit candidate, not an automatic commitment.
- No automatic retry policy is generalized to unrelated write families.
