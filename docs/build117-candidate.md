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
