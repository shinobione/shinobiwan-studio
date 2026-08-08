import { useEffect, useMemo, useState } from 'react';
import { trackHref } from '../router';
import { getCatalogTracks } from '../services/catalog-api';
import type { StudioTrack } from '../types/studio';
import { TrackCreatePanel } from './TrackCreatePanel';

type ContentFilter = 'all' | 'missing-lyrics' | 'missing-video' | 'timestamped' | 'core-complete';
type SortMode = 'newest' | 'title' | 'album';

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

function contentMatches(track: StudioTrack, filter: ContentFilter): boolean {
  if (filter === 'missing-lyrics') return !track.assets.lyricsTxt;
  if (filter === 'missing-video') return !track.assets.video;
  if (filter === 'timestamped') return track.timestampsAvailable;
  if (filter === 'core-complete') return Boolean(track.assets.audio && track.assets.cover && track.assets.lyricsTxt);
  return true;
}

export function CatalogView() {
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [album, setAlbum] = useState('all');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  async function loadCatalog() {
    setLoading(true);
    try {
      const items = await getCatalogTracks();
      setTracks(items);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCatalog(); }, []);

  const albums = useMemo(() => {
    const unique = new Map<string, string>();
    tracks.forEach(track => unique.set(track.album.id, track.album.title));
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }));
  }, [tracks]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tracks
      .filter(track => album === 'all' || track.album.id === album)
      .filter(track => contentMatches(track, contentFilter))
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
  }, [album, contentFilter, query, sortMode, tracks]);

  const syncedCount = tracks.filter(track => track.timestampsAvailable).length;
  const privateRead = tracks.some(track => track.readSource === 'private');
  const draftCount = tracks.filter(track => track.status === 'draft').length;

  return (
    <section className="catalog-surface">
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">{privateRead ? 'CATALOG / PRIVATE CANONICAL' : 'CATALOG / PUBLIC FALLBACK'}</span>
          <h2>One catalog. Every track.</h2>
          <p>{privateRead
            ? `Track Manager v5.14 / bridge v1.6 is the canonical admin backend. Draft creation, metadata, lyrics, assets, SonicTrace sidecars and catalog operations are scoped through Studio.${draftCount ? ` ${draftCount} draft${draftCount === 1 ? '' : 's'} currently included.` : ''}`
            : 'Cloudflare Access private read is unavailable in this browser session, so Studio is safely using the proven LaunchPAD public read-only catalog. All mutations remain locked.'}</p>
        </div>
        <div className="catalog-kpis" aria-label="Catalog summary">
          <div><strong>{tracks.length}</strong><span>tracks</span></div>
          <div><strong>{albums.length}</strong><span>albums</span></div>
          <div><strong>{syncedCount}</strong><span>timestamped</span></div>
        </div>
      </div>

      <TrackCreatePanel privateRead={privateRead} onCreated={loadCatalog} />

      <div className="catalog-toolbar panel">
        <label className="catalog-search"><span>Search</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Title, album, genre, mood…" /></label>
        <label><span>Album</span><select value={album} onChange={event => setAlbum(event.target.value)}><option value="all">All albums</option>{albums.map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label>
        <label><span>Content</span><select value={contentFilter} onChange={event => setContentFilter(event.target.value as ContentFilter)}><option value="all">All content</option><option value="core-complete">Core complete</option><option value="timestamped">Timestamped lyrics</option><option value="missing-lyrics">Missing lyrics</option><option value="missing-video">Missing video</option></select></label>
        <label><span>Sort</span><select value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)}><option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="album">Album A–Z</option></select></label>
      </div>

      {loading && <div className="catalog-message panel">Loading canonical catalog…</div>}
      {!loading && error && <div className="catalog-message catalog-error panel"><strong>Catalog unavailable</strong><span>{error}</span></div>}

      {!loading && !error && (
        <>
          <div className="catalog-resultline">
            <span>{filtered.length} of {tracks.length} tracks · {privateRead ? 'private canonical' : 'public fallback'}</span>
            {(query || album !== 'all' || contentFilter !== 'all') && <button type="button" onClick={() => { setQuery(''); setAlbum('all'); setContentFilter('all'); }}>Clear filters</button>}
          </div>

          {filtered.length === 0 ? <div className="catalog-message panel">No track matches the current filters.</div> : (
            <div className="catalog-grid">
              {filtered.map(track => {
                const artwork = artworkUrl(track);
                return (
                  <a className="catalog-card panel" key={track.id} href={trackHref(track.id)}>
                    <div className="catalog-artwork">
                      {artwork ? <img src={artwork} alt="" loading="lazy" /> : <span>{track.title.slice(0, 2).toUpperCase()}</span>}
                      <div className="catalog-status">{track.status}</div>
                    </div>
                    <div className="catalog-card-body">
                      <div className="catalog-card-title"><div><strong>{track.title}</strong><span>{track.album.title}</span></div><small>{releaseLabel(track)}</small></div>
                      <div className="catalog-tags">{(track.genres.length ? track.genres : ['Unclassified']).slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
                      <div className="catalog-assets">
                        <span className={track.assets.audio ? 'present' : 'missing'}>Audio</span>
                        <span className={track.assets.cover ? 'present' : 'missing'}>Cover</span>
                        <span className={track.assets.lyricsTxt ? 'present' : 'missing'}>Lyrics</span>
                        <span className={track.assets.video ? 'present' : 'missing'}>Video</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
