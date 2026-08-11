import type { SonicTraceAnalysis } from './types/studio';

export type SonicTraceProfileState = 'full' | 'partial' | 'unavailable' | 'outdated';

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function finite(value: unknown): boolean {
  if (value == null || value === '') return false;
  return Number.isFinite(Number(value));
}

function measurementAvailable(value: unknown): boolean {
  const payload = record(value);
  return Boolean(payload && payload.provenance !== 'unavailable');
}

export function sonicTraceMasteringReady(analysis: SonicTraceAnalysis | null): boolean {
  const mastering = record(analysis?.mastering);
  if (!mastering) return false;
  const loudness = record(mastering.loudness);
  const levels = record(mastering.levels);
  if (!measurementAvailable(loudness) || !measurementAvailable(levels)) return false;
  const loudnessReady = finite(loudness?.integrated_lufs) && finite(loudness?.true_peak_dbtp);
  const levelsReady = finite(levels?.mean_volume_db) || finite(levels?.max_volume_db);
  return Boolean(loudnessReady && levelsReady);
}

export function sonicTraceEmbeddingReady(analysis: SonicTraceAnalysis | null): boolean {
  const embedding = analysis?.embedding;
  return Boolean(
    embedding
      && embedding.dimension === 512
      && Array.isArray(embedding.vector)
      && embedding.vector.length === 512
      && embedding.vector.every(Number.isFinite),
  );
}

function deepAudioUnavailable(analysis: SonicTraceAnalysis): boolean {
  const provenance = record(analysis.provenance);
  const explicitlyUnavailable = provenance?.deepAudio === 'unavailable';
  const noDeepLayers = !sonicTraceMasteringReady(analysis)
    && !analysis.neural
    && !sonicTraceEmbeddingReady(analysis)
    && !analysis.structure;
  return Boolean(explicitlyUnavailable && noDeepLayers);
}

export function sonicTraceProfileState(analysis: SonicTraceAnalysis | null, outdated: boolean): SonicTraceProfileState | null {
  if (!analysis) return null;
  if (outdated) return 'outdated';
  if (deepAudioUnavailable(analysis)) return 'unavailable';
  const full = Boolean(
    analysis.dsp
      && sonicTraceMasteringReady(analysis)
      && analysis.neural
      && sonicTraceEmbeddingReady(analysis)
      && analysis.structure,
  );
  return full ? 'full' : 'partial';
}

export function sonicTraceProfileLabel(state: SonicTraceProfileState | null): string {
  if (state === 'full') return 'FULL';
  if (state === 'partial') return 'PARTIAL';
  if (state === 'unavailable') return 'UNAVAILABLE';
  if (state === 'outdated') return 'OUTDATED';
  return 'NOT ANALYZED';
}

export function sonicTraceMissingLayers(analysis: SonicTraceAnalysis | null): string[] {
  if (!analysis) return ['DSP', 'mastering', 'neural', 'embedding 512D', 'structure'];
  const result: string[] = [];
  if (!analysis.dsp) result.push('DSP');
  if (!sonicTraceMasteringReady(analysis)) result.push('mastering');
  if (!analysis.neural) result.push('neural');
  if (!sonicTraceEmbeddingReady(analysis)) result.push('embedding 512D');
  if (!analysis.structure) result.push('structure');
  return result;
}
