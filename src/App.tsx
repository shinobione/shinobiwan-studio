import { useEffect, useMemo, useState } from 'react';
import { resolveAdminMode } from './admin-mode';
import { CatalogRebuildPanel } from './components/CatalogRebuildPanel';
import { CatalogView } from './components/CatalogView';
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
    eyebrow: 'PHASE 4 / COMPLETE',
    title: 'Track Manager is now integrated into Studio.',
    body: 'Principal Track Manager operations are available from the Studio workspace: draft creation, metadata, canonical lyrics, asset upload/replace/delete and explicit catalog rebuild. The standalone Track Manager remains the protected fallback.',
  },
  intelligence: {
    eyebrow: 'SONICTRACE / STOP LINE',
    title: 'Audio Intelligence remains deliberately unchanged.',
    body: 'Phase 4 is complete. SonicTrace catalog persistence belongs to Phase 5 and is intentionally not started until new instructions are provided.',
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
    body: 'The old Track Manager remains available as the protected fallback. The explicit canonical catalog rebuild is also available here. SonicTrace and LRC Maker remain separate and untouched.',
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

  const navTitle = trackId ? 'Track Workspace' : NAV.find(item => item.route === route)?.label;
  const privateRead = readSource === 'private';
  const readLayerLabel = privateRead ? 'Private' : readSource === 'public' ? 'Fallback' : '…';
  const readLayerDetail = privateRead ? 'Track Manager v5.13 · bridge v1.5' : readSource === 'public' ? 'LaunchPAD public read-only' : 'Checking Access session';

  return (
    <div className="studio-shell">
      <aside className="sidebar">
        <a className="brand" href={routeHref('dashboard')} aria-label="SHINOBIWAN Studio home"><div className="brand-mark"><span>S</span></div><div><strong>SHINOBIWAN</strong><small>STUDIO</small></div></a>
        <nav className="nav-list" aria-label="Studio navigation">{NAV.map(item => <a key={item.route} className={route === item.route ? 'active' : ''} href={routeHref(item.route)}><span className="nav-glyph" aria-hidden="true">{item.glyph}</span><span>{item.label}</span></a>)}</nav>
        <div className="sidebar-foot"><span className="phase-tag">PHASE 4 · COMPLETE</span><p>v{studioRelease.version} · Build {studioRelease.build}<br />Track Manager integrated.</p></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div><span className="top-kicker">Artist Content & Intelligence Manager</span><h1>{navTitle}</h1></div><div className="top-actions"><ServicePill name="Catalog" status={catalog} /><ServicePill name="SonicTrace" status={sonic} />{adminMode && <span className="admin-badge">ADMIN UI</span>}</div></header>

        {route === 'dashboard' && (
          <>
            <section className="hero-grid">
              <article className="hero-copy panel"><span className="eyebrow">SHINOBIWAN STUDIO / {studioRelease.version} · BUILD {studioRelease.build}</span><h2>One track.<br /><em>One workspace.</em></h2><p>The global cockpit for catalog data, synchronized lyrics, canonical assets and publishing. Phase 4 Track Manager integration is complete.</p><div className="hero-actions"><a className="primary-btn" href={routeHref('catalog')}>Open Track Workspace <span>→</span></a><a className="ghost-btn" href={studioConfig.launchpadUrl} target="_blank" rel="noreferrer">LaunchPAD ↗</a></div></article>
              <article className="architecture-card panel"><div className="arch-head"><span>ARCHITECTURE</span><b>TRACK-CENTRIC</b></div><div className="track-core"><span>TRACK ID</span><strong>canonical slug</strong><small>R2 source of truth</small></div><div className="arch-branches"><div><span>CATALOG</span><strong>R2</strong></div><div><span>TRACK MANAGER</span><strong>TM</strong></div><div><span>LYRICS</span><strong>TXT</strong></div></div></article>
            </section>
            <section className="status-grid"><article className="metric panel"><span>READ LAYER</span><strong>{readLayerLabel}</strong><small>{readLayerDetail}</small></article><article className="metric panel"><span>WORKSPACE</span><strong>Live</strong><small>Create + metadata + lyrics + assets</small></article><article className="metric panel"><span>OPERATIONS</span><strong>TM v5.13</strong><small>Create · Upload · Replace · Delete asset · Rebuild</small></article><article className="metric panel"><span>NEXT</span><strong>STOP</strong><small>Phase 5 waits for new instructions</small></article></section>
            <EmptyState eyebrow={shellCopy.dashboard.eyebrow} title={shellCopy.dashboard.title} body={shellCopy.dashboard.body} />
          </>
        )}

        {route === 'catalog' && (trackId ? <TrackWorkspace trackId={trackId} section={trackSection} /> : <CatalogView />)}

        {route !== 'dashboard' && route !== 'catalog' && (
          <>
            <EmptyState eyebrow={shellCopy[route].eyebrow} title={shellCopy[route].title} body={shellCopy[route].body} />
            {route === 'administration' && (
              <>
                <CatalogRebuildPanel privateRead={privateRead} />
                <section className="tool-grid">
                  <a className="tool-card panel" href={adminService.fallbackUrl} target="_blank" rel="noreferrer"><b>LP</b><span>Track Manager</span><small>Protected fallback / legacy full surface ↗</small></a>
                  <a className="tool-card panel" href={studioConfig.sonicTraceUrl} target="_blank" rel="noreferrer"><b>ST</b><span>SonicTrace</span><small>Phase 5 boundary · unchanged ↗</small></a>
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
