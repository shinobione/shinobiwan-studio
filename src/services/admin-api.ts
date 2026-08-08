import { studioConfig } from './config';

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

export interface AdminBridgeHealth {
  ok?: boolean;
  service?: string;
  version?: string;
  trackManagerVersion?: string;
  authenticatedEmail?: string | null;
  allowedOrigin?: string;
  capabilities?: {
    read?: string[];
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

export function adminMediaUrl(trackId: string, kind: AdminAssetKind): string {
  return `${baseUrl()}/api/media/${encodeURIComponent(trackId)}/${kind}`;
}

export async function getAdminBridgeHealth(): Promise<AdminBridgeHealth> {
  const payload = await fetchAdminJson<AdminBridgeHealth>('/api/studio/health');
  if (payload.ok === false || payload.capabilities?.write?.length) {
    throw new AdminReadError('invalid-response', 'Track Manager Studio bridge did not advertise the expected GET-only contract.');
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

// Phase 4A is intentionally read-only. Existing Track Manager write routes stay
// same-origin protected and Studio exposes no POST/PUT/PATCH/DELETE wrapper.
export const adminService = Object.freeze({
  fallbackUrl: studioConfig.trackManagerUrl,
  bridgeHealthUrl: `${baseUrl()}/api/studio/health`,
  writesEnabled: false,
});
