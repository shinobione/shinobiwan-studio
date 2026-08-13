import { sonicTraceProfileLabel, sonicTraceProfileState, type SonicTraceProfileState } from './sonictrace-profile';
import type { SonicTraceAnalysis, SonicTraceAnalysisState } from './types/studio';

export interface SonicTraceArtistInsight {
  label: string;
  value: string;
  detail?: string;
}

export interface SonicTraceArtistSummaryModel {
  state: SonicTraceProfileState | null;
  profileLabel: string;
  headline: string;
  detail: string;
  insights: SonicTraceArtistInsight[];
  instruments: string[];
  analyzedAt: string | null;
}

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : null;
}

function numeric(value: unknown): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rankedLabels(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => record(item)?.label)
    .filter((label): label is string => typeof label === 'string' && Boolean(label.trim()))
    .map(label => label.trim())
    .slice(0, limit);
}

function joinNatural(values: string[]): string {
  if (values.length < 2) return values[0] || '—';
  if (values.length === 2) return `${values[0]} · ${values[1]}`;
  return `${values.slice(0, -1).join(' · ')} · ${values.at(-1)}`;
}

const TRAIT_COPY: Record<string, { high: string; low: string }> = {
  electronic: { high: 'Electronic production', low: 'Acoustic-leaning production' },
  vocal: { high: 'Vocal-led', low: 'Instrumental-leaning' },
  energy: { high: 'High-energy', low: 'Calmer energy' },
  brightness: { high: 'Bright / crisp', low: 'Dark / warm' },
  danceability: { high: 'Dance-forward groove', low: 'Freer rhythm' },
  aggression: { high: 'Hard / aggressive edge', low: 'Soft / gentle edge' },
  space: { high: 'Spacious / atmospheric', low: 'Dry / close' },
};

function traitConclusions(semantic: UnknownRecord | null): string[] {
  const traits = record(semantic?.traits);
  if (!traits) return [];
  return Object.entries(TRAIT_COPY)
    .map(([key, copy]) => {
      const payload = record(traits[key]);
      const value = numeric(payload?.value);
      if (value == null) return null;
      const distance = Math.abs(value - 0.5);
      if (distance < 0.14) return null;
      return { text: value >= 0.5 ? copy.high : copy.low, distance };
    })
    .filter((item): item is { text: string; distance: number } => Boolean(item))
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 3)
    .map(item => item.text);
}

function masteringInsight(analysis: SonicTraceAnalysis): SonicTraceArtistInsight | null {
  const loudness = record(record(analysis.mastering)?.loudness);
  if (!loudness || loudness.provenance === 'unavailable') return null;
  const lufs = numeric(loudness.integrated_lufs);
  const truePeak = numeric(loudness.true_peak_dbtp);
  if (lufs == null && truePeak == null) return null;
  const parts = [
    lufs == null ? null : `${lufs.toFixed(1)} LUFS`,
    truePeak == null ? null : `${truePeak.toFixed(1)} dBTP`,
  ].filter((value): value is string => Boolean(value));
  return { label: 'Master', value: parts.join(' · '), detail: 'Measured mastering level' };
}

function arrangementInsight(semantic: UnknownRecord | null): SonicTraceArtistInsight | null {
  const arrangement = record(semantic?.arrangement);
  const sectionCount = numeric(arrangement?.section_count);
  const hookCount = numeric(semantic?.hookCount);
  if (sectionCount == null && hookCount == null) return null;
  const parts = [
    sectionCount == null ? null : `${sectionCount} section${sectionCount === 1 ? '' : 's'}`,
    hookCount == null ? null : `${hookCount} hook candidate${hookCount === 1 ? '' : 's'}`,
  ].filter((value): value is string => Boolean(value));
  return { label: 'Arrangement', value: parts.join(' · '), detail: 'Signal-derived song anatomy' };
}

function basicSignalInsight(analysis: SonicTraceAnalysis): SonicTraceArtistInsight | null {
  const dsp = record(analysis.dsp);
  const rms = numeric(dsp?.rmsDbfs);
  const peak = numeric(dsp?.peakDbfs);
  if (rms == null && peak == null) return null;
  const parts = [
    rms == null ? null : `RMS ${rms.toFixed(1)} dBFS`,
    peak == null ? null : `Peak ${peak.toFixed(1)} dBFS`,
  ].filter((value): value is string => Boolean(value));
  return { label: 'Basic signal', value: parts.join(' · '), detail: 'Browser DSP only — no Deep Audio conclusion' };
}

export function buildSonicTraceArtistSummary(state: SonicTraceAnalysisState | null): SonicTraceArtistSummaryModel {
  const latest = state?.latest || null;
  const profileState = sonicTraceProfileState(latest, Boolean(state?.outdated));
  const profileLabel = sonicTraceProfileLabel(profileState);

  if (!latest) {
    return {
      state: null,
      profileLabel,
      headline: 'Sound profile not analyzed yet',
      detail: 'Run SonicTrace when you want style, mood, arrangement and mastering conclusions for this track.',
      insights: [],
      instruments: [],
      analyzedAt: null,
    };
  }

  if (profileState === 'outdated') {
    return {
      state: profileState,
      profileLabel,
      headline: 'Sound profile needs a refresh',
      detail: 'The canonical master changed after this scan. Studio hides the old conclusions until SonicTrace analyzes the current audio.',
      insights: [],
      instruments: [],
      analyzedAt: latest.analyzedAt,
    };
  }

  if (profileState === 'unavailable') {
    const basic = basicSignalInsight(latest);
    return {
      state: profileState,
      profileLabel,
      headline: 'Deep sound profile unavailable',
      detail: 'Only the browser-level signal fallback was retained. Studio does not pretend that genre, mood, mastering or structure were analyzed.',
      insights: basic ? [basic] : [],
      instruments: [],
      analyzedAt: latest.analyzedAt,
    };
  }

  const semantic = record(latest.semanticSummary);
  const genres = rankedLabels(semantic?.topGenres, 2);
  const moods = rankedLabels(semantic?.topMoods, 2);
  const instruments = rankedLabels(semantic?.topInstruments, 4);
  const traits = traitConclusions(semantic);
  const insights: SonicTraceArtistInsight[] = [];

  if (genres.length) insights.push({ label: 'Style', value: joinNatural(genres), detail: 'Top relative SonicTrace matches' });
  if (moods.length) insights.push({ label: 'Mood', value: joinNatural(moods), detail: 'Top relative SonicTrace matches' });
  if (traits.length) insights.push({ label: 'Character', value: joinNatural(traits), detail: 'Strongest relative traits' });
  const arrangement = arrangementInsight(semantic);
  if (arrangement) insights.push(arrangement);
  const mastering = masteringInsight(latest);
  if (mastering) insights.push(mastering);

  return {
    state: profileState,
    profileLabel,
    headline: profileState === 'full' ? 'This is how the track reads' : 'Useful sound profile, with limits',
    detail: profileState === 'full'
      ? 'Artist-facing conclusions from the current canonical SonicTrace profile. Full diagnostics stay under Advanced sound analysis.'
      : 'Only conclusions backed by retained layers are shown. Missing Deep Audio layers remain explicitly PARTIAL.',
    insights: insights.slice(0, 5),
    instruments,
    analyzedAt: latest.analyzedAt,
  };
}
