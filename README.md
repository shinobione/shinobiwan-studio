# SHINOBIWAN Studio

Artist Content & Intelligence Manager.

**Release:** `0.10.9`

**Build:** `31`

**Codename:** `phase-ux-c2-5-a-lrc-638`

**Milestone:** PHASE UX C2.5-A — Lyrics embed cascade correction

**Stop line:** Do not begin Phase 7 without explicit authorization.

## PHASE UX C2.5-A — Build 31

Build 31 is the narrow corrective integration discovered by real-user smoke of Build 30. The embedded Lyrics row borders had adopted the intended teal/cyan treatment, but the selected/current row fill itself remained purple.

The host pin and Shadow DOM integration were correct. The remaining mismatch was inside LRC Maker: its historical standalone `launchpad-skin.css` protects purple `.line.select` / `.line.highlight` backgrounds with `!important`, while the 6.3.7 Studio-only overrides did not use equivalent priority for those background declarations.

Build 31 therefore:

- consumes LRC Maker embed `6.3.8` with an explicit cache-busting version pin;
- keeps `trackId` as the only Studio embed context and preserves the existing protected Track Manager lyrics routes;
- relies on the 6.3.8 embed-only cascade fix so neutral, hover, selected and current rows actually render with dark teal/cyan fills and readable light text;
- preserves the standalone LRC Maker appearance unchanged;
- preserves Build 30's in-flow cleanup/audio confirmations, Catalog warm/shared read, in-memory route snapshot, first-load skeleton/status and Intelligence overflow fix;
- advances every release, Phase 6 and C2.5-A regression guard to `0.10.9` / Build `31`;
- changes no Track Manager route, Worker, R2 object, canonical Album schema, catalog projection contract, SonicTrace persistence or Phase 7 scope.

Studio Build 31 must not be promoted before LRC Maker `6.3.8` is green, merged and published to GitHub Pages. See [`docs/PHASE-UX-C2-5-A-BUILD31-LRC-638.md`](docs/PHASE-UX-C2-5-A-BUILD31-LRC-638.md) and [`CHANGELOG-C2-5-A-BUILD31.md`](CHANGELOG-C2-5-A-BUILD31.md).

The final PHASE UX checkpoint remains **NOT CREATED**. C2.5-B is **NOT STARTED**, C3 SonicTrace V2-E parity remains suspended, and Phase 7 remains forbidden.

## PHASE UX C2.5-A — Build 30

Build 30 is a frontend-only polish lot discovered during real-user C2.5-A smoke. It does not begin the canonical Album schema work.

- removes the Intelligence track-list horizontal scrollbar that appeared on hover by keeping the list vertical-only and removing the translated hover geometry;
- starts warming the canonical Catalog read as soon as the Studio shell is loaded, shares the in-flight request, keeps an in-memory snapshot for route revisits and force-refreshes only after a real catalog-changing action such as New Track creation;
- replaces the ambiguous blank Catalog wait with an accessible loading status, animated activity indicator and responsive skeleton cards;
- consumes LRC Maker embed `6.3.7`, whose in-flow notification behavior remains valid; its intended teal/cyan row-fill presentation was only partially effective because of the standalone skin cascade and is superseded by 6.3.8 / Build 31;
- adds regression coverage for the loading/cache, overflow correction, embed pin and release markers;
- changes no Track Manager route, Worker, R2 object, canonical Album schema, catalog projection contract, SonicTrace persistence or Phase 7 scope.

The final PHASE UX checkpoint remains **NOT CREATED**. C2.5-B is **NOT STARTED**, C3 SonicTrace V2-E parity remains suspended, and Phase 7 remains forbidden.

## PHASE UX — Build 29

Build 29 is the Studio-only first corrective lot of the final integration parity audit.

- adds a dedicated Studio favicon;
- displays duration measured from the canonical audio element while retaining the manifest value as diagnostic evidence;
- classifies saved SonicTrace profiles as `FULL`, `PARTIAL` or `OUTDATED` without changing persistence;
- documents the duration authority and current SonicTrace/V2-E parity gaps;
- adds regression coverage for these behaviors;
- makes no Worker, R2, backend, LRC Maker or Phase 7 runtime change.

The cross-repository C2 duration-validation correction is now production deployed and real-user validated. Track Manager `v5.16` / Studio bridge `v1.8` accepts request-scoped `observedAudioDuration` evidence from LRC Maker `6.3.6` on the existing guarded Lyrics routes. The canonical `lyrics.txt` save and reread passed in production and the false "last timestamp exceeds audio duration" blocker is gone.

The C2 admin-only deployment used workflow run `31324447727`, source `1bbe0293e4e17968bb7e191f58e7ae1cdd95dadf` and Worker Version ID `5a83c6dd-cfb4-4be6-ab8d-16b5c34bdc2b`. The public Worker remained unchanged, no automated production R2 test mutation occurred, and Studio remained `0.10.7` / Build `29` at that checkpoint.

C3 SonicTrace V2-E parity is suspended pending the C2.5 Album / Project architecture decision. The final PHASE UX checkpoint is not created and Phase 7 is not started.

## PHASE UX — Build 28

Build 28 completes the production-smoke correction by making multi-file selection the first New Track step, so TXT detection can prefill editable metadata before Review. It includes every Build 27 correction and changes no Worker, R2, schema or engine contract.

- restores Studio asset uploads with credentialed, CORS-simple multipart `fetch` and canonical lost-response verification;
- opens New Track on the combined MP3/cover/TXT drop step before Metadata;
- brings New Track intake to the useful current Track Manager behavior: multi-file drop, role review, TXT metadata parsing/inference and visible provenance;
- adds cover image preview plus editable canonical `accent` / `accent2` controls, including native EyeDropper support when available;
- preserves saved palettes when an existing cover is replaced until an explicit Extract/Save action;
- removes the overlapping double-sticky workspace header and keeps compact track context in the local navigation;
- adds regression guards for the corrective transport, retry safety, intake parity, palette and sticky layout;
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
Track Manager       v5.16
Studio bridge       v1.8
deployed source     1bbe0293e4e17968bb7e191f58e7ae1cdd95dadf
deployment run      31324447727
deployment target   admin
Worker Version ID   5a83c6dd-cfb4-4be6-ab8d-16b5c34bdc2b
Cloudflare Access   protected
public Worker       v2.6 unchanged
```

LRC Maker `6.3.8` is the frontend embed targeted by Build 31. Its canonical duration-evidence behavior remains the proven `6.3.6` contract; 6.3.7 moved embedded confirmations into the layout, and 6.3.8 only corrects the embed-only row-state CSS cascade. The C2 real-user Lyrics smoke passed canonical playback, timestamp navigation, synchronized `lyrics.txt` save and canonical reread without changing the one-source Lyrics contract.

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

Current corrective snapshots:

```text
Studio Build 31:    safety/pre-build31-lrc-638-20260809-2128
LRC Maker 6.3.8:    safety/pre-6-3-8-studio-line-state-20260809-2128
Studio Build 30:    safety/pre-c2-5-a-studio-ux-polish-20260809-2037
LRC Maker 6.3.7:    safety/pre-c2-5-a-studio-embed-polish-20260809-2037
LaunchPAD Build 71: safety/pre-c2-5-a-era-play-mobile-ux-20260809-2037
```

The older final Phase 6 checkpoint remains the authoritative rollback point for the validated Phase 6 milestone itself.

## Verification policy

Studio Build 31 is protected by:

- private-read integration guards;
- Phase 5 algorithm guards;
- Phase 6 canonical Lyrics guards;
- LRC Maker 6.3.8 embed pin with stale-version rejection;
- no-iframe guard;
- Content Health timestamp-only synchronization guard;
- 11px readability floor for established useful microcopy;
- C2.5-A Catalog warm/cache/loading and Intelligence overflow guards;
- TypeScript;
- Vite production build;
- final Phase 6/C2 production smoke history.

LRC Maker 6.3.8 additionally preserves the real reducer transition test for `line N -> timestamp -> select N+1`, retains isolated simple-click/no-seek versus double-click/seek guards, keeps notifications in-flow and explicitly verifies that Studio's scoped teal/dark row backgrounds defeat the standalone purple `!important` skin without changing that standalone skin.

We do not mutate a real production WAV/cover/lyrics object merely to manufacture a frontend smoke test.

## Phase 7 stop line

**PHASE 6 IS COMPLETE. C2.5-A IS FRONTEND UX WORK. STOP BEFORE PHASE 7.**

Do not implement, scaffold, prepare, branch, merge or deploy any Phase 7 item without a new explicit user authorization.

## Development

```bash
npm install
npm run dev
npm run check:private-read
npm run check:phase5
npm run check:phase6
npm run check:ux
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
4. `CHANGELOG.md` plus corrective changelog where applicable;
5. README and affected docs;
6. security/integration regression guards;
7. PR dependency and rollback notes.

Source merge, web deployment, Worker deployment and R2/catalog mutation remain separate facts.
