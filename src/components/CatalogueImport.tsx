import { useEffect, useMemo, useRef, useState } from 'react';
import type { SessionState } from '../catalogue/session';
import { FINDING_LABELS as LABELS } from '../catalogue/finding-labels';
import { catalogueHref } from '../catalogue-router';
import { CatalogueOverview } from './CatalogueOverview';
import { CatalogueReleases } from './CatalogueReleases';
import { CatalogueRecordings } from './CatalogueRecordings';
import { CatalogueDetails } from './CatalogueDetails';
import { allFindings, catalogueIndex, findingTargets, selectFindings, type CatalogueContext, type ReviewFilter } from '../catalogue/recordings';
import type { Snapshot } from '../catalogue/import';
import { previewC7a } from '../catalogue/c7aPreview';
import { collectC7aDossiers, type DossierKind } from '../catalogue/c7aDossiers';
import type { CatalogueSection } from '../catalogue-router';


export function CatalogueImport({ section, emptyCopy, state, onSelect, onReset }: { section: CatalogueSection; emptyCopy: { title: string; body: string }; state: SessionState; onSelect: (file: File) => void; onReset: () => void }) {
  const [page, setPage] = useState(0);
  const [dossierKind, setDossierKind] = useState<DossierKind | 'unlinked'>('recording');
  const [dossierPage, setDossierPage] = useState(0);
  const [filter, setFilter] = useState<ReviewFilter>(allFindings);
  const [selection, setSelection] = useState<{ target: CatalogueContext; snapshot: Snapshot; section: CatalogueSection } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const reviewFocus = useRef(false);
  const resetFocus = useRef(false);
  useEffect(() => {
    setPage(0); setFilter(allFindings); setSelection(null);
    setDossierKind('recording'); setDossierPage(0);
    // A discarded release dialog must leave the top layer before picker focus.
    if (resetFocus.current && state.phase === 'empty') { input.current?.focus(); resetFocus.current = false; }
  }, [state]);
  useEffect(() => {
    setSelection(null);
    // Preserve Build120's code selection across tabs; entity context expires on exit.
    if (section !== 'qa' && filter.context && !reviewFocus.current) { setFilter(allFindings); setPage(0); }
    if (section === 'qa' && reviewFocus.current) { heading.current?.focus(); reviewFocus.current = false; }
  }, [section, filter]);
  const result = state.phase === 'complete' ? state.result : null;
  const snapshot = result?.status === 'accepted' ? result.snapshot : null;
  const findings = result?.status === 'accepted' ? result.snapshot.findings : result?.findings ?? [];
  const index = useMemo(() => snapshot ? catalogueIndex(snapshot) : null, [snapshot]);
  const c7a = useMemo(() => snapshot ? previewC7a(snapshot) : null, [snapshot]);
  const dossiers = useMemo(() => snapshot ? collectC7aDossiers(snapshot) : null, [snapshot]);
  const dossierRows = dossiers?.status === 'preview-only' && dossierKind !== 'unlinked' ? dossiers.dossiers.filter(d => d.kind === dossierKind) : [];
  const dossierTotal = dossiers?.status === 'preview-only' ? dossierKind === 'unlinked' ? dossiers.unlinkedEvidenceIds.length : dossierRows.length : 0;
  const dossierPageSize = 12;
  const evidenceById = useMemo(() => new Map<string, Snapshot['evidence'][number]>(snapshot?.evidence.map(e => [String(e.evidenceId), e] as const) ?? []), [snapshot]);
  const visibleFindings = index ? selectFindings(index, filter) : findings;
  const contextLabel = !index || !filter.context ? null : filter.context.kind === 'recording' ? index.recordingById.get(filter.context.id)?.title
    : filter.context.kind === 'release' ? index.releaseById.get(filter.context.id)?.title : index.appearanceById.get(filter.context.id)?.displayTitle;
  const open = (target: CatalogueContext) => { if (snapshot) setSelection({ target, snapshot, section }); };
  const review = (context: CatalogueContext) => {
    setSelection(null); setFilter({ code: null, context }); setPage(0); reviewFocus.current = true;
    globalThis.location.hash = catalogueHref({ section: 'qa' });
  };
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
      {state.phase !== 'empty' && <button type="button" onClick={() => { resetFocus.current = true; onReset(); input.current?.focus(); }}>Reset / unload</button>}
    </div>
    <p id="catalogue-privacy">Private, temporary preview. JSON only, up to 10 MiB. Nothing is uploaded or saved. Leaving Catalogue or refreshing clears it.</p>
    <div role="status" aria-live="polite" aria-atomic="true">
      {state.phase === 'empty' && <p>No private source loaded.</p>}
      {state.phase === 'reading' && <p>Reading and validating locally… You can reset or select a replacement.</p>}
      {result?.status === 'rejected' && <p><strong>Source rejected.</strong> No snapshot is active. Source rows: {result.sourceRows ?? 'unknown'}. Parsed records were not activated.</p>}
      {snapshot && <><p><strong>Source structurally accepted for dry-run.</strong> {findings.length} findings await human review. Nothing has been imported into production.</p>{snapshot.enrichment && <p>Enriched v2 · {snapshot.enrichment.detailedEvidenceCount} independent historical distributor evidence rows · {snapshot.enrichment.linkedEvidenceCount} exact appearance links · {snapshot.enrichment.unlinkedEvidenceCount} unlinked pending review. Existing appearances are never recounted as new recordings.</p>}</>}
    </div>
    {snapshot && c7a?.status === 'preview-only' && section === 'overview' && (
      <section className="catalogue-source-details" aria-label="C7a local read-only migration preflight">
        <h3>C7a · Local migration readiness preview</h3>
        <p>Private v2 source accepted locally. This is an aggregate-only preview, not a commercial registry migration or a saved backup.</p>
        <dl className="catalogue-import-summary">
          {Object.entries({
            'Existing source recordings': c7a.recordings,
            'Existing source releases': c7a.releases,
            'Existing appearances': c7a.appearances,
            'Unbound appearances': c7a.unbound,
            'Historical evidence rows': c7a.evidence,
            'Exact linked details': c7a.linkedDetail,
            'Unlinked details pending review': c7a.unlinkedDetail,
            'Pending QA': c7a.pendingQa,
            'Partial source sections': c7a.partialSections,
            'Omitted source sections': c7a.omittedSections,
            'Automatic mappings': c7a.proposedAutomaticMappings,
            'Commercial writes': c7a.proposedCommercialWrites,
          }).map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        <p><strong>Human review required.</strong> Existing source rows are not newly minted commercial entities. Titles, ISRC/UPC and order are not mapping authority. Historical distribution does not establish current DSP availability. Nothing is uploaded, exported, persisted or approved.</p>
      </section>
    )}
    {snapshot && dossiers?.status === 'preview-only' && section === 'overview' && (
      <section className="catalogue-source-details catalogue-review-desk" aria-label="C7a2 local source dossiers for human review">
        <h3>C7a.2 · Source review dossiers</h3>
        <p>Private source-only inspection. Exact v2 source references and historical evidence are shown for human review; they are NOT reviewed commercial mappings. No target IDs, approvals, export or save exist here.</p>
        <p>{dossiers.dossiers.length} source identities · {dossiers.unlinkedEvidenceIds.length} independent unattached distributor details · {dossiers.unscopedFindingCount} pending QA findings without an exact dossier evidence link.</p>
        <p><strong>Review state: HOLD.</strong> An owner-reviewed source namespace, separate private registry and exact target decisions are still required. Titles, ISRC/UPC and source positions never authorize identity merging.</p>
        <div className="catalogue-import-controls" role="group" aria-label="Source dossier kind">
          {(['recording', 'release', 'appearance', 'unlinked'] as const).map(kind => (
            <button key={kind} type="button" aria-pressed={dossierKind === kind} onClick={() => { setDossierKind(kind); setDossierPage(0); }}>
              {kind === 'unlinked' ? 'Unlinked distributor evidence' : kind === 'recording' ? 'Recordings' : kind === 'release' ? 'Releases' : 'Appearances'}
            </button>
          ))}
        </div>
        <p aria-live="polite">Showing {dossierTotal ? dossierPage * dossierPageSize + 1 : 0}–{Math.min((dossierPage + 1) * dossierPageSize, dossierTotal)} of {dossierTotal} · No item is approved.</p>
        {dossierKind !== 'unlinked' ? (
          <ol className="catalogue-review-dossier-list" start={dossierPage * dossierPageSize + 1}>
            {dossierRows.slice(dossierPage * dossierPageSize, (dossierPage + 1) * dossierPageSize).map(d => (
              <li key={d.kind + ':' + d.sourceId}>
                <details>
                  <summary><strong>{d.sourceLabel}</strong> · {d.evidenceIds.length} linked proof refs · {d.findingCodes.length} QA classes{d.unbound ? ' · UNBOUND' : ''}</summary>
                  <p><strong>Exact source {d.kind} ID:</strong> <code>{d.sourceId}</code></p>
                  <p>{d.relationship}</p>
                  <p><strong>Reviewed namespace:</strong> none · <strong>Commercial target:</strong> none · <strong>Decision:</strong> HUMAN REVIEW REQUIRED</p>
                  <p><strong>QA codes:</strong> {d.findingCodes.length ? d.findingCodes.map(code => LABELS[code] ?? code).join(' · ') : 'No exactly linked findings; not a clearance'}</p>
                  {d.evidenceIds.map(id => {
                    const proof = evidenceById.get(id);
                    return <details key={id}><summary>Source proof: {proof?.sourceLocator ?? 'Exact evidence reference'}</summary>
                      <p>Evidence ID: <code>{id}</code></p>
                      <pre>{proof?.note ?? 'Evidence note not available in this source'}</pre>
                    </details>;
                  })}
                </details>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="catalogue-review-dossier-list" start={dossierPage * dossierPageSize + 1}>
            {dossiers.unlinkedEvidenceIds.slice(dossierPage * dossierPageSize, (dossierPage + 1) * dossierPageSize).map(id => {
              const proof = evidenceById.get(id);
              return <li key={id}><details><summary>Independent detail · unattached · HUMAN REVIEW REQUIRED</summary>
                <p>No Appearance, Recording, Release or commercial target is inferred from this distributor detail.</p>
                <p>Evidence ID: <code>{id}</code> · Source: {proof?.sourceLocator ?? 'unknown'}</p>
                <pre>{proof?.note ?? 'Evidence note not available'}</pre>
              </details></li>;
            })}
          </ol>
        )}
        <div className="catalogue-import-controls">
          <button type="button" disabled={dossierPage === 0} onClick={() => setDossierPage(p => p - 1)}>Previous dossiers</button>
          <span>Page {dossierPage + 1} of {Math.max(1, Math.ceil(dossierTotal / dossierPageSize))}</span>
          <button type="button" disabled={(dossierPage + 1) * dossierPageSize >= dossierTotal} onClick={() => setDossierPage(p => p + 1)}>Next dossiers</button>
        </div>
      </section>
    )}
    {snapshot && section === 'overview' && <CatalogueOverview snapshot={snapshot} onReview={value => {
      setFilter({ code: value, context: null }); setPage(0); reviewFocus.current = true;
      globalThis.location.hash = catalogueHref({ section: 'qa' });
    }} />}
    {snapshot && section === 'releases' && <CatalogueReleases snapshot={snapshot} onOpen={id => open({ kind: 'release', id })} />}
    {index && section === 'recordings' && <CatalogueRecordings index={index} onOpen={open} />}
    {index && selection?.snapshot === snapshot && selection.section === section && <CatalogueDetails index={index} target={selection.target} onClose={() => setSelection(null)} onReview={review} />}
    {snapshot && <>
      <details className="catalogue-source-details"><summary>Source audit & provenance</summary>
      <dl className="catalogue-import-summary">
        {Object.entries({ 'Source rows': snapshot.summary.sourceRows, 'Parsed rows': snapshot.summary.parsedRows, 'Rejected rows': snapshot.summary.rejectedRows,
          Recordings: snapshot.recordings.length, 'Commercial releases': snapshot.releases.length, 'Source appearances': snapshot.appearances.length + snapshot.summary.unboundAppearances,
          'Unbound appearances': snapshot.summary.unboundAppearances, 'Known ISRC': snapshot.summary.knownIsrc, 'Missing / invalid ISRC': snapshot.summary.missingIsrc,
          'Amuse review candidates': snapshot.summary.amuseCandidates, 'Source QA cases': snapshot.summary.sourceQA, 'Recent SoundCloud observations': snapshot.summary.recentObservations,
          ...(snapshot.enrichment ? { 'V2 workbook sections': snapshot.enrichment.sectionCount, 'Independent detail evidence': snapshot.enrichment.detailedEvidenceCount,
            'Exact evidence links': snapshot.enrichment.linkedEvidenceCount, 'Unlinked detail evidence': snapshot.enrichment.unlinkedEvidenceCount,
            'Partial sections': snapshot.enrichment.partialSections, 'Omitted sections': snapshot.enrichment.omittedSections } : {}),
        }).map(([label, n]) => <div key={label}><dt>{label}</dt><dd>{n}</dd></div>)}
      </dl>
      <p>Historical source date: {snapshot.source.snapshotDate}. Source workbook fingerprint is a claim in the JSON; workbook bytes are not verified here.</p>
      <p>{snapshot.enrichment ? 'V2 retains independent distributor detail for validated positions. Source coverage remains partial or omitted in other sections. These are historical records, not a complete workbook migration or current DSP verification.' : 'Coverage is incomplete: dashboard and source-method text and a separate detailed Amuse table are not retained by this derived format. Review the private workbook for full evidence.'}</p>
      <details><summary>Channel evidence</summary>
        <p>All current availability remains unknown. These are historical source observations, not verified platform publication.</p>
        <ul>{Array.from(channelCounts).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([channel, n]) => <li key={channel}>{channel}: {n} release observations · unknown</li>)}</ul>
        <p>Recording-level Spotify and SoundCloud text is retained only as private evidence. No Spotify, Apple Music or pitch status is inferred.</p>
      </details>
      </details>
    </>}
    {(findings.length > 0 || snapshot) && (section === 'qa' || result?.status === 'rejected') && <div className="catalogue-findings">
      <h3 ref={heading} tabIndex={-1}>Pending review</h3>
      {filter.context && <p>Context: <strong>{contextLabel ?? 'Title not documented'}</strong></p>}
      {(filter.code || filter.context) && <p>Showing {visibleFindings.length} of {findings.length} findings · {filter.code ? LABELS[filter.code] ?? filter.code : 'Exact ' + filter.context!.kind + ' evidence context'}. <button type="button" onClick={() => { setFilter(allFindings); setPage(0); heading.current?.focus(); }}>Show all findings</button></p>}
      {!visibleFindings.length && <p>No findings with a proven link in this context. This does not establish source completeness or approval.</p>}
      <p>{findings.filter(f => f.severity === 'error').length} errors · {findings.filter(f => f.severity === 'warning').length} warnings. No decisions are applied automatically.</p>
      <ol start={page * pageSize + 1}>{visibleFindings.slice(page * pageSize, (page + 1) * pageSize).map((f, i) => <li key={`${page}-${i}`}>
        <strong>{f.severity === 'error' ? 'Error' : 'Review'}: {LABELS[f.code] ?? 'Source evidence needs review'}</strong><span>{f.locator}</span>
        {index && <div className="catalogue-finding-links">{findingTargets(index, f).map(target => <button type="button" aria-haspopup="dialog" key={target.kind + target.id} onClick={() => open(target)}>{target.kind === 'recording' ? 'View Recording' : target.kind === 'release' ? 'View Release' : 'Review appearance'}</button>)}</div>}
        {f.evidenceId && <details><summary>Private source evidence</summary><pre>{evidence.get(f.evidenceId)?.note}</pre></details>}
      </li>)}</ol>
      <div className="catalogue-import-controls">
        <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous cases</button>
        <span aria-live="polite">Page {page + 1} of {Math.max(1, Math.ceil(visibleFindings.length / pageSize))}</span>
        <button type="button" disabled={(page + 1) * pageSize >= visibleFindings.length} onClick={() => setPage(p => p + 1)}>Next cases</button>
      </div>
    </div>}
  </section>;
}
