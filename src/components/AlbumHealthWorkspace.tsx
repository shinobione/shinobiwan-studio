import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { buildCatalogAlbumHealth, type AlbumHealth } from '../album-health';
import { trackHref } from '../router';
import { getAdminAlbums, type AdminAlbumSummary } from '../services/album-admin-api';
import { getCatalogTracks } from '../services/catalog-api';
import { getPublicAlbumVisuals, type PublicAlbumVisual } from '../services/public-albums-api';
import type { StudioTrack } from '../types/studio';
import '../phase8-album-health.css';
import { AlbumsWorkspace } from './AlbumsWorkspace';

const DEFAULT_ACCENT = '#4de1e2';
const DEFAULT_ACCENT_2 = '#8f58ff';
const PRIMARY_MEMBER_ACTIONS = 3;

function messageOf(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

function scrollToAlbumsEditor() {
  globalThis.document?.querySelector('.c3-albums-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function visualUrl(visual?: PublicAlbumVisual | null) {
  return visual?.thumbnail || visual?.cover || visual?.fullCover || null;
}

function HealthState({ album }: { album: AlbumHealth }) {
  if (album.state === 'healthy') return <span className="phase8-album-state healthy">HEALTHY</span>;
  if (album.state === 'unverified') return <span className="phase8-album-state unverified">UNVERIFIED</span>;
  return <span className="phase8-album-state attention">{album.issueCount} ISSUE{album.issueCount === 1 ? '' : 'S'}</span>;
}

function AlbumArtwork({ album, source, visual }: { album: AlbumHealth; source?: AdminAlbumSummary; visual?: PublicAlbumVisual | null }) {
  const url = visualUrl(visual);
  return <div className="phase8-album-art" aria-hidden="true">
    {url ? <img src={url} alt="" loading="lazy" /> : <span>{album.albumTitle.slice(0, 2).toUpperCase()}</span>}
    <i style={{ background: source?.accent || DEFAULT_ACCENT }} />
    <i style={{ background: source?.accent2 || DEFAULT_ACCENT_2 }} />
  </div>;
}

function IssueChip({ children, tone = 'attention' }: { children: React.ReactNode; tone?: 'attention' | 'neutral' }) {
  return <span className={`phase8-album-issue-chip ${tone}`}>{children}</span>;
}

function TrackAction({ action }: { action: AlbumHealth['productionGapActions'][number] }) {
  return <a className="phase8-album-track-action" href={trackHref(action.trackId, action.section)}>
    <span>{action.trackTitle}</span>
    <b>{action.label} →</b>
  </a>;
}

function CacheDriftAction({ trackId, track }: { trackId: string; track?: StudioTrack }) {
  return <a className="phase8-album-track-action" href={trackHref(trackId, 'metadata')}>
    <span>{track?.title || trackId}</span>
    <b>Review track metadata →</b>
  </a>;
}

function AlbumHealthCard({ album, source, visual, tracksById }: {
  album: AlbumHealth;
  source?: AdminAlbumSummary;
  visual?: PublicAlbumVisual | null;
  tracksById: Map<string, StudioTrack>;
}) {
  const clear = album.issueCount === 0 && album.crossModelVerified;
  const albumStructuralIssue = album.coverMissing || album.emptyTracklist || album.missingTrackIds.length > 0;
  const hasIssueChips = albumStructuralIssue || album.cacheDriftTrackIds.length > 0;
  const primaryActions = album.productionGapActions.slice(0, PRIMARY_MEMBER_ACTIONS);
  const extraActions = album.productionGapActions.slice(PRIMARY_MEMBER_ACTIONS);
  const style = {
    '--album-accent': source?.accent || DEFAULT_ACCENT,
    '--album-accent-2': source?.accent2 || DEFAULT_ACCENT_2,
  } as CSSProperties;

  return <article className={`panel phase8-album-card ${album.state}`} style={style}>
    <div className="phase8-album-card-glow" aria-hidden="true" />
    <header className="phase8-album-card-head">
      <AlbumArtwork album={album} source={source} visual={visual} />
      <div className="phase8-album-card-title">
        <div className="phase8-album-meta-row">
          <span>{(source?.type || 'album').toUpperCase()}</span>
          <span>{(source?.status || 'draft').toUpperCase()}</span>
          <span>{album.canonicalTrackCount} TRACK{album.canonicalTrackCount === 1 ? '' : 'S'}</span>
        </div>
        <h3>{album.albumTitle}</h3>
        <code>{album.albumId}</code>
      </div>
      <HealthState album={album} />
    </header>

    {clear && <div className="phase8-album-clear"><b>Release integrity verified</b><span>Cover, membership, Track production state and compatibility metadata cross-check cleanly.</span></div>}

    {!album.crossModelVerified && <div className="phase8-album-unverified"><b>Cross-model checks unverified</b><span>Private Track truth is unavailable. Studio refuses to infer broken references, production gaps or Track metadata mismatches from public fallback data.</span></div>}

    {hasIssueChips && <div className="phase8-album-issue-strip" aria-label="Album integrity issues">
      {album.coverMissing && <IssueChip>Cover missing</IssueChip>}
      {album.emptyTracklist && <IssueChip>Tracklist empty</IssueChip>}
      {album.missingTrackIds.length > 0 && <IssueChip>{album.missingTrackIds.length} broken member ref{album.missingTrackIds.length === 1 ? '' : 's'}</IssueChip>}
      {album.cacheDriftTrackIds.length > 0 && <IssueChip>{album.cacheDriftTrackIds.length} Track metadata mismatch{album.cacheDriftTrackIds.length === 1 ? '' : 'es'}</IssueChip>}
    </div>}

    {album.missingTrackIds.length > 0 && <div className="phase8-album-detail-line"><b>Broken membership</b><span>{album.missingTrackIds.join(' · ')}</span></div>}

    {album.cacheDriftTrackIds.length > 0 && <section className="phase8-album-member-gaps">
      <div className="phase8-album-member-gaps-head">
        <div>
          <strong>Track metadata out of sync</strong>
          <span>Canonical Album membership is already authoritative. The Track-side Album reference does not match and should be normalized.</span>
        </div>
      </div>
      <div className="phase8-album-track-list">
        {album.cacheDriftTrackIds.map(trackId => <CacheDriftAction trackId={trackId} track={tracksById.get(trackId)} key={trackId} />)}
      </div>
    </section>}

    {album.productionGapActions.length > 0 && <section className="phase8-album-member-gaps">
      <div className="phase8-album-member-gaps-head">
        <div><strong>{album.productionGapActions.length} track{album.productionGapActions.length === 1 ? '' : 's'} need production work</strong><span>Existing Track Next Actions — no second Album workflow.</span></div>
      </div>
      <div className="phase8-album-track-list">{primaryActions.map(action => <TrackAction action={action} key={action.trackId} />)}</div>
      {extraActions.length > 0 && <details className="phase8-album-more">
        <summary>Show {extraActions.length} more track{extraActions.length === 1 ? '' : 's'}</summary>
        <div className="phase8-album-track-list">{extraActions.map(action => <TrackAction action={action} key={action.trackId} />)}</div>
      </details>}
    </section>}

    <footer className="phase8-album-card-actions">
      {albumStructuralIssue && <button className="ghost-btn compact" type="button" onClick={scrollToAlbumsEditor}>Review Album details ↓</button>}
      {!albumStructuralIssue && album.productionGapActions.length > 0 && <span>Album manifest clean · Track work remains</span>}
      {!albumStructuralIssue && album.cacheDriftTrackIds.length > 0 && album.productionGapActions.length === 0 && <span>Album membership is canonical · Track metadata needs review</span>}
      {clear && <span>Nothing to fix</span>}
    </footer>
  </article>;
}

function AlbumHealthOverview() {
  const [albums, setAlbums] = useState<AdminAlbumSummary[]>([]);
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [visuals, setVisuals] = useState<Map<string, PublicAlbumVisual>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      getAdminAlbums(),
      getCatalogTracks(),
      getPublicAlbumVisuals().catch(() => new Map<string, PublicAlbumVisual>()),
    ])
      .then(([albumPayload, catalogTracks, albumVisuals]) => {
        if (!active) return;
        setAlbums(albumPayload.albums || []);
        setTracks(catalogTracks);
        setVisuals(albumVisuals);
        setError(null);
      })
      .catch(reason => active && setError(messageOf(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const health = useMemo(() => buildCatalogAlbumHealth(albums, tracks), [albums, tracks]);
  const sources = useMemo(() => new Map(albums.map(album => [album.id, album])), [albums]);
  const tracksById = useMemo(() => new Map(tracks.map(track => [track.id, track])), [tracks]);

  return <section className="phase8-album-health" aria-label="Canonical Album health">
    <div className="phase8-album-heading">
      <div><span className="eyebrow">PHASE 8 / ALBUM HEALTH</span><h2>Album Health</h2><p>One visual release overview built from canonical Album truth and the existing Track production model. No second authority, no automatic repair.</p></div>
      <button className="ghost-btn compact" type="button" onClick={scrollToAlbumsEditor}>Open Albums editor ↓</button>
    </div>

    {loading && <div className="catalog-message panel">Reading canonical Album health…</div>}
    {!loading && error && <div className="album-error panel"><strong>Album Health unavailable</strong><span>{error}</span></div>}
    {!loading && !error && <>
      <div className="phase8-album-summary" aria-label="Album health summary">
        <div><span>RELEASES</span><strong>{health.totalAlbums}</strong></div>
        <div className="healthy"><span>HEALTHY</span><strong>{health.healthyAlbums}</strong></div>
        <div className={health.attentionAlbums ? 'attention' : ''}><span>ATTENTION</span><strong>{health.attentionAlbums}</strong></div>
        <div className={health.unverifiedAlbums ? 'unverified' : ''}><span>UNVERIFIED</span><strong>{health.unverifiedAlbums}</strong></div>
      </div>

      {!health.crossModelVerified && health.totalAlbums > 0 && <div className="phase8-album-trust-warning"><span className="phase8-album-trust-dot" /><div><strong>Private Track truth unavailable</strong><span>Album manifests remain canonical; cross-model Track checks stay explicitly unverified.</span></div></div>}
      {health.totalAlbums > 0 && <div className="phase8-album-grid">{health.albums.map(album => <AlbumHealthCard album={album} source={sources.get(album.albumId)} visual={visuals.get(album.albumId)} tracksById={tracksById} key={album.albumId} />)}</div>}
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
