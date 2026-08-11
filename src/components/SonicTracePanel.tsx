import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  analyzeBrowserDsp,
  browserOnlyAnalysis,
  fetchCanonicalAudio,
  getSonicTraceAnalysisState,
  runSonicTraceAnalysis,
  saveSonicTraceAnalysis,
  SonicTraceError,
} from '../services/sonictrace-api';
import {
  sonicTraceEmbeddingReady,
  sonicTraceMasteringReady,
  sonicTraceMissingLayers,
  sonicTraceProfileLabel,
  sonicTraceProfileState,
} from '../sonictrace-profile';
import type { SonicTraceAnalysis, SonicTraceAnalysisState, StudioTrackDetail } from '../types/studio';

function numeric(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nested(value: unknown, ...path: string[]): unknown {
  let current = value;
  for (const key of path) {
    if (!current || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function metric(value: unknown, suffix = '', digits = 1): string {
  const number = numeric(value);
  return number == null ? '—' : `${number.toFixed(digits)}${suffix}`;
}

function engineLabel(analysis: SonicTraceAnalysis | null): string {
  if (!analysis) return '—';
  return String(analysis.engineVersion.appVersion || analysis.engineVersion.apiSchema || 'browser DSP');
}

function layerState(analysis: SonicTraceAnalysis, field: keyof SonicTraceAnalysis): string {
  if (field === 'mastering') return sonicTraceMasteringReady(analysis) ? 'ready' : 'missing';
  if (field === 'embedding') return sonicTraceEmbeddingReady(analysis) ? 'ready' : 'missing';
  return analysis[field] ? 'ready' : 'missing';
}

function deepFailureIsTransport(error: unknown): boolean {
  if (!(error instanceof SonicTraceError) || error.status != null) return false;
  return /offline|blocked by the browser|timed out/i.test(error.message);
}

export function SonicTracePanel({ track, onSaved }: { track: StudioTrackDetail; onSaved: () => Promise<void> | void }) {
  const [state, setState] = useState<SonicTraceAnalysisState | null>(null);
  const [draft, setDraft] = useState<SonicTraceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (track.readSource !== 'private') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const payload = await getSonicTraceAnalysisState(track.id);
      setState(payload);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, [track.id, track.readSource]);

  useEffect(() => { void load(); }, [load]);

  const latest = state?.latest || null;
  const history = state?.history || [];
  const profileState = sonicTraceProfileState(latest, Boolean(state?.outdated));
  const profileLabel = sonicTraceProfileLabel(profileState);
  const missingLayers = sonicTraceMissingLayers(latest);
  const comparison = useMemo(() => history.filter(item => item.analysisId !== latest?.analysisId).slice(0, 5), [history, latest]);

  async function analyze() {
    if (!track.assets.audio || track.readSource !== 'private') return;
    setBusy(true);
    setProgress(1);
    setError(null);
    setNotice(null);
    setDraft(null);
    try {
      const current = await getSonicTraceAnalysisState(track.id);
      if (!current.currentSourceVersion) throw new Error('Track Manager did not expose a canonical audio source revision.');
      const file = await fetchCanonicalAudio(track.assets.audio, setProgress);
      let dsp: Record<string, unknown> | null = null;
      let dspError: string | null = null;
      try {
        dsp = await analyzeBrowserDsp(file);
      } catch (reason) {
        dspError = reason instanceof Error ? reason.message : String(reason);
      }
      setProgress(40);
      try {
        const result = await runSonicTraceAnalysis(file, track.id, current.currentSourceVersion, dsp, setProgress);
        if (dspError) result.warnings = [...result.warnings, `Browser DSP unavailable: ${dspError}`];
        setDraft(result);
        const resultState = sonicTraceProfileState(result, false);
        setNotice(
          resultState === 'full'
            ? 'Deep Audio analysis complete. Review the FULL profile before saving to R2.'
            : 'SonicTrace coordinator responded and completed the scan with PARTIAL layers. Review the warnings and retained deep layers before saving.',
        );
      } catch (deepError) {
        const message = deepError instanceof Error ? deepError.message : String(deepError);
        if (!dsp) throw new Error(`${message} Browser DSP is also unavailable: ${dspError || 'unknown browser decoding error'}`);
        setDraft(browserOnlyAnalysis(track.id, current.currentSourceVersion, dsp, message));
        setNotice(
          deepFailureIsTransport(deepError)
            ? 'SonicTrace coordinator is unreachable. Browser DSP completed and can be saved as an UNAVAILABLE-deep fallback profile.'
            : 'SonicTrace coordinator responded but Deep Audio processing failed before it could return retained layers. Browser DSP completed as a fallback; review the processing error before saving.',
        );
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!draft) return;
    const layers = ['DSP', sonicTraceMasteringReady(draft) && 'mastering', draft.neural && 'neural', sonicTraceEmbeddingReady(draft) && 'embedding 512D', draft.structure && 'structure'].filter(Boolean).join(', ');
    if (!globalThis.confirm(`Save SonicTrace analysis for ${track.title}?\n\nanalysisId: ${draft.analysisId}\nLayers: ${layers}\n\nThe Worker writes latest.json plus append-only history. It never stores the audio.`)) return;
    setBusy(true);
    setError(null);
    try {
      await saveSonicTraceAnalysis(track.id, draft);
      setDraft(null);
      setNotice('Analysis saved and canonically reread from R2.');
      await load();
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  }

  if (track.readSource !== 'private') {
    return <article className="panel sonic-panel"><span className="eyebrow">SONICTRACE / ACCESS</span><h3>Private analysis is locked.</h3><p className="workspace-muted">Authenticate with Track Manager through Cloudflare Access. Public catalog fallback stays read-only and never invents an analysis state.</p></article>;
  }

  return (
    <div className="sonic-stack">
      <article className="panel sonic-panel">
        <div className="sonic-head">
          <div className="sonic-intro"><span className="eyebrow">SONICTRACE</span><h3>{latest ? `${profileLabel} profile ready` : 'Understand this track'}</h3><p>{latest ? 'Review the latest profile or re-scan after an audio change.' : 'Analyze loudness, structure and similarity signals without storing source audio.'}</p></div>
          <div className="sonic-actions">
            <button className="primary-btn" type="button" disabled={busy || loading || !track.assets.audio} onClick={() => void analyze()}>{busy ? `Working ${progress}%` : latest ? 'Re-scan with SonicTrace' : 'Analyze with SonicTrace'}</button>
          </div>
        </div>
        {busy && <div className="sonic-progress" aria-label={`SonicTrace analysis ${progress}% complete`}><i style={{ width: `${progress}%` }} /><span>{progress}%</span></div>}
        {loading && <p className="workspace-muted">Reading canonical SonicTrace sidecars…</p>}
        {!loading && !track.assets.audio && <div className="sonic-alert">Canonical audio is required before analysis.</div>}
        {state && (
          <div className="sonic-status-grid">
            <div><span>Profile</span><strong className={`sonic-profile-label ${profileState || 'none'}`}>{profileLabel}</strong></div>
            <div><span>Audio match</span><strong className={state.outdated ? 'warn' : ''}>{latest ? state.outdated ? 'Re-scan needed' : 'Current' : 'Waiting'}</strong></div>
            <div><span>History</span><strong>{history.length} scan{history.length === 1 ? '' : 's'}</strong></div>
          </div>
        )}
        {state && <details className="sonic-diagnostics"><summary>Engine diagnostics</summary><dl><div><dt>Analysis ID</dt><dd>{latest?.analysisId || '—'}</dd></div><div><dt>Engine</dt><dd>{engineLabel(latest)}</dd></div><div><dt>Embedding</dt><dd>{sonicTraceEmbeddingReady(latest) ? '512D' : 'Missing'}</dd></div><div><dt>Source version</dt><dd>{latest?.sourceVersion.value || '—'}</dd></div></dl></details>}
        {state?.outdated && <div className="sonic-alert warn">The canonical audio revision changed after the latest scan. Re-scan before trusting comparisons.</div>}
        {latest && profileState === 'partial' && <div className="sonic-alert warn">This saved profile is usable but incomplete. Missing or unavailable deep layers: {missingLayers.join(', ')}. Re-scan while the local SonicTrace coordinator is healthy to produce a FULL profile.</div>}
        {error && <div className="sonic-alert error">{error}</div>}
        {notice && <div className="sonic-alert">{notice}</div>}
      </article>

      {draft && (
        <article className="panel sonic-panel sonic-review">
          <div className="sonic-head"><div><span className="eyebrow">REVIEW / NOT SAVED</span><h3>Review analysis layers</h3></div><button className="primary-btn" type="button" disabled={busy} onClick={() => void save()}>Save analysis</button></div>
          <div className="sonic-layers">
            {(['dsp', 'mastering', 'neural', 'embedding', 'structure', 'semanticSummary'] as const).map(field => <span className={layerState(draft, field)} key={field}>{field}</span>)}
          </div>
          <div className="sonic-status-grid">
            <div><span>Browser RMS</span><strong>{metric(nested(draft.dsp, 'rmsDbfs'), ' dBFS')}</strong></div>
            <div><span>LUFS</span><strong>{metric(nested(draft.mastering, 'loudness', 'integrated_lufs'), ' LUFS')}</strong></div>
            <div><span>True peak</span><strong>{metric(nested(draft.mastering, 'loudness', 'true_peak_dbtp'), ' dBTP')}</strong></div>
            <div><span>Sections</span><strong>{numeric(nested(draft.structure, 'summary', 'section_count')) ?? '—'}</strong></div>
          </div>
          {draft.warnings.length > 0 && <ul className="sonic-warnings">{draft.warnings.map(item => <li key={item}>{item}</li>)}</ul>}
          <p className="workspace-footnote">Review only: nothing is persisted until Save analysis. Audio bytes remain temporary and are never written to the analysis directory.</p>
        </article>
      )}

      {latest && (
        <article className="panel sonic-panel">
          <div className="sonic-profile-head"><div><span className="eyebrow">PROFILE / LATEST</span><h3>Durable SonicTrace profile</h3></div><strong className={`sonic-profile-badge ${profileState || 'none'}`}>{profileLabel}</strong></div>
          <div className="sonic-status-grid">
            <div><span>Analyzed</span><strong>{new Date(latest.analyzedAt).toLocaleString()}</strong></div>
            <div><span>LUFS</span><strong>{metric(nested(latest.mastering, 'loudness', 'integrated_lufs'), ' LUFS')}</strong></div>
            <div><span>True peak</span><strong>{metric(nested(latest.mastering, 'loudness', 'true_peak_dbtp'), ' dBTP')}</strong></div>
            <div><span>Browser peak</span><strong>{metric(nested(latest.dsp, 'peakDbfs'), ' dBFS')}</strong></div>
          </div>
          {comparison.length > 0 && <div className="sonic-history"><h4>Analysis / master history</h4>{comparison.map(item => <div key={item.analysisId}><span>{new Date(item.analyzedAt).toLocaleString()} · {item.analysisId}</span><strong>{metric(nested(item.mastering, 'loudness', 'integrated_lufs'), ' LUFS')} · {item.sourceVersion.value === latest.sourceVersion.value ? 'same source' : 'different source/master'}</strong></div>)}</div>}
        </article>
      )}
    </div>
  );
}
