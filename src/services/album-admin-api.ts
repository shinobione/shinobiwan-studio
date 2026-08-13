import { AdminReadError, getAdminBridgeHealth, getAdminTrack } from './admin-api';
import { studioConfig } from './config';

const INTENT = {
  create: 'album-create-v1', metadata: 'album-metadata-save-v1', membership: 'album-membership-save-v1',
  move: 'album-track-move-v1', upload: 'album-asset-upload-v1', deleteAsset: 'album-asset-delete-v1',
} as const;
export type AdminAlbumType = 'album' | 'ep' | 'collection';
export type AdminAlbumStatus = 'draft' | 'published' | 'archived';
export type AdminAlbumAssetKind = 'cover' | 'thumbnail';
export interface AdminAlbumAssetState { present?: boolean; path?: string | null; key?: string | null; size?: number | null; contentType?: string | null; etag?: string | null; uploaded?: string | null; }
export interface AdminAlbumManifest { schemaVersion?: 1; id: string; title: string; type: AdminAlbumType; status: AdminAlbumStatus; year: number | null; releaseDate: string | null; description: string | null; heading: string | null; trackIds: string[]; accent: string | null; accent2: string | null; assets: { cover: string | null; thumbnail: string | null }; createdAt: string | null; updatedAt: string | null; updatedBy?: string | null; }
export interface AdminAlbumSummary extends AdminAlbumManifest { assetState?: Partial<Record<AdminAlbumAssetKind, AdminAlbumAssetState | null>>; }
export interface AdminAlbumsResponse { ok?: boolean; albums?: AdminAlbumSummary[]; totals?: { total?: number; published?: number; draft?: number; archived?: number; trackRefs?: number }; }
export interface AdminAlbumResponse { ok?: boolean; album?: { manifest?: AdminAlbumManifest; assets?: Partial<Record<AdminAlbumAssetKind, AdminAlbumAssetState | null>> } }
export interface AdminAlbumMetadataPatch { title?: string; type?: AdminAlbumType; status?: AdminAlbumStatus; year?: number | null; releaseDate?: string | null; description?: string | null; heading?: string | null; accent?: string | null; accent2?: string | null; }
export interface AdminAlbumWriteResponse { ok?: boolean; created?: boolean; saved?: boolean; moved?: boolean; deleted?: boolean; albumId?: string; album?: AdminAlbumManifest; trackIds?: string[]; targetTrackIds?: string[]; sourceTrackIds?: string[] | null; previousUpdatedAt?: string | null; updatedAt?: string | null; targetUpdatedAt?: string | null; sourceUpdatedAt?: string | null; code?: string; currentUpdatedAt?: string | null; error?: string; rollback?: Record<string, unknown> | null; clientVerified?: boolean; verificationWarning?: string | null; }

export class AlbumAdminError extends Error {
  constructor(message: string, readonly status: number | null = null, readonly code: string | null = null, readonly currentUpdatedAt: string | null = null, readonly rollback: Record<string, unknown> | null = null) { super(message); this.name = 'AlbumAdminError'; }
}
function baseUrl() { return studioConfig.trackManagerUrl.replace(/\/$/, ''); }
function assertId(value: string, label = 'Album ID') { if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(value)) throw new AlbumAdminError(`Invalid canonical ${label}.`); }
function isJson(response: Response) { return (response.headers.get('content-type') || '').toLowerCase().includes('application/json'); }
async function readJson<T>(path: string): Promise<T> {
  let response: Response;
  try { response = await fetch(`${baseUrl()}${path}`, { headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'include', mode: 'cors' }); }
  catch { throw new AdminReadError('access-or-cors', 'Canonical Album read is unavailable. Authenticate with Cloudflare Access and retry.'); }
  if (!isJson(response)) throw new AdminReadError('access-or-cors', 'Cloudflare Access session is not available to Studio Album Management.', response.status || null);
  if (!response.ok) throw new AdminReadError(response.status === 401 || response.status === 403 ? 'access-or-cors' : 'http', `Track Manager Album read returned HTTP ${response.status}.`, response.status);
  try { return await response.json() as T; } catch { throw new AdminReadError('invalid-response', 'Track Manager Album read returned invalid JSON.', response.status); }
}
async function writeJson(path: string, body: unknown): Promise<AdminAlbumWriteResponse> {
  let response: Response;
  try { response = await fetch(`${baseUrl()}${path}`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(body), cache: 'no-store', credentials: 'include', mode: 'cors' }); }
  catch { throw new AlbumAdminError('Album write failed before Track Manager returned a response. Reload canonical Album state before retrying.', null, 'ALBUM_WRITE_TRANSPORT'); }
  if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Studio Album writes.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
  let payload: AdminAlbumWriteResponse;
  try { payload = await response.json() as AdminAlbumWriteResponse; } catch { throw new AlbumAdminError('Track Manager Album write returned invalid JSON. Reload canonical state before retrying.', response.status || null, 'ALBUM_INVALID_RESPONSE'); }
  if (!response.ok) throw new AlbumAdminError(payload.error || `Track Manager Album write returned HTTP ${response.status}.`, response.status, payload.code || null, payload.currentUpdatedAt || null, payload.rollback || null);
  return payload;
}
async function requireManage(capability: string) { const health = await getAdminBridgeHealth(); if (!(health.capabilities?.manage || []).includes(capability)) throw new AlbumAdminError(`Track Manager does not advertise ${capability}. The Album write stays locked.`); }
async function verify(albumId: string, payload: AdminAlbumWriteResponse, expectedTrackIds?: string[]): Promise<AdminAlbumWriteResponse> {
  const expectedRevision = payload.updatedAt || payload.album?.updatedAt || null;
  let clientVerified = false; let verificationWarning: string | null = null;
  try { const reread = await getAdminAlbum(albumId); const manifest = reread.album?.manifest; clientVerified = Boolean(expectedRevision && manifest?.updatedAt === expectedRevision) && (!expectedTrackIds || JSON.stringify(manifest?.trackIds || []) === JSON.stringify(expectedTrackIds)); if (!clientVerified) verificationWarning = 'Canonical Album reread did not match the write result. Reload before further edits.'; }
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
export async function saveAdminAlbumMetadata(albumId: string, expectedUpdatedAt: string, metadata: AdminAlbumMetadataPatch) { assertId(albumId); if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.'); await requireManage('album-metadata'); const payload = await writeJson(`/api/studio/albums/${encodeURIComponent(albumId)}/metadata/save`, { intent: INTENT.metadata, expectedUpdatedAt, metadata }); if (!payload.saved || !payload.album) throw new AlbumAdminError('Track Manager returned an invalid Album metadata response.'); return verify(albumId, payload); }
export async function saveAdminAlbumMembership(albumId: string, expectedUpdatedAt: string, trackIds: string[]) { assertId(albumId); if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.'); await requireManage('album-membership'); const payload = await writeJson(`/api/studio/albums/${encodeURIComponent(albumId)}/tracks/save`, { intent: INTENT.membership, expectedUpdatedAt, trackIds }); if (!payload.saved || !Array.isArray(payload.trackIds)) throw new AlbumAdminError('Track Manager returned an invalid Album membership response.'); return verify(albumId, payload, payload.trackIds); }
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
  if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Album asset upload.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED'); const payload = await response.json() as AdminAlbumWriteResponse; if (!response.ok) throw new AlbumAdminError(payload.error || `Album asset upload returned HTTP ${response.status}.`, response.status, payload.code || null, payload.currentUpdatedAt || null, payload.rollback || null); if (!payload.saved || !payload.updatedAt) throw new AlbumAdminError('Track Manager returned an invalid Album asset upload response.'); return verify(albumId, payload);
}
export async function deleteAdminAlbumAsset(albumId: string, kind: AdminAlbumAssetKind, expectedUpdatedAt: string) { assertId(albumId); if (!expectedUpdatedAt) throw new AlbumAdminError('Canonical Album revision is required.'); await requireManage('album-assets'); const payload = await writeJson(`/api/studio/albums/${encodeURIComponent(albumId)}/assets/${kind}/delete`, { intent: INTENT.deleteAsset, expectedUpdatedAt }); if (!payload.deleted || !payload.updatedAt) throw new AlbumAdminError('Track Manager returned an invalid Album asset delete response.'); return verify(albumId, payload); }

export const albumAdminService = Object.freeze({ intents: INTENT, transport: 'Track Manager v5.21 / bridge v1.11 only' });
