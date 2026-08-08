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

interface SonicTraceSaveResponse {
  ok?: boolean;
  saved?: boolean;
  analysis?: SonicTraceAnalysis;
  historyCount?: number;
  code?: string;
  error?: string;
}

export class SonicTraceError extends Error {
  readonly status: number | null;
  readonly code: string | null;

  constructor(message: string, status: number | null = null, code: string | null = null) {
    super(message);
    this.name = 'SonicTraceError';
    this.status = status;
    this.code = code;
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

async function adminJson<T>(path: string, init?: RequestInit, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response: Response;
    try {
      response = await fetch(`${adminBase()}${path}`, {
        ...init,
        headers: { Accept: 'application/json', ...(init?.headers || {}) },
        credentials: 'include',
        cache: 'no-store',
        mode: 'cors',
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw new SonicTraceError('Track Manager SonicTrace request timed out.');
      throw new SonicTraceError('Track Manager SonicTrace bridge is unavailable. Authenticate with Cloudflare Access and retry.');
    }
    if (!isJson(response)) throw new SonicTraceError('Cloudflare Access session is not available to the SonicTrace bridge.', response.status || null);
    const payload = await response.json() as T & { ok?: boolean; error?: string; code?: string };
    if (!response.ok || payload.ok === false) throw new SonicTraceError(payload.error || `Track Manager returned HTTP ${response.status}.`, response.status, payload.code || null);
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
  return payload;
}

export async function getSonicTraceCatalog(): Promise<SonicTraceCatalogEntry[]> {
  const payload = await adminJson<SonicTraceCatalogResponse>('/api/studio/analysis/sonictrace', undefined, 20000);
  if (!Array.isArray(payload.entries)) throw new SonicTraceError('Track Manager returned an invalid SonicTrace catalog index.');
  return payload.entries;
}

export async function saveSonicTraceAnalysis(trackId: string, analysis: SonicTraceAnalysis): Promise<SonicTraceSaveResponse> {
  if (!validTrackId(trackId) || analysis.trackId !== trackId) throw new SonicTraceError('Analysis trackId does not match the canonical workspace.');
  const health = await getAdminBridgeHealth();
  if (!(health.capabilities?.write || []).includes('sonictrace-analysis')) {
    throw new SonicTraceError('Track Manager does not advertise the guarded SonicTrace write capability. Save stays locked.');
  }
  const payload = await adminJson<SonicTraceSaveResponse>(
    `/api/studio/tracks/${encodeURIComponent(trackId)}/analysis/sonictrace`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ intent: SAVE_INTENT, analysis }),
    },
    30000,
  );
  if (!payload.saved || payload.analysis?.analysisId !== analysis.analysisId) throw new SonicTraceError('Track Manager returned an invalid SonicTrace save response.');
  return payload;
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
});
