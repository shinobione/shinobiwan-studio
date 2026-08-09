import { useEffect, useMemo, useState } from 'react';
import { createCoverThumbnail, extractCoverPalette, type CoverPalette } from '../cover-palette';
import { trackHref } from '../router';
import type { AdminAssetKind, AdminMetadataPatch } from '../services/admin-api';
import { createAdminTrack, Phase4AdminError, phase4ErrorPresentation, uploadAdminTrackAsset, type Phase4ErrorPresentation } from '../services/phase4-admin-api';
import {
  canonicalIntakeSlug,
  detectIntakeFileRole,
  intakeFileForRole,
  intakeRoleProblems,
  mergeIntakeFiles,
  mergeParsedTrackTxt,
  parseTrackTxt,
  type IntakeFieldName,
  type IntakeFieldSources,
  type IntakeFileAssignment,
  type IntakeFileRole,
  type IntakeFormValues,
} from '../track-intake';
import { CoverImagePreview } from './CoverImagePreview';
import { CoverPalettePreview } from './CoverPalettePreview';

const EMPTY_VALUES: IntakeFormValues = {
  title: '', slug: '', type: 'single', year: '', releaseDate: '', albumTitle: 'Singles', albumId: 'singles', languages: 'English',
  genres: '', tags: '', moods: '', themes: '', era: '', energy: '', bpm: '', key: '', keyConfidence: '', duration: '', explicit: 'clean',
  status: 'draft', accent: '', accent2: '',
};

const ROLE_LABELS: Record<IntakeFileRole, string> = { audio: 'Audio', cover: 'Cover', lyrics: 'Lyrics TXT', video: 'Canvas video', ignore: 'Ignore' };
const FIELD_LABELS: Partial<Record<IntakeFieldName, string>> = { title: 'Title', slug: 'trackId', albumTitle: 'Album', albumId: 'Album ID', releaseDate: 'Release date', keyConfidence: 'Key confidence' };

function splitValues(value: string): string[] {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function numeric(value: string): number | null {
  const number = Number(value);
  return value.trim() && Number.isFinite(number) ? number : null;
}

function sourceLabel(source: string): string {
  if (source === 'detected+inferred') return 'DETECTED + INFERRED';
  return source === 'inferred' ? 'INFERRED' : 'DETECTED FROM TXT';
}

function ErrorNotice({ error, createdTrackId }: { error: Phase4ErrorPresentation; createdTrackId: string | null }) {
  return (
    <div className="phase4-operation-error intake-error">
      <strong>{createdTrackId ? 'DRAFT CREATED · ACTION NEEDED' : error.title.toUpperCase()}</strong>
      <span>{error.message}</span><b>{error.nextAction}</b>
      {error.technicalDetails && <details><summary>Technical details</summary><code>{error.technicalDetails}</code></details>}
      {createdTrackId && <a className="ghost-btn compact" href={trackHref(createdTrackId, 'assets')}>Continue safely in Assets</a>}
    </div>
  );
}

export function TrackCreatePanel({ privateRead, onCreated, onCancel }: { privateRead: boolean; onCreated?: () => Promise<void> | void; onCancel?: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<IntakeFormValues>(EMPTY_VALUES);
  const [manualFields, setManualFields] = useState<Set<IntakeFieldName>>(new Set());
  const [sources, setSources] = useState<IntakeFieldSources>({});
  const [preserved, setPreserved] = useState<IntakeFieldName[]>([]);
  const [assignments, setAssignments] = useState<IntakeFileAssignment[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [palette, setPalette] = useState<CoverPalette | null>(null);
  const [paletteBusy, setPaletteBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState<Phase4ErrorPresentation | null>(null);
  const [createdTrackId, setCreatedTrackId] = useState<string | null>(null);

  const cover = intakeFileForRole(assignments, 'cover');
  const audio = intakeFileForRole(assignments, 'audio');
  const lyrics = intakeFileForRole(assignments, 'lyrics');
  const video = intakeFileForRole(assignments, 'video');
  const problems = intakeRoleProblems(assignments);
  const effectiveSlug = values.slug.trim() || canonicalIntakeSlug(values.title);
  const basicsValid = values.title.trim().length > 0 && /^[a-z0-9][a-z0-9-]{0,119}$/.test(effectiveSlug);
  const selectedMedia = [cover, audio, lyrics, video].filter(Boolean).length;
  const canSubmit = privateRead && basicsValid && !problems.length && !busy && !paletteBusy;

  useEffect(() => {
    if (!cover) { setPalette(null); return; }
    let active = true;
    setPaletteBusy(true);
    extractCoverPalette(cover)
      .then(next => { if (active) setPalette(next); })
      .catch(reason => { if (active) setError(phase4ErrorPresentation(reason)); })
      .finally(() => { if (active) setPaletteBusy(false); });
    return () => { active = false; };
  }, [cover]);

  function updateField(field: IntakeFieldName, value: string) {
    setValues(previous => ({ ...previous, [field]: field === 'slug' ? canonicalIntakeSlug(value) : value }));
    setManualFields(previous => new Set(previous).add(field));
    setSources(previous => { const next = { ...previous }; delete next[field]; return next; });
    setPreserved(previous => previous.filter(item => item !== field));
  }

  async function applyTxt(file: File) {
    try {
      const parsed = parseTrackTxt(await file.text(), file.name, `${values.title} ${values.albumTitle} ${values.genres}`);
      setValues(previous => {
        const merged = mergeParsedTrackTxt(previous, parsed, manualFields);
        setSources(current => ({ ...current, ...merged.sources }));
        setPreserved(merged.preserved);
        return merged.values;
      });
    } catch (reason) {
      setError({ title: 'TXT parsing failed', message: reason instanceof Error ? reason.message : String(reason), nextAction: 'Keep the file selected and enter metadata manually, or choose a valid UTF-8 TXT file.', retrySafe: false, technicalDetails: null });
    }
  }

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    if (!incoming.length) return;
    setAssignments(previous => mergeIntakeFiles(previous, incoming));
    setError(null);
    const txt = incoming.find(file => detectIntakeFileRole(file) === 'lyrics');
    if (txt) void applyTxt(txt);
  }

  function assignRole(id: string, role: IntakeFileRole) {
    setAssignments(previous => previous.map(item => item.id === id ? { ...item, role, note: role === 'ignore' ? 'Explicitly ignored.' : 'Role confirmed by you.' } : item));
    const item = assignments.find(candidate => candidate.id === id);
    if (item && role === 'lyrics') void applyTxt(item.file);
  }

  async function calculatePalette() {
    if (!cover) return;
    setPaletteBusy(true); setError(null);
    try { setPalette(await extractCoverPalette(cover)); }
    catch (reason) { setError(phase4ErrorPresentation(reason)); }
    finally { setPaletteBusy(false); }
  }

  function metadataPatch(): AdminMetadataPatch {
    const genres = splitValues(values.genres);
    return {
      title: values.title.trim(), status: 'draft', type: values.type || 'single', year: numeric(values.year), releaseDate: values.releaseDate || null,
      album: { id: canonicalIntakeSlug(values.albumId || values.albumTitle) || 'singles', title: values.albumTitle.trim() || 'Singles' },
      languages: splitValues(values.languages), genres, tags: splitValues(values.tags), moods: splitValues(values.moods), themes: splitValues(values.themes),
      era: values.era.trim() || null, energy: values.energy.trim() || null, bpm: numeric(values.bpm), key: values.key.trim() || null,
      keyConfidence: numeric(values.keyConfidence), explicit: values.explicit === 'explicit',
      ...(palette ? { accent: palette.accent, accent2: palette.accent2 } : {}),
    };
  }

  async function create() {
    if (!canSubmit) return;
    if (!globalThis.confirm(`Create "${values.title.trim()}" as a new draft?\n\n${selectedMedia} selected media file${selectedMedia === 1 ? '' : 's'} will be uploaded sequentially after the canonical draft reread.`)) return;
    setBusy(true); setError(null); setCreatedTrackId(null); setProgress(['Preparing canonical draft…']);
    try {
      const result = await createAdminTrack(effectiveSlug, metadataPatch());
      if (!result.clientVerified) throw new Phase4AdminError('The draft was created but its canonical reread could not be verified. Open Track Manager before continuing.', null, 'CREATE_UNVERIFIED');
      setCreatedTrackId(effectiveSlug);
      setProgress(['Draft created', 'Canonical draft reread verified']);
      let revision = result.track?.updatedAt || '';
      const uploads: Array<{ kind: AdminAssetKind; file: File; label: string }> = [];
      if (cover) { uploads.push({ kind: 'cover', file: cover, label: 'Cover' }); uploads.push({ kind: 'thumbnail', file: await createCoverThumbnail(cover), label: 'Cover thumbnail' }); }
      if (audio) uploads.push({ kind: 'audio', file: audio, label: 'Audio' });
      if (lyrics) uploads.push({ kind: 'lyrics', file: lyrics, label: 'Canonical lyrics.txt' });
      if (video) uploads.push({ kind: 'video', file: video, label: 'Canvas video' });
      for (let index = 0; index < uploads.length; index += 1) {
        if (!revision) throw new Phase4AdminError('The draft exists, but its canonical revision is unavailable. Continue from Assets after a reload.', null, 'REVISION_UNAVAILABLE');
        const upload = uploads[index];
        const prefix = `${upload.label} (${index + 1}/${uploads.length})`;
        setProgress(previous => [...previous, `${prefix}: preparing`]);
        const response = await uploadAdminTrackAsset(effectiveSlug, upload.kind, revision, upload.file, percent => {
          const stage = percent < 50 ? 'sending' : percent < 100 ? 'verifying response' : 'canonical reread verified';
          setProgress(previous => [...previous.slice(0, -1), `${prefix}: ${stage}`]);
        });
        if (!response.clientVerified || !response.updatedAt) throw new Phase4AdminError(`${upload.label} could not be verified. Reload the track before continuing.`, null, 'ASSET_UPLOAD_UNVERIFIED');
        revision = response.updatedAt;
      }
      setProgress(previous => [...previous, 'Opening Track Workspace…']);
      await onCreated?.();
      globalThis.location.hash = trackHref(effectiveSlug, uploads.length ? 'assets' : 'overview').replace(/^#/, '');
    } catch (reason) { setError(phase4ErrorPresentation(reason)); }
    finally { setBusy(false); }
  }

  const provenanceEntries = useMemo(() => Object.entries(sources) as Array<[IntakeFieldName, NonNullable<IntakeFieldSources[IntakeFieldName]>]>, [sources]);

  return (
    <article className="panel phase4-create-panel intake-flow">
      <div className="phase4-panel-head intake-head"><div><span className="eyebrow">NEW TRACK</span><h3>Build a canonical draft from the files you already have</h3><p>Drop a mixed selection, confirm Studio’s assignments and detected metadata, then review every write before creation.</p></div><button className="ghost-btn compact" type="button" disabled={busy} onClick={onCancel}>Close</button></div>
      <ol className="intake-steps" aria-label="New Track steps">{(['Files', 'Metadata', 'Review'] as const).map((label, index) => <li className={step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''} key={label}><b>{index + 1}</b><span>{label}</span></li>)}</ol>
      {!privateRead && <div className="workspace-note"><strong>Sign in to Track Manager first.</strong><p>New Track remains locked while Studio is using the public read-only catalog.</p></div>}

      {step === 2 && <section className="intake-step-panel">
        <div className="phase4-create-grid intake-metadata-grid">
          <label><span>Title <b>Required</b></span><input autoFocus value={values.title} onChange={event => updateField('title', event.target.value)} /></label>
          <label><span>Album</span><input value={values.albumTitle} onChange={event => updateField('albumTitle', event.target.value)} /></label>
          <label><span>Type</span><select value={values.type} onChange={event => updateField('type', event.target.value)}><option value="single">Single</option><option value="album-track">Album track</option><option value="demo">Demo</option></select></label>
          <label><span>Release date</span><input type="date" value={values.releaseDate} onChange={event => updateField('releaseDate', event.target.value)} /></label>
          <label><span>Languages</span><input value={values.languages} onChange={event => updateField('languages', event.target.value)} placeholder="English, French" /></label>
          <label><span>Genres</span><input value={values.genres} onChange={event => updateField('genres', event.target.value)} placeholder="R&B, Hip-hop" /></label>
          <label><span>Tags</span><input value={values.tags} onChange={event => updateField('tags', event.target.value)} placeholder="Editorial, discovery, context" /></label>
          <label><span>Moods</span><input value={values.moods} onChange={event => updateField('moods', event.target.value)} /></label>
          <label><span>Themes</span><input value={values.themes} onChange={event => updateField('themes', event.target.value)} /></label>
          <label><span>BPM</span><input inputMode="decimal" value={values.bpm} onChange={event => updateField('bpm', event.target.value)} /></label>
          <label><span>Key</span><input value={values.key} onChange={event => updateField('key', event.target.value)} /></label>
          <label><span>Energy</span><input value={values.energy} onChange={event => updateField('energy', event.target.value)} /></label>
          <label><span>Explicit</span><select value={values.explicit} onChange={event => updateField('explicit', event.target.value)}><option value="clean">Clean</option><option value="explicit">Explicit</option></select></label>
        </div>
        <details className="intake-technical"><summary>Technical identifier and extended metadata</summary><div className="phase4-create-grid"><label><span>trackId</span><input value={values.slug} onChange={event => updateField('slug', event.target.value)} placeholder={canonicalIntakeSlug(values.title) || 'generated-from-title'} /></label><label><span>Album ID</span><input value={values.albumId} onChange={event => updateField('albumId', event.target.value)} /></label><label><span>Year</span><input inputMode="numeric" value={values.year} onChange={event => updateField('year', event.target.value)} /></label><label><span>Era</span><input value={values.era} onChange={event => updateField('era', event.target.value)} /></label></div></details>
      </section>}

      {step === 1 && <section className="intake-step-panel intake-media-step">
        <label className={`intake-drop-zone${dragActive ? ' active' : ''}`} onDragEnter={event => { event.preventDefault(); setDragActive(true); }} onDragOver={event => event.preventDefault()} onDragLeave={() => setDragActive(false)} onDrop={event => { event.preventDefault(); setDragActive(false); addFiles(event.dataTransfer.files); }}>
          <strong>Drop audio, cover, TXT and Canvas together</strong><span>or choose multiple files · Studio classifies by extension and MIME, then asks you to resolve conflicts</span><input type="file" multiple accept="audio/*,image/*,text/plain,video/mp4,video/webm,.mp3,.wav,.flac,.m4a,.aac,.ogg,.jpg,.jpeg,.png,.webp,.gif,.txt,.mp4,.webm" onChange={event => event.target.files && addFiles(event.target.files)} />
        </label>
        {assignments.length > 0 && <div className="intake-assignment-list">{assignments.map(item => <div key={item.id} className={item.detectedRole === 'ambiguous' ? 'ambiguous' : ''}><div><strong>{item.file.name}</strong><span>{item.note} · {(item.file.size / 1024 / 1024).toFixed(2)} MB</span></div><select aria-label={`Role for ${item.file.name}`} value={item.role} onChange={event => assignRole(item.id, event.target.value as IntakeFileRole)}>{Object.entries(ROLE_LABELS).map(([role, label]) => <option value={role} key={role}>{label}</option>)}</select><button className="ghost-btn compact" type="button" onClick={() => setAssignments(previous => previous.filter(candidate => candidate.id !== item.id))}>Remove</button></div>)}</div>}
        {problems.map(problem => <p className="intake-file-problem" key={problem}>{problem}</p>)}
        {cover && <div className="intake-cover-workbench"><CoverImagePreview file={cover} alt="Selected cover preview" /><CoverPalettePreview palette={palette} editable onChange={setPalette} busy={paletteBusy} onRecalculate={() => void calculatePalette()} note="Preview of LaunchPAD’s canonical accent / accent2. You can refine both values before creation." /></div>}
        {(provenanceEntries.length > 0 || preserved.length > 0) && <div className="intake-provenance"><strong>TXT metadata review</strong><div>{provenanceEntries.map(([field, source]) => <span key={field}><b>{FIELD_LABELS[field] || field}</b>{sourceLabel(source)}</span>)}{preserved.map(field => <span className="preserved" key={`preserved-${field}`}><b>{FIELD_LABELS[field] || field}</b>EXISTING USER VALUE PRESERVED</span>)}</div>{values.duration && <p>Detected duration reference: <b>{values.duration}</b>. Canonical duration remains derived from uploaded audio; Studio does not create a second duration field.</p>}</div>}
      </section>}

      {step === 3 && <section className="intake-step-panel intake-review">
        <div className="intake-review-summary"><div><span>Track</span><strong>{values.title.trim()}</strong><small>{values.albumTitle.trim() || 'Singles'} · {values.type}</small></div><div><span>Classified media</span><strong>{selectedMedia}</strong><small>{assignments.filter(item => item.role !== 'ignore').map(item => ROLE_LABELS[item.role]).join(' · ') || 'No media selected'}</small></div><div><span>Initial state</span><strong>Draft</strong><small>Canonical Track Manager write, followed by sequential verified asset writes.</small></div></div>
        <div className="intake-review-metadata"><strong>Metadata to create</strong><dl><div><dt>trackId</dt><dd>{effectiveSlug}</dd></div><div><dt>Genres / tags</dt><dd>{[values.genres, values.tags].filter(Boolean).join(' · ') || '—'}</dd></div><div><dt>Moods</dt><dd>{values.moods || '—'}</dd></div><div><dt>Themes</dt><dd>{values.themes || '—'}</dd></div><div><dt>Release</dt><dd>{values.releaseDate || values.year || '—'}</dd></div><div><dt>Music</dt><dd>{[values.bpm && `${values.bpm} BPM`, values.key].filter(Boolean).join(' · ') || '—'}</dd></div></dl></div>
        {cover && <div className="intake-cover-workbench compact"><CoverImagePreview file={cover} alt="Cover review" /><CoverPalettePreview palette={palette} editable onChange={setPalette} title="Palette review" busy={paletteBusy} onRecalculate={() => void calculatePalette()} note="These exact canonical accent / accent2 values will be saved on draft creation." /></div>}
        <details className="intake-technical"><summary>Write contract</summary><p>Studio uses Track Manager’s existing create and one-asset-at-a-time routes. It never writes R2 directly, never creates an alternate palette or lyrics source, and only accepts TXT for canonical lyrics.</p></details>
      </section>}

      {busy && <div className="intake-progress-stages" aria-live="polite">{progress.map((item, index) => <span key={`${index}-${item}`}>{item}</span>)}</div>}
      <div className="intake-actions"><button className="ghost-btn" type="button" disabled={busy || step === 1} onClick={() => setStep(previous => Math.max(1, previous - 1) as 1 | 2 | 3)}>Back</button>{step < 3 ? <button className="primary-btn" type="button" disabled={busy || (step === 1 && Boolean(problems.length)) || (step === 2 && !basicsValid)} onClick={() => setStep(previous => Math.min(3, previous + 1) as 1 | 2 | 3)}>Continue</button> : <button className="primary-btn" type="button" disabled={!canSubmit} onClick={() => void create()}>{busy ? 'Working…' : 'Create canonical draft'}</button>}</div>
      {error && <ErrorNotice error={error} createdTrackId={createdTrackId} />}
    </article>
  );
}
