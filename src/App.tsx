import { useEffect, useMemo, useState } from 'react';
import { resolveAdminMode } from './admin-mode';
import { EmptyState } from './components/EmptyState';
import { ServicePill } from './components/ServicePill';
import { readRoute, routeHref } from './router';
import { adminService } from './services/admin-api';
import { getCatalogHealth } from './services/catalog-api';
import { studioConfig } from './services/config';
import { getSonicTraceHealth } from './services/sonictrace-api';
import type { ServiceStatus, StudioRoute } from './types/studio';

const NAV: Array<{ route: StudioRoute; label: string; glyph: string }> = [
  { route: 'dashboard', label: 'Dashboard', glyph: '◫' },
  { route: 'catalog', label: 'Catalog', glyph: '♫' },
  { route: 'intelligence', label: 'Audio Intelligence', glyph: '◇' },
  { route: 'lyrics', label: 'Lyrics', glyph: '≋' },
  { route: 'assets', label: 'Assets', glyph: '▧' },
  { route: 'publishing', label: 'Publishing', glyph: '↗' },
  { route: 'administration', label: 'Administration', glyph: '⌘' },
];

const shellCopy: Record<StudioRoute, { eyebrow: string; title: string; body: string }> = {
  dashboard: {
    eyebrow: 'STUDIO / HOME',
    title: 'Your catalog command center.',
    body: 'Phase 1 establishes the shell. Catalog intelligence, content health and recent activity arrive in their dedicated roadmap phases.',
  },
  catalog: {
    eyebrow: 'CATALOG / READ LAYER',
    title: 'Catalog surface reserved.',
    body: 'Phase 2 will hydrate this view from the canonical LaunchPAD public catalog without enabling writes.',
  },
  intelligence: {
    eyebrow: 'SONICTRACE / INTELLIGENCE',
    title: 'Audio Intelligence boundary ready.',
    body: 'The Studio service layer can already probe SonicTrace. Track-scoped analysis and persistence remain intentionally gated until Phase 5.',
  },
  lyrics: {
    eyebrow: 'LYRICS / LRC',
    title: 'Lyrics workspace boundary ready.',
    body: 'LRC Maker remains the external synchronization engine until the context bridge and R2 LRC sidecar workflow are implemented.',
  },
  assets: {
    eyebrow: 'CONTENT / ASSETS',
    title: 'Asset management boundary ready.',
    body: 'Audio, cover, thumbnail, video and lyrics remain owned by R2. Destructive browser writes are disabled in this shell.',
  },
  publishing: {
    eyebrow: 'CATALOG / PUBLISHING',
    title: 'Publishing stays protected.',
    body: 'Catalog rebuild and publication actions remain in Track Manager until the authenticated Phase 4 write path is proven.',
  },
  administration: {
    eyebrow: 'SYSTEM / ADMINISTRATION',
    title: 'Legacy tools remain available as fallbacks.',
    body: 'The new Studio does not rip out working tools. It will absorb their workflows progressively while preserving recovery paths.',
  },
};

const checking: ServiceStatus = { state: 'checking', label: 'checking', detail: 'Checking service availability…' };

export default function App() {
  const [route, setRoute] = useState<StudioRoute>(() => readRoute());
  const [catalog, setCatalog] = useState<ServiceStatus>(checking);
  const [sonic, setSonic] = useState<ServiceStatus>(checking);
  const adminMode = useMemo(resolveAdminMode, []);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    globalThis.addEventListener('hashchange', onHash);
    if (!globalThis.location.hash) globalThis.location.hash = routeHref('dashboard');
    return () => globalThis.removeEventListener('hashchange', onHash);
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

  const copy = shellCopy[route];

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
          <span className="phase-tag">PHASE 1 · SHELL</span>
          <p>Read-first foundation.<br />No production writes.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="top-kicker">Artist Content & Intelligence Manager</span>
            <h1>{NAV.find(item => item.route === route)?.label}</h1>
          </div>
          <div className="top-actions">
            <ServicePill name="Catalog" status={catalog} />
            <ServicePill name="SonicTrace" status={sonic} />
            {adminMode && <span className="admin-badge">ADMIN UI</span>}
          </div>
        </header>

        <section className="hero-grid">
          <article className="hero-copy panel">
            <span className="eyebrow">SHINOBIWAN STUDIO / 0.1.0</span>
            <h2>One track.<br /><em>One workspace.</em></h2>
            <p>The global cockpit for catalog data, SonicTrace intelligence, synchronized lyrics, assets and publishing.</p>
            <div className="hero-actions">
              <a className="primary-btn" href={routeHref('catalog')}>Open catalog <span>→</span></a>
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
          <article className="metric panel"><span>SONICTRACE</span><strong>{sonic.state === 'online' ? sonic.label : 'Local node'}</strong><small>Optional GPU intelligence</small></article>
          <article className="metric panel"><span>WRITES</span><strong>Locked</strong><small>Phase 4 security gate</small></article>
          <article className="metric panel"><span>CONTRACT</span><strong>Frozen</strong><small>trackId = R2 slug</small></article>
        </section>

        <EmptyState eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />

        {route === 'administration' && (
          <section className="tool-grid">
            <a className="tool-card panel" href={adminService.fallbackUrl} target="_blank" rel="noreferrer"><b>LP</b><span>Track Manager</span><small>Protected write fallback ↗</small></a>
            <a className="tool-card panel" href={studioConfig.sonicTraceUrl} target="_blank" rel="noreferrer"><b>ST</b><span>SonicTrace</span><small>Audio Intelligence ↗</small></a>
            <a className="tool-card panel" href={studioConfig.lrcMakerUrl} target="_blank" rel="noreferrer"><b>LM</b><span>LRC Maker</span><small>Lyrics synchronization ↗</small></a>
          </section>
        )}
      </main>
    </div>
  );
}
