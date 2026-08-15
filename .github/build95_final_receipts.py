from pathlib import Path
import re

ROOT = Path('.')


def load(path):
    return (ROOT / path).read_text(encoding='utf-8')


def save(path, text):
    (ROOT / path).write_text(text, encoding='utf-8')


def replace1(text, old, new, label):
    n = text.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected exactly one literal match, got {n}')
    return text.replace(old, new, 1)


def sub1(text, pattern, repl, label, flags=0):
    out, n = re.subn(pattern, repl, text, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f'{label}: expected exactly one regex replacement, got {n}')
    return out

acceptance_lines = """Candidate docs Pages  31911746874 · SUCCESS
Acceptance docs PR    #173
Acceptance docs CI    31912389047 · SUCCESS
Acceptance docs merge f6738d56eddcadc2810c7d5413700e14b20f71a3
Acceptance docs Pages 31912432617 · SUCCESS
"""

# README
p = 'README.md'
t = load(p)
t = replace1(
    t,
    'Candidate docs Pages  31911746874 · SUCCESS\nReal-user smoke       BUILD95 PASS MADAFAKA · 2026-08-16\n',
    acceptance_lines + 'Real-user smoke       BUILD95 PASS MADAFAKA · 2026-08-16\n',
    'README current receipts',
)
t = replace1(
    t,
    'Candidate docs Pages     31911746874 · SUCCESS\nSafety candidate docs    safety/post-build95-candidate-docs-closeout-20260815\nSafety post-acceptance   safety/post-build95-real-user-pass-20260816\n',
    'Candidate docs Pages     31911746874 · SUCCESS\nAcceptance docs PR       #173\nAcceptance docs CI       31912389047 · SUCCESS\nAcceptance docs merge    f6738d56eddcadc2810c7d5413700e14b20f71a3\nAcceptance docs Pages    31912432617 · SUCCESS\nSafety candidate docs    safety/post-build95-candidate-docs-closeout-20260815\nSafety post-acceptance   safety/post-build95-real-user-pass-20260816\nSafety docs pre-PR       safety/post-build95-rup-docs-prepr-20260816\nSafety docs green        safety/post-build95-rup-docs-green-premerge-20260816\nSafety docs closeout     safety/post-build95-rup-docs-closeout-20260816\n',
    'README detailed acceptance receipts',
)
save(p, t)

# PROJECT_STATE
p = 'PROJECT_STATE.md'
t = load(p)
t = sub1(t, r'^Updated: .*$', 'Updated: 2026-08-16 after **Build95 REAL USER PASS** and completed seven-document acceptance closeout; final receipts synchronized.', 'PROJECT_STATE updated', re.M)
t = replace1(
    t,
    'Candidate docs Pages    31911746874 · SUCCESS\nReal-user smoke         BUILD95 PASS MADAFAKA · 2026-08-16\n',
    'Candidate docs Pages    31911746874 · SUCCESS\nAcceptance docs PR      #173\nAcceptance docs CI      31912389047 · SUCCESS\nAcceptance docs merge   f6738d56eddcadc2810c7d5413700e14b20f71a3\nAcceptance docs Pages   31912432617 · SUCCESS\nReal-user smoke         BUILD95 PASS MADAFAKA · 2026-08-16\n',
    'PROJECT_STATE acceptance receipts',
)
t = replace1(
    t,
    'Build95 is the latest **accepted** Studio runtime. Build94 remains its accepted predecessor. Acceptance-docs CI/merge/Pages receipts are intentionally not fabricated before this docs branch passes its own gate.',
    'Build95 is the latest **accepted** Studio runtime. Build94 remains its accepted predecessor. The seven-document acceptance closeout passed CI `31912389047`, merged at `f6738d56eddcadc2810c7d5413700e14b20f71a3`, and Pages `31912432617` succeeded on that exact merge.',
    'PROJECT_STATE closeout sentence',
)
save(p, t)

# ROADMAP
p = 'ROADMAP.md'
t = load(p)
t = sub1(t, r'^Updated: .*$', 'Updated: 2026-08-16 after **Build95 REAL USER PASS** and completed acceptance-docs closeout.', 'ROADMAP updated', re.M)
t = replace1(
    t,
    '- candidate docs PR #172 / CI `31911702567` / merge `1bff0a18588b274a6cb0200cb6bd90b377b0c1af` / Pages `31911746874` SUCCESS;\n',
    '- candidate docs PR #172 / CI `31911702567` / merge `1bff0a18588b274a6cb0200cb6bd90b377b0c1af` / Pages `31911746874` SUCCESS;\n- acceptance docs PR #173 / CI `31912389047` / merge `f6738d56eddcadc2810c7d5413700e14b20f71a3` / Pages `31912432617` SUCCESS;\n',
    'ROADMAP acceptance receipt',
)
t = sub1(
    t,
    r'## In progress\n.*?\n## Next',
    """## In progress

### Post-Build95 fresh reliability audit

Build95 runtime, candidate-docs and seven-document acceptance closeouts are complete. No new implementation slice is allocated yet.

**Build96 remains UNALLOCATED.**

## Next""",
    'ROADMAP in-progress closeout',
    re.S,
)
save(p, t)

# QA
p = 'QA.md'
t = load(p)
t = sub1(t, r'^Updated: .*$', 'Updated: 2026-08-16 after explicit **Build95 REAL USER PASS** and completed acceptance-docs CI/merge/Pages closeout.', 'QA updated', re.M)
t = replace1(
    t,
    'Candidate docs Pages    31911746874 · SUCCESS\nSafety post-deploy      safety/post-build95-deployed-candidate-20260815\n',
    'Candidate docs Pages    31911746874 · SUCCESS\nAcceptance docs PR      #173\nAcceptance docs CI      31912389047 · SUCCESS\nAcceptance docs merge   f6738d56eddcadc2810c7d5413700e14b20f71a3\nAcceptance docs Pages   31912432617 · SUCCESS\nSafety post-deploy      safety/post-build95-deployed-candidate-20260815\n',
    'QA acceptance receipts',
)
save(p, t)

# CHANGELOG
p = 'CHANGELOG.md'
t = load(p)
t = replace1(
    t,
    'Candidate docs Pages     31911746874 · SUCCESS\nSafety post-deploy       safety/post-build95-deployed-candidate-20260815\n',
    'Candidate docs Pages     31911746874 · SUCCESS\nAcceptance docs PR       #173\nAcceptance docs CI       31912389047 · SUCCESS\nAcceptance docs merge    f6738d56eddcadc2810c7d5413700e14b20f71a3\nAcceptance docs Pages    31912432617 · SUCCESS\nSafety post-deploy       safety/post-build95-deployed-candidate-20260815\n',
    'CHANGELOG acceptance receipts',
)
save(p, t)

# Integration safety
p = 'docs/INTEGRATION_SAFETY.md'
t = load(p)
t = replace1(
    t,
    '  candidate docs PR #172 / CI 31911702567 / merge 1bff0a18588b274a6cb0200cb6bd90b377b0c1af / Pages 31911746874 SUCCESS\n  browser smoke BUILD95 PASS MADAFAKA / 2026-08-16\n',
    '  candidate docs PR #172 / CI 31911702567 / merge 1bff0a18588b274a6cb0200cb6bd90b377b0c1af / Pages 31911746874 SUCCESS\n  acceptance docs PR #173 / CI 31912389047 / merge f6738d56eddcadc2810c7d5413700e14b20f71a3 / Pages 31912432617 SUCCESS\n  browser smoke BUILD95 PASS MADAFAKA / 2026-08-16\n',
    'INTEGRATION overlay receipts',
)
t = replace1(
    t,
    'After Build95 explicit real-user acceptance:\n  safety/post-build95-real-user-pass-20260816\n```',
    'After Build95 explicit real-user acceptance:\n  safety/post-build95-real-user-pass-20260816\n\nAfter Build95 acceptance-docs closeout:\n  safety/post-build95-rup-docs-prepr-20260816\n  safety/post-build95-rup-docs-green-premerge-20260816\n  safety/post-build95-rup-docs-closeout-20260816\n```',
    'INTEGRATION closeout checkpoints',
)
save(p, t)

# Detailed Build95 changelog
p = 'changelogs/CHANGELOG-BUILD95.md'
t = load(p)
t = replace1(
    t,
    'Candidate docs Pages    31911746874 · SUCCESS · build + deploy on exact docs merge SHA\nSafety pre              safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815\n',
    'Candidate docs Pages    31911746874 · SUCCESS · build + deploy on exact docs merge SHA\nAcceptance docs PR      #173\nAcceptance docs CI      31912389047 · SUCCESS\nAcceptance docs merge   f6738d56eddcadc2810c7d5413700e14b20f71a3\nAcceptance docs Pages   31912432617 · SUCCESS · build + deploy on exact docs merge SHA\nSafety pre              safety/pre-phase9-albums-daily-resilient-convergence-build95-20260815\n',
    'BUILD95 changelog acceptance receipts',
)
t = replace1(
    t,
    'Build95 = REAL USER PASS / ACCEPTED\nBuild96 = UNALLOCATED pending fresh read-only audit',
    'Build95 = REAL USER PASS / ACCEPTED · seven-document closeout complete\nBuild96 = UNALLOCATED pending fresh read-only audit',
    'BUILD95 changelog accepted boundary',
)
save(p, t)

checks = {
    'README.md': ['Acceptance docs PR    #173', 'Acceptance docs Pages 31912432617 · SUCCESS'],
    'PROJECT_STATE.md': ['Acceptance docs PR      #173', 'completed seven-document acceptance closeout'],
    'ROADMAP.md': ['Post-Build95 fresh reliability audit', 'acceptance docs PR #173'],
    'QA.md': ['Acceptance docs CI      31912389047 · SUCCESS', 'completed acceptance-docs CI/merge/Pages closeout'],
    'CHANGELOG.md': ['Acceptance docs PR       #173', 'Acceptance docs Pages    31912432617 · SUCCESS'],
    'docs/INTEGRATION_SAFETY.md': ['acceptance docs PR #173 / CI 31912389047', 'safety/post-build95-rup-docs-closeout-20260816'],
    'changelogs/CHANGELOG-BUILD95.md': ['Acceptance docs PR      #173', 'seven-document closeout complete'],
}
for path, needles in checks.items():
    text = load(path)
    for needle in needles:
        if needle not in text:
            raise SystemExit(f'{path}: missing final receipt marker: {needle}')

for temp in [ROOT / '.github/build95_final_receipts.py', ROOT / '.github/workflows/build95-final-receipts-once.yml']:
    if temp.exists():
        temp.unlink()

print('Build95 final acceptance receipts patched and verified.')
