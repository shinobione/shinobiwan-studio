import { useEffect, useMemo, useState } from 'react';
import { resolveAdminMode } from './admin-mode';
import { AlbumManager } from './components/AlbumManager';
import { AlbumMigrationPanel } from './components/AlbumMigrationPanel';
import { CatalogRebuildPanel } from './components/CatalogRebuildPanel';
import { CatalogView } from './components/CatalogView';
import { CatalogIntelligenceView } from './components/CatalogIntelligenceView';
import { EmptyState } from './components/EmptyState';
import { ServicePill } from './components/ServicePill';
import { TrackWorkspace } from './components/TrackWorkspace';
import { studioRelease } from './release';
import { readRoute, readTrackId, readTrackSection, routeHref } from './router';
import { adminService } from './services/admin-api';
import { getCatalogHealth } from './services/catalog-api';
import { studioConfig } from './services/config';
import { getSonicTraceHealth } from './services/sonictrace-api';
import type { ServiceStatus, StudioReadSource, StudioRoute, WorkspaceSection } from './types/studio';

const NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'dashboard', label: 'Dashboard', glyph: '⌂' },
  { route: 'catalog', label: 'Catalog', glyph: '♫' },
  { route: 'albums', label: 'Albums / Projects', glyph: '▣' },
  { route: 'intelligence', label: 'Intelligence', glyph: '◇' },
];

const UTILITY_NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'administration', label: 'System', glyph: '⌘' },
];

const shellCopy: Record<Exclude<StudioRoute, 'catalog' | 'albums'>, { eyebrow: string; title: string; body: string }> = {
  dashboard: {
    eyebrow: 'PHASE 6 / COMPLETE',
    title: 'Canonical lyrics now have one protected workflow.',
    body: 'Studio, LRC Maker and Track Manager share the canonical trackId while lyrics.txt remains the single source of truth for text and synchronization.',
  },
  intelligence: {
    eyebrow: 'SONICTRACE / PHASE 5',
    title: 'Audio Intelligence is catalog-linked.',
    body: 'SonicTrace analyses are persisted as private R2 sidecars under the canonical trackId, with 512D similarity, clusters, history and source-version freshness checks.',
  },
  lyrics: {
    eyebrow: 'LYRICS / CANONICAL',
    title: 'lyrics.txt is the single canonical source.',
    body: 'Studio can upload missing lyrics TXT from Assets, edit existing canonical lyrics with manifest+ETag concurrency, and preserve timestamp-derived synchronization. .lrc remains optional compatibility/export only.',
  },
  assets: {
    eyebrow: 'CONTENT / ASSETS',
    title: 'Canonical asset management is operational.',
    body: 'Per-track Audio, Cover, Thumbnail, Lyrics TXT and Canvas/video can be uploaded or replaced with progress. Individual asset deletion is guarded and confirmed explicitly.',
  },
  publishing: {
    eyebrow: 'CATALOG / PUBLISHING',
    title: 'Catalog operations stay explicit.',
    body: 'Metadata, lyrics and assets rebuild the catalog as part of guarded writes. Administration also exposes an explicit standalone catalog rebuild. Published-track quality guards remain authoritative.',
  },
  administration: {
    eyebrow: 'SYSTEM / ADMINISTRATION',
    title: 'Phase 4 operational fallback is preserved.',
    body: 'The old Track Manager remains available as the protected fallback. LRC Maker is context-linked for timing work while Track Manager remains the sole R2 write authority.',
  },
};

const checking: ServiceStatus = { state: 'checking', label: 'checking', detail: 'Checking service availability…' };

export default function App() {
  const [route, setRoute] = useState<StudioRoute>(() => readRoute());
  const [trackId, setTrackId] = useState<string | null>(() => readTrackId());
  const [trackSection, setTrackSection] = useState<WorkspaceSection>(() => readTrackSection());
  const [catalog, setCatalog] = useState<ServiceStatus>(checking);
  const [sonic, setSonic] = useState<ServiceStatus>(checking);
  const [readSource, setReadSource] = useState<StudioReadSource | 'checking'>('checking');
  const adminMode = useMemo(resolveAdminMode, []);

  useEffect(() => {
    const syncLocation = () => { setRoute(readRoute()); setTrackId(readTrackId()); setTrackSection(readTrackSection()); };
    globalThis.addEventListener('hashchange', syncLocation);
    if (!globalThis.location.hash) globalThis.location.hash = routeHref('dashboard');
    return () => globalThis.removeEventListener('hashchange', syncLocation);
  }, []);

  useEffect(() => {
    let active = true;
    getCatalogHealth()
      .then(payload => {
        if (!active) return;
        setReadSource(payload.readSource);
        const count = payload.canonicalTracks != null ? ` · ${payload.canonicalTracks} public tracks` : '';
        setCatalog(payload.readSource === 'private'
          ? { state: 'online', label: 'private read', detail: `Track Manager v${payload.trackManagerVersion || payload.version || '?'} · bridge v${payload.bridgeVersion || '?'}${count}` }
          : { state: 'degraded', label: 'public fallback', detail: `${payload.service || 'LaunchPAD media'}${payload.version != null ? ` v${payload.version}` : ''}${count}` });
      })
      .catch(error => active && setCatalog({ state: 'offline', label: 'offline', detail: String(error) }));

    getSonicTraceHealth()
      .then(payload => active && setSonic({ state: payload.status === 'ok' ? 'online' : 'degraded', label: payload.gpu_ready ? 'GPU ready' : (payload.status || 'online'), detail: `${payload.node_name || payload.service || 'SonicTrace'}${payload.version ? ` · ${payload.version}` : ''}` }))
      .catch(error => active && setSonic({ state: 'offline', label: 'local offline', detail: String(error) }));
    return () => { active = false; };
  }, []);

  const navTitle = trackId ? 'Track Workspace' : [...NAV, ...UTILITY_NAV].find(item => item.route === route)?.label || 'Studio';
  const privateRead = readSource === 'private';
  const readLayerLabel = privateRead ? 'Private' : readSource === 'public' ? 'Fallback' : '…';
  const readLayerDetail = privateRead ? 'Track Manager v5.18 · bridge v1.10' : readSource === 'public' ? 'LaunchPAD public read-only' : 'Checking Access session';

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <a className="brand" href={routeHref('dashboard')} aria-label="SHINOBIWAN Studio home"><div className="brand-mark"><span>S</span></div><div><strong>SHINOBIWAN</strong><small>STUDIO</small></div></a>
        <div className="nav-section-label">Studio</div>
        <nav className="nav-list" aria-label="Studio navigation">{NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)} aria-current={route === item.route ? 'page' : undefined}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        <nav className="nav-list nav-list-utility" aria-label="Studio utilities">{UTILITY_NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)} aria-current={route === item.route ? 'page' : undefined}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        <div className="sidebar-foot"><span className="phase-tag">PHASE UX</span><p>v{studioRelease.version} · Build {studioRelease.build}<br />Private production workspace</p></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div><span className="top-kicker">SHINOBIWAN / PRODUCTION STUDIO</span><h1>{navTitle}</h1></div><div className="top-actions">{adminMode && <span className="admin-badge">ADMIN UI</span>}<details className="system-status"><summary><span className={`system-status-dot ${catalog.state === 'offline' || sonic.state === 'offline' ? 'has-issue' : ''}`} />System status</summary><div className="system-status-popover"><ServicePill name="Catalog" status={catalog} /><ServicePill name="SonicTrace" status={sonic} /></div></details></div></header>

        {route === 'dashboard' && (
          <>
            <section className="hero-grid">
              <article className="hero-copy panel"><span className="eyebrow">YOUR MUSIC PRODUCTION COCKPIT</span><h2>Every track.<br /><em>Ready to move.</em></h2><p>Add music, manage releases, synchronize lyrics and launch audio analysis from one calm workspace.</p><div className="hero-actions"><a className="primary-btn" href={routeHref('catalog')}>Browse catalog <span>→</span></a><a className="ghost-btn" href={routeHref('albums')}>Manage releases</a></div></article>
              <article className="workflow-card panel"><div className="workflow-head"><span>TODAY'S WORKFLOW</span><b>TRACK-CENTRIC</b></div><ol><li><span>01</span><div><strong>Choose a track</strong><small>Find it fast in Catalog.</small></div></li><li><span>02</span><div><strong>Complete the work</strong><small>Metadata, media and lyrics stay together.</small></div></li><li><span>03</span><div><strong>Analyze and release</strong><small>SonicTrace and readiness at a glance.</small></div></li></ol></article>
            </section>
            <section className="status-grid"><article className="metric panel"><span>CATALOG ACCESS</span><strong>{readLayerLabel}</strong><small>{readLayerDetail}</small></article><article className="metric panel"><span>TRACK WORKSPACE</span><strong>Ready</strong><small>All production tools in context</small></article><article className="metric panel"><span>LYRICS ENGINE</span><strong>6.3.8</strong><small>Embedded sync + standalone fallback</small></article></section>
          </>
        )}

        {route === 'catalog' && (trackId ? <TrackWorkspace trackId={trackId} section={trackSection} /> : <CatalogView />)}
        {route === 'albums' && <><AlbumManager /><AlbumMigrationPanel /></>}
        {route === 'intelligence' && <CatalogIntelligenceView />}

        {route !== 'dashboard' && route !== 'catalog' && route !== 'albums' && route !== 'intelligence' && (
          <>
            <EmptyState eyebrow={shellCopy[route].eyebrow} title={shellCopy[route].title} body={shellCopy[route].body} />
            {route === 'administration' && (
              <>
                <CatalogRebuildPanel privateRead={privateRead} />
                <section className="tool-grid">
                  <a className="tool-card panel" href={adminService.fallbackUrl} target="_blank" rel="noreferrer"><b>LP</b><span>Track Manager</span><small>Protected fallback / legacy full surface ↗</small></a>
                  <a className="tool-card panel" href={studioConfig.sonicTraceUrl} target="_blank" rel="noreferrer"><b>ST</b><span>SonicTrace</span><small>Standalone engine fallback ↗</small></a>
                  <a className="tool-card panel" href={studioConfig.lrcMakerUrl} target="_blank" rel="noreferrer"><b>LM</b><span>LRC Maker</span><small>Advanced lyrics synchronization ↗</small></a>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}