import { getAdminBridgeHealth } from './admin-api';
import {
  AlbumAdminError,
  getAdminAlbum,
  type AdminAlbumManifest,
  type AdminAlbumMetadataPatch,
  type AdminAlbumQuality,
  type AdminAlbumWriteResponse,
} from './album-admin-api';
import { studioConfig } from './config';

export type AlbumMetadataCommitState = 'committed' | 'not-committed' | 'ambiguous' | 'unverified';
export type AlbumMetadataSaveResponse = AdminAlbumWriteResponse & {
  commitState?: AlbumMetadataCommitState;
};

function baseUrl() {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function isJson(response: Response) {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function titleCase(value: string | null | undefined) {
  const clean = String(value || 'unknown').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Unknown';
}

function albumQualityBlockers(quality?: AdminAlbumQuality | null): string[] {
  if (!quality || quality.publishable === true) return [];
  const failed = (quality.checks || []).filter(check => check.ok === false);
  const tracks = quality.tracks || [];
  const details: string[] = [];
  for (const check of failed) {
    if (check.id === 'publishedTracks') {
      for (const track of tracks.filter(item => item.exists !== false && item.status !== 'published')) {
        const label = track.title?.trim() || track.trackId || 'Unknown track';
        details.push(`Track “${label}” must be Published (currently ${titleCase(track.status)}).`);
      }
      continue;
    }
    if (check.id === 'trackRefs') {
      for (const track of tracks.filter(item => item.exists === false)) details.push(`Missing Track reference: ${track.trackId || 'unknown'}.`);
      continue;
    }
    if (check.id === 'cover') { details.push('Album cover is required before publication.'); continue; }
    if (check.id === 'trackIds') { details.push('Album tracklist must contain at least one Track.'); continue; }
    if (check.id === 'title') { details.push('Album title is required before publication.'); continue; }
    if (check.message) details.push(`${check.message}.`);
  }
  return [...new Set(details)];
}

function albumWriteErrorMessage(payload: AdminAlbumWriteResponse, fallback: string) {
  const base = payload.error || fallback;
  const details = albumQualityBlockers(payload.quality);
  if (payload.verificationDetail) details.push(payload.verificationDetail);
  return details.length ? `${base} ${details.join(' ')}` : base;
}

function metadataMismatch(manifest: AdminAlbumManifest | undefined, expected: AdminAlbumMetadataPatch): Array<keyof AdminAlbumMetadataPatch> {
  if (!manifest) return Object.keys(expected) as Array<keyof AdminAlbumMetadataPatch>;
  return (Object.keys(expected) as Array<keyof AdminAlbumMetadataPatch>).filter(key =>
    JSON.stringify(manifest[key] ?? null) !== JSON.stringify(expected[key] ?? null));
}

function stableAlbumShape(manifest: AdminAlbumManifest | undefined) {
  if (!manifest) return null;
  return {
    schemaVersion: manifest.schemaVersion ?? 1,
    id: manifest.id,
    trackIds: manifest.trackIds,
    assets: manifest.assets,
    createdAt: manifest.createdAt,
  };
}

function stableShapeMatches(before: AdminAlbumManifest, after: AdminAlbumManifest | undefined) {
  return JSON.stringify(stableAlbumShape(before)) === JSON.stringify(stableAlbumShape(after));
}

async function requireMetadataManage() {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('album-metadata')) {
    throw new AlbumAdminError('Track Manager does not advertise album-metadata. The Album write stays locked.');
  }
}

async function postAlbumMetadataSave(
  albumId: string,
  expectedUpdatedAt: string,
  metadata: AdminAlbumMetadataPatch,
): Promise<AdminAlbumWriteResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/albums/${encodeURIComponent(albumId)}/metadata/save`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: 'album-metadata-save-v1', expectedUpdatedAt, metadata }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AlbumAdminError(
        timedOut
          ? 'Album metadata save timed out. Studio will reread canonical Album state before any retry.'
          : 'Album metadata save transport was interrupted. Studio will reread canonical Album state before any retry.',
        null,
        timedOut ? 'ALBUM_METADATA_SAVE_TIMEOUT' : 'ALBUM_METADATA_SAVE_TRANSPORT',
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
        'Cloudflare Access session is not available to Album metadata save.',
        response.status || null,
        'ALBUM_ACCESS_SESSION_REQUIRED',
      );
    }

    let payload: AdminAlbumWriteResponse;
    try {
      payload = await response.json() as AdminAlbumWriteResponse;
    } catch {
      throw new AlbumAdminError(
        'Track Manager Album metadata save returned invalid JSON. Reload canonical Album state before retrying.',
        response.status || null,
        'ALBUM_METADATA_SAVE_INVALID_RESPONSE',
      );
    }

    if (!response.ok || payload.ok === false) {
      throw new AlbumAdminError(
        albumWriteErrorMessage(payload, `Album metadata save returned HTTP ${response.status}.`),
        response.status,
        payload.code || 'ALBUM_METADATA_SAVE_REJECTED',
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

export async function saveAdminAlbumMetadataResilient(
  albumId: string,
  expectedUpdatedAt: string,
  metadata: AdminAlbumMetadataPatch,
): Promise<AlbumMetadataSaveResponse> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(albumId)) throw new AlbumAdminError('Invalid canonical Album ID.');
  if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.');
  await requireMetadataManage();

  const beforeRead = await getAdminAlbum(albumId);
  const before = beforeRead.album?.manifest;
  if (!before?.updatedAt || before.updatedAt !== expectedUpdatedAt) {
    throw new AlbumAdminError(
      'The Album changed before this metadata save began. Reload before another write.',
      409,
      'ALBUM_STALE_MANIFEST',
      before?.updatedAt || null,
    );
  }

  let payload: AdminAlbumWriteResponse;
  try {
    payload = await postAlbumMetadataSave(albumId, expectedUpdatedAt, metadata);
  } catch (reason) {
    if (!(reason instanceof AlbumAdminError) || !['ALBUM_METADATA_SAVE_TIMEOUT', 'ALBUM_METADATA_SAVE_TRANSPORT'].includes(reason.code || '')) throw reason;

    try {
      const reread = await getAdminAlbum(albumId);
      const manifest = reread.album?.manifest;
      const sameRevision = manifest?.updatedAt === before.updatedAt;
      const metadataMatches = metadataMismatch(manifest, metadata).length === 0;
      const shapeMatches = stableShapeMatches(before, manifest);

      if (!sameRevision && metadataMatches && shapeMatches && manifest?.updatedAt) {
        return {
          ok: true,
          saved: true,
          albumId,
          previousUpdatedAt: before.updatedAt,
          updatedAt: manifest.updatedAt,
          album: manifest,
          clientVerified: true,
          verificationWarning: null,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          commitState: 'committed',
          technicalDetails: `${reason.code}: response lost; canonical reread verified a new Album revision, the exact requested metadata and unchanged non-metadata Album shape.`,
        };
      }

      if (sameRevision) {
        throw new AlbumAdminError(
          'RETRY SAFE AFTER RECONNECT · Canonical Album reread proves the metadata save did not commit: the original revision is unchanged. Studio did not retry the write.',
          null,
          'ALBUM_METADATA_SAVE_NOT_COMMITTED',
          manifest?.updatedAt || before.updatedAt,
          null,
          null,
          null,
          true,
          reason.technicalDetails,
        );
      }

      const mismatches = metadataMismatch(manifest, metadata).join(', ') || 'none';
      throw new AlbumAdminError(
        `DO NOT RETRY · Canonical Album state changed while the metadata response was unavailable, but Studio cannot prove the exact requested postcondition. Metadata mismatches: ${mismatches}; stable shape match: ${shapeMatches}.`,
        null,
        'ALBUM_METADATA_SAVE_AMBIGUOUS',
        manifest?.updatedAt || null,
        null,
        null,
        null,
        false,
        reason.technicalDetails,
      );
    } catch (rereadReason) {
      if (rereadReason instanceof AlbumAdminError) throw rereadReason;
      throw new AlbumAdminError(
        'DO NOT RETRY · The Album metadata response and canonical reread are both unavailable. Restore Track Manager access, reload the Album, then decide from canonical state.',
        null,
        'ALBUM_METADATA_SAVE_UNVERIFIED',
        null,
        null,
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }

  if (!payload.saved || !payload.album || !payload.updatedAt) {
    throw new AlbumAdminError('Track Manager returned an invalid Album metadata response.', null, 'ALBUM_METADATA_SAVE_INVALID_RESPONSE');
  }

  try {
    const reread = await getAdminAlbum(albumId);
    const manifest = reread.album?.manifest;
    const revisionMatches = manifest?.updatedAt === payload.updatedAt;
    const metadataMatches = metadataMismatch(manifest, metadata).length === 0;
    const shapeMatches = stableShapeMatches(before, manifest);
    const clientVerified = Boolean(revisionMatches && metadataMatches && shapeMatches);
    return {
      ...payload,
      album: manifest || payload.album,
      clientVerified,
      retrySafe: false,
      commitState: clientVerified ? 'committed' : 'unverified',
      verificationWarning: clientVerified
        ? null
        : `Canonical Album reread did not verify the exact response revision + requested metadata + unchanged non-metadata shape. revisionMatch=${revisionMatches}; metadataMatch=${metadataMatches}; stableShapeMatch=${shapeMatches}.`,
    };
  } catch (reason) {
    return {
      ...payload,
      clientVerified: false,
      retrySafe: false,
      commitState: 'unverified',
      verificationWarning: `Server reported Album metadata success, but Studio could not complete the canonical reread (${reason instanceof Error ? reason.message : String(reason)}).`,
    };
  }
}

export const albumMetadataSavePolicy = Object.freeze({
  lostResponsePolicy: 'private-canonical-revision-metadata-shape-reread-no-blind-retry',
  transport: 'Track Manager v5.23 / bridge v1.13 only',
});
