from pathlib import Path
import re

ROOT = Path('.')


def load(path):
    return (ROOT / path).read_text(encoding='utf-8')


def save(path, text):
    (ROOT / path).write_text(text, encoding='utf-8')


def sub1(text, pattern, repl, label, flags=0):
    out, n = re.subn(pattern, repl, text, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f'{label}: expected exactly one replacement, got {n}')
    return out


# README.md
p = 'README.md'
t = load(p)
t = sub1(
    t,
    r"## Current accepted state\n.*?The repository currently publishes",
    """## Current accepted state

```text
Studio                v0.19.17 · Build95 · REAL USER PASS
Codename              studio-focus-slice4-phase9-albums-daily-resilient-service-convergence
Runtime PR            #171
Exact tested head     f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Validation            31911514334 · SUCCESS
Runtime merge         0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages         31911568069 · SUCCESS · exact runtime merge SHA
Candidate docs PR     #172
Candidate docs CI     31911702567 · SUCCESS
Candidate docs merge  1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages  31911746874 · SUCCESS
Real-user smoke       BUILD95 PASS MADAFAKA · 2026-08-16
Track Manager         v5.23 · DEPLOYED
Studio bridge         v1.13
TM admin Worker       439a1ce4-e458-427d-9fd6-61e888efd269
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```

**Studio v0.19.17 · Build95 is the current accepted runtime.** Build95 closes a wiring gap in the real daily Albums route: metadata save, ordered membership save and Album move now consume the already accepted Build85/86/87 resilient services instead of the older generic mutations.

Build95 does **not** add a new recovery algorithm. Album create, binary upload and asset delete remain on their existing operation-specific paths. No Track Manager/Worker/R2 schema or data migration was introduced.

The bounded normal-browser acceptance received explicit **`BUILD95 PASS MADAFAKA`** on 2026-08-16. The smoke covered the normal Albums surface, a harmless metadata save with persistence, a safe ordered tracklist save with persistence, coherent Move UI presence, and surrounding Albums / Track / Lyrics / SonicTrace navigation. No network/Cloudflare failure was deliberately manufactured.

Build94 remains the accepted predecessor for non-mutating Lyrics validation retry truth; Build85/86/87 remain the operation-specific Album response-loss authorities that Build95 now wires into the daily editor.

The repository currently publishes""",
    'README current accepted overlay',
    re.S,
)
t = sub1(
    t,
    r"## Current program position\n\n```text\n.*?```\n\nThe immediate next action is .*?\n\n## Frozen authority model",
    """## Current program position

```text
Phases 0–6          COMPLETE
Phase 7-A           COMPLETE · REAL USER PASS
Phase 7-B           COMPLETE · REAL USER PASS
Phase 7-C           COMPLETE · program closeout
Phase 8             COMPLETE · Build81 closeout
Phase 9             ACTIVE
Phase 9 Slice1      Build82 · REAL USER PASS
Phase 9 Slice2      Build83 · REAL USER PASS
Phase 9 Slice3      Build84 · REAL USER PASS
Phase 9 Slice4      Build85 · REAL USER PASS
Phase 9 Slice5      Build86 · REAL USER PASS
Phase 9 Slice6      Build87 · REAL USER PASS
Phase 9 Slice7      Build88 · REAL USER PASS
Phase 9 Slice8      Build89 · REAL USER PASS
Phase 9 Slice9      Build90 · REAL USER PASS
Phase 9 Slice10     Build91 · REAL USER PASS
Phase 9 Slice11     Build92 · REAL USER PASS
Phase 9 Slice12     Build93 · REAL USER PASS
Phase 9 Slice13     Build94 · REAL USER PASS
Phase 9 Slice14     Build95 · REAL USER PASS
Build96             UNALLOCATED
Phase 10            FUTURE
```

The immediate next action is a **fresh read-only post-Build95 Phase9 reliability audit**. Build96 remains unallocated until that audit proves the smallest coherent next gap.

## Frozen authority model""",
    'README program position',
    re.S,
)
t = sub1(
    t,
    r"(Build89 changes only canonical Album GET behavior\. It does not alter the Build85/86/87 write contracts\. Album create and binary upload remain separate operation-specific audit families requiring stronger causality/digest proof before lost-response recovery can be safely added\.)",
    r"\1\n\nBuild95 changes the **daily Albums UI wiring only**: `AlbumsWorkspace` now consumes Build85 metadata, Build86 move and Build87 membership resilient services. Their no-blind-retry/postcondition rules remain unchanged. Album create, binary upload and asset delete are not generalized by Build95.",
    'README Build95 Album contract',
)
t = sub1(
    t,
    r"## Build94 acceptance receipts",
    """## Build95 acceptance receipts

```text
Safety pre               safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815
Safety pre-PR            safety/post-build95-prepr-20260815
Safety green pre-merge   safety/post-build95-green-premerge-20260815
Runtime PR               #171
Exact tested head        f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Historical CI #477       31911328839 · FAILURE · inherited Phase7-C Build69 successor cap only · never merged
Historical CI #482       31911459367 · FAILURE · inherited Build93 successor cap only · never merged
Validation               31911514334 · SUCCESS
Runtime merge            0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages            31911568069 · SUCCESS · exact runtime merge SHA
Safety post-deploy       safety/post-build95-deployed-candidate-20260815
Candidate docs PR        #172
Candidate docs CI        31911702567 · SUCCESS
Candidate docs merge     1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages     31911746874 · SUCCESS
Safety candidate docs    safety/post-build95-candidate-docs-closeout-20260815
Safety post-acceptance   safety/post-build95-real-user-pass-20260816
Worker deploy            NONE
Track Manager change     NONE
R2 migration/write       NONE caused by implementation/deployment
Real-user smoke          BUILD95 PASS MADAFAKA · 2026-08-16
Build96                  UNALLOCATED pending fresh audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD95.md`](changelogs/CHANGELOG-BUILD95.md).

## Build94 acceptance receipts""",
    'README Build95 receipts marker',
)
save(p, t)


# PROJECT_STATE.md
p = 'PROJECT_STATE.md'
t = load(p)
t = sub1(t, r"Updated: .*", "Updated: 2026-08-16 after explicit **`BUILD95 PASS MADAFAKA`** real-user browser acceptance; acceptance-docs closeout is in progress on an isolated docs branch.", 'PROJECT_STATE updated')
t = sub1(
    t,
    r"## Current accepted runtime\n\n```text\n.*?```\n\nBuild94 is the latest \*\*accepted\*\* Studio runtime\. Build93 remains its accepted predecessor\. Acceptance-docs CI/merge/Pages receipts are intentionally not fabricated before this docs branch passes its own gate\.",
    """## Current accepted runtime

```text
Studio version          v0.19.17
Studio build            Build95
Codename                studio-focus-slice4-phase9-albums-daily-resilient-service-convergence
Acceptance              REAL USER PASS
Runtime PR              #171
Exact tested head       f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Final runtime CI        31911514334 · SUCCESS
Runtime merge SHA       0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages           31911568069 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #172
Candidate docs CI       31911702567 · SUCCESS
Candidate docs merge    1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages    31911746874 · SUCCESS
Real-user smoke         BUILD95 PASS MADAFAKA · 2026-08-16
Safety post-deploy      safety/post-build95-deployed-candidate-20260815
Safety post-acceptance  safety/post-build95-real-user-pass-20260816
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
```

Build95 is the latest **accepted** Studio runtime. Build94 remains its accepted predecessor. Acceptance-docs CI/merge/Pages receipts are intentionally not fabricated before this docs branch passes its own gate.""",
    'PROJECT_STATE current runtime',
    re.S,
)
t = sub1(
    t,
    r"(Build94 changes only the Studio-side non-mutating canonical Lyrics \*\*validation\*\* transport\..*?Build83 save response-loss reread truth is unchanged\.)\n\n## Program position",
    r"\1\n\nBuild95 changes only the **daily Albums UI wiring**. `AlbumsWorkspace` now routes metadata save through Build85 resilient truth, Album move through Build86 resilient truth, and ordered membership save through Build87 resilient truth. The underlying resilient algorithms are unchanged; create/upload/delete remain outside scope.\n\n## Program position",
    'PROJECT_STATE Build95 summary',
    re.S,
)
t = sub1(
    t,
    r"## Program position\n\n```text\n.*?```",
    """## Program position

```text
Phases 0–6              COMPLETE
Phase 7-A               COMPLETE · REAL USER PASS
Phase 7-B               COMPLETE · REAL USER PASS
Phase 7-C               COMPLETE · program closeout
Phase 8                 COMPLETE · Build81 closeout accepted
Phase 9                 ACTIVE
Phase 9 Slice1          COMPLETE · Build82 REAL USER PASS
Phase 9 Slice2          COMPLETE · Build83 REAL USER PASS
Phase 9 Slice3          COMPLETE · Build84 REAL USER PASS
Phase 9 Slice4          COMPLETE · Build85 REAL USER PASS
Phase 9 Slice5          COMPLETE · Build86 REAL USER PASS
Phase 9 Slice6          COMPLETE · Build87 REAL USER PASS
Phase 9 Slice7          COMPLETE · Build88 REAL USER PASS
Phase 9 Slice8          COMPLETE · Build89 REAL USER PASS
Phase 9 Slice9          COMPLETE · Build90 REAL USER PASS
Phase 9 Slice10         COMPLETE · Build91 REAL USER PASS
Phase 9 Slice11         COMPLETE · Build92 REAL USER PASS
Phase 9 Slice12         COMPLETE · Build93 REAL USER PASS
Phase 9 Slice13         COMPLETE · Build94 REAL USER PASS
Phase 9 Slice14         COMPLETE · Build95 REAL USER PASS
Build96                 UNALLOCATED pending fresh read-only audit
Phase 10                FUTURE
Official Phase 11       NONE
```""",
    'PROJECT_STATE program position',
    re.S,
)
t = sub1(
    t,
    r"## Build82–84 accepted behavior",
    """## Build95 accepted behavior

The fresh post-Build94 audit found a daily Albums wiring gap: accepted Build85/86/87 resilient services existed, but the normal `AlbumsWorkspace` still used older generic metadata / membership / move mutations.

Build95 converges the real daily route onto those accepted engines without changing their algorithms:

```text
Album metadata save   → Build85 resilient service
Album move            → Build86 resilient service
Album tracklist save  → Build87 resilient service
```

The bounded browser smoke received explicit **`BUILD95 PASS MADAFAKA`** on 2026-08-16 after normal metadata persistence, ordered tracklist persistence, coherent Move UI presence and surrounding navigation regression. No failure branch was deliberately manufactured. Album create, binary upload and asset delete remain separate audit families.

## Build82–84 accepted behavior""",
    'PROJECT_STATE Build95 accepted section',
)
save(p, t)


# ROADMAP.md
p = 'ROADMAP.md'
t = load(p)
t = sub1(t, r"Updated: .*", "Updated: 2026-08-16 after **Build95 REAL USER PASS**; acceptance-docs closeout is in progress.", 'ROADMAP updated')
t = sub1(
    t,
    r"## In progress",
    """### Phase 9 Slice14 — daily Albums resilient service convergence

**Build95 · v0.19.17 · REAL USER PASS**

The fresh post-Build94 audit found that the real daily Albums route still consumed older generic metadata / membership / move mutations even though accepted Build85/86/87 resilient engines already existed.

Accepted evidence and behavior:

- runtime PR #171;
- exact tested head `f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b`;
- final runtime CI `31911514334` SUCCESS;
- historical CI `31911328839` failed only at inherited Phase7-C Build69 successor compatibility and was never merged;
- historical CI `31911459367` failed only at inherited Build93 successor compatibility and was never merged;
- runtime merge `0ad5e48f17c658c6b85c2ae405d32e874d2306d6`;
- runtime Pages `31911568069` SUCCESS;
- candidate docs PR #172 / CI `31911702567` / merge `1bff0a18588b274a6cb0200cb6bd90b377b0c1af` / Pages `31911746874` SUCCESS;
- daily metadata save now consumes Build85 resilient service;
- daily Album move now consumes Build86 resilient service;
- daily ordered membership save now consumes Build87 resilient service;
- no resilient engine algorithm changed;
- Album create, binary upload and asset delete remain out of scope;
- explicit real-user verdict **`BUILD95 PASS MADAFAKA`** on 2026-08-16;
- normal-browser acceptance covered metadata persistence, ordered tracklist persistence, coherent Move UI presence and surrounding Albums / Track / Lyrics / SonicTrace navigation;
- acceptance did not manufacture network/Access/lost-response failure;
- no Track Manager, Worker, R2 schema/data migration or cross-product runtime change.

## In progress""",
    'ROADMAP Build95 slice',
)
t = sub1(
    t,
    r"## In progress\n.*?## Backlog",
    """## In progress

### Build95 acceptance-docs closeout

Runtime CI, runtime merge, Pages, candidate-docs checkpoint and explicit real-user acceptance are complete. This isolated seven-document acceptance branch must still pass its own exact-head CI, merge and Pages before the administrative closeout is final.

**Build96 remains UNALLOCATED.**

## Next

After Build95 acceptance-docs closeout, run a fresh read-only post-Build95 Phase9 reliability audit. Audit remaining candidates by proven risk / bounded scope, without assuming a build number:

1. Album asset upload response-loss truth;
2. Album create response-loss truth;
3. degraded/offline/PWA resilience;
4. Deep Audio transport/compute behavior, with duplicate-compute causality explicitly considered;
5. any newly proven smaller bounded reliability gap found by the fresh audit.

Pick **one** coherent slice only after the audit proves the gap and confirms it does not duplicate existing recovery logic.

**Build96 remains UNALLOCATED.**

## Backlog""",
    'ROADMAP in progress / next',
    re.S,
)
t = t.replace('Do not allocate Build95 before Build94 acceptance-docs closeout and a fresh bounded post-Build94 audit select its scope.', 'Do not allocate Build96 before Build95 acceptance-docs closeout and a fresh bounded post-Build95 audit selects its scope.')
t = t.replace('See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build94 REAL USER PASS boundary.', 'See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build95 REAL USER PASS boundary.')
save(p, t)


# QA.md
p = 'QA.md'
t = load(p)
t = sub1(t, r"Updated: .*", "Updated: 2026-08-16 after explicit **Build95 REAL USER PASS**; acceptance-docs closeout is in progress.", 'QA updated')
t = sub1(
    t,
    r"## Current accepted Studio runtime\n\n```text\n.*?```",
    """## Current accepted Studio runtime

```text
Version                 v0.19.17
Build                   Build95
Status                  REAL USER PASS
Runtime PR              #171
Exact tested head       f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Final CI                31911514334 · SUCCESS
Runtime merge           0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Pages                   31911568069 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #172
Candidate docs CI       31911702567 · SUCCESS
Candidate docs merge    1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages    31911746874 · SUCCESS
Safety post-deploy      safety/post-build95-deployed-candidate-20260815
Safety post-acceptance  safety/post-build95-real-user-pass-20260816
Worker deploy           NONE
Track Manager change    NONE
R2 migration/write      NONE caused by implementation/deployment
Real-user verdict       BUILD95 PASS MADAFAKA · 2026-08-16
```""",
    'QA current runtime',
    re.S,
)
t = sub1(
    t,
    r"## Build94 automated coverage — GREEN",
    """## Build95 automated coverage — GREEN

Final validation run `31911514334` passed the complete repository-native chain on exact head `f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b`, including private-read, Phase5/6, C3, UX, Phase7, Phase8, Phase9 Build82→Build95, Studio Focus successor guards, TypeScript typecheck and Vite production build.

Two historical red Build95 runs remain explicit and were never merged:

```text
31911328839  FAILURE · inherited Phase7-C Build69 successor cap only
31911459367  FAILURE · inherited Build93 successor cap only
```

Only stale successor allowlists/ancestry assertions were widened. No Build95 product semantics were changed to repair those red runs.

Build95 specifically guards the **real daily Albums route**:

```text
App → AlbumHealthWorkspace → AlbumsWorkspace
  metadata save   → saveAdminAlbumMetadataResilient()   / Build85
  Album move      → moveAdminAlbumTrackResilient()      / Build86
  tracklist save  → saveAdminAlbumMembershipResilient() / Build87
```

Additional Build95 guarantees:

- older generic metadata/membership/move mutations are absent from the daily workspace;
- recovered-after-lost-response UI truth explicitly states Studio did not retry the write;
- Build85/86/87 operation-specific postconditions and no-blind-retry policies remain inherited unchanged;
- `createAdminAlbum`, Album binary upload and Album asset delete remain outside Build95 scope;
- no Track Manager, Worker or R2 schema/data mutation was required.

## Build95 real-user smoke — PASS

The user completed the bounded normal-browser smoke and returned the explicit verdict:

```text
BUILD95 PASS MADAFAKA
```

The accepted smoke boundary covered:

- hard refresh to deployed `v0.19.17 · Build95`;
- opening an existing safe Album from the normal Albums surface;
- one harmless/reversible metadata save and persistence after reload;
- one ordered tracklist save and persistence after reload;
- coherent `Move to…` control presence without forcing an unnecessary destructive move merely to manufacture evidence;
- surrounding `Albums → Track → Lyrics → SonicTrace → Albums` navigation sanity.

Acceptance intentionally did **not** cut network, invalidate Cloudflare Access or manufacture lost-response branches. Automated guards own the failure-path classification and daily-route wiring proof.

Result:

```text
Build95 = REAL USER PASS
```

No Worker deployment, Track Manager change, public Worker change, R2 schema/data migration or cross-repository runtime change was required to reach acceptance.

## Build94 automated coverage — GREEN""",
    'QA Build95 sections',
)
save(p, t)


# CHANGELOG.md
p = 'CHANGELOG.md'
t = load(p)
t = sub1(
    t,
    r"## Current accepted release\n\n### v0\.19\.16 · Build94 — 2026-08-15",
    """## Current accepted release

### v0.19.17 · Build95 — 2026-08-15

Codename: `studio-focus-slice4-phase9-albums-daily-resilient-service-convergence`  
Status: **REAL USER PASS — ACCEPTED**

Build95 closes a daily Albums wiring gap rather than inventing a new recovery algorithm. The normal `AlbumsWorkspace` now consumes the accepted Build85/86/87 resilient mutation services for metadata, move and ordered membership respectively.

Accepted behavior:

- daily Album metadata save uses Build85 resilient response-loss truth;
- daily Album move uses Build86 resilient response-loss truth;
- daily ordered tracklist save uses Build87 resilient response-loss truth;
- older generic metadata/membership/move mutations are no longer used by the daily Albums workspace;
- existing recovered-after-lost-response semantics remain explicit and no write is blindly retried;
- Album create, binary upload and asset delete remain out of scope;
- no Track Manager, Worker, public Worker, R2 schema/data migration, LaunchPAD or LRC Maker change was required;
- normal-browser acceptance received explicit **`BUILD95 PASS MADAFAKA`** on 2026-08-16;
- acceptance did not deliberately cut network or invalidate Cloudflare Access to manufacture a lost response; automated guards own that proof.

Exact acceptance evidence:

```text
Safety pre               safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815
Safety pre-PR            safety/post-build95-prepr-20260815
Safety green pre-merge   safety/post-build95-green-premerge-20260815
Studio PR                #171
Exact tested head        f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
Historical CI #477       31911328839 · FAILURE · inherited Phase7-C Build69 successor cap only · never merged
Historical CI #482       31911459367 · FAILURE · inherited Build93 successor cap only · never merged
Validation               31911514334 · SUCCESS
Runtime merge            0ad5e48f17c658c6b85c2ae405d32e874d2306d6
Runtime Pages            31911568069 · SUCCESS · exact runtime merge SHA
Candidate docs PR        #172
Candidate docs CI        31911702567 · SUCCESS
Candidate docs merge     1bff0a18588b274a6cb0200cb6bd90b377b0c1af
Candidate docs Pages     31911746874 · SUCCESS
Safety post-deploy       safety/post-build95-deployed-candidate-20260815
Safety post-acceptance   safety/post-build95-real-user-pass-20260816
Track Manager            v5.23 · unchanged
Studio bridge            v1.13 · unchanged
TM Worker Version ID     439a1ce4-e458-427d-9fd6-61e888efd269 · unchanged
Public Worker            v2.7 · unchanged
Worker deploy            NONE
R2 migration/write       NONE caused by implementation/deployment
Real-user smoke          BUILD95 PASS MADAFAKA · 2026-08-16
Build96                  UNALLOCATED pending fresh audit
```

The two red Build95 validation runs are preserved as inherited-guard history. Neither red head was merged and neither required a product-runtime change.

Detailed accepted record: [`changelogs/CHANGELOG-BUILD95.md`](changelogs/CHANGELOG-BUILD95.md).

## Accepted predecessor

### v0.19.16 · Build94 — 2026-08-15""",
    'CHANGELOG Build95 current release',
)
save(p, t)


# docs/INTEGRATION_SAFETY.md
p = 'docs/INTEGRATION_SAFETY.md'
t = load(p)
t = t.replace('Current-state overlay refreshed: 2026-08-15', 'Current-state overlay refreshed: 2026-08-16')
t = t.replace('Current accepted Studio release: `v0.19.16` / Build `94` / REAL USER PASS', 'Current accepted Studio release: `v0.19.17` / Build `95` / REAL USER PASS')
t = sub1(
    t,
    r"Studio accepted\n  v0\.19\.16 / Build94 / REAL USER PASS\n.*?\n\nBuild94 safety history",
    """Studio accepted
  v0.19.17 / Build95 / REAL USER PASS
  exact tested head f7d4ccfbfdebf7dba6cf419ca9eca1c862a16d4b
  final runtime CI 31911514334 / SUCCESS
  runtime merge 0ad5e48f17c658c6b85c2ae405d32e874d2306d6
  runtime Pages 31911568069 / SUCCESS
  candidate docs PR #172 / CI 31911702567 / merge 1bff0a18588b274a6cb0200cb6bd90b377b0c1af / Pages 31911746874 SUCCESS
  browser smoke BUILD95 PASS MADAFAKA / 2026-08-16
  safety post-deploy safety/post-build95-deployed-candidate-20260815
  safety post-acceptance safety/post-build95-real-user-pass-20260816
  Worker deploy NONE
  Track Manager change NONE
  R2 migration/write NONE caused by implementation/deployment

Build94 safety history""",
    'INTEGRATION current overlay',
    re.S,
)
t = sub1(
    t,
    r"(Build94 explicit real-user acceptance checkpoint:\n  safety/post-build94-real-user-pass-20260815-2346)\n```",
    r"\1\n\nBefore Phase9 Build95:\n  safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815\n\nAfter Build95 implementation before PR:\n  safety/post-build95-prepr-20260815\n\nAfter Build95 green exact-head validation:\n  safety/post-build95-green-premerge-20260815\n\nAfter Build95 deployment candidate:\n  safety/post-build95-deployed-candidate-20260815\n  safety/post-build95-candidate-docs-closeout-20260815\n\nAfter Build95 explicit real-user acceptance:\n  safety/post-build95-real-user-pass-20260816\n```",
    'INTEGRATION Build95 checkpoints',
)
t = sub1(
    t,
    r"(Build94 changes only Studio-side non-mutating canonical Lyrics \*\*validation transient retry truth\*\*\..*?Build94 is \*\*REAL USER PASS\*\* after explicit normal-browser acceptance\.)",
    r"\1\n\nBuild95 changes only the **daily Albums UI wiring**. The normal `AlbumsWorkspace` now consumes the already accepted Build85 metadata, Build86 move and Build87 membership resilient services. Their recovery algorithms, Track Manager authority and no-blind-retry boundaries remain unchanged. Album create, binary upload and asset delete remain outside Build95 scope. Build95 is **REAL USER PASS** after explicit normal-browser acceptance.",
    'INTEGRATION Build95 product boundary',
    re.S,
)
save(p, t)


checks = {
    'README.md': ['v0.19.17 · Build95 · REAL USER PASS', 'Phase 9 Slice14     Build95 · REAL USER PASS', 'Build96             UNALLOCATED'],
    'PROJECT_STATE.md': ['Studio build            Build95', 'Phase 9 Slice14         COMPLETE · Build95 REAL USER PASS', 'BUILD95 PASS MADAFAKA'],
    'ROADMAP.md': ['Phase 9 Slice14 — daily Albums resilient service convergence', 'Build96 remains UNALLOCATED', 'Build95 REAL USER PASS boundary'],
    'QA.md': ['## Build95 automated coverage — GREEN', '## Build95 real-user smoke — PASS', 'BUILD95 PASS MADAFAKA'],
    'CHANGELOG.md': ['### v0.19.17 · Build95 — 2026-08-15', 'BUILD95 PASS MADAFAKA', 'Build96                  UNALLOCATED pending fresh audit'],
    'docs/INTEGRATION_SAFETY.md': ['Current accepted Studio release: `v0.19.17` / Build `95` / REAL USER PASS', 'safety/post-build95-real-user-pass-20260816', 'Build95 changes only the **daily Albums UI wiring**'],
    'changelogs/CHANGELOG-BUILD95.md': ['Status: **REAL USER PASS · ACCEPTED**', 'BUILD95 PASS MADAFAKA · 2026-08-16', 'Build96 = UNALLOCATED pending fresh read-only audit'],
}
for path, needles in checks.items():
    text = load(path)
    for needle in needles:
        if needle not in text:
            raise SystemExit(f'{path}: missing post-patch marker: {needle}')

# Delete temporary launcher files before the commit so the final branch tree remains docs-only.
for temp in [ROOT / '.github/build95_closeout.py', ROOT / '.github/workflows/build95-closeout-once.yml']:
    if temp.exists():
        temp.unlink()

print('Build95 acceptance overlays applied and verified.')
