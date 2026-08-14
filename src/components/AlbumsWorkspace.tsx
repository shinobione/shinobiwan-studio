import { useEffect, useMemo, useState } from 'react';
import { createCoverThumbnail, extractCoverPalette, type CoverPalette } from '../cover-palette';
import { getCatalogTracks } from '../services/catalog-api';
import {
  AlbumAdminError,
  createAdminAlbum,
  deleteAdminAlbumAsset,
  getAdminAlbum,
  getAdminAlbums,
  moveAdminAlbumTrack,
  saveAdminAlbumMembership,
  saveAdminAlbumMetadata,
  uploadAdminAlbumAsset,
  type AdminAlbumAssetState,
  type AdminAlbumManifest,
  type AdminAlbumMetadataPatch,
  type AdminAlbumStatus,
  type AdminAlbumSummary,
  type AdminAlbumType,
} from '../services/album-admin-api';
import { getPublicAlbumVisuals, type PublicAlbumVisual } from '../services/public-albums-api';
import type { StudioTrack } from '../types/studio';
import { CoverImagePreview } from './CoverImagePreview';
import { CoverPalettePreview } from './CoverPalettePreview';

type AlbumTab = 'overview' | 'tracklist' | 'assets';
type Form = {
  title: string;
  type: AdminAlbumType;
  status: AdminAlbumStatus;
  year: string;
  releaseDate: string;
  description: string;
  heading: string;
  accent: string;
  accent2: string;
};

const EMPTY: Form = { title: '', type: 'album', status: 'draft', year: '', releaseDate: '', description: '', heading: '', accent: '', accent2: '' };
const DEFAULT_ALBUM_PALETTE: CoverPalette = { accent: '#4de1e2', accent2: '#8f58ff' };
const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
const badge = (album: AdminAlbumManifest) => `${album.type.toUpperCase()} · ${album.status.toUpperCase()}`;
const validHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value.trim());
const paletteFromForm = (form: Form): CoverPalette => ({
  accent: validHex(form.accent) ? form.accent.trim().toLowerCase() : DEFAULT_ALBUM_PALETTE.accent,
  accent2: validHex(form.accent2) ? form.accent2.trim().toLowerCase() : DEFAULT_ALBUM_PALETTE.accent2,
});
const formFrom = (album: AdminAlbumManifest): Form => ({
  title: album.title || '',
  type: album.type,
  status: album.status,
  year: album.year ? String(album.year) : '',
  releaseDate: album.releaseDate?.slice(0, 10) || '',
  description: album.description || '',
  heading: album.heading || '',
  accent: album.accent || '',
  accent2: album.accent2 || '',
});

function errorMessage(reason: unknown) {
  if (reason instanceof AlbumAdminError) {
    return `${reason.message}${reason.code ? ` [${reason.code}]` : ''}${reason.currentUpdatedAt ? ` Canonical revision is now ${reason.currentUpdatedAt}.` : ''}`;
  }
  return reason instanceof Error ? reason.message : String(reason);
}

function metadataPatch(form: Form): AdminAlbumMetadataPatch {
  const year = form.year.trim() ? Number(form.year) : null;
  if (form.year.trim() && (!Number.isInteger(year) || year! < 1000 || year! > 9999)) {
    throw new AlbumAdminError('Album year must be a four-digit year.');
  }
  if (form.accent.trim() && !validHex(form.accent)) throw new AlbumAdminError('Primary color must use six-digit HEX format, for example #21d4fd.');
  if (form.accent2.trim() && !validHex(form.accent2)) throw new AlbumAdminError('Secondary color must use six-digit HEX format, for example #8c52ff.');
  return {
    title: form.title.trim(),
    type: form.type,
    status: form.status,
    year,
    releaseDate: form.releaseDate || null,
    description: form.description.trim() || null,
    heading: form.heading.trim() || null,
    accent: form.accent.trim().toLowerCase() || null,
    accent2: form.accent2.trim().toLowerCase() || null,
  };
}

function visualUrl(visual?: PublicAlbumVisual | null, full = false) {
  if (!visual) return null;
  return full ? (visual.fullCover || visual.cover || visual.thumbnail) : (visual.thumbnail || visual.cover || visual.fullCover);
}

function AlbumCreatePanel({ onCreated, onCancel }: { onCreated: (id: string) => Promise<void>; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [type, setType] = useState<AdminAlbumType>('album');
  const [year, setYear] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const effectiveId = id.trim() || slugify(title);
  const valid = Boolean(title.trim() && /^[a-z0-9][a-z0-9-]{0,119}$/.test(effectiveId));

  async function create() {
    if (!valid || busy) return;
    if (!globalThis.confirm(`Create canonical ${type.toUpperCase()} draft “${title.trim()}”?\n\nThe ID ${effectiveId} becomes immutable. Track Manager remains the sole R2 write authority.`)) return;
    setBusy(true);
    setError(null);
    try {
      const numericYear = year.trim() ? Number(year) : null;
      if (year.trim() && (!Number.isInteger(numericYear) || numericYear! < 1000 || numericYear! > 9999)) throw new AlbumAdminError('Album year must be a four-digit year.');
      const result = await createAdminAlbum({ id: effectiveId, title: title.trim(), type, year: numericYear, releaseDate: releaseDate || null });
      if (!result.clientVerified) throw new AlbumAdminError(result.verificationWarning || 'Album create could not be canonically verified.');
      await onCreated(effectiveId);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusy(false);
    }
  }

  return <section className="panel c3-album-create">
    <div className="album-section-head"><div><span className="eyebrow">NEW CANONICAL RELEASE</span><h3>Create Album / EP</h3><p>Create a clean canonical draft. No migration tooling is involved.</p></div><button className="ghost-btn compact" disabled={busy} onClick={onCancel}>Close</button></div>
    <div className="album-form-grid">
      <label><span>Title <b>Required</b></span><input autoFocus value={title} onChange={event => setTitle(event.target.value)} /></label>
      <label><span>Canonical ID <b>Immutable</b></span><input value={id} onChange={event => setId(slugify(event.target.value))} placeholder={slugify(title) || 'album-id'} /></label>
      <label><span>Type</span><select value={type} onChange={event => setType(event.target.value as AdminAlbumType)}><option value="album">Album</option><option value="ep">EP</option><option value="collection">Collection</option></select></label>
      <label><span>Year</span><input inputMode="numeric" value={year} onChange={event => setYear(event.target.value)} /></label>
      <label><span>Release date</span><input type="date" value={releaseDate} onChange={event => setReleaseDate(event.target.value)} /></label>
    </div>
    <div className="album-actions"><button className="ghost-btn" disabled={busy} onClick={onCancel}>Cancel</button><button className="primary-btn" disabled={!valid || busy} onClick={() => void create()}>{busy ? 'Creating…' : 'Create canonical draft'}</button></div>
    {error && <div className="album-error">{error}</div>}
  </section>;
}

function AlbumCover({ album, visual, large = false }: { album: Pick<AdminAlbumManifest, 'title'>; visual?: PublicAlbumVisual | null; large?: boolean }) {
  const url = visualUrl(visual, large);
  return <div className={large ? 'c3-album-cover c3-album-cover-large' : 'c3-album-cover'}>
    {url ? <img src={url} alt={`${album.title} cover`} loading={large ? 'eager' : 'lazy'} /> : <span>{album.title.slice(0, 2).toUpperCase()}</span>}
  </div>;
}

function AlbumEditor({ albumId, albums, tracks, visual, onChanged, onClose }: {
  albumId: string;
  albums: AdminAlbumSummary[];
  tracks: StudioTrack[];
  visual?: PublicAlbumVisual | null;
  onChanged: () => Promise<void>;
  onClose: () => void;
}) {
  const [album, setAlbum] = useState<AdminAlbumManifest | null>(null);
  const [assets, setAssets] = useState<Partial<Record<'cover' | 'thumbnail', AdminAlbumAssetState | null>>>({});
  const [form, setForm] = useState<Form>(EMPTY);
  const [ids, setIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<Record<string, string>>({});
  const [cover, setCover] = useState<File | null>(null);
  const [palette, setPalette] = useState<CoverPalette | null>(null);
  const [tab, setTab] = useState<AlbumTab>('overview');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const payload = await getAdminAlbum(albumId);
      const next = payload.album?.manifest;
      if (!next) throw new Error('Canonical Album manifest is missing.');
      setAlbum(next);
      setForm(formFrom(next));
      setIds([...next.trackIds]);
      setAssets(payload.album?.assets || {});
      setError(null);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [albumId]);
  useEffect(() => {
    if (!cover) { setPalette(null); return; }
    let active = true;
    extractCoverPalette(cover).then(value => active && setPalette(value)).catch(() => active && setPalette(null));
    return () => { active = false; };
  }, [cover]);

  const byId = useMemo(() => new Map(tracks.map(track => [track.id, track])), [tracks]);
  const changed = album ? JSON.stringify(ids) !== JSON.stringify(album.trackIds) : false;
  const overviewPalette = paletteFromForm(form);

  async function mutate(task: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await task();
      await load();
      await onChanged();
    } catch (reason) {
      const message = errorMessage(reason);
      await load().catch(() => {});
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function saveMetadata() {
    if (!album?.updatedAt) return;
    const previousStatus = album.status;
    const requestedStatus = form.status;
    await mutate(async () => {
      const patch = metadataPatch(form);
      const result = await saveAdminAlbumMetadata(album.id, album.updatedAt!, patch);
      if (!result.clientVerified) throw new AlbumAdminError(result.verificationWarning || 'Album metadata reread failed.');
      setNotice(requestedStatus !== previousStatus
        ? `Album status ${requestedStatus.toUpperCase()} saved and canonically verified.`
        : 'Album metadata saved and canonically verified.');
    });
  }

  async function saveTracklist() {
    if (!album?.updatedAt || !changed) return;
    if (!globalThis.confirm(`Save ordered tracklist for “${album.title}”?\n\nRemoved tracks leave this canonical Album and will surface in the virtual Singles collection unless claimed by another Album.`)) return;
    await mutate(async () => {
      const result = await saveAdminAlbumMembership(album.id, album.updatedAt!, ids);
      if (!result.clientVerified) throw new AlbumAdminError(result.verificationWarning || 'Album tracklist reread failed.');
      setNotice('Album tracklist saved and canonically reread.');
    });
  }

  async function moveTrack(trackId: string) {
    if (!album) return;
    const targetId = moves[trackId];
    const targetSummary = albums.find(item => item.id === targetId);
    if (!targetId || !targetSummary) return;
    if (!globalThis.confirm(`Move “${byId.get(trackId)?.title || trackId}” to “${targetSummary.title}”?\n\nTrack Manager updates source + target in one guarded transaction.`)) return;
    await mutate(async () => {
      const [sourcePayload, targetPayload] = await Promise.all([getAdminAlbum(album.id), getAdminAlbum(targetId)]);
      const source = sourcePayload.album?.manifest;
      const target = targetPayload.album?.manifest;
      if (!source?.updatedAt || !target?.updatedAt) throw new AlbumAdminError('Fresh source/target revisions unavailable.');
      const result = await moveAdminAlbumTrack(targetId, {
        trackId,
        sourceAlbumId: album.id,
        expectedSourceUpdatedAt: source.updatedAt,
        expectedTargetUpdatedAt: target.updatedAt,
        targetIndex: target.trackIds.length,
      });
      if (!result.clientVerified) throw new AlbumAdminError(result.verificationWarning || 'Album move reread failed.');
      setMoves(current => ({ ...current, [trackId]: '' }));
      setNotice('Track moved and canonically reread.');
    });
  }

  async function uploadCover() {
    if (!album?.updatedAt || !cover) return;
    await mutate(async () => {
      let revision = album.updatedAt!;
      const coverResult = await uploadAdminAlbumAsset(album.id, 'cover', revision, cover);
      if (!coverResult.clientVerified || !coverResult.updatedAt) throw new AlbumAdminError(coverResult.verificationWarning || 'Cover reread failed.');
      revision = coverResult.updatedAt;
      const thumbnail = await createCoverThumbnail(cover);
      const thumbnailResult = await uploadAdminAlbumAsset(album.id, 'thumbnail', revision, thumbnail);
      if (!thumbnailResult.clientVerified) throw new AlbumAdminError(thumbnailResult.verificationWarning || 'Thumbnail reread failed.');
      setCover(null);
      setNotice('Album cover + thumbnail uploaded sequentially and canonically reread.');
    });
  }

  async function removeAsset(kind: 'cover' | 'thumbnail') {
    if (!album?.updatedAt || !assets[kind]?.present) return;
    if (!globalThis.confirm(`Delete canonical Album ${kind}?\n\nThis write is guarded with backup + rollback. Whole-Album deletion remains unavailable.`)) return;
    await mutate(async () => {
      const result = await deleteAdminAlbumAsset(album.id, kind, album.updatedAt!);
      if (!result.clientVerified) throw new AlbumAdminError(result.verificationWarning || `${kind} reread failed.`);
      setNotice(`Album ${kind} deleted and canonically reread.`);
    });
  }

  if (loading) return <section className="panel album-loading">Loading canonical Album…</section>;
  if (!album) return <section className="panel album-editor"><div className="album-error">{error || 'Album unavailable.'}</div><button className="ghost-btn" onClick={onClose}>Back to Albums</button></section>;

  return <section className="c3-album-focused">
    <button className="c3-album-back" onClick={onClose}>← Albums / Projects</button>
    <article className="panel c3-album-identity">
      <AlbumCover album={album} visual={visual} large />
      <div className="c3-album-identity-copy"><span className="eyebrow">CANONICAL RELEASE</span><h2>{album.title}</h2><div className="c3-album-identity-meta"><span className={`album-status ${album.status}`}>{badge(album)}</span><span>{album.year || 'Year TBD'}</span><span>{album.trackIds.length} tracks</span></div><p>{album.description || 'No Album description yet.'}</p><small><code>{album.id}</code> · canonical R2 manifest</small></div>
    </article>

    <nav className="c3-album-tabs" aria-label="Album editor sections">
      {(['overview', 'tracklist', 'assets'] as AlbumTab[]).map(value => <button key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{value === 'overview' ? 'Overview' : value === 'tracklist' ? `Tracklist (${ids.length})` : 'Assets'}</button>)}
    </nav>

    {tab === 'overview' && <article className="panel album-editor c3-album-tab-panel">
      <div className="album-section-head"><div><span className="eyebrow">OVERVIEW</span><h3>Release metadata</h3><p>Edit the canonical manifest. Track Manager remains the only R2 write authority.</p></div></div>
      <div className="album-form-grid">
        <label><span>Title</span><input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label>
        <label><span>Type</span><select value={form.type} onChange={event => setForm({ ...form, type: event.target.value as AdminAlbumType })}><option value="album">Album</option><option value="ep">EP</option><option value="collection">Collection</option></select></label>
        <label><span>Status</span><select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as AdminAlbumStatus })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <label><span>Year</span><input inputMode="numeric" value={form.year} onChange={event => setForm({ ...form, year: event.target.value })} /></label>
        <label><span>Release date</span><input type="date" value={form.releaseDate} onChange={event => setForm({ ...form, releaseDate: event.target.value })} /></label>
        <label><span>Editorial heading</span><input value={form.heading} onChange={event => setForm({ ...form, heading: event.target.value })} /></label>
        <label className="album-wide"><span>Description</span><textarea rows={4} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
        <div className="album-wide c3-album-palette-block">
          <CoverPalettePreview
            palette={overviewPalette}
            editable
            fieldLabels={{ accent: 'Primary color', accent2: 'Secondary color' }}
            title="Album palette"
            note="Saved in the canonical Album manifest and used to theme the public LaunchPAD Album page."
            onChange={next => setForm(current => ({ ...current, accent: next.accent, accent2: next.accent2 }))}
          />
          <p className="c3-album-palette-note">If the canonical palette is still empty, Studio shows the LaunchPAD fallback colors until you pick or extract a palette and save metadata.</p>
        </div>
      </div>
      <div className="album-actions"><span>Revision: <code>{album.updatedAt || 'missing'}</code></span><button className="primary-btn" disabled={busy || !form.title.trim()} onClick={() => void saveMetadata()}>Save metadata</button></div>
    </article>}

    {tab === 'tracklist' && <article className="panel album-tracklist-panel c3-album-tab-panel">
      <div className="album-section-head"><div><span className="eyebrow">TRACKLIST / MEMBERSHIP</span><h3>{ids.length} ordered tracks</h3><p><code>album.trackIds</code> is the canonical membership and artistic order. Reorder here at any time.</p></div></div>
      <ol className="album-tracklist">{ids.map((id, index) => <li key={id}><span className="album-track-index">{String(index + 1).padStart(2, '0')}</span><div><strong>{byId.get(id)?.title || id}</strong><small>{id}</small></div><div className="album-track-controls"><button disabled={busy || index === 0} onClick={() => { const next = [...ids]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setIds(next); }}>↑</button><button disabled={busy || index === ids.length - 1} onClick={() => { const next = [...ids]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; setIds(next); }}>↓</button><button disabled={busy} onClick={() => setIds(ids.filter(value => value !== id))}>Remove</button></div><div className="album-track-move"><select value={moves[id] || ''} onChange={event => setMoves({ ...moves, [id]: event.target.value })}><option value="">Move to…</option>{albums.filter(item => item.id !== album.id).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><button disabled={busy || !moves[id]} onClick={() => void moveTrack(id)}>Move</button></div></li>)}</ol>
      <div className="album-actions"><span>{changed ? 'Unsaved tracklist changes' : 'Tracklist matches canonical state'}</span><button className="primary-btn" disabled={busy || !changed} onClick={() => void saveTracklist()}>Save tracklist</button></div>
    </article>}

    {tab === 'assets' && <article className="panel album-assets-panel c3-album-tab-panel">
      <div className="album-section-head"><div><span className="eyebrow">ASSETS</span><h3>Cover + thumbnail</h3><p>The current canonical artwork is shown first. Replacement remains a sequential guarded write.</p></div></div>
      <div className="c3-album-current-art"><AlbumCover album={album} visual={visual} large /><div><strong>Current canonical artwork</strong><span className={assets.cover?.present ? 'present' : 'missing'}>Cover {assets.cover?.present ? 'present' : 'missing'}</span><span className={assets.thumbnail?.present ? 'present' : 'missing'}>Thumbnail {assets.thumbnail?.present ? 'present' : 'missing'}</span></div></div>
      <div className="album-cover-workbench"><label className="album-file-input"><span>Choose replacement cover</span><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={event => setCover(event.target.files?.[0] || null)} /></label>{cover && <><CoverImagePreview file={cover} alt="New Album cover preview" /><CoverPalettePreview palette={palette} editable onChange={setPalette} fieldLabels={{ accent: 'Primary color', accent2: 'Secondary color' }} title="Extracted palette suggestion" note="Nothing is applied automatically." /><button className="ghost-btn compact" disabled={!palette} onClick={() => palette && setForm({ ...form, accent: palette.accent, accent2: palette.accent2 })}>Apply palette to Overview form</button></>}</div>
      <div className="album-actions album-asset-actions"><div><button className="ghost-btn" disabled={busy || !assets.cover?.present} onClick={() => void removeAsset('cover')}>Delete cover</button><button className="ghost-btn" disabled={busy || !assets.thumbnail?.present} onClick={() => void removeAsset('thumbnail')}>Delete thumbnail</button></div><button className="primary-btn" disabled={busy || !cover} onClick={() => void uploadCover()}>Upload cover + thumbnail</button></div>
    </article>}

    {notice && <div className="album-notice">{notice}</div>}
    {error && <div className="album-error">{error}</div>}
  </section>;
}

export function AlbumsWorkspace() {
  const [albums, setAlbums] = useState<AdminAlbumSummary[]>([]);
  const [tracks, setTracks] = useState<StudioTrack[]>([]);
  const [visuals, setVisuals] = useState<Map<string, PublicAlbumVisual>>(new Map());
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visualWarning, setVisualWarning] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [albumPayload, catalogTracks] = await Promise.all([getAdminAlbums(), getCatalogTracks()]);
      setAlbums(albumPayload.albums || []);
      setTracks(catalogTracks);
      setError(null);
      try {
        setVisuals(await getPublicAlbumVisuals());
        setVisualWarning(null);
      } catch (reason) {
        setVisuals(new Map());
        setVisualWarning(`Canonical cover preview unavailable: ${errorMessage(reason)}`);
      }
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const totals = useMemo(() => ({
    total: albums.length,
    drafts: albums.filter(album => album.status === 'draft').length,
    trackRefs: albums.reduce((total, album) => total + album.trackIds.length, 0),
  }), [albums]);

  if (selected) return <section className="album-manager"><AlbumEditor albumId={selected} albums={albums} tracks={tracks} visual={visuals.get(selected)} onChanged={load} onClose={() => setSelected(null)} /></section>;

  return <section className="album-manager c3-albums-workspace">
    <div className="catalog-heading album-manager-heading"><div><span className="eyebrow">CATALOG / ALBUMS & PROJECTS</span><h2>Your canonical releases.</h2><p>Album manifests and track order are authoritative in R2. Covers below are read from the same canonical public projection used by LaunchPAD.</p></div><div className="catalog-heading-actions"><div className="catalog-kpis"><div><strong>{totals.total}</strong><span>canonical</span></div><div><strong>{totals.drafts}</strong><span>drafts</span></div><div><strong>{totals.trackRefs}</strong><span>track refs</span></div></div><button className="primary-btn" disabled={loading || Boolean(error)} onClick={() => setShowCreate(true)}>+ New Album / EP</button></div></div>

    {showCreate && <AlbumCreatePanel onCancel={() => setShowCreate(false)} onCreated={async id => { await load(); setShowCreate(false); setSelected(id); }} />}
    {loading && <div className="catalog-message panel">Loading canonical Albums…</div>}
    {!loading && error && <div className="album-error panel"><strong>Album Management unavailable</strong><span>{error}</span><button className="ghost-btn compact" onClick={() => void load()}>Retry</button></div>}
    {!loading && !error && visualWarning && <div className="album-notice c3-album-visual-warning">{visualWarning} Album management remains available.</div>}
    {!loading && !error && albums.length === 0 && <div className="album-empty panel"><strong>No canonical Album exists yet.</strong><span>Create a new Album / EP draft to begin.</span></div>}
    {!loading && !error && albums.length > 0 && <div className="c3-album-library">{albums.map(album => <button className="panel c3-album-library-card" key={album.id} onClick={() => setSelected(album.id)}><AlbumCover album={album} visual={visuals.get(album.id)} /><div className="c3-album-library-body"><div><strong>{album.title}</strong><small>{album.id}</small></div><span className={`album-status ${album.status}`}>{badge(album)}</span><div className="c3-album-library-meta"><span>{album.trackIds.length} tracks</span><span>{album.releaseDate?.slice(0, 10) || album.year || 'Date TBD'}</span><span>{visualUrl(visuals.get(album.id)) ? 'Canonical cover' : album.assetState?.cover?.present ? 'Cover private / preview unavailable' : 'Cover missing'}</span></div></div></button>)}</div>}
  </section>;
}