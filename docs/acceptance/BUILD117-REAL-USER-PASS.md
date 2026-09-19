# Build117 — REAL USER PASS

Date: 2026-09-19

Build117 is accepted after the Track asset exact-byte SHA-256 candidate, a pre-merge duration-evidence compatibility corrective, verified backend deployment, Studio deployment, and real-user production smoke.

## Runtime

- Studio: `v0.19.39 · Build117`
- Codename: `studio-focus-build117-track-asset-sha256`
- Studio PR: #234
- Final Studio candidate head: `b843acf030195b726725af2d0f7e148607b8b9bb`
- Final Studio validation CI: #737 · SUCCESS
- Studio merge: `a1f7641a3e2d39fe24ee6b6a51438fb8a1c88ae4`
- Studio Pages deploy: #253 · SUCCESS

## Backend

- LaunchPAD / Track Manager PR #282 merged for exact-byte Track asset SHA-256 proof.
- Backend merge: `4867a2fef673028b0474f949183944dd642af165`
- Track Manager: v5.28
- Studio bridge: v1.18
- Cloudflare admin deploy: #49 · run `35435618374` · SUCCESS
- private Track Manager Worker deployed and verified
- public media Worker intentionally skipped

## Accepted Track asset upload contract

- Studio computes SHA-256 from the exact browser-selected `File` before upload;
- digest is sent inside the existing `asset-upload-v1` multipart request;
- Track Manager validates the lowercase 64-character SHA-256 digest and stores it as private R2 custom metadata;
- backend reread requires the stored digest to match before success;
- private Track asset state exposes the digest to Studio; public projection does not depend on it;
- normal success requires selected digest == response digest == private canonical digest;
- lost-response recovery may report COMMITTED only when a new canonical revision carries the exact selected digest;
- unchanged revision means NOT COMMITTED / explicit retry safe;
- changed state with missing or different digest means AMBIGUOUS / do not retry;
- automatic upload retries remain zero.

## Pre-merge corrective

Real Studio use on Build116 exposed a stale bounded duration-evidence compatibility list. The active Track Manager v5.27 / bridge v1.17 inherited the same guarded duration-evidence contract, but Studio still allowed only successors through v5.25 / v1.15.

Build117 stayed unmerged while that regression was corrected.

The final Build117 candidate now explicitly authorizes these bounded successor pairs in both duration-aware validation and resilient metadata save:

- v5.26 / v1.16
- v5.27 / v1.17
- v5.28 / v1.18

Regression guards require those exact pairs and continue to reject an unbounded numeric `>=` compatibility gate.

## Real-user smoke

After backend v5.28 / bridge v1.18 and Studio Build117 were deployed, the user hard-refreshed production and repeated the affected metadata validation flow on the existing Track workspace. The stale `DURATION_EVIDENCE_BRIDGE_REQUIRED` error was gone and the user reported **`SMOKED`**.

The production smoke specifically confirms the corrective and current cross-stack compatibility. The exact-byte Track upload proof itself remains covered by the Build117 backend + Studio regression suite and canonical reread contract.

Build117 is therefore **COMPLETE · REAL USER PASS**.
