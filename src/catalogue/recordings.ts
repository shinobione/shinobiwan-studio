import type { Finding, Snapshot } from './import';
import type { EvidenceId, RecordingId, CommercialReleaseId, ReleaseAppearance } from '../types/commercial-catalogue';
import { compareText, releaseIndex, type SourceAppearance } from './releases';

export type CatalogueContext = { kind: 'recording'; id: RecordingId } | { kind: 'release'; id: CommercialReleaseId } | { kind: 'appearance'; id: ReleaseAppearance['appearanceId'] };
export interface ReviewFilter { code: string | null; context: CatalogueContext | null }
export const allFindings: ReviewFilter = { code: null, context: null };

export function catalogueIndex(snapshot: Snapshot) {
  const index = releaseIndex(snapshot);
  const appearancesByRecordingId = new Map<RecordingId, ReleaseAppearance[]>();
  const appearanceById = new Map([...snapshot.appearances, ...snapshot.unboundAppearances].map(a => [a.appearanceId, a]));
  const targetsByEvidenceId = new Map<EvidenceId, CatalogueContext[]>();
  const add = (ids: readonly EvidenceId[], target: CatalogueContext) => {
    for (const id of ids) if (index.evidenceById.has(id)) {
      const targets = targetsByEvidenceId.get(id) ?? [];
      if (!targets.some(t => t.kind === target.kind && t.id === target.id)) targets.push(target);
      targetsByEvidenceId.set(id, targets);
    }
  };
  for (const recording of snapshot.recordings) add(recording.evidenceIds, { kind: 'recording', id: recording.recordingId });
  for (const release of snapshot.releases) add(release.evidenceIds, { kind: 'release', id: release.releaseId });
  for (const appearance of appearanceById.values()) {
    add(appearance.evidenceIds, { kind: 'appearance', id: appearance.appearanceId });
    if (index.releaseById.has(appearance.releaseId)) add(appearance.evidenceIds, { kind: 'release', id: appearance.releaseId });
    if (appearance.recordingId !== null && index.recordingById.has(appearance.recordingId)) {
      add(appearance.evidenceIds, { kind: 'recording', id: appearance.recordingId });
      const entries = appearancesByRecordingId.get(appearance.recordingId) ?? [];
      entries.push(appearance); appearancesByRecordingId.set(appearance.recordingId, entries);
    }
  }
  for (const entries of appearancesByRecordingId.values()) entries.sort((a, b) => compareText(a.releaseId, b.releaseId) || (a.position ?? Infinity) - (b.position ?? Infinity) || compareText(a.appearanceId, b.appearanceId));
  // Only normalized evidence membership proves a target. Candidate/observation
  // notes are deliberately not parsed, substring-matched or joined by row index.
  const findingsByContext = new Map<string, Finding[]>();
  for (const finding of snapshot.findings) for (const target of finding.evidenceId ? targetsByEvidenceId.get(finding.evidenceId) ?? [] : []) {
    const key = `${target.kind}:${target.id}`;
    const entries = findingsByContext.get(key) ?? [];
    entries.push(finding); findingsByContext.set(key, entries);
  }
  return { ...index, appearanceById, appearancesByRecordingId, targetsByEvidenceId, findingsByContext, findings: snapshot.findings };
}
export type CatalogueIndex = ReturnType<typeof catalogueIndex>;
export function findingTargets(index: CatalogueIndex, finding: Finding) {
  return finding.evidenceId ? index.targetsByEvidenceId.get(finding.evidenceId) ?? [] : [];
}
export function contextFindings(index: CatalogueIndex, context: CatalogueContext) {
  return index.findingsByContext.get(`${context.kind}:${context.id}`) ?? [];
}
export function selectFindings(index: CatalogueIndex, filter: ReviewFilter) {
  const findings = filter.context ? contextFindings(index, filter.context) : index.findings;
  return filter.code ? findings.filter(f => f.code === filter.code) : findings;
}
export function recordingDetail(index: CatalogueIndex, id: RecordingId) {
  const recording = index.recordingById.get(id);
  if (!recording) return null;
  const appearances = index.appearancesByRecordingId.get(id) ?? [];
  return { recording, appearances, releaseCount: new Set(appearances.map(a => a.releaseId)).size, findings: contextFindings(index, { kind: 'recording', id }) };
}
export interface RecordingQuery { search: string; isrc: 'all' | 'known' | 'missing'; appearances: 'all' | 'zero' | 'one' | 'multiple'; review: 'all' | 'present' | 'none'; sort: 'identity' | 'title' }
export const emptyRecordingQuery: RecordingQuery = { search: '', isrc: 'all', appearances: 'all', review: 'all', sort: 'identity' };
export function selectRecordings(index: CatalogueIndex, query: RecordingQuery) {
  const search = query.search.trim().toLowerCase();
  const reviewIds = new Set(index.findings.flatMap(f => findingTargets(index, f).filter(t => t.kind === 'recording').map(t => t.id)));
  return [...index.recordingById.values()].filter(r => {
    const count = index.appearancesByRecordingId.get(r.recordingId)?.length ?? 0;
    return (!search || [r.title, r.isrc].some(value => value?.toLowerCase().includes(search)))
      && (query.isrc === 'all' || (query.isrc === 'known' ? !!r.isrc : !r.isrc))
      && (query.appearances === 'all' || (query.appearances === 'zero' ? count === 0 : query.appearances === 'one' ? count === 1 : count > 1))
      && (query.review === 'all' || reviewIds.has(r.recordingId) === (query.review === 'present'));
  }).sort((a, b) => (query.sort === 'title' ? compareText(a.title.toLowerCase(), b.title.toLowerCase()) : 0) || compareText(a.recordingId, b.recordingId));
}
export function appearanceLabel(appearance: SourceAppearance) { return appearance.position === null ? 'Position unknown' : `Position ${appearance.position}`; }
