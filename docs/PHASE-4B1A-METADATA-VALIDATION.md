# Phase 4B.1A — Metadata validation preview

SHINOBIWAN Studio `0.4.2` / Build `7` consumes the non-mutating metadata-validation endpoint exposed by Track Manager `v5.10` / Studio bridge `v1.2` while LaunchPAD public application code remains Build `2026.08.08.66`.

## Production dependency

Current validated/deployed upstream state:

- LaunchPAD public build: `2026.08.08.66`
- LaunchPAD public release: `studio-metadata-validation-20260808`
- Track Manager hotfix PR: `#159`
- Track Manager hotfix merge SHA: `c7cf9ae7ad78e6407dfc6950b3c5a558e2f7bb0b`
- Track Manager: `v5.10`
- Studio bridge: `v1.2`
- deployed private Worker Version ID: `5ac91e36-9060-4e05-a76c-67c46459c72d`
- protected deployment run: `31260738818`
- deployment target: `admin` only
- public Worker: unchanged `v2.6`, deploy steps skipped
- Cloudflare Access smoke test: protected (`302` unauthenticated)
- R2/catalog rebuild: not performed

## Endpoint

```text
POST /api/studio/tracks/<trackId>/metadata/validate
```

Exact browser origin:

```text
https://shinobione.github.io
```

### Build 7 browser transport

Studio Build 7 deliberately sends a CORS-safelisted simple request:

```text
Content-Type: text/plain;charset=UTF-8
Accept: application/json
credentials: include
```

Payload body remains JSON text:

```json
{
  "intent": "metadata-validate-v1",
  "expectedUpdatedAt": "canonical manifest updatedAt",
  "metadata": {
    "title": "...",
    "status": "draft",
    "type": "single"
  }
}
```

The `intent` value is mandatory. Moving it into the body preserves the application-level intent guard without requiring a custom request header.

### Why Build 6 failed in real Chrome

Build 6 used:

```text
Content-Type: application/json
X-Shinobiwan-Studio-Intent: metadata-validate-v1
```

That combination forces an OPTIONS CORS preflight. Real-browser testing showed the authenticated `PRIVATE READ` GET flow working while metadata validation failed before the Worker returned JSON. Cloudflare Access sits in front of the Worker and can intercept that preflight before the Worker CORS handler.

Track Manager v5.10 therefore supports two validation transports:

1. the old JSON/custom-header mode for backward compatibility;
2. the new `text/plain` simple-request mode used by Studio Build 7.

Studio Build 7 uses only mode 2. Its regression guard fails if `X-Shinobiwan-Studio-Intent` or validation `Content-Type: application/json` is reintroduced.

## Stale-manifest protection

`expectedUpdatedAt` is mandatory. If the canonical manifest changed since the workspace loaded, the server returns HTTP `409` with `STALE_MANIFEST` and Studio requires a reload before another validation attempt.

This guard is unchanged by the transport hotfix.

## Allowed metadata only

Build 7 exposes the same whitelist accepted by the Track Manager validation contract:

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

Studio does not submit slug/trackId replacement, assets, duration, migration/provenance, timestamps or unknown fields.

## UI behavior

The Metadata tab remains a local proposal editor.

1. Load canonical private track state.
2. Edit fields locally in browser memory.
3. Click **Validate metadata**.
4. Track Manager normalizes the proposal and runs its existing quality inspection against current R2 objects.
5. Studio displays changed fields, normalized preview, quality state, publishability, errors and warnings.
6. The proposal remains **not saved**.

When Studio is operating on `PUBLIC FALLBACK`, validation remains disabled because the public projection cannot guarantee the canonical manifest revision.

## Non-write guarantee

Build 7 deliberately exposes no production mutation CTA or client wrapper for:

- manifest save;
- asset upload/replacement;
- delete;
- publish;
- thumbnail write;
- catalog rebuild.

`adminService.writesEnabled` remains `false`. The client exposes exactly one explicit `POST`, only for `/metadata/validate`. There is no `PUT`, `PATCH` or `DELETE` client method.

The upstream v5.10 endpoint itself remains `validationOnly: true` and contains no manifest/catalog/R2 mutation primitive. All other Track Manager write routes keep their historical same-origin guard.

## Regression guard

`npm run build` executes `scripts/check-private-read-contract.mjs` before TypeScript and Vite. Build 7 guards all of the following:

- `credentials: include` remains present;
- validation stays on `text/plain;charset=UTF-8`;
- `intent: metadata-validate-v1` remains in the request body;
- the custom intent request header is absent;
- validation `application/json` content type is absent;
- exactly one explicit POST client path exists;
- no PUT/PATCH/DELETE client path exists;
- no save/delete/publish/rebuild route appears in the Studio admin client;
- `writesEnabled: false` remains explicit;
- version/build/codename remain synchronized.

## Rollback

Fresh pre-hotfix safety snapshots exist in both repositories:

```text
safety/pre-cors-hotfix-20260808-1540
```

Studio rollback is a normal revert of the Build 7 PR. Backend rollback is independent: redeploy the private admin Worker from the LaunchPAD safety snapshot if required.

No R2 rollback is required because Studio Build 7 and Track Manager v5.10 metadata validation are non-mutating.
