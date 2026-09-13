# Build108 — Catalog rebuild generation identity

Date: 2026-09-13

Status: **ACCEPTED · REAL USER PASS**

Identity: **v0.19.30 · Build108**

## What changed

Build108 adds causal operation identity to the explicit Studio catalog rebuild flow.

For each explicit rebuild, Studio now creates one browser UUID and sends it with the existing `catalog-rebuild-v1` request. Track Manager persists that UUID as `generationId` in the canonical `catalog/index.json`, verifies it before returning success, and exposes the current canonical catalog projection identity through the private Studio read model.

Studio then rereads the private canonical projection and requires the exact UUID match before treating the operation as verified.

## Response-loss behavior

```text
response received + generationId matches
→ COMMITTED / VERIFIED

response lost + canonical reread generationId matches
→ COMMITTED / RECOVERED

response lost + generationId differs / unavailable
→ AMBIGUOUS or UNVERIFIED
→ no blind automatic write retry
```

This closes the catalog-rebuild causality gap without generalizing retry semantics to Track create, Album create, assets, metadata, Lyrics, SonicTrace or Deep Audio.

## Backend evidence

```text
LaunchPAD PR             #275
Backend head             472e0f9248bd82de838f9c3b723dd5b72d23083b
Backend merge            31675ba4444282691c6e4d55d098f187ab3c4bad
Cloudflare deploy        34753041082 · SUCCESS · admin only
Admin Worker version ID  ff037b48-b717-49a4-82ad-395aa06b6f6f
```

Public Worker deployment was skipped. Existing implicit catalog writers keep the pre-Build108 behavior when no generation identity is supplied.

## Studio evidence

```text
Studio PR                #216
Studio head              b27a2891d2041d79aad4ab2910a150516af74ad4
Candidate CI             #639 · 34752807960 · SUCCESS
Studio merge             e380a6ab098bddad8b744812515df36fe3ef5906
Pages                    #227 · 34753099885 · SUCCESS build + deploy
```

## Real-user acceptance

PASS on 2026-09-13.

```text
CATALOG REBUILT
45 tracks
generated                2026-09-13T10:57:36.269Z
generation               c4072021-707b-4d03-be8e-d21324a348b4
canonical reread         verified
```

The smoke rebuilt only the canonical catalog projection from current manifests. It did not modify Track/Album manifests or media.

See [`docs/acceptance/BUILD108-REAL-USER-PASS.md`](../docs/acceptance/BUILD108-REAL-USER-PASS.md) for the canonical acceptance receipt.
