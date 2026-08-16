from pathlib import Path
import subprocess

def rw(path, old, new, label):
    p=Path(path); t=p.read_text(encoding='utf-8'); n=t.count(old)
    if n!=1: raise SystemExit(f'{label}: expected one marker, found {n}')
    p.write_text(t.replace(old,new,1),encoding='utf-8')

receipt='''Acceptance docs PR     #189
Acceptance docs CI     31972354459 · SUCCESS
Acceptance docs merge  453191f3ee8e3ae875c3d402f4427c1208d542dd
Acceptance docs Pages  31972413696 · SUCCESS
'''

rw('README.md','Candidate docs Pages  31945131271 · SUCCESS\nReal-user smoke', 'Candidate docs Pages  31945131271 · SUCCESS\n'+receipt+'Real-user smoke','README receipts')
rw('PROJECT_STATE.md','Updated: 2026-08-16 after explicit **Build100 REAL USER PASS**; acceptance-docs receipts are being closed out without runtime changes.','Updated: 2026-08-16 after **Build100 REAL USER PASS** and completed acceptance-docs CI/merge/Pages closeout.','PROJECT_STATE updated')
rw('PROJECT_STATE.md','Candidate docs Pages    31945131271 · SUCCESS\nReal-user smoke','Candidate docs Pages    31945131271 · SUCCESS\nAcceptance docs PR      #189\nAcceptance docs CI      31972354459 · SUCCESS\nAcceptance docs merge   453191f3ee8e3ae875c3d402f4427c1208d542dd\nAcceptance docs Pages   31972413696 · SUCCESS\nReal-user smoke','PROJECT_STATE receipts')
rw('QA.md','Candidate docs Pages    31945131271 · SUCCESS\nSafety post-deploy','Candidate docs Pages    31945131271 · SUCCESS\nAcceptance docs PR      #189\nAcceptance docs CI      31972354459 · SUCCESS\nAcceptance docs merge   453191f3ee8e3ae875c3d402f4427c1208d542dd\nAcceptance docs Pages   31972413696 · SUCCESS\nSafety post-deploy','QA receipts')
rw('CHANGELOG.md','Candidate docs Pages #195 31945131271 · SUCCESS\nSafety post-deploy','Candidate docs Pages #195 31945131271 · SUCCESS\nAcceptance docs PR       #189\nAcceptance docs CI #505  31972354459 · SUCCESS\nAcceptance docs merge    453191f3ee8e3ae875c3d402f4427c1208d542dd\nAcceptance Pages #196    31972413696 · SUCCESS\nSafety post-deploy','CHANGELOG receipts')
rw('ROADMAP.md','- candidate docs PR #188 / CI `31945020130` / merge `2ddce2be6abba8324c64054702f0e7654831c83b` / Pages `31945131271` SUCCESS;','- candidate docs PR #188 / CI `31945020130` / merge `2ddce2be6abba8324c64054702f0e7654831c83b` / Pages `31945131271` SUCCESS;\n- acceptance docs PR #189 / CI `31972354459` / merge `453191f3ee8e3ae875c3d402f4427c1208d542dd` / Pages `31972413696` SUCCESS;','ROADMAP receipts')
rw('changelogs/CHANGELOG-BUILD100.md','Candidate docs Pages #195  31945131271 · SUCCESS / SUCCESS\nSafety post-deploy','Candidate docs Pages #195  31945131271 · SUCCESS / SUCCESS\nAcceptance docs PR         #189\nAcceptance docs CI #505    31972354459 · SUCCESS\nAcceptance docs merge      453191f3ee8e3ae875c3d402f4427c1208d542dd\nAcceptance docs Pages #196 31972413696 · SUCCESS / SUCCESS\nSafety post-deploy','Build100 detailed receipts')
rw('changelogs/CHANGELOG-BUILD100.md','Build101 remains **UNALLOCATED** pending acceptance-docs closeout and a fresh bounded post-Build100 audit.','Build101 remains **UNALLOCATED** pending a fresh bounded post-Build100 audit.','Build100 pending line')
rw('docs/INTEGRATION_SAFETY.md','  candidate docs PR #188 / CI 31945020130 / merge 2ddce2be6abba8324c64054702f0e7654831c83b / Pages 31945131271 SUCCESS\n  browser smoke','  candidate docs PR #188 / CI 31945020130 / merge 2ddce2be6abba8324c64054702f0e7654831c83b / Pages 31945131271 SUCCESS\n  acceptance docs PR #189 / CI 31972354459 / merge 453191f3ee8e3ae875c3d402f4427c1208d542dd / Pages 31972413696 SUCCESS\n  browser smoke','Safety receipts')
rw('docs/INTEGRATION_SAFETY.md','After Build100 real-user acceptance:\n  safety/post-build100-real-user-pass-20260816-2255\n','After Build100 real-user acceptance:\n  safety/post-build100-real-user-pass-20260816-2255\n  safety/post-build100-acceptance-docs-pages-20260816-2305\n','Safety checkpoint')

expected={'README.md','PROJECT_STATE.md','QA.md','CHANGELOG.md','ROADMAP.md','changelogs/CHANGELOG-BUILD100.md','docs/INTEGRATION_SAFETY.md'}
changed=set(subprocess.check_output(['git','diff','--name-only']).decode().splitlines())
if changed!=expected: raise SystemExit(f'Unexpected changed files: {sorted(changed)}')
print('Build100 final receipts prepared:', sorted(changed))
