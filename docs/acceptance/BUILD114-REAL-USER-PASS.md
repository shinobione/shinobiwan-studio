# Build114 — REAL USER PASS

Date: 2026-09-13

Build114 is accepted after production deployment and real-user smoke.

## Runtime

- Studio: `v0.19.36 · Build114`
- Codename: `studio-focus-build114-album-create-operation-identity`
- Studio PR: #226
- Candidate head: `280c696c483ae3a27e9481f80217cd3b1822a398`
- Studio validation CI: #723 · SUCCESS
- Studio merge: `e95455a3e703ef3799099345829677e03f4ef98f`
- Studio Pages: #244 · run `34777488609` · build/deploy SUCCESS

## Backend

- LaunchPAD / Track Manager PR #277 merged for Album-create operation identity.
- Track Manager: v5.25
- Studio bridge: v1.15
- Initial admin deploy: #45 · SUCCESS.

## Real-user smoke and corrective

The first real-user Album-create smoke correctly exposed a canonical reread mismatch:

`year requested=null canonical=0`

Root cause: the canonical Album read normalizer coerced an explicit `null` year through `Number(null)`, producing `0`.

Build114 stayed unaccepted while the corrective was made.

Corrective evidence:

- LaunchPAD PR #278: `Build114 corrective: preserve null Album year`
- corrective merge: `282cd70c465a45424c843c18f9fbbe035b8c4982`
- post-merge LaunchPAD / Worker / overflow / Pages validation: SUCCESS
- Cloudflare admin deployment #46 · run `34782842452` · SUCCESS
- private Track Manager deployed and Cloudflare Access verified
- public media Worker intentionally skipped

Final smoke created `build114-smoke-2` with the year left blank. Studio showed `Year TBD`, the Album existed after canonical reload, and the user reported: **`114 SMOKED`**.

## Accepted contract

- one browser UUID per explicit Album create action;
- UUID is sent only on Album create;
- backend validates and stores it as private immutable `creationOperationId`;
- private canonical Album reread returns the identity;
- a lost create response is resolved by bounded canonical reread, never by blind second POST;
- exact identity match is required before Studio claims the create committed;
- legacy Albums remain readable without creation identity;
- public Album projection never exposes private creation identity;
- blank / omitted Album year remains canonical `null`, never `0`.

Build114 is therefore **COMPLETE · REAL USER PASS**.
