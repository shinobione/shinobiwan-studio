import { useEffect, useMemo, useState } from 'react';
import { resolveAdminMode } from './admin-mode';
import { AlbumMigrationPanel } from './components/AlbumMigrationPanel';
import { AlbumsWorkspace } from './components/AlbumsWorkspace';
import { CatalogRebuildPanel } from './components/CatalogRebuildPanel';
import { CatalogView } from './components/CatalogView';
import { CatalogIntelligenceView } from './components/CatalogIntelligenceView';
import { EmptyState } from './components/EmptyState';
import { FocusHome } from './components/FocusHome';
import { ServicePill } from './components/ServicePill';
import { TrackWorkspace } from './components/TrackWorkspace';
import { WorkflowView } from './components/WorkflowView';
import { installLegacyTrackTypeDisplay } from './legacy-track-type-display';
import { studioRelease } from './release';
import { readRoute, readTrackId, readTrackSection, routeHref } from './router';
import { adminService } from './services/admin-api';
import { getCatalogHealth } from './services/catalog-api';
import { studioConfig } from './services/config';
import { getSonicTraceHealth } from './services/sonictrace-api';
import type { ServiceStatus, StudioReadSource, StudioRoute, WorkspaceSection } from './types/studio';
import './studio-focus-build63-smoke2.css';

const LAST_TRACK_KEY = 'shinobiwan-studio:last-track-id';
const SUPPORTED_PRIVATE_READ_LINEAGE = 'Track Manager v5.19 · bridge v1.11';

const DAILY_NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'dashboard', label: 'Home', glyph: '⌂' },
  { route: 'catalog', label: 'Tracks', glyph: '♫' },
  { route: 'albums', label: 'Albums', glyph: '▣' },
];

const ADVANCED_NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'workflow', label: 'Workflow', glyph: '↳' },
  { route: 'intelligence', label: 'Intelligence', glyph: '◇' },
  { route: 'administration', label: 'System', glyph: '⌘' },
];

const shellCopy: Record<Exclude<StudioRoute, 'catalog' | 'albums' | 'workflow'>, { eyebrow: string; title: string; body: string }> = {
  dashboard: {
    eyebrow: 'STUDIO FOCUS',
    title: 'Make the track. Finish the release.',
    body: 'Studio keeps the validated canonical machinery underneath and puts daily artist work first.',
  },
  intelligence: {
    eyebrow: 'SONICTRACE / C3',
    title: 'Audio Intelligence is catalog-linked.',
    body: 'SonicTrace analyses are persisted as private R2 sidecars under the canonical trackId, with truthful FULL/PARTIAL/UNAVAILABLE status, 512D similarity, history and source-version freshness checks.',
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
    eyebrow: 'ADVANCED / SYSTEM',
    title: 'Operational fallbacks and maintenance stay out of daily workflows.',
    body: 'Track Manager remains the protected write authority and fallback. Completed migration tooling is archived here instead of being mixed into normal artist work.',
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

  useEffect(() => installLegacyTrackTypeDisplay(), []);

  useEffect(() => {
    const syncLocation = () => { setRoute(readRoute()); setTrackId(readTrackId()); setTrackSection(readTrackSection()); };
    globalThis.addEventListener('hashchange', syncLocation);
    if (!globalThis.location.hash) globalThis.location.hash = routeHref('dashboard');
    return () => globalThis.removeEventListener('hashchange', syncLocation);
  }, []);

  useEffect(() => {
    if (!trackId) return;
    try { globalThis.localStorage?.setItem(LAST_TRACK_KEY, trackId); } catch { /* Local continuation is optional. */ }
  }, [trackId]);

  useEffect(() => {
    let active = true;
    getCatalogHealth()
      .then(payload => {
        if (!active) return;
        setReadSource(payload.readSource);
        const count = payload.canonicalTracks != null ? ` · ${payload.canonicalTracks} public tracks` : '';
        const liveLineage = payload.trackManagerVersion || payload.version || payload.bridgeVersion
          ? `Track Manager v${payload.trackManagerVersion || payload.version || '?'} · bridge v${payload.bridgeVersion || '?'}`
          : SUPPORTED_PRIVATE_READ_LINEAGE;
        setCatalog(payload.readSource === 'private'
          ? { state: 'online', label: 'private read', detail: `${liveLineage}${count}` }
          : { state: 'degraded', label: 'public fallback', detail: `${payload.service || 'LaunchPAD media'}${payload.version != null ? ` v${payload.version}` : ''}${count}` });
      })
      .catch(error => active && setCatalog({ state: 'offline', label: 'offline', detail: String(error) }));

    getSonicTraceHealth()
      .then(payload => active && setSonic({ state: payload.status === 'ok' ? 'online' : 'degraded', label: payload.gpu_ready ? 'GPU ready' : (payload.status || 'online'), detail: `${payload.node_name || payload.service || 'SonicTrace'}${payload.version ? ` · ${payload.version}` : ''}` }))
      .catch(error => active && setSonic({ state: 'offline', label: 'local offline', detail: String(error) }));
    return () => { active = false; };
  }, []);

  const navTitle = trackId ? 'Track Workspace' : [...DAILY_NAV, ...ADVANCED_NAV].find(item => item.route === route)?.label || 'Studio';
  const privateRead = readSource === 'private';
  const advancedActive = ADVANCED_NAV.some(item => item.route === route);

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <a className="brand" href={routeHref('dashboard')} aria-label="SHINOBIWAN Studio home"><div className="brand-mark"><span>S</span></div><div><strong>SHINOBIWAN</strong><small>STUDIO</small></div></a>
        <div className="nav-section-label">Studio</div>
        <nav className="nav-list" aria-label="Studio navigation">{DAILY_NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)} aria-current={route === item.route ? 'page' : undefined}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        <details className="focus-advanced-nav" open={advancedActive ? true : undefined}>
          <summary>Advanced</summary>
          <nav className="nav-list" aria-label="Advanced Studio navigation">{ADVANCED_NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)} aria-current={route === item.route ? 'page' : undefined}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        </details>
        <div className="sidebar-foot"><span className="phase-tag">PHASE 7-B</span><p>v{studioRelease.version} · Build {studioRelease.build}<br />Production-first workspace</p></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div><span className="top-kicker">SHINOBIWAN / PRODUCTION STUDIO</span><h1>{navTitle}</h1></div><div className="top-actions">{adminMode && <span className="admin-badge">ADMIN UI</span>}<details className="system-status"><summary><span className={`system-status-dot ${catalog.state === 'offline' || sonic.state === 'offline' ? 'has-issue' : ''}`} />System status</summary><div className="system-status-popover"><ServicePill name="Catalog" status={catalog} /><ServicePill name="SonicTrace" status={sonic} /></div></details></div></header>

        {route === 'dashboard' && <FocusHome />}
        {route === 'workflow' && <WorkflowView />}
        {route === 'catalog' && (trackId ? <TrackWorkspace trackId={trackId} section={trackSection} /> : <CatalogView />)}
        {route === 'albums' && <AlbumsWorkspace />}
        {route === 'intelligence' && <CatalogIntelligenceView />}

        {route !== 'dashboard' && route !== 'workflow' && route !== 'catalog' && route !== 'albums' && route !== 'intelligence' && (
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
                <details className="panel c3-album-maintenance">
                  <summary>Album migration archive · C2.5 complete</summary>
                  <p className="c3-album-maintenance-copy">Historical one-Album-at-a-time migration tooling is preserved for diagnostics and audit, but removed from the daily Albums workspace. It stays closed by default.</p>
                  <AlbumMigrationPanel />
                </details>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
