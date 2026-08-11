import { getAdminBridgeHealth } from './admin-api';
import { AlbumAdminError } from './album-admin-api';
import { studioConfig } from './config';

const MIGRATION_INTENT = 'album-migration-apply-v1' as const;

export interface AlbumMigrationTrackState {
  id: string;
  title?: string | null;
  status?: string | null;
  albumId?: string | null;
  albumTitle?: string | null;
  sequence?: number | null;
  updatedAt?: string | null;
}
export interface AlbumMigrationIssue { code: string; message: string; trackIds?: string[]; }
export interface AlbumMigrationCandidate {
  id: string;
  title: string;
  type: 'album' | 'ep' | 'collection';
  year: number | null;
  releaseDate: string | null;
  heading: string | null;
  description: string | null;
  cover?: { repositoryPath?: string | null; sourceUrl?: string | null } | null;
  canonicalExists: boolean;
  canonicalUpdatedAt: string | null;
  candidateCount: number;
  proposedTrackIds: string[];
  tracks: AlbumMigrationTrackState[];
  deterministicOrder: boolean;
  requiresOrderConfirmation: boolean;
  blockers: AlbumMigrationIssue[];
  warnings: AlbumMigrationIssue[];
  readyToApply: boolean;
  stateToken: string;
}
export interface AlbumMigrationDryRun {
  schemaVersion: 1;
  migrationId: string;
  sourceRef: string;
  mode: 'dry-run';
  generatedAt: string;
  writesPerformed: false;
  albums: AlbumMigrationCandidate[];
  singles: {
    id: 'singles'; title: 'Singles'; candidateCount: number; tracks: AlbumMigrationTrackState[];
    migrateAsCanonicalAlbum: false; futureModel: string; reason: string;
  };
}
export interface AlbumMigrationApplyResponse {
  ok?: boolean;
  migrated?: boolean;
  migrationId?: string;
  albumId?: string;
  album?: { id?: string; title?: string; status?: string; trackIds?: string[]; updatedAt?: string | null };
  cover?: { path?: string; size?: number; contentType?: string };
  trackCachesRewritten?: number;
  catalogRebuilt?: boolean;
  catalogGeneratedAt?: string | null;
  singlesUntouched?: boolean;
  code?: string;
  error?: string;
  details?: string;
  currentStateToken?: string;
  rollback?: Record<string, unknown> | null;
}

function baseUrl() { return studioConfig.trackManagerUrl.replace(/\/$/, ''); }
function isJson(response: Response) { return (response.headers.get('content-type') || '').toLowerCase().includes('application/json'); }
function failureMessage(payload: AlbumMigrationApplyResponse, status: number) {
  const primary = payload.error || `Track Manager Album migration returned HTTP ${status}.`;
  const details = typeof payload.details === 'string' ? payload.details.trim() : '';
  return details ? `${primary} Details: ${details}` : primary;
}
async function requireMigrationCapability() {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.manage || []).includes('album-migration')) {
    throw new AlbumAdminError('Track Manager does not advertise album-migration. Production migration stays locked.', null, 'ALBUM_MIGRATION_CAPABILITY_MISSING');
  }
}

export async function getAdminAlbumMigrationDryRun(): Promise<AlbumMigrationDryRun> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}/api/studio/albums`, { headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'include', mode: 'cors' });
  } catch {
    throw new AlbumAdminError('Album migration dry-run is unavailable. Authenticate with Cloudflare Access and retry.', null, 'ALBUM_MIGRATION_READ_TRANSPORT');
  }
  if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Album migration dry-run.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
  let payload: { ok?: boolean; migration?: AlbumMigrationDryRun; error?: string };
  try { payload = await response.json() as typeof payload; }
  catch { throw new AlbumAdminError('Track Manager migration dry-run returned invalid JSON.', response.status || null, 'ALBUM_MIGRATION_INVALID_RESPONSE'); }
  if (!response.ok) throw new AlbumAdminError(payload.error || `Track Manager migration dry-run returned HTTP ${response.status}.`, response.status, 'ALBUM_MIGRATION_READ_FAILED');
  if (!payload.migration || payload.migration.mode !== 'dry-run' || payload.migration.writesPerformed !== false || !Array.isArray(payload.migration.albums)) {
    throw new AlbumAdminError('Track Manager did not return a valid read-only Album migration plan.', response.status, 'ALBUM_MIGRATION_INVALID_DRY_RUN');
  }
  return payload.migration;
}

export async function applyAdminAlbumMigration(input: {
  albumId: string;
  expectedStateToken: string;
  trackIds: string[];
  orderConfirmed: boolean;
  confirm: string;
}): Promise<AlbumMigrationApplyResponse> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(input.albumId) || input.albumId === 'singles') throw new AlbumAdminError('Invalid migration Album id.');
  if (!input.expectedStateToken) throw new AlbumAdminError('A fresh migration state token is required. Reload the dry-run.');
  if (input.confirm !== `MIGRATE ${input.albumId}`) throw new AlbumAdminError('Typed migration confirmation does not match the selected Album.');
  await requireMigrationCapability();
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}/api/studio/albums`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ intent: MIGRATION_INTENT, ...input }),
      cache: 'no-store', credentials: 'include', mode: 'cors',
    });
  } catch {
    throw new AlbumAdminError('Album migration write failed before Track Manager returned a response. Reload the dry-run before any retry.', null, 'ALBUM_MIGRATION_TRANSPORT');
  }
  if (!isJson(response)) throw new AlbumAdminError('Cloudflare Access session is not available to Album migration.', response.status || null, 'ALBUM_ACCESS_SESSION_REQUIRED');
  let payload: AlbumMigrationApplyResponse;
  try { payload = await response.json() as AlbumMigrationApplyResponse; }
  catch { throw new AlbumAdminError('Track Manager Album migration returned invalid JSON. Reload canonical state before retrying.', response.status || null, 'ALBUM_MIGRATION_INVALID_RESPONSE'); }
  if (!response.ok) throw new AlbumAdminError(failureMessage(payload, response.status), response.status, payload.code || null, null, payload.rollback || null);
  if (!payload.migrated || payload.albumId !== input.albumId || payload.singlesUntouched !== true) throw new AlbumAdminError('Track Manager returned an invalid Album migration success response. Reload canonical state.', response.status, 'ALBUM_MIGRATION_UNVERIFIED');
  return payload;
}

export const albumMigrationService = Object.freeze({ intent: MIGRATION_INTENT, transport: 'Track Manager v5.18 / bridge v1.10 only' });
