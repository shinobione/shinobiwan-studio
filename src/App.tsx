import { useEffect, useMemo, useState } from 'react';
import { resolveAdminMode } from './admin-mode';
import { AlbumMigrationPanel } from './components/AlbumMigrationPanel';
import { AlbumHealthWorkspace } from './components/AlbumHealthWorkspace';
import { CatalogRebuildPanel } from './components/CatalogRebuildPanel';
import { CatalogView } from './components/CatalogView';
import { CatalogIntelligenceView } from './components/CatalogIntelligenceView';
import { EmptyState } from './components/EmptyState';
import { FocusHome } from './components/FocusHome';
import { ServicePill } from './components/ServicePill';
import { TrackWorkspace } from './components/TrackWorkspace';
import { WorkflowView } from './components/WorkflowView';
import { studioRelease } from './release';
import { readRoute, readTrackId, readTrackSection, routeHref } from './router';
import { adminService } from './services/admin-api';
import { getCatalogHealth } from './services/catalog-api';
import { studioConfig } from './services/config';
import { getSonicTraceHealth } from './services/sonictrace-api';
import type { ServiceStatus, StudioReadSource, StudioRoute, WorkspaceSection } from './types/studio';

const LAST_TRACK_KEY = 'shinobiwan-studio:last-track-id';
const SUPPORTED_PRIVATE_READ_LINEAGE = 'Track Manager v5.25 · bridge v1.15';

const DAILY_NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'dashboard', label: 'Home', glyph: '⌂' },
  { route: 'catalog', label: 'Tracks', glyph: '♫' },
  { route: 'albums', label: 'Albums', glyph: '▣' },
];

const TOOL_NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'intelligence', label: 'Intelligence', glyph: '◇' },
  { route: 'administration', label: 'System', glyph: '⌘' },
];

const ROUTE_TITLES: Partial<Record<StudioRoute, string>> = {
  dashboard: 'Home',
  catalog: 'Tracks',
  albums: 'Albums',
  workflow: 'Production queue',
  intelligence: 'Intelligence',
  administration: 'System',
  lyrics: 'Lyrics',
  assets: 'Assets',
  publishing: 'Publishing',
};

const shellCopy: Record<Exclude<StudioRoute, 'catalog' | 'albums' | 'workflow'>, { eyebrow: string; title: string; body: string }> = {
  dashboard: {
    eyebrow: 'STUDIO',
    title: 'Make the track. Finish the release.',
    body: 'Everything important, without the machinery getting in your way.',
  },
  intelligence: {
    eyebrow: 'INTELLIGENCE',
    title: 'Explore how your catalog sounds.',
    body: 'Similarity, analysis and sonic relationships stay here when you need them.',
  },
  lyrics: {
    eyebrow: 'LYRICS',
    title: 'Write and synchronize lyrics.',
    body: 'Open a Track and use its Lyrics tab.',
  },
  assets: {
    eyebrow: 'ASSETS',
    title: 'Manage media from the Track.',
    body: 'Audio, cover, Canvas and lyrics stay attached to the Track that owns them.',
  },
  publishing: {
    eyebrow: 'RELEASE',
    title: 'Prepare and review the release.',
    body: 'Open a Track and use its Release tab.',
  },
  administration: {
    eyebrow: 'SYSTEM',
    title: 'Maintenance and fallback tools.',
    body: 'Rare operations live here so daily production stays clean.',
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

  const navTitle = trackId ? 'Track' : ROUTE_TITLES[route] || 'Studio';
  const privateRead = readSource === 'private';
  const toolsActive = TOOL_NAV.some(item => item.route === route);

  return (
    <div className="studio-shell build110-human-first">
      <aside className="sidebar">
        <a className="brand" href={routeHref('dashboard')} aria-label="SHINOBIWAN Studio home"><div className="brand-mark"><span>S</span></div><div><strong>SHINOBIWAN</strong><small>STUDIO</small></div></a>
        <nav className="nav-list" aria-label="Studio navigation">{DAILY_NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)} aria-current={route === item.route ? 'page' : undefined}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        <details className="focus-advanced-nav" open={toolsActive ? true : undefined}>
          <summary>Tools</summary>
          <nav className="nav-list" aria-label="Studio tools">{TOOL_NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)} aria-current={route === item.route ? 'page' : undefined}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        </details>
        <div className="sidebar-foot"><p>v{studioRelease.version} · {studioRelease.build}</p></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><h1>{navTitle}</h1></div>
          <div className="top-actions">
            {adminMode && <span className="admin-badge">ADMIN</span>}
            <details className="system-status">
              <summary><span className={`system-status-dot ${catalog.state === 'offline' || sonic.state === 'offline' ? 'has-issue' : ''}`} />Status</summary>
              <div className="system-status-popover"><ServicePill name="Catalog" status={catalog} /><ServicePill name="SonicTrace" status={sonic} /><small className="system-release">Studio v{studioRelease.version} · Build {studioRelease.build}</small></div>
            </details>
          </div>
        </header>

        {route === 'dashboard' && <FocusHome />}
        {route === 'workflow' && <WorkflowView />}
        {route === 'catalog' && (trackId ? <TrackWorkspace trackId={trackId} section={trackSection} /> : <CatalogView />)}
        {route === 'albums' && <AlbumHealthWorkspace />}
        {route === 'intelligence' && <CatalogIntelligenceView />}

        {route !== 'dashboard' && route !== 'workflow' && route !== 'catalog' && route !== 'albums' && route !== 'intelligence' && (
          <>
            <EmptyState eyebrow={shellCopy[route].eyebrow} title={shellCopy[route].title} body={shellCopy[route].body} />
            {route === 'administration' && (
              <>
                <CatalogRebuildPanel privateRead={privateRead} />
                <section className="tool-grid">
                  <a className="tool-card panel" href={adminService.fallbackUrl} target="_blank" rel="noreferrer"><b>LP</b><span>Track Manager</span><small>Fallback ↗</small></a>
                  <a className="tool-card panel" href={studioConfig.sonicTraceUrl} target="_blank" rel="noreferrer"><b>ST</b><span>SonicTrace</span><small>Standalone ↗</small></a>
                  <a className="tool-card panel" href={studioConfig.lrcMakerUrl} target="_blank" rel="noreferrer"><b>LM</b><span>LRC Maker</span><small>Standalone ↗</small></a>
                </section>
                <details className="panel c3-album-maintenance">
                  <summary>Archived Album migration tools</summary>
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
