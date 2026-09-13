# Build107 — REAL USER PASS

Date: 2026-09-13

Status: **ACCEPTED · REAL USER PASS**

Studio identity: **v0.19.29 · Build107**

Codename: `studio-focus-slice4-phase10-shared-catalog-projection-kernel`

## Accepted Phase10 slice

Build107 is the first accepted Phase10 progressive-extraction slice. It removes one exact cross-repository numerical duplication while preserving Studio as orchestrator and SonicTrace as the audio-intelligence authority.

The shared kernel contains only:

```text
vector normalization
dot product
powerComponent
```

SonicTrace owns the single editable implementation. Studio consumes a generated, byte-identical, offline vendor copy. No live cross-repository runtime dependency was introduced.

## Canonical source and provenance

```text
Repository              shinobione/LM-IA-Analayse
Source path             js/catalog-projection-kernel.mjs
Source commit           70b0bf277a01f3817dd2db71c91233a8fe91debf
Source PR               #86
Source merge            3da52dfd36e1ba303e109402e65acccdde274a6e
SHA-256                 f883aa12011d0714049717c6de6a426fbc7c8296a5aa872a978aaeefc47f34d8
```

Studio's provenance metadata pins repository, commit, path and digest. Integrity checks reject modified vendor bytes and altered provenance metadata.

## Studio implementation evidence

```text
Implementation PR       #214
Implementation head     b827e7076610c840f8e0f4446f5cf6fd33411008
Validation run          #617 · 34749718962 · SUCCESS
Implementation merge    9b40d2cc3fb1bd22e950a94af859564fadf8dfff
Pages run               #225 · 34750194798 · SUCCESS build + deploy
```

Studio keeps its existing 512D validity filter, canonical ordering, centering, projection normalization, acoustic-zone logic, nearest-track behavior, semantics and public exports.

## SonicTrace validation evidence

```text
Validation workflow     Validate SonicTrace Phase 5
Run                     #107 · 34749669665
Final result            SUCCESS
```

The contract job passed the Build107 numerical-kernel checks and inherited Python, semantic and catalog regressions. The first real Discogs-EffNet ONNX smoke attempt timed out while downloading remote metadata. The isolated failed job was rerun and passed, confirming that the first failure was external/transient rather than a Build107 numerical regression.

SonicTrace keeps its existing input cleaning, projection policy, fallback, clustering, scoring and semantic policies.

## Real-user smoke — PASS

The user performed the requested non-mutating smoke on 2026-09-13 against the deployed Studio implementation and normal SonicTrace standalone runtime.

Visible Studio Intelligence evidence:

```text
Analyzed                 45
512D ready               45
Hidden from map          0
Acoustic zones           5
Sonic families           11
Catalog map              rendered
Selected track           NGÀY EM VỀ NHÀ
Closest-sound panel      rendered
```

Visible SonicTrace standalone evidence:

```text
Catalog titles           20
Acoustic zones           3
Sonic families           4
Potential duplicates    12
Outliers                 0
Average concordance      32%
Catalog map              rendered
Selected track           Saigon Sun, Toulouse Moon
Neighbor links           rendered
```

This exercised the exact Build107 user-visible boundary: deterministic catalog projection, map rendering, zones/families, active selection and nearest/neighbor presentation.

No Track Manager write, R2 mutation, Public Worker change, schema migration, destructive action or production-data mutation was required.

Result: **PASS**.

## Acceptance decision

Build107 is accepted as **Phase10 Slice1**.

Build106 remains the accepted predecessor and its Phase9 reliability contracts remain unchanged. Build107 changes no write authority, retry policy, persistence contract, Album authority, Lyrics authority, release orchestration or public visibility policy.

The next Phase10 slice is **not allocated**. Before any Slice2 implementation, perform a fresh bounded read-only cross-repository scope audit proving one real duplication/reuse boundary, singular canonical ownership, standalone safety, independent rollback and an explicit CI + real-user acceptance boundary.
