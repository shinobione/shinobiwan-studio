import { useEffect, useMemo, useState } from 'react';
import { studioConfig } from '../services/config';
import {
  AdminLyricsError,
  getAdminTrackLyrics,
  saveAdminTrackLyrics,
  validateAdminTrackLyrics,
  type AdminLyricsSaveResponse,
  type AdminLyricsSnapshot,
  type AdminLyricsValidationResponse,
} from '../services/lyrics-admin-api';
import type { StudioTrackDetail } from '../types/studio';
import { AssetsManager } from './AssetsManager';

function countLines(value: string): number {
  if (!value) return 0;
  return value.replace(/\r\n?/g, '\n').split('\n').length;
}

function displayError(error: unknown): string {
  if (error instanceof AdminLyricsError) {
    const suffix = error.code ? ` · ${error.code}` : '';
    return `${error.message}${suffix}`;
  }
  return error instanceof Error ? error.message : String(error);
}

function bytesLabel(value: number | undefined): string {
  if (typeof value !== 'number') return '—';
  return value < 1024 ? `${value} B` : `${(value / 1024).toFixed(1)} KB`;
}

export function LyricsEditorPanel({ track, onSaved }: { track: StudioTrackDetail; onSaved: () => Promise<void> | void }) {
  const [snapshot, setSnapshot] = useState<AdminLyricsSnapshot | null>(null);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<AdminLyricsValidationResponse | null>(null);
  const [saved, setSaved] = useState<AdminLyricsSaveResponse | null>(null);

  const privateRead = track.readSource === 'private';
  const changed = snapshot ? draft.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n') !== (snapshot.lyrics || '') : false;

  async function loadCanonicalLyrics() {
    if (!privateRead || !track.assets.lyricsTxt) return;
    setLoading(true);
    setError(null);
    setValidation(null);
    setSaved(null);
    try {
      const next = await getAdminTrackLyrics(track.id);
      setSnapshot(next);
      setDraft(next.lyrics || '');
    } catch (reason) {
      setSnapshot(null);
      setError(displayError(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCanonicalLyrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id, privateRead, track.updatedAt, track.assets.lyricsTxt?.filename]);

  const stats = useMemo(() => ({
    lines: countLines(draft),
    chars: draft.length,
  }), [draft]);

  async function validate() {
    if (!snapshot?.updatedAt || !snapshot.lyricsEtag) return;
    setValidating(true);
    setError(null);
    setSaved(null);
    try {
      const result = await validateAdminTrackLyrics(track.id, snapshot.updatedAt, snapshot.lyricsEtag, draft);
      setValidation(result);
    } catch (reason) {
      setValidation(null);
      setError(displayError(reason));
    } finally {
      setValidating(false);
    }
  }

  async function save() {
    if (!snapshot?.updatedAt || !snapshot.lyricsEtag || !validation?.proposed?.lyrics) return;
    if (validation.valid !== true) {
      setError('Lyrics save stays locked until Track Manager validation is valid.');
      return;
    }
    const expectedUpdatedAt = validation.expectedUpdatedAt || snapshot.updatedAt;
    const expectedLyricsEtag = validation.expectedLyricsEtag || snapshot.lyricsEtag;
    if (!globalThis.confirm(`Save canonical lyrics.txt for ${track.title}?\n\nThis writes only lyrics.txt, advances the manifest revision and rebuilds the catalog. No .lrc file or other media will be touched.`)) return;

    setSaving(true);
    setError(null);
    try {
      const result = await saveAdminTrackLyrics(track.id, expectedUpdatedAt, expectedLyricsEtag, validation.proposed.lyrics);
      setSaved(result);
      setValidation(null);
      const reread = await getAdminTrackLyrics(track.id);
      setSnapshot(reread);
      setDraft(reread.lyrics || '');
      await onSaved();
    } catch (reason) {
      setSaved(null);
      setError(displayError(reason));
    } finally {
      setSaving(false);
    }
  }

  if (!privateRead) {
    return (
      <article className="panel lyrics-editor-panel">
        <span className="eyebrow">LYRICS / GUARDED WRITE</span>
        <h3>Canonical editor locked</h3>
        <p className="workspace-muted">Authenticate with Track Manager until this workspace reports PRIVATE READ. Public fallback is deliberately non-mutating.</p>
      </article>
    );
  }

  if (!track.assets.lyricsTxt) {
    return (
      <AssetsManager
        track={track}
        onChanged={onSaved}
        kinds={['lyrics']}
        eyebrow="LYRICS / CANONICAL SOURCE"
        title="Add lyrics.txt"
        description="Choose a UTF-8 TXT file. This uses the existing guarded Track asset operation and canonical reread before Studio continues."
      />
    );
  }

  return (
    <article className="panel lyrics-editor-panel">
      <div className="lyrics-editor-head">
        <div>
          <span className="eyebrow">LYRICS / GUARDED WRITE</span>
          <h3>Canonical lyrics.txt editor</h3>
        </div>
        <div className="lyrics-editor-badges">
          <b>TXT CANONICAL</b>
          <b>NO .LRC REQUIRED</b>
        </div>
      </div>

      {loading && <div className="catalog-message">Loading canonical lyrics + ETag…</div>}

      {!loading && snapshot && (
        <>
          <div className="lyrics-editor-revisions">
            <div><span>Manifest revision</span><strong>{snapshot.updatedAt}</strong></div>
            <div><span>Lyrics ETag</span><strong>{snapshot.lyricsEtag}</strong></div>
            <div><span>Stored bytes</span><strong>{bytesLabel(snapshot.bytes)}</strong></div>
            <div><span>Stored timestamps</span><strong>{snapshot.timestampCount ?? 0}</strong></div>
          </div>

          <textarea
            className="lyrics-editor-textarea"
            value={draft}
            onChange={event => {
              setDraft(event.target.value);
              setValidation(null);
              setSaved(null);
            }}
            spellCheck={false}
            aria-label="Canonical lyrics.txt"
          />

          <div className="lyrics-editor-toolbar">
            <div className="lyrics-editor-stats">
              <span>{stats.lines} lines</span>
              <span>{stats.chars} chars</span>
              <span>{changed ? 'Modified locally' : 'Matches canonical'}</span>
            </div>
            <div className="lyrics-editor-actions">
              <button className="ghost-btn" type="button" disabled={validating || saving || !changed} onClick={() => {
                setDraft(snapshot.lyrics || '');
                setValidation(null);
                setSaved(null);
                setError(null);
              }}>Reset</button>
              <button className="ghost-btn" type="button" disabled={validating || saving} onClick={() => void loadCanonicalLyrics()}>Reload canonical</button>
              <button className="primary-btn" type="button" disabled={validating || saving} onClick={() => void validate()}>{validating ? 'Validating…' : 'Validate lyrics'}</button>
            </div>
          </div>

          {validation && (
            <section className={`lyrics-editor-result ${validation.valid ? 'ok' : 'blocked'}`}>
              <div className="lyrics-editor-result-head">
                <div><span>{validation.valid ? 'VALID PROPOSAL' : 'BLOCKED PROPOSAL'}</span><strong>{validation.changed ? 'Canonical text would change' : 'No lyrics change'}</strong></div>
                <b>PREVIEW · NOT SAVED</b>
              </div>
              <div className="lyrics-editor-result-grid">
                <div><span>Bytes</span><strong>{bytesLabel(validation.proposed?.bytes)}</strong></div>
                <div><span>Timestamps</span><strong>{validation.proposed?.timestampCount ?? 0}</strong></div>
                <div><span>Segments</span><strong>{validation.proposed?.segmentCount ?? 0}</strong></div>
                <div><span>Quality</span><strong>{validation.quality?.state || '—'}</strong></div>
              </div>
              <p>Validation is non-mutating. Save is allowed only against this exact manifest revision + lyrics ETag.</p>
              {validation.changed && validation.valid && (
                <button className="primary-btn lyrics-save-btn" type="button" disabled={saving} onClick={() => void save()}>{saving ? 'Saving…' : 'Save lyrics.txt'}</button>
              )}
            </section>
          )}

          {saved && (
            <section className={`lyrics-editor-result ${saved.clientVerified ? 'ok' : 'blocked'}`}>
              <div className="lyrics-editor-result-head">
                <div><span>LYRICS SAVED</span><strong>{saved.saved ? 'Canonical text persisted' : 'No change required'}</strong></div>
                <b>{saved.clientVerified ? 'CANONICAL REREAD · VERIFIED' : 'REREAD WARNING'}</b>
              </div>
              <div className="lyrics-editor-result-grid">
                <div><span>New revision</span><strong>{saved.updatedAt || '—'}</strong></div>
                <div><span>New ETag</span><strong>{saved.lyricsEtag || '—'}</strong></div>
                <div><span>Catalog rebuilt</span><strong>{saved.catalogRebuilt ? 'Yes' : 'No change'}</strong></div>
                <div><span>Browser reread</span><strong>{saved.clientVerified ? 'Verified' : 'Check required'}</strong></div>
              </div>
              {saved.verificationWarning && <p>{saved.verificationWarning}</p>}
            </section>
          )}
        </>
      )}

      {error && <div className="lyrics-editor-error"><strong>LYRICS ERROR</strong><span>{error}</span></div>}

      <p className="workspace-footnote">Canonical rule: <strong>lyrics.txt wins</strong>. Timestamp content defines synchronized state. LRC Maker remains available as the advanced timing editor; Studio does not create a mandatory duplicate .lrc asset.</p>
    </article>
  );
}
