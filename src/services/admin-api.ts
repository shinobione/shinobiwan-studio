import { studioConfig } from './config';

const METADATA_VALIDATION_INTENT = 'metadata-validate-v1';

export type AdminReadFailureKind = 'access-or-cors' | 'http' | 'timeout' | 'invalid-response';
export type AdminAssetKind = 'audio' | 'cover' | 'thumbnail' | 'video' | 'lyrics';

export class AdminReadError extends Error {
  readonly kind: AdminReadFailureKind;
  readonly status: number | null;

  constructor(kind: AdminReadFailureKind, message: string, status: number | null = null) {
    super(message);
    this.name = 'AdminReadError';
    this.kind = kind;
    this.status = status;
  }
}

export class AdminValidationError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly currentUpdatedAt: string | null;

  constructor(message: string, status: number | null = null, code: string | null = null, currentUpdatedAt: string | null = null) {
    super(message);
    this.name = 'AdminValidationError';
    this.status = status;
    this.code = code;
    this.currentUpdatedAt = currentUpdatedAt;
  }
}

export interface AdminBridgeHealth {
  ok?: boolean;
  service?: string;
  version?: string;
  trackManagerVersion?: string;
  authenticatedEmail?: string | null;
  allowedOrigin?: string;
  capabilities?: {
    read?: string[];
    validate?: string[];
    write?: string[];
  };
}

export interface AdminAssetState {
  present?: boolean;
  filename?: string | null;
  key?: string | null;
  size?: number | null;
  contentType?: string | null;
}

export interface AdminQuality {
  state?: string | null;
  publishable?: boolean | null;
  counts?: {
    error?: number;
    warning?: number;
    info?: number;
  } | null;
  timestampsAvailable?: boolean;
  lyricsStatus?: 'missing' | 'invalid' | 'unsynced' | 'synced' | null;
}

export interface AdminManifest {
  slug?: string;
  title?: string;
  status?: string;
  type?: string;
  year?: number | null;
  releaseDate?: string | null;
  album?: { id?: string; title?: string } | null;
  genres?: string[];
  tags?: string[];
  moods?: string[];
  themes?: string[];
  era?: string | null;
  energy?: string | null;
  languages?: string[];
  bpm?: number | null;
  key?: string | null;
  keyConfidence?: number | null;
  explicit?: boolean | null;
  duration?: number | null;
  accent?: string | null;
  accent2?: string | null;
  assets?: Partial<Record<AdminAssetKind, string | null>>;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type AdminMetadataPatch = Pick<AdminManifest,
  | 'title'
  | 'status'
  | 'type'
  | 'year'
  | 'releaseDate'
  | 'album'
  | 'genres'
  | 'tags'
  | 'moods'
  | 'themes'
  | 'era'
  | 'energy'
  | 'languages'
  | 'bpm'
  | 'key'
  | 'keyConfidence'
  | 'explicit'
  | 'accent'
  | 'accent2'
>;

export interface AdminMetadataValidationResponse {
  ok?: boolean;
  validationOnly?: boolean;
  valid?: boolean;
  trackId?: string;
  expectedUpdatedAt?: string;
  changedFields?: string[];
  proposed?: AdminManifest;
  quality?: AdminQuality | null;
  authenticatedEmail?: string | null;
  code?: string;
  currentUpdatedAt?: string | null;
  error?: string;
}

export interface AdminTrackSummary {
  slug?: string;
  title?: string;
  status?: string;
  type?: string;
  year?: number | null;
  releaseDate?: string | null;
  album?: { id?: string; title?: string } | null;
  genres?: string[];
  moods?: string[];
  themes?: string[];
  languages?: string[];
  explicit?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  complete?: boolean;
  totalBytes?: number;
  assets?: Partial<Record<AdminAssetKind, AdminAssetState | null>>;
  quality?: AdminQuality | null;
}

export interface AdminTracksResponse {
  ok?: boolean;
  tracks?: AdminTrackSummary[];
  totals?: {
    total?: number;
    published?: number;
    draft?: number;
    archived?: number;
    incomplete?: number;
    bytes?: number;
  };
}

export interface AdminTrackResponse {
  ok?: boolean;
  track?: {
    manifest?: AdminManifest;
    assets?: Partial<Record<AdminAssetKind, AdminAssetState | null>>;
    quality?: AdminQuality | null;
  };
}

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function isWorkerJsonResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type') || '';
  return contentType.toLowerCase().includes('application/json');
}

async function fetchAdminJson<T>(path: string, timeoutMs = 4500): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}${path}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AdminReadError('timeout', 'Track Manager private read timed out.');
      }
      throw new AdminReadError(
        'access-or-cors',
        'Private Track Manager read is unavailable. Authenticate with Cloudflare Access or use the public fallback.',
      );
    }

    if (!isWorkerJsonResponse(response)) {
      throw new AdminReadError(
        'access-or-cors',
        'Cloudflare Access session is not available to Studio. Public catalog fallback remains active.',
        response.status || null,
      );
    }

    if (!response.ok) {
      const kind: AdminReadFailureKind = response.status === 401 || response.status === 403
        ? 'access-or-cors'
        : 'http';
      throw new AdminReadError(kind, `Track Manager private read returned HTTP ${response.status}.`, response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new AdminReadError('invalid-response', 'Track Manager private read returned invalid JSON.', response.status);
    }
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function postAdminValidation<T>(path: string, body: unknown, timeoutMs = 7000): Promise<T> {
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
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AdminValidationError('Track Manager metadata validation timed out.');
      }
      throw new AdminValidationError('Metadata validation is unavailable. Authenticate with Cloudflare Access and retry.');
    }

    if (!isWorkerJsonResponse(response)) {
      throw new AdminValidationError('Cloudflare Access session is not available to Studio metadata validation.', response.status || null);
    }

    let payload: AdminMetadataValidationResponse;
    try {
      payload = (await response.json()) as AdminMetadataValidationResponse;
    } catch {
      throw new AdminValidationError('Track Manager metadata validation returned invalid JSON.', response.status || null);
    }

    if (!response.ok) {
      throw new AdminValidationError(
        payload.error || `Track Manager metadata validation returned HTTP ${response.status}.`,
        response.status,
        payload.code || null,
        payload.currentUpdatedAt || null,
      );
    }

    return payload as T;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export function adminMediaUrl(trackId: string, kind: AdminAssetKind): string {
  return `${baseUrl()}/api/media/${encodeURIComponent(trackId)}/${kind}`;
}

export async function getAdminBridgeHealth(): Promise<AdminBridgeHealth> {
  const payload = await fetchAdminJson<AdminBridgeHealth>('/api/studio/health');
  if (payload.ok === false || payload.capabilities?.write?.length) {
    throw new AdminReadError('invalid-response', 'Track Manager Studio bridge exposed an unexpected production write capability.');
  }
  return payload;
}

export async function getAdminTracks(): Promise<AdminTracksResponse> {
  const payload = await fetchAdminJson<AdminTracksResponse>('/api/studio/tracks', 7000);
  if (payload.ok === false || !Array.isArray(payload.tracks)) {
    throw new AdminReadError('invalid-response', 'Track Manager returned an invalid Studio catalog response.');
  }
  return payload;
}

export async function getAdminTrack(trackId: string): Promise<AdminTrackResponse> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId)) throw new Error('Invalid trackId.');
  const payload = await fetchAdminJson<AdminTrackResponse>(`/api/studio/tracks/${encodeURIComponent(trackId)}`, 7000);
  if (payload.ok === false || !payload.track?.manifest) {
    throw new AdminReadError('invalid-response', 'Track Manager returned an invalid Studio track response.');
  }
  return payload;
}

export async function validateAdminTrackMetadata(
  trackId: string,
  expectedUpdatedAt: string,
  metadata: AdminMetadataPatch,
): Promise<AdminMetadataValidationResponse> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId)) throw new Error('Invalid trackId.');
  if (!expectedUpdatedAt.trim()) throw new AdminValidationError('Canonical updatedAt revision is required for validation.');

  const payload = await postAdminValidation<AdminMetadataValidationResponse>(
    `/api/studio/tracks/${encodeURIComponent(trackId)}/metadata/validate`,
    { intent: METADATA_VALIDATION_INTENT, expectedUpdatedAt, metadata },
  );
  if (payload.ok === false || payload.validationOnly !== true || !payload.proposed) {
    throw new AdminValidationError('Track Manager returned an invalid metadata validation response.');
  }
  return payload;
}

// Phase 4B.1A keeps one validation-only POST. Build 7 uses a CORS-safelisted
// text/plain transport so Cloudflare Access does not have to admit an OPTIONS preflight.
// Production writes remain locked: no save, upload, delete, publish or catalog-rebuild wrapper exists in Studio.
export const adminService = Object.freeze({
  fallbackUrl: studioConfig.trackManagerUrl,
  bridgeHealthUrl: `${baseUrl()}/api/studio/health`,
  metadataValidationIntent: METADATA_VALIDATION_INTENT,
  metadataValidationTransport: 'text/plain-simple-request',
  validationEnabled: true,
  writesEnabled: false,
});
