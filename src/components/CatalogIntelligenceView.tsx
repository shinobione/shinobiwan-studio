import { useEffect, useMemo, useState } from 'react';
import { clusterTracks, nearestTracks } from '../catalog-intelligence';
import { trackHref } from '../router';
import { getSonicTraceCatalog } from '../services/sonictrace-api';
import type { SonicTraceCatalogEntry } from '../types/studio';

export function CatalogIntelligenceView() {
  const [entries, setEntries] = useState<SonicTraceCatalogEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getSonicTraceCatalog()
      .then(value => {
        if (!active) return;
        setEntries(value);
        setSelectedId(current => current || value.find(entry => entry.embedding)?.trackId || value[0]?.trackId || null);
        setError(null);
      })
      .catch(reason => active && setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const selected = entries.find(entry => entry.trackId === selectedId) || null;
  const nearest = useMemo(() => selected ? nearestTracks(selected, entries) : [], [selected, entries]);
  const clusters = useMemo(() => clusterTracks(entries), [entries]);
  const embedded = entries.filter(entry => entry.embedding?.dimension === 512).length;
  const outdated = entries.filter(entry => entry.outdated).length;
  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized ? entries.filter(entry => entry.title.toLocaleLowerCase().includes(normalized)) : entries;
  }, [entries, query]);

  if (loading) return <div className="catalog-message panel" role="status" aria-live="polite">Loading catalog intelligence…</div>;
  if (error) return <div className="catalog-message catalog-error panel" role="alert"><strong>Catalog Intelligence unavailable</strong><span>{error}</span></div>;

  return (
    <section className="intelligence-view">
      <div className="catalog-heading intelligence-heading">
        <div><span className="eyebrow">SONICTRACE / CATALOG</span><h2>Understand your catalog</h2><p>Compare the character of analyzed tracks, discover close neighbors and explore recurring sonic families.</p></div>
        <details className="intelligence-method"><summary>How this view works</summary><p>Similarity uses the existing persisted 512D CLAP embeddings linked by canonical trackId. Studio stores no source audio here and does not change the Phase 5 analysis contract.</p></details>
      </div>
      <div className="catalog-kpis intelligence-kpis" aria-label="Catalog intelligence summary"><div><span>ANALYZED TRACKS</span><strong>{entries.length}</strong><small>Profiles ready</small></div><div><span>SIMILARITY READY</span><strong>{embedded}</strong><small>512D embeddings</small></div><div><span>SONIC FAMILIES</span><strong>{clusters.length}</strong><small>Catalog clusters</small></div><div><span>NEEDS UPDATE</span><strong className={outdated ? 'warn' : ''}>{outdated}</strong><small>After audio changes</small></div></div>
      {!entries.length ? <div className="catalog-message panel intelligence-empty"><strong>No analysis yet</strong><span>Open a track and choose Analyze with SonicTrace to start building catalog relationships.</span><a className="primary-btn" href="#/catalog">Browse Catalog</a></div> : (
        <div className="intelligence-layout">
          <article className="panel sonic-panel intelligence-index">
            <div className="intelligence-section-head"><div><span className="eyebrow">ANALYZED TRACKS</span><h3>Choose a track</h3></div><b>{filteredEntries.length} / {entries.length}</b></div>
            <label className="intelligence-search"><span>Search analyses</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Track title" /></label>
            <div className="intelligence-track-list" aria-label="Analyzed tracks">{filteredEntries.map(entry => <button type="button" aria-pressed={entry.trackId === selectedId} className={entry.trackId === selectedId ? 'active' : ''} key={entry.trackId} onClick={() => setSelectedId(entry.trackId)}><span><strong>{entry.title}</strong><b className={entry.outdated ? 'warn' : 'ready'}>{entry.outdated ? 'Update needed' : 'Current'}</b></span><small>{entry.embedding ? 'Ready for similarity' : 'Analysis has no embedding'}</small></button>)}{!filteredEntries.length && <p className="workspace-muted">No analyzed track matches “{query}”.</p>}</div>
          </article>
          <article className="panel sonic-panel intelligence-neighbors">
            <div className="intelligence-section-head"><div><span className="eyebrow">CLOSEST SOUND</span><h3>{selected ? `Tracks near ${selected.title}` : 'Choose a track'}</h3><p>{selected ? 'Higher percentages indicate a closer position in the existing SonicTrace embedding space.' : 'Select an analyzed track to reveal its nearest catalog neighbors.'}</p></div>{selected && <a className="ghost-btn" href={trackHref(selected.trackId, 'intelligence')}>Open workspace →</a>}</div>
            <div className="similarity-list">{nearest.map(item => <div key={item.entry.trackId}><div><strong>{item.entry.title}</strong><span>{item.reasons.join(' · ')}</span><i aria-hidden="true"><b style={{ width: `${Math.max(0, Math.min(100, item.similarity))}%` }} /></i></div><b aria-label={`${item.similarity.toFixed(1)} percent similar`}>{item.similarity.toFixed(1)}%</b></div>)}{selected && !nearest.length && <div className="intelligence-result-empty"><strong>No neighbors yet</strong><p>At least two valid 512D embeddings are required for a comparison.</p></div>}</div>
          </article>
          <article className="panel sonic-panel intelligence-clusters">
            <div className="intelligence-section-head"><div><span className="eyebrow">SONIC FAMILIES</span><h3>Recurring relationships</h3><p>Deterministic groupings derived from the same saved catalog analyses.</p></div></div>
            <div className="cluster-grid">{clusters.map(cluster => <div key={cluster.id}><div><strong>{cluster.label}</strong><b>{cluster.entries.length}</b></div><span>{cluster.entries.map(entry => entry.title).join(' · ')}</span><small>track{cluster.entries.length === 1 ? '' : 's'} in this family</small></div>)}</div>
          </article>
        </div>
      )}
    </section>
  );
}
