import {
  AdminReadError,
  getAdminBridgeHealth,
  getAdminTracks,
  type AdminTrackSummary,
} from './admin-api';
import { studioConfig } from './config';

const DELETE_INTENT = 'track-delete-v1' as const;
const DELETE_TIMEOUT_MS = 30_000;

export type TrackDeleteResponse = {
  ok?: boolean;
  deleted?: boolean;
  trackId?: string;
  previousUpdatedAt?: string | null;
  objectsDeleted?: number;
  catalogRebuilt?: boolean;
  catalogGeneratedAt?: string | null;
  catalogCount?: number | null;
  authenticatedEmail?: string | null;
  code?: string;
  currentUpdatedAt?: string | null;
  error?: string;
  albumId?: string | null;
  albumTitle?: string | null;
  rollback?: Record<string, unknown> | null;
  clientVerified?: boolean;
  verificationWarning?: string | null;
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  technicalDetails?: string | null;
};

export class TrackDeleteError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    readonly code: string | null = null,
    readonly currentUpdatedAt: string | null = null,
    readonly rollback: Record<string, unknown> | null = null,
    readonly retrySafe = false,
    readonly albumId: string | null = null,
    readonly albumTitle: string | null = null,
    readonly technicalDetails: string | null = null,
  ) {
    super(message);
    this.name = 'TrackDeleteError';
  }
}

function baseUrl() {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function assertTrackId(value: string) {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(value)) {
    throw new TrackDeleteError('Invalid canonical Track ID.', null, 'TRACK_DELETE_INVALID_ID');
  }
}

function isJson(response: Response) {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

async function requireDeleteCapability() {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('track-delete')) {
    throw new TrackDeleteError('Track Manager does not advertise track-delete. Whole-Track deletion stays locked.', null, 'TRACK_DELETE_UNSUPPORTED');
  }
}

async function canonicalSummary(trackId: string): Promise<AdminTrackSummary | null> {
  const collection = await getAdminTracks();
  return (collection.tracks || []).find(track => track.slug === trackId) || null;
}

async function deleteRequest(trackId: string, expectedUpdatedAt: string): Promise<TrackDeleteResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), DELETE_TIMEOUT_MS);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/delete`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          intent: DELETE_INTENT,
          expectedUpdatedAt,
          confirmTrackId: trackId,
        }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new TrackDeleteError(
        timedOut
          ? 'Track deletion timed out. Studio will reread the canonical Track collection before any retry.'
          : 'Track deletion response was lost. Studio will reread the canonical Track collection before any retry.',
        null,
        timedOut ? 'TRACK_DELETE_TIMEOUT' : 'TRACK_DELETE_TRANSPORT',
        null,
        null,
        false,
        null,
        null,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!isJson(response)) {
      throw new TrackDeleteError(
        'Cloudflare Access session is not available to whole-Track deletion.',
        response.status || null,
        'TRACK_DELETE_ACCESS_SESSION_REQUIRED',
      );
    }

    let payload: TrackDeleteResponse;
    try {
      payload = await response.json() as TrackDeleteResponse;
    } catch (reason) {
      if (reason instanceof TypeError || (reason instanceof DOMException && reason.name === 'AbortError')) {
        throw new TrackDeleteError(
          'Track deletion response body was interrupted. Studio will reread canonical Track state before any retry.',
          null,
          'TRACK_DELETE_TRANSPORT',
          null,
          null,
          false,
          null,
          null,
          reason instanceof Error ? reason.message : String(reason),
        );
      }
      throw new TrackDeleteError('Track Manager returned invalid JSON for Track deletion.', response.status || null, 'TRACK_DELETE_INVALID_RESPONSE');
    }

    if (!response.ok || payload.ok === false) {
      throw new TrackDeleteError(
        payload.error || `Track Manager Track deletion returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'TRACK_DELETE_REJECTED',
        payload.currentUpdatedAt || null,
        payload.rollback || null,
        false,
        payload.albumId || null,
        payload.albumTitle || null,
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function rereadFailureMessage(reason: unknown) {
  if (reason instanceof AdminReadError) return `${reason.kind}: ${reason.message}`;
  return reason instanceof Error ? reason.message : String(reason);
}

export async function deleteAdminTrackResilient(trackId: string, expectedUpdatedAt: string): Promise<TrackDeleteResponse> {
  assertTrackId(trackId);
  if (!expectedUpdatedAt) throw new TrackDeleteError('Canonical Track revision is required.', null, 'TRACK_DELETE_REVISION_REQUIRED');
  await requireDeleteCapability();

  const before = await canonicalSummary(trackId);
  if (!before) {
    throw new TrackDeleteError('The canonical Track is already absent. Reload instead of issuing another destructive write.', 409, 'TRACK_DELETE_ALREADY_MISSING');
  }
  if (before.updatedAt !== expectedUpdatedAt) {
    throw new TrackDeleteError('The Track changed before deletion began. Reload before another write.', 409, 'TRACK_DELETE_STALE', before.updatedAt || null);
  }

  let payload: TrackDeleteResponse;
  try {
    payload = await deleteRequest(trackId, expectedUpdatedAt);
  } catch (reason) {
    if (!(reason instanceof TrackDeleteError) || !['TRACK_DELETE_TIMEOUT', 'TRACK_DELETE_TRANSPORT'].includes(reason.code || '')) throw reason;

    let after: AdminTrackSummary | null;
    try {
      after = await canonicalSummary(trackId);
    } catch (rereadReason) {
      throw new TrackDeleteError(
        'The Track deletion response and canonical collection reread are both unavailable. Do not retry until Track Manager access is restored.',
        null,
        'TRACK_DELETE_UNVERIFIED',
        null,
        null,
        false,
        null,
        null,
        rereadFailureMessage(rereadReason),
      );
    }

    if (!after) {
      return {
        ok: true,
        deleted: true,
        trackId,
        previousUpdatedAt: expectedUpdatedAt,
        clientVerified: true,
        recoveredAfterTransportFailure: true,
        retrySafe: false,
        verificationWarning: null,
        technicalDetails: `${reason.code}: response lost; canonical Track collection proves the Track is absent. Studio did not retry the delete.`,
      };
    }

    if (after.updatedAt === expectedUpdatedAt) {
      throw new TrackDeleteError(
        'Canonical Track reread proves the deletion did not commit. The Track still exists at the original revision; an explicit retry is safe after connectivity or Access is restored.',
        null,
        'TRACK_DELETE_NOT_COMMITTED',
        after.updatedAt || expectedUpdatedAt,
        null,
        true,
        null,
        null,
        reason.technicalDetails,
      );
    }

    throw new TrackDeleteError(
      'Canonical Track state changed while the delete response was unavailable, but Studio cannot prove this deletion caused the change. Do not retry.',
      null,
      'TRACK_DELETE_AMBIGUOUS',
      after.updatedAt || null,
      null,
      false,
      null,
      null,
      reason.technicalDetails,
    );
  }

  if (!payload.deleted || payload.trackId !== trackId) {
    throw new TrackDeleteError('Track Manager returned an invalid whole-Track delete response.', null, 'TRACK_DELETE_INVALID_RESPONSE');
  }

  let after: AdminTrackSummary | null;
  try {
    after = await canonicalSummary(trackId);
  } catch (reason) {
    throw new TrackDeleteError(
      'Track Manager reported Track deletion success, but Studio could not complete the canonical collection reread. Do not retry until the Track catalog is reloaded.',
      null,
      'TRACK_DELETE_UNVERIFIED',
      null,
      null,
      false,
      null,
      null,
      rereadFailureMessage(reason),
    );
  }

  if (after) {
    throw new TrackDeleteError(
      'Track Manager reported Track deletion success, but the canonical Track still exists. Do not retry.',
      null,
      'TRACK_DELETE_AMBIGUOUS',
      after.updatedAt || null,
      payload.rollback || null,
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

export const trackDeletePolicy = Object.freeze({
  intent: DELETE_INTENT,
  transport: 'Track Manager v5.27 · bridge v1.17',
  authority: 'private-track-manager-only',
  confirmation: 'exact-canonical-track-id',
  expectedRevisionRequired: true,
  albumOwnershipPolicy: 'canonical-album-trackIds-hard-block-no-implicit-membership-write',
  successVerification: 'private-canonical-track-collection-absence',
  lostResponsePolicy: 'canonical-reread-no-blind-retry',
  maxAutomaticDeleteRetries: 0,
});
