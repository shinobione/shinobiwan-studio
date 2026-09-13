import { getAdminBridgeHealth, getAdminTracks, type AdminTracksResponse } from './admin-api';
import { Phase4AdminError } from './phase4-admin-api';
import { studioConfig } from './config';

const CATALOG_REBUILD_INTENT = 'catalog-rebuild-v1';
const CATALOG_REBUILD_TIMEOUT_MS = 30000;

export interface CatalogProjectionIdentityState {
  present?: boolean;
  valid?: boolean;
  schemaVersion?: number | null;
  generatedAt?: string | null;
  generationId?: string | null;
  count?: number | null;
}

interface AdminTracksWithCatalogProjection extends AdminTracksResponse {
  catalogProjection?: CatalogProjectionIdentityState | null;
}

export interface CatalogRebuildIdentityResponse {
  ok?: boolean;
  rebuilt?: boolean;
  operationId?: string | null;
  catalogGenerationId?: string | null;
  catalogGeneratedAt?: string | null;
  catalogCount?: number | null;
  authenticatedEmail?: string | null;
  error?: string;
  code?: string;
  clientVerified?: boolean;
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  technicalDetails?: string | null;
}

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function newOperationId(): string {
  const operationId = globalThis.crypto?.randomUUID?.();
  if (!operationId) throw new Phase4AdminError('This browser cannot create a secure catalog rebuild operation identity.', null, 'CATALOG_REBUILD_OPERATION_ID_UNAVAILABLE');
  return operationId.toLowerCase();
}

async function requireCatalogRebuildCapability(): Promise<void> {
  const health = await getAdminBridgeHealth();
  const manage = health.capabilities?.manage ?? [];
  if (!manage.includes('catalog-rebuild')) {
    throw new Phase4AdminError('Track Manager does not advertise catalog-rebuild. This operation stays locked until the required bridge capability is active.');
  }
}

async function postCatalogRebuild(operationId: string): Promise<CatalogRebuildIdentityResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), CATALOG_REBUILD_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/catalog/rebuild`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: JSON.stringify({
          intent: CATALOG_REBUILD_INTENT,
          confirm: 'REBUILD',
          operationId,
        }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new Phase4AdminError(
        timedOut
          ? 'Catalog rebuild timed out after submission. Studio will reread the private canonical catalog generation before deciding whether any retry is safe.'
          : 'Catalog rebuild transport was interrupted after submission. Studio will reread the private canonical catalog generation before deciding whether any retry is safe.',
        null,
        timedOut ? 'CATALOG_REBUILD_TIMEOUT' : 'CATALOG_REBUILD_TRANSPORT',
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!isJsonResponse(response)) {
      throw new Phase4AdminError('Cloudflare Access did not return an authenticated JSON response for catalog rebuild.', response.status || null, 'ACCESS_SESSION_REQUIRED');
    }

    let payload: CatalogRebuildIdentityResponse;
    try {
      payload = await response.json() as CatalogRebuildIdentityResponse;
    } catch {
      throw new Phase4AdminError('Track Manager returned invalid catalog rebuild JSON. Do not retry until canonical catalog state is reloaded.', response.status || null, 'CATALOG_REBUILD_INVALID_RESPONSE');
    }

    if (!response.ok || payload.ok === false) {
      throw new Phase4AdminError(
        payload.error || `Catalog rebuild returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'CATALOG_REBUILD_REJECTED',
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function readCanonicalCatalogProjection(): Promise<CatalogProjectionIdentityState> {
  const payload = await getAdminTracks() as AdminTracksWithCatalogProjection;
  const state = payload.catalogProjection;
  if (!state?.present || state.valid !== true) {
    throw new Phase4AdminError(
      'Track Manager private read did not expose a valid canonical catalog projection.',
      null,
      'CATALOG_REBUILD_CANONICAL_STATE_UNAVAILABLE',
    );
  }
  return state;
}

function sameGeneration(state: CatalogProjectionIdentityState, operationId: string): boolean {
  return state.generationId?.toLowerCase() === operationId;
}

export async function rebuildAdminCatalog(): Promise<CatalogRebuildIdentityResponse> {
  await requireCatalogRebuildCapability();
  const operationId = newOperationId();

  let payload: CatalogRebuildIdentityResponse;
  try {
    payload = await postCatalogRebuild(operationId);
  } catch (reason) {
    if (!(reason instanceof Phase4AdminError) || !['CATALOG_REBUILD_TIMEOUT', 'CATALOG_REBUILD_TRANSPORT'].includes(reason.code || '')) throw reason;

    try {
      const state = await readCanonicalCatalogProjection();
      if (sameGeneration(state, operationId)) {
        return {
          ok: true,
          rebuilt: true,
          operationId,
          catalogGenerationId: state.generationId || operationId,
          catalogGeneratedAt: state.generatedAt || null,
          catalogCount: state.count ?? null,
          clientVerified: true,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          technicalDetails: `${reason.code}: response lost; private canonical reread verified generationId ${operationId}.`,
        };
      }

      throw new Phase4AdminError(
        'Catalog rebuild response was lost and the current private canonical catalog carries a different generation identity. The requested rebuild may have failed or may already have been superseded. Do not retry blindly.',
        null,
        'CATALOG_REBUILD_AMBIGUOUS',
        null,
        null,
        false,
        `${reason.code}: requested=${operationId}; canonical=${state.generationId || 'none'}; generatedAt=${state.generatedAt || 'unknown'}.`,
      );
    } catch (recoveryReason) {
      if (recoveryReason instanceof Phase4AdminError && recoveryReason.code === 'CATALOG_REBUILD_AMBIGUOUS') throw recoveryReason;
      throw new Phase4AdminError(
        'Catalog rebuild response was lost and Studio could not verify private canonical catalog generation state. Do not retry until Track Manager access is restored and the catalog is reloaded.',
        null,
        'CATALOG_REBUILD_UNVERIFIED',
        null,
        null,
        false,
        [reason.code, reason.technicalDetails, recoveryReason instanceof Error ? recoveryReason.message : String(recoveryReason)].filter(Boolean).join(' · '),
      );
    }
  }

  if (!payload.rebuilt || payload.operationId?.toLowerCase() !== operationId || payload.catalogGenerationId?.toLowerCase() !== operationId) {
    throw new Phase4AdminError(
      'Track Manager returned catalog rebuild success without the exact requested generation identity. Do not retry.',
      null,
      'CATALOG_REBUILD_IDENTITY_MISMATCH',
      null,
      null,
      false,
      `requested=${operationId}; responseOperation=${payload.operationId || 'none'}; responseGeneration=${payload.catalogGenerationId || 'none'}.`,
    );
  }

  try {
    const state = await readCanonicalCatalogProjection();
    const countMatches = payload.catalogCount == null || state.count == null || payload.catalogCount === state.count;
    if (!sameGeneration(state, operationId) || !countMatches) {
      throw new Phase4AdminError(
        'Track Manager reported catalog rebuild success, but the private canonical reread no longer matches that generation identity. Another generation may have superseded it. Do not retry blindly.',
        null,
        'CATALOG_REBUILD_SUPERSEDED',
        null,
        null,
        false,
        `requested=${operationId}; canonical=${state.generationId || 'none'}; responseCount=${payload.catalogCount ?? 'n/a'}; canonicalCount=${state.count ?? 'n/a'}.`,
      );
    }

    return {
      ...payload,
      clientVerified: true,
      recoveredAfterTransportFailure: false,
      retrySafe: false,
    };
  } catch (reason) {
    if (reason instanceof Phase4AdminError) throw reason;
    throw new Phase4AdminError(
      'Track Manager reported catalog rebuild success, but Studio could not complete the private canonical generation reread. Do not retry until the catalog can be inspected.',
      null,
      'CATALOG_REBUILD_UNVERIFIED',
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }
}

export const catalogRebuildIdentityPolicy = Object.freeze({
  intent: CATALOG_REBUILD_INTENT,
  operationIdentity: 'browser-uuid-v4',
  canonicalProof: 'private-catalog-generation-id',
  maxAutomaticWriteRetries: 0,
  lostResponsePolicy: 'reread-generation-id-no-blind-retry',
});
