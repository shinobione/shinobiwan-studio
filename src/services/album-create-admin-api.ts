import { getAdminBridgeHealth } from './admin-api';
import {
  AlbumAdminError,
  getAdminAlbum,
  type AdminAlbumManifest,
  type AdminAlbumMetadataPatch,
  type AdminAlbumWriteResponse,
} from './album-admin-api';
import { studioConfig } from './config';

type AlbumCreateManifest = AdminAlbumManifest & { creationOperationId?: string };
type AlbumCreateResponse = AdminAlbumWriteResponse & {
  operationId?: string;
  album?: AlbumCreateManifest;
};

function baseUrl() {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function isJson(response: Response) {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function validAlbumId(value: string) {
  return /^[a-z0-9][a-z0-9-]{0,119}$/.test(value);
}

function metadataMismatch(manifest: AlbumCreateManifest | undefined, expected: AdminAlbumMetadataPatch) {
  if (!manifest) return Object.keys(expected);
  return (Object.keys(expected) as Array<keyof AdminAlbumMetadataPatch>).filter(key =>
    JSON.stringify(manifest[key] ?? null) !== JSON.stringify(expected[key] ?? null));
}

async function requireCreateManage() {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('album-create')) {
    throw new AlbumAdminError('Track Manager does not advertise album-create. The Album write stays locked.');
  }
}

async function postAlbumCreate(
  operationId: string,
  album: { id: string } & AdminAlbumMetadataPatch,
): Promise<AlbumCreateResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 15000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/albums`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: 'album-create-v1', operationId, album }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AlbumAdminError(
        timedOut
          ? 'Album create timed out. Studio will check private canonical creation evidence.'
          : 'Album create response was lost. Studio will check private canonical creation evidence.',
        null,
        timedOut ? 'ALBUM_CREATE_TIMEOUT' : 'ALBUM_CREATE_TRANSPORT',
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
        'Cloudflare Access session is not available to Album create.',
        response.status || null,
        'ALBUM_ACCESS_SESSION_REQUIRED',
      );
    }

    let payload: AlbumCreateResponse;
    try {
      payload = await response.json() as AlbumCreateResponse;
    } catch (reason) {
      if (reason instanceof TypeError || (reason instanceof DOMException && reason.name === 'AbortError')) {
        throw new AlbumAdminError(
          'Album create response body was interrupted. Studio will check private canonical creation evidence.',
          null,
          'ALBUM_CREATE_TRANSPORT',
          null,
          null,
          null,
          null,
          false,
          reason instanceof Error ? reason.message : String(reason),
        );
      }
      throw new AlbumAdminError(
        'Track Manager Album create returned invalid JSON. Reload canonical Album state before deciding what to do.',
        response.status || null,
        'ALBUM_CREATE_INVALID_RESPONSE',
      );
    }

    if (!response.ok || payload.ok === false) {
      throw new AlbumAdminError(
        payload.error || `Album create returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'ALBUM_CREATE_REJECTED',
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

export async function createAdminAlbumResilient(
  album: { id: string } & AdminAlbumMetadataPatch,
): Promise<AlbumCreateResponse> {
  if (!validAlbumId(album.id)) throw new AlbumAdminError('Invalid canonical Album ID.');
  const operationId = globalThis.crypto?.randomUUID?.();
  if (!operationId) {
    throw new AlbumAdminError(
      'Secure Album creation identity is unavailable. No create was sent.',
      null,
      'ALBUM_CREATE_IDENTITY_UNAVAILABLE',
    );
  }
  await requireCreateManage();

  let payload: AlbumCreateResponse;
  try {
    payload = await postAlbumCreate(operationId, album);
  } catch (reason) {
    if (!(reason instanceof AlbumAdminError) || !['ALBUM_CREATE_TIMEOUT', 'ALBUM_CREATE_TRANSPORT'].includes(reason.code || '')) throw reason;

    let canonical: AlbumCreateManifest | undefined;
    try {
      canonical = (await getAdminAlbum(album.id)).album?.manifest as AlbumCreateManifest | undefined;
    } catch (rereadReason) {
      throw new AlbumAdminError(
        'The Album create response and private canonical reread are unavailable. Do not retry; restore Track Manager access and inspect the Album.',
        null,
        'ALBUM_CREATE_UNVERIFIED',
        null,
        null,
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }

    if (!canonical?.updatedAt || canonical.id !== album.id) {
      throw new AlbumAdminError(
        'Album creation cannot be proven by the private canonical reread. Do not retry; inspect Track Manager.',
        null,
        'ALBUM_CREATE_UNVERIFIED',
        canonical?.updatedAt || null,
      );
    }
    if (canonical.creationOperationId !== operationId) {
      throw new AlbumAdminError(
        'This Album has different or missing creation evidence. Recovery is ambiguous. Do not retry; inspect the existing Album.',
        null,
        'ALBUM_CREATE_AMBIGUOUS',
        canonical.updatedAt,
      );
    }

    return {
      ok: true,
      created: true,
      albumId: album.id,
      operationId,
      album: canonical,
      clientVerified: true,
      verificationWarning: null,
      recoveredAfterTransportFailure: true,
      retrySafe: false,
      technicalDetails: `${reason.code}: response lost; private canonical Album reread matched the exact creation operation ID.`,
    };
  }

  const responseAlbum = payload.album;
  if (!payload.created || payload.albumId !== album.id || !responseAlbum?.updatedAt || responseAlbum.id !== album.id || responseAlbum.status !== 'draft') {
    throw new AlbumAdminError('Track Manager returned an invalid Album create response.', null, 'ALBUM_CREATE_INVALID_RESPONSE');
  }

  const { id: _id, ...metadata } = album;
  try {
    const canonical = (await getAdminAlbum(album.id)).album?.manifest as AlbumCreateManifest | undefined;
    const revisionMatches = canonical?.updatedAt === responseAlbum.updatedAt;
    const metadataMatches = metadataMismatch(canonical, metadata).length === 0;
    const identityMatches = payload.operationId === operationId
      && responseAlbum.creationOperationId === operationId
      && canonical?.creationOperationId === operationId;
    const clientVerified = Boolean(revisionMatches && metadataMatches && identityMatches);
    return {
      ...payload,
      album: canonical || responseAlbum,
      clientVerified,
      recoveredAfterTransportFailure: false,
      retrySafe: false,
      verificationWarning: clientVerified
        ? null
        : `Canonical Album create reread did not verify exact response revision + requested metadata + creation operation identity. revisionMatch=${revisionMatches}; metadataMatch=${metadataMatches}; identityMatch=${identityMatches}.`,
    };
  } catch (reason) {
    return {
      ...payload,
      clientVerified: false,
      recoveredAfterTransportFailure: false,
      retrySafe: false,
      verificationWarning: `Server reported Album create success, but Studio could not complete the private canonical reread (${reason instanceof Error ? reason.message : String(reason)}).`,
    };
  }
}

export const albumCreatePolicy = Object.freeze({
  transport: 'Track Manager v5.25 / bridge v1.15',
  successVerificationPolicy: 'response-revision-requested-metadata-private-creation-operation-id-exact-match',
  lostResponsePolicy: 'private-creation-operation-id-exact-match-no-blind-retry',
  maxAutomaticCreateRetries: 0,
});
