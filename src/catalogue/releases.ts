import type { Finding, Snapshot } from './import';
import type { CommercialRelease, CommercialReleaseId, EvidenceId, ReleaseAppearance, UnboundReleaseAppearance } from '../types/commercial-catalogue';

export type SourceAppearance = ReleaseAppearance | UnboundReleaseAppearance;
export const compareText = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export function releaseIndex(snapshot: Snapshot) {
  const releaseById = new Map(snapshot.releases.map(release => [release.releaseId, release]));
  const recordingById = new Map(snapshot.recordings.map(recording => [recording.recordingId, recording]));
  const evidenceById = new Map(snapshot.evidence.map(evidence => [evidence.evidenceId, evidence]));
  const appearancesByReleaseId = new Map<CommercialReleaseId, SourceAppearance[]>();
  const findingsByEvidenceId = new Map<EvidenceId, Finding[]>();
  const channelsByReleaseId = new Map<CommercialReleaseId, Snapshot['channels']>();
  for (const appearance of [...snapshot.appearances, ...snapshot.unboundAppearances]) {
    const entries = appearancesByReleaseId.get(appearance.releaseId) ?? [];
    entries.push(appearance); appearancesByReleaseId.set(appearance.releaseId, entries);
  }
  for (const entries of appearancesByReleaseId.values()) entries.sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity) || compareText(a.appearanceId, b.appearanceId));
  for (const finding of snapshot.findings) if (finding.evidenceId) {
    const entries = findingsByEvidenceId.get(finding.evidenceId) ?? [];
    entries.push(finding); findingsByEvidenceId.set(finding.evidenceId, entries);
  }
  for (const channel of snapshot.channels) {
    const entries = channelsByReleaseId.get(channel.releaseId) ?? [];
    entries.push(channel); channelsByReleaseId.set(channel.releaseId, entries);
  }
  return { releaseById, recordingById, evidenceById, appearancesByReleaseId, findingsByEvidenceId, channelsByReleaseId };
}
export type ReleaseIndex = ReturnType<typeof releaseIndex>;
export function releaseDetail(index: ReleaseIndex, id: CommercialReleaseId) {
  const release = index.releaseById.get(id);
  if (!release) return null;
  const appearances = index.appearancesByReleaseId.get(id) ?? [];
  const evidenceIds = new Set(release.evidenceIds);
  for (const appearance of appearances) {
    appearance.evidenceIds.forEach(id => evidenceIds.add(id));
    if (appearance.recordingId !== null) index.recordingById.get(appearance.recordingId)?.evidenceIds.forEach(id => evidenceIds.add(id));
  }
  return { release, appearances, channels: index.channelsByReleaseId.get(id) ?? [], findings: [...evidenceIds].flatMap(id => index.findingsByEvidenceId.get(id) ?? []) };
}

export interface ReleaseQuery { search: string; kind: string; source: string; upc: 'all' | 'present' | 'missing'; sort: 'identity' | 'title' | 'reference' }
export const emptyReleaseQuery: ReleaseQuery = { search: '', kind: 'all', source: '', upc: 'all', sort: 'identity' };
// Only complete, valid documented ISO dates participate in chronological sorting.
// Other reference text stays visible verbatim and sorts after dated entries.
const sortableDate = (date: string | null) => date && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date ? date : '';
export function selectReleases(releases: readonly CommercialRelease[], query: ReleaseQuery) {
  const search = query.search.trim().toLowerCase();
  return releases.filter(release => (!search || [release.title, release.upc, release.source, release.distributor].some(value => value?.toLowerCase().includes(search)))
    && (query.kind === 'all' || release.kind === query.kind)
    && (!query.source || release.source === query.source)
    && (query.upc === 'all' || (query.upc === 'present' ? !!release.upc : !release.upc)))
    .sort((a, b) => (query.sort === 'title' ? compareText(a.title.toLowerCase(), b.title.toLowerCase()) : query.sort === 'reference' ? compareText(sortableDate(b.referenceDate), sortableDate(a.referenceDate)) : 0) || compareText(a.releaseId, b.releaseId));
}
