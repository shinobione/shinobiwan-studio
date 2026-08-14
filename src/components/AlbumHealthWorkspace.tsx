import { useEffect, useMemo, useState } from 'react';
import { buildCatalogAlbumHealth, type AlbumHealth } from '../album-health';
import { trackHref } from '../router';
import { getAdminAlbums, type AdminAlbumSummary } from '../services/album-admin-api';
import { getCatalogTracks } from '../services/catalog-api';
import type { StudioTrack } from '../types/studio';
import '../phase8-album-health.css';
import { AlbumsWorkspace } from './AlbumsWorkspace';

function messageOf(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

function scrollToAlbumsEditor() {
  globalThis.document?.querySelector('.c3-albums-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function HealthState({ album }: { album: AlbumHealth }) {
  if (album.state === 'healthy') return <span className="phase8-album-state healthy">HEALTHY</span>;
  if (album.state === 'unverified') return <span className="phase8-album-state unverified">UNVERIFIED</span>;
  return <span className="phase8-album-state attention">{album.issueCount} ISSUE{album.issueCount === 1 ? '' : 'S'}</span>;
}

function AlbumHealthCard({ album }: { album: AlbumHealth }) {
  const clear = album.issueCount === 0 && album.crossModelVerified;
  return <article className={`panel phase8-album-card ${album.state}`}>
    <div className="phase8-album-card-head">
      <div><strong>{album.albumTitle}</strong><small><code>{album.albumId}</code> · {album.canonicalTrackCount} canonical track{album.canonicalTrackCount === 1 ? '' : 's'}</small></div>
      <HealthState album={album} />
    </div>

    {clear && <p className="phase8-album-clear">Canonical cover, membership references, member production state and compatibility cache all cross-check cleanly. ✓</p>}
    {!album.crossModelVerified && <div className="phase8-album-unverified"><strong>Cross-model checks unverified</strong><span>Studio did not receive the protected private Track catalog. Missing references, member production gaps and track-side cache drift are intentionally not inferred from the public fallback.</span></div>}

    <div className="phase8-album-issues">
      {album.coverMissing && <div><b>Cover missing</b><span>The canonical Album has no required cover artwork.</span></div>}
      {album.emptyTracklist && <div><b>Tracklist empty</b><span><code>album.trackIds</code> currently owns no Track.</span></div>}
      {album.missingTrackIds.length > 0 && <div><b>Broken membership references</b><span>{album.missingTrackIds.join(' · ')}</span></div>}
      {album.cacheDriftTrackIds.length > 0 && <div><b>Compatibility-cache drift</b><span>{album.cacheDriftTrackIds.join(' · ')}</span><small><code>album.trackIds</code> remains authoritative; <code>track.album</code> is only a compatibility cache.</small></div>}
    </div>

    {album.productionGapActions.length > 0 && <div className="phase8-album-member-gaps">
      <strong>Members with production gaps</strong>
      <div>{album.productionGapActions.map(action => <a key={action.trackId} href={trackHref(action.trackId, action.section)}><span>{action.trackTitle}</span><b>{action.label} →</b></a>)}</div>
    </div>}

    {(album.coverMissing || album.emptyTracklist || album.missingTrackIds.length > 0 || album.cacheDriftTrackIds.length > 0) && <button className="ghost-btn compact" type="button" onClick={scrollToAlbumsEditor}>Review in Albums editor ↓</button>}
  </article>;
}

function AlbumHealthOverview() {
  const [albums, setAlbums] = useState<AdminAlbumSummary[]>([]);
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminAlbums(), getCatalogTracks()])
      .then(([albumPayload, catalogTracks]) => {
        if (!active) return;
        setAlbums(albumPayload.albums || []);
        setTracks(catalogTracks);
        setError(null);
      })
      .catch(reason => active && setError(messageOf(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const health = useMemo(() => buildCatalogAlbumHealth(albums, tracks), [albums, tracks]);

  return <section className="phase8-album-health" aria-label="Canonical Album health">
    <div className="catalog-heading phase8-album-heading">
      <div><span className="eyebrow">PHASE 8 / ALBUM HEALTH</span><h2>Release integrity, without a second Album authority.</h2><p>Studio cross-checks canonical <code>album.trackIds</code>, required cover state, accepted Track production truth and the track-side compatibility cache. Sonic/project intelligence stays in Intelligence; all writes stay in the existing Albums editor.</p></div>
    </div>

    {loading && <div className="catalog-message panel">Reading canonical Album health…</div>}
    {!loading && error && <div className="album-error panel"><strong>Album Health unavailable</strong><span>{error}</span></div>}
    {!loading && !error && <>
      <div className="catalog-kpis phase8-album-kpis" aria-label="Album health summary">
        <div><span>CANONICAL RELEASES</span><strong>{health.totalAlbums}</strong><small>Album / EP / Collection manifests</small></div>
        <div><span>HEALTHY</span><strong>{health.healthyAlbums}</strong><small>Verified with no current issue</small></div>
        <div><span>NEEDS ATTENTION</span><strong className={health.attentionAlbums ? 'warn' : ''}>{health.attentionAlbums}</strong><small>Manifest or verified member issue</small></div>
        <div><span>CROSS-CHECK UNVERIFIED</span><strong className={health.unverifiedAlbums ? 'warn' : ''}>{health.unverifiedAlbums}</strong><small>Private Track truth unavailable</small></div>
      </div>

      {!health.crossModelVerified && health.totalAlbums > 0 && <div className="panel phase8-album-trust-warning"><strong>Private Track truth unavailable</strong><span>Album manifests are still canonical, but Studio refuses to call Track references broken or caches stale from a public-only fallback.</span></div>}
      {health.totalAlbums > 0 && <div className="phase8-album-grid">{health.albums.map(album => <AlbumHealthCard album={album} key={album.albumId} />)}</div>}
      {health.totalAlbums === 0 && <div className="panel phase8-album-empty"><strong>No canonical Album / EP exists yet.</strong><span>Album Health has nothing to cross-check.</span></div>}
    </>}
  </section>;
}

export function AlbumHealthWorkspace() {
  return <>
    <AlbumHealthOverview />
    <AlbumsWorkspace />
  </>;
}
