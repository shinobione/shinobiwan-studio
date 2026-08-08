import { getAdminBridgeHealth, getAdminTrack } from './admin-api';
import { studioConfig } from './config';

const LYRICS_VALIDATION_INTENT = 'lyrics-validate-v1';
const LYRICS_SAVE_INTENT = 'lyrics-save-v1';

export interface AdminLyricsQuality {
  state?: string | null;
  publishable?: boolean | null;
  counts?: { error?: number; warning?: number; info?: number; pass?: number } | null;
  bytes?: number;
  timestampsAvailable?: boolean;
  timestampCount?: number;
  segmentCount?: number;
  lastTimestamp?: number | null;
  items?: Array<{ level?: string; code?: string; label?: string; message?: string }>;
}

export interface AdminLyricsSnapshot {
  ok?: boolean;
  trackId?: string;
  filename?: string;
  lyrics?: string;
  lyricsEtag?: string;
  updatedAt?: string | null;
  bytes?: number;
  timestampsAvailable?: boolean;
  timestampCount?: number;
  segmentCount?: number;
  quality?: AdminLyricsQuality | null;
  authenticatedEmail?: string | null;
  code?: string;
  error?: string;
}

export interface AdminLyricsValidationResponse {
  ok?: boolean;
  validationOnly?: boolean;
  valid?: boolean;
  trackId?: string;
  expectedUpdatedAt?: string | null;
  expectedLyricsEtag?: string;
  changed?: boolean;
  proposed?: {
    filename?: string;
    lyrics?: string;
    bytes?: number;
    timestampsAvailable?: boolean;
    timestampCount?: number;
    segmentCount?: number;
  };
  quality?: AdminLyricsQuality | null;
  code?: string;
  currentUpdatedAt?: string | null;
  currentLyricsEtag?: string | null;
  error?: string;
}

export interface AdminLyricsSaveResponse {
  ok?: boolean;
  saved?: boolean;
  noChange?: boolean;
  trackId?: string;
  filename?: string;
  previousUpdatedAt?: string | null;
  updatedAt?: string | null;
  previousLyricsEtag?: string | null;
  lyricsEtag?: string | null;
  bytes?: number;
  timestampsAvailable?: boolean;
  timestampCount?: number;
  segmentCount?: number;
  quality?: AdminLyricsQuality | null;
  catalogRebuilt?: boolean;
  catalogGeneratedAt?: string | null;
  catalogCount?: number | null;
  code?: string;
  currentUpdatedAt?: string | null;
  currentLyricsEtag?: string | null;
  error?: string;
  rollback?: {
    lyricsRestored?: boolean;
    manifestRestored?: boolean;
    catalogRestored?: boolean;
  } | null;
  clientVerified?: boolean;
  verificationWarning?: string | null;
}

export class AdminLyricsError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly currentUpdatedAt: string | null;
  readonly currentLyricsEtag: string | null;

  constructor(
    message: string,
    status: number | null = null,
    code: string | null = null,
    currentUpdatedAt: string | null = null,
    currentLyricsEtag: string | null = null,
  ) {
    super(message);
    this.name = 'AdminLyricsError';
    this.status = status;
    this.code = code;
    this.currentUpdatedAt = currentUpdatedAt;
    this.currentLyricsEtag = currentLyricsEtag;
  }
}

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function validTrackId(trackId: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId);
}

function isJson(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

async function parseJson<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!isJson(response)) {
    throw new AdminLyricsError('Cloudflare Access session is not available to the Studio lyrics client.', response.status || null);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new AdminLyricsError(fallbackMessage, response.status || null);
  }
}

async function getLyricsJson(trackId: string): Promise<AdminLyricsSnapshot> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 7000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/lyrics`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw new AdminLyricsError('Canonical lyrics read timed out.');
      throw new AdminLyricsError('Canonical lyrics read is unavailable. Authenticate with Cloudflare Access and retry.');
    }
    const payload = await parseJson<AdminLyricsSnapshot>(response, 'Track Manager returned invalid lyrics JSON.');
    if (!response.ok || payload.ok === false) {
      throw new AdminLyricsError(payload.error || `Lyrics read returned HTTP ${response.status}.`, response.status, payload.code || null);
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function postLyrics<T extends AdminLyricsValidationResponse | AdminLyricsSaveResponse>(
  trackId: string,
  suffix: 'validate' | 'save',
  body: unknown,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/lyrics/${suffix}`, {
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
      if (error instanceof DOMException && error.name === 'AbortError') throw new AdminLyricsError(`Lyrics ${suffix} timed out. Reload canonical lyrics before retrying.`);
      throw new AdminLyricsError(`Lyrics ${suffix} is unavailable. Authenticate with Cloudflare Access and reload before retrying.`);
    }
    const payload = await parseJson<T>(response, `Track Manager returned invalid lyrics ${suffix} JSON.`);
    if (!response.ok || payload.ok === false) {
      throw new AdminLyricsError(
        payload.error || `Lyrics ${suffix} returned HTTP ${response.status}.`,
        response.status,
        payload.code || null,
        payload.currentUpdatedAt || null,
        payload.currentLyricsEtag || null,
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function getAdminTrackLyrics(trackId: string): Promise<AdminLyricsSnapshot> {
  if (!validTrackId(trackId)) throw new AdminLyricsError('Invalid trackId.');
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.read ?? []).includes('lyrics')) {
    throw new AdminLyricsError('Track Manager does not advertise canonical lyrics read support.');
  }
  const payload = await getLyricsJson(trackId);
  if (!payload.lyricsEtag || typeof payload.lyrics !== 'string' || !payload.updatedAt) {
    throw new AdminLyricsError('Track Manager returned an incomplete canonical lyrics snapshot.');
  }
  return payload;
}

export async function validateAdminTrackLyrics(
  trackId: string,
  expectedUpdatedAt: string,
  expectedLyricsEtag: string,
  lyrics: string,
): Promise<AdminLyricsValidationResponse> {
  if (!validTrackId(trackId)) throw new AdminLyricsError('Invalid trackId.');
  if (!expectedUpdatedAt.trim() || !expectedLyricsEtag.trim()) throw new AdminLyricsError('Both canonical manifest revision and lyrics ETag are required.');
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.validate ?? []).includes('lyrics')) throw new AdminLyricsError('Track Manager does not advertise lyrics validation.');
  const payload = await postLyrics<AdminLyricsValidationResponse>(trackId, 'validate', {
    intent: LYRICS_VALIDATION_INTENT,
    expectedUpdatedAt,
    expectedLyricsEtag,
    lyrics,
  }, 9000);
  if (payload.validationOnly !== true || !payload.proposed || !payload.expectedLyricsEtag) {
    throw new AdminLyricsError('Track Manager returned an invalid lyrics validation response.');
  }
  return payload;
}

export async function saveAdminTrackLyrics(
  trackId: string,
  expectedUpdatedAt: string,
  expectedLyricsEtag: string,
  lyrics: string,
): Promise<AdminLyricsSaveResponse> {
  if (!validTrackId(trackId)) throw new AdminLyricsError('Invalid trackId.');
  if (!expectedUpdatedAt.trim() || !expectedLyricsEtag.trim()) throw new AdminLyricsError('Both canonical manifest revision and lyrics ETag are required for save.');
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.write ?? []).includes('lyrics')) throw new AdminLyricsError('Track Manager does not advertise the guarded lyrics write capability. Save stays locked.');

  const payload = await postLyrics<AdminLyricsSaveResponse>(trackId, 'save', {
    intent: LYRICS_SAVE_INTENT,
    expectedUpdatedAt,
    expectedLyricsEtag,
    lyrics,
  }, 15000);
  if (payload.saved !== true && payload.noChange !== true) throw new AdminLyricsError('Track Manager returned an invalid lyrics save response.');

  const expectedRevision = payload.updatedAt || expectedUpdatedAt;
  const expectedEtag = payload.lyricsEtag || expectedLyricsEtag;
  let clientVerified = false;
  let verificationWarning: string | null = null;
  try {
    const [lyricsReread, trackReread] = await Promise.all([getLyricsJson(trackId), getAdminTrack(trackId)]);
    const rereadRevision = trackReread.track?.manifest?.updatedAt || lyricsReread.updatedAt || null;
    if (lyricsReread.lyricsEtag === expectedEtag && rereadRevision === expectedRevision && lyricsReread.lyrics === lyrics.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')) {
      clientVerified = true;
    } else {
      verificationWarning = 'Canonical reread did not match the saved lyrics revision/ETag/text. Reload before any further edit.';
    }
  } catch (reason) {
    verificationWarning = `Server reported lyrics save success, but Studio could not complete its canonical reread (${reason instanceof Error ? reason.message : String(reason)}). Reload before any further edit.`;
  }
  return { ...payload, clientVerified, verificationWarning };
}

export const lyricsAdminService = Object.freeze({
  canonicalFilename: 'lyrics.txt',
  validationIntent: LYRICS_VALIDATION_INTENT,
  saveIntent: LYRICS_SAVE_INTENT,
  transport: 'text/plain-simple-request',
  separateLrcRequired: false,
});
