# Build117 candidate — exact-byte Track asset upload proof

Studio target: `v0.19.39 · Build117`

Backend prerequisite: Track Manager `v5.28` / Studio bridge `v1.18` from LaunchPAD PR #282.

Contract:

- hash the selected browser `File` with SHA-256 before any upload POST;
- send the lowercase 64-character digest inside existing `asset-upload-v1` multipart data;
- normal success requires selected digest == response digest == private canonical asset digest;
- lost-response recovery requires a new canonical revision plus exact digest match;
- unchanged revision is NOT COMMITTED / explicit retry safe;
- changed revision with missing/different digest is AMBIGUOUS / do not retry;
- zero blind automatic upload retries;
- digest evidence remains private and does not alter public projection;
- scope is Track asset uploads only.

Corrective before merge:

- real Studio use on Build116 exposed a stale bounded duration-evidence allowlist: Track Manager v5.27 / bridge v1.17 was rejected even though v5.26+ successors inherit the same duration-evidence metadata contract;
- Build117 explicitly authorizes the inherited bounded successor pairs v5.26/v1.16, v5.27/v1.17 and v5.28/v1.18 in both validation and resilient save seams;
- regression guards now require those exact pairs and still reject an unbounded numeric version gate;
- LaunchPAD admin deployment #49 (run 35435618374) deployed main SHA 4867a2fef673028b0474f949183944dd642af165 with private Worker verification green; public Worker deployment stayed skipped.
