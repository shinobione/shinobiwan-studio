# Studio v0.19.5 · Build83 — Phase9 Lyrics save response-loss truth

Status at implementation PR: **candidate / real-user acceptance pending**.

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

A destructive or deliberately interrupted production Lyrics save is not required merely to prove the guard. Real-user acceptance should focus on normal Lyrics regression behavior unless an intentionally disposable Draft track is available for a controlled failure scenario.

## Stop line

- Build83 must not be promoted to REAL USER PASS until CI, Pages and the required browser smoke are separately recorded.
- SonicTrace save response-loss truth remains a later Phase9 candidate.
- No automatic retry policy is generalized to unrelated write families.
