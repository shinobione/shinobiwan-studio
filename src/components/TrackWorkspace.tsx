import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { computeContentHealth } from '../content-health';
import { routeHref, trackHref } from '../router';
import { getCatalogTrack } from '../services/catalog-api';
import { studioConfig } from '../services/config';
import { openContextualLrcMaker } from '../services/lrc-maker';
import type { StudioTrackDetail, WorkspaceSection } from '../types/studio';
import { AssetsManager } from './AssetsManager';
import { EmbeddedLyricsStudio } from './EmbeddedLyricsStudio';
import { LyricsEditorPanel } from './LyricsEditorPanel';
import { MetadataValidationPanel } from './MetadataValidationPanel';
import { SonicTracePanel } from './SonicTracePanel';

const TABS: Array<{ id: WorkspaceSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'assets', label: 'Assets' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'intelligence', label: 'SonicTrace' },
];

function displayDate(value: string | null, year: number | null): string {
  if (value) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }).format(parsed);
  }
  return year ? String(year) : 'Unknown';
}

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '—';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function fullArtwork(track: StudioTrackDetail): string | null {
  return track.assets.cover?.fullUrl || track.assets.cover?.url || track.assets.thumbnail?.url || null;
}

function WorkspacePanel({ eyebrow, title, children, className = '' }: { eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return <article className={`panel workspace-panel ${className}`.trim()}><span className="eyebrow">{eyebrow}</span><h3>{title}</h3>{children}</article>;
}

function healthDestination(id: string): WorkspaceSection {
  if (id === 'metadata' || id === 'publication') return 'metadata';
  if (id === 'lyricsTxt' || id === 'syncedLyrics') return 'lyrics';
  if (id === 'sonicTrace') return 'intelligence';
  return 'assets';
}

function mediaState(label: string, ready: boolean, detail: string, href: string) {
  return { label, ready, detail, href };
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
      .then(item => { if (!active) return; setTrack(item); setError(null); })
      .catch(reason => active && setError(reason instanceof Error ? reason.message : String(reason)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [trackId]);

  async function refreshTrackAfterWrite() {
    const item = await getCatalogTrack(trackId);
    setTrack(item);
    setError(null);
  }

  useEffect(() => {
    const onLyricsSaved = (event: MessageEvent) => {
      if (event.origin !== globalThis.location.origin) return;
      const data = event.data as { type?: string; trackId?: string } | null;
      if (data?.type === 'shinobiwan:lyrics-saved:v1' && data.trackId === trackId) void refreshTrackAfterWrite();
    };
    globalThis.addEventListener('message', onLyricsSaved);
    return () => globalThis.removeEventListener('message', onLyricsSaved);
  }, [trackId]);

  const health = useMemo(() => track ? computeContentHealth(track) : null, [track]);
  const lyricLines = useMemo(() => {
    if (!track?.lyricsRaw) return [];
    return track.lyricsRaw.replace(/^\uFEFF/, '').split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 32);
  }, [track]);

  if (loading) return <div className="catalog-message panel">Loading Track Workspace…</div>;
  if (error || !track || !health) {
    return <section className="track-read-error panel"><span className="eyebrow">WORKSPACE / READ ERROR</span><h2>Track unavailable.</h2><p>{error || 'The canonical read layer did not return this track.'}</p><a className="ghost-btn" href={routeHref('catalog')}>← Back to catalog</a></section>;
  }

  const artwork = fullArtwork(track);
  const syncedLyrics = track.timestampsAvailable;
  const privateRead = track.readSource === 'private';
  const canEmbedLyrics = privateRead && Boolean(track.assets.audio && track.assets.lyricsTxt);
  const qualityCounts = track.quality?.counts;
  const healthStyle = { '--health-angle': `${health.total * 3.6}deg` } as CSSProperties;
  const trackStyle = {
    '--track-accent': /^#[0-9a-f]{6}$/i.test(track.accent || '') ? track.accent : '#54e8e0',
    '--track-accent2': /^#[0-9a-f]{6}$/i.test(track.accent2 || '') ? track.accent2 : '#6478ff',
  } as CSSProperties;
  const attention = health.items.filter(item => item.state !== 'complete');
  const media = [
    mediaState('Audio', Boolean(track.assets.audio), track.assets.audio?.filename || 'Add master audio', trackHref(track.id, 'assets')),
    mediaState('Cover', Boolean(track.assets.cover), track.assets.cover?.filename || 'Add artwork', trackHref(track.id, 'assets')),
    mediaState('Lyrics', Boolean(track.assets.lyricsTxt), syncedLyrics ? 'Timestamped and synced' : track.assets.lyricsTxt ? 'TXT ready for timing' : 'Add lyrics.txt', trackHref(track.id, 'lyrics')),
    mediaState('Canvas', Boolean(track.assets.video), track.assets.video?.filename || 'Optional video', trackHref(track.id, 'assets')),
  ];

  return (
    <section className="track-workspace">
      <div className="workspace-breadcrumbs"><a href={routeHref('catalog')}>← Back to Catalog</a><span>/</span><strong>{track.title}</strong></div>

      <header className="workspace-header panel" style={trackStyle}>
        <div className="workspace-cover">{artwork ? <img src={artwork} alt={`${track.title} cover`} /> : <span>{track.title.slice(0, 2).toUpperCase()}</span>}</div>
        <div className="workspace-title">
          <span className="eyebrow">TRACK WORKSPACE</span><h2>{track.title}</h2><p>{track.album.title} · {displayDate(track.releaseDate, track.year)}</p>
          <div className="workspace-header-tags"><span className="workspace-status">{track.status}</span>{(track.genres.length ? track.genres : ['Unclassified']).slice(0, 3).map(value => <span key={value}>{value}</span>)}</div>
        </div>
        <div className="workspace-summary">
          <span>READINESS</span><strong>{health.total}%</strong><small>{attention.length ? `${attention.length} item${attention.length === 1 ? '' : 's'} need attention` : 'Production checklist complete'}</small>
          {track.accent && track.accent2 && <div className="workspace-palette" aria-label={`Cover palette accent ${track.accent}, accent2 ${track.accent2}`}><i style={{ background: track.accent }} /><i style={{ background: track.accent2 }} /></div>}
        </div>
      </header>

      <nav className="workspace-tabs" aria-label="Track Workspace sections">{TABS.map(tab => <a key={tab.id} className={section === tab.id ? 'active' : ''} aria-current={section === tab.id ? 'page' : undefined} href={trackHref(track.id, tab.id)}>{tab.label}</a>)}</nav>

      {section === 'overview' && (
        <div className="workspace-overview-grid">
          <WorkspacePanel eyebrow="OVERVIEW / READINESS" title={attention.length ? 'Finish what matters next' : 'Ready for production'} className="workspace-readiness-panel">
            <div className="workspace-readiness-layout">
              <div className="health-ring health-ring-compact" style={healthStyle}><div><strong>{health.total}</strong><span>complete</span></div></div>
              <div className="workspace-readiness-copy">
                <strong>{attention.length ? `${attention.length} checklist item${attention.length === 1 ? '' : 's'} remain` : 'Every tracked requirement is complete'}</strong>
                <p>Content Health measures operational completeness only. It never judges the music.</p>
                <div className="workspace-health-pills">{health.items.map(item => <span className={item.state} key={item.id}>{item.label}<b>{item.state === 'complete' ? 'Ready' : `${item.score}/${item.max}`}</b></span>)}</div>
              </div>
              {attention[0]
                ? <a className="primary-btn workspace-next-action" href={trackHref(track.id, healthDestination(attention[0].id))}>Continue with {attention[0].label}</a>
                : <a className="ghost-btn workspace-next-action" href={trackHref(track.id, 'metadata')}>Review metadata</a>}
            </div>
          </WorkspacePanel>

          <WorkspacePanel eyebrow="NEXT / ACTIONS" title="Needs attention" className="workspace-attention-panel">
            <div className="workspace-action-list">
              {attention.slice(0, 4).map(item => <a href={trackHref(track.id, healthDestination(item.id))} key={item.id}><span className={item.state}>{item.state === 'missing' ? 'Missing' : 'Partial'}</span><div><strong>{item.label}</strong><small>{item.detail}</small></div><b>Open →</b></a>)}
              {!attention.length && <div className="workspace-complete-state"><strong>Nothing blocking the checklist.</strong><p>You can still refine metadata, media, lyrics or analysis whenever needed.</p></div>}
            </div>
          </WorkspacePanel>

          <WorkspacePanel eyebrow="MEDIA / AT A GLANCE" title="Production media" className="workspace-media-panel">
            <div className="workspace-media-grid">{media.map(item => <a href={item.href} key={item.label}><span className={item.ready ? 'ready' : 'missing'}>{item.ready ? '✓' : '+'}</span><div><strong>{item.label}</strong><small>{item.detail}</small></div></a>)}</div>
          </WorkspacePanel>

          <WorkspacePanel eyebrow="TRACK / SNAPSHOT" title="Music details" className="workspace-snapshot-panel">
            <div className="workspace-facts"><div><span>BPM</span><strong>{track.bpm ?? '—'}</strong></div><div><span>Key</span><strong>{track.key || '—'}</strong></div><div><span>Duration</span><strong>{formatDuration(track.duration)}</strong></div><div><span>Language</span><strong>{track.languages.join(', ') || '—'}</strong></div></div>
            {track.assets.audio && <audio className="workspace-audio" controls preload="metadata" src={track.assets.audio.url} />}
          </WorkspacePanel>

          <WorkspacePanel eyebrow="RELEASE / INTELLIGENCE" title="Release and analysis" className="workspace-release-panel">
            <div className="workspace-release-states"><div><span>Release</span><strong>{track.publishing.catalogVisible ? 'Live in catalog' : track.status === 'draft' ? 'Draft' : track.status}</strong><a href={trackHref(track.id, 'metadata')}>Manage release →</a></div><div><span>SonicTrace</span><strong>{track.audioIntelligence.available ? track.audioIntelligence.outdated ? 'Update needed' : 'Analysis ready' : 'Not analyzed'}</strong><a href={trackHref(track.id, 'intelligence')}>{track.audioIntelligence.available ? 'Open analysis' : 'Analyze track'} →</a></div></div>
            <details className="workspace-diagnostics"><summary>Source diagnostics</summary><dl><div><dt>Read source</dt><dd>{privateRead ? 'Track Manager private catalog' : 'LaunchPAD public catalog'}</dd></div><div><dt>Last update</dt><dd>{track.updatedAt ? new Date(track.updatedAt).toLocaleString() : 'Not available'}</dd></div><div><dt>trackId</dt><dd>{track.id}</dd></div></dl></details>
          </WorkspacePanel>
        </div>
      )}

      {section === 'intelligence' && (
        <SonicTracePanel track={track} onSaved={refreshTrackAfterWrite} />
      )}

      {section === 'lyrics' && (
        <div className="workspace-lyrics-shell">
          <section className="panel workspace-lyrics-status">
            <div><span className="eyebrow">LYRICS</span><h3>{syncedLyrics ? 'Lyrics are synchronized' : track.assets.lyricsTxt ? 'Ready for timing' : 'Add lyrics to begin'}</h3><p><strong>lyrics.txt</strong> is the only canonical source. Timestamps inside it define synchronization; LRC export remains optional.</p></div>
            <div className="workspace-lyrics-status-facts"><span>Source <b>{track.assets.lyricsTxt ? 'Ready' : 'Missing'}</b></span><span>Sync <b>{syncedLyrics ? 'Ready' : 'Not synced'}</b></span><span>Lines <b>{track.lyricSegments.length}</b></span></div>
            <button className="ghost-btn" type="button" disabled={!privateRead || !track.assets.audio || !track.assets.lyricsTxt} onClick={() => openContextualLrcMaker(track.id)}>Open standalone fallback ↗</button>
          </section>
          <WorkspacePanel eyebrow="LYRICS / STUDIO" title={track.assets.lyricsTxt ? 'Synchronize lyrics' : 'No lyrics'} className={`workspace-lyrics-panel${canEmbedLyrics ? ' workspace-lyrics-panel--embedded' : ''}`}>
            {canEmbedLyrics
              ? <EmbeddedLyricsStudio trackId={track.id} onSaved={refreshTrackAfterWrite} />
              : lyricLines.length
                ? <div className="workspace-lyrics-lines">{lyricLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}</div>
                : <p className="workspace-muted">No lyric text is available yet. Add canonical lyrics.txt from Assets to begin.</p>}
          </WorkspacePanel>
          <details className="workspace-lyrics-plain"><summary>Open plain-text lyrics editor</summary><p>Use this secondary editor for text cleanup or direct timestamp inspection.</p><LyricsEditorPanel track={track} onSaved={refreshTrackAfterWrite} /></details>
        </div>
      )}

      {section === 'assets' && (
        <AssetsManager track={track} onChanged={refreshTrackAfterWrite} />
      )}

      {section === 'versions' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="VERSIONS / CANONICAL" title="Current catalog source"><dl className="workspace-metadata-list"><div><dt>trackId</dt><dd>{track.id}</dd></div><div><dt>Audio filename</dt><dd>{track.assets.audio?.filename || 'Missing'}</dd></div><div><dt>{privateRead ? 'Canonical revision' : 'Public revision'}</dt><dd>{track.updatedAt || 'Not exposed'}</dd></div><div><dt>Read layer</dt><dd>{privateRead ? 'Track Manager v5.15 · bridge v1.7' : 'LaunchPAD public fallback'}</dd></div><div><dt>Master ID</dt><dd>Tracked by SonicTrace sourceVersion/history</dd></div></dl></WorkspacePanel>
          <WorkspacePanel eyebrow="VERSIONS / ROADMAP" title="Version model reserved"><div className="workspace-note"><strong>No fake version history.</strong><p>Dedicated masters/version identifiers remain reserved for later data modeling and stay subordinate to canonical trackId.</p></div></WorkspacePanel>
        </div>
      )}

      {section === 'metadata' && <MetadataValidationPanel track={track} onSaved={refreshTrackAfterWrite} />}

      {section === 'publishing' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="PUBLISHING / STATE" title="Catalog visibility"><div className="workspace-publish-state"><b className={track.publishing.catalogVisible ? 'ready' : 'pending'}>{track.publishing.catalogVisible ? 'PUBLISHED' : 'NOT PUBLIC'}</b><p>Status reported by the {privateRead ? 'canonical Track Manager manifest' : 'LaunchPAD public fallback'}: <strong>{track.status}</strong>.</p></div>{privateRead && track.quality && <div className="workspace-facts"><div><span>Quality</span><strong>{track.quality.state || '—'}</strong></div><div><span>Publishable</span><strong>{track.quality.publishable == null ? '—' : track.quality.publishable ? 'Yes' : 'No'}</strong></div><div><span>Errors</span><strong>{qualityCounts?.error ?? 0}</strong></div><div><span>Warnings</span><strong>{qualityCounts?.warning ?? 0}</strong></div></div>}{track.publishing.catalogVisible && <a className="ghost-btn" href={studioConfig.launchpadUrl} target="_blank" rel="noreferrer">Open LaunchPAD ↗</a>}</WorkspacePanel>
          <WorkspacePanel eyebrow="PHASE 5 / COMPLETE" title="Track Manager + SonicTrace"><div className="workspace-note phase4-complete-banner"><strong>Operational and intelligence workflows share this canonical trackId.</strong><p>Track Manager remains the R2 write authority; SonicTrace computes disposable audio scans; Studio reviews and persists only structured sidecars. Legacy tools remain available as fallbacks.</p></div></WorkspacePanel>
        </div>
      )}
    </section>
  );
}
