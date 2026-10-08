import type { Snapshot } from './import';

// C7a: aggregate-only, pure local preflight. Not a migration planner,
// mapping engine, registry writer or permission to export commercial data.
export type C7aPreview =
  | { status: 'blocked'; reason: 'SOURCE_NOT_V2' | 'UNRESOLVED_SOURCE_REJECTIONS' }
  | { status: 'preview-only'; recordings: number; releases: number; appearances: number;
      unbound: number; evidence: number; linkedDetail: number; unlinkedDetail: number;
      pendingQa: number; partialSections: number; omittedSections: number;
      unknownPlatformStatus: true; proposedCommercialWrites: 0; proposedAutomaticMappings: 0;
      nextStep: 'HUMAN_REVIEW_REQUIRED' };

export function previewC7a(snapshot: Snapshot): C7aPreview {
  if (snapshot.source.schema !== 'catalogue-readonly-seed-v2' || !snapshot.enrichment) {
    return { status: 'blocked', reason: 'SOURCE_NOT_V2' };
  }
  if (snapshot.summary.rejectedRows !== 0) {
    return { status: 'blocked', reason: 'UNRESOLVED_SOURCE_REJECTIONS' };
  }
  return {
    status: 'preview-only',
    recordings: snapshot.recordings.length,
    releases: snapshot.releases.length,
    appearances: snapshot.appearances.length,
    unbound: snapshot.unboundAppearances.length,
    evidence: snapshot.evidence.length,
    linkedDetail: snapshot.enrichment.linkedEvidenceCount,
    unlinkedDetail: snapshot.enrichment.unlinkedEvidenceCount,
    pendingQa: snapshot.findings.filter(f => f.state === 'pending-review').length,
    partialSections: snapshot.enrichment.partialSections,
    omittedSections: snapshot.enrichment.omittedSections,
    unknownPlatformStatus: true,
    proposedCommercialWrites: 0,
    proposedAutomaticMappings: 0,
    nextStep: 'HUMAN_REVIEW_REQUIRED',
  };
}
