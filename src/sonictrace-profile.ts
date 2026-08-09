import type { SonicTraceAnalysis } from './types/studio';

export type SonicTraceProfileState = 'full' | 'partial' | 'outdated';

const CORE_LAYERS: Array<keyof Pick<SonicTraceAnalysis, 'dsp' | 'mastering' | 'neural' | 'embedding' | 'structure'>> = [
  'dsp',
  'mastering',
  'neural',
  'embedding',
  'structure',
];

export function sonicTraceProfileState(analysis: SonicTraceAnalysis | null, outdated: boolean): SonicTraceProfileState | null {
  if (!analysis) return null;
  if (outdated) return 'outdated';
  return CORE_LAYERS.every(layer => analysis[layer] != null) ? 'full' : 'partial';
}

export function sonicTraceProfileLabel(state: SonicTraceProfileState | null): string {
  if (state === 'full') return 'FULL';
  if (state === 'partial') return 'PARTIAL';
  if (state === 'outdated') return 'OUTDATED';
  return 'NOT ANALYZED';
}

export function sonicTraceMissingLayers(analysis: SonicTraceAnalysis | null): string[] {
  if (!analysis) return [...CORE_LAYERS];
  return CORE_LAYERS.filter(layer => analysis[layer] == null);
}
