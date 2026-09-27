import { useMemo, useState } from 'react';
import { emptyRecordingQuery, selectRecordings, contextFindings, type CatalogueIndex, type RecordingQuery, type CatalogueContext } from '../catalogue/recordings';
import './catalogue-recordings.css';

export function CatalogueRecordings({ index, onOpen }: { index: CatalogueIndex; onOpen: (target: CatalogueContext) => void }) {
  const [query, setQuery] = useState<RecordingQuery>(emptyRecordingQuery);
  const recordings = useMemo(() => selectRecordings(index, query), [index, query]);
  const change = (patch: Partial<RecordingQuery>) => setQuery(current => ({ ...current, ...patch }));
  return <section className="catalogue-recordings" aria-labelledby="recordings-title">
    <header className="release-gallery-heading"><div><p className="commercial-catalogue-eyebrow">RECORDINGS</p><h3 id="recordings-title">One recording. Every appearance.</h3><p>Distinct source identities, connected only by documented references.</p></div></header>
    <div className="release-gallery-controls">
      <label className="release-search">Search recordings<input type="search" autoComplete="off" placeholder="Documented title or ISRC" value={query.search} onChange={e => change({ search: e.target.value })} /></label>
      <label>ISRC<select aria-label="Recording ISRC" value={query.isrc} onChange={e => change({ isrc: e.target.value as RecordingQuery['isrc'] })}><option value="all">Any ISRC status</option><option value="known">Known</option><option value="missing">Missing / invalid</option></select></label>
      <label>Bound appearances<select aria-label="Bound appearances" value={query.appearances} onChange={e => change({ appearances: e.target.value as RecordingQuery['appearances'] })}><option value="all">Any count</option><option value="zero">None documented</option><option value="one">One</option><option value="multiple">Multiple</option></select></label>
      <label>Exact review links<select aria-label="Exact review links" value={query.review} onChange={e => change({ review: e.target.value as RecordingQuery['review'] })}><option value="all">Any review context</option><option value="present">Findings linked</option><option value="none">No exact findings linked</option></select></label>
      <label>Sort recordings<select aria-label="Sort recordings" value={query.sort} onChange={e => change({ sort: e.target.value as RecordingQuery['sort'] })}><option value="identity">Source identity</option><option value="title">Title A–Z</option></select></label>
    </div>
    <div className="release-gallery-results"><p role="status">{recordings.length} of {index.recordingById.size} recordings</p><button type="button" onClick={() => setQuery(emptyRecordingQuery)}>Clear filters</button></div>
    <p className="recording-context-note">Review counts include only this Recording and its bound appearance evidence. Other source findings remain in global QA.</p>
    {!index.recordingById.size ? <p>No recordings documented in this snapshot.</p> : !recordings.length ? <p>No recordings match these filters.</p> : <ul className="recording-list">{recordings.map(recording => {
      const target: CatalogueContext = { kind: 'recording', id: recording.recordingId };
      const appearances = index.appearancesByRecordingId.get(recording.recordingId) ?? [];
      return <li key={recording.recordingId}><button type="button" className="recording-card" aria-haspopup="dialog" onClick={() => onOpen(target)}>
        <span className="recording-mark" aria-hidden="true">◎</span><span className="recording-card-copy"><strong className="recording-title">{recording.title}</strong><span className="recording-isrc">ISRC: {recording.isrc ?? 'Unknown / not documented'}</span></span>
        <span className="recording-counts"><span>{appearances.length} bound appearances · {new Set(appearances.map(a => a.releaseId)).size} Releases</span><span>{contextFindings(index, target).length} exact findings · Pending review</span></span><span aria-hidden="true">→</span>
      </button></li>;
    })}</ul>}
  </section>;
}
