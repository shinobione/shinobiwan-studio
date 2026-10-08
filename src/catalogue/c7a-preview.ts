// C7a / Build126 candidate: summary-only local v2 migration preflight.
// This never returns source IDs, titles, source paths, hashes, evidence payloads or registry objects.
import type { ImportResult } from './import';

export type C7aRejectCode =
  | 'JSON_ONLY' | 'FILE_EMPTY' | 'FILE_TOO_LARGE' | 'V2_ONLY'
  | 'SOURCE_NOT_ACCEPTED' | 'UNREADABLE_SOURCE' | 'LOCAL_PREVIEW_FAILED';

export type C7aReport =
  | { status: 'rejected'; code: C7aRejectCode }
  | { status: 'accepted'; counts: {
      recordings: number;
      releases: number;
      appearances: number;
      unboundAppearances: number;
      evidence: number;
      linkedDistributorDetails: number;
      unlinkedDistributorDetails: number;
      pendingQa: number;
      knownIsrc: number;
      missingIsrc: number;
      claimedWorkbookDigestVerified: false;
      sections: number;
      represented: number;
      partial: number;
      omitted: number;
      contradictory: number;
      unverified: number;
      sourceAliasesRequiringHumanReview: number;
      inferredCommercialIdentityCount: 0;
      newCommercialEntities: 0;
      writes: 0;
      uploads: 0;
    }
  };

export const rejectC7a = (code: C7aRejectCode): C7aReport => ({ status: 'rejected', code });

export function summarizeC7aV2(input: string, result: ImportResult): C7aReport {
  if (result.status !== 'accepted') return rejectC7a('SOURCE_NOT_ACCEPTED');
  const snapshot = result.snapshot;
  if (snapshot.source.schema !== 'catalogue-readonly-seed-v2' || !snapshot.enrichment)
    return rejectC7a('SOURCE_NOT_ACCEPTED');
  let root: unknown;
  try { root = JSON.parse(input); } catch { return rejectC7a('SOURCE_NOT_ACCEPTED'); }
  if (root === null || typeof root !== 'object' || Array.isArray(root)) return rejectC7a('SOURCE_NOT_ACCEPTED');
  const source = root as Record<string, unknown>;
  if (source.schemaVersion !== 'catalogue-readonly-seed-v2' || !Array.isArray(source.sectionCoverage) ||
      source.sectionCoverage.length !== result.snapshot.enrichment.sectionCount) return rejectC7a('SOURCE_NOT_ACCEPTED');

  const coverage = { represented: 0, partial: 0, omitted: 0, contradictory: 0, unverified: 0 };
  for (const value of source.sectionCoverage) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return rejectC7a('SOURCE_NOT_ACCEPTED');
    const state = (value as { status?: unknown }).status;
    if (typeof state !== 'string' || !Object.hasOwn(coverage, state)) return rejectC7a('SOURCE_NOT_ACCEPTED');
    coverage[state as keyof typeof coverage]++;
  }
  const appearances = snapshot.appearances.length + snapshot.unboundAppearances.length;
  const reviewIdentities = snapshot.recordings.length + snapshot.releases.length + appearances;
  return {
    status: 'accepted',
    counts: {
      recordings: snapshot.recordings.length,
      releases: snapshot.releases.length,
      appearances,
      unboundAppearances: snapshot.unboundAppearances.length,
      evidence: snapshot.evidence.length,
      linkedDistributorDetails: snapshot.enrichment.linkedEvidenceCount,
      unlinkedDistributorDetails: snapshot.enrichment.unlinkedEvidenceCount,
      pendingQa: snapshot.findings.length,
      knownIsrc: snapshot.summary.knownIsrc,
      missingIsrc: snapshot.summary.missingIsrc,
      claimedWorkbookDigestVerified: false,
      sections: source.sectionCoverage.length,
      ...coverage,
      sourceAliasesRequiringHumanReview: reviewIdentities,
      inferredCommercialIdentityCount: 0,
      newCommercialEntities: 0,
      writes: 0,
      uploads: 0,
    },
  };
}
