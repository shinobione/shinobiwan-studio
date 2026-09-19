import {
  getAdminBridgeHealth,
  getAdminTrack,
  type AdminAssetKind,
  type AdminAssetState,
} from './admin-api';
import { measureAudioFileEvidence } from './audio-duration-evidence';
import { studioConfig } from './config';
import {
  Phase4AdminError,
  type AssetMutationResponse,
} from './phase4-admin-api';

const ASSET_UPLOAD_INTENT = 'asset-upload-v1';
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

type DigestAssetState = AdminAssetState & { sha256?: string | null };
export type DigestAssetMutationResponse = AssetMutationResponse & { sha256?: string | null };

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function validTrackId(trackId: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId);
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function normalizeAssetEtag(value: string | null | undefined): string | null {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return null;
  return trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')
    ? trimmed.slice(1, -1)
    : trimmed;
}

function assetWithDigest(value: AdminAssetState | null | undefined): DigestAssetState | null | undefined {
  return value as DigestAssetState | null | undefined;
}

async function requireAssetCapability(): Promise<void> {
  const health = await getAdminBridgeHealth();
  const manage = health.capabilities?.manage ?? [];
  if (!manage.includes('assets')) {
    throw new Phase4AdminError('Track Manager does not advertise assets. This operation stays locked until the required bridge capability is active.');
  }
}

export async function sha256File(file: File): Promise<string> {
  if (!globalThis.crypto?.subtle?.digest) {
    throw new Phase4AdminError(
      'Secure SHA-256 hashing is unavailable in this browser. No asset upload was sent.',
      null,
      'ASSET_DIGEST_UNAVAILABLE',
    );
  }
  const digest = await globalThis.crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  if (!SHA256_PATTERN.test(hex)) {
    throw new Phase4AdminError('Browser SHA-256 evidence is invalid. No asset upload was sent.', null, 'ASSET_DIGEST_INVALID');
  }
  return hex;
}

async function uploadWithDigest(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<DigestAssetMutationResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 120000);
  try {
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
    let payload: DigestAssetMutationResponse;
    try { payload = await response.json() as DigestAssetMutationResponse; }
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

export async function uploadAdminTrackAsset(
  trackId: string,
  kind: AdminAssetKind,
  expectedUpdatedAt: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<DigestAssetMutationResponse> {
  if (!validTrackId(trackId)) throw new Phase4AdminError('Invalid trackId.');
  if (!expectedUpdatedAt.trim()) throw new Phase4AdminError('Canonical updatedAt is required for asset upload.');
  if (!(file instanceof File) || file.size <= 0) throw new Phase4AdminError('Choose a non-empty file first.');

  const selectedSha256 = await sha256File(file);
  await requireAssetCapability();

  const before = await getAdminTrack(trackId);
  const beforeManifest = before.track?.manifest;
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
  formData.set('sha256', selectedSha256);
  formData.set('file', file);
  if (audioEvidence) {
    formData.set('audioDuration', String(audioEvidence.audio.duration));
    formData.set('audioReadable', 'true');
  }

  let payload: DigestAssetMutationResponse;
  try {
    payload = await uploadWithDigest(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/assets/${kind}/upload`, formData, onProgress);
  } catch (reason) {
    if (!(reason instanceof Phase4AdminError) || !['ASSET_UPLOAD_TIMEOUT', 'ASSET_UPLOAD_TRANSPORT'].includes(reason.code || '')) throw reason;
    try {
      const reread = await getAdminTrack(trackId);
      const manifest = reread.track?.manifest;
      const asset = assetWithDigest(reread.track?.assets?.[kind]);
      const changed = Boolean(manifest?.updatedAt && manifest.updatedAt !== expectedUpdatedAt);
      const exactDigestMatch = asset?.present === true && asset.sha256 === selectedSha256;

      if (changed && exactDigestMatch) {
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
          sha256: selectedSha256,
          previousUpdatedAt: expectedUpdatedAt,
          updatedAt: manifest?.updatedAt || null,
          duration: manifest?.duration ?? null,
          quality: reread.track?.quality || null,
          clientVerified: true,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          technicalDetails: `${reason.code}: response lost; private canonical reread proves the new revision carries the exact selected-file SHA-256. Studio did not retry the upload.`,
        };
      }

      if (!changed) {
        throw new Phase4AdminError(
          'The upload did not reach canonical storage. The canonical revision is unchanged; an explicit retry is safe after checking your Access session.',
          null,
          'ASSET_UPLOAD_NOT_COMMITTED',
          manifest?.updatedAt || expectedUpdatedAt,
          null,
          true,
          reason.technicalDetails,
        );
      }

      throw new Phase4AdminError(
        'Canonical state changed while the upload response was unavailable, but the exact selected-file SHA-256 is missing or different. Do not retry.',
        null,
        'ASSET_UPLOAD_AMBIGUOUS',
        manifest?.updatedAt || null,
        null,
        false,
        `selectedSha256=${selectedSha256}; canonicalSha256=${asset?.sha256 || 'missing'}; ${reason.technicalDetails || ''}`.trim(),
      );
    } catch (rereadReason) {
      if (rereadReason instanceof Phase4AdminError) throw rereadReason;
      throw new Phase4AdminError(
        'The upload response and private canonical reread are both unavailable. Do not retry until Track Manager access is restored and the track is reloaded.',
        null,
        'ASSET_UPLOAD_UNVERIFIED',
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
      );
    }
  }

  if (!payload.saved || !payload.updatedAt || !payload.filename || payload.sha256 !== selectedSha256) {
    throw new Phase4AdminError(
      'Track Manager returned asset upload success without the exact selected-file SHA-256 evidence. Do not retry.',
      null,
      'ASSET_UPLOAD_UNVERIFIED',
      payload.updatedAt || null,
      null,
      false,
      `selectedSha256=${selectedSha256}; responseSha256=${payload.sha256 || 'missing'}`,
    );
  }

  try {
    const reread = await getAdminTrack(trackId);
    const manifest = reread.track?.manifest;
    const asset = assetWithDigest(reread.track?.assets?.[kind]);
    const durationVerified = payload.duration == null || manifest?.duration === payload.duration;
    const sizeVerified = payload.size == null || asset?.size === payload.size;
    const contentTypeVerified = !payload.contentType || asset?.contentType === payload.contentType;
    const etagVerified = !payload.etag || normalizeAssetEtag(asset?.etag) === normalizeAssetEtag(payload.etag);
    const digestVerified = asset?.sha256 === selectedSha256 && payload.sha256 === selectedSha256;
    const clientVerified = manifest?.updatedAt === payload.updatedAt
      && manifest?.assets?.[kind] === payload.filename
      && asset?.present === true
      && sizeVerified
      && contentTypeVerified
      && etagVerified
      && digestVerified
      && durationVerified;

    if (!clientVerified) {
      const mismatches = [
        manifest?.updatedAt === payload.updatedAt ? null : 'canonical revision',
        manifest?.assets?.[kind] === payload.filename ? null : 'manifest asset filename',
        asset?.present === true ? null : 'private asset presence',
        sizeVerified ? null : 'asset size',
        contentTypeVerified ? null : 'asset content type',
        etagVerified ? null : 'asset ETag',
        digestVerified ? null : 'exact SHA-256',
        durationVerified ? null : 'canonical duration',
      ].filter(Boolean).join(', ');
      throw new Phase4AdminError(
        `Track Manager reported asset upload success, but the private canonical reread did not verify the exact selected bytes (${mismatches || 'unknown mismatch'}). Do not retry.`,
        null,
        'ASSET_UPLOAD_UNVERIFIED',
        manifest?.updatedAt || null,
        null,
        false,
        `selectedSha256=${selectedSha256}; responseSha256=${payload.sha256 || 'missing'}; canonicalSha256=${asset?.sha256 || 'missing'}; responseEtag=${payload.etag ?? 'n/a'}; canonicalEtag=${asset?.etag ?? 'n/a'}`,
      );
    }

    return { ...payload, sha256: selectedSha256, clientVerified: true, retrySafe: false };
  } catch (reason) {
    if (reason instanceof Phase4AdminError) throw reason;
    throw new Phase4AdminError(
      'Track Manager reported asset upload success, but Studio could not complete the private canonical asset reread. Do not retry until the track is reloaded and inspected.',
      null,
      'ASSET_UPLOAD_UNVERIFIED',
      null,
      null,
      false,
      reason instanceof Error ? reason.message : String(reason),
    );
  }
}

export const trackAssetSha256Policy = Object.freeze({
  intent: ASSET_UPLOAD_INTENT,
  transport: 'Track Manager v5.28 · bridge v1.18',
  digest: 'sha256-browser-selected-file-lowercase-hex',
  normalSuccessProof: 'selected-response-private-canonical-sha256-exact-match',
  lostResponseProof: 'new-revision-plus-private-canonical-sha256-exact-match',
  publicProjection: 'digest-private-only',
  maxAutomaticUploadRetries: 0,
});
