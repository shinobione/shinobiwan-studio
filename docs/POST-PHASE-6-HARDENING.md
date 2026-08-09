# SHINOBIWAN Studio — Post-Phase-6 Hardening

Date: `2026-08-09`

Status: **MAINTENANCE / HARDENING — NOT PHASE 7**

## Purpose

This milestone follows the completed and production-validated Phase 6. It addresses the final read-only audit warnings without reopening Phase 6 architecture or starting Phase 7.

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

## Hardening scope

### LRC Maker 6.3.5

No synchronization UX change is introduced.

The critical Space transition is now behaviorally testable:

```text
selected line N
  -> timestamp current time on N
  -> select exactly N+1
```

The new reducer guard verifies:

- previous reducer state is not mutated;
- line N-1 remains unchanged;
- line N receives the timestamp;
- line N+1 is not accidentally overwritten;
- selection advances exactly one line;
- final-line selection clamps safely.

The Studio-context guard also isolates mouse handlers and proves:

```text
simple click   -> selection only / no seek
 double-click  -> explicit seek path
```

### LaunchPAD / Track Manager documentation and tests

The hardening branch:

- updates deployment topology to Build 67 + Track Manager v5.15 / bridge v1.7;
- updates Cloudflare operations documentation to the actually deployed Phase 6 backend;
- updates the Lyrics synchronization contract from candidate language to production state;
- removes the ambiguous Range-document wording that could imply simple-click seeking;
- rewrites the cross-repository integration contract as the current authoritative contract;
- removes the historical contradiction that an optional `.lrc` sidecar could earn `Synced Lyrics` Content Health points;
- makes the protected-media Range regression test remove its generated temporary Worker artifact in `finally`.

No Track Manager runtime source or Worker contract version is changed by these hardening edits.

### Studio 0.9.6 / Build 21

Studio Build 21:

- pins embedded LRC Maker `6.3.5`;
- updates Phase 6 regression guards for the 6.3.5 producer;
- updates Integration Safety to current production facts;
- updates the Phase 6 final checkpoint document to factual completed/verified state;
- updates README/release metadata;
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

No deliberate R2 production write is required for this hardening milestone.

## Safety snapshots

Created before hardening:

```text
LaunchPAD-APP
  safety/pre-post-phase6-hardening-build67-20260809-1342

shinobiwan-studio
  safety/pre-post-phase6-hardening-20260809-1342

lrc-maker
  safety/pre-post-phase6-hardening-20260809-1342
```

The final Phase 6 checkpoint remains immutable:

```text
safety/phase6-complete-20260809-0513
```

## Deferred debt — deliberately not touched

The audit also noted older dead/legacy Gist-related source and fragile historical Worker-version assembly mechanisms.

They are **not** removed/refactored in this milestone because they are not active Phase 6 regressions and expanding the maintenance surface would add unnecessary risk. They require separate explicit refactors if ever prioritized.

## Exit criteria

This hardening milestone is complete only when:

1. LRC Maker 6.3.5 CI/build is green and deployed;
2. LaunchPAD hardening CI is green and merged with no Worker redeploy;
3. Studio 0.9.6 Build 21 CI is green and deployed after LRC Maker 6.3.5;
4. the new post-hardening safety checkpoint is created and verified on final heads;
5. Phase 7 remains untouched.

## STOP

**PHASE 7 STATUS: NOT STARTED.**

Do not implement, scaffold, branch, prepare or deploy Phase 7 without explicit user authorization.
