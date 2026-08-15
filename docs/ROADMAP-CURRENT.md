# SHINOBIWAN STUDIO — CURRENT ROADMAP

Updated: 2026-08-15 during **Build82 Phase9 Slice1 candidate**.

This file is the current roadmap authority. Historical implementation detail belongs in `../changelogs/` and milestone-specific docs.

## Current state

```text
Studio accepted          v0.19.3 · Build81 · REAL USER PASS
Studio candidate         v0.19.4 · Build82 · Phase9 Slice1
Phase 7-A                Build46 · REAL USER PASS
Phase 7-B                Build51 · REAL USER PASS
Phase 7-C Slice1         Build71 · REAL USER PASS
Phase 7-C Slice2/program Build73 · REAL USER PASS / COMPLETE
Phase 8 Slice1           Build74 · Content Health Truth · REAL USER PASS
Phase 8 Slice2           Build75 · Health Drill-down · REAL USER PASS
Phase 8 Album lineage    Builds76→80 · accepted cumulatively via Build80
Phase 8 semantic truth   Build81 · REAL USER PASS / closeout
Phase 9 Slice1           Build82 · destructive-write ambiguity guard · CANDIDATE
Track Manager            v5.23 · DEPLOYED
Studio bridge            v1.13
TM admin Worker          439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker            v2.7 · unchanged
LaunchPAD public         2026.08.12.102 · REAL USER PASS
SonicTrace               V2-E Build08 · REAL USER PASS
Deep Audio               2.0.3-alpha
LRC Maker                6.3.8
```

`CI GREEN != DEPLOYED CANDIDATE != REAL USER PASS` remains mandatory.

## Immediate gate

Build81 remains the accepted Studio baseline until Build82 passes exact-head CI, exact merge-SHA deployment and explicit real-user smoke.

Build82 opens Phase9 with a bounded reliability slice. It must not expand into a generic retry framework or a second write authority.

## Phase 8 — closed accepted capability set

Accepted Phase8 lineage:

```text
Build74  Content Health Truth                             REAL USER PASS
Build75  Health Drill-down                                REAL USER PASS
Build76  Album Health truth                               historical candidate
Build77  Album Health visual polish                       historical candidate
Build78  humanized Track-side Album mismatch              historical candidate
Build79  Album publication truth                          historical candidate
Build80  duration-evidence successor corrective           REAL USER PASS cumulative baseline
Build81  Sonic/provider semantic truth cleanup             REAL USER PASS / Phase8 closeout
```

The retained Magnetic Midnight palette-fetch backlog was re-audited after Build81. Git history proves the historical public-cover `Failed to fetch` was already fixed in Build62 and is protected by the inherited Build62 guard. No Build82 duplicate fix is warranted.

Do not add another dashboard, queue, Album authority, priority engine or generic Studio writer under Phase8.

## Phase 9 — Security / reliability / PWA

### Slice1 · Build82 candidate — destructive write ambiguity

The first active reliability gap is response-loss ambiguity on destructive asset deletion.

Build82 applies this contract to **Track asset delete** and **Album asset delete** only:

```text
pre-write private canonical revision + asset state
→ existing guarded delete
→ response lost / timeout
→ NO automatic retry
→ private canonical reread
   ├─ new revision + asset absent     = committed / verified
   ├─ same revision + asset present   = not committed / explicit retry can be safe
   ├─ changed but causality unclear   = ambiguous / do not retry
   └─ reread unavailable              = unverified / do not retry
```

A normal success response also requires exact post-write revision plus asset-absence verification.

No Worker/backend/R2 migration is part of Build82.

### Follow-up audit after Build82

Do not pre-allocate Build83. Re-audit the remaining reliability gaps first. Current candidates discovered during the Build82 audit include transport-loss ambiguity on:

- canonical lyrics save;
- SonicTrace analysis save;
- broader Album write families.

Choose the smallest coherent next slice only after Build82 acceptance.

Other Phase9 roadmap themes remain:

- Access/CORS hardening;
- bounded retries/timeouts for safe reads only;
- anti-loss / ambiguous-write behavior;
- degraded/offline UX;
- PWA resilience and update behavior.

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

Home, Tracks, Workflow, Track Workspace and health surfaces reuse the same `workflow.nextAction` authority.

## Phase 10 — Progressive extraction

Potential extraction of mature LRC/SonicTrace/catalog engines while Studio remains orchestrator.

There is currently no official Phase 11.

## Rolling premium interaction backlog

- tactile press/release feedback;
- restrained glow/focus transitions;
- coherent hover/active states;
- smooth panel/tab transitions;
- reduced-motion-safe animation;
- no decorative motion that obscures state or slows work.

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
- Build81 = Phase8 semantic truth cleanup REAL USER PASS.
- Build82 = Phase9 Slice1 candidate; not accepted until browser PASS.

## Files to read before next mutation

- `README.md`
- `docs/ROADMAP-CURRENT.md`
- `docs/NEXT-SESSION-HANDOFF.md`
- `docs/PHASE-9-SLICE1-DESTRUCTIVE-WRITE-AUDIT.md`
- `changelogs/CHANGELOG-PHASE9-BUILD82.md`
- `docs/INTEGRATION_SAFETY.md`

## Stop line

**Build81 remains the accepted REAL USER PASS baseline. Build82 is Phase9 Slice1 candidate only until exact CI/deploy and explicit browser PASS.**
