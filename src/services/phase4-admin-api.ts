import {
  getAdminBridgeHealth,
  getAdminTrack,
  getAdminTracks,
  type AdminAssetKind,
  type AdminManifest,
  type AdminMetadataPatch,
  type AdminQuality,
} from './admin-api';
import { measureAudioFileEvidence } from './audio-duration-evidence';
import { studioConfig } from './config';

const TRACK_CREATE_INTENT = 'track-create-v1';
const ASSET_UPLOAD_INTENT = 'asset-upload-v1';
const ASSET_DELETE_INTENT = 'asset-delete-v1';
const CATALOG_REBUILD_INTENT = 'catalog-rebuild-v1';

export type Phase4ManageCapability = 'track-create' | 'assets' | 'catalog-rebuild';

type SimpleTransportFailure = {
  timeoutCode: string;
  transportCode: string;
  timeoutMessage: string;
  transportMessage: string;
};

export class Phase4AdminError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly currentUpdatedAt: string | null;
  readonly rollback: Record<string, boolean> | null;
  readonly retrySafe: boolean;
  readonly technicalDetails: string | null;

  constructor(
    message: string,
    status: number | null = null,
    code: string | null = null,
    currentUpdatedAt: string | null = null,
    rollback: Record<string, boolean> | null = null,
    retrySafe = false,
    technicalDetails: string | null = null,
  ) {
    super(message);
    this.name = 'Phase4AdminError';
    this.status = status;
    this.code = code;
    this.currentUpdatedAt = currentUpdatedAt;
    this.rollback = rollback;
    this.retrySafe = retrySafe;
    this.technicalDetails = technicalDetails;
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
  duration?: number | null;
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
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  technicalDetails?: string | null;
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
  if (!manage.includes(capability)) throw new Phase4AdminError(`Track Manager does not advertise ${capability}. This operation stays locked until the required bridge capability is active.`);
}

async function postSimple<T>(
  path: string,
  body: unknown,
  timeoutMs = 15000,
  transportFailure?: SimpleTransportFailure,
): Promise<T> {
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
      const timedOut = error instanceof DOMException && error.name === 'AbortError';
      if (transportFailure) {
        throw new Phase4AdminError(
          timedOut ? transportFailure.timeoutMessage : transportFailure.transportMessage,
          null,
          timedOut ? transportFailure.timeoutCode : transportFailure.transportCode,
          null,
          null,
          false,
          error instanceof Error ? error.message : String(error),
        );
      }
      if (timedOut) throw new Phase4AdminError('Track Manager operation timed out. Reload canonical state before retrying.');
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

async function uploadViaFetch(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<AssetMutationResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 120000);
  try {
    // Fetch + browser-generated multipart boundary keeps this request CORS-simple.
    // Do not add a Content-Type header or an upload listener: either would force a preflight.
    onProgress?.(15);
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        body: formData,
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new Phase4AdminError(
        timedOut
          ? 'Asset upload timed out. Studio will reread canonical state before allowing a retry.'
          : 'Asset upload transport was interrupted. Studio will reread canonical state before allowing a retry.',
        null,
        timedOut ? 'ASSET_UPLOAD_TIMEOUT' : 'ASSET_UPLOAD_TRANSPORT',
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }
    onProgress?.(85);
    if (!isJsonResponse(response)) {
      throw new Phase4AdminError(
        'Cloudflare Access did not return an authenticated JSON response. Open Track Manager, sign in, then reload Studio.',
        response.status || null,
        'ACCESS_SESSION_REQUIRED',
      );
    }
    let payload: AssetMutationResponse;
    try { payload = await response.json() as AssetMutationResponse; }
    catch { throw new Phase4AdminError('Track Manager returned invalid asset upload JSON.', response.status || null, 'INVALID_ASSET_RESPONSE'); }
    if (!response.ok || payload.ok === false) {
      throw new Phase4AdminError(
        payload.error || `Asset upload returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'ASSET_UPLOAD_REJECTED',
        payload.currentUpdatedAt || null,
        payload.rollback || null,
      );
    }
    onProgress?.(100);
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export interface Phase4ErrorPresentation {
  title: string;
  message: string;
  nextAction: string;
  retrySafe: boolean;
  technicalDetails: string | null;
}

export function phase4ErrorPresentation(reason: unknown): Phase4ErrorPresentation {
  if (!(reason instanceof Phase4AdminError)) {
    return {
      title: 'Unexpected Studio error',
      message: reason instanceof Error ? reason.message : String(reason),
      nextAction: 'Keep the selected files, reload canonical state, and inspect Track Manager before retrying.',
      retrySafe: false,
      technicalDetails: reason instanceof Error ? reason.stack || null : null,
    };
  }
  const code = reason.code || 'PHASE4_OPERATION_ERROR';
  if (code === 'ACCESS_SESSION_REQUIRED') return { title: 'Track Manager sign-in required', message: reason.message, nextAction: 'Open Track Manager, complete Cloudflare Access sign-in, then reload Studio.', retrySafe: false, technicalDetails: code };
  if (code === 'ASSET_UPLOAD_NOT_COMMITTED') return { title: 'Upload not committed', message: reason.message, nextAction: 'The canonical revision is unchanged. You may use Retry after restoring connectivity or Access.', retrySafe: true, technicalDetails: [code, reason.technicalDetails].filter(Boolean).join(' · ') };
  if (code === 'ASSET_UPLOAD_AMBIGUOUS' || code === 'ASSET_UPLOAD_UNVERIFIED') return { title: 'Upload state needs inspection', message: reason.message, nextAction: 'Do not retry. Reload the track and inspect the canonical asset in Track Manager first.', retrySafe: false, technicalDetails: [code, reason.currentUpdatedAt, reason.technicalDetails].filter(Boolean).join(' · ') };
  if (code === 'ASSET_DELETE_NOT_COMMITTED') return { title: 'Delete not committed', message: reason.message, nextAction: 'Canonical reread proves the asset is still present at the same revision. An explicit retry is safe after connectivity or Access is restored.', retrySafe: true, technicalDetails: [code, reason.technicalDetails].filter(Boolean).join(' · ') };
  if (code === 'ASSET_DELETE_AMBIGUOUS' || code === 'ASSET_DELETE_UNVERIFIED') return { title: 'Delete state needs inspection', message: reason.message, nextAction: 'Do not retry. Reload the track and inspect the canonical asset in Track Manager first.', retrySafe: false, technicalDetails: [code, reason.currentUpdatedAt, reason.technicalDetails].filter(Boolean).join(' · ') };
  if (reason.status === 409 || /STALE|CONFLICT/i.test(code)) return { title: 'Track changed elsewhere', message: reason.message, nextAction: 'Reload the workspace to obtain the latest canonical revision before deciding whether to retry.', retrySafe: false, technicalDetails: [code, reason.currentUpdatedAt].filter(Boolean).join(' · ') };
  if (reason.status === 413 || /TOO_LARGE/i.test(code)) return { title: 'File exceeds the allowed size', message: reason.message, nextAction: 'Choose a smaller valid file; do not repeatedly retry the same upload.', retrySafe: false, technicalDetails: code };
  if (reason.status === 400 || reason.status === 415 || /INVALID|UNSUPPORTED/i.test(code)) return { title: 'File or request rejected', message: reason.message, nextAction: 'Review the file type and Track Manager validation details, then choose a compliant file.', retrySafe: false, technicalDetails: code };
  return { title: 'Track Manager operation failed', message: reason.message, nextAction: reason.retrySafe ? 'Canonical state is unchanged; an explicit retry is safe.' : 'Reload canonical state before another write.', retrySafe: reason.retrySafe, technicalDetails: [code, reason.status ? `HTTP ${reason.status}` : '', reason.technicalDetails].filter(Boolean).join(' · ') };
}

function stableCreateManifestJson(value: unknown): string {
  function normalize(input: unknown): unknown {
    if (Array.isArray(input)) return input.map(normalize);
    if (!input || typeof input !== 'object') return input;
    const record = input as Record<string, unknown>;
    return Object.keys(record).sort().reduce<Record<string, unknown>>((result, key) => {
      const normalized = normalize(record[key]);
      if (normalized !== undefined) result[key] = normalized;
      return result;
    }, {});
  }
  return JSON.stringify(normalize(value));
}

export async function createAdminTrack(slug: string, metadata: AdminMetadataPatch): Promise<TrackCreateResponse> {
  if (!validTrackId(slug)) throw new Phase4AdminError('Track ID must be lower-case kebab-case.');
  await requireManage('track-create');
  const payload = await postSimple<TrackCreateResponse>('/api/studio/tracks/create', {
    intent: TRACK_CREATE_INTENT,
    slug,
    metadata,
  });
  const responseManifest = payload.track;
  if (!payload.created || payload.trackId !== slug || !responseManifest?.updatedAt || responseManifest.slug !== slug || responseManifest.status !== 'draft') {
    throw new Phase4AdminError('Track Manager returned an invalid create response.');
  }
  const reread = await getAdminTrack(slug);
  const canonicalManifest = reread.track?.manifest;
  const clientVerified = Boolean(
    canonicalManifest?.updatedAt === responseManifest.updatedAt
    && stableCreateManifestJson(canonicalManifest) === stableCreateManifestJson(responseManifest),
  );
  return { ...payload, track: canonicalManifest || responseManifest, clientVerified };
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
  const before = await getAdminTrack(trackId);
  const beforeManifest = before.track?.manifest;
  const beforeAsset = before.track?.assets?.[kind];
  if (!beforeManifest?.updatedAt || beforeManifest.updatedAt !== expectedUpdatedAt) {
    throw new Phase4AdminError(
      'The track changed before this upload began. Reload the workspace before another write.',
      409,
      'STALE_MANIFEST',
      beforeManifest?.updatedAt || null,
    );
  }
  const audioEvidence = kind === 'audio' ? await measureAudioFileEvidence(file) : null;
  const formData = new FormData();
  formData.set('intent', ASSET_UPLOAD_INTENT);
  formData.set('expectedUpdatedAt', expectedUpdatedAt);
  formData.set('file', file);
  if (audioEvidence) {
    formData.set('audioDuration', String(audioEvidence.audio.duration));
    formData.set('audioReadable', 'true');
  }
  let payload: AssetMutationResponse;
  try {
    payload = await uploadViaFetch(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/assets/${kind}/upload`, formData, onProgress);
  } catch (reason) {
    if (!(reason instanceof Phase4AdminError) || !['ASSET_UPLOAD_TIMEOUT', 'ASSET_UPLOAD_TRANSPORT'].includes(reason.code || '')) throw reason;
    try {
      const reread = await getAdminTrack(trackId);
      const manifest = reread.track?.manifest;
      const asset = reread.track?.assets?.[kind];
      const changed = Boolean(manifest?.updatedAt && manifest.updatedAt !== expectedUpdatedAt);
      const matchesSelectedFile = asset?.present === true && asset.size === file.size && (!file.type || !asset.contentType || asset.contentType === file.type);
      const changedAssetFingerprint = beforeAsset?.present !== true
        || Boolean(asset?.etag && beforeAsset.etag && asset.etag !== beforeAsset.etag)
        || asset?.size !== beforeAsset?.size
        || asset?.filename !== beforeAsset?.filename;
      if (changed && matchesSelectedFile && changedAssetFingerprint) {
        onProgress?.(100);
        return {
          ok: true,
          saved: true,
          trackId,
          kind,
          filename: asset.filename || manifest?.assets?.[kind] || file.name,
          size: asset.size ?? file.size,
          contentType: asset.contentType || file.type || null,
          etag: asset.etag || null,
          previousUpdatedAt: expectedUpdatedAt,
          updatedAt: manifest?.updatedAt || null,
          duration: manifest?.duration ?? null,
          quality: reread.track?.quality || null,
          clientVerified: true,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          technicalDetails: `${reason.code}: response lost; canonical reread verified the selected asset size and a new manifest revision.`,
        };
      }
      if (!changed) {
        throw new Phase4AdminError(
          'The upload did not reach canonical storage. Your selected file is still available; retry is safe after checking your Access session.',
          null,
          'ASSET_UPLOAD_NOT_COMMITTED',
          manifest?.updatedAt || expectedUpdatedAt,
          null,
          true,
          reason.technicalDetails,
        );
      }
      throw new Phase4AdminError(
        'Canonical state changed while the upload response was unavailable. Reload this track and inspect the asset before any retry.',
        null,
        'ASSET_UPLOAD_AMBIGUOUS',
        manifest?.updatedAt || null,
        null,
        false,
        reason.technicalDetails,
      );
    } catch (rereadReason) {
      if (rereadReason instanceof Phase4AdminError) throw rereadReason;
      throw new Phase4AdminError(
        'The upload response and canonical reread are both unavailable. Do not retry until Track Manager access is restored and the track is reloaded.',
        null,
        'ASSET_UPLOAD_UNVERIFIED',
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }
  if (!payload.saved || !payload.updatedAt || !payload.filename) throw new Phase4AdminError('Track Manager returned an invalid asset upload response.');
  try {
    const reread = await getAdminTrack(trackId);
    const manifest = reread.track?.manifest;
    const asset = reread.track?.assets?.[kind];
    const durationVerified = payload.duration == null || manifest?.duration === payload.duration;
    const sizeVerified = payload.size == null || asset?.size === payload.size;
    const contentTypeVerified = !payload.contentType || asset?.contentType === payload.contentType;
    const etagVerified = !payload.etag || asset?.etag === payload.etag;
    const clientVerified = manifest?.updatedAt === payload.updatedAt
      && manifest?.assets?.[kind] === payload.filename
      && asset?.present === true
      && sizeVerified
      && contentTypeVerified
      && etagVerified
      && durationVerified;
    if (!clientVerified) {
      const mismatches = [
        manifest?.updatedAt === payload.updatedAt ? null : 'canonical revision',
        manifest?.assets?.[kind] === payload.filename ? null : 'manifest asset filename',
        asset?.present === true ? null : 'private asset presence',
        sizeVerified ? null : 'asset size',
        contentTypeVerified ? null : 'asset content type',
        etagVerified ? null : 'asset ETag',
        durationVerified ? null : 'canonical duration',
      ].filter(Boolean).join(', ');
      throw new Phase4AdminError(
        `Track Manager reported asset upload success, but the canonical reread did not verify the exact new revision plus server asset fingerprint (${mismatches || 'unknown mismatch'}). Do not retry.`,
        null,
        'ASSET_UPLOAD_UNVERIFIED',
        manifest?.updatedAt || null,
        null,
        false,
        `response updatedAt=${payload.updatedAt}; filename=${payload.filename}; size=${payload.size ?? 'n/a'}; contentType=${payload.contentType ?? 'n/a'}; etag=${payload.etag ?? 'n/a'}`,
      );
    }
    return { ...payload, clientVerified: true, retrySafe: false };
  } catch (reason) {
    if (reason instanceof Phase4AdminError) throw reason;
    throw new Phase4AdminError(
      'Track Manager reported asset upload success, but Studio could not complete the canonical asset reread. Do not retry until the track is reloaded and inspected.',
      null,
      'ASSET_UPLOAD_UNVERIFIED',
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }
}

export async function deleteAdminTrackAsset(
  trackId: string,
  kind: AdminAssetKind,
  expectedUpdatedAt: string,
): Promise<AssetMutationResponse> {
  if (!validTrackId(trackId)) throw new Phase4AdminError('Invalid trackId.');
  if (!expectedUpdatedAt.trim()) throw new Phase4AdminError('Canonical updatedAt is required for asset deletion.');
  await requireManage('assets');

  const before = await getAdminTrack(trackId);
  const beforeManifest = before.track?.manifest;
  const beforeAsset = before.track?.assets?.[kind];
  if (!beforeManifest?.updatedAt || beforeManifest.updatedAt !== expectedUpdatedAt) {
    throw new Phase4AdminError(
      'The track changed before this deletion began. Reload the workspace before another write.',
      409,
      'STALE_MANIFEST',
      beforeManifest?.updatedAt || null,
    );
  }
  if (!beforeAsset?.present && !beforeManifest.assets?.[kind]) {
    throw new Phase4AdminError('The canonical asset is already missing. Reload the workspace instead of issuing another destructive write.', 409, 'ASSET_ALREADY_MISSING', expectedUpdatedAt);
  }

  let payload: AssetMutationResponse;
  try {
    payload = await postSimple<AssetMutationResponse>(
      `/api/studio/tracks/${encodeURIComponent(trackId)}/assets/${kind}/delete`,
      { intent: ASSET_DELETE_INTENT, expectedUpdatedAt },
      30000,
      {
        timeoutCode: 'ASSET_DELETE_TIMEOUT',
        transportCode: 'ASSET_DELETE_TRANSPORT',
        timeoutMessage: 'Asset deletion timed out. Studio will reread canonical state before any retry.',
        transportMessage: 'Asset deletion transport was interrupted. Studio will reread canonical state before any retry.',
      },
    );
  } catch (reason) {
    if (!(reason instanceof Phase4AdminError) || !['ASSET_DELETE_TIMEOUT', 'ASSET_DELETE_TRANSPORT'].includes(reason.code || '')) throw reason;
    try {
      const reread = await getAdminTrack(trackId);
      const manifest = reread.track?.manifest;
      const asset = reread.track?.assets?.[kind];
      const changed = Boolean(manifest?.updatedAt && manifest.updatedAt !== expectedUpdatedAt);
      const missing = !manifest?.assets?.[kind] && asset?.present !== true;
      if (changed && missing) {
        return {
          ok: true,
          deleted: true,
          trackId,
          kind,
          filename: beforeAsset?.filename || beforeManifest.assets?.[kind] || null,
          previousUpdatedAt: expectedUpdatedAt,
          updatedAt: manifest?.updatedAt || null,
          quality: reread.track?.quality || null,
          clientVerified: true,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          technicalDetails: `${reason.code}: response lost; canonical reread verified a new manifest revision and the asset is absent.`,
        };
      }
      if (!changed && !missing) {
        throw new Phase4AdminError(
          'Canonical reread proves the delete did not commit. The asset is still present at the original revision.',
          null,
          'ASSET_DELETE_NOT_COMMITTED',
          manifest?.updatedAt || expectedUpdatedAt,
          null,
          true,
          reason.technicalDetails,
        );
      }
      throw new Phase4AdminError(
        'Canonical state changed while the delete response was unavailable, but Studio cannot prove this deletion caused it. Do not retry.',
        null,
        'ASSET_DELETE_AMBIGUOUS',
        manifest?.updatedAt || null,
        null,
        false,
        reason.technicalDetails,
      );
    } catch (rereadReason) {
      if (rereadReason instanceof Phase4AdminError) throw rereadReason;
      throw new Phase4AdminError(
        'The delete response and canonical reread are both unavailable. Do not retry until Track Manager access is restored and the track is reloaded.',
        null,
        'ASSET_DELETE_UNVERIFIED',
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }

  if (!payload.deleted || !payload.updatedAt) throw new Phase4AdminError('Track Manager returned an invalid asset delete response.');
  try {
    const reread = await getAdminTrack(trackId);
    const manifest = reread.track?.manifest;
    const asset = reread.track?.assets?.[kind];
    const clientVerified = manifest?.updatedAt === payload.updatedAt && !manifest?.assets?.[kind] && !asset?.present;
    if (!clientVerified) {
      throw new Phase4AdminError(
        'Track Manager reported asset deletion success, but the canonical reread did not verify the exact new revision plus asset absence. Do not retry.',
        null,
        'ASSET_DELETE_AMBIGUOUS',
        manifest?.updatedAt || null,
      );
    }
    return { ...payload, clientVerified: true, retrySafe: false };
  } catch (reason) {
    if (reason instanceof Phase4AdminError) throw reason;
    throw new Phase4AdminError(
      'Track Manager reported asset deletion success, but Studio could not complete the canonical reread. Do not retry until the track is reloaded.',
      null,
      'ASSET_DELETE_UNVERIFIED',
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }
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
  trackCreateSuccessVerificationPolicy: 'server-normalized-manifest-plus-private-reread-exact-match',
  trackCreateLostResponsePolicy: 'not-covered-no-operation-id-no-blind-retry',
  maxAutomaticTrackCreateRetries: 0,
  phase5Enabled: false,
});