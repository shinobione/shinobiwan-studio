import type { Snapshot } from './import';

// C7a.2 is an ephemeral, source-only review desk. A source ID is NOT a
// commercial registry target, and this code never creates a reviewed alias.
export type DossierKind = 'recording' | 'release' | 'appearance';
export interface LocalReviewDossier {
  readonly kind: DossierKind;
  readonly sourceId: string;
  readonly sourceLabel: string;
  readonly relationship: string;
  readonly evidenceIds: readonly string[];
  readonly findingCodes: readonly string[];
  readonly unbound: boolean;
  readonly reviewedSourceNamespace: null;
  readonly commercialTargetId: null;
  readonly reviewState: 'HUMAN_REVIEW_REQUIRED';
}
export type LocalDossierPack =
  | { readonly status: 'blocked'; readonly reason: 'SOURCE_NOT_V2' | 'UNRESOLVED_SOURCE_REJECTIONS' }
  | {
      readonly status: 'preview-only';
      readonly dossiers: readonly LocalReviewDossier[];
      readonly unlinkedEvidenceIds: readonly string[];
      readonly unscopedFindingCount: number;
      readonly automaticMappings: 0;
      readonly commercialWrites: 0;
      readonly nextStep: 'EXACT_SOURCE_AND_REGISTRY_REVIEW';
    };

export function collectC7aDossiers(snapshot: Snapshot): LocalDossierPack {
  if (snapshot.source.schema !== 'catalogue-readonly-seed-v2' || !snapshot.enrichment) {
    return { status: 'blocked', reason: 'SOURCE_NOT_V2' };
  }
  if (snapshot.summary.rejectedRows !== 0) {
    return { status: 'blocked', reason: 'UNRESOLVED_SOURCE_REJECTIONS' };
  }

  const bound = new Set<string>();
  // Index once instead of scanning all QA findings for every source row.
  // This remains bounded by the accepted parser's row limits.
  const codesByEvidence = new Map<string, Set<string>>();
  for (const finding of snapshot.findings) {
    if (!finding.evidenceId) continue;
    const codes = codesByEvidence.get(finding.evidenceId) ?? new Set<string>();
    codes.add(finding.code);
    codesByEvidence.set(finding.evidenceId, codes);
  }
  const build = (
    kind: DossierKind, sourceId: string, sourceLabel: string, relationship: string,
    evidenceIds: readonly string[], unbound: boolean,
  ): LocalReviewDossier => {
    const distinctEvidence = [...new Set(evidenceIds)];
    for (const evidenceId of distinctEvidence) bound.add(evidenceId);
    const findingCodes = [...new Set(distinctEvidence.flatMap(id => [...(codesByEvidence.get(id) ?? [])]))];
    return {
      kind, sourceId, sourceLabel, relationship, evidenceIds: distinctEvidence,
      findingCodes, unbound, reviewedSourceNamespace: null,
      commercialTargetId: null, reviewState: 'HUMAN_REVIEW_REQUIRED',
    };
  };

  const dossiers: LocalReviewDossier[] = [
    ...snapshot.recordings.map(r => build(
      'recording', r.recordingId, r.title, 'Source recording only; no Studio track binding',
      r.evidenceIds, false,
    )),
    ...snapshot.releases.map(r => build(
      'release', r.releaseId, r.title, 'Source release only; live platform status unknown',
      r.evidenceIds, false,
    )),
    ...[...snapshot.appearances, ...snapshot.unboundAppearances].map(a => build(
      'appearance', a.appearanceId, a.displayTitle ?? 'Untitled source appearance',
      `Release ${a.releaseId} · position ${a.position ?? 'unknown'} · recording ${a.recordingId ?? 'unbound'}`,
      a.evidenceIds, a.recordingId === null,
    )),
  ];
  // Independent distributor detail must stay targetless when no exact source
  // Appearance references its evidence ID. Never join it by title or ISRC.
  const unlinkedEvidenceIds = snapshot.evidence
    .filter(e => e.detailKind === 'distributor-detail' && !bound.has(e.evidenceId))
    .map(e => e.evidenceId);
  return {
    status: 'preview-only',
    dossiers,
    unlinkedEvidenceIds,
    unscopedFindingCount: snapshot.findings.filter(f => !f.evidenceId || !bound.has(f.evidenceId)).length,
    automaticMappings: 0,
    commercialWrites: 0,
    nextStep: 'EXACT_SOURCE_AND_REGISTRY_REVIEW',
  };
}
