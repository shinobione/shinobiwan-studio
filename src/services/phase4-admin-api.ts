import {
  getAdminBridgeHealth,
  getAdminTrack,
  getAdminTracks,
  type AdminAssetKind,
  type AdminManifest,
  type AdminMetadataPatch,
  type AdminQuality,
} from './admin-api';
import { studioConfig } from './config';

const TRACK_CREATE_INTENT = 'track-create-v1';
const ASSET_UPLOAD_INTENT = 'asset-upload-v1';
const ASSET_DELETE_INTENT = 'asset-delete-v1';
const CATALOG_REBUILD_INTENT = 'catalog-rebuild-v1';
const REQUIRED_MANAGE_CAPABILITIES = new Set(['track-create', 'assets', 'catalog-rebuild']);

export type Phase4ManageCapability = 'track-create' | 'assets' | 'catalog-rebuild';

export class Phase4AdminError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly currentUpdatedAt: string | null;
  readonly rollback: Record<string, boolean> | null;

  constructor(message: string, status: number | null = null, code: string | null = null, currentUpdatedAt: string | null = null, rollback: Record<string, boolean> | null = null) {
    super(message);
    this.name = 'Phase4AdminError';
    this.status = status;
    this.code = code;
    this.currentUpdatedAt = currentUpdatedAt;
    this.rollback = rollback;
  }
}

export interface TrackCreateResponse {
  ok?: boolean;
  created?: boolean;
  trackId?: string;
  track?: AdminManifest;
  catalogRebuilt?: boolean;
  catalogGeneratedAt?: string | null;
  catalogCount?: number | null;
  authenticatedEmail?: string | null;
  code?: string;
  error?: string;
  rollback?: Record<string, boolean> | null;
  clientVerified?: boolean;
}

export interface AssetMutationResponse {
  ok?: boolean;
  saved?: boolean;
  deleted?: boolean;
  trackId?: string;
  kind?: AdminAssetKind;
  filename?: string | null;
  size?: number | null;
  contentType?: string | null;
  etag?: string | null;
  previousUpdatedAt?: string | null;
  updatedAt?: string | null;
  quality?: AdminQuality | null;
  catalogRebuilt?: boolean;
  catalogGeneratedAt?: string | null;
  catalogCount?: number | null;
  authenticatedEmail?: string | null;
  code?: string;
  currentUpdatedAt?: string | null;
  error?: string;
  rollback?: Record<string, boolean> | null;
  clientVerified?: boolean;
}

export interface CatalogRebuildResponse {
  ok?: boolean;
  rebuilt?: boolean;
  catalogGeneratedAt?: string | null;
  catalogCount?: number | null;
  authenticatedEmail?: string | null;
  error?: string;
  clientVerified?: boolean;
}

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function validTrackId(trackId: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId);
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

async function requireManage(capability: Phase4ManageCapability): Promise<void> {
  const health = await getAdminBridgeHealth();
  const capabilities = health.capabilities as (typeof health.capabilities & { manage?: string[] }) | undefined;
  const manage = capabilities?.manage ?? [];
  const unexpected = manage.filter(item => !REQUIRED_MANAGE_CAPABILITIES.has(item));
  if (unexpected.length) throw new Phase4AdminError(`Track Manager advertises unexpected manage capability: ${unexpected.join(', ')}.`);
  if (!manage.includes(capability)) throw new Phase4AdminError(`Track Manager does not advertise ${capability}. This operation stays locked until bridge v1.5 is active.`);
}

async function postSimple<T>(path: string, body: unknown, timeoutMs = 15000): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}${path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw new Phase4AdminError('Track Manager operation timed out. Reload canonical state before retrying.');
      throw new Phase4AdminError('Track Manager operation is unavailable. Authenticate with Cloudflare Access and reload before retrying.');
    }
    if (!isJsonResponse(response)) throw new Phase4AdminError('Cloudflare Access session is not available to this Studio operation.', response.status || null);
    let payload: any;
    try { payload = await response.json(); }
    catch { throw new Phase4AdminError('Track Manager returned invalid operation JSON.', response.status || null); }
    if (!response.ok || payload?.ok === false) {
      throw new Phase4AdminError(
        payload?.error || `Track Manager operation returned HTTP ${response.status}.`,
        response.status,
        payload?.code || null,
        payload?.currentUpdatedAt || null,
        payload?.rollback || null,
      );
    }
    return payload as T;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

function uploadViaXhr(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<AssetMutationResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.withCredentials = true;
    xhr.timeout = 120000;
    xhr.upload.onprogress = event => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100))));
    };
    xhr.onerror = () => reject(new Phase4AdminError('Asset upload failed before Track Manager returned a response.'));
    xhr.ontimeout = () => reject(new Phase4AdminError('Asset upload timed out. Reload canonical state before retrying.'));
    xhr.onload = () => {
      const contentType = String(xhr.getResponseHeader('content-type') || '').toLowerCase();
      if (!contentType.includes('application/json')) {
        reject(new Phase4AdminError('Cloudflare Access session is not available to the Studio asset upload.', xhr.status || null));
        return;
      }
      let payload: AssetMutationResponse;
      try { payload = JSON.parse(xhr.responseText) as AssetMutationResponse; }
      catch {
        reject(new Phase4AdminError('Track Manager returned invalid asset upload JSON.', xhr.status || null));
        return;
      }
      if (xhr.status < 200 || xhr.status >= 300 || payload.ok === false) {
        reject(new Phase4AdminError(payload.error || `Asset upload returned HTTP ${xhr.status}.`, xhr.status, payload.code || null, payload.currentUpdatedAt || null, payload.rollback || null));
        return;
      }
      onProgress?.(100);
      resolve(payload);
    };
    xhr.send(formData);
  });
}

export async function createAdminTrack(slug: string, metadata: AdminMetadataPatch): Promise<TrackCreateResponse> {
  if (!validTrackId(slug)) throw new Phase4AdminError('Track ID must be lower-case kebab-case.');
  await requireManage('track-create');
  const payload = await postSimple<TrackCreateResponse>('/api/studio/tracks/create', {
    intent: TRACK_CREATE_INTENT,
    slug,
    metadata,
  });
  if (!payload.created || payload.trackId !== slug) throw new Phase4AdminError('Track Manager returned an invalid create response.');
  const reread = await getAdminTrack(slug);
  const clientVerified = reread.track?.manifest?.slug === slug && reread.track?.manifest?.status === 'draft';
  return { ...payload, clientVerified };
}

export async function uploadAdminTrackAsset(
  trackId: string,
  kind: AdminAssetKind,
  expectedUpdatedAt: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<AssetMutationResponse> {
  if (!validTrackId(trackId)) throw new Phase4AdminError('Invalid trackId.');
  if (!expectedUpdatedAt.trim()) throw new Phase4AdminError('Canonical updatedAt is required for asset upload.');
  if (!(file instanceof File) || file.size <= 0) throw new Phase4AdminError('Choose a non-empty file first.');
  await requireManage('assets');
  const formData = new FormData();
  formData.set('intent', ASSET_UPLOAD_INTENT);
  formData.set('expectedUpdatedAt', expectedUpdatedAt);
  formData.set('file', file);
  const payload = await uploadViaXhr(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/assets/${kind}/upload`, formData, onProgress);
  if (!payload.saved || !payload.updatedAt || !payload.filename) throw new Phase4AdminError('Track Manager returned an invalid asset upload response.');
  const reread = await getAdminTrack(trackId);
  const manifest = reread.track?.manifest;
  const asset = reread.track?.assets?.[kind];
  const clientVerified = manifest?.updatedAt === payload.updatedAt && manifest?.assets?.[kind] === payload.filename && asset?.present === true;
  return { ...payload, clientVerified };
}

export async function deleteAdminTrackAsset(
  trackId: string,
  kind: AdminAssetKind,
  expectedUpdatedAt: string,
): Promise<AssetMutationResponse> {
  if (!validTrackId(trackId)) throw new Phase4AdminError('Invalid trackId.');
  if (!expectedUpdatedAt.trim()) throw new Phase4AdminError('Canonical updatedAt is required for asset deletion.');
  await requireManage('assets');
  const payload = await postSimple<AssetMutationResponse>(`/api/studio/tracks/${encodeURIComponent(trackId)}/assets/${kind}/delete`, {
    intent: ASSET_DELETE_INTENT,
    expectedUpdatedAt,
  });
  if (!payload.deleted || !payload.updatedAt) throw new Phase4AdminError('Track Manager returned an invalid asset delete response.');
  const reread = await getAdminTrack(trackId);
  const manifest = reread.track?.manifest;
  const asset = reread.track?.assets?.[kind];
  const clientVerified = manifest?.updatedAt === payload.updatedAt && !manifest?.assets?.[kind] && !asset?.present;
  return { ...payload, clientVerified };
}

export async function rebuildAdminCatalog(): Promise<CatalogRebuildResponse> {
  await requireManage('catalog-rebuild');
  const payload = await postSimple<CatalogRebuildResponse>('/api/studio/catalog/rebuild', {
    intent: CATALOG_REBUILD_INTENT,
    confirm: 'REBUILD',
  }, 30000);
  if (!payload.rebuilt) throw new Phase4AdminError('Track Manager returned an invalid catalog rebuild response.');
  const catalog = await getAdminTracks();
  const clientVerified = Array.isArray(catalog.tracks) && (payload.catalogCount == null || catalog.tracks.length === payload.catalogCount);
  return { ...payload, clientVerified };
}

export const phase4AdminService = Object.freeze({
  trackCreateIntent: TRACK_CREATE_INTENT,
  assetUploadIntent: ASSET_UPLOAD_INTENT,
  assetDeleteIntent: ASSET_DELETE_INTENT,
  catalogRebuildIntent: CATALOG_REBUILD_INTENT,
  manageCapabilities: ['track-create', 'assets', 'catalog-rebuild'] as const,
  uploadTransport: 'multipart-formdata-simple-request',
  jsonTransport: 'text/plain-simple-request',
  wholeTrackDeleteEnabled: false,
  phase5Enabled: false,
});
