# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Release:** `0.10.2`

**Build:** `24`

**Codename:** `phase-ux-track-workspace`

**Milestone:** PHASE UX — UX-3 Track Workspace

**Stop line:** Do not begin Phase 7 without explicit authorization.

## PHASE UX — Build 24

Build 24 delivers the UX-3 Track Workspace and action-led Overview without changing any backend or Phase 4/5/6 engine contract.

- compacts and preserves track context with cover, title, release, status, readiness and saved cover palette;
- keeps five obvious local tools: Overview, Metadata, Assets, Lyrics and SonicTrace;
- redesigns Overview around readiness, concrete next actions, media state, music details, release and analysis;
- keeps Content Health strictly about completeness and moves raw source/revision information into secondary diagnostics;
- adds `aria-current` to local navigation and responsive sticky positioning for desktop, laptop, tablet and mobile;
- preserves Metadata, Assets, embedded/standalone Lyrics and SonicTrace integrations unchanged;
- adds a dedicated UX-3 regression guard for context, navigation, action hierarchy, responsive layout and engine availability;
- makes no Worker, R2, manifest, SonicTrace or LRC Maker runtime change.

See `docs/PHASE-UX.md` and `docs/PHASE-UX-AUDIT.md`.

## Product role

SHINOBIWAN Studio is the private orchestration cockpit for the SHINOBIWAN toolchain.

Frozen boundaries:

- `trackId = R2 manifest slug` everywhere;
- LaunchPAD stays the public product;
- Cloudflare R2 stays the catalog/media/analysis source of truth;
- Track Manager stays the protected R2 write/admin backend and standalone fallback;
- SonicTrace stays the audio-intelligence engine;
- LRC Maker stays the lyrics timing engine with standalone fallback;
- GitHub stays the code source of truth;
- Studio never becomes another catalog.

## Post-Phase-6 Hardening — Build 21

Build 21 is a **maintenance/hardening release**, not a new roadmap phase.

It follows the completed and production-validated Phase 6 checkpoint and resolves the warnings from the final read-only audit without changing the established product workflow.

### What Build 21 changes

- consumes **LRC Maker 6.3.5** in embedded Lyrics Studio;
- preserves the validated native timing UX: **simple click = select**, **double-click = explicit seek**, **Space = timestamp selected line then advance exactly one line**;
- benefits from LRC Maker's new behavioral reducer test rather than relying only on source-string guards;
- keeps the 11px useful-microcopy floor;
- updates Integration Safety and final-checkpoint documentation to the actual Phase 6 production state;
- records that the Phase 6 checkpoint already exists and was verified;
- keeps the canonical Lyrics contract explicit and unambiguous;
- preserves Track Manager v5.15 / bridge v1.7, SonicTrace Phase 5 persistence, R2 schemas and all existing Track Workspace features.

### What Build 21 does **not** change

- no new Track Manager endpoint;
- no Worker source/runtime version bump;
- no Worker deployment requirement;
- no R2 migration or deliberate production write;
- no manifest schema change;
- no `.lrc` persistence requirement;
- no SonicTrace runtime change;
- no LaunchPAD feature refactor;
- no Phase 7 implementation or scaffold.

See [`docs/POST-PHASE-6-HARDENING.md`](docs/POST-PHASE-6-HARDENING.md).

## LaunchPAD Build 67 maintenance dependency

Before this Studio hardening milestone, LaunchPAD received a separate public maintenance hotfix:

```text
LaunchPAD Build 2026.08.09.67
release post-phase6-track-dna-release-date-20260809
merge 20674c774e172b85c1468e480621391057d70754
GitHub Pages run 31311437062
```

The Home Track DNA release-date formatter now parses normalized catalog ISO dates directly instead of appending a second `T00:00:00` and incorrectly falling back to `Date TBD`.

That hotfix changed no R2 data and required no public/admin Worker deployment.

## Phase 6 — frozen validated baseline

Phase 6 remains **closed and production-validated**.

```text
Studio 0.9.5 / Build 20
runtime source SHA 38b47441a7c59181045000ebcc4fd86b2d1829b3
final closeout main SHA 00b4504779ec6220d97564965309ef7a9ef20887
runtime deploy workflow 31291318828
final closeout Pages workflow 31292085394

LRC Maker 6.3.4 validated baseline
source SHA 8bd3f3fd52acc1217a65216541c0b7e40fcab5ba
Pages deploy workflow 31291292303

Track Manager v5.15 / Studio bridge v1.7
Phase 6 backend SHA 23a7b494b89d4958f573f0889057b53a44aa23b6
admin deployment workflow 31288949405
```

Final immutable Phase 6 checkpoint:

```text
safety/phase6-complete-20260809-0513
```

That checkpoint remains untouched by Build 21 hardening.

See [`docs/PHASE-6-FINAL-CHECKPOINT.md`](docs/PHASE-6-FINAL-CHECKPOINT.md).

## Canonical Lyrics contract

This rule is non-negotiable:

```text
tracks/<slug>/lyrics.txt = only canonical lyrics source
recognized timestamps     = synchronized lyrics
.lrc                       = optional export/compatibility only
```

A missing `.lrc` does not mean lyrics are unsynchronized, and an optional `.lrc` can never contribute to Content Health.

The embedded and standalone LRC Maker modes use the same synchronization engine. Studio passes only minimal `trackId` context; protected audio and lyrics are loaded through Track Manager.

Canonical save remains guarded by:

- manifest `expectedUpdatedAt`;
- lyrics R2 ETag;
- strict timestamp/UTF-8 validation;
- Track Manager write authority;
- catalog update only where the existing contract requires it;
- canonical reread;
- compensating rollback on multi-object failure.

Canonical text equality normalizes only optional BOM removal plus `CRLF`/`CR` → `LF`. Real lyric differences remain blocking.

## Native LRC interaction

Final behavior shared by embedded and standalone modes:

1. **simple click** selects only;
2. **double-click** on a timestamped line repositions audio to that timestamp;
3. **Space** writes current audio time on the selected line and advances to the next line;
4. the next Space timestamps that newly selected line, never the line above.

The direct simple-click seek introduced experimentally in LRC Maker 6.3.2 remains retired.

## Phase 5 — SonicTrace / Catalog Intelligence

Phase 5 remains operational:

- canonical `SonicTraceAnalysis` sidecars;
- Browser DSP + local/GPU SonicTrace analysis;
- explicit review before save;
- `latest.json` + append-oriented history;
- canonical audio source revision/freshness;
- embedding 512D;
- similarity/clusters/comparison;
- no duplicate canonical WAV in analysis persistence.

See [`docs/PHASE-5-SONICTRACE-COMPLETE.md`](docs/PHASE-5-SONICTRACE-COMPLETE.md).

## Phase 4 — Track Manager integration

Principal Track Manager operations remain available from Studio:

- private-first catalog read with public fallback;
- canonical draft creation;
- metadata validate/save;
- canonical lyrics edit/save;
- asset upload/replace/delete for audio, cover, thumbnail, lyrics TXT and video;
- upload progress;
- stale guards and quality protection;
- explicit catalog rebuild;
- canonical reread and rollback;
- standalone Track Manager fallback.

Whole-track deletion is intentionally not exposed through Studio.

See [`docs/PHASE-4-COMPLETE.md`](docs/PHASE-4-COMPLETE.md).

## Current backend dependency

```text
Track Manager       v5.15
Studio bridge       v1.7
Phase 6 backend     23a7b494b89d4958f573f0889057b53a44aa23b6
deployment run      31288949405
deployment target   admin
Cloudflare Access   protected
public Worker       v2.6 unchanged
```

No Worker redeployment is required merely because Studio consumes LRC Maker 6.3.5.

## Security rules

- Cloudflare Access remains mandatory for the private bridge;
- exact Studio origin remains `https://shinobione.github.io`;
- no Access/R2 secrets ship to GitHub Pages;
- credentialed CORS never uses wildcard origin;
- JSON-like cross-origin mutation controls use the established `text/plain;charset=UTF-8` transport where required;
- file uploads use native multipart `FormData` without custom headers;
- no generic arbitrary cross-origin `saveTrack()` route is introduced;
- standalone Track Manager remains fallback;
- Shadow DOM isolates embedded LRC presentation but is not treated as a security boundary;
- no iframe is used for the final Lyrics integration.

See [`docs/INTEGRATION_SAFETY.md`](docs/INTEGRATION_SAFETY.md).

## Safety / rollback

Pre-hardening snapshots:

```text
Studio:        safety/pre-post-phase6-hardening-20260809-1342
LRC Maker:     safety/pre-post-phase6-hardening-20260809-1342
LaunchPAD-APP: safety/pre-post-phase6-hardening-build67-20260809-1342
```

The older final Phase 6 checkpoint remains the authoritative rollback point for the validated milestone itself.

## Verification policy

Studio Build 21 is protected by:

- private-read integration guards;
- Phase 5 algorithm guards;
- Phase 6 canonical Lyrics guards;
- LRC Maker 6.3.5 embed pin;
- no-iframe guard;
- Content Health timestamp-only synchronization guard;
- 11px readability floor;
- TypeScript;
- Vite production build;
- final Phase 6 production smoke history.

LRC Maker 6.3.5 additionally performs a real reducer transition test for `line N -> timestamp -> select N+1` and retains isolated simple-click/no-seek versus double-click/seek guards.

We do not mutate a real production WAV/cover/lyrics object merely to manufacture a maintenance smoke test.

## Phase 7 stop line

**PHASE 6 IS COMPLETE. POST-PHASE-6 HARDENING IS MAINTENANCE. STOP BEFORE PHASE 7.**

Do not implement, scaffold, prepare, branch, merge or deploy any Phase 7 item without a new explicit user authorization.

## Development

```bash
npm install
npm run dev
npm run check:private-read
npm run check:phase5
npm run check:phase6
npm run typecheck
npm run build
```

`npm run build` runs integration regression guards before TypeScript/Vite.

## Production URL

```text
https://shinobione.github.io/shinobiwan-studio/
```

## Versioning discipline

Every Studio release updates together:

1. `package.json`;
2. `src/release.ts`;
3. visible version/build/codename copy;
4. `CHANGELOG.md`;
5. README and affected docs;
6. security/integration regression guards;
7. PR dependency and rollback notes.

Source merge, web deployment, Worker deployment and R2/catalog mutation remain separate facts.
