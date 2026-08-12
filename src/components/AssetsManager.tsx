import { useMemo, useState } from 'react';
import { extractCoverPalette, type CoverPalette } from '../cover-palette';
import type { StudioAsset, StudioTrackDetail } from '../types/studio';
import {
  AdminSaveError,
  AdminValidationError,
  saveAdminTrackMetadata,
  validateAdminTrackMetadata,
  type AdminAssetKind,
} from '../services/admin-api';
import {
  deleteAdminTrackAsset,
  phase4ErrorPresentation,
  uploadAdminTrackAsset,
  type AssetMutationResponse,
  type Phase4ErrorPresentation,
} from '../services/phase4-admin-api';
import { CoverImagePreview } from './CoverImagePreview';
import { CoverPalettePreview } from './CoverPalettePreview';

interface AssetDefinition {
  kind: AdminAssetKind;
  label: string;
  accept: string;
  canonicalHint: string;
}

const ASSETS: AssetDefinition[] = [
  { kind: 'audio', label: 'Audio', accept: '.mp3,.wav,.flac,.m4a,.aac,.ogg,audio/*', canonicalHint: 'mp3 / wav / flac / m4a / aac / ogg · max 50 MB' },
  { kind: 'cover', label: 'Cover', accept: '.jpg,.jpeg,.png,.webp,.gif,image/*', canonicalHint: 'jpg / jpeg / png / webp / gif · max 50 MB' },
  { kind: 'thumbnail', label: 'Thumbnail', accept: '.jpg,.jpeg,.png,.webp,image/*', canonicalHint: 'jpg / jpeg / png / webp · max 2 MB' },
  { kind: 'lyrics', label: 'Lyrics TXT', accept: '.txt,text/plain', canonicalHint: 'TXT only · stored canonically as lyrics.txt' },
  { kind: 'video', label: 'Video / Canvas', accept: '.mp4,.webm,video/mp4,video/webm', canonicalHint: 'mp4 / webm · max 50 MB' },
];

function assetFor(track: StudioTrackDetail, kind: AdminAssetKind): StudioAsset | null {
  if (kind === 'lyrics') return track.assets.lyricsTxt;
  return track.assets[kind] || null;
}

export function AssetsManager({
  track,
  onChanged,
  kinds,
  eyebrow = 'ASSETS',
  title = 'Manage production media',
  description = 'Upload, replace or remove one media item at a time. Every operation is verified before the workspace refreshes.',
}: {
  track: StudioTrackDetail;
  onChanged: () => Promise<void> | void;
  kinds?: AdminAssetKind[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [selected, setSelected] = useState<Partial<Record<AdminAssetKind, File>>>({});
  const [progress, setProgress] = useState<Partial<Record<AdminAssetKind, number>>>({});
  const [busyKind, setBusyKind] = useState<AdminAssetKind | null>(null);
  const [error, setError] = useState<Phase4ErrorPresentation | null>(null);
  const [lastFailedKind, setLastFailedKind] = useState<AdminAssetKind | null>(null);
  const [result, setResult] = useState<AssetMutationResponse | null>(null);
  const [palettePreview, setPalettePreview] = useState<CoverPalette | null>(null);
  const [paletteBusy, setPaletteBusy] = useState(false);
  const [paletteMessage, setPaletteMessage] = useState<string | null>(null);

  const revision = track.updatedAt || '';
  const locked = track.readSource !== 'private' || !revision;
  const visibleAssets = useMemo(() => ASSETS.filter(def => !kinds || kinds.includes(def.kind)), [kinds]);
  const currentAssets = useMemo(() => Object.fromEntries(ASSETS.map(def => [def.kind, assetFor(track, def.kind)])) as Record<AdminAssetKind, StudioAsset | null>, [track]);
  const savedPalette = /^#[0-9a-f]{6}$/i.test(track.accent || '') && /^#[0-9a-f]{6}$/i.test(track.accent2 || '')
    ? { accent: track.accent as string, accent2: track.accent2 as string }
    : null;

  async function paletteBlob(): Promise<Blob> {
    const selectedCover = selected.cover;
    if (selectedCover) return selectedCover;
    const current = track.assets.cover;
    if (!current) throw new Error('Choose a cover or upload one before extracting colors.');
    const response = await fetch(current.fullUrl || current.url, { cache: 'no-store', credentials: 'include' });
    if (!response.ok) throw new Error(`The current cover is unavailable (HTTP ${response.status}).`);
    return response.blob();
  }

  async function recalculatePalette() {
    if (locked || paletteBusy) return;
    setPaletteBusy(true);
    setError(null);
    setPaletteMessage(null);
    try {
      setPalettePreview(await extractCoverPalette(await paletteBlob()));
      setPaletteMessage('Preview recalculated. The saved manifest palette is still unchanged.');
    } catch (reason) {
      setError(phase4ErrorPresentation(reason));
    } finally {
      setPaletteBusy(false);
    }
  }

  async function savePalette() {
    if (locked || paletteBusy || !palettePreview || !revision) return;
    if (!globalThis.confirm(`Update the saved LaunchPAD palette for ${track.title}?\n\naccent: ${palettePreview.accent}\naccent2: ${palettePreview.accent2}\n\nThis updates only these two canonical manifest fields.`)) return;
    setPaletteBusy(true);
    setError(null);
    setPaletteMessage(null);
    try {
      const patch = { accent: palettePreview.accent, accent2: palettePreview.accent2 };
      const validation = await validateAdminTrackMetadata(track.id, revision, patch);
      if (validation.valid !== true) throw new Error('Track Manager did not accept this palette proposal. Review Content Health before retrying.');
      const response = await saveAdminTrackMetadata(track.id, revision, patch);
      if (!response.clientVerified) throw new Error('The palette save returned without a verified canonical reread. Reload before another edit.');
      setPaletteMessage(response.noChange ? 'The canonical palette already had these values.' : 'Palette saved and verified in the canonical manifest.');
      await onChanged();
    } catch (reason) {
      if (reason instanceof AdminValidationError || reason instanceof AdminSaveError) {
        setError({ title: 'Palette update rejected', message: reason.message, nextAction: 'Reload canonical metadata and review validation details before another save.', retrySafe: false, technicalDetails: reason.code || null });
      } else setError(phase4ErrorPresentation(reason));
    } finally {
      setPaletteBusy(false);
    }
  }

  async function upload(def: AssetDefinition) {
    const file = selected[def.kind];
    if (!file || locked) return;
    const current = currentAssets[def.kind];
    const verb = current ? 'Replace' : 'Upload';
    if (!globalThis.confirm(`${verb} ${def.label} for ${track.title}?\n\nSelected file: ${file.name}\nCurrent canonical revision: ${revision}\n\nTrack Manager will update only this asset, the manifest revision and catalog projection. Existing media of other kinds will not be touched.`)) return;
    setBusyKind(def.kind);
    setError(null);
    setResult(null);
    setLastFailedKind(null);
    setProgress(previous => ({ ...previous, [def.kind]: 0 }));
    try {
      const response = await uploadAdminTrackAsset(track.id, def.kind, revision, file, percent => {
        setProgress(previous => ({ ...previous, [def.kind]: percent }));
      });
      setResult(response);
      setSelected(previous => {
        const next = { ...previous };
        delete next[def.kind];
        return next;
      });
      await onChanged();
    } catch (reason) {
      setLastFailedKind(def.kind);
      setError(phase4ErrorPresentation(reason));
    } finally {
      setBusyKind(null);
    }
  }

  async function remove(def: AssetDefinition) {
    const current = currentAssets[def.kind];
    if (!current || locked) return;
    const warning = track.status === 'published' && (def.kind === 'audio' || def.kind === 'cover')
      ? '\n\nThis is an essential published asset. Track Manager is expected to block deletion while the track remains published.'
      : '';
    if (!globalThis.confirm(`DELETE ${def.label} from ${track.title}?\n\nCanonical file: ${current.filename}\nRevision: ${revision}${warning}\n\nThis is a destructive asset operation. Track Manager creates a temporary rollback backup before deleting.`)) return;
    setBusyKind(def.kind);
    setError(null);
    setResult(null);
    try {
      const response = await deleteAdminTrackAsset(track.id, def.kind, revision);
      setResult(response);
      await onChanged();
    } catch (reason) {
      setLastFailedKind(null);
      setError(phase4ErrorPresentation(reason));
    } finally {
      setBusyKind(null);
    }
  }

  return (
    <article className="panel phase4-assets-manager">
      <div className="phase4-panel-head">
        <div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3><p>{description}</p></div>
        <b>{locked ? 'READ ONLY' : 'EDITING ENABLED'}</b>
      </div>

      {locked && <p className="workspace-muted">Asset mutations require PRIVATE READ and a canonical manifest revision. The existing Track Manager fallback remains available.</p>}

      <div className="phase4-assets-list">
        {visibleAssets.map(def => {
          const current = currentAssets[def.kind];
          const file = selected[def.kind];
          const currentProgress = progress[def.kind];
          const busy = busyKind === def.kind;
          return (
            <section className="phase4-asset-control" key={def.kind}>
              <div className="phase4-asset-main">
                <div>
                  <strong>{def.label}</strong>
                  <span>{current?.filename || 'Missing'}</span>
                  <small>{def.canonicalHint}</small>
                </div>
                <div className="phase4-asset-state"><b className={current ? 'ready' : 'pending'}>{current ? 'PRESENT' : 'MISSING'}</b></div>
              </div>

              <div className="phase4-file-row">
                <label className="phase4-file-picker">
                  <span>{file ? file.name : current ? 'Choose replacement…' : 'Choose file…'}</span>
                  <input
                    type="file"
                    accept={def.accept}
                    disabled={locked || Boolean(busyKind)}
                    onChange={event => {
                      const next = event.target.files?.[0];
                      setSelected(previous => ({ ...previous, [def.kind]: next }));
                      if (def.kind === 'cover') {
                        setPalettePreview(null);
                        setPaletteMessage(next ? 'New cover selected. Saved accent / accent2 remain unchanged until you explicitly extract and save a new palette.' : null);
                      }
                      setResult(null);
                      setError(null);
                      setLastFailedKind(null);
                    }}
                  />
                </label>
                <button className="primary-btn" type="button" disabled={locked || Boolean(busyKind) || !file} onClick={() => void upload(def)}>{busy ? 'Working…' : current ? 'Replace' : 'Upload'}</button>
                <button className="danger-btn" type="button" disabled={locked || Boolean(busyKind) || !current} onClick={() => void remove(def)}>Delete asset</button>
              </div>

              {busy && typeof currentProgress === 'number' && (
                <div className="phase4-upload-progress" aria-label={`${def.label} upload progress`}>
                  <i style={{ width: `${currentProgress}%` }} /><span>{currentProgress}%</span>
                </div>
              )}
              {def.kind === 'cover' && (
                <div className="assets-cover-palette">
                  <CoverImagePreview file={file} canonicalUrl={current?.fullUrl || current?.url || null} alt={`${track.title} cover preview`} />
                  <CoverPalettePreview
                    palette={palettePreview || savedPalette}
                    title={palettePreview ? 'Extracted palette preview' : 'Saved cover palette'}
                    note={palettePreview ? 'Preview only. Uploading or replacing the cover does not save these colors.' : 'Canonical LaunchPAD manifest fields. Cover replacement never changes them automatically.'}
                    busy={paletteBusy}
                    actionLabel="Extract colors"
                    onRecalculate={!locked && (Boolean(file) || Boolean(current)) ? () => void recalculatePalette() : undefined}
                    editable={Boolean(palettePreview)}
                    onChange={setPalettePreview}
                  />
                  {palettePreview && <button className="primary-btn compact" type="button" disabled={paletteBusy} onClick={() => void savePalette()}>Save palette</button>}
                  {paletteMessage && <p className="assets-palette-message">{paletteMessage}</p>}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {result && (
        <div className={`phase4-operation-result ${result.clientVerified ? 'ok' : 'warning'}`}>
          <strong>{result.saved ? 'ASSET SAVED' : result.deleted ? 'ASSET DELETED' : 'OPERATION COMPLETE'}</strong>
          <span>Canonical reread: {result.clientVerified ? 'Verified' : 'Check required'} · Catalog rebuilt: {result.catalogRebuilt ? 'Yes' : 'No'} · Revision: {result.updatedAt || '—'}</span>
        </div>
      )}
      {error && (
        <div className="phase4-operation-error assets-error">
          <strong>{error.title.toUpperCase()}</strong><span>{error.message}</span><b>{error.nextAction}</b>
          {error.technicalDetails && <details><summary>Technical details</summary><code>{error.technicalDetails}</code></details>}
          {error.retrySafe && lastFailedKind && selected[lastFailedKind] && <button className="primary-btn compact" type="button" disabled={Boolean(busyKind)} onClick={() => { const def = ASSETS.find(item => item.kind === lastFailedKind); if (def) void upload(def); }}>Retry explicit upload</button>}
        </div>
      )}

      <details className="workspace-diagnostics phase4-assets-diagnostics"><summary>Safety details</summary><p>One asset changes per operation. Destructive actions require confirmation and whole-track deletion is intentionally not exposed. Track Manager preserves stale-write and rollback protection internally.</p></details>
    </article>
  );
}