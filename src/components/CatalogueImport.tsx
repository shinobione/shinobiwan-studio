import { useEffect, useRef, useState } from 'react';
import type { SessionState } from '../catalogue/session';
import { FINDING_LABELS as LABELS } from '../catalogue/finding-labels';
import { catalogueHref } from '../catalogue-router';
import { CatalogueOverview } from './CatalogueOverview';
import type { CatalogueSection } from '../catalogue-router';


export function CatalogueImport({ section, emptyCopy, state, onSelect, onReset }: { section: CatalogueSection; emptyCopy: { title: string; body: string }; state: SessionState; onSelect: (file: File) => void; onReset: () => void }) {
  const [page, setPage] = useState(0);
  const [code, setCode] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const reviewFocus = useRef(false);
  useEffect(() => { setPage(0); setCode(null); }, [state]);
  useEffect(() => {
    if (section === 'qa' && reviewFocus.current) { heading.current?.focus(); reviewFocus.current = false; }
  }, [section]);
  const result = state.phase === 'complete' ? state.result : null;
  const snapshot = result?.status === 'accepted' ? result.snapshot : null;
  const findings = result?.status === 'accepted' ? result.snapshot.findings : result?.findings ?? [];
  const visibleFindings = code ? findings.filter(f => f.code === code) : findings;
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
          if (file) onSelect(file);
        }} />
      </label>
      {state.phase !== 'empty' && <button type="button" onClick={() => { onReset(); input.current?.focus(); }}>Reset / unload</button>}
    </div>
    <p id="catalogue-privacy">Private, temporary preview. JSON only, up to 10 MiB. Nothing is uploaded or saved. Leaving Catalogue or refreshing clears it.</p>
    <div role="status" aria-live="polite" aria-atomic="true">
      {state.phase === 'empty' && <p>No private source loaded.</p>}
      {state.phase === 'reading' && <p>Reading and validating locally… You can reset or select a replacement.</p>}
      {result?.status === 'rejected' && <p><strong>Source rejected.</strong> No snapshot is active. Source rows: {result.sourceRows ?? 'unknown'}. Parsed records were not activated.</p>}
      {snapshot && <p><strong>Source structurally accepted for dry-run.</strong> {findings.length} findings await human review. Nothing has been imported into production.</p>}
    </div>
    {snapshot && section === 'overview' && <CatalogueOverview snapshot={snapshot} onReview={value => {
      setCode(value); setPage(0); reviewFocus.current = true;
      globalThis.location.hash = catalogueHref({ section: 'qa' });
    }} />}
    {snapshot && <>
      <details className="catalogue-source-details"><summary>Source audit & provenance</summary>
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
      </details>
      {(section === 'releases' || section === 'recordings') && <p>Your snapshot is available. {section === 'releases' ? 'Release browsing' : 'Recording details'} is not available in this slice. Open Overview for counts or QA for evidence.</p>}
    </>}
    {findings.length > 0 && (section === 'qa' || result?.status === 'rejected') && <div className="catalogue-findings">
      <h3 ref={heading} tabIndex={-1}>Pending review</h3>
      {code && <p>Showing {visibleFindings.length} of {findings.length} findings · {LABELS[code] ?? code}. <button type="button" onClick={() => { setCode(null); setPage(0); heading.current?.focus(); }}>Show all findings</button></p>}
      <p>{findings.filter(f => f.severity === 'error').length} errors · {findings.filter(f => f.severity === 'warning').length} warnings. No decisions are applied automatically.</p>
      <ol start={page * pageSize + 1}>{visibleFindings.slice(page * pageSize, (page + 1) * pageSize).map((f, i) => <li key={`${page}-${i}`}>
        <strong>{f.severity === 'error' ? 'Error' : 'Review'}: {LABELS[f.code] ?? 'Source evidence needs review'}</strong><span>{f.locator}</span>
        {f.evidenceId && <details><summary>Private source evidence</summary><pre>{evidence.get(f.evidenceId)?.note}</pre></details>}
      </li>)}</ol>
      <div className="catalogue-import-controls">
        <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous cases</button>
        <span aria-live="polite">Page {page + 1} of {Math.ceil(visibleFindings.length / pageSize)}</span>
        <button type="button" disabled={(page + 1) * pageSize >= visibleFindings.length} onClick={() => setPage(p => p + 1)}>Next cases</button>
      </div>
    </div>}
  </section>;
}
