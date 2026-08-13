import { useEffect, useMemo, useState } from 'react';
import { canonicalAlbumId, resolveIntakeAlbum, type IntakeAlbumResolution } from '../album-intake';
import { createCoverThumbnail, extractCoverPalette, type CoverPalette } from '../cover-palette';
import { routeHref, trackHref } from '../router';
import { AlbumAdminError, createAdminAlbum, getAdminAlbum, getAdminAlbums, moveAdminAlbumTrack, type AdminAlbumSummary, type AdminAlbumType } from '../services/album-admin-api';
import { getAdminTrack, saveAdminTrackMetadata, validateAdminTrackMetadata, type AdminAssetKind, type AdminMetadataPatch } from '../services/admin-api';
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
type CreateMode = 'draft' | 'publish';

function splitValues(value: string): string[] { return value.split(',').map(item => item.trim()).filter(Boolean); }
function numeric(value: string): number | null { const number = Number(value); return value.trim() && Number.isFinite(number) ? number : null; }
function sourceLabel(source: string): string { if (source === 'detected+inferred') return 'DETECTED + INFERRED'; return source === 'inferred' ? 'INFERRED' : 'DETECTED FROM TXT'; }

function qualityBlockerMessages(quality: unknown): string[] {
  if (!quality || typeof quality !== 'object') return [];
  const items = (quality as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is { level?: string; label?: string; code?: string; message?: string } => Boolean(item) && typeof item === 'object')
    .filter(item => item.level === 'error')
    .map(item => `${item.label || item.code || 'Quality check'}: ${item.message || 'Blocking check failed.'}`);
}

function ErrorNotice({ error, createdTrackId }: { error: Phase4ErrorPresentation; createdTrackId: string | null }) {
  return <div className="phase4-operation-error intake-error"><strong>{createdTrackId ? 'DRAFT CREATED · ACTION NEEDED' : error.title.toUpperCase()}</strong><span>{error.message}</span><b>{error.nextAction}</b>{error.technicalDetails && <details><summary>Technical details</summary><code>{error.technicalDetails}</code></details>}{createdTrackId && <a className="ghost-btn compact" href={trackHref(createdTrackId, 'overview')}>Open recoverable draft</a>}</div>;
}

function albumErrorPresentation(reason: unknown): Phase4ErrorPresentation {
  if (reason instanceof AlbumAdminError) return { title: 'Canonical Album action failed', message: reason.message, nextAction: reason.code === 'ALBUM_WRITE_TRANSPORT' ? 'Do not retry blindly. Reload canonical Album and track state first.' : 'Resolve the Album state in Albums / Projects, then return to this intake.', retrySafe: false, technicalDetails: [reason.code, reason.currentUpdatedAt].filter(Boolean).join(' · ') || null };
  return phase4ErrorPresentation(reason);
}

function intakeErrorPresentation(reason: unknown): Phase4ErrorPresentation {
  if (reason instanceof Phase4AdminError && reason.code === 'PUBLISH_QUALITY_BLOCKED') return { title: 'Draft created · publication blocked', message: reason.message, nextAction: 'The draft and verified uploads are safe. Open the track, fix the listed blockers, then publish from Metadata.', retrySafe: false, technicalDetails: [reason.code, reason.currentUpdatedAt].filter(Boolean).join(' · ') || null };
  return phase4ErrorPresentation(reason);
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
  const [albums, setAlbums] = useState<AdminAlbumSummary[]>([]);
  const [albumLoading, setAlbumLoading] = useState(privateRead);
  const [albumReadError, setAlbumReadError] = useState<string | null>(null);
  const [albumCreating, setAlbumCreating] = useState(false);
  const [newAlbumType, setNewAlbumType] = useState<AdminAlbumType>('album');

  const cover = intakeFileForRole(assignments, 'cover');
  const audio = intakeFileForRole(assignments, 'audio');
  const lyrics = intakeFileForRole(assignments, 'lyrics');
  const video = intakeFileForRole(assignments, 'video');
  const problems = intakeRoleProblems(assignments);
  const effectiveSlug = values.slug.trim() || canonicalIntakeSlug(values.title);
  const basicsValid = values.title.trim().length > 0 && /^[a-z0-9][a-z0-9-]{0,119}$/.test(effectiveSlug);
  const selectedMedia = [cover, audio, lyrics, video].filter(Boolean).length;
  const albumResolution = useMemo<IntakeAlbumResolution>(() => resolveIntakeAlbum(values.albumId, values.albumTitle, albums), [albums, values.albumId, values.albumTitle]);
  const albumReady = !albumLoading && !albumReadError && albumResolution.ready;
  const canSubmit = privateRead && basicsValid && albumReady && !problems.length && !busy && !paletteBusy && !albumCreating;

  async function loadAlbums() {
    if (!privateRead) { setAlbums([]); setAlbumLoading(false); setAlbumReadError(null); return; }
    setAlbumLoading(true);
    try { const payload = await getAdminAlbums(); setAlbums(payload.albums || []); setAlbumReadError(null); }
    catch (reason) { setAlbumReadError(reason instanceof Error ? reason.message : String(reason)); }
    finally { setAlbumLoading(false); }
  }

  useEffect(() => { void loadAlbums(); }, [privateRead]);
  useEffect(() => {
    if (!cover) { setPalette(null); return; }
    let active = true; setPaletteBusy(true);
    extractCoverPalette(cover).then(next => { if (active) setPalette(next); }).catch(reason => { if (active) setError(phase4ErrorPresentation(reason)); }).finally(() => { if (active) setPaletteBusy(false); });
    return () => { active = false; };
  }, [cover]);

  function updateField(field: IntakeFieldName, value: string) {
    setValues(previous => ({ ...previous, [field]: field === 'slug' ? canonicalIntakeSlug(value) : value }));
    setManualFields(previous => new Set(previous).add(field));
    setSources(previous => { const next = { ...previous }; delete next[field]; return next; });
    setPreserved(previous => previous.filter(item => item !== field));
  }

  function chooseCanonicalAlbum(albumId: string) {
    if (albumId === 'singles') setValues(previous => ({ ...previous, albumId: 'singles', albumTitle: 'Singles', type: previous.type === 'album-track' ? 'single' : previous.type }));
    else { const album = albums.find(item => item.id === albumId); if (!album) return; setValues(previous => ({ ...previous, albumId: album.id, albumTitle: album.title, type: 'album-track' })); }
    setManualFields(previous => new Set(previous).add('albumId').add('albumTitle').add('type'));
    setSources(previous => { const next = { ...previous }; delete next.albumId; delete next.albumTitle; delete next.type; return next; });
    setPreserved(previous => previous.filter(item => item !== 'albumId' && item !== 'albumTitle' && item !== 'type'));
  }

  async function createRequestedAlbumDraft() {
    if (albumResolution.kind !== 'missing' || albumCreating) return;
    const requestedId = canonicalAlbumId(albumResolution.requestedId); const requestedTitle = albumResolution.requestedTitle.trim();
    if (!requestedId || !requestedTitle) return;
    if (!globalThis.confirm(`Create canonical ${newAlbumType.toUpperCase()} draft “${requestedTitle}”?\n\nThis writes albums/${requestedId}/manifest.json now. It does not migrate any legacy Album or attach an existing track.`)) return;
    setAlbumCreating(true); setError(null);
    try { const result = await createAdminAlbum({ id: requestedId, title: requestedTitle, type: newAlbumType, year: numeric(values.year), releaseDate: values.releaseDate || null }); if (!result.clientVerified || !result.album) throw new AlbumAdminError(result.verificationWarning || 'The new Album draft could not be canonically verified.'); await loadAlbums(); setValues(previous => ({ ...previous, albumId: result.album!.id, albumTitle: result.album!.title, type: 'album-track' })); }
    catch (reason) { setError(albumErrorPresentation(reason)); }
    finally { setAlbumCreating(false); }
  }

  async function applyTxt(file: File) {
    try { const parsed = parseTrackTxt(await file.text(), file.name, `${values.title} ${values.albumTitle} ${values.genres}`); setValues(previous => { const merged = mergeParsedTrackTxt(previous, parsed, manualFields); setSources(current => ({ ...current, ...merged.sources })); setPreserved(merged.preserved); return merged.values; }); }
    catch (reason) { setError({ title: 'TXT parsing failed', message: reason instanceof Error ? reason.message : String(reason), nextAction: 'Keep the file selected and enter metadata manually, or choose a valid UTF-8 TXT file.', retrySafe: false, technicalDetails: null }); }
  }

  function addFiles(files: FileList | File[]) { const incoming = Array.from(files); if (!incoming.length) return; setAssignments(previous => mergeIntakeFiles(previous, incoming)); setError(null); const txt = incoming.find(file => detectIntakeFileRole(file) === 'lyrics'); if (txt) void applyTxt(txt); }
  function assignRole(id: string, role: IntakeFileRole) { setAssignments(previous => previous.map(item => item.id === id ? { ...item, role, note: role === 'ignore' ? 'Explicitly ignored.' : 'Role confirmed by you.' } : item)); const item = assignments.find(candidate => candidate.id === id); if (item && role === 'lyrics') void applyTxt(item.file); }
  async function calculatePalette() { if (!cover) return; setPaletteBusy(true); setError(null); try { setPalette(await extractCoverPalette(cover)); } catch (reason) { setError(phase4ErrorPresentation(reason)); } finally { setPaletteBusy(false); } }

  function metadataPatch(resolution: IntakeAlbumResolution, status: 'draft' | 'published' = 'draft'): AdminMetadataPatch {
    const genres = splitValues(values.genres); const targetsCanonicalAlbum = resolution.kind === 'existing';
    return { title: values.title.trim(), status, type: targetsCanonicalAlbum ? 'album-track' : (values.type || 'single'), year: numeric(values.year), releaseDate: values.releaseDate || null, languages: splitValues(values.languages), genres, tags: splitValues(values.tags), moods: splitValues(values.moods), themes: splitValues(values.themes), era: values.era.trim() || null, energy: values.energy.trim() || null, bpm: numeric(values.bpm), key: values.key.trim() || null, keyConfidence: numeric(values.keyConfidence), explicit: values.explicit === 'explicit', ...(palette ? { accent: palette.accent, accent2: palette.accent2 } : {}) };
  }

  async function bindNewTrackToCanonicalAlbum(trackId: string, resolution: IntakeAlbumResolution) {
    if (resolution.kind !== 'existing') return;
    const targetRead = await getAdminAlbum(resolution.album.id); const target = targetRead.album?.manifest;
    if (!target?.updatedAt) throw new Phase4AdminError('Canonical target Album revision is unavailable. The new track remains a safe draft in Singles.', null, 'ALBUM_BIND_REVISION_UNAVAILABLE');
    if (target.status !== 'draft') throw new Phase4AdminError(`Canonical Album “${target.title}” is now ${target.status}. The new track remains a safe draft in Singles.`, 409, 'ALBUM_BIND_TARGET_NOT_DRAFT', target.updatedAt);
    try { const moved = await moveAdminAlbumTrack(target.id, { trackId, sourceAlbumId: null, expectedTargetUpdatedAt: target.updatedAt, targetIndex: target.trackIds.length }); if (!moved.clientVerified) throw new Phase4AdminError(moved.verificationWarning || 'Album binding could not be canonically verified. Inspect both Album and track before retrying.', null, 'ALBUM_BIND_UNVERIFIED'); }
    catch (reason) {
      if (reason instanceof AlbumAdminError && reason.code === 'ALBUM_WRITE_TRANSPORT') {
        try { const [albumReread, trackReread] = await Promise.all([getAdminAlbum(target.id), getAdminTrack(trackId)]); if (albumReread.album?.manifest?.trackIds.includes(trackId) === true && trackReread.track?.manifest?.album?.id === target.id) return; } catch {}
        throw new Phase4AdminError('Album binding response was lost and canonical reread did not verify the move. Do not retry blindly; inspect the track and Album first.', null, 'ALBUM_BIND_AMBIGUOUS');
      }
      if (reason instanceof AlbumAdminError) throw new Phase4AdminError(reason.message, reason.status, reason.code || 'ALBUM_BIND_REJECTED', reason.currentUpdatedAt, reason.rollback as Record<string, boolean> | null);
      throw reason;
    }
  }

  async function publishCreatedTrack(trackId: string, resolution: IntakeAlbumResolution) {
    setProgress(previous => [...previous, 'Checking canonical publication quality…']);
    const reread = await getAdminTrack(trackId); const manifest = reread.track?.manifest;
    if (!manifest?.updatedAt || manifest.slug !== trackId || manifest.status !== 'draft') throw new Phase4AdminError('The newly-created draft could not be reread at the exact canonical revision required for publication.', null, 'PUBLISH_REREAD_UNVERIFIED', manifest?.updatedAt || null);
    const validation = await validateAdminTrackMetadata(trackId, manifest.updatedAt, metadataPatch(resolution, 'published'));
    if (validation.valid !== true || validation.validationOnly !== true || !validation.expectedUpdatedAt) { const blockers = qualityBlockerMessages(validation.quality); throw new Phase4AdminError(`Publication blocked. ${blockers.length ? blockers.join(' | ') : 'Track Manager quality gate did not approve publication.'}`, null, 'PUBLISH_QUALITY_BLOCKED', manifest.updatedAt); }
    const confirmed = globalThis.confirm(`Quality gate passed for “${values.title.trim()}”.\n\nPublish this track now?\n\nThis uses the existing protected metadata-save-v1 operation and will be accepted only after a private canonical reread verifies Published.`);
    if (!confirmed) { setProgress(previous => [...previous, 'Publication cancelled · verified draft preserved']); return false; }
    setProgress(previous => [...previous, 'Publishing through protected Track Manager metadata save…']);
    const saved = await saveAdminTrackMetadata(trackId, validation.expectedUpdatedAt, metadataPatch(resolution, 'published'));
    if (!saved.clientVerified || saved.track?.status !== 'published') throw new Phase4AdminError(saved.verificationWarning || 'Track Manager save returned without a verified Published reread. Reload canonical state before another write.', null, 'PUBLISH_UNVERIFIED', saved.updatedAt || null);
    const finalRead = await getAdminTrack(trackId);
    if (finalRead.track?.manifest?.slug !== trackId || finalRead.track.manifest.status !== 'published') throw new Phase4AdminError('Final canonical reread did not confirm Published for the exact trackId.', null, 'PUBLISH_FINAL_REREAD_FAILED', finalRead.track?.manifest?.updatedAt || null);
    setProgress(previous => [...previous, 'Published · private canonical reread VERIFIED']); return true;
  }

  async function create(mode: CreateMode) {
    const resolution = albumResolution; if (!canSubmit || !resolution.ready) return;
    const targetCopy = resolution.kind === 'existing' ? `\n\nSafe binding plan: create recoverable draft in Singles → upload selected assets → bind to canonical draft “${resolution.album.title}”.` : '\n\nThis track will remain in transitional Singles.';
    const publishCopy = mode === 'publish' ? '\n\nAfter those writes are verified, Studio will run the normal publication quality gate. If it passes, you will confirm the protected publish save; if it fails, the safe draft is preserved and the exact blockers are shown.' : '';
    if (!globalThis.confirm(`${mode === 'publish' ? 'Create & Publish' : 'Create draft'} “${values.title.trim()}”?\n\n${selectedMedia} selected media file${selectedMedia === 1 ? '' : 's'} will be uploaded sequentially after the canonical draft reread.${targetCopy}${publishCopy}`)) return;
    setBusy(true); setError(null); setCreatedTrackId(null); setProgress(['Preparing recoverable canonical draft…']);
    try {
      const result = await createAdminTrack(effectiveSlug, metadataPatch(resolution, 'draft'));
      if (!result.clientVerified) throw new Phase4AdminError('The draft was created but its canonical reread could not be verified. Open Track Manager before continuing.', null, 'CREATE_UNVERIFIED');
      setCreatedTrackId(effectiveSlug); setProgress(['Draft created in recoverable Singles state', 'Canonical draft reread verified']); let revision = result.track?.updatedAt || '';
      const uploads: Array<{ kind: AdminAssetKind; file: File; label: string }> = [];
      if (cover) { uploads.push({ kind: 'cover', file: cover, label: 'Cover' }); uploads.push({ kind: 'thumbnail', file: await createCoverThumbnail(cover), label: 'Cover thumbnail' }); }
      if (audio) uploads.push({ kind: 'audio', file: audio, label: 'Audio' }); if (lyrics) uploads.push({ kind: 'lyrics', file: lyrics, label: 'Canonical lyrics.txt' }); if (video) uploads.push({ kind: 'video', file: video, label: 'Canvas video' });
      for (let index = 0; index < uploads.length; index += 1) { if (!revision) throw new Phase4AdminError('The draft exists, but its canonical revision is unavailable. Continue from Assets after a reload.', null, 'REVISION_UNAVAILABLE'); const upload = uploads[index]; const prefix = `${upload.label} (${index + 1}/${uploads.length})`; setProgress(previous => [...previous, `${prefix}: preparing`]); const response = await uploadAdminTrackAsset(effectiveSlug, upload.kind, revision, upload.file, percent => { const stage = percent < 50 ? 'sending' : percent < 100 ? 'verifying response' : 'canonical reread verified'; setProgress(previous => [...previous.slice(0, -1), `${prefix}: ${stage}`]); }); if (!response.clientVerified || !response.updatedAt) throw new Phase4AdminError(`${upload.label} could not be verified. Reload the track before continuing.`, null, 'ASSET_UPLOAD_UNVERIFIED'); revision = response.updatedAt; }
      if (resolution.kind === 'existing') { setProgress(previous => [...previous, `Binding new track to canonical Album “${resolution.album.title}”…`]); await bindNewTrackToCanonicalAlbum(effectiveSlug, resolution); setProgress(previous => [...previous, 'Canonical Album membership + track cache verified']); }
      if (mode === 'publish') await publishCreatedTrack(effectiveSlug, resolution);
      setProgress(previous => [...previous, 'Opening Track Workspace…']); await onCreated?.(); globalThis.location.hash = trackHref(effectiveSlug, 'overview').replace(/^#/, '');
    } catch (reason) { setError(intakeErrorPresentation(reason)); }
    finally { setBusy(false); }
  }

  const provenanceEntries = useMemo(() => Object.entries(sources) as Array<[IntakeFieldName, NonNullable<IntakeFieldSources[IntakeFieldName]>]>, [sources]);
  const canonicalSelectValue = albumResolution.kind === 'existing' ? albumResolution.album.id : albumResolution.kind === 'singles' ? 'singles' : '';

  return <article className="panel phase4-create-panel intake-flow">
    <div className="phase4-panel-head intake-head"><div><span className="eyebrow">NEW TRACK</span><h3>Create the track you mean to release</h3><p>Drop your files, confirm metadata and Album target, then either keep a draft or let Studio finish the same guarded flow through publication.</p></div><button className="ghost-btn compact" type="button" disabled={busy} onClick={onCancel}>Close</button></div>
    <ol className="intake-steps" aria-label="New Track steps">{(['Files', 'Metadata', 'Review'] as const).map((label, index) => <li className={step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''} key={label}><b>{index + 1}</b><span>{label}</span></li>)}</ol>
    {!privateRead && <div className="workspace-note"><strong>Sign in to Track Manager first.</strong><p>New Track remains locked while Studio is using the public read-only catalog.</p></div>}
    {step === 2 && <section className="intake-step-panel"><div className="phase4-create-grid intake-metadata-grid">
      <label><span>Title <b>Required</b></span><input autoFocus value={values.title} onChange={event => updateField('title', event.target.value)} /></label><label><span>Album request</span><input value={values.albumTitle} onChange={event => updateField('albumTitle', event.target.value)} placeholder="Singles or canonical Album title" /></label><label><span>Canonical target</span><select value={canonicalSelectValue} onChange={event => chooseCanonicalAlbum(event.target.value)}><option value="">Resolve requested Album…</option><option value="singles">Singles (no canonical Album membership)</option>{albums.map(album => <option key={album.id} value={album.id}>{album.title} · {album.status.toUpperCase()} · {album.type.toUpperCase()}</option>)}</select></label><label><span>Type</span><select value={albumResolution.kind === 'existing' ? 'album-track' : values.type} disabled={albumResolution.kind === 'existing'} onChange={event => updateField('type', event.target.value)}><option value="single">Single</option><option value="album-track">Album track</option><option value="demo">Demo</option></select></label><label><span>Release date</span><input type="date" value={values.releaseDate} onChange={event => updateField('releaseDate', event.target.value)} /></label><label><span>Languages</span><input value={values.languages} onChange={event => updateField('languages', event.target.value)} placeholder="English, French" /></label><label><span>Genres</span><input value={values.genres} onChange={event => updateField('genres', event.target.value)} placeholder="R&B, Hip-hop" /></label><label><span>Tags</span><input value={values.tags} onChange={event => updateField('tags', event.target.value)} placeholder="Editorial, discovery, context" /></label><label><span>Moods</span><input value={values.moods} onChange={event => updateField('moods', event.target.value)} /></label><label><span>Themes</span><input value={values.themes} onChange={event => updateField('themes', event.target.value)} /></label><label><span>BPM</span><input inputMode="decimal" value={values.bpm} onChange={event => updateField('bpm', event.target.value)} /></label><label><span>Key</span><input value={values.key} onChange={event => updateField('key', event.target.value)} /></label><label><span>Energy</span><input value={values.energy} onChange={event => updateField('energy', event.target.value)} /></label><label><span>Explicit</span><select value={values.explicit} onChange={event => updateField('explicit', event.target.value)}><option value="clean">Clean</option><option value="explicit">Explicit</option></select></label>
    </div><div className={`intake-album-resolution ${albumResolution.kind}`} role={albumResolution.ready ? 'status' : 'alert'}><div><strong>{albumLoading ? 'Resolving canonical Albums…' : albumResolution.kind === 'singles' ? 'Singles / no Album binding' : albumResolution.kind === 'existing' ? `Canonical draft: ${albumResolution.album.title}` : albumResolution.kind === 'missing' ? `Canonical Album missing: ${albumResolution.requestedTitle}` : `Album binding blocked: ${albumResolution.album.title}`}</strong><span>{albumReadError || albumResolution.reason}</span></div>{albumResolution.kind === 'existing' && <small>{albumResolution.album.id} · {albumResolution.album.type.toUpperCase()} · {albumResolution.album.trackIds.length} current tracks · type derived as ALBUM TRACK</small>}{albumResolution.kind === 'missing' && !albumReadError && <div className="intake-album-create"><select aria-label="New canonical release type" value={newAlbumType} onChange={event => setNewAlbumType(event.target.value as AdminAlbumType)}><option value="album">Album</option><option value="ep">EP</option><option value="collection">Collection</option></select><button className="ghost-btn compact" type="button" disabled={albumCreating || albumLoading} onClick={() => void createRequestedAlbumDraft()}>{albumCreating ? 'Creating…' : `Create canonical ${newAlbumType} draft`}</button></div>}{albumResolution.kind === 'blocked' && <a className="ghost-btn compact" href={routeHref('albums')}>Open Albums / Projects</a>}{albumReadError && <button className="ghost-btn compact" type="button" onClick={() => void loadAlbums()}>Retry Album read</button>}</div><details className="intake-technical"><summary>Technical identifier and extended metadata</summary><div className="phase4-create-grid"><label><span>trackId</span><input value={values.slug} onChange={event => updateField('slug', event.target.value)} placeholder={canonicalIntakeSlug(values.title) || 'generated-from-title'} /></label><label><span>Requested Album ID</span><input value={values.albumId} onChange={event => updateField('albumId', event.target.value)} /></label><label><span>Year</span><input inputMode="numeric" value={values.year} onChange={event => updateField('year', event.target.value)} /></label><label><span>Era</span><input value={values.era} onChange={event => updateField('era', event.target.value)} /></label></div></details></section>}
    {step === 1 && <section className="intake-step-panel intake-media-step"><label className={`intake-drop-zone${dragActive ? ' active' : ''}`} onDragEnter={event => { event.preventDefault(); setDragActive(true); }} onDragOver={event => event.preventDefault()} onDragLeave={() => setDragActive(false)} onDrop={event => { event.preventDefault(); setDragActive(false); addFiles(event.dataTransfer.files); }}><strong>Drop audio, cover, TXT and Canvas together</strong><span>or choose multiple files · Studio classifies by extension and MIME, then asks you to resolve conflicts</span><input type="file" multiple accept="audio/*,image/*,text/plain,video/mp4,video/webm,.mp3,.wav,.flac,.m4a,.aac,.ogg,.jpg,.jpeg,.png,.webp,.gif,.txt,.mp4,.webm" onChange={event => event.target.files && addFiles(event.target.files)} /></label>{assignments.length > 0 && <div className="intake-assignment-list">{assignments.map(item => <div key={item.id} className={item.detectedRole === 'ambiguous' ? 'ambiguous' : ''}><div><strong>{item.file.name}</strong><span>{item.note} · {(item.file.size / 1024 / 1024).toFixed(2)} MB</span></div><select aria-label={`Role for ${item.file.name}`} value={item.role} onChange={event => assignRole(item.id, event.target.value as IntakeFileRole)}>{Object.entries(ROLE_LABELS).map(([role, label]) => <option value={role} key={role}>{label}</option>)}</select><button className="ghost-btn compact" type="button" onClick={() => setAssignments(previous => previous.filter(candidate => candidate.id !== item.id))}>Remove</button></div>)}</div>}{problems.map(problem => <p className="intake-file-problem" key={problem}>{problem}</p>)}{cover && <div className="intake-cover-workbench"><CoverImagePreview file={cover} alt="Selected cover preview" /><CoverPalettePreview palette={palette} editable onChange={setPalette} busy={paletteBusy} onRecalculate={() => void calculatePalette()} note="Preview of LaunchPAD’s canonical accent / accent2. You can refine both values before creation." /></div>}{(provenanceEntries.length > 0 || preserved.length > 0) && <div className="intake-provenance"><strong>TXT metadata review</strong><div>{provenanceEntries.map(([field, source]) => <span key={field}><b>{FIELD_LABELS[field] || field}</b>{sourceLabel(source)}</span>)}{preserved.map(field => <span className="preserved" key={`preserved-${field}`}><b>{FIELD_LABELS[field] || field}</b>EXISTING USER VALUE PRESERVED</span>)}</div>{values.duration && <p>Detected duration reference: <b>{values.duration}</b>. Canonical duration remains derived from uploaded audio; Studio does not create a second duration field.</p>}</div>}</section>}
    {step === 3 && <section className="intake-step-panel intake-review"><div className="intake-review-summary"><div><span>Track</span><strong>{values.title.trim()}</strong><small>{albumResolution.kind === 'existing' ? albumResolution.album.title : 'Singles'} · {albumResolution.kind === 'existing' ? 'album-track' : values.type}</small></div><div><span>Classified media</span><strong>{selectedMedia}</strong><small>{assignments.filter(item => item.role !== 'ignore').map(item => ROLE_LABELS[item.role]).join(' · ') || 'No media selected'}</small></div><div><span>Initial state</span><strong>Safe draft first</strong><small>Draft → verified uploads → {albumResolution.kind === 'existing' ? 'canonical Album binding → ' : ''}optional guarded publish.</small></div></div><div className="intake-review-metadata"><strong>Metadata to create</strong><dl><div><dt>trackId</dt><dd>{effectiveSlug}</dd></div><div><dt>Album binding</dt><dd>{albumResolution.kind === 'existing' ? `${albumResolution.album.title} · after uploads` : 'Singles'}</dd></div><div><dt>Genres / tags</dt><dd>{[values.genres, values.tags].filter(Boolean).join(' · ') || '—'}</dd></div><div><dt>Moods</dt><dd>{values.moods || '—'}</dd></div><div><dt>Themes</dt><dd>{values.themes || '—'}</dd></div><div><dt>Release</dt><dd>{values.releaseDate || values.year || '—'}</dd></div><div><dt>Music</dt><dd>{[values.bpm && `${values.bpm} BPM`, values.key].filter(Boolean).join(' · ') || '—'}</dd></div></dl></div>{cover && <div className="intake-cover-workbench compact"><CoverImagePreview file={cover} alt="Cover review" /><CoverPalettePreview palette={palette} editable onChange={setPalette} title="Palette review" busy={paletteBusy} onRecalculate={() => void calculatePalette()} note="These exact canonical accent / accent2 values will be saved on draft creation." /></div>}<details className="intake-technical"><summary>Write contract</summary><p>Studio always creates a recoverable draft first, uploads one asset at a time, then binds the new track through Album authority. Create & Publish adds only the existing metadata validate/save operation after those reads succeed. Studio never writes R2 directly, never puts Album membership in generic metadata, never creates a phantom albumId and never blind-retries an ambiguous write.</p></details></section>}
    {busy && <div className="intake-progress-stages" aria-live="polite">{progress.map((item, index) => <span key={`${index}-${item}`}>{item}</span>)}</div>}
    <div className="intake-actions"><button className="ghost-btn" type="button" disabled={busy || step === 1} onClick={() => setStep(previous => Math.max(1, previous - 1) as 1 | 2 | 3)}>Back</button>{step < 3 ? <button className="primary-btn" type="button" disabled={busy || albumCreating || (step === 1 && Boolean(problems.length)) || (step === 2 && (!basicsValid || !albumReady))} onClick={() => setStep(previous => Math.min(3, previous + 1) as 1 | 2 | 3)}>Continue</button> : <><button className="ghost-btn" type="button" disabled={!canSubmit} onClick={() => void create('draft')}>{busy ? 'Working…' : 'Create draft'}</button><button className="primary-btn" type="button" disabled={!canSubmit} onClick={() => void create('publish')}>{busy ? 'Working…' : 'Create & Publish'}</button></>}</div>{error && <ErrorNotice error={error} createdTrackId={createdTrackId} />}
  </article>;
}
