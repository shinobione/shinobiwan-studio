import { useState } from 'react';
import { Phase4AdminError, rebuildAdminCatalog, type CatalogRebuildResponse } from '../services/phase4-admin-api';

function errorText(reason: unknown): string {
  if (reason instanceof Phase4AdminError) return [reason.message, reason.code].filter(Boolean).join(' · ');
  return reason instanceof Error ? reason.message : String(reason);
}

export function CatalogRebuildPanel({ privateRead }: { privateRead: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CatalogRebuildResponse | null>(null);

  async function rebuild() {
    if (!privateRead || busy) return;
    if (!globalThis.confirm('REBUILD the canonical catalog/index.json from current R2 manifests?\n\nThis does not edit any track or media object. It republishes the catalog projection only.')) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const next = await rebuildAdminCatalog();
      setResult(next);
    } catch (reason) {
      setError(errorText(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="panel phase4-rebuild-panel">
      <div className="phase4-panel-head">
        <div><span className="eyebrow">TRACK MANAGER / CATALOG</span><h3>Explicit catalog rebuild</h3></div>
        <b>{privateRead ? 'BRIDGE v1.5' : 'LOCKED'}</b>
      </div>
      <p className="workspace-muted">Rebuilds only <strong>catalog/index.json</strong> from current canonical manifests. It does not mutate track metadata or media.</p>
      <button className="primary-btn" type="button" disabled={!privateRead || busy} onClick={() => void rebuild()}>{busy ? 'Rebuilding…' : 'Rebuild canonical catalog'}</button>
      {result && (
        <div className={`phase4-operation-result ${result.clientVerified ? 'ok' : 'warning'}`}>
          <strong>CATALOG REBUILT</strong>
          <span>{result.catalogCount ?? '—'} tracks · generated {result.catalogGeneratedAt || '—'} · canonical reread {result.clientVerified ? 'verified' : 'check required'}</span>
        </div>
      )}
      {error && <div className="phase4-operation-error"><strong>REBUILD ERROR</strong><span>{error}</span></div>}
    </article>
  );
}
