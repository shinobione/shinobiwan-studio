# SHINOBIWAN Studio v0.19.3 · Build 78

Codename: `studio-focus-slice4-phase8-album-health-cache-drift-human-ux`  
Date: 2026-08-14  
Status: **MERGED + DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

## Why Build78 exists

Build77 fixed the visual composition of Album Health, but the real-user browser review exposed one remaining comprehension problem on Pulse Dominion:

```text
1 cache drift
Compatibility cache
neon-swagger
album.trackIds remains authoritative.
Review Album details ↓
```

That presentation was technically accurate but product-hostile. It exposed internal architecture jargon and sent the user toward Album details even though the canonical Album membership authority itself was already correct.

## Build78 corrective

Build78 preserves the exact Build76/77 Album Health truth engine and changes only the user-facing interpretation/routing of compatibility-cache drift.

User-facing behavior becomes:

```text
Track metadata out of sync
<resolved Track title>
Canonical Album membership is already authoritative.
The Track-side Album reference does not match and should be normalized.
Review track metadata →
```

The action routes directly to the existing Track Workspace `metadata` section.

Internal terms `cache drift` and `Compatibility cache` are no longer exposed in Album Health UI. The internal detector and `cacheDriftTrackIds` data remain unchanged.

## Authority / safety unchanged

```text
Album membership/order authority  album.trackIds
Track-side album                  compatibility cache only
Album writes                      AlbumsWorkspace → Track Manager
Track metadata writes             existing protected Track metadata flow only
Album Health                      read-only
Automatic repair                  NONE
New writer                        NONE
Worker/backend change             NONE
R2 mutation/migration             NONE
```

A cache mismatch by itself no longer triggers the Album-level `Review Album details` CTA. Genuine Album structural issues (missing cover, empty tracklist, broken member reference) still do.

## Exact receipts

```text
Accepted baseline        Build75 REAL USER PASS
Build76                  functional candidate · NOT RUP
Build77                  deployed visual candidate · superseded by Build78 comprehension corrective
Base main                89c425922bd604361356b2d08a950251825d1d41
Safety pre               safety/pre-build78-cache-drift-human-ux-20260814-2242
Feature                   agent/build78-cache-drift-human-ux
PR                        #117
Final tested head         4b4ecbe99b19977f43c1abb1111c18098ae2091a
Exact-head CI             31839616909 · SUCCESS
Runtime merge             77b43de7978f552c948ff0307c23e1ac2b456e56
Pages                     31839697339 · SUCCESS · exact runtime merge SHA
Safety post-deploy        safety/post-build78-deployed-candidate-20260814-2252
Track Manager             v5.22 · unchanged
Studio bridge             v1.12 · unchanged
Public Worker             v2.7 · unchanged
Worker deploy             NONE
R2 mutation/migration     NONE
```

## Acceptance gate

Completed:

```text
exact-head CI             ✅
anti-drift main           ✅
exact tested-head merge   ✅
exact merge-SHA Pages     ✅
```

Still required:

```text
real-user browser smoke   ⏳
→ only then REAL USER PASS
```

**Build75 remains the accepted baseline until Build78 passes browser smoke.**
