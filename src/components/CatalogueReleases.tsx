import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Snapshot } from '../catalogue/import';
import type { CommercialReleaseId, EvidenceId, RecordingId, ReleaseAppearance } from '../types/commercial-catalogue';
import { compareText, emptyReleaseQuery, releaseDetail, releaseIndex, selectReleases, type ReleaseIndex, type ReleaseQuery } from '../catalogue/releases';
import { FINDING_LABELS } from '../catalogue/finding-labels';
import './catalogue-releases.css';

const KIND_LABELS: Record<string, string> = { single: 'Single', ep: 'EP', album: 'Album', unknown: 'Kind unknown' };

function CoverPlaceholder() {
  return <span className="catalogue-cover-placeholder"><span aria-hidden="true" className="catalogue-cover-mark">◫</span><span>Artwork not documented</span></span>;
}

export function EvidenceDisclosure({ ids, index }: { ids: readonly EvidenceId[]; index: ReleaseIndex }) {
  return <details className="release-evidence"><summary>Private source evidence</summary>
    {ids.length === 0 && <p>Evidence not available in this snapshot.</p>}
    {ids.map(id => {
      const evidence = index.evidenceById.get(id);
      return <div key={id}>{evidence ? <>{evidence.detailKind === 'distributor-detail' && <p><strong>Independent distributor detail · historical source proof (not current DSP verification)</strong></p>}<p>{evidence.sourceLocator ?? 'Source location not documented'} · {evidence.detailKind === 'distributor-detail' ? 'Source snapshot' : 'Observed'} {evidence.observedAt ?? 'date unknown'}</p><pre>{evidence.note ?? 'Evidence text not documented.'}</pre></> : <p>Evidence not available in this snapshot.</p>}</div>;
    })}
  </details>;
}

export function CatalogueReleaseDetail({ index, releaseId, onClose, embedded = false, onRecording, onReview, onAppearance }: { index: ReleaseIndex; releaseId: CommercialReleaseId; onClose: () => void; embedded?: boolean; onRecording?: (id: RecordingId) => void; onReview?: () => void; onAppearance?: (id: ReleaseAppearance['appearanceId']) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const detail = useMemo(() => releaseDetail(index, releaseId), [index, releaseId]);
  useEffect(() => {
    if (embedded) return;
    const element = dialog.current!;
    const opener = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [embedded]);
  const content = <>
    {!embedded && <header className="release-detail-header"><p className="commercial-catalogue-eyebrow">PRIVATE RELEASE DETAIL</p><button type="button" autoFocus onClick={onClose}>Close detail</button></header>}
    {onReview && <><button type="button" onClick={onReview}>Review Release findings</button><p>Release QA shows this Release row and its appearance rows. Linked Recording findings remain in Recording or global QA.</p></>}
    {!detail ? <><h3 id="release-detail-title">Release not found.</h3><p>This release is not available in the current snapshot.</p></> : <>
      <div className="release-detail-intro"><CoverPlaceholder /><div><p className="release-kind">{KIND_LABELS[detail.release.kind]}</p><h3 id="release-detail-title">{detail.release.title}</h3><p>Publication unverified · Private, temporary source view</p></div></div>
      <dl className="release-detail-metadata">
        <div><dt>Source</dt><dd>{detail.release.source}</dd></div>
        <div><dt>Distributor</dt><dd>{detail.release.distributor ?? 'Not documented'}</dd></div>
        <div><dt>UPC / EAN</dt><dd>{detail.release.upc ?? 'Not documented'}</dd></div>
        <div><dt>Reference date</dt><dd>{detail.release.referenceDate ?? 'Not documented'}</dd></div>
      </dl>
      <p>A reference date is historical source text, not a verified platform release date.</p>
      <p>Historical distribution observation: <strong>{detail.release.historicalDistributionStatus ?? 'Not documented'}</strong>. Current availability remains unknown.</p>
      <EvidenceDisclosure ids={detail.release.evidenceIds} index={index} />
      <section aria-labelledby="release-appearances-title" className="release-detail-section">
        <h4 id="release-appearances-title">Source appearances</h4>
        <p>{detail.appearances.length} source appearances · {detail.appearances.filter(a => a.recordingId !== null).length} bound · {detail.appearances.filter(a => a.recordingId === null).length} unbound</p>
        <p>Documented positions come first. Unknown positions remain unordered; matching titles never establish a Recording link.</p>
        {detail.appearances.length === 0 && <p>No appearance rows documented for this release.</p>}
        <ol className="release-appearances">{detail.appearances.map(appearance => {
          const recording = appearance.recordingId === null ? null : index.recordingById.get(appearance.recordingId);
          return <li key={appearance.appearanceId}>
            <p className="release-position">{appearance.position === null ? 'Position unknown' : `Position ${appearance.position}`}</p>
            <h5>{appearance.displayTitle ?? 'Appearance title not documented'}</h5>
            {appearance.recordingId === null ? <><p>Unbound appearance · No Recording association documented.</p><p>Source ISRC observation (unverified): {appearance.observedIsrc ?? 'Not documented'}</p></> : recording ? <><p>Linked Recording: <strong>{recording.title}</strong></p><p>Recording ISRC: {recording.isrc ?? 'Unknown / not documented'}</p><p>Source binding is unreviewed. No Studio Track binding is inferred.</p><EvidenceDisclosure ids={recording.evidenceIds} index={index} /></> : <p>Referenced Recording is unavailable. No substitute has been selected.</p>}
            {recording && onRecording && <button type="button" onClick={() => onRecording(recording.recordingId)}>View Recording</button>}
            {onAppearance && <button type="button" onClick={() => onAppearance(appearance.appearanceId)}>Review appearance</button>}
            <EvidenceDisclosure ids={appearance.evidenceIds} index={index} />
          </li>;
        })}</ol>
      </section>
      <section aria-labelledby="release-channels-title" className="release-detail-section"><h4 id="release-channels-title">Historical channel evidence</h4>
        <p>A source observation or URL does not prove delivery, pitching or current platform availability.</p>
        {detail.channels.length ? detail.channels.map(channel => <div key={channel.publicationId} className="release-channel"><p><strong>{channel.channel}</strong> · Current availability: unknown</p><EvidenceDisclosure ids={channel.evidenceIds} index={index} /></div>) : <p>No channel evidence documented.</p>}
      </section>
      <section aria-labelledby="release-findings-title" className="release-detail-section"><h4 id="release-findings-title">Pending review</h4>
        <p>{detail.findings.length} findings linked through release, appearance or bound Recording evidence. No decisions are applied.</p>
        {detail.findings.length > 0 && <details><summary>Inspect linked findings</summary><ul>{detail.findings.map((finding, n) => <li key={n}>{FINDING_LABELS[finding.code] ?? 'Source evidence needs review'} · {finding.code} · {finding.locator}</li>)}</ul></details>}
        <p>{index.enrichment ? 'Workbook coverage remains partial. Independently documented distributor details are retained as evidence of their exact appearances, not extra tracks or verified-live DSP status.' : 'Workbook coverage is incomplete. This derived snapshot does not retain all original sheet bodies or detailed Amuse evidence.'}</p>
      </section>
    </>}
  </>;
  return embedded ? content : <dialog ref={dialog} className="catalogue-release-dialog" aria-labelledby="release-detail-title" onCancel={event => { event.preventDefault(); onClose(); }}>{content}</dialog>;
}

export function CatalogueReleases({ snapshot, onOpen }: { snapshot: Snapshot; onOpen?: (id: CommercialReleaseId) => void }) {
  const index = useMemo(() => releaseIndex(snapshot), [snapshot]);
  const [query, setQuery] = useState<ReleaseQuery>(emptyReleaseQuery);
  const [presentation, setPresentation] = useState<'grid' | 'list'>('grid');
  const [selection, setSelection] = useState<{ id: CommercialReleaseId; snapshot: Snapshot } | null>(null);
  const close = useCallback(() => setSelection(null), []);
  useEffect(() => { setQuery(emptyReleaseQuery); setSelection(null); }, [snapshot]);
  const releases = useMemo(() => selectReleases(snapshot.releases, query), [snapshot, query]);
  const sources = useMemo(() => [...new Set(snapshot.releases.map(release => release.source))].sort(compareText), [snapshot]);
  const change = (patch: Partial<ReleaseQuery>) => setQuery(current => ({ ...current, ...patch }));
  return <section className="catalogue-releases" aria-labelledby="catalogue-releases-title">
    <header className="release-gallery-heading"><div><p className="commercial-catalogue-eyebrow">COMMERCIAL RELEASES</p><h3 id="catalogue-releases-title">A collection of distinct stories.</h3><p>Explore the releases documented in your selected private snapshot.</p></div><div role="group" aria-label="Release presentation"><button type="button" aria-pressed={presentation === 'grid'} onClick={() => setPresentation('grid')}>Grid</button><button type="button" aria-pressed={presentation === 'list'} onClick={() => setPresentation('list')}>List</button></div></header>
    <div className="release-gallery-controls">
      <label className="release-search">Search releases<input type="search" autoComplete="off" value={query.search} onChange={event => change({ search: event.target.value })} placeholder="Title, UPC, source or distributor" /></label>
      <label>Release kind<select aria-label="Release kind" value={query.kind} onChange={event => change({ kind: event.target.value })}><option value="all">All kinds</option>{Object.entries(KIND_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Source<select aria-label="Source" value={query.source} onChange={event => change({ source: event.target.value })}><option value="">All sources</option>{sources.map(source => <option key={source} value={source}>{source}</option>)}</select></label>
      <label>UPC / EAN<select aria-label="UPC / EAN" value={query.upc} onChange={event => change({ upc: event.target.value as ReleaseQuery['upc'] })}><option value="all">Any UPC status</option><option value="present">Documented</option><option value="missing">Missing</option></select></label>
      <label>Sort releases<select aria-label="Sort releases" value={query.sort} onChange={event => change({ sort: event.target.value as ReleaseQuery['sort'] })}><option value="identity">Source identity</option><option value="title">Title A–Z</option><option value="reference">Reference date, newest</option></select></label>
    </div>
    <div className="release-gallery-results"><p role="status">{releases.length} of {snapshot.releases.length} releases</p><button type="button" onClick={() => setQuery(emptyReleaseQuery)}>Clear filters</button></div>
    {!snapshot.releases.length ? <p>No commercial releases documented in this snapshot.</p> : !releases.length ? <p>No releases match these filters. Clear filters to see the selected source again.</p> : <ul className={`release-gallery release-gallery-${presentation}`}>{releases.map(release => {
      const appearances = index.appearancesByReleaseId.get(release.releaseId) ?? [];
      return <li key={release.releaseId}><button type="button" className="release-card" onClick={() => onOpen ? onOpen(release.releaseId) : setSelection({ id: release.releaseId, snapshot })} aria-haspopup="dialog">
        <CoverPlaceholder /><span className="release-card-copy"><span className="release-kind">{KIND_LABELS[release.kind]} · {release.source}</span><strong className="release-card-title">{release.title}</strong><span>Reference date: {release.referenceDate ?? 'Not documented'}</span><span>UPC / EAN: {release.upc ?? 'Not documented'}</span><span>{appearances.length} source appearances</span><span className="release-publication">Publication unverified <span aria-hidden="true">↗</span></span></span>
      </button></li>;
    })}</ul>}
    {selection?.snapshot === snapshot && <CatalogueReleaseDetail index={index} releaseId={selection.id} onClose={close} />}
  </section>;
}
