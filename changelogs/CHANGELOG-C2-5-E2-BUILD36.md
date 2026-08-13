# SHINOBIWAN Studio — v0.12.1 / Build 36

Codename: `phase-ux-c2-5-e2-migration-review-pack`

Status: **C2.5-E2 review tooling. Read-only additions only; no Album migration is performed by deploy, page load, export or copy actions.**

## Added
- migration readiness summary: ready / blocked / already canonical / Singles count;
- shortened per-Album state-token fingerprint for review correlation;
- local `Download dry-run JSON` export of the exact live read-only plan;
- `Copy review summary` text that intentionally excludes state tokens while preserving membership/order, blockers and warnings;
- explicit warning that downloaded JSON contains private catalog metadata and migration state tokens;
- responsive review-pack styling;
- dedicated regression guard for the read-only review/export surface.

## Preserved
- Track Manager v5.18 / Studio bridge v1.10 remains the sole migration authority;
- migration POST intent remains `album-migration-apply-v1`;
- exact typed `MIGRATE <album-id>` confirmation remains required;
- stale state token remains required by Track Manager;
- one-Album-at-a-time only;
- no batch migration / no `Migrate all`;
- Singles stays transitional and locked;
- no automatic production R2 mutation;
- C2.5-F, SonicTrace C3 and Phase 7 remain NOT STARTED.

## Purpose
Build 36 is designed to make the first production dry-run auditable before any write. The exported JSON can be reviewed offline and compared with the immutable migration plan, while the copyable summary is safe for discussion because it omits the state tokens required to authorize an apply.
