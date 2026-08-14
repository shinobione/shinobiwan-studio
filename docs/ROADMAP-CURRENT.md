# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-15 after **Build80 REAL USER PASS**.

This file is the current roadmap authority. Historical implementation detail belongs in `../changelogs/` and milestone-specific docs.

## Current state

```text
Studio accepted          v0.19.3 · Build80 · REAL USER PASS
Phase 7-A                Build46 · REAL USER PASS
Phase 7-B                Build51 · REAL USER PASS
Phase 7-C Slice1         Build71 · REAL USER PASS
Phase 7-C Slice2/program Build73 · REAL USER PASS / COMPLETE
Phase 8 Slice1           Build74 · Content Health Truth · REAL USER PASS
Phase 8 Slice2           Build75 · Health Drill-down · REAL USER PASS
Phase 8 Album lineage    Builds76→80 · accepted cumulatively via Build80
Track Manager            v5.23 · DEPLOYED
Studio bridge            v1.13
TM admin Worker          439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 · unchanged
LaunchPAD public         2026.08.12.102 · REAL USER PASS
SonicTrace               V2-E Build08 · REAL USER PASS
Deep Audio               2.0.3-alpha
LRC Maker                6.3.8
Next build               Build81 · UNUSED
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.

## Immediate gate

Build80 is now the accepted Studio baseline.

Before any Build81 runtime mutation:

1. reread real GitHub state;
2. audit the next genuine Phase8 gap;
3. prove it does not duplicate Content Health, Workflow drill-down, Album Health, C3-B Intelligence or `workflow.nextAction`;
4. create a fresh safety checkpoint from accepted `main`;
5. preserve exact-head CI → anti-drift → exact merge-SHA deployment → real-user smoke.

Do not invent another dashboard, queue, Album authority, priority model or generic writer.

## Phase 8 Album lineage — accepted cumulatively via Build80

```text
Build76  Album Health truth · functional candidate
Build77  Album Health visual polish · candidate
Build78  humanized Track-side Album mismatch UX · candidate
Build79  Album publication truth + exact blockers · deployed candidate / superseded
Build80  duration-evidence successor compatibility · REAL USER PASS
```

Historical candidates remain historical evidence; they are not retroactively relabeled as accepted.

### What Build79 established

Album publication now preserves the backend quality truth and exposes exact human blockers. A canonical Album can be Published only when the existing Track Manager quality checks pass, including:

- title present;
- canonical `album.trackIds` non-empty;
- Album cover present;
- every `trackId` resolves;
- every member Track is itself `published`.

Studio now:

- preserves Worker `quality` details;
- renders named blockers such as a member Track still Draft;
- compares every requested Album metadata field to canonical reread;
- treats requested `Published` / canonical `Draft` as a hard verification failure;
- keeps failure messages visible after canonical reload;
- shows green success only after canonical verification.

TM v5.23 / bridge v1.13 adds strict server-side metadata reread equality and rollback verification without adding a second writer or a new Album publication route.

### What Build80 closed

The Build79 smoke correctly told the user that `Neon Swagger` had to be Published before `Pulse Dominion`. Following that instruction exposed an obsolete Studio client pin: duration-aware metadata still accepted only TM v5.22 / bridge1.12, rejecting the deployed compatible v5.23 / 1.13.

Build80 replaces that exact predecessor pin with a bounded compatibility allowlist:

```text
5.22 / 1.12
5.23 / 1.13
```

Unknown future pairs remain locked. No generic semver `>=` rule is used.

### Exact accepted receipts

```text
TM PR                    LaunchPAD #237
TM tested head           a1fe4c8dd0df78d0dbb2bde418ccaed294290266
TM merge                 bc82fea12edc7cbd1b7b054c697a553694e76322
Admin deploy             31842482166 · SUCCESS · target=admin
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker deploy     SKIPPED
TM safety pre            safety/pre-tm523-album-publish-truth-20260814-2300

Build79 PR               #119
Build79 tested head      13e29763e2cced348057814c28f0623b5def3444
Build79 final CI         31842783733 · SUCCESS
Build79 runtime merge    128b5c4397cb6f3b8e9eda7cac035d5b5c40afe5
Build79 Pages            31842865337 · SUCCESS
Build79 smoke            NOT PASS · exposed v5.22-only duration-evidence pin

Build80 safety pre       safety/pre-build80-duration-evidence-successor-compat-20260814-2358
Build80 PR               #121
Build80 tested head      3cb58fe4e108cb932a3a76474a9a00ca29724db9
Build80 CI               31845088922 · SUCCESS
Build80 runtime merge    1bb775596dc0f7a9e1c06956097793299064b976
Build80 Pages            31845175630 · SUCCESS · exact runtime merge SHA
Build80 smoke            PASS · 2026-08-15
Smoke proof              Neon Swagger Published → Pulse Dominion Published
Build80 safety post-RUP  safety/post-build80-real-user-pass-20260815-0057
```

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

- ordered `album.trackIds` is sole Album membership/artistic-order authority;
- Track-side `album` metadata is compatibility cache only;
- generic Track metadata writes must not independently mutate Album membership;
- Album publication uses the protected Track Manager quality gate.

## Canonical lyrics contract

```text
tracks/<slug>/lyrics.txt = unique canonical lyrics source
recognized timestamps    = synchronized lyrics
.lrc                      = optional export / compatibility only
```

## Canonical audio-duration contract

`manifest.duration` remains a derived canonical fact from the current master audio. Duration evidence is accepted only through explicitly compatible guarded Track Manager bridge pairs. It is never a manual metadata field.

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

Home, Tracks, Workflow, Track Workspace and Phase8 health surfaces reuse the same `workflow.nextAction` authority.

## Later roadmap

### Phase 8 — next bounded audit

Build80 closes the current Album Health/publication corrective lineage. The next Phase8 scope must begin with a real-code audit and add a capability not already covered by:

- Build74 Content Health Truth;
- Build75 Health Drill-down;
- Builds76→80 Album Health/publication truth;
- C3-B SonicTrace catalog/project intelligence;
- Phase7 `workflow.nextAction`.

Prefer read-only capability unless a concrete requirement proves a guarded write is necessary.

### Phase 9 — Security / reliability / PWA

- Access/CORS hardening;
- retries/timeouts;
- anti-loss and ambiguous-write behavior;
- degraded/offline UX;
- PWA resilience and update behavior.

### Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Rolling premium interaction backlog

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

## Focused product backlog retained

- wording audit: `Sound` → `Sonic` where still relevant;
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
- Builds76–79 = Album Health/publication candidate lineage.
- Build80 = accepted cumulative Album Health/publication runtime.
- Build81 = unused.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE8-BUILD80.md`
- `changelogs/CHANGELOG-PHASE8-BUILD79.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Studio Build80 is REAL USER PASS and is the accepted baseline. TM v5.23 / bridge1.13 is deployed. Build81 is unused: audit first, then scope, then safety branch, then runtime.**
