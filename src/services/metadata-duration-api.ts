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
const TRANSIENT_METADATA_VALIDATION_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const PLAIN_VALIDATION_TIMEOUT_MESSAGE = 'Track Manager metadata validation timed out.';
const PLAIN_VALIDATION_TRANSPORT_MESSAGE = 'Metadata validation is unavailable. Authenticate with Cloudflare Access and retry.';
const PLAIN_VALIDATION_INVALID_JSON_MESSAGE = 'Track Manager metadata validation returned invalid JSON.';
const PLAIN_VALIDATION_INVALID_SHAPE_MESSAGE = 'Track Manager returned an invalid metadata validation response.';

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

function isTransientMetadataValidationError(reason: unknown): reason is AdminValidationError {
  if (!(reason instanceof AdminValidationError)) return false;
  if (reason.message === PLAIN_VALIDATION_INVALID_JSON_MESSAGE || reason.message === PLAIN_VALIDATION_INVALID_SHAPE_MESSAGE) return false;
  if (reason.code === 'TRACK_METADATA_VALIDATION_INVALID_RESPONSE' || reason.code === 'TRACK_METADATA_VALIDATION_ACCESS_SESSION_REQUIRED') return false;
  if (reason.code === 'TRACK_METADATA_VALIDATION_TIMEOUT' || reason.code === 'TRACK_METADATA_VALIDATION_TRANSPORT') return true;
  if (reason.message === PLAIN_VALIDATION_TIMEOUT_MESSAGE || reason.message === PLAIN_VALIDATION_TRANSPORT_MESSAGE) return true;
  return reason.status !== null && TRANSIENT_METADATA_VALIDATION_STATUSES.has(reason.status);
}

async function runMetadataValidationWithOneTransientRetry<T>(attemptValidation: () => Promise<T>): Promise<T> {
  let firstTransientFailure: AdminValidationError | null = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await attemptValidation();
    } catch (reason) {
      if (attempt === 0 && isTransientMetadataValidationError(reason)) {
        firstTransientFailure = reason;
        continue;
      }
      if (firstTransientFailure && reason instanceof AdminValidationError) {
        throw new AdminValidationError(
          `Track metadata validation failed after one bounded transient retry. ${reason.message}`,
          reason.status,
          reason.code,
          reason.currentUpdatedAt,
        );
      }
      throw reason;
    }
  }
  throw new AdminValidationError('Track metadata validation retry loop ended unexpectedly.');
}

async function postValidationWithEvidenceOnce(trackId: string, expectedUpdatedAt: string, metadata: AdminMetadataPatch, evidence: AdminAudioEvidence): Promise<DurationAwareValidationResponse> {
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
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new AdminValidationError(
        timedOut
          ? 'Track Manager duration-aware metadata validation timed out.'
          : 'Duration-aware metadata validation transport was interrupted.',
        null,
        timedOut ? 'TRACK_METADATA_VALIDATION_TIMEOUT' : 'TRACK_METADATA_VALIDATION_TRANSPORT',
      );
    }
    if (!isJsonResponse(response)) {
      if (TRANSIENT_METADATA_VALIDATION_STATUSES.has(response.status)) {
        throw new AdminValidationError(
          `Track Manager duration-aware metadata validation returned transient HTTP ${response.status} without JSON.`,
          response.status,
          'TRACK_METADATA_VALIDATION_TRANSIENT_HTTP',
        );
      }
      throw new AdminValidationError(
        'Cloudflare Access session is unavailable to duration-aware metadata validation.',
        response.status || null,
        'TRACK_METADATA_VALIDATION_ACCESS_SESSION_REQUIRED',
      );
    }
    let payload: DurationAwareValidationResponse;
    try { payload = await response.json() as DurationAwareValidationResponse; }
    catch {
      throw new AdminValidationError(
        'Track Manager returned invalid duration-aware validation JSON.',
        response.status || null,
        'TRACK_METADATA_VALIDATION_INVALID_RESPONSE',
      );
    }
    if (!response.ok || payload.ok === false) {
      throw new AdminValidationError(
        payload.error || `Track Manager metadata validation returned HTTP ${response.status}.`,
        response.status,
        payload.code || null,
        payload.currentUpdatedAt || null,
      );
    }
    if (payload.validationOnly !== true || !payload.proposed) {
      throw new AdminValidationError(
        'Track Manager returned an invalid duration-aware metadata proposal.',
        response.status || null,
        'TRACK_METADATA_VALIDATION_INVALID_RESPONSE',
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function validateAdminTrackMetadataWithAudioEvidence(trackId: string, expectedUpdatedAt: string, metadata: AdminMetadataPatch, evidence: AdminAudioEvidence | null): Promise<DurationAwareValidationResponse> {
  if (!evidence) {
    return runMetadataValidationWithOneTransientRetry(() => validateAdminTrackMetadata(trackId, expectedUpdatedAt, metadata));
  }
  await requireDurationEvidenceBridge();
  return runMetadataValidationWithOneTransientRetry(() => postValidationWithEvidenceOnce(trackId, expectedUpdatedAt, metadata, evidence));
}

export async function saveAdminTrackMetadataWithAudioEvidence(trackId: string, expectedUpdatedAt: string, metadata: AdminMetadataPatch, evidence: AdminAudioEvidence | null): Promise<AdminMetadataSaveResponse> {
  // Build92 repeats the same non-mutating validation immediately before the write.
  // Build93 allows that non-mutating validation itself one bounded retry only for
  // transient timeout/transport/HTTP failures. The exact normalized proposal still
  // becomes the operation-specific postcondition for normal-success verification
  // and response-loss recovery. The visible Validate → review → explicit Save UX
  // remains unchanged, and no write is ever retried.
  const reviewed = await validateAdminTrackMetadataWithAudioEvidence(trackId, expectedUpdatedAt, metadata, evidence);
  if (reviewed.validationOnly !== true || reviewed.valid !== true || !reviewed.proposed) {
    throw new AdminSaveError('Track metadata proposal is no longer valid. Validate again before saving.', 409, 'TRACK_METADATA_PROPOSAL_STALE', expectedUpdatedAt);
  }
  return saveAdminTrackMetadataResilient(trackId, expectedUpdatedAt, metadata, evidence, reviewed.proposed);
}

export const trackMetadataValidationRetryPolicy = Object.freeze({
  intent: METADATA_VALIDATION_INTENT,
  nonMutating: true,
  retryPolicy: 'one-retry-timeout-transport-transient-http-no-access-or-invalid-response-retry',
  transientHttpStatuses: [408, 425, 429, 500, 502, 503, 504] as const,
  maxAttempts: 2,
  maxAutomaticWriteRetries: 0,
});
