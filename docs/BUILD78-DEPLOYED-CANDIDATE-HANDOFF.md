# Build78 deployed-candidate handoff

Date: 2026-08-14  
Status: **DEPLOYED CANDIDATE — REAL USER SMOKE PENDING**

Build75 remains the accepted Studio baseline until Build78 passes browser smoke.

## Exact runtime receipts

```text
Studio                 v0.19.3 · Build78
Codename               studio-focus-slice4-phase8-album-health-cache-drift-human-ux
Safety pre             safety/pre-build78-cache-drift-human-ux-20260814-2242
PR                     #117
Final tested head      4b4ecbe99b19977f43c1abb1111c18098ae2091a
Final CI               31839616909 · SUCCESS
Runtime merge          77b43de7978f552c948ff0307c23e1ac2b456e56
Pages                  31839697339 · SUCCESS · exact merge SHA
Safety post-deploy     safety/post-build78-deployed-candidate-20260814-2252
```

## Real-user smoke target

Open **Albums → Pulse Dominion** after a hard refresh.

Expected cache-mismatch presentation:

```text
Track metadata out of sync
<Track title>
Canonical Album membership is already authoritative.
The Track-side Album reference does not match and should be normalized.
Review track metadata →
```

The old user-facing strings must be gone:

```text
cache drift
Compatibility cache
```

Click **Review track metadata →** and confirm Studio opens the existing Track Workspace **Metadata** section for the affected Track.

A Track metadata mismatch alone must not show the Album-level `Review Album details ↓` CTA. Genuine Album structural issues still may.

Simply browsing Album Health must remain read-only.

## Cross-stack unchanged

```text
Track Manager          v5.22
Studio bridge          v1.12
Public Worker          v2.7
Worker deploy          NONE
R2 mutation/migration  NONE
```

If this passes, record `BUILD78 PASS`; only then perform the normal RUP docs/roadmap closeout.
