import {
  AdminSaveError,
  getAdminBridgeHealth,
  getAdminTrack,
  type AdminManifest,
  type AdminMetadataPatch,
  type AdminMetadataRollback,
  type AdminMetadataSaveResponse,
} from './admin-api';
import type { AdminAudioEvidence } from './audio-duration-evidence';
import { studioConfig } from './config';

const METADATA_SAVE_INTENT = 'metadata-save-v1';
const DURATION_EVIDENCE_BRIDGES = new Set(['5.22/1.12', '5.23/1.13', '5.24/1.14']);

export type TrackMetadataCommitState = 'committed' | 'not-committed' | 'ambiguous' | 'unverified';

export type TrackMetadataSaveResponse = AdminMetadataSaveResponse & {
  commitState?: TrackMetadataCommitState;
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  technicalDetails?: string | null;
};

export class TrackMetadataSaveError extends AdminSaveError {
  readonly retrySafe: boolean;
  readonly technicalDetails: string | null;
  readonly commitState: TrackMetadataCommitState | null;

  constructor(
    message: string,
    status: number | null = null,
    code: string | null = null,
    currentUpdatedAt: string | null = null,
    rollback: AdminMetadataRollback | null = null,
    retrySafe = false,
    technicalDetails: string | null = null,
    commitState: TrackMetadataCommitState | null = null,
  ) {
    super(message, status, code, currentUpdatedAt, rollback);
    this.name = 'TrackMetadataSaveError';
    this.retrySafe = retrySafe;
    this.technicalDetails = technicalDetails;
    this.commitState = commitState;
  }
}

function baseUrl(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function stableJson(value: unknown): string {
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

function comparableManifest(manifest: AdminManifest | undefined): Record<string, unknown> | null {
  if (!manifest) return null;
  const comparable = { ...(manifest as unknown as Record<string, unknown>) };
  delete comparable.updatedAt;
  delete comparable.updatedBy;
  return comparable;
}

function manifestMatchesReviewedProposal(manifest: AdminManifest | undefined, reviewedProposal: AdminManifest): boolean {
  return stableJson(comparableManifest(manifest)) === stableJson(comparableManifest(reviewedProposal));
}

async function requireMetadataWrite(evidence: AdminAudioEvidence | null): Promise<void> {
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.write ?? []).includes('metadata')) {
    throw new TrackMetadataSaveError('Track Manager does not advertise guarded metadata write capability. Save stays locked.');
  }
  if (evidence && !DURATION_EVIDENCE_BRIDGES.has(`${health.trackManagerVersion || ''}/${health.version || ''}`)) {
    throw new TrackMetadataSaveError(
      `Canonical audio-duration repair requires Track Manager v5.22 / bridge v1.12, v5.23 / v1.13, or v5.24 / v1.14; active bridge is ${health.trackManagerVersion || 'unknown'} / ${health.version || 'unknown'}.`,
      409,
      'DURATION_EVIDENCE_BRIDGE_REQUIRED',
    );
  }
}

async function postTrackMetadataSave(
  trackId: string,
  expectedUpdatedAt: string,
  metadata: AdminMetadataPatch,
  evidence: AdminAudioEvidence | null,
): Promise<AdminMetadataSaveResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 12000);
  try {
    let response: Response;
    try {
      response = await fetch(`${baseUrl()}/api/studio/tracks/${encodeURIComponent(trackId)}/metadata/save`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          intent: METADATA_SAVE_INTENT,
          expectedUpdatedAt,
          metadata,
          ...(evidence ? { evidence } : {}),
        }),
        cache: 'no-store',
        credentials: 'include',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new TrackMetadataSaveError(
        timedOut
          ? 'Track metadata save timed out. Studio will reread canonical Track state before any retry.'
          : 'Track metadata save transport was interrupted. Studio will reread canonical Track state before any retry.',
        null,
        timedOut ? 'TRACK_METADATA_SAVE_TIMEOUT' : 'TRACK_METADATA_SAVE_TRANSPORT',
        null,
        null,
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }

    if (!isJsonResponse(response)) {
      throw new TrackMetadataSaveError(
        'Cloudflare Access session is not available to Track metadata save.',
        response.status || null,
        'TRACK_METADATA_ACCESS_SESSION_REQUIRED',
      );
    }

    let payload: AdminMetadataSaveResponse;
    try {
      payload = await response.json() as AdminMetadataSaveResponse;
    } catch {
      throw new TrackMetadataSaveError(
        'Track Manager returned invalid Track metadata save JSON. Reload canonical Track state before retrying.',
        response.status || null,
        'TRACK_METADATA_SAVE_INVALID_RESPONSE',
      );
    }

    if (!response.ok || payload.ok === false) {
      throw new TrackMetadataSaveError(
        payload.error || `Track Manager metadata save returned HTTP ${response.status}.`,
        response.status,
        payload.code || 'TRACK_METADATA_SAVE_REJECTED',
        payload.currentUpdatedAt || null,
        payload.rollback || null,
      );
    }

    if (!payload.track || (payload.saved !== true && payload.noChange !== true)) {
      throw new TrackMetadataSaveError(
        'Track Manager returned an invalid Track metadata save response. Reload canonical Track state before retrying.',
        response.status || null,
        'TRACK_METADATA_SAVE_INVALID_RESPONSE',
      );
    }

    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function saveAdminTrackMetadataResilient(
  trackId: string,
  expectedUpdatedAt: string,
  metadata: AdminMetadataPatch,
  evidence: AdminAudioEvidence | null,
  reviewedProposal: AdminManifest,
): Promise<TrackMetadataSaveResponse> {
  if (!/^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId)) throw new TrackMetadataSaveError('Invalid canonical Track ID.');
  if (!expectedUpdatedAt.trim()) throw new TrackMetadataSaveError('Canonical Track revision is required.');
  if (reviewedProposal.slug !== trackId || reviewedProposal.updatedAt !== expectedUpdatedAt) {
    throw new TrackMetadataSaveError(
      'The reviewed metadata proposal no longer matches this canonical Track revision. Validate again before saving.',
      409,
      'TRACK_METADATA_PROPOSAL_STALE',
      expectedUpdatedAt,
    );
  }

  await requireMetadataWrite(evidence);

  const beforeRead = await getAdminTrack(trackId);
  const before = beforeRead.track?.manifest;
  if (!before?.updatedAt || before.updatedAt !== expectedUpdatedAt) {
    throw new TrackMetadataSaveError(
      'The Track changed before this metadata save began. Reload and validate again before another write.',
      409,
      'STALE_MANIFEST',
      before?.updatedAt || null,
    );
  }

  let payload: AdminMetadataSaveResponse;
  try {
    payload = await postTrackMetadataSave(trackId, expectedUpdatedAt, metadata, evidence);
  } catch (reason) {
    if (!(reason instanceof TrackMetadataSaveError) || !['TRACK_METADATA_SAVE_TIMEOUT', 'TRACK_METADATA_SAVE_TRANSPORT'].includes(reason.code || '')) throw reason;

    try {
      const reread = await getAdminTrack(trackId);
      const manifest = reread.track?.manifest;
      const sameRevision = manifest?.updatedAt === before.updatedAt;
      const exactPostcondition = manifestMatchesReviewedProposal(manifest, reviewedProposal);

      if (!sameRevision && exactPostcondition && manifest?.updatedAt) {
        return {
          ok: true,
          saved: true,
          noChange: false,
          trackId,
          previousUpdatedAt: before.updatedAt,
          updatedAt: manifest.updatedAt,
          track: manifest,
          quality: reread.track?.quality || null,
          catalogRebuilt: false,
          clientVerified: true,
          verificationWarning: 'RECOVERED AFTER LOST RESPONSE · Canonical Track metadata/duration is verified. Catalog rebuild was part of the server transaction but cannot be independently proven from the private Track reread, so Studio does not claim that derived receipt after response loss.',
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          commitState: 'committed',
          technicalDetails: `${reason.code}: response lost; private canonical reread verified a new Track revision and the exact reviewed metadata/duration proposal.`,
        };
      }

      if (sameRevision) {
        throw new TrackMetadataSaveError(
          'RETRY SAFE AFTER RECONNECT · Canonical Track reread proves the metadata save did not commit: the original revision is unchanged. Studio did not retry the write.',
          null,
          'TRACK_METADATA_SAVE_NOT_COMMITTED',
          manifest?.updatedAt || before.updatedAt,
          null,
          true,
          reason.technicalDetails,
          'not-committed',
        );
      }

      throw new TrackMetadataSaveError(
        `DO NOT RETRY · Canonical Track state changed while the metadata response was unavailable, but Studio cannot prove the exact reviewed metadata/duration postcondition. exactPostcondition=${exactPostcondition}.`,
        null,
        'TRACK_METADATA_SAVE_AMBIGUOUS',
        manifest?.updatedAt || null,
        null,
        false,
        reason.technicalDetails,
        'ambiguous',
      );
    } catch (rereadReason) {
      if (rereadReason instanceof TrackMetadataSaveError) throw rereadReason;
      throw new TrackMetadataSaveError(
        'DO NOT RETRY · The Track metadata response and canonical reread are both unavailable. Restore Track Manager access, reload the Track, then decide from canonical state.',
        null,
        'TRACK_METADATA_SAVE_UNVERIFIED',
        null,
        null,
        false,
        rereadReason instanceof Error ? rereadReason.message : String(rereadReason),
        'unverified',
      );
    }
  }

  try {
    const reread = await getAdminTrack(trackId);
    const manifest = reread.track?.manifest;
    const exactPostcondition = manifestMatchesReviewedProposal(manifest, reviewedProposal);

    if (payload.noChange === true) {
      if (manifest?.updatedAt !== expectedUpdatedAt || !exactPostcondition) {
        throw new TrackMetadataSaveError(
          `DO NOT RETRY · Track Manager reported no metadata change, but canonical reread did not match the reviewed proposal at the original revision. revision=${manifest?.updatedAt || 'none'}; exactPostcondition=${exactPostcondition}.`,
          null,
          'TRACK_METADATA_SAVE_AMBIGUOUS',
          manifest?.updatedAt || null,
          payload.rollback || null,
          false,
          null,
          'ambiguous',
        );
      }
      return {
        ...payload,
        track: manifest,
        clientVerified: true,
        verificationWarning: null,
        recoveredAfterTransportFailure: false,
        retrySafe: false,
        commitState: 'not-committed',
      };
    }

    const revisionMatches = Boolean(payload.updatedAt && manifest?.updatedAt === payload.updatedAt);
    if (!revisionMatches || !exactPostcondition) {
      throw new TrackMetadataSaveError(
        `DO NOT RETRY · Track Manager reported metadata success, but canonical reread did not verify the exact response revision + reviewed metadata/duration proposal. revisionMatch=${revisionMatches}; exactPostcondition=${exactPostcondition}.`,
        null,
        'TRACK_METADATA_SAVE_AMBIGUOUS',
        manifest?.updatedAt || null,
        payload.rollback || null,
        false,
        null,
        'ambiguous',
      );
    }

    return {
      ...payload,
      track: manifest,
      clientVerified: true,
      verificationWarning: null,
      recoveredAfterTransportFailure: false,
      retrySafe: false,
      commitState: 'committed',
    };
  } catch (reason) {
    if (reason instanceof TrackMetadataSaveError) throw reason;
    throw new TrackMetadataSaveError(
      'DO NOT RETRY · Track Manager reported metadata success, but Studio could not complete the private canonical reread. Reload the Track before any further write.',
      null,
      'TRACK_METADATA_SAVE_UNVERIFIED',
      payload.updatedAt || null,
      payload.rollback || null,
      false,
      reason instanceof Error ? reason.message : String(reason),
      'unverified',
    );
  }
}

export const trackMetadataSavePolicy = Object.freeze({
  lostResponsePolicy: 'private-canonical-revision-reviewed-proposal-reread-no-blind-retry',
  reviewedProposalIncludesDerivedDuration: true,
  validationRemainsNonMutating: true,
  recoveredCatalogReceiptPolicy: 'do-not-claim-derived-catalog-rebuild-after-lost-response',
  maxAutomaticWriteRetries: 0,
});
