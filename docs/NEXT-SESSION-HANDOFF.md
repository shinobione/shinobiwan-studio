# NEXT SESSION HANDOFF — Build79 Album publish truth · deployed candidate

Updated: 2026-08-14 after **TM v5.23 deployment + Studio Build79 deployment**.

## Start here

Before modifying anything, verify real GitHub/deployment state again.

Current release truth:

```text
Studio accepted baseline   v0.19.3 · Build75 · REAL USER PASS
Studio current candidate   v0.19.3 · Build79 · DEPLOYED CANDIDATE · browser smoke pending
Build76                    functional candidate · NOT RUP
Build77                    visual candidate · superseded
Build78                    comprehension candidate · superseded by Build79
Track Manager              v5.23 · DEPLOYED
Studio bridge              v1.13
TM Worker Version ID       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker              v2.7 · unchanged
LaunchPAD public           2026.08.12.102 · REAL USER PASS
SonicTrace                 V2-E Build08 · REAL USER PASS
Deep Audio                 2.0.3-alpha
LRC Maker                  6.3.8
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## Why Build79 exists

A real browser test on an Album (`Pulse Dominion`) showed this false-success path:

```text
Draft → Published requested
→ Album revision advanced
→ Studio showed green metadata success
→ canonical Album still reread Draft
→ form reset to Draft
→ no blocker remained visible
```

Root causes:

1. Studio Album metadata verification trusted revision success without comparing requested metadata fields such as `status` to canonical reread;
2. on write failure Studio displayed an error and then `load()` cleared it again after a successful canonical reread;
3. Track Manager also needed a strict server-side metadata reread equality check before reporting Album metadata success.

## Build79 / TM5.23 contract

Publication rules are unchanged. A canonical Album can be Published only when the existing backend quality checks pass, including:

- title present;
- canonical `album.trackIds` non-empty;
- Album cover present;
- every `trackId` resolves to a Track;
- every member Track is itself `published`.

Build79 now:

- preserves Worker `quality` details;
- shows human publication blockers such as missing cover or a named member Track still Draft;
- compares every requested Album metadata field against the canonical reread;
- treats requested `Published` / canonical `Draft` as a hard failure;
- keeps failure messages visible after canonical reload;
- shows green metadata success only after exact canonical verification.

TM5.23 / bridge1.13 now:

- keeps the same guarded Album routes and quality gate;
- performs strict metadata reread comparison server-side before returning success;
- rolls back on verification mismatch;
- returns `verificationDetail` for a failed verification;
- adds no second writer and no new Album mutation route.

## Exact backend receipts

```text
LaunchPAD PR              #237
TM tested head            a1fe4c8dd0df78d0dbb2bde418ccaed294290266
LaunchPAD validation      31841695779 · SUCCESS
Workers validation        31841695805 · SUCCESS
Overflow validation       31841695814 · SUCCESS
TM merge                  bc82fea12edc7cbd1b7b054c697a553694e76322
Admin deploy run          31842482166 · SUCCESS · target=admin
TM Worker Version ID      439a1ce4-e458-427d-9fd6-61e888efd269
Public deploy             SKIPPED
TM safety pre             safety/pre-tm523-album-publish-truth-20260814-2300
```

The deployment workflow explicitly reported `DEPLOY_TARGET=admin`, `EXPECTED_ADMIN_VERSION=5.23`, and skipped Public Worker deploy/verification steps.

## Exact Studio Build79 receipts

```text
Studio PR                 #119
Initial CI                31842069225 · FAILURE · inherited Build64 backend-version literal
Second CI                 31842657314 · FAILURE · strict TypeScript dynamic-key indexing
Final tested head         13e29763e2cced348057814c28f0623b5def3444
Final CI                  31842783733 · SUCCESS
Runtime merge             128b5c4397cb6f3b8e9eda7cac035d5b5c40afe5
Pages                     31842865337 · SUCCESS · exact runtime merge SHA
Safety pre                safety/pre-build79-album-publish-truth-20260814-2300
Safety post-deploy        safety/post-build79-deployed-candidate-20260814-2333
Real-user browser smoke   PENDING
```

Both failed Studio CI attempts were corrected before merge. No failed head was merged or deployed.

## Required browser smoke

Do not mark Build79 accepted until the user tests it.

Recommended smoke:

1. hard refresh Studio;
2. open the Album that previously reproduced the issue (`Pulse Dominion` if still suitable);
3. request `Draft → Published`;
4. if publication is blocked, the Album must remain canonically truthful and Studio must display the exact blocker(s) visibly;
5. if all quality checks are satisfied, both canonical Album header and form must reread `PUBLISHED` before Studio shows success;
6. an error must not disappear merely because the canonical reread itself succeeds;
7. public fallback must remain unable to perform or verify the protected write.

If clean, explicit acceptance phrase can be:

```text
@GitHub BUILD79 PASS
```

After PASS:

- mark Build79 REAL USER PASS;
- create post-RUP safety checkpoint;
- update current roadmap/handoff/changelog from candidate → accepted;
- annotate PR #119 with RUP receipt;
- only then treat Build79 as the new accepted Studio baseline.

## Frozen architecture

- GitHub = application-code authority.
- Cloudflare R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private cockpit/orchestrator, never a generic R2 writer.
- LaunchPAD = public listener UX.
- SonicTrace = audio intelligence.
- LRC Maker = lyrics synchronization.
- canonical `trackId` = R2 slug everywhere.
- public fallback is read-only and never verifies canonical writes.

### Canonical Albums

```text
albums/<album-id>/manifest.json
```

Ordered `album.trackIds` is sole membership/order authority. Track-side Album metadata is compatibility cache only.

### Canonical lyrics

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronization authority
.lrc                      = optional export / compatibility only
```

## Accepted program lineage underneath Build79

```text
Phase 7-A   Build46   REAL USER PASS
Phase 7-B   Build51   REAL USER PASS
Phase 7-C   Build71   Slice1 REAL USER PASS
Phase 7-C   Build73   Slice2 + program REAL USER PASS
Phase 8     Build74   Content Health Truth REAL USER PASS
Phase 8     Build75   Health Drill-down REAL USER PASS
```

Builds76–79 are the subsequent Album Health / Album publication lineage. Until Build79 browser PASS, Build75 remains the accepted Studio baseline.

## Later roadmap

### Phase 8

Continue only after Build79 smoke/acceptance and a fresh real-code audit. Do not create a second dashboard, second queue, second Album authority, or duplicate `workflow.nextAction`.

### Phase 9 — Security / reliability / PWA

Access/CORS hardening, retries/timeouts, anti-loss behavior, degraded/offline UX and PWA resilience.

### Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

### Premium interaction feel — rolling backlog

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that hides state or slows work.

### Focused backlog retained

- wording audit: `Sound` → `Sonic` where still relevant;
- reproduce/fix the asset-selection error observed on `Magnetic Midnight` if still present;
- keep provider/prompt semantics understandable and remove provider controls that do not materially change behavior/output.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE8-BUILD79.md`
- `changelogs/CHANGELOG-PHASE8-BUILD75.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**TM v5.23 / bridge1.13 is deployed. Studio Build79 is merged and deployed, but is NOT REAL USER PASS yet. Browser-smoke the Album publish path before allocating further runtime work.**
