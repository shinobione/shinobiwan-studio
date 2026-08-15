import {
  AdminSaveError,
  AdminValidationError,
  getAdminBridgeHealth,
  validateAdminTrackMetadata,
  type AdminMetadataPatch,
  type AdminMetadataSaveResponse,
  type AdminMetadataValidationResponse,
} from './admin-api';
import type { AdminAudioEvidence } from './audio-duration-evidence';
import { studioConfig } from './config';
import { saveAdminTrackMetadataResilient } from './track-metadata-admin-api';

const METADATA_VALIDATION_INTENT = 'metadata-validate-v1';
const DURATION_EVIDENCE_BRIDGES = new Set([
  '5.22/1.12',
  '5.23/1.13',
]);

export type DurationAwareValidationResponse = AdminMetadataValidationResponse & { derivedFields?: string[] };

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function durationEvidenceBridgeCompatible(trackManagerVersion?: string | null, bridgeVersion?: string | null): boolean {
  return DURATION_EVIDENCE_BRIDGES.has(`${trackManagerVersion || ''}/${bridgeVersion || ''}`);
}

function durationEvidenceBridgeError(trackManagerVersion?: string | null, bridgeVersion?: string | null): string {
  return `Canonical audio-duration repair requires a verified duration-evidence bridge (Track Manager v5.22 / Studio bridge v1.12 or v5.23 / v1.13); active bridge is ${trackManagerVersion || 'unknown'} / ${bridgeVersion || 'unknown'}.`;
}

async function requireDurationEvidenceBridge(): Promise<void> {
  const health = await getAdminBridgeHealth();
  if (!durationEvidenceBridgeCompatible(health.trackManagerVersion, health.version)) {
    throw new AdminValidationError(durationEvidenceBridgeError(health.trackManagerVersion, health.version), 409, 'DURATION_EVIDENCE_BRIDGE_REQUIRED');
  }
}

async function postValidationWithEvidence(trackId: string, expectedUpdatedAt: string, metadata: AdminMetadataPatch, evidence: AdminAudioEvidence): Promise<DurationAwareValidationResponse> {
  await requireDurationEvidenceBridge();
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 7000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/metadata/validate`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: METADATA_VALIDATION_INTENT, expectedUpdatedAt, metadata, evidence }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === 'AbortError') throw new AdminValidationError('Track Manager duration-aware metadata validation timed out.');
      throw new AdminValidationError('Duration-aware metadata validation is unavailable. Authenticate with Track Manager and retry.');
    }
    if (!isJsonResponse(response)) throw new AdminValidationError('Cloudflare Access session is unavailable to duration-aware metadata validation.', response.status || null);
    let payload: DurationAwareValidationResponse;
    try { payload = await response.json() as DurationAwareValidationResponse; }
    catch { throw new AdminValidationError('Track Manager returned invalid duration-aware validation JSON.', response.status || null); }
    if (!response.ok || payload.ok === false) throw new AdminValidationError(payload.error || `Track Manager metadata validation returned HTTP ${response.status}.`, response.status, payload.code || null, payload.currentUpdatedAt || null);
    if (payload.validationOnly !== true || !payload.proposed) throw new AdminValidationError('Track Manager returned an invalid duration-aware metadata proposal.');
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function validateAdminTrackMetadataWithAudioEvidence(trackId: string, expectedUpdatedAt: string, metadata: AdminMetadataPatch, evidence: AdminAudioEvidence | null): Promise<DurationAwareValidationResponse> {
  if (!evidence) return validateAdminTrackMetadata(trackId, expectedUpdatedAt, metadata);
  return postValidationWithEvidence(trackId, expectedUpdatedAt, metadata, evidence);
}

export async function saveAdminTrackMetadataWithAudioEvidence(trackId: string, expectedUpdatedAt: string, metadata: AdminMetadataPatch, evidence: AdminAudioEvidence | null): Promise<AdminMetadataSaveResponse> {
  // Build92 repeats the same non-mutating validation immediately before the write.
  // The exact normalized proposal becomes the operation-specific postcondition for
  // normal-success verification and response-loss recovery. The visible
  // Validate → review → explicit Save UX remains unchanged, and no write is retried.
  const reviewed = await validateAdminTrackMetadataWithAudioEvidence(trackId, expectedUpdatedAt, metadata, evidence);
  if (reviewed.validationOnly !== true || reviewed.valid !== true || !reviewed.proposed) {
    throw new AdminSaveError('Track metadata proposal is no longer valid. Validate again before saving.', 409, 'TRACK_METADATA_PROPOSAL_STALE', expectedUpdatedAt);
  }
  return saveAdminTrackMetadataResilient(trackId, expectedUpdatedAt, metadata, evidence, reviewed.proposed);
}
