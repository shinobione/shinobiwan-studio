import { useEffect, useState } from 'react';
import { catalogueHref, readCatalogueRoute, type CatalogueSection } from '../catalogue-router';
import './commercial-catalogue.css';
import { useCatalogueSession } from '../catalogue/useCatalogueSession';
import { CatalogueImport } from './CatalogueImport';
import { FictionalPackageLab } from './FictionalPackageLab';

const SECTIONS: Array<{ section: CatalogueSection | 'lab'; label: string }> = [
  { section: 'overview', label: 'Overview' },
  { section: 'releases', label: 'Releases' },
  { section: 'recordings', label: 'Recordings' },
  { section: 'qa', label: 'QA' },
  { section: 'lab', label: 'Fictional package lab' },
];

const EMPTY_COPY: Record<CatalogueSection, { title: string; body: string }> = {
  overview: { title: 'Your commercial discography starts here.', body: 'Explore releases, recordings and their evidence from a historical snapshot you choose.' },
  releases: { title: 'No commercial releases loaded.', body: 'Singles, EPs and albums will appear here with documented artwork and release evidence.' },
  recordings: { title: 'No recordings loaded.', body: 'A recording can appear on several releases. Unknown ISRCs stay unknown, and Studio links require reviewed evidence.' },
  qa: { title: 'No reconciliation cases loaded.', body: 'Source evidence, unresolved matches and uncertain publication dates will stay visible here for review.' },
};

export function CommercialCatalogue() {
  const session = useCatalogueSession();
  const [route, setRoute] = useState(readCatalogueRoute);

  useEffect(() => {
    // Own the subroute: the parent StudioRoute stays 'catalogue' on these changes.
    const syncLocation = () => setRoute(readCatalogueRoute());
    globalThis.addEventListener('hashchange', syncLocation);
    syncLocation();
    return () => globalThis.removeEventListener('hashchange', syncLocation);
  }, []);

  // Entering the sealed synthetic lab discards any real in-memory imported source.
  // The lab has no Snapshot prop, CommercialCatalogue writer or data-sharing path.
  useEffect(() => { if (route.section === 'lab') session.onReset(); }, [route.section]);

  const missing = route.section === 'not-found' || route.id !== undefined;
  const copy = route.section === 'not-found' || route.section === 'lab' ? null : EMPTY_COPY[route.section];

  return (
    <section className="commercial-catalogue" aria-label="Commercial Catalogue">
      <header className="commercial-catalogue-heading">
        <div>
          <p className="commercial-catalogue-eyebrow">COMMERCIAL DISCOGRAPHY</p>
          <h2>Every release. Its own story.</h2>
          <p>Recordings, releases and the evidence that connects them.</p>
        </div>
        <div className="commercial-catalogue-badges" aria-label="Catalogue data status">
          <span>Read-only</span><span>Local-private dry-run</span>
        </div>
      </header>

      <nav className="commercial-catalogue-nav" aria-label="Catalogue sections">
        {SECTIONS.map(({ section, label }) => (
          <a key={section} href={catalogueHref({ section })} aria-current={route.section === section ? 'page' : undefined}>{label}</a>
        ))}
      </nav>

      <div className="commercial-catalogue-empty">
        <p className="commercial-catalogue-eyebrow">{missing ? 'NOT FOUND' : 'LOCAL SOURCE PREVIEW'}</p>
        {missing && <><h3>Catalogue item not found.</h3><p>This address is invalid or the item is not available in this session.</p></>}
        {missing ? (
          <a className="commercial-catalogue-link" href={catalogueHref({ section: 'overview' })}>Back to Catalogue overview →</a>
        ) : route.section === 'lab' ? (
          <FictionalPackageLab />
        ) : (
          <CatalogueImport {...session} section={route.section as CatalogueSection} emptyCopy={copy!} />
        )}
      </div>
      <p className="commercial-catalogue-footnote">A historical snapshot is not live publication status. Your creative Tracks and Albums remain in their own workspaces.</p>
    </section>
  );
}
