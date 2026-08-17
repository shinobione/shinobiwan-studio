# SHINOBIWAN STUDIO — Canonical Decisions

Updated: 2026-08-17 after **Phase9 program closeout**.

This file records durable product, architecture and safety decisions. It is not a changelog. Add an entry only when a decision is introduced, changed or explicitly superseded.

## D-001 — Authority model

**Status:** active / frozen

- GitHub is the application-code authority.
- Cloudflare R2 is the canonical catalog/media/data authority.
- Track Manager is the protected canonical Track/Album write authority.
- SHINOBIWAN Studio is the private artist cockpit/orchestrator.
- LaunchPAD is the public listener/PWA experience.
- SonicTrace is the audio-intelligence engine.
- LRC Maker is the lyrics synchronization engine.
- Public fallback paths are read-only and never verify a canonical write.

**Consequence:** Studio must not become a generic arbitrary R2 writer and related apps must not invent competing sources of truth.

## D-002 — Canonical Track identity

**Status:** active / frozen

The canonical `trackId` is the R2 slug and remains the same across Studio, Track Manager, LaunchPAD, SonicTrace, LRC Maker, manifests and catalog projections.

## D-003 — Canonical Album model

**Status:** active / frozen

Canonical Album authority:

```text
albums/<album-id>/manifest.json
```

- Album ID is stable after creation.
- Ordered `album.trackIds` is the sole Album membership + artistic-order authority.
- Track-side `album` metadata is compatibility/cache data only.
- Generic Track metadata writes must not independently change Album membership.
- Album publication uses Track Manager guarded quality rules.

## D-004 — Canonical lyrics model

**Status:** active / frozen

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = export / compatibility only
```

A `.lrc` file is not an alternative authority and its presence does not define synchronization.

## D-005 — Audio duration truth

**Status:** active / frozen

`manifest.duration` is a derived canonical fact from the current master audio, not a free-form metadata field. Duration evidence is accepted only through explicitly compatible guarded Track Manager bridge pairs.

## D-006 — Specialized writes only

**Status:** active / frozen

Studio uses bounded domain-specific operations such as metadata, lyrics, assets, SonicTrace sidecars and Albums. Do not create a generic cross-origin `saveTrack()` / arbitrary payload writer merely for convenience.

Whole-track deletion remains outside the Studio bridge unless a future explicit design changes that boundary.

## D-007 — Cloudflare Access / browser transport

**Status:** active / frozen

- No Cloudflare Access secret or R2 credential in GitHub Pages.
- Exact Studio origin remains credential-aware; credentialed CORS never uses `*`.
- Existing simple-request control POST transport is preserved where required by Access/CORS.
- Multipart upload uses browser-generated `FormData`; do not force its `Content-Type` boundary.
- Do not introduce browser PUT/PATCH/DELETE methods just for REST aesthetics if they break the established protected transport model.

## D-008 — Lost-response write policy

**Status:** active / frozen Phase9 authority

A lost HTTP response does not prove whether a write committed.

For any write hardened under Phase9:

```text
response lost / timeout
→ no blind automatic retry
→ private canonical reread
→ classify committed / not committed / ambiguous / unverified
```

An explicit retry may be presented as safe only when canonical reread proves the pre-write revision/state is unchanged.

A lost-response operation may be recovered as success only when its exact canonical postcondition is positively verified.

Build82 first applied this to Track asset delete and Album asset delete; later Phase9 slices extended the same decision only with operation-specific postconditions. Phase9 closeout freezes the policy but does not authorize generic retry/recovery code.

## D-009 — Acceptance states remain separate

**Status:** active / frozen

```text
CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS
```

Also distinguish:

```text
code merged
Pages deployed
Worker deployed
R2/catalog mutated
```

A docs-only merge does not create a runtime build.

## D-010 — Production readiness and publication are different axes

**Status:** active

```text
Production:  Needs attention / Production complete
Publication: Draft / Published
```

A production-ready Track may remain Draft. A Published Track may still expose production-health gaps. Publication remains an explicit guarded decision.

## D-011 — One workflow authority

**Status:** active / frozen

Accepted workflow:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Home, Tracks, Workflow, Track Workspace and health surfaces reuse `workflow.nextAction`. Do not create a second queue or priority engine.

## D-012 — Release Campaign is provider-agnostic

**Status:** active

- Track stage wording is `Sonic`, not `Sound`.
- Release Campaign does not expose a fake `Premium provider` selector when provider choice does not change prompt semantics.
- Google Flow is a convenience shortcut only.
- MASTER 16:9 anchors independent 1:1 and 9:16 derivatives; 9:16 is not derived from 1:1.
- Campaign draft state remains browser-local and export remains review-only (`canonicalWrite: false`).

## D-013 — Destructive smoke policy

**Status:** active / frozen

Do not delete or replace important production WAV, cover, video, Album cover or lyrics merely to prove mutation code works.

Prefer source guards, typecheck/build, stale protection, canonical reread verification and explicit confirmations. A destructive browser smoke should use an intentionally disposable Draft asset only when genuinely necessary.

## D-014 — Version/build discipline

**Status:** active / frozen

- A runtime build is allocated only for a proven runtime scope.
- Docs-only governance/closeout work does not bump Studio version/build.
- A candidate does not become accepted retroactively because a later candidate passes.
- Historical failed/superseded builds retain their real status.
- Closing a phase does not consume the next build number merely for bookkeeping.

## D-015 — Repository memory is canonical and bounded

**Status:** active

Current project reconstruction starts from:

```text
AGENTS.md
PROJECT_STATE.md
ROADMAP.md
DECISIONS.md
QA.md
```

Historical `docs/` and `changelogs/` are evidence, not mandatory startup context. Significant accepted closeouts must update the canonical checkpoint files so a new session can resume from repository truth without a copied chat transcript.

## D-016 — Client-side reliability must stop where backend evidence stops

**Status:** active / frozen · introduced by Phase9 closeout

Phase9 established the maximum truthful Studio-side reliability boundary under the current backend contracts.

Studio may classify or recover a lost-response operation only when available canonical evidence positively proves the operation-specific postcondition. It must **not** infer causality merely because current state looks plausible after a transport failure.

Examples that require stronger backend evidence before further hardening:

- Track/Album create response-loss causality without durable operation identity;
- exact-byte binary upload causality without trustworthy digest/equivalent exact-object proof;
- catalog rebuild causality without operation identity/generation token/status;
- expensive Deep Audio compute completion without coordinator operation identity/status/idempotency.

```text
backend exposes enough authoritative evidence
→ a future bounded slice may use it

backend does not expose enough authoritative evidence
→ Studio reports ambiguity/unverified truthfully
→ no blind retry
→ no fake client-side certainty
```

**Consequence:** Phase9 is complete on accepted Build106. Build107 remains unallocated until a Phase10 scope audit proves a new bounded runtime objective; it is not a filler reliability build.

## Changing a decision

When a durable decision changes:

1. add or update the relevant entry here;
2. state what it supersedes and why;
3. update `PROJECT_STATE.md` / `ROADMAP.md` if the change affects current scope;
4. add QA evidence if the decision changes runtime behavior;
5. preserve old milestone evidence rather than rewriting history.