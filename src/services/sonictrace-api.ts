import { getAdminBridgeHealth } from './admin-api';
import { studioConfig } from './config';
import { fetchJson } from './http';
import type {
  SonicTraceAnalysis,
  SonicTraceAnalysisState,
  SonicTraceCatalogEntry,
  SonicTraceSourceVersion,
  StudioAsset,
} from '../types/studio';

const SAVE_INTENT = 'sonictrace-analysis-save-v1';
const TRANSIENT_SONICTRACE_READ_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

export interface SonicTraceHealth {
  status?: string;
  service?: string;
  version?: string;
  api_schema?: string;
  node_name?: string;
  node_role?: string;
  gpu_ready?: boolean;
  analysis_layers?: Record<string, boolean>;
}

interface SonicTraceCatalogResponse {
  ok?: boolean;
  entries?: SonicTraceCatalogEntry[];
  error?: string;
}

export type SonicTraceCommitState = 'committed' | 'not-committed' | 'ambiguous' | 'unverified';

export interface SonicTraceSaveResponse {
  ok?: boolean;
  saved?: boolean;
  analysis?: SonicTraceAnalysis;
  historyCount?: number;
  code?: string;
  error?: string;
  clientVerified?: boolean;
  verificationWarning?: string | null;
  recoveredAfterTransportFailure?: boolean;
  retrySafe?: boolean;
  commitState?: SonicTraceCommitState;
  technicalDetails?: string | null;
}

export class SonicTraceError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly retrySafe: boolean;
  readonly technicalDetails: string | null;

  constructor(
    message: string,
    status: number | null = null,
    code: string | null = null,
    retrySafe = false,
    technicalDetails: string | null = null,
  ) {
    super(message);
    this.name = 'SonicTraceError';
    this.status = status;
    this.code = code;
    this.retrySafe = retrySafe;
    this.technicalDetails = technicalDetails;
  }
}

function sonicBase(): string {
  return studioConfig.sonicTraceApi.replace(/\/$/, '');
}

function adminBase(): string {
  return studioConfig.trackManagerUrl.replace(/\/$/, '');
}

function validTrackId(trackId: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,119}$/.test(trackId);
}

function isJson(response: Response): boolean {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

function sameSourceVersion(left: SonicTraceSourceVersion | null | undefined, right: SonicTraceSourceVersion | null | undefined): boolean {
  return Boolean(
    left && right
    && left.kind === right.kind
    && left.value === right.value
    && left.sizeBytes === right.sizeBytes,
  );
}

function analysisPresence(state: SonicTraceAnalysisState, analysisId: string): { latest: boolean; history: boolean } {
  return {
    latest: state.latest?.analysisId === analysisId,
    history: state.history.some(item => item.analysisId === analysisId),
  };
}

function isTransientSonicTraceReadError(reason: unknown): reason is SonicTraceError {
  return reason instanceof SonicTraceError && (
    reason.code === 'SONICTRACE_READ_TIMEOUT'
    || reason.code === 'SONICTRACE_READ_TRANSPORT'
    || (reason.status !== null && TRANSIENT_SONICTRACE_READ_STATUSES.has(reason.status))
  );
}

async function fetchAdminJsonOnce<T>(path: string, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await fetch(`${adminBase()}${path}`, {
        headers: { Accept: 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new SonicTraceError('Track Manager SonicTrace read timed out.', null, 'SONICTRACE_READ_TIMEOUT');
      }
      throw new SonicTraceError(
        'Track Manager SonicTrace read transport was interrupted.',
        null,
        'SONICTRACE_READ_TRANSPORT',
        false,
        error instanceof Error ? error.message : String(error),
      );
    }
    if (!isJson(response)) {
      throw new SonicTraceError(
        'Cloudflare Access session is not available to the SonicTrace bridge.',
        response.status || null,
        'SONICTRACE_READ_ACCESS_SESSION_REQUIRED',
      );
    }
    let payload: T & { ok?: boolean; error?: string; code?: string };
    try {
      payload = await response.json() as T & { ok?: boolean; error?: string; code?: string };
    } catch {
      throw new SonicTraceError('Track Manager returned invalid SonicTrace JSON.', response.status || null, 'SONICTRACE_READ_INVALID_RESPONSE');
    }
    if (!response.ok || payload.ok === false) {
      throw new SonicTraceError(
        payload.error || `Track Manager returned HTTP ${response.status}.`,
        response.status,
        payload.code || (response.status === 401 || response.status === 403 ? 'SONICTRACE_READ_ACCESS' : 'SONICTRACE_READ_HTTP'),
      );
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function adminJson<T>(path: string, timeoutMs = 12000): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fetchAdminJsonOnce<T>(path, timeoutMs);
    } catch (reason) {
      if (attempt === 0 && isTransientSonicTraceReadError(reason)) continue;
      if (attempt === 1 && isTransientSonicTraceReadError(reason)) {
        throw new SonicTraceError(
          'Track Manager SonicTrace read failed after one bounded transient retry.',
          reason.status,
          reason.code,
          false,
          reason.technicalDetails || reason.message,
        );
      }
      throw reason;
    }
  }
  throw new SonicTraceError('Track Manager SonicTrace read failed unexpectedly.', null, 'SONICTRACE_READ_UNEXPECTED');
}

async function postSonicTraceSave(trackId: string, analysis: SonicTraceAnalysis): Promise<SonicTraceSaveResponse> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30000);
  try {
    let response: Response;
    try {
      response = await fetch(`${adminBase()}/api/studio/tracks/${encodeURIComponent(trackId)}/analysis/sonictrace`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ intent: SAVE_INTENT, analysis }),
        credentials: 'include',
        cache: 'no-store',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (reason) {
      const timedOut = reason instanceof DOMException && reason.name === 'AbortError';
      throw new SonicTraceError(
        timedOut
          ? 'SonicTrace save timed out after the write began. Studio will reread canonical latest/history before deciding whether any retry is safe.'
          : 'SonicTrace save transport was interrupted after the write began. Studio will reread canonical latest/history before deciding whether any retry is safe.',
        null,
        timedOut ? 'SONICTRACE_SAVE_TIMEOUT' : 'SONICTRACE_SAVE_TRANSPORT',
        false,
        reason instanceof Error ? reason.message : String(reason),
      );
    }
    if (!isJson(response)) throw new SonicTraceError('Cloudflare Access session is not available to the SonicTrace save bridge.', response.status || null, 'SONICTRACE_ACCESS_SESSION_REQUIRED');
    let payload: SonicTraceSaveResponse;
    try { payload = await response.json() as SonicTraceSaveResponse; }
    catch { throw new SonicTraceError('Track Manager returned invalid SonicTrace save JSON.', response.status || null, 'SONICTRACE_INVALID_SAVE_RESPONSE'); }
    if (!response.ok || payload.ok === false) {
      throw new SonicTraceError(payload.error || `Track Manager returned HTTP ${response.status}.`, response.status, payload.code || null);
    }
    return payload;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

export async function getSonicTraceHealth(): Promise<SonicTraceHealth> {
  return fetchJson<SonicTraceHealth>(`${sonicBase()}/api/live`, 1800);
}

export async function getSonicTraceAnalysisState(trackId: string): Promise<SonicTraceAnalysisState> {
  if (!validTrackId(trackId)) throw new SonicTraceError('Invalid trackId.');
  const payload = await adminJson<SonicTraceAnalysisState>(`/api/studio/tracks/${encodeURIComponent(trackId)}/analysis/sonictrace`);
  if (payload.trackId !== trackId || !Array.isArray(payload.history)) throw new SonicTraceError('Track Manager returned an invalid SonicTrace state.');
  if (payload.latest && payload.latest.trackId !== trackId) throw new SonicTraceError('Track Manager returned a SonicTrace latest sidecar for the wrong track.');
  if (payload.history.some(item => item.trackId !== trackId)) throw new SonicTraceError('Track Manager returned SonicTrace history for the wrong track.');
  return payload;
}

export async function getSonicTraceCatalog(): Promise<SonicTraceCatalogEntry[]> {
  const payload = await adminJson<SonicTraceCatalogResponse>('/api/studio/analysis/sonictrace', 20000);
  if (!Array.isArray(payload.entries)) throw new SonicTraceError('Track Manager returned an invalid SonicTrace catalog index.');
  return payload.entries;
}

export async function saveSonicTraceAnalysis(trackId: string, analysis: SonicTraceAnalysis): Promise<SonicTraceSaveResponse> {
  if (!validTrackId(trackId) || analysis.trackId !== trackId) throw new SonicTraceError('Analysis trackId does not match the canonical workspace.');
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.write || []).includes('sonictrace-analysis')) {
    throw new SonicTraceError('Track Manager does not advertise the guarded SonicTrace write capability. Save stays locked.');
  }

  const before = await getSonicTraceAnalysisState(trackId);
  const beforePresence = analysisPresence(before, analysis.analysisId);
  if (beforePresence.latest || beforePresence.history) {
    throw new SonicTraceError('This SonicTrace analysisId already exists in canonical state. Re-scan before another save.', 409, 'ANALYSIS_EXISTS');
  }
  if (before.currentSourceVersion && !sameSourceVersion(before.currentSourceVersion, analysis.sourceVersion)) {
    throw new SonicTraceError('Canonical audio changed after this SonicTrace analysis. Re-scan before saving.', 409, 'STALE_AUDIO');
  }

  let payload: SonicTraceSaveResponse;
  try {
    payload = await postSonicTraceSave(trackId, analysis);
  } catch (reason) {
    if (!(reason instanceof SonicTraceError) || !['SONICTRACE_SAVE_TIMEOUT', 'SONICTRACE_SAVE_TRANSPORT'].includes(reason.code || '')) throw reason;
    try {
      const reread = await getSonicTraceAnalysisState(trackId);
      const presence = analysisPresence(reread, analysis.analysisId);
      if (presence.latest && presence.history && reread.latest) {
        return {
          ok: true,
          saved: true,
          analysis: reread.latest,
          historyCount: reread.history.length,
          clientVerified: true,
          recoveredAfterTransportFailure: true,
          retrySafe: false,
          commitState: 'committed',
          technicalDetails: `${reason.code}: response lost; private canonical reread verified analysisId ${analysis.analysisId} in both latest.json and append-only history.`,
        };
      }
      if (!presence.latest && !presence.history) {
        throw new SonicTraceError(
          'SonicTrace save response was lost, but private canonical reread proves this analysisId is absent from both latest and history. An explicit retry is safe after connectivity or Access is restored.',
          null,
          'SONICTRACE_SAVE_NOT_COMMITTED',
          true,
          reason.technicalDetails,
        );
      }
      throw new SonicTraceError(
        'SonicTrace save response was lost and canonical latest/history disagree about the requested analysisId. Do not retry; reload and inspect canonical SonicTrace state first.',
        null,
        'SONICTRACE_SAVE_AMBIGUOUS',
        false,
        `${reason.code}: response lost; latestMatch=${presence.latest}; historyMatch=${presence.history}; analysisId=${analysis.analysisId}.`,
      );
    } catch (recoveryReason) {
      if (recoveryReason instanceof SonicTraceError && ['SONICTRACE_SAVE_NOT_COMMITTED', 'SONICTRACE_SAVE_AMBIGUOUS'].includes(recoveryReason.code || '')) throw recoveryReason;
      throw new SonicTraceError(
        'SonicTrace save response was lost and Studio could not verify canonical latest/history. Do not retry until private canonical SonicTrace state can be reloaded and inspected.',
        null,
        'SONICTRACE_SAVE_UNVERIFIED',
        false,
        [reason.code, reason.technicalDetails, recoveryReason instanceof Error ? recoveryReason.message : String(recoveryReason)].filter(Boolean).join(' · '),
      );
    }
  }

  if (!payload.saved || payload.analysis?.analysisId !== analysis.analysisId) throw new SonicTraceError('Track Manager returned an invalid SonicTrace save response.');

  let clientVerified = false;
  let verificationWarning: string | null = null;
  try {
    const reread = await getSonicTraceAnalysisState(trackId);
    const presence = analysisPresence(reread, analysis.analysisId);
    clientVerified = presence.latest && presence.history && reread.latest?.analysisId === analysis.analysisId;
    if (!clientVerified) {
      verificationWarning = 'Server reported SonicTrace save success, but canonical latest/history did not both verify the requested analysisId. Reload before another save.';
    }
  } catch (reason) {
    verificationWarning = `Server reported SonicTrace save success, but Studio could not complete its canonical latest/history reread (${reason instanceof Error ? reason.message : String(reason)}). Reload before another save.`;
  }

  return {
    ...payload,
    clientVerified,
    verificationWarning,
    recoveredAfterTransportFailure: false,
    retrySafe: false,
    commitState: clientVerified ? 'committed' : 'unverified',
  };
}

export function fetchCanonicalAudio(asset: StudioAsset, onProgress?: (percent: number) => void): Promise<File> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const audioUrl = asset.fullUrl || asset.url;
    xhr.open('GET', audioUrl, true);
    xhr.withCredentials = new URL(audioUrl, globalThis.location.href).origin === new URL(adminBase()).origin;
    xhr.responseType = 'blob';
    xhr.timeout = 180000;
    xhr.onprogress = event => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 35));
    };
    xhr.onerror = () => reject(new SonicTraceError('Canonical audio could not be downloaded for temporary analysis.'));
    xhr.ontimeout = () => reject(new SonicTraceError('Canonical audio download timed out.'));
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300 || !(xhr.response instanceof Blob) || xhr.response.size === 0) {
        reject(new SonicTraceError(`Canonical audio download returned HTTP ${xhr.status || 0}.`, xhr.status || null));
        return;
      }
      onProgress?.(35);
      resolve(new File([xhr.response], asset.filename || 'audio.bin', { type: xhr.response.type || asset.contentType || 'application/octet-stream' }));
    };
    xhr.send();
  });
}

export async function analyzeBrowserDsp(file: File): Promise<Record<string, unknown>> {
  const AudioContextClass = globalThis.AudioContext || (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new SonicTraceError('Web Audio is unavailable in this browser.');
  const context = new AudioContextClass();
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    const totalSamples = buffer.length * buffer.numberOfChannels;
    const stride = Math.max(1, Math.ceil(totalSamples / 2_000_000));
    let count = 0;
    let sum = 0;
    let sumSquares = 0;
    let peak = 0;
    let clipping = 0;
    let zeroCrossings = 0;
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      let previous = data[0] || 0;
      for (let index = 0; index < data.length; index += stride) {
        const sample = data[index] || 0;
        const absolute = Math.abs(sample);
        count += 1;
        sum += sample;
        sumSquares += sample * sample;
        peak = Math.max(peak, absolute);
        if (absolute >= 0.999) clipping += 1;
        if ((sample >= 0) !== (previous >= 0)) zeroCrossings += 1;
        previous = sample;
      }
    }
    const rms = Math.sqrt(sumSquares / Math.max(1, count));
    const db = (value: number) => value > 0 ? 20 * Math.log10(value) : -120;
    return {
      engine: 'studio-browser-dsp-v1',
      source: 'browser-dsp',
      file: { name: file.name, sizeBytes: file.size, type: file.type },
      durationSeconds: buffer.duration,
      sampleRateHz: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      rmsDbfs: Number(db(rms).toFixed(3)),
      peakDbfs: Number(db(peak).toFixed(3)),
      crestDb: Number((db(peak) - db(rms)).toFixed(3)),
      dcOffset: Number((sum / Math.max(1, count)).toFixed(7)),
      clippingPercent: Number(((clipping / Math.max(1, count)) * 100).toFixed(5)),
      zeroCrossingRate: Number((zeroCrossings / Math.max(1, count)).toFixed(7)),
      sampledPoints: count,
      provenance: 'measured-in-browser',
    };
  } finally {
    await context.close();
  }
}

export function runSonicTraceAnalysis(
  file: File,
  trackId: string,
  sourceVersion: SonicTraceSourceVersion,
  browserDsp: Record<string, unknown> | null,
  onProgress?: (percent: number) => void,
): Promise<SonicTraceAnalysis> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${sonicBase()}/api/studio/analyze`, true);
    xhr.timeout = 30 * 60 * 1000;
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) onProgress?.(35 + Math.round((event.loaded / event.total) * 55));
    };
    xhr.onerror = () => reject(new SonicTraceError('SonicTrace Deep Audio node is offline or blocked by the browser. Browser DSP remains available.'));
    xhr.ontimeout = () => reject(new SonicTraceError('SonicTrace Deep Audio analysis timed out. Browser DSP remains available.'));
    xhr.onload = () => {
      let payload: SonicTraceAnalysis & { detail?: string };
      try { payload = JSON.parse(xhr.responseText) as SonicTraceAnalysis & { detail?: string }; }
      catch { reject(new SonicTraceError('SonicTrace returned invalid JSON.', xhr.status || null)); return; }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new SonicTraceError(payload.detail || `SonicTrace returned HTTP ${xhr.status}.`, xhr.status || null));
        return;
      }
      if (payload.trackId !== trackId || payload.schemaVersion !== 1) {
        reject(new SonicTraceError('SonicTrace returned an analysis for the wrong track or schema.'));
        return;
      }
      if (browserDsp) {
        payload.dsp = browserDsp;
        payload.provenance = { ...payload.provenance, dsp: 'measured-in-browser' };
      }
      onProgress?.(100);
      resolve(payload);
    };
    const form = new FormData();
    form.set('track_id', trackId);
    form.set('source_version', JSON.stringify(sourceVersion));
    form.set('file', file);
    xhr.send(form);
  });
}

export function browserOnlyAnalysis(
  trackId: string,
  sourceVersion: SonicTraceSourceVersion,
  dsp: Record<string, unknown>,
  warning: string,
): SonicTraceAnalysis {
  return {
    schemaVersion: 1,
    analysisId: `sta-${crypto.randomUUID()}`,
    trackId,
    sourceVersion,
    analyzedAt: new Date().toISOString(),
    engineVersion: { apiSchema: null, appVersion: 'studio-browser-dsp-v1', nodeName: 'browser', nodeRole: 'fallback' },
    dsp,
    mastering: null,
    neural: null,
    embedding: null,
    structure: null,
    semanticSummary: { fallback: 'Browser DSP only' },
    stemsSummary: null,
    provenance: { dsp: 'measured-in-browser', deepAudio: 'unavailable' },
    warnings: [warning],
    privacy: { audioStored: false, temporaryProcessingOnly: true },
  };
}

export const sonicTraceService = Object.freeze({
  saveIntent: SAVE_INTENT,
  contractSchemaVersion: 1,
  canonicalPersistence: 'R2 sidecars via Track Manager',
  sourceAudioRetention: false,
  lostResponsePolicy: 'private-canonical-latest-history-reread-no-blind-retry',
  privateReadRetryPolicy: 'one-retry-timeout-transport-transient-http-no-access-retry',
  privateReadMaxAttempts: 2,
});
