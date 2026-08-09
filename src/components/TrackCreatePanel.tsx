import { useMemo, useState } from 'react';
import { createCoverThumbnail, extractCoverPalette, type CoverPalette } from '../cover-palette';
import { trackHref } from '../router';
import type { AdminAssetKind, AdminMetadataPatch } from '../services/admin-api';
import { createAdminTrack, Phase4AdminError, uploadAdminTrackAsset } from '../services/phase4-admin-api';
import { CoverPalettePreview } from './CoverPalettePreview';

function canonicalSlug(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
}

function splitValues(value: string): string[] {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function errorText(reason: unknown): string {
  if (reason instanceof Phase4AdminError) return [reason.message, reason.code].filter(Boolean).join(' · ');
  return reason instanceof Error ? reason.message : String(reason);
}

function FileChoice({ label, accept, file, hint, onChange }: { label: string; accept: string; file: File | null; hint: string; onChange: (file: File | null) => void }) {
  return (
    <label className="intake-file-choice">
      <span><strong>{label}</strong><small>{hint}</small></span>
      <b>{file?.name || 'Choose file…'}</b>
      <input type="file" accept={accept} onChange={event => onChange(event.target.files?.[0] || null)} />
    </label>
  );
}

export function TrackCreatePanel({ privateRead, onCreated, onCancel }: { privateRead: boolean; onCreated?: () => Promise<void> | void; onCancel?: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [albumTitle, setAlbumTitle] = useState('Singles');
  const [languages, setLanguages] = useState('English');
  const [genres, setGenres] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [lyrics, setLyrics] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [palette, setPalette] = useState<CoverPalette | null>(null);
  const [paletteBusy, setPaletteBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdTrackId, setCreatedTrackId] = useState<string | null>(null);

  const suggestedSlug = useMemo(() => canonicalSlug(title), [title]);
  const effectiveSlug = slug.trim() || suggestedSlug;
  const basicsValid = title.trim().length > 0 && /^[a-z0-9][a-z0-9-]{0,119}$/.test(effectiveSlug);
  const selectedMedia = [cover, audio, lyrics, video].filter(Boolean).length;
  const canSubmit = privateRead && basicsValid && !busy && !paletteBusy;

  async function calculatePalette(file = cover) {
    if (!file) return;
    setPaletteBusy(true);
    setError(null);
    try {
      setPalette(await extractCoverPalette(file));
    } catch (reason) {
      setPalette(null);
      setError(`Cover palette preview failed: ${errorText(reason)}`);
    } finally {
      setPaletteBusy(false);
    }
  }

  function chooseCover(file: File | null) {
    setCover(file);
    setPalette(null);
    setError(null);
    if (file) void calculatePalette(file);
  }

  async function create() {
    if (!canSubmit) return;
    if (!globalThis.confirm(`Create "${title.trim()}" as a new draft?${selectedMedia ? `\n\n${selectedMedia} selected media file${selectedMedia === 1 ? '' : 's'} will be uploaded after the draft is verified.` : ''}`)) return;
    setBusy(true);
    setError(null);
    setCreatedTrackId(null);
    try {
      const values = splitValues(genres);
      const metadata: AdminMetadataPatch = {
        title: title.trim(),
        type: 'single',
        album: { id: canonicalSlug(albumTitle) || 'singles', title: albumTitle.trim() || 'Singles' },
        languages: splitValues(languages),
        genres: values,
        tags: values,
        ...(palette ? { accent: palette.accent, accent2: palette.accent2 } : {}),
      };
      setProgress('Creating draft…');
      const result = await createAdminTrack(effectiveSlug, metadata);
      if (!result.clientVerified) throw new Phase4AdminError('The draft was created but its canonical reread could not be verified. Open Track Manager before continuing.');
      setCreatedTrackId(effectiveSlug);
      let revision = result.track?.updatedAt || '';

      const uploads: Array<{ kind: AdminAssetKind; file: File; label: string }> = [];
      if (cover) {
        uploads.push({ kind: 'cover', file: cover, label: 'cover' });
        uploads.push({ kind: 'thumbnail', file: await createCoverThumbnail(cover), label: 'cover thumbnail' });
      }
      if (audio) uploads.push({ kind: 'audio', file: audio, label: 'audio' });
      if (lyrics) uploads.push({ kind: 'lyrics', file: lyrics, label: 'lyrics.txt' });
      if (video) uploads.push({ kind: 'video', file: video, label: 'Canvas' });

      for (let index = 0; index < uploads.length; index += 1) {
        if (!revision) throw new Phase4AdminError('The draft exists, but its current revision is unavailable. Continue media upload from Assets.');
        const upload = uploads[index];
        setProgress(`Uploading ${upload.label} (${index + 1}/${uploads.length})…`);
        const response = await uploadAdminTrackAsset(effectiveSlug, upload.kind, revision, upload.file);
        if (!response.clientVerified || !response.updatedAt) throw new Phase4AdminError(`${upload.label} upload could not be verified. Reload the track before continuing.`);
        revision = response.updatedAt;
      }

      setProgress('Opening Track Workspace…');
      await onCreated?.();
      globalThis.location.hash = trackHref(effectiveSlug, uploads.length ? 'assets' : 'overview').replace(/^#/, '');
    } catch (reason) {
      setError(errorText(reason));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <article className="panel phase4-create-panel intake-flow">
      <div className="phase4-panel-head intake-head">
        <div><span className="eyebrow">NEW TRACK</span><h3>Create a production-ready draft</h3><p>Start with the essentials, attach available media, then review.</p></div>
        <button className="ghost-btn compact" type="button" disabled={busy} onClick={onCancel}>Close</button>
      </div>

      <ol className="intake-steps" aria-label="New Track steps">
        {(['Basics', 'Media', 'Review'] as const).map((label, index) => <li className={step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''} key={label}><b>{index + 1}</b><span>{label}</span></li>)}
      </ol>

      {!privateRead && <div className="workspace-note"><strong>Sign in to Track Manager first.</strong><p>New Track remains locked while Studio is using the public read-only catalog.</p></div>}

      {step === 1 && (
        <section className="intake-step-panel">
          <div className="phase4-create-grid">
            <label><span>Title <b>Required</b></span><input autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="Track title" /></label>
            <label><span>Album</span><input value={albumTitle} onChange={event => setAlbumTitle(event.target.value)} /></label>
            <label><span>Languages</span><input value={languages} onChange={event => setLanguages(event.target.value)} placeholder="English, French" /></label>
            <label><span>Genres</span><input value={genres} onChange={event => setGenres(event.target.value)} placeholder="R&B, Hip-hop" /></label>
          </div>
          <details className="intake-technical"><summary>Technical identifier</summary><label><span>trackId</span><input value={slug} onChange={event => setSlug(canonicalSlug(event.target.value))} placeholder={suggestedSlug || 'generated-from-title'} /></label><small>Generated automatically. Change it only before creation when a specific canonical slug is required.</small></details>
        </section>
      )}

      {step === 2 && (
        <section className="intake-step-panel intake-media-step">
          <div className="intake-media-grid">
            <div className="intake-cover-section">
              <FileChoice label="Cover" accept=".jpg,.jpeg,.png,.webp,.gif,image/*" file={cover} hint="A 512 px WebP thumbnail is generated automatically." onChange={chooseCover} />
              <CoverPalettePreview palette={palette} busy={paletteBusy} onRecalculate={cover ? () => void calculatePalette() : undefined} note={cover ? 'Previewed with Track Manager Feature 10.3; saved as canonical manifest fields on creation.' : 'Select a cover to preview LaunchPAD’s two canonical colors.'} />
            </div>
            <div className="intake-other-media">
              <FileChoice label="Audio" accept=".mp3,.wav,.flac,.m4a,.aac,.ogg,audio/*" file={audio} hint="Optional now; can be added later in Assets." onChange={setAudio} />
              <FileChoice label="Lyrics TXT" accept=".txt,text/plain" file={lyrics} hint="Canonical lyrics.txt; timestamps define synchronization." onChange={setLyrics} />
              <FileChoice label="Video / Canvas" accept=".mp4,.webm,video/mp4,video/webm" file={video} hint="Optional vertical Canvas media." onChange={setVideo} />
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="intake-step-panel intake-review">
          <div className="intake-review-summary"><div><span>Track</span><strong>{title.trim()}</strong><small>{albumTitle.trim() || 'Singles'} · {splitValues(languages).join(', ') || 'No language'}</small></div><div><span>Media ready</span><strong>{selectedMedia}</strong><small>{cover ? 'Cover + thumbnail' : 'No cover'}{audio ? ' · Audio' : ''}{lyrics ? ' · Lyrics' : ''}{video ? ' · Canvas' : ''}</small></div><div><span>Initial state</span><strong>Draft</strong><small>Review before publishing.</small></div></div>
          {cover && <CoverPalettePreview palette={palette} title="Palette review" busy={paletteBusy} onRecalculate={() => void calculatePalette()} note="These exact accent / accent2 values will enter the canonical manifest." />}
          <details className="intake-technical"><summary>Creation details</summary><p>Canonical trackId: <code>{effectiveSlug}</code>. Studio uses the existing Track Manager create and one-asset upload contracts; no alternate catalog or palette storage is created.</p></details>
        </section>
      )}

      <div className="intake-actions">
        <button className="ghost-btn" type="button" disabled={busy || step === 1} onClick={() => setStep(previous => Math.max(1, previous - 1) as 1 | 2 | 3)}>Back</button>
        {step < 3
          ? <button className="primary-btn" type="button" disabled={busy || (step === 1 && !basicsValid)} onClick={() => setStep(previous => Math.min(3, previous + 1) as 1 | 2 | 3)}>Continue</button>
          : <button className="primary-btn" type="button" disabled={!canSubmit} onClick={() => void create()}>{busy ? progress || 'Creating…' : 'Create draft'}</button>}
      </div>
      {error && <div className="phase4-operation-error"><strong>{createdTrackId ? 'DRAFT CREATED · ACTION NEEDED' : 'NEW TRACK ERROR'}</strong><span>{error}</span>{createdTrackId && <a className="ghost-btn compact" href={trackHref(createdTrackId, 'assets')}>Continue in Assets</a>}</div>}
    </article>
  );
}
