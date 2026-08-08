import { useMemo, useState } from 'react';
import type { StudioAsset, StudioTrackDetail } from '../types/studio';
import type { AdminAssetKind } from '../services/admin-api';
import {
  deleteAdminTrackAsset,
  Phase4AdminError,
  uploadAdminTrackAsset,
  type AssetMutationResponse,
} from '../services/phase4-admin-api';

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

function errorText(reason: unknown): string {
  if (reason instanceof Phase4AdminError) {
    const parts = [reason.message];
    if (reason.code) parts.push(reason.code);
    if (reason.rollback) {
      const rollback = Object.entries(reason.rollback).map(([key, value]) => `${key}:${value ? 'ok' : 'no'}`).join(' · ');
      if (rollback) parts.push(`rollback ${rollback}`);
    }
    return parts.join(' · ');
  }
  return reason instanceof Error ? reason.message : String(reason);
}

export function AssetsManager({ track, onChanged }: { track: StudioTrackDetail; onChanged: () => Promise<void> | void }) {
  const [selected, setSelected] = useState<Partial<Record<AdminAssetKind, File>>>({});
  const [progress, setProgress] = useState<Partial<Record<AdminAssetKind, number>>>({});
  const [busyKind, setBusyKind] = useState<AdminAssetKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssetMutationResponse | null>(null);

  const revision = track.updatedAt || '';
  const locked = track.readSource !== 'private' || !revision;
  const currentAssets = useMemo(() => Object.fromEntries(ASSETS.map(def => [def.kind, assetFor(track, def.kind)])) as Record<AdminAssetKind, StudioAsset | null>, [track]);

  async function upload(def: AssetDefinition) {
    const file = selected[def.kind];
    if (!file || locked) return;
    const current = currentAssets[def.kind];
    const verb = current ? 'Replace' : 'Upload';
    if (!globalThis.confirm(`${verb} ${def.label} for ${track.title}?\n\nSelected file: ${file.name}\nCurrent canonical revision: ${revision}\n\nTrack Manager will update only this asset, the manifest revision and catalog projection. Existing media of other kinds will not be touched.`)) return;
    setBusyKind(def.kind);
    setError(null);
    setResult(null);
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
      setError(errorText(reason));
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
      setError(errorText(reason));
    } finally {
      setBusyKind(null);
    }
  }

  return (
    <article className="panel phase4-assets-manager">
      <div className="phase4-panel-head">
        <div><span className="eyebrow">TRACK MANAGER / ASSETS</span><h3>Canonical Assets Manager</h3></div>
        <b>{locked ? 'LOCKED' : 'BRIDGE v1.5'}</b>
      </div>

      {locked && <p className="workspace-muted">Asset mutations require PRIVATE READ and a canonical manifest revision. The existing Track Manager fallback remains available.</p>}

      <div className="phase4-assets-list">
        {ASSETS.map(def => {
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
                      setResult(null);
                      setError(null);
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
      {error && <div className="phase4-operation-error"><strong>ASSET OPERATION ERROR</strong><span>{error}</span></div>}

      <p className="workspace-footnote">One asset per operation. Upload uses multipart FormData with progress and no custom request header. Destructive actions require confirmation. Whole-track deletion is intentionally not exposed.</p>
    </article>
  );
}
