import { getAdminBridgeHealth, getAdminTrack, type AdminManifest } from './admin-api';
import {
  AlbumAdminError,
  getAdminAlbum,
  type AdminAlbumManifest,
} from './album-admin-api';
import { studioConfig } from './config';

const MOVE_INTENT = 'album-track-move-v1';
const LOST_RESPONSE_CODES = new Set([
  'ALBUM_MOVE_TIMEOUT',
  'ALBUM_MOVE_TRANSPORT',
  'ALBUM_MOVE_INVALID_RESPONSE',
]);

export type AlbumMoveCommitState = 'committed' | 'not-committed' | 'ambiguous' | 'unverified';

export interface AlbumMoveResponse {
  ok?: boolean;
  moved?: boolean;
  trackId?: string;
  sourceAlbumId?: string | null;
  targetAlbumId?: string;
  targetTrackIds?: string[];
  sourceTrackIds?: string[] | null;
  targetUpdatedAt?: string | null;
  sourceUpdatedAt?: string | null;
  code?: string;
  currentUpdatedAt?: string | null;
  error?: string;
  rollback?: Record<string, unknown> | null;
  clientVerified?: boolean;
  verificationWarning?: string | null;
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  commitState?: AlbumMoveCommitState;
  technicalDetails?: string | null;
}

type MoveInput = {
  trackId: string;
  sourceAlbumId?: string | null;
  expectedTargetUpdatedAt: string;
  expectedSourceUpdatedAt?: string | null;
  targetIndex?: number;
};

type MoveSnapshot = {
  target: AdminAlbumManifest;
  source: AdminAlbumManifest | null;
  track: AdminManifest;
  expectedTargetTrackIds: string[];
  expectedSourceTrackIds: string[] | null;
};

type MoveState = {
  target: AdminAlbumManifest;
  source: AdminAlbumManifest | null;
  track: AdminManifest;
};

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function assertId(value: string, label: string): void {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(value)) {
    throw new AlbumAdminError(`Invalid canonical ${label}.`);
  }
}

function isJson(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function exactIds(left: string[] | null | undefined, right: string[] | null | undefined): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function insertAt(trackIds: string[], trackId: string, indexValue?: number): string[] {
  const next = trackIds.filter(value => value !== trackId);
  const requestedIndex = Number(indexValue);
  const index = Number.isInteger(requestedIndex)
    ? Math.max(0, Math.min(requestedIndex, next.length))
    : next.length;
  next.splice(index, 0, trackId);
  return next;
}

function albumStableShape(manifest: AdminAlbumManifest): string {
  const {
    trackIds: _trackIds,
    updatedAt: _updatedAt,
    updatedBy: _updatedBy,
    ...stable
  } = manifest;
  return JSON.stringify(stable);
}

function trackStableShape(manifest: AdminManifest): string {
  const {
    album: _album,
    updatedAt: _updatedAt,
    ...stable
  } = manifest;
  return JSON.stringify(stable);
}

function trackAlbumShape(manifest: AdminManifest): string {
  return JSON.stringify(manifest.album ?? null);
}

function albumShapeMatches(before: AdminAlbumManifest, after: AdminAlbumManifest): boolean {
  return albumStableShape(before) === albumStableShape(after);
}

function trackShapeMatches(before: AdminManifest, after: AdminManifest): boolean {
  return trackStableShape(before) === trackStableShape(after);
}

async function requireMoveCapability(): Promise<void> {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('album-move')) {
    throw new AlbumAdminError('Track Manager does not advertise album-move. The Album write stays locked.');
  }
}

async function readMoveState(targetAlbumId: string, sourceAlbumId: string | null, trackId: string): Promise<MoveState> {
  const [targetPayload, sourcePayload, trackPayload] = await Promise.all([
    getAdminAlbum(targetAlbumId),
    sourceAlbumId ? getAdminAlbum(sourceAlbumId) : Promise.resolve(null),
    getAdminTrack(trackId),
  ]);
  const target = targetPayload.album?.manifest;
  const source = sourcePayload?.album?.manifest || null;
  const track = trackPayload.track?.manifest;
  if (!target || (sourceAlbumId && !source) || !track) {
    throw new AlbumAdminError('Canonical Album move state is incomplete. Do not write until target, source and Track state can be reread.');
  }
  return { target, source, track };
}

async function captureMoveSnapshot(targetAlbumId: string, input: MoveInput): Promise<MoveSnapshot> {
  const effectiveSourceId = input.sourceAlbumId && input.sourceAlbumId !== targetAlbumId
    ? input.sourceAlbumId
    : null;
  const before = await readMoveState(targetAlbumId, effectiveSourceId, input.trackId);

  if (!before.target.updatedAt || before.target.updatedAt !== input.expectedTargetUpdatedAt) {
    throw new AlbumAdminError(
      'The target Album changed before this move began. Reload before another write.',
      409,
      'ALBUM_MOVE_STALE_TARGET',
      before.target.updatedAt || null,
    );
  }
  if (effectiveSourceId) {
    if (!input.expectedSourceUpdatedAt || before.source?.updatedAt !== input.expectedSourceUpdatedAt) {
      throw new AlbumAdminError(
        'The source Album changed before this move began. Reload before another write.',
        409,
        'ALBUM_MOVE_STALE_SOURCE',
        before.source?.updatedAt || null,
      );
    }
    if (!before.source?.trackIds.includes(input.trackId)) {
      throw new AlbumAdminError('The Track is no longer owned by the expected source Album. Reload before another write.', 409, 'ALBUM_MOVE_SOURCE_MISMATCH');
    }
  }

  return {
    ...before,
    expectedTargetTrackIds: insertAt(before.target.trackIds, input.trackId, input.targetIndex),
    expectedSourceTrackIds: before.source
      ? before.source.trackIds.filter(value => value !== input.trackId)
      : null,
  };
}

async function postAlbumMove(targetAlbumId: string, input: MoveInput): Promise<AlbumMoveResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/albums/${encodeURIComponent(targetAlbumId)}/tracks/move`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: MOVE_INTENT, ...input, sourceAlbumId: input.sourceAlbumId || null }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AlbumAdminError(
        timedOut
          ? 'Album move timed out. Studio will reread target, source and Track state before any retry.'
          : 'Album move transport was interrupted. Studio will reread target, source and Track state before any retry.',
        null,
        timedOut ? 'ALBUM_MOVE_TIMEOUT' : 'ALBUM_MOVE_TRANSPORT',
        null,
        null,
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!isJson(response)) {
      throw new AlbumAdminError('Cloudflare Access session is not available to Album move.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
    }

    let payload: AlbumMoveResponse;
    try {
      payload = await response.json() as AlbumMoveResponse;
    } catch (reason) {
      throw new AlbumAdminError(
        'Track Manager Album move response could not be read. Studio will reread canonical move state before any retry.',
        response.status || null,
        'ALBUM_MOVE_INVALID_RESPONSE',
        null,
        null,
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!response.ok || payload.ok === false) {
      throw new AlbumAdminError(
        payload.error || `Track Manager Album move returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'ALBUM_MOVE_REJECTED',
        payload.currentUpdatedAt || null,
        payload.rollback || null,
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function committedPostcondition(before: MoveSnapshot, after: MoveState, targetAlbumId: string): boolean {
  const targetChanged = Boolean(after.target.updatedAt && after.target.updatedAt !== before.target.updatedAt);
  const sourceChanged = !before.source || Boolean(after.source?.updatedAt && after.source.updatedAt !== before.source.updatedAt);
  const targetMatches = exactIds(after.target.trackIds, before.expectedTargetTrackIds) && albumShapeMatches(before.target, after.target);
  const sourceMatches = !before.source || Boolean(
    after.source
    && exactIds(after.source.trackIds, before.expectedSourceTrackIds)
    && albumShapeMatches(before.source, after.source),
  );
  const trackMatches = after.track.album?.id === targetAlbumId && trackShapeMatches(before.track, after.track);
  return targetChanged && sourceChanged && targetMatches && sourceMatches && trackMatches;
}

function notCommittedPostcondition(before: MoveSnapshot, after: MoveState): boolean {
  const targetSame = after.target.updatedAt === before.target.updatedAt
    && exactIds(after.target.trackIds, before.target.trackIds)
    && albumShapeMatches(before.target, after.target);
  const sourceSame = !before.source || Boolean(
    after.source
    && after.source.updatedAt === before.source.updatedAt
    && exactIds(after.source.trackIds, before.source.trackIds)
    && albumShapeMatches(before.source, after.source),
  );
  const trackSame = after.track.updatedAt === before.track.updatedAt
    && trackAlbumShape(after.track) === trackAlbumShape(before.track)
    && trackShapeMatches(before.track, after.track);
  return targetSame && sourceSame && trackSame;
}

function canonicalMoveDetails(before: MoveSnapshot, after: MoveState): string {
  return [
    `targetRevision=${after.target.updatedAt || 'none'} (before ${before.target.updatedAt || 'none'})`,
    `targetTrackIdsMatch=${exactIds(after.target.trackIds, before.expectedTargetTrackIds)}`,
    `sourceRevision=${after.source?.updatedAt || 'none'} (before ${before.source?.updatedAt || 'none'})`,
    `sourceTrackIdsMatch=${!before.source || exactIds(after.source?.trackIds, before.expectedSourceTrackIds)}`,
    `trackAlbum=${after.track.album?.id || 'none'}`,
  ].join('; ');
}

export async function moveAdminAlbumTrackResilient(targetAlbumId: string, input: MoveInput): Promise<AlbumMoveResponse> {
  assertId(targetAlbumId, 'target Album ID');
  assertId(input.trackId, 'trackId');
  if (input.sourceAlbumId) assertId(input.sourceAlbumId, 'source Album ID');
  if (!input.expectedTargetUpdatedAt) throw new AlbumAdminError('Target Album revision is required.');

  await requireMoveCapability();
  const effectiveSourceId = input.sourceAlbumId && input.sourceAlbumId !== targetAlbumId
    ? input.sourceAlbumId
    : null;
  const before = await captureMoveSnapshot(targetAlbumId, input);

  let payload: AlbumMoveResponse;
  try {
    payload = await postAlbumMove(targetAlbumId, input);
  } catch (reason) {
    if (!(reason instanceof AlbumAdminError) || !LOST_RESPONSE_CODES.has(reason.code || '')) throw reason;
    try {
      const after = await readMoveState(targetAlbumId, effectiveSourceId, input.trackId);
      if (committedPostcondition(before, after, targetAlbumId)) {
        return {
          ok: true,
          moved: true,
          trackId: input.trackId,
          sourceAlbumId: effectiveSourceId,
          targetAlbumId,
          targetTrackIds: after.target.trackIds,
          sourceTrackIds: after.source?.trackIds || null,
          targetUpdatedAt: after.target.updatedAt || null,
          sourceUpdatedAt: after.source?.updatedAt || null,
          clientVerified: true,
          verificationWarning: null,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          commitState: 'committed',
          technicalDetails: `${reason.code}: response unavailable; canonical reread verified target/source membership and Track cache.`,
        };
      }
      if (notCommittedPostcondition(before, after)) {
        throw new AlbumAdminError(
          'RETRY SAFE AFTER RECONNECT · Canonical target/source/Track state proves this move did not commit. Reload fresh revisions before an explicit retry.',
          null,
          'ALBUM_MOVE_NOT_COMMITTED',
          after.target.updatedAt || before.target.updatedAt || null,
          null,
          null,
          null,
          true,
          reason.technicalDetails,
        );
      }
      throw new AlbumAdminError(
        `DO NOT RETRY · Canonical move state changed but Studio cannot prove the requested move committed exactly. ${canonicalMoveDetails(before, after)}`,
        null,
        'ALBUM_MOVE_AMBIGUOUS',
        after.target.updatedAt || null,
        null,
        null,
        null,
        false,
        reason.technicalDetails,
      );
    } catch (rereadReason) {
      if (rereadReason instanceof AlbumAdminError) throw rereadReason;
      throw new AlbumAdminError(
        'DO NOT RETRY · The Album move response and canonical target/source/Track reread are both unavailable. Restore private access and reload before deciding anything.',
        null,
        'ALBUM_MOVE_UNVERIFIED',
        null,
        null,
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }

  if (!payload.moved || !Array.isArray(payload.targetTrackIds) || !payload.targetUpdatedAt) {
    throw new AlbumAdminError('Track Manager returned an invalid Album move success response. Do not retry until canonical state is reloaded.', null, 'ALBUM_MOVE_UNVERIFIED');
  }

  let after: MoveState;
  try {
    after = await readMoveState(targetAlbumId, effectiveSourceId, input.trackId);
  } catch (reason) {
    throw new AlbumAdminError(
      'DO NOT RETRY · Track Manager reported move success, but Studio could not complete the canonical target/source/Track reread.',
      null,
      'ALBUM_MOVE_UNVERIFIED',
      null,
      null,
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }

  const responseRevisionsMatch = after.target.updatedAt === payload.targetUpdatedAt
    && (!before.source || after.source?.updatedAt === payload.sourceUpdatedAt);
  const payloadTrackIdsMatch = exactIds(payload.targetTrackIds, before.expectedTargetTrackIds)
    && (!before.source || exactIds(payload.sourceTrackIds, before.expectedSourceTrackIds));
  const canonicalVerified = committedPostcondition(before, after, targetAlbumId)
    && responseRevisionsMatch
    && payloadTrackIdsMatch;

  if (!canonicalVerified) {
    throw new AlbumAdminError(
      `DO NOT RETRY · Track Manager reported move success, but exact canonical postconditions were not verified. ${canonicalMoveDetails(before, after)}`,
      null,
      'ALBUM_MOVE_AMBIGUOUS',
      after.target.updatedAt || null,
    );
  }

  return {
    ...payload,
    clientVerified: true,
    verificationWarning: null,
    recoveredAfterTransportFailure: false,
    retrySafe: false,
    commitState: 'committed',
  };
}

export const albumMoveAdminService = Object.freeze({
  intent: MOVE_INTENT,
  transport: 'Track Manager v5.23 / bridge v1.13 only',
  lostResponsePolicy: 'private-canonical-target-source-track-reread-no-blind-retry',
});
