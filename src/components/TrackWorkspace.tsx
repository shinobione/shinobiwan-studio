import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { computeContentHealth } from '../content-health';
import { emitContinuationReceipt, makeContinuationReceipt } from '../phase7-receipts';
import { routeHref, trackHref } from '../router';
import { getCatalogTrack } from '../services/catalog-api';
import { studioConfig } from '../services/config';
import { openContextualLrcMaker } from '../services/lrc-maker';
import type { StudioTrackDetail, WorkspaceSection } from '../types/studio';
import { AssetsManager } from './AssetsManager';
import { ContinuationReceiptBanner } from './ContinuationReceiptBanner';
import { EmbeddedLyricsStudio } from './EmbeddedLyricsStudio';
import { LyricsEditorPanel } from './LyricsEditorPanel';
import { MetadataValidationPanel } from './MetadataValidationPanel';
import { SonicTracePanel } from './SonicTracePanel';
import { TrackToMarketPanel } from './TrackToMarketPanel';

const ARTIST_TABS: Array<{ label: string; href: WorkspaceSection; active: WorkspaceSection[] }> = [
  { label: 'Track', href: 'overview', active: ['overview', 'metadata', 'intelligence', 'versions'] },
  { label: 'Visuals', href: 'assets', active: ['assets'] },
  { label: 'Lyrics', href: 'lyrics', active: ['lyrics'] },
  { label: 'Release', href: 'market', active: ['market', 'publishing'] },
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
  if (id === 'metadata') return 'metadata';
  if (id === 'publication') return 'market';
  if (id === 'lyricsTxt' || id === 'syncedLyrics') return 'lyrics';
  if (id === 'sonicTrace') return 'intelligence';
  if (id === 'cover' || id === 'video') return 'assets';
  return 'overview';
}

export function TrackWorkspace({ trackId, section }: { trackId: string; section: WorkspaceSection }) {
  const [track, setTrack] = useState<StudioTrackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [observedAudioDuration, setObservedAudioDuration] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setTrack(null);
    setObservedAudioDuration(null);
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

  const health = useMemo(() => track ? computeContentHealth(track) : null, [track]);
  const lyricLines = useMemo(() => {
    if (!track?.lyricsRaw) return [];
    return track.lyricsRaw.replace(/^\uFEFF/, '').split(/\r?\n/).map(line => line.trim()).filter(Boolean).slice(0, 32);
  }, [track]);

  if (loading) return <div className="catalog-message panel">Loading Track Workspace…</div>;
  if (error || !track || !health) {
    return <section className="track-read-error panel"><span className="eyebrow">WORKSPACE / READ ERROR</span><h2>Track unavailable.</h2><p>{error || 'The canonical read layer did not return this track.'}</p><a className="ghost-btn" href={routeHref('catalog')}>← Back to Tracks</a></section>;
  }

  const artwork = fullArtwork(track);
  const syncedLyrics = track.timestampsAvailable;
  const privateRead = track.readSource === 'private';
  const canEmbedLyrics = privateRead && Boolean(track.assets.audio && track.assets.lyricsTxt);
  const qualityCounts = track.quality?.counts;
  const trackStyle = {
    '--track-accent': /^#[0-9a-f]{6}$/i.test(track.accent || '') ? track.accent : '#54e8e0',
    '--track-accent2': /^#[0-9a-f]{6}$/i.test(track.accent2 || '') ? track.accent2 : '#6478ff',
  } as CSSProperties;
  const attention = health.items.filter(item => item.state !== 'complete');
  const metadataReady = health.items.find(item => item.id === 'metadata')?.state === 'complete';
  const displayedDuration = observedAudioDuration ?? track.duration;
  const durationSource = observedAudioDuration != null
    ? track.duration != null && Math.abs(track.duration - observedAudioDuration) > 1
      ? `Audio measured ${formatDuration(observedAudioDuration)} · manifest ${formatDuration(track.duration)}`
      : 'Measured from canonical audio'
    : track.duration != null ? 'Canonical manifest value' : 'Waiting for audio metadata';
  const artistStages = [
    { label: 'Audio', ready: Boolean(track.assets.audio), detail: track.assets.audio ? 'Master ready' : 'Master missing', href: trackHref(track.id, 'overview') },
    { label: 'Visuals', ready: Boolean(track.assets.cover), detail: track.assets.video ? 'Cover + Canvas ready' : track.assets.cover ? 'Cover ready · Canvas optional' : 'Cover missing', href: trackHref(track.id, 'assets') },
    { label: 'Lyrics', ready: Boolean(track.assets.lyricsTxt), detail: syncedLyrics ? 'Synchronized' : track.assets.lyricsTxt ? 'Timing needed' : 'Missing', href: trackHref(track.id, 'lyrics') },
    { label: 'Sound', ready: track.audioIntelligence.available && !track.audioIntelligence.outdated, detail: track.audioIntelligence.available ? track.audioIntelligence.outdated ? 'Update analysis' : 'Analysis ready' : 'Not analyzed', href: trackHref(track.id, 'intelligence') },
    { label: 'Release', ready: track.publishing.catalogVisible, detail: track.publishing.catalogVisible ? 'Released' : metadataReady ? 'Review release' : 'Metadata needs attention', href: trackHref(track.id, 'market') },
  ];

  return (
    <section className="track-workspace track-workshop">
      <div className="workspace-breadcrumbs"><a href={routeHref('catalog')}>← Back to Tracks</a><span>/</span><strong>{track.title}</strong></div>

      <header className="workspace-header panel" style={trackStyle}>
        <div className="workspace-cover">{artwork ? <img src={artwork} alt={`${track.title} cover`} /> : <span>{track.title.slice(0, 2).toUpperCase()}</span>}</div>
        <div className="workspace-title">
          <span className="eyebrow">TRACK WORKSHOP</span><h2>{track.title}</h2><p>{track.album.title} · {displayDate(track.releaseDate, track.year)}</p>
          <div className="workspace-header-tags"><span className="workspace-status">{track.status}</span>{(track.genres.length ? track.genres : ['Unclassified']).slice(0, 3).map(value => <span key={value}>{value}</span>)}</div>
        </div>
        <div className="workspace-summary">
          <span>READINESS</span><strong>{health.total}%</strong><small>{attention.length ? `${attention.length} item${attention.length === 1 ? '' : 's'} need attention` : 'Production checklist complete'}</small>
          {track.accent && track.accent2 && <div className="workspace-palette" aria-label={`Cover palette accent ${track.accent}, accent2 ${track.accent2}`}><i style={{ background: track.accent }} /><i style={{ background: track.accent2 }} /></div>}
        </div>
      </header>

      <nav className="workspace-tabs workspace-artist-tabs" aria-label="Track Workshop sections">
        <div className="workspace-sticky-context">
          <span className="workspace-sticky-cover">{artwork ? <img src={artwork} alt="" /> : track.title.slice(0, 2).toUpperCase()}</span>
          <span><strong>{track.title}</strong><small>{track.status} · {health.total}% ready</small></span>
        </div>
        <div className="workspace-tab-links">{ARTIST_TABS.map(tab => {
          const active = tab.active.includes(section);
          return <a key={tab.label} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} href={trackHref(track.id, tab.href)}>{tab.label}</a>;
        })}</div>
      </nav>

      <ContinuationReceiptBanner trackId={track.id} onCanonicalVerified={canonical => { setTrack(canonical); setError(null); }} />

      {!privateRead && (
        <section className="panel workspace-private-read-notice" role="status">
          <div><span className="eyebrow">PUBLIC READ-ONLY FALLBACK</span><strong>Private production tools are temporarily locked.</strong><p>You are viewing the LaunchPAD public catalog. Draft tracks, canonical editing, Lyrics Studio synchronization and full private SonicTrace analysis require Track Manager private read. Nothing has been deleted.</p></div>
          <div className="workspace-private-read-actions"><a className="ghost-btn" href={studioConfig.trackManagerUrl} target="_blank" rel="noopener noreferrer">Open Track Manager ↗</a><button className="ghost-btn" type="button" onClick={() => void refreshTrackAfterWrite()}>Retry private read</button></div>
        </section>
      )}

      {section === 'overview' && (
        <div className="workspace-focus-track">
          <section className="panel workspace-focus-summary">
            <div className="workspace-focus-summary-head"><div><span className="eyebrow">TRACK</span><h3>Your track, at a glance</h3></div><a className="ghost-btn" href={trackHref(track.id, 'metadata')}>Edit track details →</a></div>
            <div className="workspace-focus-facts">
              <div><span>Album / project</span><strong>{track.album.title || 'Singles'}</strong></div>
              <div><span>Release</span><strong>{displayDate(track.releaseDate, track.year)}</strong></div>
              <div><span>Type</span><strong>{track.type || '—'}</strong></div>
              <div><span>Genres</span><strong>{track.genres.slice(0, 4).join(', ') || '—'}</strong></div>
            </div>
            {track.assets.audio
              ? <audio className="workspace-audio" controls preload="metadata" crossOrigin={privateRead ? 'use-credentials' : undefined} src={track.assets.audio.url} onLoadedMetadata={event => { const duration = event.currentTarget.duration; setObservedAudioDuration(Number.isFinite(duration) && duration > 0 ? duration : null); }} />
              : <div className="workspace-focus-missing"><strong>No master audio yet.</strong><span>Add the canonical master below.</span></div>}
          </section>

          <section className="panel workspace-focus-stages">
            <div className="workspace-focus-section-head"><div><span className="eyebrow">PRODUCTION</span><h3>What matters next</h3></div>{attention[0] && <a href={trackHref(track.id, healthDestination(attention[0].id))}>Continue →</a>}</div>
            <div className="workspace-focus-stage-grid">{artistStages.map(stage => <a href={stage.href} key={stage.label} className={stage.ready ? 'ready' : 'attention'}><span>{stage.ready ? '✓' : '•'}</span><div><strong>{stage.label}</strong><small>{stage.detail}</small></div></a>)}</div>
          </section>

          <AssetsManager
            track={track}
            onChanged={refreshTrackAfterWrite}
            kinds={['audio']}
            eyebrow="TRACK / AUDIO"
            title="Master audio"
            description="Keep the canonical master here. Cover, Canvas and campaign visuals now live under Visuals / Release."
          />

          <details className="panel workspace-focus-details">
            <summary>More track details</summary>
            <div className="workspace-facts"><div><span>BPM</span><strong>{track.bpm ?? '—'}</strong></div><div><span>Key</span><strong>{track.key || '—'}</strong></div><div><span>Duration</span><strong>{formatDuration(displayedDuration)}</strong><small>{durationSource}</small></div><div><span>Language</span><strong>{track.languages.join(', ') || '—'}</strong></div></div>
            <div className="workspace-focus-detail-actions"><a className="ghost-btn" href={trackHref(track.id, 'metadata')}>Full metadata editor</a>{privateRead ? <a className="ghost-btn" href={trackHref(track.id, 'intelligence')}>View full SonicTrace analysis</a> : <a className="ghost-btn" href={studioConfig.trackManagerUrl} target="_blank" rel="noopener noreferrer">Unlock SonicTrace via Track Manager ↗</a>}</div>
            <dl className="workspace-metadata-list"><div><dt>Read source</dt><dd>{privateRead ? 'Track Manager private catalog' : 'LaunchPAD public catalog'}</dd></div><div><dt>Last update</dt><dd>{track.updatedAt ? new Date(track.updatedAt).toLocaleString() : 'Not available'}</dd></div><div><dt>trackId</dt><dd>{track.id}</dd></div></dl>
          </details>
        </div>
      )}

      {section === 'metadata' && (
        <div className="workspace-focus-subpage">
          <section className="panel workspace-focus-subpage-head"><div><span className="eyebrow">TRACK / DETAILS</span><h3>Edit identity and release metadata</h3><p>This is still the protected Track Manager metadata editor; it simply lives under Track now.</p></div><a className="ghost-btn" href={trackHref(track.id, 'overview')}>← Back to Track</a></section>
          <MetadataValidationPanel track={track} onSaved={refreshTrackAfterWrite} />
        </div>
      )}

      {section === 'assets' && (
        <div className="workspace-focus-visuals">
          <section className="panel workspace-focus-visual-preview">
            <div><span className="eyebrow">VISUALS</span><h3>Cover and Canvas</h3><p>One place for the canonical visual identity used by Studio and LaunchPAD.</p></div>
            <div className="workspace-focus-visual-grid">
              <div className="workspace-focus-cover-preview">{artwork ? <img src={artwork} alt={`${track.title} cover`} /> : <span>No cover</span>}<small>{track.assets.cover ? 'Cover ready' : 'Cover missing'}</small></div>
              <div className="workspace-focus-video-preview">{track.assets.video ? <video src={track.assets.video.url} controls preload="metadata" /> : <span>No Canvas yet</span>}<small>{track.assets.video ? 'Canvas ready · 9:16' : 'Canvas optional / missing'}</small></div>
            </div>
          </section>
          <AssetsManager
            track={track}
            onChanged={refreshTrackAfterWrite}
            kinds={['cover', 'thumbnail', 'video']}
            eyebrow="VISUALS / CANONICAL"
            title="Visual assets"
            description="Manage cover, thumbnail and Canvas here. Audio stays under Track; lyrics stay under Lyrics."
          />
          <section className="panel workspace-focus-handoff"><div><span className="eyebrow">CAMPAIGN VISUALS</span><h3>Ready for 16:9 · 1:1 · 9:16?</h3><p>The native Release Campaign remains browser-local and review-only. Build the final format pack under Release.</p></div><a className="primary-btn" href={trackHref(track.id, 'market')}>Open Release →</a></section>
        </div>
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
              ? <EmbeddedLyricsStudio trackId={track.id} onSaved={() => undefined} />
              : !privateRead
                ? <div className="workspace-lyrics-lock"><span className="eyebrow">LYRICS STUDIO LOCKED</span><strong>Restore private read to open the synchronization engine.</strong><p>The embedded LRC Maker is still here; Studio will not expose its canonical save/sync surface from the public fallback. Authenticate through Track Manager, then retry private read.</p><div className="workspace-private-read-actions"><a className="ghost-btn" href={studioConfig.trackManagerUrl} target="_blank" rel="noopener noreferrer">Open Track Manager ↗</a><button className="ghost-btn" type="button" onClick={() => void refreshTrackAfterWrite()}>Retry private read</button></div>{lyricLines.length > 0 && <details><summary>Preview public lyrics text</summary><div className="workspace-lyrics-lines">{lyricLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}</div></details>}</div>
                : lyricLines.length
                  ? <div className="workspace-lyrics-lines">{lyricLines.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}</div>
                  : <p className="workspace-muted">No lyric text is available yet. Add canonical lyrics.txt to begin.</p>}
          </WorkspacePanel>
          <details className="workspace-lyrics-plain"><summary>Open plain-text lyrics editor</summary><p>Use this secondary editor for text cleanup or direct timestamp inspection.</p><LyricsEditorPanel track={track} onSaved={refreshTrackAfterWrite} /></details>
        </div>
      )}

      {section === 'market' && (
        <div className="workspace-focus-release">
          <section className="panel workspace-focus-release-checklist">
            <div className="workspace-focus-section-head"><div><span className="eyebrow">RELEASE</span><h3>Final production check</h3><p>Only the useful release state, before packaging the campaign.</p></div><span className="workspace-focus-release-state">{track.publishing.catalogVisible ? 'RELEASED' : 'IN PROGRESS'}</span></div>
            <div className="workspace-focus-release-grid">
              <div className={track.assets.audio ? 'ready' : 'attention'}><span>Audio</span><strong>{track.assets.audio ? 'Ready' : 'Missing'}</strong></div>
              <div className={track.assets.cover ? 'ready' : 'attention'}><span>Cover</span><strong>{track.assets.cover ? 'Ready' : 'Missing'}</strong></div>
              <div className={track.assets.lyricsTxt ? 'ready' : 'attention'}><span>Lyrics</span><strong>{syncedLyrics ? 'Synced' : track.assets.lyricsTxt ? 'TXT ready' : 'Missing'}</strong></div>
              <div className={track.assets.video ? 'ready' : 'optional'}><span>Canvas</span><strong>{track.assets.video ? 'Ready' : 'Optional'}</strong></div>
              <div className={metadataReady ? 'ready' : 'attention'}><span>Metadata</span><strong>{metadataReady ? 'Ready' : 'Review'}</strong></div>
            </div>
          </section>
          <TrackToMarketPanel track={track} />
        </div>
      )}

      {section === 'intelligence' && (
        <div className="workspace-focus-subpage">
          <section className="panel workspace-focus-subpage-head"><div><span className="eyebrow">TRACK / SOUND</span><h3>Full SonicTrace analysis</h3><p>Advanced audio intelligence stays available without occupying the daily workspace navigation.</p></div><a className="ghost-btn" href={trackHref(track.id, 'overview')}>← Back to Track</a></section>
          <SonicTracePanel track={track} onSaved={() => {
            emitContinuationReceipt(makeContinuationReceipt({
              trackId: track.id,
              source: 'sonictrace',
              operation: 'analysis-saved',
              effect: 'canonical-write',
              summary: 'SonicTrace analysis save completed.',
              detail: 'Studio will verify the saved analysis through the private canonical Track read layer.',
            }));
          }} />
        </div>
      )}

      {section === 'versions' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="VERSIONS / CANONICAL" title="Current catalog source"><dl className="workspace-metadata-list"><div><dt>trackId</dt><dd>{track.id}</dd></div><div><dt>Audio filename</dt><dd>{track.assets.audio?.filename || 'Missing'}</dd></div><div><dt>{privateRead ? 'Canonical revision' : 'Public revision'}</dt><dd>{track.updatedAt || 'Not exposed'}</dd></div><div><dt>Read layer</dt><dd>{privateRead ? 'Track Manager private catalog' : 'LaunchPAD public fallback'}</dd></div><div><dt>Master ID</dt><dd>Tracked by SonicTrace sourceVersion/history</dd></div></dl></WorkspacePanel>
          <WorkspacePanel eyebrow="VERSIONS / ROADMAP" title="Version model reserved"><div className="workspace-note"><strong>No fake version history.</strong><p>Dedicated masters/version identifiers remain reserved for later data modeling and stay subordinate to canonical trackId.</p></div></WorkspacePanel>
        </div>
      )}

      {section === 'publishing' && (
        <div className="workspace-two-col">
          <WorkspacePanel eyebrow="PUBLISHING / STATE" title="Catalog visibility"><div className="workspace-publish-state"><b className={track.publishing.catalogVisible ? 'ready' : 'pending'}>{track.publishing.catalogVisible ? 'PUBLISHED' : 'NOT PUBLIC'}</b><p>Status reported by the {privateRead ? 'canonical Track Manager manifest' : 'LaunchPAD public fallback'}: <strong>{track.status}</strong>.</p></div>{privateRead && track.quality && <div className="workspace-facts"><div><span>Quality</span><strong>{track.quality.state || '—'}</strong></div><div><span>Publishable</span><strong>{track.quality.publishable == null ? '—' : track.quality.publishable ? 'Yes' : 'No'}</strong></div><div><span>Errors</span><strong>{qualityCounts?.error ?? 0}</strong></div><div><span>Warnings</span><strong>{qualityCounts?.warning ?? 0}</strong></div></div>}{track.publishing.catalogVisible && <a className="ghost-btn" href={studioConfig.launchpadUrl} target="_blank" rel="noreferrer">Open LaunchPAD ↗</a>}</WorkspacePanel>
          <WorkspacePanel eyebrow="PHASE 5 / COMPLETE" title="Track Manager + SonicTrace"><div className="workspace-note phase4-complete-banner"><strong>Operational and intelligence workflows share this canonical trackId.</strong><p>Track Manager remains the R2 write authority; SonicTrace computes disposable audio scans; Studio reviews and persists only structured sidecars. Legacy tools remain available as fallbacks.</p></div></WorkspacePanel>
        </div>
      )}
    </section>
  );
}
