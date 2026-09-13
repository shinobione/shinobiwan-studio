# Build107 local implementation receipt

Date: 2026-09-13. State: Studio locally implemented/tested and uncommitted; SonicTrace subsequently committed locally by the user at `70b0bf277a01f3817dd2db71c91233a8fe91debf`. Not deployed, no real-user acceptance. Build106 remains the accepted deployed runtime and release identity. No commit, push, PR, merge, deployment, GitHub write action, production-data mutation, R2 access or protected-repository modification occurred.

## Preflight

Both writable repositories started clean on `astra/phase10-build107-catalog-kernel`. Studio origin is `shinobione/shinobiwan-studio`; GitHub main and local HEAD were `c44b1e6920435e71896dfce3ca8c9f27d98aabd1`. Read-only GitHub checks found final closeout PR #213 merged, successful deployment on that HEAD and successful latest validation. The canonical checkpoint's older receipt list is supplemented here; accepted runtime remains Build106. SonicTrace base: `7dfe8d341ef1a0573ddda4eb66801d01986780dd`. The user's explicit bounded Phase10 implementation request supersedes the prior scope-audit-only next action for this local work.

## Architecture before and after

Before: SonicTrace's IIFE and Studio's TypeScript consumer each defined their own normalization, dot product and power iteration. After: SonicTrace owns one ES module; its existing consumer imports that module locally. Studio imports a pinned byte-for-byte distribution under `src/vendor`. Both apps remain independently deployable and reversible, with no cross-origin or live SonicTrace dependency.

Only the three numerical functions moved. SonicTrace keeps `normalizedVector` input cleaning, complete projection policy, map normalization, fallback, clustering, scoring and semantic policies. Studio keeps valid-512D filtering, canonical ordering, centering, map normalization, zones, nearest tracks, semantics, every public export and signature. Whole-catalog golden tests preserve each app's intentionally different behavior.

## Provenance and integrity

Canonical source: `shinobione/LM-IA-Analayse`, `js/catalog-projection-kernel.mjs`.

SHA-256: `f883aa12011d0714049717c6de6a426fbc7c8296a5aa872a978aaeefc47f34d8`.

Provenance now references repository `shinobione/LM-IA-Analayse`, actual committed module `js/catalog-projection-kernel.mjs`, and commit `70b0bf277a01f3817dd2db71c91233a8fe91debf`. The temporary derivation fields have been removed. Studio's offline build verifies the frozen digest and exact metadata; explicit local source verification compares raw vendored bytes directly to `git show <commit>:<path>` and verifies repository identity. Tampered bytes and every changed provenance field are rejected. Kernel bytes and SHA-256 are unchanged. LF attributes protect the byte pin across checkouts.

Finalize/regenerate from Studio with `node scripts/finalize-build107-provenance.mjs ../LM-IA-Analayse`. This delegates artifact generation to the unchanged SonicTrace vendor mechanism, verifies identical committed bytes, then finalizes only the provenance metadata. It contains no numerical implementation or independent artifact copier. Verify with `node scripts/verify-catalog-projection-kernel.mjs ../LM-IA-Analayse`. The standalone verification default needs no sibling or network. The legacy SonicTrace generator alone still emits its original metadata; use the finalizer to obtain the committed-module pin.

## Files changed

SonicTrace modified: `.github/workflows/validate-phase5.yml`, `js/catalog-similarity.js`, `js/loader.js`.

SonicTrace added: `.gitattributes`, `BUILD107-KERNEL.md`, `js/catalog-projection-kernel.mjs`, `scripts/build107-source.mjs`, `scripts/capture-build107-baseline.mjs`, `scripts/fixtures/build107-baseline.json`, `scripts/test-build107-kernel.mjs`, `scripts/test-build107-loader.mjs`, `scripts/vendor-build107-kernel.mjs`.

Studio modified: `package.json`, `src/catalog-intelligence.ts`, `scripts/test-phase5-algorithms.mjs`, `scripts/test-phase-ux-c3-b-v2e-parity.mjs`, `PROJECT_STATE.md`, `ROADMAP.md`, `QA.md`, `DECISIONS.md`.

Studio added: `.gitattributes`, `src/vendor/catalog-projection-kernel.mjs`, `src/vendor/catalog-projection-kernel.d.mts`, `src/vendor/catalog-projection-kernel.origin.json`, `scripts/fixtures/build107-baseline.json`, `scripts/test-build107-kernel.mjs`, `scripts/test-build107-integrity.mjs`, `scripts/verify-catalog-projection-kernel.mjs`, this receipt.

The two existing Studio test harness changes resolve the new local import when transpiling to a data URL; their assertions are unchanged. Source and declarations are generated from SonicTrace. No runtime release/identity bump was bundled into this extraction.

## Tests added

- Pre-edit exact cross-implementation comparison: 26 numerical cases, passed before removing originals.
- Frozen outputs: 9 complete SonicTrace catalog analyses and 8 Studio catalog analyses.
- Empty vectors, zero normalization, empty matrices, identical vectors, collinear and rank-deficient inputs, deterministic ordinary and 512D inputs, PC1 and orthogonal PC2, unequal-length dot products, no mutation and repeatability; additional underflow/overflow magnitudes.
- Canonical extraction from pinned Git source and fixed byte digest; one production solver per app, no consumer fallback solver, exactly three kernel exports.
- Distribution tampering: changed bytes and every changed metadata field must throw.
- SonicTrace module initialization: actual local ES-module import and ready event, UI waiting for module load, asset order, reentrant loading and module-failure stop.
- Studio `check:phase10` is first in its existing build chain; SonicTrace Phase5 CI runs kernel and loader tests with Node 24 and source history.

## Commands and results

Inspection commands included `rg --files`, targeted `rg -n`, `Get-Content`, repository branch/status/log/remote checks, `git diff --check`, `git diff --stat`, and `git status --short`. Git used per-command `-c safe.directory=*` to handle sandbox ownership; no global Git config changed.

Read-only remote preflight: `gh api repos/shinobione/shinobiwan-studio/branches/main --jq .commit.sha`; `gh pr list -R shinobione/shinobiwan-studio --state all --limit 5 --json number,title,state`; `gh run list -R shinobione/shinobiwan-studio --limit 4 --json name,conclusion,headSha`. Initial network-restricted attempts failed; approved read-only retries passed.

Dependency setup: `npm ci --ignore-scripts` failed because this repository has no lockfile. `npm install --ignore-scripts --no-package-lock --no-audit --no-fund --cache .npm-cache` succeeded, adding 38 packages without changing dependency declarations. Temporary cache was removed afterward. Initial `python --version` was unavailable; the bundled Python executable was used for Python checks. One numerical test invocation from the parent workspace failed with MODULE_NOT_FOUND; rerunning from SonicTrace passed.

SonicTrace cwd:

```text
node scripts/capture-build107-baseline.mjs                 PASS (before extraction)
node scripts/vendor-build107-kernel.mjs ../shinobiwan-studio PASS
node scripts/test-build107-kernel.mjs                     PASS
node scripts/test-build107-loader.mjs                     PASS
node scripts/test-semantic-genre-context.mjs              PASS
node scripts/test-semantic-bootstrap-v33.mjs              PASS
node scripts/test-semantic-structure-v33.mjs              PASS
node scripts/test-semantic-generalization-v34.mjs         PASS
node scripts/test-catalog-v3-accuracy.mjs                  PASS
node scripts/test-release-label.mjs                       PASS
node scripts/test-catalog-style-families.mjs              PASS
```

`node --check` passed for all Phase5 workflow JS targets plus `js/catalog-similarity.js` and `js/catalog-projection-kernel.mjs`: semantic-v32, semantic-bootstrap, semantic-client, catalog-v3-accuracy, catalog-maintenance, catalog-memory, catalog-style-families, catalog-style-families-build04, catalog-family-language-build05, readability-overhaul, unified-analysis and loader.

Python executable: `C:\Users\jerry\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`. With `PYTHONPATH=backend`, these existing tests passed: `backend/tests/test_ffmpeg_analysis.py` (10), `test_studio_contract.py` (6), `test_neural_taxonomy.py` (6), `test_genre_ensemble.py` (9), `test_genre_dimensions.py` (8), `test_genre_dimensions_v352_runtime.py` (4), `test_core_model_prefetch_contract.py`, `test_analysis_benchmark.py` (6). From `tools`, `test_runtime_manager.py` passed (1). The five workflow Model Lab contract scripts also passed: `test_model_lab_contract.py`, `test_larger_clap_music_contract.py`, `test_native_laion_music_contract.py`, `test_m2d_clap_2025_contract.py`, `test_model_lab_maintenance_contract.py`. `python -m py_compile` passed for the exact target list in `validate-phase5.yml`.

Studio cwd:

```text
npm run check:phase10                                    PASS
node scripts/verify-catalog-projection-kernel.mjs ../LM-IA-Analayse PASS
npm run check:phase5                                     PASS
node scripts/test-phase-ux-c3-b-v2e-parity.mjs             PASS
npm run typecheck                                        PASS
node_modules/.bin/vite build                             PASS
npm run build (original CRLF checkout)                   FAIL: existing Build79 LF-only assertion
npm --prefix node_modules/.cache/build107-lf run build    PASS: complete existing chain
```

For the last command, a disposable copy of all tracked/new source files was made under Studio's ignored `node_modules/.cache/build107-lf`, converting CRLF to LF to reproduce CI checkout format. No assertions or application source were changed to fix the failure. The guarded AlbumsWorkspace source was verified identical to HEAD modulo checkout line endings, and HEAD's LF text satisfies the assertion. The complete LF run passed private-read, Phase5, Phase6, C3, UX, Phase7, Phase8, Phase9, Focus, TypeScript and Vite. Vite reports its existing >500 kB chunk warning. Working-checkout typecheck and Vite build also passed independently.

## Failed / unavailable gates and limits

- The direct CRLF `npm run build` remains affected by the pre-existing LF-only guard; complete LF validation passed.
- `PYTHONPATH=backend LMN_MUSIC_EXPERT=auto python backend/tests/smoke_music_expert.py` failed before model execution: `ModuleNotFoundError: librosa`. The ONNX/model smoke is therefore NOT green locally. No model downloads were attempted for this bounded numerical extraction.
- No new remote CI was run, no deployment happened, and no browser real-user smoke was performed. Loader proof is an executable DOM harness plus real local module import, not a browser/MIME hosting test.
- Baseline fixtures prove the covered cases, complemented by byte-exact extraction and unchanged surrounding consumer logic. They do not claim exhaustive testing of every possible JavaScript input.

## Rollback

Repos started clean. Independently in each repo, restore only the modified files listed above from HEAD and remove only the added files listed above. For SonicTrace, restore loader and similarity consumer together before removing the kernel. For Studio, restore consumer, package build chain and the two test harnesses before removing vendor/tests/docs. Review any later local work first; do not use a broad destructive reset. No data migration, cross-repository rollout ordering or production rollback is required. Neither repo's rollback requires the other repo to change.

## Remaining risks

The committed-module provenance is finalized and verified. Direct Windows full-chain portability, the unavailable real-model smoke, and browser module/MIME smoke remain the earlier validation limitations above. No numerical or runtime behavior changed during finalization. Deployment and acceptance remain unclaimed.

## Initial implementation Git receipts (before user SonicTrace commit)

`git diff --stat` reports tracked changes only; new files remain untracked (not staged) and are listed above and below.

LM-IA-Analayse — `git diff --stat`:

```text
 .github/workflows/validate-phase5.yml | 10 ++++++++++
 js/catalog-similarity.js              | 37 ++---------------------------------
 js/loader.js                          |  1 +
 3 files changed, 13 insertions(+), 35 deletions(-)
```

shinobiwan-studio — `git diff --stat`:

```text
 DECISIONS.md                              |  2 ++
 PROJECT_STATE.md                          |  2 ++
 QA.md                                     |  2 ++
 ROADMAP.md                                |  2 ++
 package.json                              |  5 +++--
 scripts/test-phase-ux-c3-b-v2e-parity.mjs |  4 +++-
 scripts/test-phase5-algorithms.mjs        |  4 +++-
 src/catalog-intelligence.ts               | 34 +------------------------------
 8 files changed, 18 insertions(+), 37 deletions(-)
```

LM-IA-Analayse — `git status --short`:

```text
 M .github/workflows/validate-phase5.yml
 M js/catalog-similarity.js
 M js/loader.js
?? .gitattributes
?? BUILD107-KERNEL.md
?? js/catalog-projection-kernel.mjs
?? scripts/build107-source.mjs
?? scripts/capture-build107-baseline.mjs
?? scripts/fixtures/
?? scripts/test-build107-kernel.mjs
?? scripts/test-build107-loader.mjs
?? scripts/vendor-build107-kernel.mjs
```

shinobiwan-studio — `git status --short`:

```text
 M DECISIONS.md
 M PROJECT_STATE.md
 M QA.md
 M ROADMAP.md
 M package.json
 M scripts/test-phase-ux-c3-b-v2e-parity.mjs
 M scripts/test-phase5-algorithms.mjs
 M src/catalog-intelligence.ts
?? .gitattributes
?? docs/BUILD107-LOCAL-IMPLEMENTATION.md
?? scripts/fixtures/
?? scripts/test-build107-integrity.mjs
?? scripts/test-build107-kernel.mjs
?? scripts/verify-catalog-projection-kernel.mjs
?? src/vendor/
```

lrc-maker — `git status --short`:

```text
(empty — clean)
```

LaunchPAD-APP — `git status --short`:

```text
(empty — clean)
```

Track-To-Market-Engine — `git status --short`:

```text
(empty — clean)
```

## Committed-source provenance finalization

SonicTrace commit: `70b0bf277a01f3817dd2db71c91233a8fe91debf`. Repository: `shinobione/LM-IA-Analayse`. Path: `js/catalog-projection-kernel.mjs`. SHA-256 remains `f883aa12011d0714049717c6de6a426fbc7c8296a5aa872a978aaeefc47f34d8`. Vendored bytes exactly equal the raw Git blob. Temporary provenance fields are removed. No runtime behavior changed.

Studio files changed during finalization only: `src/vendor/catalog-projection-kernel.origin.json`, `scripts/verify-catalog-projection-kernel.mjs`, new `scripts/finalize-build107-provenance.mjs`, `DECISIONS.md`, and this receipt. Kernel/declarations were regenerated by the SonicTrace mechanism; kernel bytes are unchanged. SonicTrace has no new working-tree changes.

Requested reruns all PASS: SonicTrace `node scripts/test-build107-kernel.mjs`; Studio `npm run check:phase10`, `node scripts/verify-catalog-projection-kernel.mjs ../LM-IA-Analayse`, `npm run check:phase5`, `node scripts/test-phase-ux-c3-b-v2e-parity.mjs`, `npm run typecheck`, and `node_modules/.bin/vite build`. Integrity checks reject altered bytes and all altered metadata fields; the single-solver guard passes. The first finalizer attempt caught a stale commit constant before generation; it was corrected and all listed reruns passed. Vite retains the existing >500 kB chunk warning. `git diff --check` passes for both repositories (only checkout EOL conversion warnings).

Final statuses (Studio includes earlier uncommitted implementation changes):

shinobiwan-studio

```text
 M DECISIONS.md
 M PROJECT_STATE.md
 M QA.md
 M ROADMAP.md
 M package.json
 M scripts/test-phase-ux-c3-b-v2e-parity.mjs
 M scripts/test-phase5-algorithms.mjs
 M src/catalog-intelligence.ts
?? .gitattributes
?? docs/BUILD107-LOCAL-IMPLEMENTATION.md
?? scripts/finalize-build107-provenance.mjs
?? scripts/fixtures/
?? scripts/test-build107-integrity.mjs
?? scripts/test-build107-kernel.mjs
?? scripts/verify-catalog-projection-kernel.mjs
?? src/vendor/
```

LM-IA-Analayse

```text
(empty — clean)
```

lrc-maker

```text
(empty — clean)
```

LaunchPAD-APP

```text
(empty — clean)
```

Track-To-Market-Engine

```text
(empty — clean)
```

No commit, push, PR, merge, deployment or GitHub write action was performed during finalization.
