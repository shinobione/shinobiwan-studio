import { useEffect, useMemo, useState } from 'react';
import {
  AdminSaveError,
  AdminValidationError,
  type AdminManifest,
  type AdminMetadataPatch,
  type AdminMetadataSaveResponse,
} from '../services/admin-api';
import {
  AlbumAdminError,
  getAdminAlbum,
  getAdminAlbums,
  moveAdminAlbumTrack,
} from '../services/album-admin-api';
import { measureCanonicalAudioEvidence, type AdminAudioEvidence } from '../services/audio-duration-evidence';
import {
  saveAdminTrackMetadataWithAudioEvidence,
  validateAdminTrackMetadataWithAudioEvidence,
  type DurationAwareValidationResponse,
} from '../services/metadata-duration-api';
import { routeHref } from '../router';
import { studioConfig } from '../services/config';
import type { StudioTrackDetail } from '../types/studio';

type MetadataFormState = {
  title: string;
  status: string;
  type: string;
  year: string;
  releaseDate: string;
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

type QualityIssue = {
  level?: string;
  code?: string;
  label?: string;
  message?: string;
};

function csv(values: string[]): string {
  return values.join(', ');
}

function albumBoundType(type: string | null | undefined, albumId: string | null | undefined): string {
  return albumId && albumId !== 'singles' ? 'album-track' : (type || 'single');
}

function initialForm(track: StudioTrackDetail): MetadataFormState {
  return {
    title: track.title,
    status: track.status,
    type: albumBoundType(track.type, track.album.id),
    year: track.year == null ? '' : String(track.year),
    releaseDate: track.releaseDate || '',
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

function formFromManifest(manifest: AdminManifest): MetadataFormState {
  return {
    title: manifest.title || '',
    status: manifest.status || 'draft',
    type: albumBoundType(manifest.type, manifest.album?.id),
    year: manifest.year == null ? '' : String(manifest.year),
    releaseDate: manifest.releaseDate || '',
    genres: csv(manifest.genres || []),
    tags: csv(manifest.tags || []),
    moods: csv(manifest.moods || []),
    themes: csv(manifest.themes || []),
    era: manifest.era || '',
    energy: manifest.energy || '',
    languages: csv(manifest.languages || []),
    bpm: manifest.bpm == null ? '' : String(manifest.bpm),
    key: manifest.key || '',
    keyConfidence: manifest.keyConfidence == null ? '' : String(manifest.keyConfidence),
    explicit: manifest.explicit == null ? 'unrated' : manifest.explicit ? 'explicit' : 'clean',
    accent: manifest.accent || '',
    accent2: manifest.accent2 || '',
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
  return {
    title: form.title.trim(),
    status: form.status,
    type: form.type.trim(),
    year: nullableNumber(form.year),
    releaseDate: nullableText(form.releaseDate),
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
  if (value && typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value == null || value === '' ? '—' : String(value);
}

function qualityIssues(value: unknown): QualityIssue[] {
  if (!value || typeof value !== 'object') return [];
  const items = (value as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is QualityIssue => Boolean(item) && typeof item === 'object')
    .filter(item => item.level === 'error' || item.level === 'warning');
}

function formatEvidenceDuration(evidence: AdminAudioEvidence | null): string {
  if (!evidence) return 'not measured';
  const total = Math.round(evidence.audio.duration);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds} (${evidence.audio.duration.toFixed(3)} s)`;
}

function albumErrorMessage(reason: unknown): string {
  if (reason instanceof AlbumAdminError) {
    return `${reason.message}${reason.code ? ` [${reason.code}]` : ''}${reason.currentUpdatedAt ? ` · revision ${reason.currentUpdatedAt}` : ''}`;
  }
  return reason instanceof Error ? reason.message : String(reason);
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`metadata-field${wide ? ' metadata-field-wide' : ''}`}><span>{label}</span>{children}</label>;
}

function MetadataGroup({ title, hint, children, wide = false }: { title: string; hint: string; children: React.ReactNode; wide?: boolean }) {
  return <fieldset className={`metadata-group${wide ? ' metadata-group-wide' : ''}`}><legend>{title}</legend><p>{hint}</p><div>{children}</div></fieldset>;
}

export function MetadataValidationPanel({
  track,
  onSaved,
}: {
  track: StudioTrackDetail;
  onSaved?: () => Promise<void> | void;
}) {
  const privateRead = track.readSource === 'private';
  const claimedAlbumId = track.album.id || 'singles';
  const albumBound = claimedAlbumId !== 'singles';
  const [form, setForm] = useState<MetadataFormState>(() => initialForm(track));
  const [validation, setValidation] = useState<DurationAwareValidationResponse | null>(null);
  const [validationEvidence, setValidationEvidence] = useState<AdminAudioEvidence | null>(null);
  const [evidenceMessage, setEvidenceMessage] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<AdminMetadataSaveResponse | null>(null);
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshWarning, setRefreshWarning] = useState<string | null>(null);
  const [albumAuthorityBusy, setAlbumAuthorityBusy] = useState(false);
  const [albumAuthorityMessage, setAlbumAuthorityMessage] = useState<string | null>(null);
  const [albumAuthorityError, setAlbumAuthorityError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialForm(track));
    setValidation(null);
    setValidationEvidence(null);
    setEvidenceMessage(null);
    setSaveResult(null);
    setError(null);
    setRefreshWarning(null);
    setAlbumAuthorityMessage(null);
    setAlbumAuthorityError(null);
  }, [track.id, track.readSource, track.updatedAt]);

  const patch = useMemo(() => buildPatch(form), [form]);
  const changedFields = validation?.changedFields || [];
  const derivedFields = validation?.derivedFields || [];
  const validationRevision = validation?.expectedUpdatedAt || null;
  const canValidate = privateRead && Boolean(track.updatedAt) && !validating && !saving;
  const canSave = privateRead
    && validation?.valid === true
    && validation.validationOnly === true
    && changedFields.length > 0
    && Boolean(validationRevision)
    && validationRevision === track.updatedAt
    && !validating
    && !saving
    && !saveResult;
  const canCheckAlbumAuthority = privateRead && albumBound && !albumAuthorityBusy;

  function clearReviewedProposal() {
    setValidation(null);
    setValidationEvidence(null);
    setEvidenceMessage(null);
    setSaveResult(null);
    setError(null);
    setRefreshWarning(null);
  }

  function update<K extends keyof MetadataFormState>(key: K, value: MetadataFormState[K]) {
    setForm(current => ({ ...current, [key]: value }));
    clearReviewedProposal();
  }

  function resetProposal() {
    setForm(initialForm(track));
    clearReviewedProposal();
  }

  function preparePublication() {
    update('status', 'published');
  }

  async function verifyOrRepairAlbumMembership() {
    if (!canCheckAlbumAuthority) return;
    setAlbumAuthorityBusy(true);
    setAlbumAuthorityMessage(null);
    setAlbumAuthorityError(null);
    try {
      const [targetPayload, allPayload] = await Promise.all([
        getAdminAlbum(claimedAlbumId),
        getAdminAlbums(),
      ]);
      const target = targetPayload.album?.manifest;
      if (!target) throw new AlbumAdminError('Canonical Album manifest is unavailable.');

      if (target.trackIds.includes(track.id)) {
        setAlbumAuthorityMessage(`Verified: ${target.title} owns ${track.id} through album.trackIds. No write was needed.`);
        return;
      }

      const otherOwners = (allPayload.albums || []).filter(album => album.id !== target.id && album.trackIds.includes(track.id));
      if (otherOwners.length) {
        setAlbumAuthorityError(`Canonical owner conflict: ${otherOwners.map(album => album.title).join(', ')} already owns this track. Studio will not guess which Album should win.`);
        return;
      }

      if (target.status !== 'draft' || !target.updatedAt) {
        setAlbumAuthorityError(`CACHE-ONLY CLAIM detected: Track cache says ${target.title}, but album.trackIds is missing ${track.id}. Automatic repair stays locked because the target Album is ${target.status} or has no fresh revision.`);
        return;
      }

      const confirmed = globalThis.confirm(
        `Repair canonical Album membership for "${track.title}"?\n\nTrack cache: ${track.album.title} (${claimedAlbumId})\nCanonical Album trackIds: MISSING ${track.id}\n\nTrack Manager will add this track to the end of the draft Album through album-track-move-v1. Studio will then reread BOTH the Album and Track compatibility cache before reporting success.`,
      );
      if (!confirmed) {
        setAlbumAuthorityMessage('CACHE-ONLY CLAIM detected. No write was performed.');
        return;
      }

      const freshPayload = await getAdminAlbum(claimedAlbumId);
      const fresh = freshPayload.album?.manifest;
      if (!fresh?.updatedAt) throw new AlbumAdminError('Fresh canonical Album revision is unavailable. No write was performed.');
      if (fresh.trackIds.includes(track.id)) {
        setAlbumAuthorityMessage(`Verified after fresh reread: ${fresh.title} already owns ${track.id}. No write was needed.`);
        return;
      }
      if (fresh.status !== 'draft') throw new AlbumAdminError(`Album changed to ${fresh.status}; repair is locked until you review it.`);

      const result = await moveAdminAlbumTrack(fresh.id, {
        trackId: track.id,
        sourceAlbumId: null,
        expectedTargetUpdatedAt: fresh.updatedAt,
        targetIndex: fresh.trackIds.length,
      });
      if (!result.clientVerified) throw new AlbumAdminError(result.verificationWarning || 'Album + Track canonical reread did not verify the repair.');
      setAlbumAuthorityMessage(`Repaired and verified: ${fresh.title} now canonically owns ${track.id}, and the Track compatibility cache matches.`);
      if (onSaved) await onSaved();
    } catch (reason) {
      setAlbumAuthorityError(albumErrorMessage(reason));
    } finally {
      setAlbumAuthorityBusy(false);
    }
  }

  async function validate() {
    if (!canValidate || !track.updatedAt) return;
    setValidating(true);
    setError(null);
    setValidation(null);
    setValidationEvidence(null);
    setEvidenceMessage(null);
    setSaveResult(null);
    setRefreshWarning(null);
    try {
      const audioUrl = track.assets.audio?.url || null;
      const evidence = audioUrl ? await measureCanonicalAudioEvidence(audioUrl) : null;
      setValidationEvidence(evidence);
      setEvidenceMessage(audioUrl
        ? evidence
          ? `Canonical master measured at ${formatEvidenceDuration(evidence)}. Duration is derived evidence, never a manual metadata field.`
          : 'Canonical master metadata could not be measured in this browser. Validation remains truthful but no duration repair will be proposed.'
        : 'No canonical master audio is available, so duration evidence cannot be supplied.');
      const result = await validateAdminTrackMetadataWithAudioEvidence(track.id, track.updatedAt, patch, evidence);
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

  async function save() {
    if (!canSave || !validationRevision) return;
    const fieldList = changedFields.join(', ');
    const confirmed = globalThis.confirm(
      `Save metadata for "${track.title}"?\n\nChanged fields: ${fieldList}\n\n${derivedFields.includes('duration') ? `Canonical audio duration will be repaired from the reviewed browser measurement (${formatEvidenceDuration(validationEvidence)}).\n\n` : ''}This writes canonical Track metadata and rebuilds catalog/index.json. Album membership/order and all media assets remain untouched.`,
    );
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    setSaveResult(null);
    setRefreshWarning(null);
    try {
      const result = await saveAdminTrackMetadataWithAudioEvidence(track.id, validationRevision, patch, validationEvidence);
      if (result.track) setForm(formFromManifest(result.track));
      setSaveResult(result);
      if (onSaved) {
        try {
          await onSaved();
        } catch (reason) {
          setRefreshWarning(`Metadata was saved, but the workspace refresh failed (${reason instanceof Error ? reason.message : String(reason)}). Reload before another edit.`);
        }
      }
    } catch (reason) {
      if (reason instanceof AdminSaveError) {
        if (reason.code === 'STALE_MANIFEST') {
          setError(`Save refused: the canonical manifest changed${reason.currentUpdatedAt ? ` (${reason.currentUpdatedAt})` : ''}. Reload the track, validate again, then save.`);
        } else if (reason.code === 'QUALITY_BLOCKED') {
          setError('Save refused by Track Manager quality control. The exact blocking checks are listed in the validation result below.');
        } else if (reason.code === 'SAVE_ROLLBACK') {
          const rollback = reason.rollback;
          setError(`Save failed after manifest write; rollback was attempted. Manifest restored: ${rollback?.manifestRestored ? 'yes' : 'no'}, catalog restored: ${rollback?.catalogRestored ? 'yes' : 'no'}. Stop editing and verify Track Manager before retrying.`);
        } else {
          setError(reason.message);
        }
      } else {
        setError(reason instanceof Error ? reason.message : String(reason));
      }
    } finally {
      setSaving(false);
    }
  }

  const quality = validation?.quality;
  const issues = qualityIssues(quality);
  const blockingIssues = issues.filter(issue => issue.level === 'error');
  const warningIssues = issues.filter(issue => issue.level === 'warning');

  return (
    <div className="metadata-validation-shell">
      <div className="metadata-validation-head">
        <div>
          <span className="eyebrow">METADATA</span>
          <h3>Shape how this track appears</h3>
          <p>Organize identity, release information and discovery details. Studio validates the full proposal before any protected save.</p>
        </div>
        <b className="metadata-no-write metadata-write-badge">PROTECTED SAVE</b>
      </div>

      {!privateRead && (
        <div className="workspace-note metadata-lock-note">
          <strong>Private Track Manager session required.</strong>
          <p>The public fallback is intentionally insufficient for metadata writes because it does not guarantee the canonical manifest revision.</p>
          <a className="ghost-btn" href={studioConfig.trackManagerUrl} target="_blank" rel="noreferrer">Authenticate in Track Manager ↗</a>
        </div>
      )}

      {privateRead && !track.updatedAt && (
        <div className="workspace-note metadata-lock-note"><strong>Canonical revision unavailable.</strong><p>Validation and save stay locked because Studio refuses to submit metadata without expectedUpdatedAt stale-write protection.</p></div>
      )}

      <div className="metadata-form-groups">
        <MetadataGroup title="Identity" hint="Track identity only. Album membership has its own canonical authority.">
          <Field label="Title" wide><input value={form.title} onChange={event => update('title', event.target.value)} /></Field>
          <Field label="Type">
            <select value={form.type} disabled={albumBound} onChange={event => update('type', event.target.value)}>
              <option value="single">Single</option>
              <option value="album-track">Album track</option>
              <option value="demo">Demo</option>
            </select>
            {albumBound && <small>Derived from the current Album binding. Saving this proposal repairs legacy <code>single</code> metadata to <code>album-track</code> without changing Album membership.</small>}
          </Field>
          <div className="metadata-album-authority metadata-field-wide">
            <span>Album / project</span>
            <strong>{track.album.title || 'Singles'}</strong>
            <small><code>{claimedAlbumId}</code> · display cache only here. Canonical membership/order is owned by <code>album.trackIds</code>.</small>
            <div className="metadata-album-authority-actions">
              <a className="ghost-btn compact" href={routeHref('albums')}>Manage Album membership →</a>
              {albumBound && <button className="ghost-btn compact" type="button" disabled={!canCheckAlbumAuthority} onClick={() => void verifyOrRepairAlbumMembership()}>{albumAuthorityBusy ? 'Checking…' : 'Verify / repair membership'}</button>}
            </div>
            {albumAuthorityMessage && <p className="metadata-album-authority-message">{albumAuthorityMessage}</p>}
            {albumAuthorityError && <p className="metadata-album-authority-error">{albumAuthorityError}</p>}
          </div>
        </MetadataGroup>
        <MetadataGroup title="Release" hint="Production readiness and publication are separate: a draft may be 100% ready before you publish it.">
          <Field label="Status"><select value={form.status} onChange={event => update('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field>
          <Field label="Content"><select value={form.explicit} onChange={event => update('explicit', event.target.value as MetadataFormState['explicit'])}><option value="unrated">Unrated</option><option value="clean">Clean</option><option value="explicit">Explicit</option></select></Field>
          <Field label="Release date"><input type="date" value={form.releaseDate} onChange={event => update('releaseDate', event.target.value)} /></Field>
          <Field label="Year"><input inputMode="numeric" value={form.year} onChange={event => update('year', event.target.value)} placeholder="2026" /></Field>
          {form.status !== 'published' && <div className="metadata-field metadata-field-wide"><span>Publication</span><button className="primary-btn compact" type="button" disabled={!privateRead || saving || validating} onClick={preparePublication}>Prepare publication</button><small>This only changes the local proposal to Published. Nothing is written until Validate → review → explicit Save.</small></div>}
        </MetadataGroup>
        <MetadataGroup title="Discovery" hint="Help Catalog and LaunchPAD organize and surface the track." wide>
          <Field label="Genres" wide><input value={form.genres} onChange={event => update('genres', event.target.value)} placeholder="R&B, Trap" /></Field>
          <Field label="Tags" wide><input value={form.tags} onChange={event => update('tags', event.target.value)} /></Field>
          <Field label="Moods"><input value={form.moods} onChange={event => update('moods', event.target.value)} /></Field>
          <Field label="Themes"><input value={form.themes} onChange={event => update('themes', event.target.value)} /></Field>
          <Field label="Languages" wide><input value={form.languages} onChange={event => update('languages', event.target.value)} placeholder="English, French" /></Field>
          <Field label="Era"><input value={form.era} onChange={event => update('era', event.target.value)} /></Field>
          <Field label="Energy"><input value={form.energy} onChange={event => update('energy', event.target.value)} /></Field>
        </MetadataGroup>
        <MetadataGroup title="Music details" hint="Optional musical facts used across Studio and intelligence views.">
          <Field label="BPM"><input inputMode="decimal" value={form.bpm} onChange={event => update('bpm', event.target.value)} /></Field>
          <Field label="Key"><input value={form.key} onChange={event => update('key', event.target.value)} placeholder="F# minor" /></Field>
          <Field label="Key confidence" wide><input inputMode="decimal" value={form.keyConfidence} onChange={event => update('keyConfidence', event.target.value)} /></Field>
        </MetadataGroup>
        <MetadataGroup title="LaunchPAD theme" hint="Canonical cover colors shared with Track Manager and LaunchPAD.">
          <Field label="accent"><div className="metadata-color-field"><i style={{ background: form.accent || 'transparent' }} /><input value={form.accent} onChange={event => update('accent', event.target.value)} placeholder="#52e3d6" /></div></Field>
          <Field label="accent2"><div className="metadata-color-field"><i style={{ background: form.accent2 || 'transparent' }} /><input value={form.accent2} onChange={event => update('accent2', event.target.value)} placeholder="#00e5ff" /></div></Field>
        </MetadataGroup>
      </div>

      <div className="metadata-validation-actions">
        <div><span>{validation ? 'Proposal reviewed' : 'Ready to review'}</span><strong>{validation ? `${changedFields.length} changed field${changedFields.length === 1 ? '' : 's'}` : 'Validate before saving'}</strong></div>
        <button className="ghost-btn metadata-reset-btn" type="button" disabled={saving} onClick={resetProposal}>Reset proposal</button>
        <button className="metadata-validate-btn" type="button" disabled={!canValidate} onClick={validate}>{validating ? 'Measuring master + validating…' : 'Validate metadata'}</button>
      </div>

      {evidenceMessage && <div className="workspace-note metadata-duration-evidence" role="status"><strong>AUDIO DURATION EVIDENCE</strong><p>{evidenceMessage}</p></div>}

      {error && (
        <div className="metadata-validation-result metadata-result-error">
          <b>METADATA ERROR</b><p>{error}</p>
          <button className="ghost-btn metadata-reload-btn" type="button" onClick={() => globalThis.location.reload()}>Reload canonical workspace</button>
        </div>
      )}

      {validation && (
        <div className={`metadata-validation-result ${validation.valid ? 'metadata-result-ok' : 'metadata-result-blocked'}`}>
          <div className="metadata-result-title">
            <div><b>{validation.valid ? 'VALID PROPOSAL' : 'QUALITY BLOCKED'}</b><strong>{changedFields.length ? `${changedFields.length} changed field${changedFields.length > 1 ? 's' : ''}` : 'No metadata change'}</strong></div>
            <span>{canSave ? 'PREVIEW · READY FOR SAVE' : 'PREVIEW · NOT SAVED'}</span>
          </div>
          <div className="metadata-result-grid">
            <div><span>Changed fields</span><strong>{changedFields.join(', ') || 'None'}</strong></div>
            <div><span>Derived repair</span><strong>{derivedFields.join(', ') || 'None'}</strong></div>
            <div><span>Quality state</span><strong>{quality?.state || '—'}</strong></div>
            <div><span>Publishable</span><strong>{quality?.publishable == null ? '—' : quality.publishable ? 'Yes' : 'No'}</strong></div>
            <div><span>Errors / warnings</span><strong>{quality?.counts ? `${quality.counts.error || 0} / ${quality.counts.warning || 0}` : '—'}</strong></div>
            <div><span>Master measured</span><strong>{formatEvidenceDuration(validationEvidence)}</strong></div>
          </div>
          {derivedFields.includes('duration') && <div className="workspace-note metadata-duration-repair"><strong>CANONICAL DURATION REPAIR PROPOSED</strong><p>The Track manifest duration will be derived from the reviewed canonical master measurement. No media object is replaced and duration is not manually editable.</p></div>}
          {issues.length > 0 && <div className="workspace-note metadata-quality-details" role="status"><strong>{blockingIssues.length ? `Why publication is blocked (${blockingIssues.length})` : 'Quality warnings'}</strong>{blockingIssues.map((issue, index) => <p key={`error-${issue.code || index}`}><b>ERROR · {issue.label || issue.code || 'Quality check'}</b> — {issue.message || 'Blocking quality check failed.'}</p>)}{warningIssues.map((issue, index) => <p key={`warning-${issue.code || index}`}><b>WARNING · {issue.label || issue.code || 'Quality check'}</b> — {issue.message || 'Review recommended.'}</p>)}</div>}
          <details className="metadata-proposal-preview">
            <summary>Normalized proposal preview</summary>
            <dl className="workspace-metadata-list metadata-wide">
              <div><dt>Title</dt><dd>{proposalValue(validation.proposed, 'title')}</dd></div>
              <div><dt>Status</dt><dd>{proposalValue(validation.proposed, 'status')}</dd></div>
              <div><dt>Type</dt><dd>{proposalValue(validation.proposed, 'type')}</dd></div>
              <div><dt>Duration</dt><dd>{proposalValue(validation.proposed, 'duration')} s</dd></div>
              <div><dt>Genres</dt><dd>{proposalValue(validation.proposed, 'genres')}</dd></div>
              <div><dt>Moods</dt><dd>{proposalValue(validation.proposed, 'moods')}</dd></div>
              <div><dt>Languages</dt><dd>{proposalValue(validation.proposed, 'languages')}</dd></div>
              <div><dt>BPM</dt><dd>{proposalValue(validation.proposed, 'bpm')}</dd></div>
              <div><dt>Key</dt><dd>{proposalValue(validation.proposed, 'key')}</dd></div>
            </dl>
          </details>
          {canSave && (
            <div className="metadata-save-zone">
              <div><strong>{form.status === 'published' ? 'Publish this track?' : 'Review complete?'}</strong><p>{form.status === 'published' ? 'Saving this validated proposal publishes the canonical Track and rebuilds the catalog. Album membership/order and media remain untouched.' : 'Save writes Track metadata only, rebuilds the canonical catalog index, verifies the persisted revision and leaves Album membership plus every media object untouched.'}</p></div>
              <button className="metadata-save-btn" type="button" onClick={save}>{saving ? 'Saving…' : form.status === 'published' ? 'Publish track' : 'Save metadata'}</button>
            </div>
          )}
          <p className="workspace-footnote">Validation itself remains non-mutating. A save is possible only after this preview, against this exact canonical revision and the reviewed audio evidence above.</p>
        </div>
      )}

      {saveResult && (
        <div className="metadata-validation-result metadata-result-saved">
          <div className="metadata-result-title">
            <div><b>{saveResult.track?.status === 'published' ? 'TRACK PUBLISHED' : 'METADATA SAVED'}</b><strong>{saveResult.changedFields?.length ? `${saveResult.changedFields.length} field${saveResult.changedFields.length > 1 ? 's' : ''} persisted` : 'Canonical metadata already matched'}</strong></div>
            <span>{saveResult.clientVerified ? 'CANONICAL REREAD · VERIFIED' : 'SERVER SAVED · REREAD WARNING'}</span>
          </div>
          <div className="metadata-result-grid">
            <div><span>Changed fields</span><strong>{saveResult.changedFields?.join(', ') || 'None'}</strong></div>
            <div><span>Canonical duration</span><strong>{saveResult.track?.duration == null ? '—' : `${saveResult.track.duration.toFixed(3)} s`}</strong></div>
            <div><span>New revision</span><strong>{saveResult.updatedAt || saveResult.track?.updatedAt || '—'}</strong></div>
            <div><span>Catalog rebuilt</span><strong>{saveResult.catalogRebuilt ? 'Yes' : saveResult.noChange ? 'Not needed' : 'No'}</strong></div>
            <div><span>Browser reread</span><strong>{saveResult.clientVerified ? 'Verified' : 'Needs reload'}</strong></div>
          </div>
          {(saveResult.verificationWarning || refreshWarning) && <p className="metadata-save-warning">{saveResult.verificationWarning || refreshWarning}</p>}
          <p className="workspace-footnote">The guarded metadata write cannot change Album membership/order. Audio, cover, thumbnail, lyrics and video assets were not modified.</p>
          <button className="ghost-btn metadata-reload-btn" type="button" onClick={() => globalThis.location.reload()}>Reload canonical workspace</button>
        </div>
      )}
    </div>
  );
}