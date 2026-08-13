import { useEffect, useMemo, useState } from 'react';
import { buildCatalogWorkflow, type TrackWorkflowState } from '../phase7-workflow';
import { trackHref } from '../router';
import { getCatalogTracks } from '../services/catalog-api';
import { studioConfig } from '../services/config';
import type { StudioTrack } from '../types/studio';
import { TrackCreatePanel } from './TrackCreatePanel';

type ProductionFilter = 'to-finish' | 'ready' | 'released' | 'all';
type SortMode = 'newest' | 'title' | 'album';

let catalogCache: StudioTrack[] | null = null;
let catalogRequest: Promise<StudioTrack[]> | null = null;

function requestCatalog(force = false): Promise<StudioTrack[]> {
  if (!force && catalogCache) return Promise.resolve(catalogCache);
  if (!force && catalogRequest) return catalogRequest;
  const request = getCatalogTracks().then(items => {
    catalogCache = items;
    return items;
  });
  catalogRequest = request.finally(() => {
    if (catalogRequest === request || catalogRequest) catalogRequest = null;
  });
  return catalogRequest;
}

// Tracks is imported with the Studio shell, so begin the canonical read in the
// background before the user opens it. Re-visits use the in-memory snapshot.
void requestCatalog().catch(() => {});

function safeDate(value: string | null): number {
  const parsed = value ? Date.parse(value) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function releaseLabel(track: StudioTrack): string {
  if (track.releaseDate) {
    const parsed = Date.parse(track.releaseDate);
    if (Number.isFinite(parsed)) {
      return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(parsed);
    }
  }
  return track.year ? String(track.year) : 'Date unknown';
}

function artworkUrl(track: StudioTrack): string | null {
  return track.assets.thumbnail?.url || track.assets.cover?.url || null;
}

function productionMatches(track: StudioTrack, workflow: TrackWorkflowState, filter: ProductionFilter): boolean {
  if (filter === 'released') return track.status === 'published' && track.publishing.catalogVisible;
  if (filter === 'ready') return workflow.ready;
  if (filter === 'to-finish') return !workflow.ready;
  return true;
}

function CatalogLoadingState() {
  return (
    <div className="catalog-loading" role="status" aria-live="polite">
      <div className="catalog-loading-status panel">
        <span className="catalog-loading-orb" aria-hidden="true" />
        <div><strong>Loading tracks</strong><span>Getting your production library ready…</span></div>
      </div>
      <div className="catalog-skeleton-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="catalog-skeleton-card panel" key={index}>
            <div className="catalog-skeleton-artwork" />
            <div className="catalog-skeleton-body"><i /><i /><span><b /><b /><b /></span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CatalogView() {
  const [tracks, setTracks] = useState<StudioTrack[]>(() => catalogCache || []);
  const [loading, setLoading] = useState(() => !catalogCache);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [album, setAlbum] = useState('all');
  const [productionFilter, setProductionFilter] = useState<ProductionFilter>('to-finish');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [showCreate, setShowCreate] = useState(false);

  async function loadCatalog(force = false) {
    const hasSnapshot = Boolean(catalogCache?.length || tracks.length);
    const hadPrivateRead = tracks.some(track => track.readSource === 'private');
    if (hasSnapshot) setRefreshing(true);
    else setLoading(true);
    try {
      const items = await requestCatalog(force);
      const nextPrivateRead = items.some(track => track.readSource === 'private');
      setTracks(items);
      if (!nextPrivateRead && (productionFilter === 'to-finish' || productionFilter === 'ready')) setProductionFilter('released');
      else if (!hadPrivateRead && nextPrivateRead) setProductionFilter('to-finish');
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { void loadCatalog(); }, []);

  const albums = useMemo(() => {
    const unique = new Map<string, string>();
    tracks.forEach(track => unique.set(track.album.id, track.album.title));
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }));
  }, [tracks]);

  const workflows = useMemo(() => buildCatalogWorkflow(tracks), [tracks]);
  const workflowById = useMemo(() => new Map(workflows.map(item => [item.track.id, item])), [workflows]);
  const privateRead = tracks.some(track => track.readSource === 'private');

  const counts = useMemo(() => {
    let toFinish = 0;
    let ready = 0;
    let released = 0;
    for (const track of tracks) {
      const workflow = workflowById.get(track.id);
      if (!workflow) continue;
      if (workflow.ready) ready += 1;
      else toFinish += 1;
      if (track.status === 'published' && track.publishing.catalogVisible) released += 1;
    }
    return { toFinish, ready, released };
  }, [tracks, workflowById]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tracks
      .filter(track => album === 'all' || track.album.id === album)
      .filter(track => {
        const workflow = workflowById.get(track.id);
        return workflow ? productionMatches(track, workflow, productionFilter) : false;
      })
      .filter(track => {
        if (!normalizedQuery) return true;
        const haystack = [track.title, track.album.title, ...track.genres, ...track.tags, ...track.moods, ...track.themes, ...track.languages].join(' ').toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortMode === 'title') return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
        if (sortMode === 'album') return a.album.title.localeCompare(b.album.title, 'en', { sensitivity: 'base' }) || a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
        return safeDate(b.releaseDate) - safeDate(a.releaseDate) || (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
      });
  }, [album, productionFilter, query, sortMode, tracks, workflowById]);

  return (
    <section className="catalog-surface">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">TRACKS / PRODUCTION LIBRARY</span>
          <h2>Pick up a track. Finish the next thing.</h2>
          <p>{privateRead
            ? 'Production attention and publication are separate: a released track can still have useful work left.'
            : 'Tracks are available read-only. Sign in through Track Manager when you need to create or edit.'}</p>
        </div>
        <button className="primary-btn catalog-new-track" type="button" disabled={loading} onClick={() => setShowCreate(true)}>+ New Track</button>
      </div>

      {showCreate && <TrackCreatePanel privateRead={privateRead} onCancel={() => setShowCreate(false)} onCreated={async () => { await loadCatalog(true); setShowCreate(false); }} />}

      {!loading && !error && tracks.length > 0 && !privateRead && (
        <div className="catalog-private-read-notice panel" role="status">
          <div><span className="eyebrow">PRIVATE TRACKS HIDDEN</span><strong>Studio is showing the LaunchPAD public catalog only.</strong><p>Drafts and the complete private production workflow are not visible in this fallback. Nothing has been deleted: restore Track Manager private read to see accurate Needs attention / Production complete counts for the whole library.</p></div>
          <div className="catalog-private-read-actions"><a className="ghost-btn" href={studioConfig.trackManagerUrl} target="_blank" rel="noopener noreferrer">Open Track Manager ↗</a><button className="ghost-btn" type="button" disabled={refreshing} onClick={() => void loadCatalog(true)}>{refreshing ? 'Checking…' : 'Retry private read'}</button></div>
        </div>
      )}

      <div className="catalog-production-filters panel" aria-label="Production and publication filters">
        <button type="button" disabled={!privateRead} title={!privateRead ? 'Private read required to count production attention across the complete library.' : undefined} className={productionFilter === 'to-finish' ? 'active' : ''} aria-pressed={productionFilter === 'to-finish'} onClick={() => setProductionFilter('to-finish')}><strong>{privateRead ? counts.toFinish : '—'}</strong><span>Needs attention</span></button>
        <button type="button" disabled={!privateRead} title={!privateRead ? 'Private read required to count production-complete tracks across the complete library.' : undefined} className={productionFilter === 'ready' ? 'active' : ''} aria-pressed={productionFilter === 'ready'} onClick={() => setProductionFilter('ready')}><strong>{privateRead ? counts.ready : '—'}</strong><span>Production complete</span></button>
        <button type="button" className={productionFilter === 'released' ? 'active' : ''} aria-pressed={productionFilter === 'released'} onClick={() => setProductionFilter('released')}><strong>{counts.released}</strong><span>Published</span></button>
        <button type="button" className={productionFilter === 'all' ? 'active' : ''} aria-pressed={productionFilter === 'all'} onClick={() => setProductionFilter('all')}><strong>{tracks.length}</strong><span>All</span></button>
      </div>

      <div className="catalog-toolbar panel">
        <label className="catalog-search"><span>Search</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, album, genre, mood…" /></label>
        <label><span>Album</span><select value={album} onChange={event => setAlbum(event.target.value)}><option value="all">All albums</option>{albums.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
        <label><span>Sort</span><select value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)}><option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="album">Album A–Z</option></select></label>
      </div>

      {loading && <CatalogLoadingState />}
      {!loading && error && <div className="catalog-message catalog-error panel"><strong>Tracks unavailable</strong><span>{error}</span></div>}

      {!loading && !error && (
        <>
          <div className="catalog-resultline">
            <span>{filtered.length} shown{refreshing ? ' · refreshing…' : ''}{!privateRead ? ' · public read-only fallback' : ''}</span>
            {(query || album !== 'all') && <button type="button" onClick={() => { setQuery(''); setAlbum('all'); }}>Clear search</button>}
          </div>

          {filtered.length === 0 ? <div className="catalog-message panel">Nothing here right now. Try another production filter.</div> : (
            <div className="catalog-grid">
              {filtered.map(track => {
                const artwork = artworkUrl(track);
                const workflow = workflowById.get(track.id);
                if (!workflow) return null;
                const lyricsState = workflow.stages.find(stage => stage.id === 'lyrics')?.state || 'attention';
                const releaseState = workflow.stages.find(stage => stage.id === 'release')?.state || 'attention';
                const nextHref = trackHref(track.id, workflow.nextAction.section);
                const nextLabel = track.status === 'published' ? 'Open track →' : workflow.ready ? 'Review release →' : 'Continue →';
                const nextDetail = track.status === 'published'
                  ? (workflow.stages.find(stage => stage.id === 'release')?.detail || 'Released')
                  : workflow.nextAction.detail;

                return (
                  <article className="catalog-card panel" key={track.id}>
                    <div className="catalog-artwork">
                      {artwork ? <img src={artwork} alt="" loading="lazy" /> : <span>{track.title.slice(0, 2).toUpperCase()}</span>}
                      <div className="catalog-status">{track.status}</div>
                    </div>
                    <div className="catalog-card-body">
                      <div className="catalog-card-title"><div><strong>{track.title}</strong><span>{track.album.title}</span></div><small>{releaseLabel(track)}</small></div>

                      <div className="catalog-production-state" aria-label={`Production state for ${track.title}`}>
                        <span className={track.assets.audio ? 'state-ready' : 'state-attention'}>Audio</span>
                        <span className={track.assets.cover ? 'state-ready' : 'state-attention'}>Cover</span>
                        <span className={`state-${lyricsState}`}>Lyrics</span>
                        <span className={track.assets.video ? 'state-ready' : 'state-optional'}>Canvas</span>
                        <span className={`state-${releaseState}`}>Release</span>
                      </div>

                      <div className="catalog-next-action">
                        <div><span>Next</span><strong>{workflow.ready && track.status !== 'published' ? 'Release ready' : workflow.nextAction.label}</strong><small>{nextDetail}</small></div>
                        <a className="catalog-continue-btn" href={nextHref}>{nextLabel}</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
