# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-15 after **Build81 REAL USER PASS**.

This file is the current roadmap authority. Historical implementation detail belongs in `../changelogs/` and milestone-specific docs.

## Current state

```text
Studio accepted          v0.19.3 · Build81 · REAL USER PASS
Phase 7-A                Build46 · REAL USER PASS
Phase 7-B                Build51 · REAL USER PASS
Phase 7-C Slice1         Build71 · REAL USER PASS
Phase 7-C Slice2/program Build73 · REAL USER PASS / COMPLETE
Phase 8 Slice1           Build74 · Content Health Truth · REAL USER PASS
Phase 8 Slice2           Build75 · Health Drill-down · REAL USER PASS
Phase 8 Album lineage    Builds76→80 · accepted cumulatively via Build80
Phase 8 semantic truth   Build81 · REAL USER PASS
Track Manager            v5.23 · DEPLOYED
Studio bridge            v1.13
TM admin Worker          439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 · unchanged
LaunchPAD public         2026.08.12.102 · REAL USER PASS
SonicTrace               V2-E Build08 · REAL USER PASS
Deep Audio               2.0.3-alpha
LRC Maker                6.3.8
Next build               Build82 · UNUSED
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.

## Immediate gate

Build81 is now the accepted Studio baseline.

Before any Build82 runtime mutation:

1. reread real GitHub state;
2. reproduce/audit a genuine remaining gap;
3. prove the change does not duplicate Content Health, Workflow drill-down, Album Health, C3-B Intelligence or `workflow.nextAction`;
4. create a fresh safety checkpoint from accepted `main`;
5. preserve exact-head CI → anti-drift → exact merge-SHA deployment → real-user smoke.

Do not invent another dashboard, queue, Album authority, priority model or generic writer.

## Phase 8 accepted lineage

```text
Build74  Content Health Truth                         REAL USER PASS
Build75  Health Drill-down                            REAL USER PASS
Build76  Album Health truth                           candidate
Build77  Album Health visual polish                   candidate
Build78  humanized Track-side Album mismatch UX      candidate
Build79  Album publication truth                      candidate
Build80  cumulative Album Health/publication fix     REAL USER PASS
Build81  semantic truth cleanup                       REAL USER PASS
```

Historical candidates remain historical evidence; they are not retroactively relabelled accepted.

### Build80 cumulative Album baseline

Build80 is the accepted cumulative runtime for the Builds76→80 Album Health/publication lineage.

Accepted Album truth includes:

- canonical `album.trackIds` remains sole membership/order authority;
- Album health can expose missing cover, empty tracklist, unresolved Track references and member production gaps;
- Track-side Album cache mismatch is humanized as Track metadata out-of-sync rather than an Album membership failure;
- Album publication preserves exact Track Manager quality blockers;
- requested Album metadata is verified against canonical reread;
- TM v5.23 / bridge1.13 is explicitly allowed for the preserved duration-evidence contract;
- unknown future bridge pairs remain locked.

### Build81 semantic truth closeout

Build81 closes two focused false-signals found by fresh code audit:

1. SonicTrace/audio-intelligence stage wording `Sound` → `Sonic`.
2. decorative Release Campaign `Premium provider` selector removed because provider selection never changed prompt semantics.

Accepted Build81 behavior:

- Track progression uses `Sonic`;
- full analysis uses `TRACK / SONIC`;
- Release Campaign states `PROVIDER-AGNOSTIC`;
- Google Flow remains a convenience shortcut only;
- MASTER/1:1/9:16/motion prompts remain provider-agnostic;
- browser-local campaign drafts continue to restore prompts/assets/copy;
- campaign export remains review-only with `canonicalWrite: false`;
- no Worker/backend/R2 change.

Exact Build81 receipts:

```text
Safety pre               safety/pre-build81-semantic-truth-20260815-0113
Studio PR                #123
Exact tested head        bdc79b8dd3fffb41c8368990d50fd733afe87fe3
Validation               31850313391 · SUCCESS
Runtime merge            20d587fe1b1d1a5405cd346571c8d5a0eb1d2fa4
Runtime Pages            31850382728 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build81-deployed-candidate-20260815-0129
Candidate docs PR        #124
Candidate docs merge     b151eadcec376f8bbebc0378f7e51d92c62b0a31
Candidate docs Pages     31850596471 · SUCCESS
Real-user smoke          BUILD81 PASS · 2026-08-15
Safety post-RUP          safety/post-build81-real-user-pass-20260815-0159
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE
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

## Next bounded audit — Build82 not allocated

The first remaining focused product issue is:

### Magnetic Midnight asset-selection error

Status: **UNRESOLVED / MUST REPRODUCE FIRST**.

Before any fix:

- reproduce the exact asset-selection failure on `Magnetic Midnight`;
- identify which surface is involved: canonical Visual assets, Release Campaign browser-local imports, or another flow;
- capture the visible error and exact runtime path;
- determine whether the failure is input validation, browser-local storage, file decoding/dimensions, Track Manager asset write, stale revision, or another bounded cause;
- do not widen write authority or mutate canonical R2 while diagnosing.

Only after reproduction should Build82 be scoped.

## Rolling premium interaction backlog

Retained for a later bounded polish slice:

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

## Later roadmap

### Phase 9 — Security / reliability / PWA

- Access/CORS hardening;
- retries/timeouts;
- anti-loss and ambiguous-write behavior;
- degraded/offline UX;
- PWA resilience and update behavior.

### Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

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
- Build81 = semantic truth cleanup REAL USER PASS.
- Build82 = unused.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `changelogs/CHANGELOG-PHASE8-BUILD81.md`
- `changelogs/CHANGELOG-PHASE8-BUILD80.md`
- `docs/PHASE-7-C-GUIDED-ACTIONS-CONTRACT.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Studio Build81 is REAL USER PASS and is the accepted baseline. TM v5.23 / bridge1.13 is deployed. Build82 is unused: reproduce the next real issue before mutation.**
