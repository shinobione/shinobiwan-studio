import { useEffect, useRef, useState } from 'react';
import { createImportSession, type SessionState } from '../catalogue/session';
import type { CatalogueSection } from '../catalogue-router';

const LABELS: Record<string, string> = {
  MISSING_ISRC: 'ISRC missing', INVALID_ISRC: 'ISRC format needs review', DUPLICATE_ISRC: 'ISRC shared by separate source recordings',
  DUPLICATE_UPC: 'UPC shared by separate releases', INVALID_UPC: 'UPC/EAN format needs review', AMBIGUOUS_RECORDING_TITLE: 'Similar recording titles remain separate',
  POSSIBLE_RELEASE_OVERLAP: 'Similar release titles remain separate', RELEASE_COUNT_CONFLICT: 'Release counts disagree',
  ISRC_CONTRADICTION: 'Appearance and recording ISRC evidence disagree', ISRC_FLAG_CONFLICT: 'Source ISRC flag disagrees with code',
  UNREVIEWED_TRACK_BINDING: 'Proposed Studio link held for human review', SOURCE_REVIEW_REQUIRED: 'Source requests human review',
  PUBLICATION_UNVERIFIED: 'Current channel availability is unknown', AMUSE_PENDING_REVIEW: 'Amuse candidate remains unverified',
  CHANNEL_OBSERVATION_UNVERIFIED: 'SoundCloud observation is historical', SOURCE_QA_PENDING: 'Source QA remains pending',
  CHANNEL_EVIDENCE_CONFLICT: 'Channel observations disagree',
  RELEASE_METADATA_CONFLICT: 'Duplicate release identity has conflicting metadata',
  DERIVED_SOURCE_COVERAGE_INCOMPLETE: 'Workbook evidence is not fully retained in this derived JSON', UNBOUND_APPEARANCE: 'Appearance has no recording binding',
  MALFORMED_JSON: 'The file is not valid JSON', UNSUPPORTED_SCHEMA: 'Unsupported source schema/version', INVALID_ROOT: 'Source metadata or tables are invalid',
  INVALID_ROW: 'Required fields or field types are invalid', DUPLICATE_ID: 'Duplicate source identity', DUPLICATE_RELEASE_IDENTITY: 'Duplicate release source identity',
  POSITION_OWNERSHIP_CONFLICT: 'Two appearances claim the same release position', ORPHAN_APPEARANCE: 'Appearance references a missing entity',
  ORPHAN_CANDIDATE: 'Candidate references a missing entity', ORPHAN_OBSERVATION: 'Observation references a missing recording',
  SOURCE_COUNT_CONFLICT: 'Source sheet count disagrees with data', PROVENANCE_CONFLICT: 'Recording provenance disagrees with identity',
  FILE_TOO_LARGE: 'File exceeds the 10 MiB limit', TOO_MANY_ROWS: 'File exceeds the 50,000-row limit', JSON_ONLY: 'Select a JSON file',
  UNREADABLE_SOURCE: 'File could not be read as UTF-8', LOCAL_PARSER_FAILED: 'Local parser could not complete', INVALID_INPUT_DIGEST: 'Input fingerprint could not be verified',
};

export function CatalogueImport({ section, emptyCopy }: { section: CatalogueSection; emptyCopy: { title: string; body: string } }) {
  const [state, setState] = useState<SessionState>({ phase: 'empty' });
  const [page, setPage] = useState(0);
  const session = useRef<ReturnType<typeof createImportSession> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const current = createImportSession(() => new Worker(new URL('../catalogue/import.worker.ts', import.meta.url), { type: 'module' }), value => { setState(value); setPage(0); });
    session.current = current;
    return () => { current.dispose(); session.current = null; };
  }, []);
  const result = state.phase === 'complete' ? state.result : null;
  const snapshot = result?.status === 'accepted' ? result.snapshot : null;
  const findings = result?.status === 'accepted' ? result.snapshot.findings : result?.findings ?? [];
  const pageSize = 20;
  const channelCounts = new Map<string, number>();
  snapshot?.channels.forEach(c => channelCounts.set(c.channel, (channelCounts.get(c.channel) ?? 0) + 1));
  const evidence = new Map(snapshot?.evidence.map(e => [e.evidenceId, e]) ?? []);
  return <section className="catalogue-import" aria-label="Local private import">
    {state.phase === 'empty' && <><h3>{emptyCopy.title}</h3><p>{emptyCopy.body}</p></>}
    <div className="catalogue-import-controls">
      <label className="catalogue-file-label">Select local source
        <input ref={input} type="file" accept=".json,application/json" aria-describedby="catalogue-privacy" onChange={event => {
          const file = event.currentTarget.files?.[0]; event.currentTarget.value = '';
          if (file) session.current?.select(file);
        }} />
      </label>
      {state.phase !== 'empty' && <button type="button" onClick={() => { session.current?.reset(); input.current?.focus(); }}>Reset / unload</button>}
    </div>
    <p id="catalogue-privacy">Private, temporary preview. JSON only, up to 10 MiB. Nothing is uploaded or saved. Leaving Catalogue or refreshing clears it.</p>
    <div role="status" aria-live="polite" aria-atomic="true">
      {state.phase === 'empty' && <p>No private source loaded.</p>}
      {state.phase === 'reading' && <p>Reading and validating locally… You can reset or select a replacement.</p>}
      {result?.status === 'rejected' && <p><strong>Source rejected.</strong> No snapshot is active. Source rows: {result.sourceRows ?? 'unknown'}. Parsed records were not activated.</p>}
      {snapshot && <p><strong>Source structurally accepted for dry-run.</strong> {findings.length} findings await human review. Nothing has been imported into production.</p>}
    </div>
    {snapshot && <>
      <dl className="catalogue-import-summary">
        {Object.entries({ 'Source rows': snapshot.summary.sourceRows, 'Parsed rows': snapshot.summary.parsedRows, 'Rejected rows': snapshot.summary.rejectedRows,
          Recordings: snapshot.recordings.length, 'Commercial releases': snapshot.releases.length, 'Source appearances': snapshot.appearances.length + snapshot.summary.unboundAppearances,
          'Unbound appearances': snapshot.summary.unboundAppearances, 'Known ISRC': snapshot.summary.knownIsrc, 'Missing / invalid ISRC': snapshot.summary.missingIsrc,
          'Amuse review candidates': snapshot.summary.amuseCandidates, 'Source QA cases': snapshot.summary.sourceQA, 'Recent SoundCloud observations': snapshot.summary.recentObservations,
        }).map(([label, n]) => <div key={label}><dt>{label}</dt><dd>{n}</dd></div>)}
      </dl>
      <p>Historical source date: {snapshot.source.snapshotDate}. Source workbook fingerprint is a claim in the JSON; workbook bytes are not verified here.</p>
      <p>Coverage is incomplete: dashboard and source-method text and a separate detailed Amuse table are not retained by this derived format. Review the private workbook for full evidence.</p>
      <details><summary>Channel evidence</summary>
        <p>All current availability remains unknown. These are historical source observations, not verified platform publication.</p>
        <ul>{Array.from(channelCounts).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([channel, n]) => <li key={channel}>{channel}: {n} release observations · unknown</li>)}</ul>
        <p>Recording-level Spotify and SoundCloud text is retained only as private evidence. No Spotify, Apple Music or pitch status is inferred.</p>
      </details>
      {section !== 'qa' && <p>Open QA to inspect unresolved cases. Populated commercial browsing belongs to the next slice.</p>}
    </>}
    {findings.length > 0 && (section === 'qa' || result?.status === 'rejected') && <div className="catalogue-findings">
      <h3>Pending review</h3>
      <p>{findings.filter(f => f.severity === 'error').length} errors · {findings.filter(f => f.severity === 'warning').length} warnings. No decisions are applied automatically.</p>
      <ol start={page * pageSize + 1}>{findings.slice(page * pageSize, (page + 1) * pageSize).map((f, i) => <li key={`${page}-${i}`}>
        <strong>{f.severity === 'error' ? 'Error' : 'Review'}: {LABELS[f.code] ?? 'Source evidence needs review'}</strong><span>{f.locator}</span>
        {f.evidenceId && <details><summary>Private source evidence</summary><pre>{evidence.get(f.evidenceId)?.note}</pre></details>}
      </li>)}</ol>
      <div className="catalogue-import-controls">
        <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous cases</button>
        <span aria-live="polite">Page {page + 1} of {Math.ceil(findings.length / pageSize)}</span>
        <button type="button" disabled={(page + 1) * pageSize >= findings.length} onClick={() => setPage(p => p + 1)}>Next cases</button>
      </div>
    </div>}
  </section>;
}
