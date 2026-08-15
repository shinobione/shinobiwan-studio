import { AdminReadError, getAdminBridgeHealth, getAdminTrack } from './admin-api';
import { studioConfig } from './config';

const INTENT = {
  create: 'album-create-v1', metadata: 'album-metadata-save-v1', membership: 'album-membership-save-v1',
  move: 'album-track-move-v1', upload: 'album-asset-upload-v1', deleteAsset: 'album-asset-delete-v1',
} as const;
const TRANSIENT_ALBUM_READ_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
export type AdminAlbumType = 'album' | 'ep' | 'collection';
export type AdminAlbumStatus = 'draft' | 'published' | 'archived';
export type AdminAlbumAssetKind = 'cover' | 'thumbnail';
export interface AdminAlbumAssetState { present?: boolean; path?: string | null; key?: string | null; size?: number | null; contentType?: string | null; etag?: string | null; uploaded?: string | null; }
export interface AdminAlbumManifest { schemaVersion?: 1; id: string; title: string; type: AdminAlbumType; status: AdminAlbumStatus; year: number | null; releaseDate: string | null; description: string | null; heading: string | null; trackIds: string[]; accent: string | null; accent2: string | null; assets: { cover: string | null; thumbnail: string | null }; createdAt: string | null; updatedAt: string | null; updatedBy?: string | null; }
export interface AdminAlbumSummary extends AdminAlbumManifest { assetState?: Partial<Record<AdminAlbumAssetKind, AdminAlbumAssetState | null>>; }
export interface AdminAlbumsResponse { ok?: boolean; albums?: AdminAlbumSummary[]; totals?: { total?: number; published?: number; draft?: number; archived?: number; trackRefs?: number }; }
export interface AdminAlbumResponse { ok?: boolean; album?: { manifest?: AdminAlbumManifest; assets?: Partial<Record<AdminAlbumAssetKind, AdminAlbumAssetState | null>> } }
export interface AdminAlbumMetadataPatch { title?: string; type?: AdminAlbumType; status?: AdminAlbumStatus; year?: number | null; releaseDate?: string | null; description?: string | null; heading?: string | null; accent?: string | null; accent2?: string | null; }
export interface AdminAlbumQualityCheck { id?: string; ok?: boolean; message?: string; }
export interface AdminAlbumQualityTrack { trackId?: string; exists?: boolean; status?: string | null; title?: string | null; }
export interface AdminAlbumQuality { publishable?: boolean; checks?: AdminAlbumQualityCheck[]; tracks?: AdminAlbumQualityTrack[]; assets?: Partial<Record<AdminAlbumAssetKind, AdminAlbumAssetState | null>>; }
export interface AdminAlbumWriteResponse {
  ok?: boolean; created?: boolean; saved?: boolean; moved?: boolean; deleted?: boolean; albumId?: string; album?: AdminAlbumManifest;
  trackIds?: string[]; targetTrackIds?: string[]; sourceTrackIds?: string[] | null; previousUpdatedAt?: string | null; updatedAt?: string | null;
  targetUpdatedAt?: string | null; sourceUpdatedAt?: string | null; code?: string; currentUpdatedAt?: string | null; error?: string;
  quality?: AdminAlbumQuality | null; verificationDetail?: string | null; rollback?: Record<string, unknown> | null; clientVerified?: boolean;
  verificationWarning?: string | null; recoveredAfterTransportFailure?: boolean; retrySafe?: boolean; technicalDetails?: string | null;
}

export class AlbumAdminError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    readonly code: string | null = null,
    readonly currentUpdatedAt: string | null = null,
    readonly rollback: Record<string, unknown> | null = null,
    readonly quality: AdminAlbumQuality | null = null,
    readonly verificationDetail: string | null = null,
    readonly retrySafe = false,
    readonly technicalDetails: string | null = null,
  ) { super(message); this.name = 'AlbumAdminError'; }
}
function baseUrl() { return studioConfig.trackManagerUrl.replace(/\/$/, ''); }
function assertId(value: string, label = 'Album ID') { if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(value)) throw new AlbumAdminError(`Invalid canonical ${label}.`); }
function isJson(response: Response) { return (response.headers.get('content-type') || '').toLowerCase().includes('application/json'); }
function titleCase(value: string | null | undefined) { const clean = String(value || 'unknown').trim(); return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Unknown'; }
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
function metadataMismatch(manifest: AdminAlbumManifest | undefined, expected?: AdminAlbumMetadataPatch): Array<keyof AdminAlbumMetadataPatch> {
  if (!manifest || !expected) return [];
  return (Object.keys(expected) as Array<keyof AdminAlbumMetadataPatch>).filter(key =>
    JSON.stringify(manifest[key] ?? null) !== JSON.stringify(expected[key] ?? null));
}
function isTransientAlbumReadError(reason: unknown): reason is AdminReadError {
  return reason instanceof AdminReadError && (
    reason.kind === 'timeout'
    || reason.kind === 'transport'
    || (reason.kind === 'http' && reason.status !== null && TRANSIENT_ALBUM_READ_STATUSES.has(reason.status))
  );
}
async function readJsonOnce<T>(path: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}${path}`, {
        headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'include', mode: 'cors', signal: controller.signal,
      });
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === 'AbortError') throw new AdminReadError('timeout', 'Canonical Album read timed out.');
      throw new AdminReadError('transport', 'Canonical Album read transport was interrupted.');
    }
    if (!isJson(response)) {
      if (TRANSIENT_ALBUM_READ_STATUSES.has(response.status)) {
        throw new AdminReadError('http', `Track Manager Album read returned transient HTTP ${response.status} without JSON.`, response.status);
      }
      throw new AdminReadError('access-or-cors', 'Cloudflare Access session is not available to Studio Album Management.', response.status || null);
    }
    if (!response.ok) throw new AdminReadError(response.status === 401 || response.status === 403 ? 'access-or-cors' : 'http', `Track Manager Album read returned HTTP ${response.status}.`, response.status);
    try { return await response.json() as T; } catch { throw new AdminReadError('invalid-response', 'Track Manager Album read returned invalid JSON.', response.status); }
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
async function readJson<T>(path: string, timeoutMs = 7000): Promise<T> {
  let firstTransientFailure: AdminReadError | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await readJsonOnce<T>(path, timeoutMs);
    } catch (reason) {
      if (attempt === 0 && isTransientAlbumReadError(reason)) {
        firstTransientFailure = reason;
        continue;
      }
      if (firstTransientFailure && reason instanceof AdminReadError) {
        throw new AdminReadError(
          reason.kind,
          `Canonical Album read failed after one bounded transient retry. ${reason.message}`,
          reason.status,
        );
      }
      throw reason;
    }
  }
  throw new AdminReadError('transport', 'Canonical Album read retry loop ended unexpectedly.');
}
async function writeJson(path: string, body: unknown): Promise<AdminAlbumWriteResponse> {
  let response: Response;
  try { response = await fetch(`${baseUrl()}${path}`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(body), cache: 'no-store', credentials: 'include', mode: 'cors' }); }
  catch { throw new AlbumAdminError('Album write failed before Track Manager returned a response. Reload canonical Album state before retrying.', null, 'ALBUM_WRITE_TRANSPORT'); }
  if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Studio Album writes.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
  let payload: AdminAlbumWriteResponse;
  try { payload = await response.json() as AdminAlbumWriteResponse; } catch { throw new AlbumAdminError('Track Manager Album write returned invalid JSON. Reload canonical state before retrying.', response.status || null, 'ALBUM_INVALID_RESPONSE'); }
  if (!response.ok) throw new AlbumAdminError(
    albumWriteErrorMessage(payload, `Track Manager Album write returned HTTP ${response.status}.`),
    response.status,
    payload.code || null,
    payload.currentUpdatedAt || null,
    payload.rollback || null,
    payload.quality || null,
    payload.verificationDetail || null,
  );
  return payload;
}
async function deleteAlbumAssetRequest(albumId: string, kind: AdminAlbumAssetKind, expectedUpdatedAt: string): Promise<AdminAlbumWriteResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/albums/${encodeURIComponent(albumId)}/assets/${kind}/delete`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: INTENT.deleteAsset, expectedUpdatedAt }),
        cache: 'no-store', credentials: 'include', mode: 'cors', signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AlbumAdminError(
        timedOut
          ? 'Album asset deletion timed out. Studio will reread canonical Album state before any retry.'
          : 'Album asset deletion transport was interrupted. Studio will reread canonical Album state before any retry.',
        null,
        timedOut ? 'ALBUM_ASSET_DELETE_TIMEOUT' : 'ALBUM_ASSET_DELETE_TRANSPORT',
        null,
        null,
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }
    if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Album asset deletion.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
    let payload: AdminAlbumWriteResponse;
    try { payload = await response.json() as AdminAlbumWriteResponse; }
    catch { throw new AlbumAdminError('Track Manager Album asset deletion returned invalid JSON.', response.status || null, 'ALBUM_ASSET_DELETE_INVALID_RESPONSE'); }
    if (!response.ok || payload.ok === false) throw new AlbumAdminError(
      albumWriteErrorMessage(payload, `Album asset deletion returned HTTP ${response.status}.`),
      response.status,
      payload.code || 'ALBUM_ASSET_DELETE_REJECTED',
      payload.currentUpdatedAt || null,
      payload.rollback || null,
      payload.quality || null,
      payload.verificationDetail || null,
    );
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
async function requireManage(capability: string) { const health = await getAdminBridgeHealth(); if (!(health.capabilities?.manage || []).includes(capability)) throw new AlbumAdminError(`Track Manager does not advertise ${capability}. The Album write stays locked.`); }
async function verify(albumId: string, payload: AdminAlbumWriteResponse, options: { expectedTrackIds?: string[]; expectedMetadata?: AdminAlbumMetadataPatch } = {}): Promise<AdminAlbumWriteResponse> {
  const expectedRevision = payload.updatedAt || payload.album?.updatedAt || null;
  let clientVerified = false; let verificationWarning: string | null = null;
  try {
    const reread = await getAdminAlbum(albumId);
    const manifest = reread.album?.manifest;
    const revisionMatches = Boolean(expectedRevision && manifest?.updatedAt === expectedRevision);
    const trackIdsMatch = !options.expectedTrackIds || JSON.stringify(manifest?.trackIds || []) === JSON.stringify(options.expectedTrackIds);
    const mismatchedMetadata = metadataMismatch(manifest, options.expectedMetadata);
    clientVerified = revisionMatches && trackIdsMatch && mismatchedMetadata.length === 0;
    if (!clientVerified) {
      const detail: string[] = [];
      if (!revisionMatches) detail.push('canonical revision does not match the write result');
      if (!trackIdsMatch) detail.push('canonical tracklist does not match the saved tracklist');
      for (const key of mismatchedMetadata) detail.push(`${key} requested=${JSON.stringify(options.expectedMetadata?.[key] ?? null)} canonical=${JSON.stringify(manifest?.[key] ?? null)}`);
      verificationWarning = `Canonical Album reread mismatch: ${detail.join('; ')}. Reloaded canonical state is authoritative.`;
    }
  }
  catch (reason) { verificationWarning = `Server reported success, but Studio could not complete the canonical Album reread (${reason instanceof Error ? reason.message : String(reason)}).`; }
  return { ...payload, clientVerified, verificationWarning };
}

export function adminAlbumMediaUrl(albumId: string, kind: AdminAlbumAssetKind): string {
  assertId(albumId);
  return `${baseUrl()}/api/studio/albums/${encodeURIComponent(albumId)}/media/${kind}`;
}

export async function getAdminAlbums(): Promise<AdminAlbumsResponse> { const payload = await readJson<AdminAlbumsResponse>('/api/studio/albums'); if (payload.ok === false || !Array.isArray(payload.albums)) throw new AdminReadError('invalid-response', 'Track Manager returned an invalid Album collection.'); return payload; }
export async function getAdminAlbum(albumId: string): Promise<AdminAlbumResponse> { assertId(albumId); const payload = await readJson<AdminAlbumResponse>(`/api/studio/albums/${encodeURIComponent(albumId)}`); if (payload.ok === false || !payload.album?.manifest) throw new AdminReadError('invalid-response', 'Track Manager returned an invalid canonical Album response.'); return payload; }
export async function createAdminAlbum(album: { id: string } & AdminAlbumMetadataPatch) { assertId(album.id); await requireManage('album-create'); const payload = await writeJson('/api/studio/albums', { intent: INTENT.create, album }); if (!payload.created || !payload.album) throw new AlbumAdminError('Track Manager returned an invalid Album create response.'); return verify(album.id, payload); }
export async function saveAdminAlbumMetadata(albumId: string, expectedUpdatedAt: string, metadata: AdminAlbumMetadataPatch) { assertId(albumId); if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.'); await requireManage('album-metadata'); const payload = await writeJson(`/api/studio/albums/${encodeURIComponent(albumId)}/metadata/save`, { intent: INTENT.metadata, expectedUpdatedAt, metadata }); if (!payload.saved || !payload.album) throw new AlbumAdminError('Track Manager returned an invalid Album metadata response.'); return verify(albumId, payload, { expectedMetadata: metadata }); }
export async function saveAdminAlbumMembership(albumId: string, expectedUpdatedAt: string, trackIds: string[]) { assertId(albumId); if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.'); await requireManage('album-membership'); const payload = await writeJson(`/api/studio/albums/${encodeURIComponent(albumId)}/tracks/save`, { intent: INTENT.membership, expectedUpdatedAt, trackIds }); if (!payload.saved || !Array.isArray(payload.trackIds)) throw new AlbumAdminError('Track Manager returned an invalid Album membership response.'); return verify(albumId, payload, { expectedTrackIds: payload.trackIds }); }
export async function moveAdminAlbumTrack(targetAlbumId: string, input: { trackId: string; sourceAlbumId?: string | null; expectedTargetUpdatedAt: string; expectedSourceUpdatedAt?: string | null; targetIndex?: number }) {
  assertId(targetAlbumId); assertId(input.trackId, 'trackId'); if (input.sourceAlbumId) assertId(input.sourceAlbumId); if (!input.expectedTargetUpdatedAt) throw new AlbumAdminError('Target Album revision is required.'); await requireManage('album-move');
  const payload = await writeJson(`/api/studio/albums/${encodeURIComponent(targetAlbumId)}/tracks/move`, { intent: INTENT.move, ...input, sourceAlbumId: input.sourceAlbumId || null }); if (!payload.moved) throw new AlbumAdminError('Track Manager returned an invalid Album move response.');
  let clientVerified = false; let verificationWarning: string | null = null;
  try {
    const [target, source, track] = await Promise.all([
      getAdminAlbum(targetAlbumId),
      input.sourceAlbumId && input.sourceAlbumId !== targetAlbumId ? getAdminAlbum(input.sourceAlbumId) : Promise.resolve(null),
      getAdminTrack(input.trackId),
    ]);
    const targetOwnsTrack = target.album?.manifest?.trackIds.includes(input.trackId) === true;
    const sourceReleasedTrack = !source || source.album?.manifest?.trackIds.includes(input.trackId) === false;
    const trackCacheMatches = track.track?.manifest?.album?.id === targetAlbumId;
    clientVerified = targetOwnsTrack && sourceReleasedTrack && trackCacheMatches;
    if (!clientVerified) verificationWarning = 'Canonical reread did not verify Album membership plus the track-side compatibility cache.';
  }
  catch (reason) { verificationWarning = `Move succeeded server-side, but canonical Album + Track reread failed (${reason instanceof Error ? reason.message : String(reason)}).`; }
  return { ...payload, clientVerified, verificationWarning };
}
export async function uploadAdminAlbumAsset(albumId: string, kind: AdminAlbumAssetKind, expectedUpdatedAt: string, file: File) {
  assertId(albumId); if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.'); await requireManage('album-assets'); const form = new FormData(); form.set('intent', INTENT.upload); form.set('expectedUpdatedAt', expectedUpdatedAt); form.set('file', file, file.name);
  let response: Response; try { response = await fetch(`${baseUrl()}/api/studio/albums/${encodeURIComponent(albumId)}/assets/${kind}/upload`, { method: 'POST', headers: { Accept: 'application/json' }, body: form, cache: 'no-store', credentials: 'include', mode: 'cors' }); } catch { throw new AlbumAdminError('Album asset upload failed before Track Manager returned a response. Reload canonical Album state before retrying.', null, 'ALBUM_ASSET_TRANSPORT'); }
  if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Album asset upload.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED'); const payload = await response.json() as AdminAlbumWriteResponse; if (!response.ok) throw new AlbumAdminError(albumWriteErrorMessage(payload, `Album asset upload returned HTTP ${response.status}.`), response.status, payload.code || null, payload.currentUpdatedAt || null, payload.rollback || null, payload.quality || null, payload.verificationDetail || null); if (!payload.saved || !payload.updatedAt) throw new AlbumAdminError('Track Manager returned an invalid Album asset upload response.'); return verify(albumId, payload);
}
export async function deleteAdminAlbumAsset(albumId: string, kind: AdminAlbumAssetKind, expectedUpdatedAt: string): Promise<AdminAlbumWriteResponse> {
  assertId(albumId);
  if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.');
  await requireManage('album-assets');

  const before = await getAdminAlbum(albumId);
  const beforeManifest = before.album?.manifest;
  const beforeAsset = before.album?.assets?.[kind];
  if (!beforeManifest?.updatedAt || beforeManifest.updatedAt !== expectedUpdatedAt) {
    throw new AlbumAdminError('The Album changed before this deletion began. Reload before another write.', 409, 'ALBUM_STALE_MANIFEST', beforeManifest?.updatedAt || null);
  }
  if (!beforeAsset?.present && !beforeManifest.assets?.[kind]) {
    throw new AlbumAdminError('The canonical Album asset is already missing. Reload instead of issuing another destructive write.', 409, 'ALBUM_ASSET_ALREADY_MISSING', expectedUpdatedAt);
  }

  let payload: AdminAlbumWriteResponse;
  try {
    payload = await deleteAlbumAssetRequest(albumId, kind, expectedUpdatedAt);
  } catch (reason) {
    if (!(reason instanceof AlbumAdminError) || !['ALBUM_ASSET_DELETE_TIMEOUT', 'ALBUM_ASSET_DELETE_TRANSPORT'].includes(reason.code || '')) throw reason;
    try {
      const reread = await getAdminAlbum(albumId);
      const manifest = reread.album?.manifest;
      const asset = reread.album?.assets?.[kind];
      const changed = Boolean(manifest?.updatedAt && manifest.updatedAt !== expectedUpdatedAt);
      const missing = !manifest?.assets?.[kind] && asset?.present !== true;
      if (changed && missing) {
        return {
          ok: true,
          deleted: true,
          albumId,
          previousUpdatedAt: expectedUpdatedAt,
          updatedAt: manifest?.updatedAt || null,
          album: manifest,
          clientVerified: true,
          verificationWarning: null,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          technicalDetails: `${reason.code}: response lost; canonical reread verified a new Album revision and the asset is absent.`,
        };
      }
      if (!changed && !missing) {
        throw new AlbumAdminError(
          'Canonical Album reread proves the delete did not commit. The asset is still present at the original revision; an explicit retry is safe after connectivity or Access is restored.',
          null,
          'ALBUM_ASSET_DELETE_NOT_COMMITTED',
          manifest?.updatedAt || expectedUpdatedAt,
          null,
          null,
          null,
          true,
          reason.technicalDetails,
        );
      }
      throw new AlbumAdminError(
        'Canonical Album state changed while the delete response was unavailable, but Studio cannot prove this deletion caused it. Do not retry.',
        null,
        'ALBUM_ASSET_DELETE_AMBIGUOUS',
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
        'The Album delete response and canonical reread are both unavailable. Do not retry until Track Manager access is restored and the Album is reloaded.',
        null,
        'ALBUM_ASSET_DELETE_UNVERIFIED',
        null,
        null,
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }

  if (!payload.deleted || !payload.updatedAt) throw new AlbumAdminError('Track Manager returned an invalid Album asset delete response.');
  try {
    const reread = await getAdminAlbum(albumId);
    const manifest = reread.album?.manifest;
    const asset = reread.album?.assets?.[kind];
    const clientVerified = manifest?.updatedAt === payload.updatedAt && !manifest?.assets?.[kind] && asset?.present !== true;
    if (!clientVerified) {
      throw new AlbumAdminError(
        'Track Manager reported Album asset deletion success, but the canonical reread did not verify the exact new revision plus asset absence. Do not retry.',
        null,
        'ALBUM_ASSET_DELETE_AMBIGUOUS',
        manifest?.updatedAt || null,
      );
    }
    return { ...payload, album: manifest, clientVerified: true, retrySafe: false };
  } catch (reason) {
    if (reason instanceof AlbumAdminError) throw reason;
    throw new AlbumAdminError(
      'Track Manager reported Album asset deletion success, but Studio could not complete the canonical reread. Do not retry until the Album is reloaded.',
      null,
      'ALBUM_ASSET_DELETE_UNVERIFIED',
      null,
      null,
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }
}

export const albumAdminService = Object.freeze({
  intents: INTENT,
  transport: 'Track Manager v5.23 / bridge v1.13 only',
  privateReadRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-retry',
  privateReadMaxAttempts: 2,
});