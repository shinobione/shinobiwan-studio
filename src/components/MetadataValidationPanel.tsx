import { useEffect, useMemo, useState } from 'react';
import {
  AdminValidationError,
  validateAdminTrackMetadata,
  type AdminManifest,
  type AdminMetadataPatch,
  type AdminMetadataValidationResponse,
} from '../services/admin-api';
import { studioConfig } from '../services/config';
import type { StudioTrackDetail } from '../types/studio';

type MetadataFormState = {
  title: string;
  status: string;
  type: string;
  year: string;
  releaseDate: string;
  albumId: string;
  albumTitle: string;
  genres: string;
  tags: string;
  moods: string;
  themes: string;
  era: string;
  energy: string;
  languages: string;
  bpm: string;
  key: string;
  keyConfidence: string;
  explicit: 'unrated' | 'clean' | 'explicit';
  accent: string;
  accent2: string;
};

function csv(values: string[]): string {
  return values.join(', ');
}

function initialForm(track: StudioTrackDetail): MetadataFormState {
  return {
    title: track.title,
    status: track.status,
    type: track.type,
    year: track.year == null ? '' : String(track.year),
    releaseDate: track.releaseDate || '',
    albumId: track.album.id || '',
    albumTitle: track.album.title || '',
    genres: csv(track.genres),
    tags: csv(track.tags),
    moods: csv(track.moods),
    themes: csv(track.themes),
    era: track.era || '',
    energy: track.energy || '',
    languages: csv(track.languages),
    bpm: track.bpm == null ? '' : String(track.bpm),
    key: track.key || '',
    keyConfidence: track.keyConfidence == null ? '' : String(track.keyConfidence),
    explicit: track.explicit == null ? 'unrated' : track.explicit ? 'explicit' : 'clean',
    accent: track.accent || '',
    accent2: track.accent2 || '',
  };
}

function splitCsv(value: string): string[] {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function nullableText(value: string): string | null {
  const clean = value.trim();
  return clean || null;
}

function nullableNumber(value: string): number | null {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function buildPatch(form: MetadataFormState): AdminMetadataPatch {
  const albumId = form.albumId.trim();
  const albumTitle = form.albumTitle.trim();
  return {
    title: form.title.trim(),
    status: form.status,
    type: form.type.trim(),
    year: nullableNumber(form.year),
    releaseDate: nullableText(form.releaseDate),
    album: albumId || albumTitle ? { id: albumId, title: albumTitle } : null,
    genres: splitCsv(form.genres),
    tags: splitCsv(form.tags),
    moods: splitCsv(form.moods),
    themes: splitCsv(form.themes),
    era: nullableText(form.era),
    energy: nullableText(form.energy),
    languages: splitCsv(form.languages),
    bpm: nullableNumber(form.bpm),
    key: nullableText(form.key),
    keyConfidence: nullableNumber(form.keyConfidence),
    explicit: form.explicit === 'unrated' ? null : form.explicit === 'explicit',
    accent: nullableText(form.accent),
    accent2: nullableText(form.accent2),
  };
}

function proposalValue(manifest: AdminManifest | undefined, field: keyof AdminManifest): string {
  const value = manifest?.[field];
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (value && typeof value === 'object') {
    if ('title' in value || 'id' in value) {
      const album = value as { id?: string; title?: string };
      return [album.title, album.id ? `(${album.id})` : ''].filter(Boolean).join(' ') || '—';
    }
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value == null || value === '' ? '—' : String(value);
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`metadata-field${wide ? ' metadata-field-wide' : ''}`}><span>{label}</span>{children}</label>;
}

export function MetadataValidationPanel({ track }: { track: StudioTrackDetail }) {
  const privateRead = track.readSource === 'private';
  const [form, setForm] = useState<MetadataFormState>(() => initialForm(track));
  const [validation, setValidation] = useState<AdminMetadataValidationResponse | null>(null);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialForm(track));
    setValidation(null);
    setError(null);
  }, [track.id, track.updatedAt, track.readSource]);

  const patch = useMemo(() => buildPatch(form), [form]);
  const canValidate = privateRead && Boolean(track.updatedAt) && !validating;

  function update<K extends keyof MetadataFormState>(key: K, value: MetadataFormState[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setValidation(null);
    setError(null);
  }

  async function validate() {
    if (!canValidate || !track.updatedAt) return;
    setValidating(true);
    setError(null);
    setValidation(null);
    try {
      const result = await validateAdminTrackMetadata(track.id, track.updatedAt, patch);
      setValidation(result);
    } catch (reason) {
      if (reason instanceof AdminValidationError && reason.code === 'STALE_MANIFEST') {
        setError(`Canonical manifest changed since this workspace loaded${reason.currentUpdatedAt ? ` (${reason.currentUpdatedAt})` : ''}. Reload the track before validating again.`);
      } else {
        setError(reason instanceof Error ? reason.message : String(reason));
      }
    } finally {
      setValidating(false);
    }
  }

  const quality = validation?.quality;
  const changedFields = validation?.changedFields || [];

  return (
    <div className="metadata-validation-shell">
      <div className="metadata-validation-head">
        <div>
          <span className="eyebrow">METADATA / VALIDATION PREVIEW</span>
          <h3>Canonical metadata proposal</h3>
          <p>Edit locally, then ask Track Manager v5.9 to normalize and quality-check the proposal. This screen cannot save it.</p>
        </div>
        <b className="metadata-no-write">VALIDATION ONLY · NO WRITE</b>
      </div>

      {!privateRead && (
        <div className="workspace-note metadata-lock-note">
          <strong>Private Track Manager session required.</strong>
          <p>The public fallback is intentionally insufficient for metadata validation because it does not guarantee the canonical manifest revision.</p>
          <a className="ghost-btn" href={studioConfig.trackManagerUrl} target="_blank" rel="noreferrer">Authenticate in Track Manager ↗</a>
        </div>
      )}

      {privateRead && !track.updatedAt && (
        <div className="workspace-note metadata-lock-note"><strong>Canonical revision unavailable.</strong><p>Validation stays locked because Build 6 refuses to submit metadata without expectedUpdatedAt stale-write protection.</p></div>
      )}

      <div className="metadata-form-grid">
        <Field label="Title" wide><input value={form.title} onChange={event => update('title', event.target.value)} /></Field>
        <Field label="Status"><select value={form.status} onChange={event => update('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field>
        <Field label="Type"><input value={form.type} onChange={event => update('type', event.target.value)} /></Field>
        <Field label="Year"><input inputMode="numeric" value={form.year} onChange={event => update('year', event.target.value)} placeholder="2026" /></Field>
        <Field label="Release date"><input type="date" value={form.releaseDate} onChange={event => update('releaseDate', event.target.value)} /></Field>
        <Field label="Album ID"><input value={form.albumId} onChange={event => update('albumId', event.target.value)} /></Field>
        <Field label="Album title"><input value={form.albumTitle} onChange={event => update('albumTitle', event.target.value)} /></Field>
        <Field label="Genres" wide><input value={form.genres} onChange={event => update('genres', event.target.value)} placeholder="R&B, Trap" /></Field>
        <Field label="Tags" wide><input value={form.tags} onChange={event => update('tags', event.target.value)} /></Field>
        <Field label="Moods"><input value={form.moods} onChange={event => update('moods', event.target.value)} /></Field>
        <Field label="Themes"><input value={form.themes} onChange={event => update('themes', event.target.value)} /></Field>
        <Field label="Era"><input value={form.era} onChange={event => update('era', event.target.value)} /></Field>
        <Field label="Energy"><input value={form.energy} onChange={event => update('energy', event.target.value)} /></Field>
        <Field label="Languages" wide><input value={form.languages} onChange={event => update('languages', event.target.value)} placeholder="English, French" /></Field>
        <Field label="BPM"><input inputMode="decimal" value={form.bpm} onChange={event => update('bpm', event.target.value)} /></Field>
        <Field label="Key"><input value={form.key} onChange={event => update('key', event.target.value)} placeholder="F# minor" /></Field>
        <Field label="Key confidence"><input inputMode="decimal" value={form.keyConfidence} onChange={event => update('keyConfidence', event.target.value)} /></Field>
        <Field label="Content"><select value={form.explicit} onChange={event => update('explicit', event.target.value as MetadataFormState['explicit'])}><option value="unrated">Unrated</option><option value="clean">Clean</option><option value="explicit">Explicit</option></select></Field>
        <Field label="Accent"><input value={form.accent} onChange={event => update('accent', event.target.value)} placeholder="#52e3d6" /></Field>
        <Field label="Accent 2"><input value={form.accent2} onChange={event => update('accent2', event.target.value)} placeholder="#00e5ff" /></Field>
      </div>

      <div className="metadata-validation-actions">
        <div><span>Canonical revision</span><strong>{track.updatedAt || 'Unavailable'}</strong></div>
        <button className="ghost-btn metadata-reset-btn" type="button" onClick={() => { setForm(initialForm(track)); setValidation(null); setError(null); }}>Reset proposal</button>
        <button className="metadata-validate-btn" type="button" disabled={!canValidate} onClick={validate}>{validating ? 'Validating…' : 'Validate metadata'}</button>
      </div>

      {error && <div className="metadata-validation-result metadata-result-error"><b>VALIDATION ERROR</b><p>{error}</p></div>}

      {validation && (
        <div className={`metadata-validation-result ${validation.valid ? 'metadata-result-ok' : 'metadata-result-blocked'}`}>
          <div className="metadata-result-title">
            <div><b>{validation.valid ? 'VALID PROPOSAL' : 'QUALITY BLOCKED'}</b><strong>{changedFields.length ? `${changedFields.length} changed field${changedFields.length > 1 ? 's' : ''}` : 'No metadata change'}</strong></div>
            <span>{validation.validationOnly ? 'PREVIEW · NOT SAVED' : 'UNEXPECTED RESPONSE'}</span>
          </div>
          <div className="metadata-result-grid">
            <div><span>Changed fields</span><strong>{changedFields.join(', ') || 'None'}</strong></div>
            <div><span>Quality state</span><strong>{quality?.state || '—'}</strong></div>
            <div><span>Publishable</span><strong>{quality?.publishable == null ? '—' : quality.publishable ? 'Yes' : 'No'}</strong></div>
            <div><span>Errors / warnings</span><strong>{quality?.counts ? `${quality.counts.error || 0} / ${quality.counts.warning || 0}` : '—'}</strong></div>
          </div>
          <details className="metadata-proposal-preview">
            <summary>Normalized proposal preview</summary>
            <dl className="workspace-metadata-list metadata-wide">
              <div><dt>Title</dt><dd>{proposalValue(validation.proposed, 'title')}</dd></div>
              <div><dt>Status</dt><dd>{proposalValue(validation.proposed, 'status')}</dd></div>
              <div><dt>Album</dt><dd>{proposalValue(validation.proposed, 'album')}</dd></div>
              <div><dt>Genres</dt><dd>{proposalValue(validation.proposed, 'genres')}</dd></div>
              <div><dt>Moods</dt><dd>{proposalValue(validation.proposed, 'moods')}</dd></div>
              <div><dt>Languages</dt><dd>{proposalValue(validation.proposed, 'languages')}</dd></div>
              <div><dt>BPM</dt><dd>{proposalValue(validation.proposed, 'bpm')}</dd></div>
              <div><dt>Key</dt><dd>{proposalValue(validation.proposed, 'key')}</dd></div>
            </dl>
          </details>
          <p className="workspace-footnote">Validation completed against the current R2 objects. No manifest, media object or catalog index was written or rebuilt.</p>
        </div>
      )}
    </div>
  );
}
