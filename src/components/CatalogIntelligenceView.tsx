import { useEffect, useMemo, useState } from 'react';
import { clusterTracks, nearestTracks } from '../catalog-intelligence';
import { trackHref } from '../router';
import { getSonicTraceCatalog } from '../services/sonictrace-api';
import type { SonicTraceCatalogEntry } from '../types/studio';

export function CatalogIntelligenceView() {
  const [entries, setEntries] = useState<SonicTraceCatalogEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  if (loading) return <div className="catalog-message panel">Loading SonicTrace catalog intelligence…</div>;
  if (error) return <div className="catalog-message catalog-error panel"><strong>Catalog Intelligence unavailable</strong><span>{error}</span></div>;

  return (
    <section className="intelligence-view">
      <div className="catalog-heading"><div><span className="eyebrow">SONICTRACE / V2-E</span><h2>Catalog Intelligence</h2><p>Canonical R2 analyses indexed by the shared trackId. Similarity uses persisted 512D CLAP embeddings; no audio is stored here.</p></div></div>
      <div className="catalog-kpis intelligence-kpis"><div><span>ANALYSES</span><strong>{entries.length}</strong></div><div><span>512D INDEX</span><strong>{embedded}</strong></div><div><span>CLUSTERS</span><strong>{clusters.length}</strong></div><div><span>OUTDATED</span><strong>{entries.filter(entry => entry.outdated).length}</strong></div></div>
      {!entries.length ? <div className="catalog-message panel">No persisted SonicTrace analysis yet. Open a Track Workspace and run Analyze with SonicTrace.</div> : (
        <div className="intelligence-layout">
          <article className="panel sonic-panel">
            <span className="eyebrow">INDEX / TRACKS</span><h3>Analyzed catalog</h3>
            <div className="intelligence-track-list">{entries.map(entry => <button type="button" className={entry.trackId === selectedId ? 'active' : ''} key={entry.trackId} onClick={() => setSelectedId(entry.trackId)}><span>{entry.title}</span><small>{entry.embedding ? '512D' : 'no embedding'} · {entry.outdated ? 'outdated' : 'current'}</small></button>)}</div>
          </article>
          <article className="panel sonic-panel">
            <span className="eyebrow">SIMILARITY / NEIGHBORS</span><h3>{selected?.title || 'Select a track'}</h3>
            {selected && <a className="ghost-btn" href={trackHref(selected.trackId, 'intelligence')}>Open workspace →</a>}
            <div className="similarity-list">{nearest.map(item => <div key={item.entry.trackId}><div><strong>{item.entry.title}</strong><span>{item.reasons.join(' · ')}</span></div><b>{item.similarity.toFixed(1)}%</b></div>)}{selected && !nearest.length && <p className="workspace-muted">At least two valid 512D embeddings are required for neighbors.</p>}</div>
          </article>
          <article className="panel sonic-panel intelligence-clusters">
            <span className="eyebrow">CLUSTERS / DETERMINISTIC</span><h3>Sonic families</h3>
            <div className="cluster-grid">{clusters.map(cluster => <div key={cluster.id}><strong>{cluster.label}</strong><span>{cluster.entries.map(entry => entry.title).join(' · ')}</span><small>{cluster.entries.length} track{cluster.entries.length === 1 ? '' : 's'}</small></div>)}</div>
          </article>
        </div>
      )}
    </section>
  );
}
