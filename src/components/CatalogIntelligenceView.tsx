import { useEffect, useMemo, useState } from 'react';
import { analyzeCatalog, analyzeProject, nearestTracks, validEmbedding } from '../catalog-intelligence';
import { trackHref } from '../router';
import { getAdminAlbums, type AdminAlbumSummary } from '../services/album-admin-api';
import { getCatalogTracks } from '../services/catalog-api';
import { getSonicTraceCatalog } from '../services/sonictrace-api';
import type { SonicTraceCatalogEntry, StudioTrack } from '../types/studio';

function settledMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

export function CatalogIntelligenceView() {
  const [entries, setEntries] = useState<SonicTraceCatalogEntry[]>([]);
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [albums, setAlbums] = useState<AdminAlbumSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showMapReadyOnly, setShowMapReadyOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalogNotice, setCatalogNotice] = useState<string | null>(null);
  const [albumNotice, setAlbumNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getSonicTraceCatalog(), getCatalogTracks(), getAdminAlbums()])
      .then(([intelligenceResult, catalogResult, albumsResult]) => {
        if (!active) return;
        if (intelligenceResult.status === 'rejected') {
          setError(settledMessage(intelligenceResult.reason));
          return;
        }
        const value = intelligenceResult.value;
        setEntries(value);
        setSelectedId(current => current || value.find(entry => validEmbedding(entry.embedding))?.trackId || value[0]?.trackId || null);
        setError(null);
        if (catalogResult.status === 'fulfilled') {
          setTracks(catalogResult.value);
          setCatalogNotice(null);
        } else {
          setTracks([]);
          setCatalogNotice(`Track metadata enrichment unavailable: ${settledMessage(catalogResult.reason)}`);
        }
        if (albumsResult.status === 'fulfilled' && Array.isArray(albumsResult.value.albums)) {
          const canonicalAlbums = albumsResult.value.albums;
          setAlbums(canonicalAlbums);
          setSelectedAlbumId(current => current && canonicalAlbums.some(album => album.id === current) ? current : canonicalAlbums[0]?.id || null);
          setAlbumNotice(null);
        } else {
          setAlbums([]);
          setSelectedAlbumId(null);
          setAlbumNotice(albumsResult.status === 'rejected'
            ? `Canonical Album read unavailable: ${settledMessage(albumsResult.reason)}`
            : 'Track Manager returned no canonical Album collection.');
        }
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const selected = entries.find(entry => entry.trackId === selectedId) || null;
  const selectedMapReady = Boolean(selected && validEmbedding(selected.embedding));
  const nearest = useMemo(() => selected ? nearestTracks(selected, entries) : [], [selected, entries]);
  const analysis = useMemo(() => analyzeCatalog(entries), [entries]);
  const embeddedEntries = useMemo(() => entries.filter(entry => validEmbedding(entry.embedding)), [entries]);
  const unmappedEntries = useMemo(() => entries.filter(entry => !validEmbedding(entry.embedding)), [entries]);
  const embedded = embeddedEntries.length;
  const outdated = entries.filter(entry => entry.outdated).length;
  const entryById = useMemo(() => new Map(entries.map(entry => [entry.trackId, entry])), [entries]);
  const trackById = useMemo(() => new Map(tracks.map(track => [track.id, track])), [tracks]);
  const familyIndexById = useMemo(() => new Map(analysis.styleFamilies.groups.map((family, index) => [family.id, index])), [analysis.styleFamilies.groups]);
  const primaryFamilyByTrack = useMemo(() => {
    const result = new Map<string, string>();
    for (const [trackId, assignments] of Object.entries(analysis.styleFamilies.assignments)) {
      const primary = [...assignments].sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))[0];
      if (primary) result.set(trackId, primary.id);
    }
    return result;
  }, [analysis.styleFamilies.assignments]);
  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return entries.filter(entry => {
      if (showMapReadyOnly && !validEmbedding(entry.embedding)) return false;
      return !normalized || entry.title.toLocaleLowerCase().includes(normalized);
    });
  }, [entries, query, showMapReadyOnly]);
  const selectedAlbum = albums.find(album => album.id === selectedAlbumId) || null;
  const project = useMemo(
    () => selectedAlbum ? analyzeProject(selectedAlbum.trackIds, entries, tracks) : null,
    [selectedAlbum, entries, tracks],
  );

  const titleFor = (trackId: string) => entryById.get(trackId)?.title || trackById.get(trackId)?.title || trackId;
  const familyFor = (trackId: string) => {
    const familyId = primaryFamilyByTrack.get(trackId);
    return familyId ? analysis.styleFamilies.groups.find(family => family.id === familyId) || null : null;
  };
  const familyClass = (trackId: string) => {
    const familyId = primaryFamilyByTrack.get(trackId);
    const index = familyId ? familyIndexById.get(familyId) : undefined;
    return `family-${typeof index === 'number' ? index % 8 : 'none'}`;
  };

  if (loading) return <div className="catalog-message panel" role="status" aria-live="polite">Loading canonical Catalog Intelligence…</div>;
  if (error) return <div className="catalog-message catalog-error panel" role="alert"><strong>Catalog Intelligence unavailable</strong><span>{error}</span></div>;

  return (
    <section className="intelligence-view c3b-intelligence">
      <div className="catalog-heading intelligence-heading">
        <div><span className="eyebrow">SONICTRACE / C3-B / CANONICAL V2-E</span><h2>See the shape of your catalog.</h2><p>Canonical 512D profiles now drive a deterministic sonic map, acoustic neighborhoods, Neural genre families and read-only Album / Project intelligence inside Studio.</p></div>
        <details className="intelligence-method"><summary>How this view works</summary><p>Position comes from deterministic projection of persisted 512D CLAP embeddings. Acoustic zones cluster that position. Color/family comes separately from consolidated Neural genre evidence. Album intelligence reads canonical <code>album.trackIds</code> plus the same SonicTrace R2 sidecars. No IndexedDB catalog and no write path is used here.</p></details>
      </div>

      <div className="catalog-kpis intelligence-kpis c3b-kpis" aria-label="Catalog intelligence summary">
        <div><span>ANALYZED</span><strong>{entries.length}</strong><small>Canonical sidecars</small></div>
        <div><span>512D READY</span><strong>{embedded}</strong><small>Map + similarity</small></div>
        <div><span>HIDDEN FROM MAP</span><strong className={unmappedEntries.length ? 'warn' : ''}>{unmappedEntries.length}</strong><small>Missing / invalid 512D</small></div>
        <div><span>ACOUSTIC ZONES</span><strong>{analysis.zones.count}</strong><small>CLAP neighborhoods</small></div>
        <div><span>SONIC FAMILIES</span><strong>{analysis.styleFamilies.count}</strong><small>Neural genres</small></div>
        <div><span>NEEDS UPDATE</span><strong className={outdated ? 'warn' : ''}>{outdated}</strong><small>Source changed</small></div>
      </div>

      {!entries.length ? <div className="catalog-message panel intelligence-empty"><strong>No analysis yet</strong><span>Open a track and choose Analyze with SonicTrace to start building canonical catalog relationships.</span><a className="primary-btn" href="#/catalog">Browse Catalog</a></div> : (
        <>
          <article className="panel sonic-panel c3b-map-panel">
            <div className="intelligence-section-head"><div><span className="eyebrow">CATALOG MAP</span><h3>Position = proximity. Color = family. Zone = neighborhood.</h3><p>The map contains only tracks with a valid finite 512D embedding. An analyzed track can therefore exist in the list without being plotted.</p></div><b>{analysis.projection.length} mapped · {unmappedEntries.length} hidden</b></div>
            <div className="c3b-map-stage" aria-label="Deterministic 2D sonic catalog map">
              <div className="c3b-map-cross c3b-map-cross-x" aria-hidden="true" />
              <div className="c3b-map-cross c3b-map-cross-y" aria-hidden="true" />
              {analysis.zones.groups.map(zone => <div className="c3b-zone-center" key={zone.id} style={{ left: `${zone.center.x * 100}%`, top: `${(1 - zone.center.y) * 100}%` }} aria-hidden="true"><span>{zone.label.replace('Zone acoustique ', '')}</span></div>)}
              {analysis.projection.map(point => {
                const entry = entryById.get(point.trackId);
                if (!entry) return null;
                const zone = analysis.zones.assignments[point.trackId];
                const family = familyFor(point.trackId);
                return <button
                  type="button"
                  key={point.trackId}
                  className={`c3b-map-point ${familyClass(point.trackId)} ${point.trackId === selectedId ? 'active' : ''}`}
                  style={{ left: `${point.x * 100}%`, top: `${(1 - point.y) * 100}%` }}
                  onClick={() => setSelectedId(point.trackId)}
                  aria-pressed={point.trackId === selectedId}
                  title={`${entry.title} · ${analysis.zones.groups[zone]?.label || 'No zone'} · ${family?.label || 'No Neural family'}`}
                ><i aria-hidden="true" /><span>{entry.title}</span><small>{analysis.zones.groups[zone]?.label.replace('Zone acoustique ', 'Zone ') || '—'} · {family?.label || 'Unclassified'}</small></button>;
              })}
            </div>
            <div className="c3b-map-legend">
              <div><strong>Acoustic zones</strong><span>{analysis.zones.groups.map(zone => `${zone.label.replace('Zone acoustique ', '')}: ${zone.trackIds.length}`).join(' · ') || 'Not enough embeddings'}</span></div>
              <div><strong>Sonic families</strong><span>{analysis.styleFamilies.groups.slice(0, 8).map((family, index) => <i className={`c3b-family-key family-${index % 8}`} key={family.id}>{family.label}</i>)}</span></div>
            </div>
            {unmappedEntries.length > 0 && <div className="c3b-unmapped" role="note"><div><strong>Not shown on map</strong><span>{unmappedEntries.length} analyzed track{unmappedEntries.length === 1 ? '' : 's'} cannot be projected until a valid finite 512D embedding is available.</span></div><div>{unmappedEntries.map(entry => <button type="button" key={entry.trackId} onClick={() => setSelectedId(entry.trackId)}><b>{entry.title}</b><small>Missing or invalid 512D embedding</small></button>)}</div></div>}
          </article>

          <div className="intelligence-layout c3b-selection-layout">
            <article className="panel sonic-panel intelligence-index">
              <div className="intelligence-section-head"><div><span className="eyebrow">ANALYZED TRACKS</span><h3>Choose a track</h3></div><b>{filteredEntries.length} / {entries.length}</b></div>
              <label className="intelligence-search"><span>Search analyses</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Track title" /></label>
              <label className="c3b-map-ready-toggle"><input type="checkbox" checked={showMapReadyOnly} onChange={event => setShowMapReadyOnly(event.target.checked)} /><span>Show only map-ready tracks</span><b>{embeddedEntries.length}</b></label>
              <div className="intelligence-track-list" aria-label="Analyzed tracks">{filteredEntries.map(entry => {
                const zone = analysis.zones.assignments[entry.trackId];
                const family = familyFor(entry.trackId);
                const mapReady = validEmbedding(entry.embedding);
                const stateLabel = entry.outdated ? 'Update needed' : mapReady ? '512D ready' : '512D missing';
                return <button type="button" aria-pressed={entry.trackId === selectedId} className={entry.trackId === selectedId ? 'active' : ''} key={entry.trackId} onClick={() => setSelectedId(entry.trackId)}><span><strong>{entry.title}</strong><b className={entry.outdated || !mapReady ? 'warn' : 'ready'}>{stateLabel}</b></span><small>{mapReady ? `${analysis.zones.groups[zone]?.label || 'Mapped'} · ${family?.label || 'No Neural family'}` : 'Not plotted · analysis has no valid finite 512D embedding'}</small></button>;
              })}{!filteredEntries.length && <p className="workspace-muted">No analyzed track matches the current search/filter.</p>}</div>
            </article>

            <article className="panel sonic-panel intelligence-neighbors">
              <div className="intelligence-section-head"><div><span className="eyebrow">CLOSEST SOUND</span><h3>{selected ? `Tracks near ${selected.title}` : 'Choose a track'}</h3><p>{selected ? 'Percentages are cosine proximity in the canonical 512D CLAP embedding space.' : 'Select an analyzed track to reveal its nearest catalog neighbors.'}</p></div>{selected && <a className="ghost-btn" href={trackHref(selected.trackId, 'intelligence')}>Open workspace →</a>}</div>
              {selected && <div className="c3b-selected-context"><span>{selectedMapReady ? analysis.zones.groups[analysis.zones.assignments[selected.trackId]]?.label || 'Mapped' : 'Not on map'}</span><span>{familyFor(selected.trackId)?.label || 'No Neural family'}</span>{!selectedMapReady && <span className="warn">512D missing</span>}</div>}
              <div className="similarity-list">{nearest.map(item => <div key={item.entry.trackId}><div><strong>{item.entry.title}</strong><span>{item.reasons.join(' · ')}</span><i aria-hidden="true"><b style={{ width: `${Math.max(0, Math.min(100, item.similarity))}%` }} /></i></div><b aria-label={`${item.similarity.toFixed(1)} percent similar`}>{item.similarity.toFixed(1)}%</b></div>)}{selected && !nearest.length && (!selectedMapReady ? <div className="intelligence-result-empty c3b-missing-embedding"><strong>512D embedding unavailable</strong><p>This analyzed track is not plotted and cannot be compared by proximity until it has a valid finite 512D embedding.</p></div> : <div className="intelligence-result-empty"><strong>No comparable neighbor yet</strong><p>At least one other valid 512D embedding is required for a proximity comparison.</p></div>)}</div>
            </article>
          </div>

          <article className="panel sonic-panel c3b-insights-panel">
            <div className="intelligence-section-head"><div><span className="eyebrow">CATALOG SIGNALS</span><h3>Redundancy, outliers and bridges</h3><p>These are advisory relationships derived from embedding proximity and acoustic-zone membership. They do not alter catalog metadata.</p></div></div>
            <div className="c3b-insight-grid">
              <section><span>REDUNDANT PAIRS</span><strong>{analysis.insights.redundantPairs.length}</strong>{analysis.insights.redundantPairs.length ? <ul>{analysis.insights.redundantPairs.slice(0, 5).map(pair => <li key={`${pair.a}:${pair.b}`}><b>{titleFor(pair.a)}</b><em>↔</em><b>{titleFor(pair.b)}</b><small>{pair.percent}%</small></li>)}</ul> : <p>No pair crosses the 92% proximity threshold.</p>}</section>
              <section><span>OUTLIERS</span><strong>{analysis.insights.outliers.length}</strong>{analysis.insights.outliers.length ? <ul>{analysis.insights.outliers.slice(0, 5).map(item => <li key={item.trackId}><b>{titleFor(item.trackId)}</b><small>{item.neighborhoodPercent}% neighborhood fit</small></li>)}</ul> : <p>No strong catalog outlier detected with current coverage.</p>}</section>
              <section><span>BRIDGES</span><strong>{analysis.insights.bridges.length}</strong>{analysis.insights.bridges.length ? <ul>{analysis.insights.bridges.slice(0, 5).map(item => <li key={item.trackId}><b>{titleFor(item.trackId)}</b><small>{item.bridgePercent}% across {item.zoneCount} zones</small></li>)}</ul> : <p>No track currently meets the cross-zone bridge threshold.</p>}</section>
            </div>
          </article>

          <article className="panel sonic-panel intelligence-clusters c3b-family-panel">
            <div className="intelligence-section-head"><div><span className="eyebrow">SONIC FAMILIES</span><h3>Neural genre identity — separate from acoustic zones</h3><p>A track may contribute to more than one family. These labels come from consolidated Neural genre evidence, not from K-means.</p></div><b>{analysis.styleFamilies.count}</b></div>
            <div className="cluster-grid c3b-family-grid">{analysis.styleFamilies.groups.map((family, index) => <div className={`c3b-family-card family-${index % 8}`} key={family.id}><div><strong>{family.label}</strong><b>{family.count}</b></div><small>{family.topLabels.join(' · ') || 'Neural genre evidence'}</small><span>{family.trackIds.slice(0, 6).map(titleFor).join(' · ')}{family.trackIds.length > 6 ? ` · +${family.trackIds.length - 6}` : ''}</span></div>)}</div>
          </article>

          <article className="panel sonic-panel c3b-project-panel">
            <div className="intelligence-section-head"><div><span className="eyebrow">ALBUM / PROJECT INTELLIGENCE</span><h3>Read the canonical release as a sonic project</h3><p>Canonical <code>album.trackIds</code> defines membership and artistic order. The sequence below is a recommendation only and is never written back automatically.</p></div><label className="c3b-project-select"><span>Canonical Album</span><select value={selectedAlbumId || ''} onChange={event => setSelectedAlbumId(event.target.value || null)} disabled={!albums.length}>{albums.map(album => <option value={album.id} key={album.id}>{album.title} · {album.trackIds.length} tracks</option>)}</select></label></div>
            {albumNotice && <div className="sonic-alert warn">{albumNotice}</div>}
            {catalogNotice && <div className="sonic-alert warn">{catalogNotice} Project sequencing falls back to embedding/Neural evidence only.</div>}
            {selectedAlbum && project ? <>
              <div className="c3b-project-stats"><div><span>CANONICAL TRACKS</span><strong>{project.totalTracks}</strong><small>album.trackIds authority</small></div><div><span>EMBEDDING COVERAGE</span><strong>{project.coveragePercent}%</strong><small>{project.embeddingTracks} / {project.totalTracks} ready</small></div><div><span>COHERENCE</span><strong>{project.coherencePercent == null ? '—' : `${project.coherencePercent}%`}</strong><small>Mean project proximity</small></div><div><span>BRIDGE CANDIDATE</span><strong>{project.bridge ? titleFor(project.bridge.trackId) : '—'}</strong><small>{project.bridge ? `${project.bridge.percent}% connectivity` : 'Need broader coverage'}</small></div></div>
              <div className="c3b-project-summary">{project.summary.map(item => <p key={item}>{item}</p>)}</div>
              {project.missingTrackIds.length > 0 && <div className="sonic-alert warn">Missing valid 512D coverage: {project.missingTrackIds.map(titleFor).join(' · ')}</div>}
              {project.outliers.length > 0 && <div className="c3b-project-outliers"><span>Project outliers</span>{project.outliers.map(item => <b key={item.trackId}>{titleFor(item.trackId)} · {item.percent}%</b>)}</div>}
              <div className="c3b-sequence-head"><div><span className="eyebrow">ADVISORY SEQUENCE</span><h4>Continuity proposal</h4></div><strong>READ ONLY · canonical order unchanged</strong></div>
              <ol className="c3b-sequence">{project.proposedSequence.map((item, index) => <li key={item.trackId}><b>{String(index + 1).padStart(2, '0')}</b><div><strong>{titleFor(item.trackId)}</strong><span>{item.role} · canonical #{item.originalIndex + 1}{item.originalIndex === index ? ' · same position' : ` → suggested #${index + 1}`}</span><small>{item.transition.join(' · ')}</small></div></li>)}</ol>
              <p className="workspace-footnote">Advisory only. Studio performs no Album membership/order mutation from Catalog Intelligence; use Albums / Projects manually if you ever choose to adopt a recommendation.</p>
            </> : !albumNotice && <div className="intelligence-result-empty"><strong>No canonical Album selected</strong><p>Canonical Album intelligence requires the protected Track Manager Album read model.</p></div>}
          </article>
        </>
      )}
    </section>
  );
}