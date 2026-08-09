# SHINOBIWAN Studio — Post-Phase-6 Hardening

Date: `2026-08-09`

Status: **COMPLETE — MAINTENANCE / HARDENING — NOT PHASE 7**

## Purpose

This milestone followed the completed and production-validated Phase 6. It addressed the final read-only audit warnings without reopening Phase 6 architecture or starting Phase 7.

The audit verdict was **PASS WITH WARNINGS**. No active second lyrics source, iframe, Phase 7 leak or private Track Manager security regression was found.

## Step 0 — LaunchPAD Track DNA release-date hotfix

The user-visible `Date TBD` issue was fixed before the cross-repository hardening work.

Root cause:

- the public catalog normalizer already returns `releaseDate` as a normalized ISO value;
- Home Track DNA appended another `T00:00:00` before constructing `Date`;
- a value such as `2026-08-09T00:00:00.000Z` became invalid `...ZT00:00:00` and fell back to `Date TBD`;
- track-detail and Track Manager were already reading the correct canonical release date.

Delivered release:

```text
LaunchPAD Build 2026.08.09.67
release post-phase6-track-dna-release-date-20260809
PR #168
merge 20674c774e172b85c1468e480621391057d70754
GitHub Pages run 31311437062 — success
```

The formatter now parses the normalized value directly. Regression coverage includes both `YYYY-MM-DD` and full normalized ISO input.

No Worker deployment, R2 write or catalog rebuild was performed for this public UI hotfix.

## Hardening delivery

### LRC Maker 6.3.5

Delivered through PR `#13`.

```text
merge 3d7f65fbe023e6ac26f3ba93fdcc98a135023a98
Pages deploy 31312507411 — success
```

No synchronization UX change was introduced.

The critical Space transition is now behaviorally tested:

```text
selected line N
  -> timestamp current time on N
  -> select exactly N+1
```

The reducer guard verifies:

- previous state is not mutated;
- line N-1 remains unchanged;
- line N receives the timestamp;
- line N+1 is not accidentally overwritten;
- selection advances exactly one line;
- final-line selection clamps safely.

The Studio-context guard also isolates mouse handlers and protects:

```text
simple click  -> selection only / no seek
double-click  -> explicit seek path
```

The historical `guard` export used by the audio module remains compatibility-preserved while the tested transition logic lives in a pure module.

### LaunchPAD / Track Manager docs + test hardening

Delivered through PR `#169`.

```text
merge 0e508c893c038059da4a563365dbdba7094b638d
GitHub Pages 31312541929 — success
```

Changes:

- deployment topology updated to Build 67 + Track Manager v5.15 / bridge v1.7;
- Cloudflare operations documentation updated to the actually deployed Phase 6 backend;
- Lyrics synchronization contract updated from candidate language to production state;
- ambiguous Range wording that could imply simple-click seeking removed;
- cross-repository integration contract rewritten as the current authoritative contract;
- stale contradiction allowing optional `.lrc` to earn `Synced Lyrics` Content Health points removed;
- protected-media Range regression test now deletes its generated temporary Worker artifact in `finally`.

No Track Manager Worker runtime source/version changed. No Worker deployment was required.

### Studio 0.9.6 / Build 21

Delivered through PR `#22`.

```text
merge 763de31b183159989c50706e10331d9581ac460d
GitHub Pages 31312561358 — success
```

Build 21:

- pins embedded LRC Maker `6.3.5`;
- updates Phase 6 regression guards for the 6.3.5 producer;
- updates Integration Safety to current production facts;
- updates the Phase 6 final checkpoint document to factual completed/verified state;
- updates README, CHANGELOG and release metadata;
- preserves all Phase 6 product behavior.

## Canonical Lyrics contract — re-frozen

```text
tracks/<slug>/lyrics.txt = ONLY canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

An `.lrc` sidecar:

- cannot establish synchronized state;
- cannot add Content Health points;
- cannot override canonical TXT;
- must be derived if a future compatibility export writes one.

## Production boundaries retained

```text
Track Manager v5.15 / Studio bridge v1.7
public media Worker v2.6
SonicTrace Phase 5 persistence unchanged
manifest schema v1 unchanged
R2 layout unchanged
```

No deliberate R2 production write was performed for this hardening milestone.

## Safety snapshots

Pre-hardening snapshots:

```text
LaunchPAD-APP
  safety/pre-post-phase6-hardening-build67-20260809-1342

shinobiwan-studio
  safety/pre-post-phase6-hardening-20260809-1342

lrc-maker
  safety/pre-post-phase6-hardening-20260809-1342
```

The immutable Phase 6 checkpoint remains untouched:

```text
safety/phase6-complete-20260809-0513
```

Final post-hardening checkpoint name:

```text
safety/post-phase6-hardening-complete-20260809-1409
```

LaunchPAD-APP and LRC Maker checkpoints were created on their final hardening heads before this documentation-only closeout. The same checkpoint is created on Studio after this closeout merge, so each repository points to its own final hardening head.

## Deferred debt — deliberately not touched

The audit also noted older dead/legacy Gist-related source and fragile historical Worker-version assembly mechanisms.

They were **not** removed/refactored in this milestone because they are not active Phase 6 regressions and expanding the maintenance surface would add unnecessary risk. They require separate explicit refactors if ever prioritized.

## Exit criteria — result

1. LRC Maker 6.3.5 CI/build: **PASS**; deployed: **YES**.
2. LaunchPAD hardening CI: **PASS**; merged: **YES**; Worker redeploy: **NO**.
3. Studio 0.9.6 Build 21 CI: **PASS**; deployed after LRC Maker 6.3.5: **YES**.
4. Post-hardening safety checkpoint: **created on LaunchPAD/LRC and completed on Studio after this closeout merge**.
5. Phase 7: **NOT STARTED**.

## STOP

**PHASE 7 STATUS: NOT STARTED.**

Do not implement, scaffold, branch, prepare or deploy Phase 7 without explicit user authorization.
