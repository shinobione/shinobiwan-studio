import { getAdminBridgeHealth } from './admin-api';
import {
  AlbumAdminError,
  getAdminAlbums,
  type AdminAlbumSummary,
  type AdminAlbumWriteResponse,
} from './album-admin-api';
import { studioConfig } from './config';

const DELETE_INTENT = 'album-delete-v1' as const;
const DELETE_TIMEOUT_MS = 30_000;

type AlbumDeleteResponse = AdminAlbumWriteResponse & {
  tracksReleased?: number;
  objectsDeleted?: number;
};

function baseUrl() {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function assertAlbumId(value: string) {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(value)) {
    throw new AlbumAdminError('Invalid canonical Album ID.', null, 'ALBUM_DELETE_INVALID_ID');
  }
}

function isJson(response: Response) {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

async function requireDeleteCapability() {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('album-delete')) {
    throw new AlbumAdminError('Track Manager does not advertise album-delete. Whole-Album deletion stays locked.', null, 'ALBUM_DELETE_UNSUPPORTED');
  }
}

async function canonicalSummary(albumId: string): Promise<AdminAlbumSummary | null> {
  const collection = await getAdminAlbums();
  return (collection.albums || []).find(album => album.id === albumId) || null;
}

async function deleteRequest(albumId: string, expectedUpdatedAt: string): Promise<AlbumDeleteResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), DELETE_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/albums/${encodeURIComponent(albumId)}/delete`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          intent: DELETE_INTENT,
          expectedUpdatedAt,
          confirmAlbumId: albumId,
        }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AlbumAdminError(
        timedOut
          ? 'Album deletion timed out. Studio will reread the canonical Album collection before any retry.'
          : 'Album deletion response was lost. Studio will reread the canonical Album collection before any retry.',
        null,
        timedOut ? 'ALBUM_DELETE_TIMEOUT' : 'ALBUM_DELETE_TRANSPORT',
        null,
        null,
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!isJson(response)) {
      throw new AlbumAdminError(
        'Cloudflare Access session is not available to whole-Album deletion.',
        response.status || null,
        'ALBUM_DELETE_ACCESS_SESSION_REQUIRED',
      );
    }

    let payload: AlbumDeleteResponse;
    try {
      payload = await response.json() as AlbumDeleteResponse;
    } catch (reason) {
      if (reason instanceof TypeError || (reason instanceof DOMException && reason.name === 'AbortError')) {
        throw new AlbumAdminError(
          'Album deletion response body was interrupted. Studio will reread canonical Album state before any retry.',
          null,
          'ALBUM_DELETE_TRANSPORT',
          null,
          null,
          null,
          null,
          false,
          reason instanceof Error ? reason.message : String(reason),
        );
      }
      throw new AlbumAdminError('Track Manager returned invalid JSON for Album deletion.', response.status || null, 'ALBUM_DELETE_INVALID_RESPONSE');
    }

    if (!response.ok || payload.ok === false) {
      throw new AlbumAdminError(
        payload.error || `Track Manager Album deletion returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'ALBUM_DELETE_REJECTED',
        payload.currentUpdatedAt || null,
        payload.rollback || null,
        payload.quality || null,
        payload.verificationDetail || null,
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function deleteAdminAlbumResilient(albumId: string, expectedUpdatedAt: string): Promise<AlbumDeleteResponse> {
  assertAlbumId(albumId);
  if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.', null, 'ALBUM_DELETE_REVISION_REQUIRED');
  await requireDeleteCapability();

  const before = await canonicalSummary(albumId);
  if (!before) {
    throw new AlbumAdminError('The canonical Album is already absent. Reload instead of issuing another destructive write.', 409, 'ALBUM_DELETE_ALREADY_MISSING', null, null, null, null, false);
  }
  if (before.updatedAt !== expectedUpdatedAt) {
    throw new AlbumAdminError('The Album changed before deletion began. Reload before another write.', 409, 'ALBUM_DELETE_STALE', before.updatedAt || null, null, null, null, false);
  }

  let payload: AlbumDeleteResponse;
  try {
    payload = await deleteRequest(albumId, expectedUpdatedAt);
  } catch (reason) {
    if (!(reason instanceof AlbumAdminError) || !['ALBUM_DELETE_TIMEOUT', 'ALBUM_DELETE_TRANSPORT'].includes(reason.code || '')) throw reason;

    let after: AdminAlbumSummary | null;
    try {
      after = await canonicalSummary(albumId);
    } catch (rereadReason) {
      throw new AlbumAdminError(
        'The Album deletion response and canonical collection reread are both unavailable. Do not retry until Track Manager access is restored.',
        null,
        'ALBUM_DELETE_UNVERIFIED',
        null,
        null,
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }

    if (!after) {
      return {
        ok: true,
        deleted: true,
        albumId,
        previousUpdatedAt: expectedUpdatedAt,
        clientVerified: true,
        recoveredAfterTransportFailure: true,
        retrySafe: false,
        verificationWarning: null,
        technicalDetails: `${reason.code}: response lost; canonical Album collection proves the Album is absent. Studio did not retry the delete.`,
      };
    }

    if (after.updatedAt === expectedUpdatedAt) {
      throw new AlbumAdminError(
        'Canonical Album reread proves the deletion did not commit. The Album still exists at the original revision; an explicit retry is safe after connectivity or Access is restored.',
        null,
        'ALBUM_DELETE_NOT_COMMITTED',
        after.updatedAt || expectedUpdatedAt,
        null,
        null,
        null,
        true,
        reason.technicalDetails,
      );
    }

    throw new AlbumAdminError(
      'Canonical Album state changed while the delete response was unavailable, but Studio cannot prove this deletion caused the change. Do not retry.',
      null,
      'ALBUM_DELETE_AMBIGUOUS',
      after.updatedAt || null,
      null,
      null,
      null,
      false,
      reason.technicalDetails,
    );
  }

  if (!payload.deleted || payload.albumId !== albumId) {
    throw new AlbumAdminError('Track Manager returned an invalid whole-Album delete response.', null, 'ALBUM_DELETE_INVALID_RESPONSE');
  }

  let after: AdminAlbumSummary | null;
  try {
    after = await canonicalSummary(albumId);
  } catch (reason) {
    throw new AlbumAdminError(
      'Track Manager reported Album deletion success, but Studio could not complete the canonical collection reread. Do not retry until Album Management is reloaded.',
      null,
      'ALBUM_DELETE_UNVERIFIED',
      null,
      null,
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }

  if (after) {
    throw new AlbumAdminError(
      'Track Manager reported Album deletion success, but the canonical Album still exists. Do not retry.',
      null,
      'ALBUM_DELETE_AMBIGUOUS',
      after.updatedAt || null,
      payload.rollback || null,
      null,
      null,
      false,
    );
  }

  return {
    ...payload,
    clientVerified: true,
    recoveredAfterTransportFailure: false,
    retrySafe: false,
    verificationWarning: null,
  };
}

export const albumDeletePolicy = Object.freeze({
  intent: DELETE_INTENT,
  transport: 'Track Manager v5.26 · bridge v1.16',
  authority: 'private-track-manager-only',
  confirmation: 'exact-canonical-album-id',
  expectedRevisionRequired: true,
  successVerification: 'private-canonical-album-collection-absence',
  lostResponsePolicy: 'canonical-reread-no-blind-retry',
  maxAutomaticDeleteRetries: 0,
});
