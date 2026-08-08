# Phase 4B.1A — Metadata validation preview

SHINOBIWAN Studio `0.4.1` / Build `6` consumes the validation-only metadata endpoint introduced by LaunchPAD Build `2026.08.08.66`, Track Manager `v5.9`, Studio bridge `v1.1`.

## Production dependency

Validated upstream source:

- LaunchPAD merge SHA: `e30e6665566d5d1e4475ab24b92833a859e2d110`
- LaunchPAD release: `studio-metadata-validation-20260808`
- Track Manager: `v5.9`
- deployed private Worker Version ID: `59ef19af-e189-42d3-ba08-bb5303bb75c1`
- public Worker: unchanged `v2.6`
- R2/catalog rebuild: not performed

## Endpoint

```text
POST /api/studio/tracks/<trackId>/metadata/validate
```

Required browser contract:

```text
Origin: https://shinobione.github.io
Content-Type: application/json
X-Shinobiwan-Studio-Intent: metadata-validate-v1
credentials: include
```

Payload:

```json
{
  "expectedUpdatedAt": "canonical manifest updatedAt",
  "metadata": {
    "title": "...",
    "status": "draft",
    "type": "single"
  }
}
```

`expectedUpdatedAt` is mandatory. If the canonical manifest changed since the workspace loaded, the server returns HTTP `409` with `STALE_MANIFEST` and Studio requires a reload before another validation attempt.

## Allowed metadata only

Build 6 exposes the same whitelist accepted by the Track Manager validation contract:

- title;
- status;
- type;
- year;
- releaseDate;
- album;
- genres;
- tags;
- moods;
- themes;
- era;
- energy;
- languages;
- bpm;
- key;
- keyConfidence;
- explicit;
- accent;
- accent2.

The Studio does not submit slug/trackId replacement, assets, duration, migration/provenance, timestamps or unknown fields.

## UI behavior

The Metadata tab is a local proposal editor.

1. Load canonical private track state.
2. Edit fields locally in browser memory.
3. Click **Validate metadata**.
4. Track Manager normalizes the proposal and runs its existing quality inspection against current R2 objects.
5. Studio displays changed fields, normalized preview, quality state, publishability, errors and warnings.
6. The proposal remains **not saved**.

When Studio is operating on `PUBLIC FALLBACK`, validation is disabled because the public projection cannot guarantee the canonical manifest revision.

## Non-write guarantee

Build 6 deliberately exposes no production mutation CTA or client wrapper for:

- manifest save;
- asset upload/replacement;
- delete;
- publish;
- thumbnail write;
- catalog rebuild.

`adminService.writesEnabled` remains `false`. The only explicit client method is one `POST` for validation. There is no `PUT`, `PATCH` or `DELETE` client method.

The production build regression guard checks these invariants before Vite compilation.

## Rollback

Preferred rollback is a normal revert of the Studio Build 6 PR. The upstream Track Manager validation endpoint can remain deployed because Build 6 is only a consumer and the endpoint itself is non-mutating.

Safety references created before Phase 4B.1A remain available. No R2 rollback is required by this Studio release because it cannot write production state.
