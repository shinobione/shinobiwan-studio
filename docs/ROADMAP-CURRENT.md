# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-14 after **TM v5.23 deployment + Studio Build79 deployed candidate**.

This file is the **current roadmap authority**. Historical implementation detail belongs in [`../changelogs/`](../changelogs/README.md) and milestone-specific docs.

## Current state

```text
Studio accepted baseline   v0.19.3 · Build75 · REAL USER PASS
Studio current candidate   v0.19.3 · Build79 · DEPLOYED CANDIDATE · browser smoke pending
Phase 7-A                  Build46 · REAL USER PASS
Phase 7-B                  Build51 · REAL USER PASS
Phase 7-C Slice1           Build71 · REAL USER PASS
Phase 7-C Slice2/program   Build73 · REAL USER PASS / COMPLETE
Phase 8 Slice1             Build74 · Content Health Truth · REAL USER PASS
Phase 8 Slice2             Build75 · Health Drill-down · REAL USER PASS
Build76                    Album Health functional candidate · NOT RUP
Build77                    Album Health visual candidate · superseded
Build78                    Album Health comprehension candidate · superseded by Build79
Build79                    Album publish truth corrective · DEPLOYED CANDIDATE
Track Manager              v5.23 · DEPLOYED
Studio bridge              v1.13
TM admin Worker            439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker              v2.7 · unchanged
LaunchPAD public           2026.08.12.102 · REAL USER PASS
SonicTrace                 V2-E Build08 · REAL USER PASS
Deep Audio                 2.0.3-alpha
LRC Maker                  6.3.8
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS`.

## Immediate gate

**Do not allocate further runtime work until Build79 browser smoke is complete.**

Build75 remains the last accepted Studio baseline until explicit user acceptance of Build79.

Required Build79 browser smoke:

1. hard refresh Studio;
2. open the Album that reproduced the issue (`Pulse Dominion` if still appropriate);
3. request `Draft → Published`;
4. if publication is blocked, Studio must display exact human blocker(s) and keep canonical status truthful;
5. if all publication checks pass, canonical Album header + form must reread `PUBLISHED` before green success appears;
6. an error must survive the canonical reread instead of disappearing;
7. public fallback must remain unable to write or verify the protected write.

If clean, explicit acceptance can be recorded as:

```text
@GitHub BUILD79 PASS
```

After PASS:

- promote Build79 to REAL USER PASS;
- create a post-RUP safety checkpoint;
- update docs candidate → accepted;
- annotate Studio PR #119 with acceptance receipt;
- only then continue Phase8 or later roadmap work.

## Current corrective — Build79 Album publish truth

A real browser test exposed this false-success path:

```text
Draft → Published requested
→ revision advanced
→ Studio showed success
→ canonical Album still Draft
→ form reset to Draft
→ blocker vanished
```

Build79 fixes the Studio side:

- Worker `quality` payload is preserved;
- human blockers are rendered for missing cover, empty tracklist, broken Track refs, or member Tracks not Published;
- every requested Album metadata field is compared to canonical reread;
- requested `published` / canonical `draft` is a hard verification failure;
- failure messages are restored after canonical reload;
- green success appears only after exact canonical verification.

TM v5.23 / bridge v1.13 fixes the backend side:

- existing Album publication quality gate is unchanged;
- strict metadata reread equality is required before success;
- verification mismatch triggers rollback;
- `verificationDetail` is returned on rollback;
- no new Album write route exists;
- Public Worker remains unchanged.

### Exact Build79 / TM5.23 receipts

```text
TM PR                    LaunchPAD #237
TM tested head           a1fe4c8dd0df78d0dbb2bde418ccaed294290266
TM validation            31841695779 · SUCCESS
Workers validation       31841695805 · SUCCESS
Overflow validation      31841695814 · SUCCESS
TM merge                 bc82fea12edc7cbd1b7b054c697a553694e76322
Admin deploy             31842482166 · SUCCESS · target=admin
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker deploy     SKIPPED
TM safety pre            safety/pre-tm523-album-publish-truth-20260814-2300

Studio PR                #119
Initial CI               31842069225 · FAILURE · inherited Build64 backend-version literal
Second CI                31842657314 · FAILURE · strict TypeScript dynamic-key indexing
Final tested head        13e29763e2cced348057814c28f0623b5def3444
Final CI                 31842783733 · SUCCESS
Runtime merge            128b5c4397cb6f3b8e9eda7cac035d5b5c40afe5
Pages                    31842865337 · SUCCESS · exact runtime merge SHA
Studio safety pre        safety/pre-build79-album-publish-truth-20260814-2300
Studio safety post       safety/post-build79-deployed-candidate-20260814-2333
Real-user smoke          PENDING
```

No failed Studio head was merged or deployed.

## Frozen architecture

- GitHub = application-code authority.
- Cloudflare R2 = canonical catalog/media/data authority.
- Track Manager = protected canonical write authority.
- Studio = private artist cockpit/orchestrator, never a generic R2 writer.
- LaunchPAD = public listener experience.
- SonicTrace = audio-intelligence engine.
- LRC Maker = lyrics synchronization engine.
- canonical `trackId` = R2 slug everywhere.
- public fallback is read-only and never verifies canonical writes.
- no second Album authority, no second queue, no second workflow-priority engine.

## Canonical Album contract

```text
albums/<album-id>/manifest.json
```

Rules:

- ordered `album.trackIds` is sole Album membership/artistic-order authority;
- Track-side `album` metadata is compatibility cache only;
- generic Track metadata writes must not independently mutate Album membership;
- Album publication uses the protected Track Manager quality gate.

Current Album publication checks include:

- Album title present;
- non-empty canonical tracklist;
- Album cover present;
- every `trackId` resolves;
- every member Track is `published`.

## Canonical lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export / compatibility only
```

## Phase 7-B receipt authority — preserved

```text
lrc-maker        + lyrics-saved      → canonical-write
sonictrace       + analysis-saved    → canonical-write
release-campaign + campaign-exported → review-only
```

Canonical-write verification requires exact current `trackId`, allowlisted source/operation/effect, private canonical Track Manager reread, same returned ID, operation-specific evidence and stale protection.

Public fallback never verifies a canonical write.

## Phase 7-C — COMPLETE

Accepted workflow authority:

```text
Identity → Core media → Lyrics → Intelligence → Release
```

Accepted state truth:

```text
Visuals ready = canonical cover present
Canvas        = optional
Lyrics ready  = canonical lyrics.txt + recognized timestamps
TXT only      = attention / Timing needed
```

Home, Tracks, Workflow, Track Workspace and Phase8 health surfaces must reuse the same `workflow.nextAction` authority.

## Phase 8 — current program state

### Slice 1 — Content Health Truth · Build74 · ACCEPTED

Read-only global production health without a second workflow or write authority.

### Slice 2 — Health Drill-down · Build75 · ACCEPTED

Global health counts drill into the existing Workflow queue and existing Next Action model.

### Album Health lineage · Builds76–79

```text
Build76  functional Album Health truth candidate
Build77  visual polish candidate
Build78  humanized metadata-mismatch UX candidate
Build79  Album publish truth corrective · current deployed candidate
```

Builds76–78 remain historical candidates, not retroactive RUPs.

After Build79 acceptance, the next Phase8 sub-scope must begin with a fresh code audit. Do not create:

- another dashboard that restates Build74/75;
- another queue;
- another Album ownership model;
- another Next Action priority engine;
- a generic Studio writer.

Prefer read-only capability unless a concrete requirement proves a guarded write is necessary.

## Phase 9 — Security / reliability / PWA

Planned themes:

- Access/CORS hardening;
- retries/timeouts;
- anti-loss / ambiguous-write behavior;
- degraded/offline UX;
- PWA resilience and update behavior.

## Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains the orchestrator and canonical authority boundaries stay unchanged.

There is currently **no official Phase 11**.

## Native Release Campaign — preserved contract

```text
Canonical Track context
        ↓
MASTER FINAL 16:9
        ├── 1:1 generated independently from MASTER
        └── 9:16 generated independently from MASTER
```

Rules:

- 9:16 never derives from 1:1;
- drafts remain browser-local until separately authorized persistence exists;
- `New MASTER concept` is non-destructive;
- provider choice must be semantically meaningful, not decorative;
- Google Flow remains a convenience handoff;
- ZIP export is review-only;
- `canonicalWrite: false` remains true.

## Rolling premium interaction backlog

Retain for future bounded polish:

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

## Focused product backlog retained

- wording audit: replace `Sound` with `Sonic` where the product meaning is Sonic/audio intelligence;
- reproduce/fix the asset-selection error observed on `Magnetic Midnight` if still present;
- keep provider/prompt semantics understandable;
- remove provider controls that do not materially change prompt/output behavior.

## Historical numbering discipline

- Build62 = Studio Focus closeout REAL USER PASS.
- Build63 = superseded; never reuse.
- Build64 = deployed candidate / FAILED REAL USER SMOKE.
- Builds65–66 = corrective lineage superseded by Build67.
- Build67 = Foundation Regression Repair REAL USER PASS.
- Build68 = Home lead priority REAL USER PASS.
- Build69–71 = Phase7-C Slice1 lineage; Build71 accepted.
- Build72–73 = Phase7-C Slice2 lineage; Build73 accepted/program closeout.
- Build74 = Phase8 Content Health Truth accepted.
- Build75 = Phase8 Health Drill-down accepted.
- Build76 = Album Health functional candidate.
- Build77 = Album Health visual candidate.
- Build78 = Album Health comprehension candidate, superseded by Build79.
- Build79 = Album publish truth deployed candidate, smoke pending.

Historical candidates are preserved rather than relabeled as accepted.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE8-BUILD79.md`
- `changelogs/CHANGELOG-PHASE8-BUILD75.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**TM v5.23 / bridge1.13 is deployed. Studio Build79 is merged and deployed, but is NOT REAL USER PASS yet. Browser-smoke Album publication before any further runtime scope is allocated.**
