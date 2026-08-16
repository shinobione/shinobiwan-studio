from pathlib import Path
import re
import subprocess


def read(path): return Path(path).read_text(encoding='utf-8')
def write(path, text): Path(path).write_text(text, encoding='utf-8')
def once(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected one marker, found {n}')
    return text.replace(old, new, 1)
def sub_once(text, pattern, replacement, label, flags=0):
    out, n = re.subn(pattern, replacement, text, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f'{label}: expected one regex match, found {n}')
    return out

runtime_block = '''```text
Studio                v0.19.22 · Build100 · REAL USER PASS
Codename              studio-focus-slice4-phase9-album-first-track-intake
Runtime PR            #187
Exact tested head     9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
Validation            31944882443 · SUCCESS
Runtime merge         49f5c8e0267a318e2b0900ba5e222bd56d098db8
Runtime Pages         31944932464 · SUCCESS · exact runtime merge SHA
Candidate docs PR     #188
Candidate docs CI     31945020130 · SUCCESS
Candidate docs merge  2ddce2be6abba8324c64054702f0e7654831c83b
Candidate docs Pages  31945131271 · SUCCESS
Real-user smoke       BUILD100 SMOKED 💨 · 2026-08-16
Safety post-deploy    safety/post-build100-deployed-candidate-20260816
Safety human-pass     safety/post-build100-real-user-pass-20260816-2255
Build99               v0.19.21 · REAL USER PASS
Build98               v0.19.20 · REAL USER PASS
Track Manager         v5.24 · REAL USER VERIFIED
Studio bridge         v1.14
TM deploy run         31919397012 · SUCCESS · admin only
TM admin Worker       53abb651-4f3c-46a7-a37a-055f35d340b9
Public Worker         v2.7 · unchanged
LaunchPAD public      2026.08.12.102 · REAL USER PASS
SonicTrace            V2-E Build08 · REAL USER PASS
Deep Audio            2.0.3-alpha
LRC Maker             6.3.8
```'''

p='README.md'; t=read(p)
t=sub_once(t, r'```text\nStudio\s+v0\.19\.21 · Build99 · REAL USER PASS.*?```', runtime_block, 'README state', re.S)
t=once(t, '**Studio v0.19.21 · Build99 is the current accepted runtime.** Build98 is its accepted predecessor.', '**Studio v0.19.22 · Build100 is the current accepted runtime.** Build99 is its accepted predecessor.', 'README accepted prose')
t=once(t, 'Phase 9 Slice18     Build99 · REAL USER PASS\nBuild100            UNALLOCATED · pending fresh read-only post-Build99 audit', 'Phase 9 Slice18     Build99 · REAL USER PASS\nPhase 9 Slice19     Build100 · REAL USER PASS\nBuild101            UNALLOCATED · pending fresh read-only post-Build100 audit', 'README program')
t=once(t, 'The immediate next action is a **fresh read-only post-Build99 Phase9 audit**. The already-observed `Singles → first Track into an empty draft Album` membership deadlock is the leading candidate, but Build100 remains unallocated until the audit proves scope and authority boundaries.', 'The immediate next action is a **fresh read-only post-Build100 Phase9 audit**. Build100 closed the previously observed `Singles → first Track into an empty draft Album` deadlock through the existing Build87 guarded membership authority. Build101 remains unallocated until a new bounded audit proves the next smallest coherent gap.', 'README next')
write(p,t)

p='PROJECT_STATE.md'; t=read(p)
t=once(t, 'Updated: 2026-08-16 after **Build99 REAL USER PASS** and completed seven-document acceptance CI/merge/Pages closeout.', 'Updated: 2026-08-16 after explicit **Build100 REAL USER PASS**; acceptance-docs receipts are being closed out without runtime changes.', 'PROJECT_STATE updated')
project_runtime='''## Current accepted runtime

```text
Studio version          v0.19.22
Studio build            Build100
Codename                studio-focus-slice4-phase9-album-first-track-intake
Acceptance              REAL USER PASS
Runtime PR              #187
Exact tested head       9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
Final runtime CI        31944882443 · SUCCESS
Runtime merge SHA       49f5c8e0267a318e2b0900ba5e222bd56d098db8
Runtime Pages           31944932464 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #188
Candidate docs CI       31945020130 · SUCCESS
Candidate docs merge    2ddce2be6abba8324c64054702f0e7654831c83b
Candidate docs Pages    31945131271 · SUCCESS
Real-user smoke         BUILD100 SMOKED 💨 · 2026-08-16
Safety post-deploy      safety/post-build100-deployed-candidate-20260816
Safety post-acceptance  safety/post-build100-real-user-pass-20260816-2255
Worker deploy           NONE
Track Manager change    NONE
R2 implementation write NONE; accepted smoke performed one intentional guarded Album-membership write
```

Build100 is the latest **accepted** Studio runtime. Build99 remains its accepted predecessor. Build100 reconnects the missing daily Album intake path while the existing Build87 resilient membership transaction remains the sole write authority and verifies Album plus affected Track caches after save.

## Current ecosystem baseline'''
t=sub_once(t, r'## Current accepted runtime\n.*?## Current ecosystem baseline', project_runtime, 'PROJECT_STATE runtime', re.S)
t=once(t, 'Phase 9 Slice18         COMPLETE · Build99 REAL USER PASS\nBuild100                UNALLOCATED pending fresh read-only post-Build99 audit', 'Phase 9 Slice18         COMPLETE · Build99 REAL USER PASS\nPhase 9 Slice19         COMPLETE · Build100 REAL USER PASS\nBuild101                UNALLOCATED pending fresh read-only post-Build100 audit', 'PROJECT_STATE program')
b100='''## Build100 accepted behavior

Build100 closes the daily-workflow deadlock discovered during the Build99 real-user session. Canonical authority remains `album.trackIds`; Track-side Album metadata remains compatibility/display cache only.

```text
canonical Album summaries
→ derive owner map from every album.trackIds
→ expose Tracks with no canonical Album owner
→ Add to tracklist = local staging only
→ Save tracklist = existing Build87 resilient membership transaction
→ private Album + affected Track-cache reread
→ exact canonical membership required before verified success
```

The genuine `Anh Yêu Em` / `Pixels & Promises` workflow passed in production. `Pixels & Promises` was staged from virtual Singles/unassigned, saved once through the guarded membership path, persisted after reload, and then displayed `Anh Yêu Em` on the Track side. No network/Access failure was manufactured. Real-user verdict: **`BUILD100 SMOKED 💨`** on 2026-08-16.

Build100 adds no editable Album selector to Track metadata, no new endpoint/service, no blind write retry, no Track Manager/Worker change, and no R2 schema migration.

'''
marker='## Build99 accepted behavior\n'
if marker not in t: raise SystemExit('PROJECT_STATE Build99 marker missing')
t=t.replace(marker,b100+marker,1); write(p,t)

p='QA.md'; t=read(p)
t=once(t, 'Updated: 2026-08-16 after explicit **Build99 REAL USER PASS**.', 'Updated: 2026-08-16 after explicit **Build100 REAL USER PASS**.', 'QA updated')
qa='''## Current accepted Studio runtime

```text
Version                 v0.19.22
Build                   Build100
Status                  REAL USER PASS
Runtime PR              #187
Exact tested head       9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
Final CI                31944882443 · SUCCESS
Runtime merge           49f5c8e0267a318e2b0900ba5e222bd56d098db8
Pages                   31944932464 · SUCCESS · exact runtime merge SHA
Candidate docs PR       #188
Candidate docs CI       31945020130 · SUCCESS
Candidate docs merge    2ddce2be6abba8324c64054702f0e7654831c83b
Candidate docs Pages    31945131271 · SUCCESS
Safety post-deploy      safety/post-build100-deployed-candidate-20260816
Safety post-acceptance  safety/post-build100-real-user-pass-20260816-2255
Track Manager           v5.24 · unchanged by Build100
Studio bridge           v1.14
Public Worker           v2.7 · unchanged
Real-user verdict       BUILD100 SMOKED 💨 · 2026-08-16
```

## Build100 automated coverage — GREEN

Final validation `31944882443` passed the complete repository-native chain on exact head `9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d`. Canonical ownership is derived from Album `trackIds`, only unowned Tracks are offered for intake, **Add to tracklist** stages locally, and the single write remains `saveAdminAlbumMembershipResilient(...)` from Build87.

Build100 adds no backend endpoint, Track Manager/Worker change, R2 schema migration or automatic write retry. Tracks already owned by another canonical Album continue to use the guarded Move flow.

## Build100 real-user smoke — PASS

The user returned:

```text
BUILD100 SMOKED 💨
```

`Pixels & Promises` was staged from virtual Singles/unassigned into empty draft Album `Anh Yêu Em`, committed once through the guarded membership save, persisted after reload, and reread on the Track side with `Anh Yêu Em` instead of virtual Singles. No network/Access failure was manufactured.

## Build99 automated coverage — GREEN'''
t=sub_once(t, r'## Current accepted Studio runtime\n.*?## Build99 automated coverage — GREEN', qa, 'QA current section', re.S); write(p,t)

p='CHANGELOG.md'; t=read(p)
current='''## Current accepted release

### v0.19.22 · Build100 — 2026-08-16

Codename: `studio-focus-slice4-phase9-album-first-track-intake`  
Status: **REAL USER PASS — ACCEPTED**

Build100 closes the daily Album first-track intake deadlock without creating a second ownership authority. The Albums workspace derives ownership from canonical `album.trackIds`, offers only Tracks with no canonical Album owner, stages **Add to tracklist** locally, and keeps the existing Build87 resilient membership transaction as the sole canonical write.

```text
Runtime PR                #187
Exact tested head         9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
Validation #503           31944882443 · SUCCESS
Runtime merge             49f5c8e0267a318e2b0900ba5e222bd56d098db8
Runtime Pages #194        31944932464 · SUCCESS
Candidate docs PR         #188
Candidate docs CI #504    31945020130 · SUCCESS
Candidate docs merge      2ddce2be6abba8324c64054702f0e7654831c83b
Candidate docs Pages #195 31945131271 · SUCCESS
Safety post-deploy        safety/post-build100-deployed-candidate-20260816
Safety post-acceptance    safety/post-build100-real-user-pass-20260816-2255
Track Manager             v5.24 · unchanged by Build100
Studio bridge             v1.14
Public Worker             v2.7 · unchanged
Real-user smoke           BUILD100 SMOKED 💨 · 2026-08-16
Build101                  UNALLOCATED pending fresh read-only post-Build100 audit
```

Detailed accepted record: [`changelogs/CHANGELOG-BUILD100.md`](changelogs/CHANGELOG-BUILD100.md).

## Accepted predecessor

### v0.19.21 · Build99 — 2026-08-16

Codename: `studio-focus-slice4-phase9-album-asset-upload-success-verification-truth`  
Status: **REAL USER PASS — ACCEPTED**

Build99 tightened normal successful Album cover/thumbnail verification. Its smoke also exposed the separate first-track intake deadlock that Build100 subsequently closed. Detailed accepted record: [`changelogs/CHANGELOG-BUILD99.md`](changelogs/CHANGELOG-BUILD99.md).

## Accepted predecessor

'''
t=sub_once(t, r'## Current accepted release\n.*?(?=### v0\.19\.20 · Build98)', current, 'CHANGELOG current section', re.S); write(p,t)

p='ROADMAP.md'; t=read(p)
t=once(t, 'Updated: 2026-08-16 after **Build99 REAL USER PASS** and acceptance closeout initiation.', 'Updated: 2026-08-16 after explicit **Build100 REAL USER PASS**; Build101 remains unallocated pending fresh audit.', 'ROADMAP updated')
old='''The smoke also exposed a separate product deadlock: a Track in virtual `Singles` cannot currently be claimed as the first member of an empty draft Album through the daily Albums Tracklist UI. This is the leading post-Build99 audit candidate, not part of Build99.

## In progress'''
new='''The smoke also exposed a separate product deadlock: a Track in virtual `Singles` could not be claimed as the first member of an empty draft Album through the daily Albums Tracklist UI. That finding remained outside Build99 and became Build100 only after a fresh audit proved the existing Build87 membership authority was sufficient.

### Phase 9 Slice19 — Album first-track intake / canonical membership continuity

**Build100 · v0.19.22 · REAL USER PASS**

- runtime PR #187; exact tested head `9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d`; CI `31944882443` SUCCESS;
- runtime merge `49f5c8e0267a318e2b0900ba5e222bd56d098db8`; Pages `31944932464` SUCCESS;
- candidate docs PR #188 / CI `31945020130` / merge `2ddce2be6abba8324c64054702f0e7654831c83b` / Pages `31945131271` SUCCESS;
- canonical ownership derives from Album `trackIds`; only unowned Tracks are offered;
- **Add to tracklist** stages locally; **Save tracklist** remains Build87 resilient membership;
- genuine `Anh Yêu Em` + `Pixels & Promises` workflow persisted across reload and Track-side reread;
- explicit real-user verdict **`BUILD100 SMOKED 💨`** on 2026-08-16;
- no new endpoint/service, automatic write retry, Track Manager/Worker change or R2 schema migration.

## In progress'''
t=once(t,old,new,'ROADMAP Build100 insertion')
t=sub_once(t, r'## In progress\n.*?## Next', '## In progress\n\n### Post-Build100 fresh audit\n\nBuild100 is real-user accepted. The project returns to read-only audit mode; no new runtime slice is allocated until the smallest coherent next gap is proven.\n\n**Build101 remains UNALLOCATED.**\n\n## Next', 'ROADMAP in progress', re.S)
t=sub_once(t, r'## Next\n.*?## Backlog', '## Next\n\nRun a fresh read-only post-Build100 Phase9 audit across current Studio/Track Manager/LaunchPAD contracts. Re-evaluate heavier gaps such as Album create lost-response causality, Album binary-upload exact-byte/digest proof, Deep Audio duplicate-compute risk, degraded/offline/PWA behavior, and the newly observed publication-projection question where a Track may become public while its canonical parent Album remains draft.\n\nPick **one** coherent slice only after the audit proves it. Do not allocate from memory.\n\n**Build101 remains UNALLOCATED.**\n\n## Backlog', 'ROADMAP next', re.S)
t=once(t, '- Do not allocate Build100 before Build99 acceptance-docs closeout and a fresh bounded post-Build99 audit selects its scope.', '- Do not allocate Build101 before Build100 acceptance-docs closeout and a fresh bounded post-Build100 audit selects its scope.', 'ROADMAP constraint')
t=once(t, 'See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build99 REAL USER PASS boundary plus the separately observed first-track Album membership deadlock.', 'See `PROJECT_STATE.md` for exact PR/SHA/CI/deploy receipts and `QA.md` for the Build100 REAL USER PASS boundary. Build101 remains unallocated pending the fresh post-Build100 audit.', 'ROADMAP pointer'); write(p,t)

p='changelogs/CHANGELOG-BUILD100.md'; t=read(p)
t=once(t, 'Status: **DEPLOYED CANDIDATE · REAL USER SMOKE PENDING**', 'Status: **REAL USER PASS · ACCEPTED**', 'Build100 status')
accepted='''## Real-user acceptance

User verdict on 2026-08-16:

```text
BUILD100 SMOKED 💨
```

The genuine blocked case passed:

- draft Album `Anh Yêu Em` exposed `Pixels & Promises` as virtual Singles / unassigned;
- **Add to tracklist** staged locally before any canonical write;
- one guarded **Save tracklist** committed membership through existing Build87 resilient truth;
- canonical reload preserved Album membership/order;
- reopening the Track showed `Anh Yêu Em` instead of virtual `Singles`.

No network/Cloudflare Access failure was manufactured. The acceptance write was the intentional Album-membership mutation under test; Build100 implementation/deployment itself caused no R2 migration/write and changed no Worker or Track Manager runtime.

Safety post-human-pass: `safety/post-build100-real-user-pass-20260816-2255`.

Build101 remains **UNALLOCATED** pending acceptance-docs closeout and a fresh bounded post-Build100 audit.
'''
t=sub_once(t, r'## Human acceptance boundary\n.*\Z', accepted, 'Build100 boundary', re.S); write(p,t)

p='docs/INTEGRATION_SAFETY.md'; t=read(p)
t=once(t, 'Current accepted Studio release: `v0.19.21` / Build `99` / REAL USER PASS', 'Current accepted Studio release: `v0.19.22` / Build `100` / REAL USER PASS', 'Safety current release')
s='''Studio accepted
  v0.19.22 / Build100 / REAL USER PASS
  exact tested head 9df6dd99c6e1bb6a2b1fbf5c555188659432ed8d
  final runtime CI 31944882443 / SUCCESS
  runtime merge 49f5c8e0267a318e2b0900ba5e222bd56d098db8
  runtime Pages 31944932464 / SUCCESS
  candidate docs PR #188 / CI 31945020130 / merge 2ddce2be6abba8324c64054702f0e7654831c83b / Pages 31945131271 SUCCESS
  browser smoke BUILD100 SMOKED 💨 / 2026-08-16
  safety post-deploy safety/post-build100-deployed-candidate-20260816
  safety post-acceptance safety/post-build100-real-user-pass-20260816-2255

Build99 accepted predecessor
  runtime PR #183 / CI 31920824628 / merge dd26df1664fa7de2b2e77b0d2ae3d9d48cb9eefd / Pages 31920895328 SUCCESS
  Album asset normal-success verification accepted; first-track intake gap subsequently closed by Build100

Build97 accepted predecessor'''
t=sub_once(t, r'Studio accepted\n.*?Build97 accepted predecessor', s, 'Safety overlay', re.S)
marker='After Build99 deployment candidate:\n'
if marker not in t: raise SystemExit('Safety Build99 restore marker missing')
t=t.replace(marker, 'After Build100 deployment candidate:\n  safety/post-build100-deployed-candidate-20260816\n  safety/post-build100-candidate-docs-closeout-20260816\n\nAfter Build100 real-user acceptance:\n  safety/post-build100-real-user-pass-20260816-2255\n\n'+marker, 1); write(p,t)

expected={'README.md','PROJECT_STATE.md','QA.md','CHANGELOG.md','ROADMAP.md','changelogs/CHANGELOG-BUILD100.md','docs/INTEGRATION_SAFETY.md'}
changed=set(subprocess.check_output(['git','diff','--name-only']).decode().splitlines())
if changed != expected: raise SystemExit(f'Unexpected changed files: {sorted(changed)}')
print('Build100 acceptance overlay prepared:', sorted(changed))
