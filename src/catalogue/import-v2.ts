import { MAX_BYTES, MAX_ROWS, parseCatalogue, reject, type Finding, type ImportResult, type Snapshot } from './import';
import type { Evidence, EvidenceId, ReleaseAppearance, UnboundReleaseAppearance } from '../types/commercial-catalogue';

// Exact read-only adapter for the explicitly owner-selected, private local B2 export.
// The accepted v1 parser stays unchanged. No network, IO, storage or source logging.
const VERSION = 'catalogue-readonly-seed-v2';
const EXPORTER = 'a24b2-local-0.1.0';
type Row = Record<string, unknown>;
const object = (v: unknown): v is Row => v !== null && typeof v === 'object' && !Array.isArray(v);
const safeText = (v: unknown): v is string => typeof v === 'string' && v.length <= 16_384;
const text = (v: unknown): v is string => safeText(v) && !!v.trim();
const id = (v: unknown): v is string => typeof v === 'string' && /^[^\s\x00-\x1f\x7f]{1,160}$/.test(v);
const nullable = (v: unknown) => v === null || safeText(v);
const positive = (v: unknown): v is number => Number.isSafeInteger(v) && Number(v) > 0;
const nonnegative = (v: unknown): v is number => Number.isSafeInteger(v) && Number(v) >= 0;
const keys = (v: Row, names: readonly string[]) => Object.keys(v).length === names.length && Object.keys(v).every(k => names.includes(k));
const fields = (v: unknown, schema: Record<string, (v: unknown) => boolean>): v is Row =>
  object(v) && keys(v, Object.keys(schema)) && Object.entries(schema).every(([k, check]) => check(v[k]));
const sourceFields = ['recordings', 'releases', 'appearances', 'unverifiedAmuseCandidates', 'soundcloudRecent', 'qa'] as const;
const oldFields = ['schemaVersion', 'artist', 'snapshotDate', 'sourceFile', 'sourceSha256', 'warnings', 'sourceSheets', ...sourceFields] as const;
const extraFields = ['exporterContractVersion', 'privateOnly', 'sourceMethodEvidence', 'coverageCounts', 'sectionCoverage', 'detailedCount', 'detailedDistributorEvidence'] as const;
const coverageStatuses = ['represented', 'partial', 'omitted', 'contradictory', 'unverified'];
const preservation = ['not-copied', 'normalized-or-counted-only', 'detailed-evidence'];
const normalizedCode = (v: unknown) => typeof v === 'string' ? v.replace(/[-\s]/g, '').toUpperCase() : null;
const summaryFinding = (code: string, locator: string, evidenceId?: EvidenceId): Finding =>
  ({ severity: 'warning', code, locator, evidenceId, state: 'pending-review' });
const safeOriginalEvidence = (v: unknown) => object(v) && Object.keys(v).length <= 20 &&
  Object.entries(v).every(([k, value]) => text(k) && (nullable(value) || typeof value === 'boolean' || (typeof value === 'number' && Number.isSafeInteger(value))));

function validCoverage(v: unknown): v is Row {
  return fields(v, {
    section: text, sourceRows: nonnegative,
    status: value => coverageStatuses.includes(value as string),
    bodyPreservation: value => preservation.includes(value as string),
    countMatchesArchivedV1: value => value === null || typeof value === 'boolean',
  });
}
const privateCountFields = ['appearanceRows', 'countedSectionsInV1', 'independentDetailedEvidenceRows', 'normalizedRecordsV1', 'originalSections', 'totalRowsEightCountedSheets'] as const;
const validCode = (v: unknown) => typeof v === 'string' && /^[A-Z_]{1,80}$/.test(v);
const detailFields: Record<string, (v: unknown) => boolean> = {
  appearanceId: value => value === null || id(value), displayTitle: nullable,
  evidenceFindingCodes: value => Array.isArray(value) && value.length <= 32 && value.every(validCode) && new Set(value).size === value.length,
  evidenceId: id, fileNote: nullable, isrcObserved: nullable,
  linkIssueCode: value => value === null || validCode(value), linkProof: value => value === null || value === 'EXACT_SOURCE_RELEASE_AND_POSITION',
  linkStatus: value => value === 'linked' || value === 'unlinked',
  originalEvidence: safeOriginalEvidence, position: value => value === null || positive(value),
  releaseId: value => value === null || id(value), sourceLocator: text, sourceNamespace: text,
  sourceRecordAlias: id, sourceRecordAliasScope: value => value === 'workbook-snapshot-only',
  sourceReleaseId: text, statusText: nullable, storeSyncText: nullable,
  timecodeVideo: nullable, upcObserved: nullable,
};

export function parseCatalogueInput(input: string, inputSha256: string): ImportResult {
  if (new TextEncoder().encode(input).byteLength > MAX_BYTES) return reject('FILE_TOO_LARGE');
  let root: unknown;
  try { root = JSON.parse(input); } catch { return reject('MALFORMED_JSON'); }
  if (!object(root)) return reject('INVALID_ROOT');
  if (root.schemaVersion === 'catalogue-readonly-seed-v1') return parseCatalogue(input, inputSha256);
  if (root.schemaVersion !== VERSION) return reject('UNSUPPORTED_SCHEMA');
  if (!keys(root, [...oldFields, ...extraFields]) || root.exporterContractVersion !== EXPORTER ||
      root.privateOnly !== true || root.sourceMethodEvidence !== null || !Array.isArray(root.sectionCoverage) ||
      !Array.isArray(root.detailedDistributorEvidence) || !nonnegative(root.detailedCount) ||
      !fields(root.coverageCounts, Object.fromEntries(privateCountFields.map(key => [key, nonnegative]))))
    return reject('V2_INVALID_ENVELOPE');

  // Reuse the original strictly validated v1 tables; no source rows are rewritten or
  // silently filled. The input hash remains the SHA-256 of the ORIGINAL v2 file bytes.
  const inherited: Row = { ...root, schemaVersion: 'catalogue-readonly-seed-v1' };
  for (const k of extraFields) delete inherited[k];
  const previous = parseCatalogue(JSON.stringify(inherited), inputSha256);
  if (previous.status === 'rejected') return previous;
  const snapshot = previous.snapshot;
  const baseRows = snapshot.summary.sourceRows;
  const details = root.detailedDistributorEvidence as unknown[];
  const sections = root.sectionCoverage as unknown[];
  if (baseRows + details.length + sections.length > MAX_ROWS) return reject('TOO_MANY_ROWS');
  if (details.length !== root.detailedCount || sections.length !== 10 || !sections.every(validCoverage))
    return reject('V2_COVERAGE_COUNT_CONFLICT');
  const sheetCounts = root.sourceSheets as Row;
  const covered = new Set<string>();
  let counted = 0;
  for (const section of sections as Row[]) {
    const name = section.section as string;
    if (covered.has(name)) return reject('V2_COVERAGE_COUNT_CONFLICT');
    covered.add(name);
    if (Object.hasOwn(sheetCounts, name)) {
      counted++;
      if (section.countMatchesArchivedV1 !== true || section.sourceRows !== sheetCounts[name]) return reject('V2_COVERAGE_COUNT_CONFLICT');
    } else if (section.countMatchesArchivedV1 !== null) return reject('V2_COVERAGE_COUNT_CONFLICT');
  }
  const counts = root.coverageCounts as Row;
  if (counted !== 8 || counts.countedSectionsInV1 !== counted || counts.originalSections !== sections.length ||
      counts.appearanceRows !== (root.appearances as unknown[]).length ||
      counts.independentDetailedEvidenceRows !== details.length ||
      counts.normalizedRecordsV1 !== baseRows ||
      counts.totalRowsEightCountedSheets !== Object.values(sheetCounts).reduce<number>((sum, n) => sum + Number(n), 0) ||
      sheetCounts['2 fiches Amuse vérifiées'] !== details.length)
    return reject('V2_COVERAGE_COUNT_CONFLICT');

  const rawReleases = root.releases as Row[];
  const rawAppearances = root.appearances as Row[];
  const releaseById = new Map(rawReleases.map(r => [r.id, r]));
  const appearanceById = new Map(rawAppearances.map(r => [r.id, r]));
  const appearanceIds = new Set<string>();
  const evidenceAliases = new Set<string>();
  const sourceAliases = new Set<string>();
  const evidence: Evidence[] = [...snapshot.evidence];
  const findings: Finding[] = [...snapshot.findings];
  const adds = new Map<string, EvidenceId[]>();
  let linked = 0, unlinked = 0;
  for (let n = 0; n < details.length; n++) {
    const value = details[n];
    if (!fields(value, detailFields)) return reject('V2_INVALID_DETAIL');
    const proof = value;
    const evidenceIdentity = String(proof.evidenceId);
    const sourceIdentity = JSON.stringify([proof.sourceNamespace, proof.sourceRecordAlias]);
    if (evidenceAliases.has(evidenceIdentity) || sourceAliases.has(sourceIdentity)) return reject('V2_DUPLICATE_EVIDENCE');
    evidenceAliases.add(evidenceIdentity); sourceAliases.add(sourceIdentity);
    const locator = 'detailedDistributorEvidence[' + n + ']';
    // Scoped to this snapshot. Never use a row index, title, UPC or ISRC to choose a target.
    const evidenceId = ('evidence:v2-detail:' + evidenceIdentity) as EvidenceId;
    const linkedRow = proof.linkStatus === 'linked';
    if (linkedRow) {
      if (proof.linkProof !== 'EXACT_SOURCE_RELEASE_AND_POSITION' || proof.linkIssueCode !== null ||
          !id(proof.releaseId) || !id(proof.appearanceId) || !positive(proof.position))
        return reject('V2_DETAIL_LINK_CONFLICT');
      const release = releaseById.get(proof.releaseId);
      const appearance = appearanceById.get(proof.appearanceId);
      if (!release || !appearance || release.source !== proof.sourceNamespace ||
          release.sourceId !== proof.sourceReleaseId || appearance.releaseId !== proof.releaseId ||
          appearance.position !== proof.position || appearanceIds.has(String(proof.appearanceId)))
        return reject('V2_DETAIL_LINK_CONFLICT');
      appearanceIds.add(String(proof.appearanceId));
      linked++;
      adds.set(String(proof.appearanceId), [...(adds.get(String(proof.appearanceId)) ?? []), evidenceId]);
      if (safeText(proof.displayTitle) && safeText(appearance.displayTitle) && proof.displayTitle !== appearance.displayTitle)
        findings.push(summaryFinding('V2_DETAIL_TITLE_CONTRADICTION', locator, evidenceId));
      if (normalizedCode(proof.isrcObserved) && normalizedCode(appearance.isrcObserved) &&
          normalizedCode(proof.isrcObserved) !== normalizedCode(appearance.isrcObserved))
        findings.push(summaryFinding('V2_DETAIL_ISRC_CONTRADICTION', locator, evidenceId));
    } else {
      // Preserve unlinked evidence in global QA, not inside an unproven Release/Recording.
      if (proof.linkProof !== null || proof.appearanceId !== null || proof.releaseId !== null ||
          !validCode(proof.linkIssueCode)) return reject('V2_DETAIL_LINK_CONFLICT');
      unlinked++;
      findings.push(summaryFinding('V2_DETAIL_UNLINKED', locator, evidenceId));
    }
    if ((proof.evidenceFindingCodes as string[]).length) findings.push(summaryFinding('V2_DETAIL_SOURCE_REVIEW', locator, evidenceId));
    evidence.push({
      evidenceId, source: snapshot.source.sourceFile,
      sourceLocator: String(proof.sourceLocator), observedAt: snapshot.source.snapshotDate,
      note: JSON.stringify({ sourceNamespace: proof.sourceNamespace, sourceRecordAliasScope: proof.sourceRecordAliasScope,
        historicalSourceOnly: true, originalEvidence: proof.originalEvidence, statusText: proof.statusText,
        storeSyncText: proof.storeSyncText, timecodeVideo: proof.timecodeVideo,
        fileNote: proof.fileNote, evidenceFindingCodes: proof.evidenceFindingCodes }),
      classification: 'source-observation', detailKind: 'distributor-detail',
    });
  }
  const addTo = <T extends ReleaseAppearance | UnboundReleaseAppearance>(row: T): T => {
    // The mapping uses the EXACT original appearance ID inside its v1 evidence ID.
    const old = row.evidenceIds[0];
    const key = String(old).slice('evidence:appearances:'.length);
    const extra = adds.get(key);
    return extra ? { ...row, evidenceIds: [...row.evidenceIds, ...extra] } : row;
  };
  const output: Snapshot = {
    ...snapshot, source: { ...snapshot.source, schema: VERSION },
    appearances: snapshot.appearances.map(addTo), unboundAppearances: snapshot.unboundAppearances.map(addTo),
    evidence: evidence.sort((a, b) => a.evidenceId < b.evidenceId ? -1 : a.evidenceId > b.evidenceId ? 1 : 0),
    findings: findings.sort((a, b) => (a.locator + a.code) < (b.locator + b.code) ? -1 : (a.locator + a.code) > (b.locator + b.code) ? 1 : 0),
    enrichment: {
      sectionCount: sections.length, detailedEvidenceCount: details.length, linkedEvidenceCount: linked,
      unlinkedEvidenceCount: unlinked,
      partialSections: (sections as Row[]).filter(s => s.status === 'partial').length,
      omittedSections: (sections as Row[]).filter(s => s.status === 'omitted').length,
    },
  };
  return { status: 'accepted', snapshot: output };
}
