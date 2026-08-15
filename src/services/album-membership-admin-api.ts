import { getAdminBridgeHealth, getAdminTrack, type AdminManifest } from './admin-api';
import {
  AlbumAdminError,
  getAdminAlbum,
  type AdminAlbumManifest,
  type AdminAlbumQuality,
} from './album-admin-api';
import { studioConfig } from './config';

const MEMBERSHIP_INTENT = 'album-membership-save-v1';
const LOST_RESPONSE_CODES = new Set([
  'ALBUM_MEMBERSHIP_TIMEOUT',
  'ALBUM_MEMBERSHIP_TRANSPORT',
  'ALBUM_MEMBERSHIP_INVALID_RESPONSE',
]);

export type AlbumMembershipCommitState = 'committed' | 'not-committed' | 'ambiguous' | 'unverified';

export interface AlbumMembershipResponse {
  ok?: boolean;
  saved?: boolean;
  albumId?: string;
  previousUpdatedAt?: string | null;
  updatedAt?: string | null;
  trackIds?: string[];
  trackCachesUpdated?: number;
  code?: string;
  currentUpdatedAt?: string | null;
  error?: string;
  rollback?: Record<string, unknown> | null;
  quality?: AdminAlbumQuality | null;
  clientVerified?: boolean;
  verificationWarning?: string | null;
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  commitState?: AlbumMembershipCommitState;
  technicalDetails?: string | null;
}

type TrackExpectation = {
  trackId: string;
  before: AdminManifest;
  expectedAlbum: { id?: string; title?: string } | null;
  shouldChange: boolean;
};

type MembershipSnapshot = {
  album: AdminAlbumManifest;
  expectedTrackIds: string[];
  tracks: TrackExpectation[];
};

type MembershipState = {
  album: AdminAlbumManifest;
  tracks: Map<string, AdminManifest>;
};

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function assertId(value: string, label: string): void {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(value)) {
    throw new AlbumAdminError(`Invalid canonical ${label}.`);
  }
}

function normalizeTrackIds(value: string[]): string[] {
  if (!Array.isArray(value)) throw new AlbumAdminError('Album trackIds must be an ordered array.');
  const normalized = value.map(trackId => {
    const raw = String(trackId || '').trim();
    assertId(raw, 'trackId');
    return raw;
  });
  if (new Set(normalized).size !== normalized.length) {
    throw new AlbumAdminError('Album trackIds contain duplicates.');
  }
  return normalized;
}

function isJson(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function exactIds(left: string[] | null | undefined, right: string[] | null | undefined): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
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

function albumShapeMatches(before: AdminAlbumManifest, after: AdminAlbumManifest): boolean {
  return albumStableShape(before) === albumStableShape(after);
}

function trackShapeMatches(before: AdminManifest, after: AdminManifest): boolean {
  return trackStableShape(before) === trackStableShape(after);
}

function albumCacheShape(manifest: AdminManifest): string {
  return JSON.stringify(manifest.album ?? null);
}

function expectedAlbumCache(album: AdminAlbumManifest, track: AdminManifest, requested: Set<string>, previous: Set<string>, trackId: string): { id?: string; title?: string } | null {
  if (requested.has(trackId)) return { id: album.id, title: album.title };
  if (previous.has(trackId) && track.album?.id === album.id) return { id: 'singles', title: 'Singles' };
  return track.album ?? null;
}

async function requireMembershipCapability(): Promise<void> {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('album-membership')) {
    throw new AlbumAdminError('Track Manager does not advertise album-membership. The Album write stays locked.');
  }
}

async function readMembershipState(albumId: string, trackIds: string[]): Promise<MembershipState> {
  const albumPayload = await getAdminAlbum(albumId);
  const album = albumPayload.album?.manifest;
  if (!album) throw new AlbumAdminError('Canonical Album membership state is incomplete.');

  const entries = await Promise.all(trackIds.map(async trackId => {
    const payload = await getAdminTrack(trackId);
    const manifest = payload.track?.manifest;
    if (!manifest) throw new AlbumAdminError(`Canonical Track state is unavailable for ${trackId}.`);
    return [trackId, manifest] as const;
  }));
  return { album, tracks: new Map(entries) };
}

async function captureMembershipSnapshot(albumId: string, expectedUpdatedAt: string, requestedTrackIds: string[]): Promise<MembershipSnapshot> {
  const expectedTrackIds = normalizeTrackIds(requestedTrackIds);
  const albumPayload = await getAdminAlbum(albumId);
  const album = albumPayload.album?.manifest;
  if (!album?.updatedAt) throw new AlbumAdminError('Canonical Album revision is unavailable.');
  if (album.updatedAt !== expectedUpdatedAt) {
    throw new AlbumAdminError(
      'The Album changed before this membership save began. Reload before another write.',
      409,
      'ALBUM_MEMBERSHIP_STALE',
      album.updatedAt,
    );
  }

  const unionTrackIds = [...new Set([...album.trackIds, ...expectedTrackIds])];
  const state = await readMembershipState(albumId, unionTrackIds);
  if (state.album.updatedAt !== album.updatedAt || !exactIds(state.album.trackIds, album.trackIds) || !albumShapeMatches(album, state.album)) {
    throw new AlbumAdminError('Canonical Album membership state changed while Studio captured the pre-write snapshot. Reload before another write.', 409, 'ALBUM_MEMBERSHIP_STALE', state.album.updatedAt || null);
  }

  const requested = new Set(expectedTrackIds);
  const previous = new Set(album.trackIds);
  const tracks = unionTrackIds.map(trackId => {
    const before = state.tracks.get(trackId);
    if (!before) throw new AlbumAdminError(`Canonical Track state is unavailable for ${trackId}.`);
    const expectedAlbum = expectedAlbumCache(album, before, requested, previous, trackId);
    return {
      trackId,
      before,
      expectedAlbum,
      shouldChange: albumCacheShape(before) !== JSON.stringify(expectedAlbum),
    };
  });

  return { album, expectedTrackIds, tracks };
}

async function postAlbumMembership(albumId: string, expectedUpdatedAt: string, trackIds: string[]): Promise<AlbumMembershipResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/albums/${encodeURIComponent(albumId)}/tracks/save`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: MEMBERSHIP_INTENT, expectedUpdatedAt, trackIds }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AlbumAdminError(
        timedOut
          ? 'Album membership save timed out. Studio will reread the Album and affected Track caches before any retry.'
          : 'Album membership transport was interrupted. Studio will reread the Album and affected Track caches before any retry.',
        null,
        timedOut ? 'ALBUM_MEMBERSHIP_TIMEOUT' : 'ALBUM_MEMBERSHIP_TRANSPORT',
        null,
        null,
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!isJson(response)) {
      throw new AlbumAdminError('Cloudflare Access session is not available to Album membership writes.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
    }

    let payload: AlbumMembershipResponse;
    try {
      payload = await response.json() as AlbumMembershipResponse;
    } catch (reason) {
      throw new AlbumAdminError(
        'Track Manager Album membership response could not be read. Studio will reread canonical Album + Track cache state before any retry.',
        response.status || null,
        'ALBUM_MEMBERSHIP_INVALID_RESPONSE',
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
        payload.error || `Track Manager Album membership returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'ALBUM_MEMBERSHIP_REJECTED',
        payload.currentUpdatedAt || null,
        payload.rollback || null,
        payload.quality || null,
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function committedPostcondition(before: MembershipSnapshot, after: MembershipState): boolean {
  const albumChanged = Boolean(after.album.updatedAt && after.album.updatedAt !== before.album.updatedAt);
  const albumMatches = exactIds(after.album.trackIds, before.expectedTrackIds)
    && albumShapeMatches(before.album, after.album);
  if (!albumChanged || !albumMatches) return false;

  for (const expected of before.tracks) {
    const afterTrack = after.tracks.get(expected.trackId);
    if (!afterTrack || !trackShapeMatches(expected.before, afterTrack)) return false;
    if (albumCacheShape(afterTrack) !== JSON.stringify(expected.expectedAlbum)) return false;
    if (expected.shouldChange) {
      if (!afterTrack.updatedAt || afterTrack.updatedAt === expected.before.updatedAt) return false;
    } else if (afterTrack.updatedAt !== expected.before.updatedAt) {
      return false;
    }
  }
  return true;
}

function notCommittedPostcondition(before: MembershipSnapshot, after: MembershipState): boolean {
  const albumSame = after.album.updatedAt === before.album.updatedAt
    && exactIds(after.album.trackIds, before.album.trackIds)
    && albumShapeMatches(before.album, after.album);
  if (!albumSame) return false;

  for (const expected of before.tracks) {
    const afterTrack = after.tracks.get(expected.trackId);
    if (!afterTrack) return false;
    if (afterTrack.updatedAt !== expected.before.updatedAt) return false;
    if (albumCacheShape(afterTrack) !== albumCacheShape(expected.before)) return false;
    if (!trackShapeMatches(expected.before, afterTrack)) return false;
  }
  return true;
}

function canonicalMembershipDetails(before: MembershipSnapshot, after: MembershipState): string {
  let expectedCacheMatches = 0;
  let unchangedCacheMatches = 0;
  for (const expected of before.tracks) {
    const afterTrack = after.tracks.get(expected.trackId);
    if (!afterTrack) continue;
    if (albumCacheShape(afterTrack) === JSON.stringify(expected.expectedAlbum)) expectedCacheMatches += 1;
    if (afterTrack.updatedAt === expected.before.updatedAt && albumCacheShape(afterTrack) === albumCacheShape(expected.before)) unchangedCacheMatches += 1;
  }
  return [
    `albumRevision=${after.album.updatedAt || 'none'} (before ${before.album.updatedAt || 'none'})`,
    `trackIdsMatch=${exactIds(after.album.trackIds, before.expectedTrackIds)}`,
    `cachePostconditions=${expectedCacheMatches}/${before.tracks.length}`,
    `unchangedCaches=${unchangedCacheMatches}/${before.tracks.length}`,
  ].join('; ');
}

export async function saveAdminAlbumMembershipResilient(albumId: string, expectedUpdatedAt: string, requestedTrackIds: string[]): Promise<AlbumMembershipResponse> {
  assertId(albumId, 'Album ID');
  if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.');
  await requireMembershipCapability();

  const before = await captureMembershipSnapshot(albumId, expectedUpdatedAt, requestedTrackIds);
  const trackedIds = before.tracks.map(entry => entry.trackId);
  const expectedCacheUpdates = before.tracks.filter(entry => entry.shouldChange).length;

  let payload: AlbumMembershipResponse;
  try {
    payload = await postAlbumMembership(albumId, expectedUpdatedAt, before.expectedTrackIds);
  } catch (reason) {
    if (!(reason instanceof AlbumAdminError) || !LOST_RESPONSE_CODES.has(reason.code || '')) throw reason;
    try {
      const after = await readMembershipState(albumId, trackedIds);
      if (committedPostcondition(before, after)) {
        return {
          ok: true,
          saved: true,
          albumId,
          previousUpdatedAt: before.album.updatedAt,
          updatedAt: after.album.updatedAt || null,
          trackIds: after.album.trackIds,
          trackCachesUpdated: expectedCacheUpdates,
          clientVerified: true,
          verificationWarning: null,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          commitState: 'committed',
          technicalDetails: `${reason.code}: response unavailable; canonical reread verified ordered Album membership and every affected Track cache.`,
        };
      }
      if (notCommittedPostcondition(before, after)) {
        throw new AlbumAdminError(
          'RETRY SAFE AFTER RECONNECT · Canonical Album + Track cache state proves this membership save did not commit. Reload the fresh revision before an explicit retry.',
          null,
          'ALBUM_MEMBERSHIP_NOT_COMMITTED',
          after.album.updatedAt || before.album.updatedAt || null,
          null,
          null,
          null,
          true,
          reason.technicalDetails,
        );
      }
      throw new AlbumAdminError(
        `DO NOT RETRY · Canonical Album membership/cache state changed but Studio cannot prove the requested tracklist committed exactly. ${canonicalMembershipDetails(before, after)}`,
        null,
        'ALBUM_MEMBERSHIP_AMBIGUOUS',
        after.album.updatedAt || null,
        null,
        null,
        null,
        false,
        reason.technicalDetails,
      );
    } catch (rereadReason) {
      if (rereadReason instanceof AlbumAdminError) throw rereadReason;
      throw new AlbumAdminError(
        'DO NOT RETRY · The Album membership response and canonical Album + Track cache reread are both unavailable. Restore private access and reload before deciding anything.',
        null,
        'ALBUM_MEMBERSHIP_UNVERIFIED',
        null,
        null,
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }

  if (!payload.saved || !payload.updatedAt || !Array.isArray(payload.trackIds)) {
    throw new AlbumAdminError('Track Manager returned an invalid Album membership success response. Do not retry until canonical state is reloaded.', null, 'ALBUM_MEMBERSHIP_UNVERIFIED');
  }

  let after: MembershipState;
  try {
    after = await readMembershipState(albumId, trackedIds);
  } catch (reason) {
    throw new AlbumAdminError(
      'DO NOT RETRY · Track Manager reported membership success, but Studio could not complete the canonical Album + Track cache reread.',
      null,
      'ALBUM_MEMBERSHIP_UNVERIFIED',
      null,
      null,
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }

  const responseRevisionMatches = after.album.updatedAt === payload.updatedAt;
  const responseTrackIdsMatch = exactIds(payload.trackIds, before.expectedTrackIds);
  const responseCacheCountMatches = payload.trackCachesUpdated === undefined || payload.trackCachesUpdated === expectedCacheUpdates;
  const canonicalVerified = committedPostcondition(before, after)
    && responseRevisionMatches
    && responseTrackIdsMatch
    && responseCacheCountMatches;

  if (!canonicalVerified) {
    throw new AlbumAdminError(
      `DO NOT RETRY · Track Manager reported membership success, but exact Album + Track cache postconditions were not verified. ${canonicalMembershipDetails(before, after)}`,
      null,
      'ALBUM_MEMBERSHIP_AMBIGUOUS',
      after.album.updatedAt || null,
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

export const albumMembershipAdminService = Object.freeze({
  intent: MEMBERSHIP_INTENT,
  transport: 'Track Manager v5.23 / bridge v1.13 only',
  lostResponsePolicy: 'private-canonical-album-track-cache-reread-no-blind-retry',
});
