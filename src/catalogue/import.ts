import type { Recording, CommercialRelease, ReleaseAppearance, UnboundReleaseAppearance, Evidence, ChannelPublication } from '../types/commercial-catalogue';

export const MAX_BYTES = 10 * 1024 * 1024;
export const MAX_ROWS = 50_000;
export const SOURCE_SCHEMA = 'catalogue-readonly-seed-v1';
type Row = Record<string, unknown>;
export interface Finding { severity: 'error' | 'warning'; code: string; locator: string; state: 'pending-review'; evidenceId?: Evidence['evidenceId'] }
export interface Snapshot {
  source: { schema: string; snapshotDate: string; sourceFile: string; claimedWorkbookSha256: string; inputSha256: string };
  recordings: Recording[]; releases: CommercialRelease[]; appearances: ReleaseAppearance[];
  readonly unboundAppearances: readonly UnboundReleaseAppearance[];
  evidence: Evidence[]; channels: ChannelPublication[];
  findings: Finding[];
  summary: { sourceRows: number; parsedRows: number; rejectedRows: number; knownIsrc: number; missingIsrc: number; unboundAppearances: number; amuseCandidates: number; sourceQA: number; recentObservations: number };
}
export type ImportResult = { status: 'accepted'; snapshot: Snapshot } | { status: 'rejected'; findings: Finding[]; sourceRows: number | null };
const finding = (severity: Finding['severity'], code: string, locator: string): Finding => ({ severity, code, locator, state: 'pending-review' });
export const reject = (code: string): ImportResult => ({ status: 'rejected', findings: [finding('error', code, 'source')], sourceRows: null });
const object = (v: unknown): v is Row => v !== null && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.length <= 16_384;
const nullableText = (v: unknown) => v === null || text(v);
const count = (v: unknown) => v === null || (Number.isSafeInteger(v) && Number(v) >= 0);
const id = (v: unknown): v is string => typeof v === 'string' && /^[^\s\x00-\x1f\x7f]{1,160}$/.test(v);
const date = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const digest = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
const clean = (v: unknown): string | null => typeof v === 'string' ? v.trim() || null : null;
const code = (v: unknown) => clean(v)?.replace(/[-\s]/g, '').toUpperCase() ?? null;
const isrc = (v: unknown) => { const c = code(v); return c && /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(c) ? c : null; };
const sort = <T>(rows: T[], key: (r: T) => string) => rows.sort((a, b) => key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
type Check = (v: unknown) => boolean;
const shape = (v: unknown, required: Record<string, Check>, optional: Record<string, Check> = {}): boolean => object(v)
  && Object.entries(required).every(([k, test]) => Object.hasOwn(v, k) && test(v[k]))
  && Object.entries(v).every(([k, value]) => Object.hasOwn(required, k) || (Object.hasOwn(optional, k) && optional[k](value)));
const fields = (names: string[], check: Check) => Object.fromEntries(names.map(n => [n, check]));
const recShape = (v: unknown) => shape(v, {
  id, title: v => text(v) && !!v.trim(),
  ...fields(['isrc','isrcEvidence','matchMethod','legacyTrackId','studioTrackId','knownProjects','amuseDetails','soundcloudDistribution','soundcloudUpc','soundcloudStudioObserved','spotifyStatus','spotifyTrackUrl','spotifyReleaseUrl','soundcloudUrl','referenceDate','duration','soundcloudStatus','publicationNotes','reviewNeeded','sourceEvidence'], nullableText),
  flags: v => shape(v, fields(['legacy','hasISRC','amuse','soundcloudDistribution','soundcloudStudio'], v => typeof v === 'boolean')),
  provenance: v => shape(v, { sheet: text, sourceId: id }),
});
const releaseShape = (v: unknown) => shape(v, {
  id, title: v => text(v) && !!v.trim(), source: v => text(v) && !!v.trim(), sourceId: id,
  ...fields(['upc','releaseType','referenceDate','distributionStatus','coverUrl','verification','sourceEvidence'], nullableText),
  ...fields(['observedTrackCount','detailedCount','unverifiedCount'], count),
}, fields(['spotifyUrl','soundcloudUrl','legacyNotes'], nullableText));
const appearanceShape = (v: unknown) => shape(v, {
  id, releaseId: id, recordingId: v => v === null || id(v), position: v => v === null || (Number.isSafeInteger(v) && Number(v) > 0),
  ...fields(['displayTitle','isrcObserved','matchStatus','timecode','sourceEvidence'], nullableText),
});
const candidateFields = ['Sortie Amuse','Release ID','Position exacte','Titre candidat / non vu','ISRC du master (si connu)','Source de ce code','ID consolidé','Confiance dans l’attribution à cette sortie','Prochaine vérification'];
const recentFields = ['Titre affiché','Date Studio','Durée Studio','ID consolidé','ISRC rapproché','Source ISRC','État de publication','Lien SC historique','Lien Spotify documenté','Limite'];
const qaFields = ['Priorité','Catégorie','Objet','Constat vérifié','Traitement proposé','Preuve / trace','Statut'];
const sheetNames = ['Pistes consolidées','Apparitions distrib.','Couverture Amuse','Positions à vérifier','SoundCloud récent','Sorties historiques','Contrôles QA','2 fiches Amuse vérifiées'];
const tables: Record<string, Check> = { recordings: recShape, releases: releaseShape, appearances: appearanceShape,
  unverifiedAmuseCandidates: v => shape(v, fields(candidateFields, nullableText)),
  soundcloudRecent: v => shape(v, fields(recentFields, nullableText)), qa: v => shape(v, fields(qaFields, nullableText)) };

// Pure adapter: no IO, logging, persistence, canonical services or remote URL use.
export function parseCatalogue(input: string, inputSha256: string): ImportResult {
  if (new TextEncoder().encode(input).byteLength > MAX_BYTES) return reject('FILE_TOO_LARGE');
  let root: unknown;
  try { root = JSON.parse(input); } catch { return reject('MALFORMED_JSON'); }
  if (!object(root) || root.schemaVersion !== SOURCE_SCHEMA) return reject('UNSUPPORTED_SCHEMA');
  if (!digest(inputSha256)) return reject('INVALID_INPUT_DIGEST');
  if (!shape(root, { schemaVersion: v => v === SOURCE_SCHEMA, artist: v => text(v) && !!v.trim(), snapshotDate: date, sourceFile: v => text(v) && !!v.trim(), sourceSha256: digest,
    warnings: v => Array.isArray(v) && v.every(text), sourceSheets: v => shape(v, fields(sheetNames, n => Number.isSafeInteger(n) && Number(n) >= 0)),
    ...fields(Object.keys(tables), Array.isArray),
  })) return reject('INVALID_ROOT');
  const sourceRows = Object.keys(tables).reduce((n, key) => n + (root[key] as unknown[]).length, 0);
  if (sourceRows > MAX_ROWS) return reject('TOO_MANY_ROWS');
  const findings: Finding[] = [];
  const error = (c: string, loc: string) => findings.push(finding('error', c, loc));
  const warn = (c: string, loc: string) => findings.push(finding('warning', c, loc));
  for (const [key, check] of Object.entries(tables)) (root[key] as unknown[]).forEach((r, i) => { if (!check(r)) error('INVALID_ROW', `${key}[${i}]`); });
  if (findings.length) return { status: 'rejected', findings, sourceRows };
  const rows = (key: string) => root[key] as Row[];
  const maps = new Map<string, Map<string, Row>>();
  for (const table of ['recordings','releases','appearances']) {
    const map = new Map<string, Row>(); maps.set(table, map);
    rows(table).forEach((r, i) => { if (map.has(String(r.id))) error('DUPLICATE_ID', `${table}[${i}]`); map.set(String(r.id), r); });
  }
  const recs = maps.get('recordings')!; const rels = maps.get('releases')!;
  const sheetCounts = root.sourceSheets as Record<string, number>;
  for (const [sheet, n] of [['Pistes consolidées', rows('recordings').length], ['Apparitions distrib.', rows('appearances').length], ['Positions à vérifier', rows('unverifiedAmuseCandidates').length], ['SoundCloud récent', rows('soundcloudRecent').length], ['Contrôles QA', rows('qa').length], ['Couverture Amuse', rows('releases').filter(r => r.source === 'Amuse').length], ['Sorties historiques', rows('releases').filter(r => r.source === 'Master août 2026').length]] as const) {
    if (sheetCounts[sheet] !== n) error('SOURCE_COUNT_CONFLICT', 'sourceSheets');
  }
  const releaseKeys = new Map<string, Row>(); const owners = new Set<string>();
  const amuseIds = new Set(rows('releases').filter(r => r.source === 'Amuse').map(r => r.sourceId));
  rows('releases').forEach((r, i) => {
    const key = JSON.stringify([r.source, r.sourceId]); const loc = `releases[${i}]`;
    const prior = releaseKeys.get(key);
    if (prior) {
      error('DUPLICATE_RELEASE_IDENTITY', loc);
      if (['title','upc','releaseType','referenceDate','distributionStatus'].some(k => prior[k] !== r[k])) error('RELEASE_METADATA_CONFLICT', loc);
    }
    releaseKeys.set(key, r);
    if (r.detailedCount !== null && r.unverifiedCount !== null && r.observedTrackCount !== null && Number(r.detailedCount) + Number(r.unverifiedCount) !== r.observedTrackCount) warn('RELEASE_COUNT_CONFLICT', loc);
  });
  rows('appearances').forEach((a, i) => {
    const loc = `appearances[${i}]`;
    if (!rels.has(String(a.releaseId)) || (a.recordingId !== null && !recs.has(String(a.recordingId)))) error('ORPHAN_APPEARANCE', loc);
    if (a.position !== null) { const owner = JSON.stringify([a.releaseId, a.position]); if (owners.has(owner)) error('POSITION_OWNERSHIP_CONFLICT', loc); owners.add(owner); }
    if (a.recordingId === null) warn('UNBOUND_APPEARANCE', loc);
    else if (code(a.isrcObserved) && code(a.isrcObserved) !== code(recs.get(String(a.recordingId))?.isrc)) warn('ISRC_CONTRADICTION', loc);
  });
  rows('unverifiedAmuseCandidates').forEach((r, i) => {
    if (!recs.has(String(r['ID consolidé'])) || !amuseIds.has(r['Release ID'])) error('ORPHAN_CANDIDATE', `unverifiedAmuseCandidates[${i}]`);
  });
  rows('soundcloudRecent').forEach((r, i) => {
    const rec = recs.get(String(r['ID consolidé']));
    if (!rec) error('ORPHAN_OBSERVATION', `soundcloudRecent[${i}]`);
    else {
      if (code(r['ISRC rapproché']) && code(r['ISRC rapproché']) !== code(rec.isrc)) warn('ISRC_CONTRADICTION', `soundcloudRecent[${i}]`);
      if (rec.soundcloudStudioObserved === 'Non') warn('CHANNEL_EVIDENCE_CONFLICT', `soundcloudRecent[${i}]`);
    }
  });
  rows('recordings').forEach((r, i) => {
    if ((r.provenance as Row).sourceId !== r.id || (r.provenance as Row).sheet !== 'Pistes consolidées') error('PROVENANCE_CONFLICT', `recordings[${i}]`);
  });
  if (findings.some(f => f.severity === 'error')) return { status: 'rejected', findings, sourceRows };
  const evidence: Evidence[] = [];
  const ev = (table: string, r: Row, locator: string): Evidence['evidenceId'] => {
    const evidenceId = `evidence:${table}:${locator}` as Evidence['evidenceId'];
    evidence.push({ evidenceId, source: String(root.sourceFile), sourceLocator: `${table}/${locator}`, observedAt: String(root.snapshotDate), note: JSON.stringify(r), classification: 'source-observation' });
    return evidenceId;
  };
  // Never expose source IDs in errors/logs. UI locators are row positions only.
  const repeated = (table: string, key: (r: Row) => string | null, c: string) => {
    const seen = new Set<string>(); rows(table).forEach((r, i) => { const k = key(r); if (k && seen.has(k)) warn(c, `${table}[${i}]`); if (k) seen.add(k); });
  };
  repeated('recordings', r => isrc(r.isrc), 'DUPLICATE_ISRC');
  repeated('recordings', r => clean(r.title)?.toLowerCase() ?? null, 'AMBIGUOUS_RECORDING_TITLE');
  repeated('releases', r => clean(r.upc), 'DUPLICATE_UPC');
  repeated('releases', r => clean(r.title)?.toLowerCase() ?? null, 'POSSIBLE_RELEASE_OVERLAP');
  const recordings = rows('recordings').map((r, i): Recording => {
    const loc = `recordings[${i}]`;
    if (!isrc(r.isrc)) warn(clean(r.isrc) ? 'INVALID_ISRC' : 'MISSING_ISRC', loc);
    if (r.studioTrackId !== null) warn('UNREVIEWED_TRACK_BINDING', loc);
    if (clean(r.reviewNeeded)) warn('SOURCE_REVIEW_REQUIRED', loc);
    if ((r.flags as Row).hasISRC !== !!isrc(r.isrc)) warn('ISRC_FLAG_CONFLICT', loc);
    return { recordingId: `recording:${r.id}` as Recording['recordingId'], title: String(r.title).trim(), version: null, isrc: isrc(r.isrc), evidenceIds: [ev('recordings', r, String(r.id))], studioTrackLink: null };
  });
  const channels: ChannelPublication[] = [];
  const releases = rows('releases').map((r, i): CommercialRelease => {
    const evidenceId = ev('releases', r, String(r.id)); const releaseId = `release:${r.id}` as CommercialRelease['releaseId'];
    const upc = clean(r.upc);
    if (upc && !/^(?:\d{12}|\d{13})$/.test(upc)) warn('INVALID_UPC', `releases[${i}]`);
    const channelNames = [String(r.source), ...(clean(r.spotifyUrl) ? ['Spotify'] : []), ...(clean(r.soundcloudUrl) ? ['SoundCloud'] : [])];
    for (const channel of new Set(channelNames)) channels.push({ publicationId: `publication:${JSON.stringify([r.id, channel])}` as ChannelPublication['publicationId'], releaseId, channel, status: 'unknown', plannedAt: null, submittedAt: null, deliveredAt: null, verifiedLiveAt: null, removedAt: null, evidenceIds: [evidenceId] });
    warn('PUBLICATION_UNVERIFIED', `releases[${i}]`);
    const kind = clean(r.releaseType)?.toLowerCase();
    return { releaseId, title: String(r.title).trim(), kind: kind === 'single' || kind === 'ep' || kind === 'album' ? kind : 'unknown', upc, distributor: r.source === 'Master août 2026' ? null : String(r.source), source: String(r.source), historicalDistributionStatus: clean(r.distributionStatus), referenceDate: clean(r.referenceDate), evidenceIds: [evidenceId] };
  });
  const unboundAppearances: UnboundReleaseAppearance[] = [];
  const appearances = rows('appearances').flatMap((a): ReleaseAppearance[] => {
    const evidenceId = ev('appearances', a, String(a.id));
    const common = { appearanceId: `appearance:${a.id}` as ReleaseAppearance['appearanceId'], releaseId: `release:${a.releaseId}` as CommercialRelease['releaseId'], position: a.position as number | null, displayTitle: clean(a.displayTitle), status: 'unverified' as const, evidenceIds: [evidenceId] };
    if (a.recordingId === null) { unboundAppearances.push({ ...common, recordingId: null, observedIsrc: clean(a.isrcObserved) }); return []; }
    return [{ ...common, recordingId: `recording:${a.recordingId}` as Recording['recordingId'] }];
  });
  for (const [table, c] of [['unverifiedAmuseCandidates','AMUSE_PENDING_REVIEW'], ['soundcloudRecent','CHANNEL_OBSERVATION_UNVERIFIED'], ['qa','SOURCE_QA_PENDING']] as const) rows(table).forEach((r, i) => { ev(table, r, String(i)); warn(c, `${table}[${i}]`); });
  ev('source', { warnings: root.warnings, sourceSheets: root.sourceSheets, artist: root.artist }, 'metadata');
  warn('DERIVED_SOURCE_COVERAGE_INCOMPLETE', 'source');
  for (const f of findings) {
    const match = /^(\w+)\[(\d+)\]$/.exec(f.locator);
    if (match) { const r = rows(match[1])[Number(match[2])]; f.evidenceId = `evidence:${match[1]}:${r.id ?? match[2]}` as Evidence['evidenceId']; }
  }
  const snapshot: Snapshot = {
    source: { schema: SOURCE_SCHEMA, snapshotDate: String(root.snapshotDate), sourceFile: String(root.sourceFile), claimedWorkbookSha256: String(root.sourceSha256), inputSha256 },
    unboundAppearances: sort(unboundAppearances, a => a.appearanceId),
    recordings: sort(recordings, r => r.recordingId), releases: sort(releases, r => r.releaseId), appearances: sort(appearances, a => a.appearanceId), evidence: sort(evidence, e => e.evidenceId), channels: sort(channels, c => c.publicationId), findings: sort(findings, f => `${f.locator}:${f.code}`),
    summary: { sourceRows, parsedRows: sourceRows, rejectedRows: 0, knownIsrc: recordings.filter(r => r.isrc).length, missingIsrc: recordings.filter(r => !r.isrc).length, unboundAppearances: rows('appearances').filter(a => a.recordingId === null).length, amuseCandidates: rows('unverifiedAmuseCandidates').length, sourceQA: rows('qa').length, recentObservations: rows('soundcloudRecent').length },
  };
  return { status: 'accepted', snapshot };
}
