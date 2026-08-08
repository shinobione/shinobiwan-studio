import { useEffect, useMemo, useState } from 'react';
import { resolveAdminMode } from './admin-mode';
import { CatalogView } from './components/CatalogView';
import { EmptyState } from './components/EmptyState';
import { ServicePill } from './components/ServicePill';
import { TrackWorkspace } from './components/TrackWorkspace';
import { readRoute, readTrackId, readTrackSection, routeHref } from './router';
import { adminService } from './services/admin-api';
import { getCatalogHealth } from './services/catalog-api';
import { studioConfig } from './services/config';
import { getSonicTraceHealth } from './services/sonictrace-api';
import type { ServiceStatus, StudioRoute, WorkspaceSection } from './types/studio';

const NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'dashboard', label: 'Dashboard', glyph: '◫' },
  { route: 'catalog', label: 'Catalog', glyph: '♫' },
  { route: 'intelligence', label: 'Audio Intelligence', glyph: '◇' },
  { route: 'lyrics', label: 'Lyrics', glyph: '≋' },
  { route: 'assets', label: 'Assets', glyph: '▧' },
  { route: 'publishing', label: 'Publishing', glyph: '↗' },
  { route: 'administration', label: 'Administration', glyph: '⌘' },
];

const shellCopy: Record<Exclude<StudioRoute, 'catalog'>, { eyebrow: string; title: string; body: string }> = {
  dashboard: {
    eyebrow: 'STUDIO / HOME',
    title: 'Track Workspace is online.',
    body: 'Phase 3 turns every published catalog track into a read-only workspace with deterministic Content Health and dedicated operational sections.',
  },
  intelligence: {
    eyebrow: 'SONICTRACE / INTELLIGENCE',
    title: 'Audio Intelligence boundary ready.',
    body: 'Track Workspace now has a dedicated intelligence section. Analysis persistence remains intentionally gated until Phase 5.',
  },
  lyrics: {
    eyebrow: 'LYRICS / LRC',
    title: 'Lyrics workspace boundary ready.',
    body: 'Each track can now expose catalog lyrics in context. The real LRC bridge and R2 sidecar workflow remain Phase 6 work.',
  },
  assets: {
    eyebrow: 'CONTENT / ASSETS',
    title: 'Canonical assets are visible per track.',
    body: 'Track Workspace can inspect R2-backed public assets. Replace/upload actions remain protected until the authenticated Phase 4 path.',
  },
  publishing: {
    eyebrow: 'CATALOG / PUBLISHING',
    title: 'Publishing status is visible, writes stay protected.',
    body: 'Each track now has a Publishing section, while rebuild and publication writes remain in Track Manager until Phase 4.',
  },
  administration: {
    eyebrow: 'SYSTEM / ADMINISTRATION',
    title: 'Legacy tools remain available as fallbacks.',
    body: 'The Studio absorbs workflows progressively while Track Manager, SonicTrace and LRC Maker remain available as recovery paths.',
  },
};

const checking: ServiceStatus = { state: 'checking', label: 'checking', detail: 'Checking service availability…' };

export default function App() {
  const [route, setRoute] = useState<StudioRoute>(() => readRoute());
  const [trackId, setTrackId] = useState<string | null>(() => readTrackId());
  const [trackSection, setTrackSection] = useState<WorkspaceSection>(() => readTrackSection());
  const [catalog, setCatalog] = useState<ServiceStatus>(checking);
  const [sonic, setSonic] = useState<ServiceStatus>(checking);
  const adminMode = useMemo(resolveAdminMode, []);

  useEffect(() => {
    const syncLocation = () => {
      setRoute(readRoute());
      setTrackId(readTrackId());
      setTrackSection(readTrackSection());
    };
    globalThis.addEventListener('hashchange', syncLocation);
    if (!globalThis.location.hash) globalThis.location.hash = routeHref('dashboard');
    return () => globalThis.removeEventListener('hashchange', syncLocation);
  }, []);

  useEffect(() => {
    let active = true;
    getCatalogHealth()
      .then(payload => active && setCatalog({
        state: payload.ok === false ? 'degraded' : 'online',
        label: payload.canonicalTracks != null ? `${payload.canonicalTracks} tracks` : 'online',
        detail: `${payload.service || 'LaunchPAD media'}${payload.version != null ? ` v${payload.version}` : ''}`,
      }))
      .catch(error => active && setCatalog({ state: 'offline', label: 'offline', detail: String(error) }));

    getSonicTraceHealth()
      .then(payload => active && setSonic({
        state: payload.status === 'ok' ? 'online' : 'degraded',
        label: payload.gpu_ready ? 'GPU ready' : (payload.status || 'online'),
        detail: `${payload.node_name || payload.service || 'SonicTrace'}${payload.version ? ` · ${payload.version}` : ''}`,
      }))
      .catch(error => active && setSonic({ state: 'offline', label: 'local offline', detail: String(error) }));

    return () => { active = false; };
  }, []);

  const navTitle = trackId ? 'Track Workspace' : NAV.find(item => item.route === route)?.label;

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <a className="brand" href={routeHref('dashboard')} aria-label="SHINOBIWAN Studio home">
          <div className="brand-mark"><span>S</span></div>
          <div><strong>SHINOBIWAN</strong><small>STUDIO</small></div>
        </a>

        <nav className="nav-list" aria-label="Studio navigation">
          {NAV.map(item => (
            <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)}>
              <span className="nav-glyph" aria-hidden="true">{item.glyph}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-foot">
          <span className="phase-tag">PHASE 3 · WORKSPACE</span>
          <p>Track-centric context.<br />Production writes locked.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="top-kicker">Artist Content & Intelligence Manager</span>
            <h1>{navTitle}</h1>
          </div>
          <div className="top-actions">
            <ServicePill name="Catalog" status={catalog} />
            <ServicePill name="SonicTrace" status={sonic} />
            {adminMode && <span className="admin-badge">ADMIN UI</span>}
          </div>
        </header>

        {route === 'dashboard' && (
          <>
            <section className="hero-grid">
              <article className="hero-copy panel">
                <span className="eyebrow">SHINOBIWAN STUDIO / 0.3.1</span>
                <h2>One track.<br /><em>One workspace.</em></h2>
                <p>The global cockpit for catalog data, SonicTrace intelligence, synchronized lyrics, assets and publishing.</p>
                <div className="hero-actions">
                  <a className="primary-btn" href={routeHref('catalog')}>Open Track Workspace <span>→</span></a>
                  <a className="ghost-btn" href={studioConfig.launchpadUrl} target="_blank" rel="noreferrer">LaunchPAD ↗</a>
                </div>
              </article>

              <article className="architecture-card panel">
                <div className="arch-head"><span>ARCHITECTURE</span><b>TRACK-CENTRIC</b></div>
                <div className="track-core"><span>TRACK ID</span><strong>canonical slug</strong><small>R2 source of truth</small></div>
                <div className="arch-branches">
                  <div><span>CATALOG</span><strong>R2</strong></div>
                  <div><span>INTELLIGENCE</span><strong>ST</strong></div>
                  <div><span>LYRICS</span><strong>LRC</strong></div>
                </div>
              </article>
            </section>

            <section className="status-grid">
              <article className="metric panel"><span>CATALOG</span><strong>{catalog.state === 'online' ? catalog.label : '—'}</strong><small>LaunchPAD public read layer</small></article>
              <article className="metric panel"><span>WORKSPACE</span><strong>Live</strong><small>7 contextual sections per track</small></article>
              <article className="metric panel"><span>CONTENT HEALTH</span><strong>V1</strong><small>Deterministic completeness score</small></article>
              <article className="metric panel"><span>WRITES</span><strong>Locked</strong><small>Phase 4 security gate</small></article>
            </section>

            <EmptyState eyebrow={shellCopy.dashboard.eyebrow} title={shellCopy.dashboard.title} body={shellCopy.dashboard.body} />
          </>
        )}

        {route === 'catalog' && (trackId
          ? <TrackWorkspace trackId={trackId} section={trackSection} />
          : <CatalogView />)}

        {route !== 'dashboard' && route !== 'catalog' && (
          <>
            <EmptyState eyebrow={shellCopy[route].eyebrow} title={shellCopy[route].title} body={shellCopy[route].body} />

            {route === 'administration' && (
              <section className="tool-grid">
                <a className="tool-card panel" href={adminService.fallbackUrl} target="_blank" rel="noreferrer"><b>LP</b><span>Track Manager</span><small>Protected write fallback ↗</small></a>
                <a className="tool-card panel" href={studioConfig.sonicTraceUrl} target="_blank" rel="noreferrer"><b>ST</b><span>SonicTrace</span><small>Audio Intelligence ↗</small></a>
                <a className="tool-card panel" href={studioConfig.lrcMakerUrl} target="_blank" rel="noreferrer"><b>LM</b><span>LRC Maker</span><small>Lyrics synchronization ↗</small></a>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
