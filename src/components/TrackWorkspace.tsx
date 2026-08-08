import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { computeContentHealth } from '../content-health';
import { routeHref, trackHref } from '../router';
import { getCatalogTrack } from '../services/catalog-api';
import { studioConfig } from '../services/config';
import type { StudioAsset, StudioTrackDetail, WorkspaceSection } from '../types/studio';

const TABS: Array<{ id: WorkspaceSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'intelligence', label: 'Audio Intelligence' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'assets', label: 'Assets' },
  { id: 'versions', label: 'Versions' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'publishing', label: 'Publishing' },
];

function displayDate(value: string | null, year: number | null): string {
  if (value) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(parsed);
    }
  }
  return year ? String(year) : 'Unknown';
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '—';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function formatBytes(value: number | null | undefined): string {
  if (!value || value <= 0) return '—';
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function fullArtwork(track: StudioTrackDetail): string | null {
  return track.assets.cover?.fullUrl || track.assets.cover?.url || track.assets.thumbnail?.url || null;
}

function AssetRow({ label, asset }: { label: string; asset: StudioAsset | null }) {
  return (
    <div className="workspace-asset-row">
      <div>
        <strong>{label}</strong>
        <span>{asset?.filename || 'Missing'}</span>
      </div>
      <div className="workspace-asset-meta">
        <span>{asset ? formatBytes(asset.size) : '—'}</span>
        {asset ? <a href={asset.fullUrl || asset.url} target="_blank" rel="noreferrer">Open ↗</a> : <b>Missing</b>}
      </div>
    </div>
  );
}

function WorkspacePanel({ eyebrow, title, children, className = '' }: { eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return (
    <article className={`panel workspace-panel ${className}`.trim()}>
      <span className="eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

export function TrackWorkspace({ trackId, section }: { trackId: string; section: WorkspaceSection }) {
  const [track, setTrack] = useState<StudioTrackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setTrack(null);
    getCatalogTrack(trackId)
      .then(item => {
        if (!active) return;
        setTrack(item);
        setError(null);
      })
      .catch(reason => active && setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [trackId]);

  const health = useMemo(() => track ? computeContentHealth(track) : null, [track]);
  const lyricLines = useMemo(() => {
    if (!track?.lyricsRaw) return [];
    return track.lyricsRaw
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .slice(0, 32);
  }, [track]);

  if (loading) return <div className="catalog-message panel">Loading Track Workspace…</div>;

  if (error || !track || !health) {
    return (
      <section className="track-read-error panel">
        <span className="eyebrow">WORKSPACE / READ ERROR</span>
        <h2>Track unavailable.</h2>
        <p>{error || 'The canonical read layer did not return this track.'}</p>
        <a className="ghost-btn" href={routeHref('catalog')}>← Back to catalog</a>
      </section>
    );
  }

  const artwork = fullArtwork(track);
  const syncedLyrics = track.timestampsAvailable || Boolean(track.assets.lyricsLrc);
  const healthStyle = { '--health-angle': `${health.total * 3.6}deg` } as CSSProperties;

  return (
    <section className="track-workspace">
      <div className="workspace-breadcrumbs">
        <a href={routeHref('catalog')}>Catalog</a><span>/</span><strong>{track.title}</strong>
      </div>

      <header className="workspace-header panel">
        <div className="workspace-cover">
          {artwork ? <img src={artwork} alt={`${track.title} cover`} /> : <span>{track.title.slice(0, 2).toUpperCase()}</span>}
        </div>
        <div className="workspace-title">
          <span className="eyebrow">TRACK WORKSPACE / {track.id}</span>
          <h2>{track.title}</h2>
          <p>{track.album.title} · {displayDate(track.releaseDate, track.year)}</p>
          <div className="workspace-header-tags">
            <span className="workspace-status">{track.status}</span>
            {(track.genres.length ? track.genres : ['Unclassified']).slice(0, 4).map(value => <span key={value}>{value}</span>)}
          </div>
        </div>
        <div className="workspace-summary">
          <span>CONTENT HEALTH</span>
          <strong>{health.total}%</strong>
          <small>Completeness, not artistic quality</small>
        </div>
      </header>

      <nav className="workspace-tabs" aria-label="Track Workspace sections">
        {TABS.map(tab => (
          <a key={tab.id} className={section === tab.id ? 'active' : ''} href={trackHref(track.id, tab.id)}>{tab.label}</a>
        ))}
      </nav>

      {section === 'overview' && (
        <div className="workspace-overview-grid">
          <WorkspacePanel eyebrow="CONTENT / HEALTH" title="Track completeness" className="health-panel">
            <div className="health-layout">
              <div className="health-ring" style={healthStyle}>
                <div><strong>{health.total}</strong><span>/ 100</span></div>
              </div>
              <div className="health-list">
                {health.items.map(current => (
                  <div className={`health-row health-${current.state}`} key={current.id}>
                    <div className="health-row-head"><strong>{current.label}</strong><span>{current.score}/{current.max}</span></div>
                    <div className="health-bar"><i style={{ width: `${(current.score / current.max) * 100}%` }} /></div>
                    <small>{current.detail}</small>
                  </div>
                ))}
              </div>
            </div>
          </WorkspacePanel>

          <WorkspacePanel eyebrow="TRACK / SNAPSHOT" title="Quick facts">
            <div className="workspace-facts">
              <div><span>BPM</span><strong>{track.bpm ?? '—'}</strong></div>
              <div><span>Key</span><strong>{track.key || '—'}</strong></div>
              <div><span>Duration</span><strong>{formatDuration(track.duration)}</strong></div>
              <div><span>Language</span><strong>{track.languages.join(', ') || '—'}</strong></div>
              <div><span>Lyrics</span><strong>{syncedLyrics ? 'Synced' : track.assets.lyricsTxt ? 'TXT ready' : 'Missing'}</strong></div>
              <div><span>Canvas</span><strong>{track.assets.video ? 'Ready' : 'Missing'}</strong></div>
            </div>
            {track.assets.audio && <audio className="workspace-audio" controls preload="metadata" src={track.assets.audio.url} />}
          </WorkspacePanel>

          <WorkspacePanel eyebrow="ACTIVITY / SOURCE" title="Recent activity">
            <div className="workspace-note">
              <strong>{track.updatedAt ? 'Latest public asset revision detected' : 'Activity history unavailable'}</strong>
              <p>{track.updatedAt ? new Date(track.updatedAt).toLocaleString() : 'The public read layer does not expose admin activity history. This arrives with the private API integration.'}</p>
            </div>
          </WorkspacePanel>

          <WorkspacePanel eyebrow="NEXT / GAPS" title="What still needs attention">
            <div className="workspace-gap-list">
              {health.items.filter(current => current.state !== 'complete').map(current => (
                <div key={current.id}><span>{current.label}</span><strong>{current.detail}</strong></div>
              ))}
              {health.items.every(current => current.state === 'complete') && <p>Everything tracked by Content Health is complete.</p>}
            </div>
          </WorkspacePanel>
        </div>
      )}

      {section === 'intelligence' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="SONICTRACE / CATALOG" title="Audio Intelligence status">
            <div className="workspace-state-card">
              <b className={track.audioIntelligence.available ? 'ready' : 'pending'}>{track.audioIntelligence.available ? 'CATALOG-LINKED' : 'NOT SAVED'}</b>
              <p>{track.audioIntelligence.available
                ? 'A persisted SonicTrace analysis is linked to this track.'
                : 'SonicTrace can analyze audio today, but catalog persistence belongs to Phase 5. The Studio will not invent a fake result here.'}</p>
            </div>
            <a className="ghost-btn" href={studioConfig.sonicTraceUrl} target="_blank" rel="noreferrer">Open SonicTrace ↗</a>
          </WorkspacePanel>
          <WorkspacePanel eyebrow="PROVENANCE / SOURCE" title="Canonical analysis input">
            <dl className="workspace-metadata-list">
              <div><dt>trackId</dt><dd>{track.id}</dd></div>
              <div><dt>Audio</dt><dd>{track.assets.audio?.filename || 'Missing'}</dd></div>
              <div><dt>Fingerprint</dt><dd>Phase 5</dd></div>
              <div><dt>Analysis ID</dt><dd>{track.audioIntelligence.latestAnalysisId || '—'}</dd></div>
              <div><dt>Outdated</dt><dd>{track.audioIntelligence.outdated ? 'Yes' : 'No persisted analysis'}</dd></div>
            </dl>
          </WorkspacePanel>
        </div>
      )}

      {section === 'lyrics' && (
        <div className="workspace-two-col workspace-lyrics-grid">
          <WorkspacePanel eyebrow="LYRICS / STATE" title="Lyrics synchronization">
            <div className="workspace-facts">
              <div><span>Source</span><strong>{track.assets.lyricsTxt ? 'lyrics.txt' : 'Missing'}</strong></div>
              <div><span>Timestamp data</span><strong>{track.timestampsAvailable ? 'Detected' : 'No'}</strong></div>
              <div><span>Sync status</span><strong>{syncedLyrics ? 'Ready' : 'Not synced'}</strong></div>
              <div><span>Segments</span><strong>{track.lyricSegments.length}</strong></div>
            </div>
            <div className="workspace-note workspace-tool-link">
              <strong>{track.assets.lyricsLrc ? 'Optional .lrc sidecar detected.' : 'No separate .lrc file required.'}</strong>
              <p>Synchronization is derived from timestamp data. A timestamped canonical lyrics.txt is already considered synchronized.</p>
            </div>
            <a className="ghost-btn workspace-tool-link" href={studioConfig.lrcMakerUrl} target="_blank" rel="noreferrer">Open LRC Maker ↗</a>
          </WorkspacePanel>
          <WorkspacePanel eyebrow="LYRICS / PREVIEW" title={track.assets.lyricsTxt ? 'Catalog lyrics' : 'No lyrics'} className="workspace-lyrics-panel">
            {lyricLines.length ? <div className="workspace-lyrics-lines">{lyricLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}</div> : <p className="workspace-muted">No lyric text is exposed for this track.</p>}
          </WorkspacePanel>
        </div>
      )}

      {section === 'assets' && (
        <WorkspacePanel eyebrow="R2 / ASSETS" title="Canonical track assets">
          <div className="workspace-asset-list">
            <AssetRow label="Audio" asset={track.assets.audio} />
            <AssetRow label="Cover" asset={track.assets.cover} />
            <AssetRow label="Thumbnail" asset={track.assets.thumbnail} />
            <AssetRow label="Lyrics TXT" asset={track.assets.lyricsTxt} />
            <AssetRow label="Video / Canvas" asset={track.assets.video} />
          </div>
          <p className="workspace-footnote">Read-only projection from the canonical catalog. Synchronized lyrics are content-derived from timestamp data; a separate .lrc sidecar is optional. Replace/upload actions stay in Track Manager until Phase 4.</p>
        </WorkspacePanel>
      )}

      {section === 'versions' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="VERSIONS / CANONICAL" title="Current catalog source">
            <dl className="workspace-metadata-list">
              <div><dt>trackId</dt><dd>{track.id}</dd></div>
              <div><dt>Audio filename</dt><dd>{track.assets.audio?.filename || 'Missing'}</dd></div>
              <div><dt>Public revision</dt><dd>{track.updatedAt || 'Not exposed'}</dd></div>
              <div><dt>Master ID</dt><dd>Not modeled yet</dd></div>
            </dl>
          </WorkspacePanel>
          <WorkspacePanel eyebrow="VERSIONS / ROADMAP" title="Version model reserved">
            <div className="workspace-note"><strong>No fake version history.</strong><p>Phase 3 establishes the workspace slot only. Dedicated masters/version identifiers will remain subordinate to the canonical trackId when the data model is introduced.</p></div>
          </WorkspacePanel>
        </div>
      )}

      {section === 'metadata' && (
        <WorkspacePanel eyebrow="METADATA / READ ONLY" title="Canonical metadata">
          <dl className="workspace-metadata-list metadata-wide">
            <div><dt>trackId</dt><dd>{track.id}</dd></div>
            <div><dt>Title</dt><dd>{track.title}</dd></div>
            <div><dt>Album</dt><dd>{track.album.title}</dd></div>
            <div><dt>Type</dt><dd>{track.type}</dd></div>
            <div><dt>Release</dt><dd>{displayDate(track.releaseDate, track.year)}</dd></div>
            <div><dt>Genres</dt><dd>{track.genres.join(', ') || '—'}</dd></div>
            <div><dt>Tags</dt><dd>{track.tags.join(', ') || '—'}</dd></div>
            <div><dt>Moods</dt><dd>{track.moods.join(', ') || '—'}</dd></div>
            <div><dt>Themes</dt><dd>{track.themes.join(', ') || '—'}</dd></div>
            <div><dt>Era</dt><dd>{track.era || '—'}</dd></div>
            <div><dt>Energy</dt><dd>{track.energy || '—'}</dd></div>
            <div><dt>Languages</dt><dd>{track.languages.join(', ') || '—'}</dd></div>
            <div><dt>BPM</dt><dd>{track.bpm ?? '—'}</dd></div>
            <div><dt>Key</dt><dd>{track.key || '—'}</dd></div>
            <div><dt>Explicit</dt><dd>{track.explicit == null ? '—' : track.explicit ? 'Yes' : 'No'}</dd></div>
          </dl>
          <p className="workspace-footnote">Editing remains intentionally unavailable until the Track Manager write backend is integrated in Phase 4.</p>
        </WorkspacePanel>
      )}

      {section === 'publishing' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="PUBLISHING / STATE" title="Catalog visibility">
            <div className="workspace-publish-state">
              <b className={track.publishing.catalogVisible ? 'ready' : 'pending'}>{track.publishing.catalogVisible ? 'PUBLISHED' : 'NOT PUBLIC'}</b>
              <p>Status reported by the public LaunchPAD catalog: <strong>{track.status}</strong>.</p>
            </div>
            <a className="ghost-btn" href={studioConfig.launchpadUrl} target="_blank" rel="noreferrer">Open LaunchPAD ↗</a>
          </WorkspacePanel>
          <WorkspacePanel eyebrow="PUBLISHING / GUARD" title="Write actions locked">
            <div className="workspace-note"><strong>Catalog rebuild is not exposed here yet.</strong><p>Publishing, delete, asset replacement and manifest edits stay behind the protected Track Manager path until Phase 4 resolves authenticated cross-origin writes.</p></div>
          </WorkspacePanel>
        </div>
      )}
    </section>
  );
}
