import { useMemo, useState } from 'react';
import { trackHref } from '../router';
import type { AdminMetadataPatch } from '../services/admin-api';
import { createAdminTrack, Phase4AdminError } from '../services/phase4-admin-api';

function canonicalSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function errorText(reason: unknown): string {
  if (reason instanceof Phase4AdminError) return [reason.message, reason.code].filter(Boolean).join(' · ');
  return reason instanceof Error ? reason.message : String(reason);
}

export function TrackCreatePanel({ privateRead, onCreated }: { privateRead: boolean; onCreated?: () => Promise<void> | void }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [albumTitle, setAlbumTitle] = useState('Singles');
  const [languages, setLanguages] = useState('English');
  const [genres, setGenres] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedSlug = useMemo(() => canonicalSlug(title), [title]);
  const effectiveSlug = slug.trim() || suggestedSlug;
  const canSubmit = privateRead && title.trim().length > 0 && /^[a-z0-9][a-z0-9-]{0,119}$/.test(effectiveSlug) && !busy;

  async function create() {
    if (!canSubmit) return;
    const metadata: AdminMetadataPatch = {
      title: title.trim(),
      type: 'single',
      album: { id: canonicalSlug(albumTitle) || 'singles', title: albumTitle.trim() || 'Singles' },
      languages: languages.split(',').map(value => value.trim()).filter(Boolean),
      genres: genres.split(',').map(value => value.trim()).filter(Boolean),
      tags: genres.split(',').map(value => value.trim()).filter(Boolean),
    };
    if (!globalThis.confirm(`Create draft track "${title.trim()}"?\n\ntrackId: ${effectiveSlug}\n\nThis creates only the draft manifest and rebuilds the catalog. Media stays empty until you upload assets from the Track Workspace.`)) return;
    setBusy(true);
    setError(null);
    try {
      const result = await createAdminTrack(effectiveSlug, metadata);
      if (!result.clientVerified) throw new Phase4AdminError('Track was created but Studio could not verify the canonical draft reread. Open Track Manager before continuing.');
      await onCreated?.();
      globalThis.location.hash = trackHref(effectiveSlug, 'assets').replace(/^#/, '');
    } catch (reason) {
      setError(errorText(reason));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="panel phase4-create-panel">
      <div className="phase4-panel-head">
        <div><span className="eyebrow">TRACK MANAGER / CREATE</span><h3>Create canonical draft</h3></div>
        <b>{privateRead ? 'BRIDGE v1.5' : 'LOCKED'}</b>
      </div>
      <p className="workspace-muted">Creation is intentionally manifest-only and always starts as <strong>draft</strong>. Upload audio, cover, thumbnail, lyrics TXT and Canvas from the new track workspace afterward.</p>
      <div className="phase4-create-grid">
        <label><span>Title</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Track title" /></label>
        <label><span>trackId / slug</span><input value={slug} onChange={event => setSlug(canonicalSlug(event.target.value))} placeholder={suggestedSlug || 'canonical-slug'} /></label>
        <label><span>Album</span><input value={albumTitle} onChange={event => setAlbumTitle(event.target.value)} /></label>
        <label><span>Languages</span><input value={languages} onChange={event => setLanguages(event.target.value)} placeholder="English, French" /></label>
        <label className="wide"><span>Genres</span><input value={genres} onChange={event => setGenres(event.target.value)} placeholder="R&B, Hip-hop" /></label>
      </div>
      <div className="phase4-create-actions">
        <div><span>Resulting trackId</span><strong>{effectiveSlug || '—'}</strong></div>
        <button className="primary-btn" type="button" disabled={!canSubmit} onClick={() => void create()}>{busy ? 'Creating…' : 'Create draft track'}</button>
      </div>
      {error && <div className="phase4-operation-error"><strong>CREATE ERROR</strong><span>{error}</span></div>}
    </article>
  );
}
