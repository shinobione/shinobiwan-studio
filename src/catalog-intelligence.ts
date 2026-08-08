import type { SonicTraceCatalogEntry, SonicTraceEmbedding } from './types/studio';

export interface SimilarTrack {
  entry: SonicTraceCatalogEntry;
  similarity: number;
  reasons: string[];
}

export interface SonicCluster {
  id: number;
  label: string;
  entries: SonicTraceCatalogEntry[];
}

function validEmbedding(value: SonicTraceEmbedding | null): value is SonicTraceEmbedding {
  return Boolean(value && value.dimension === 512 && value.vector.length === 512 && value.vector.every(Number.isFinite));
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || !left.length) return 0;
  let dot = 0;
  let normLeft = 0;
  let normRight = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    normLeft += left[index] * left[index];
    normRight += right[index] * right[index];
  }
  if (!normLeft || !normRight) return 0;
  return dot / Math.sqrt(normLeft * normRight);
}

function labels(entry: SonicTraceCatalogEntry, key: 'topGenres' | 'topMoods' | 'topInstruments'): string[] {
  const values = entry.semanticSummary?.[key];
  if (!Array.isArray(values)) return [];
  return values.map(value => typeof value === 'object' && value && 'label' in value ? String(value.label) : '').filter(Boolean);
}

function shared(left: string[], right: string[]): string[] {
  const rightSet = new Set(right.map(item => item.toLowerCase()));
  return left.filter(item => rightSet.has(item.toLowerCase())).slice(0, 3);
}

function reasons(left: SonicTraceCatalogEntry, right: SonicTraceCatalogEntry): string[] {
  const result: string[] = [];
  const genres = shared(labels(left, 'topGenres'), labels(right, 'topGenres'));
  const moods = shared(labels(left, 'topMoods'), labels(right, 'topMoods'));
  const instruments = shared(labels(left, 'topInstruments'), labels(right, 'topInstruments'));
  if (genres.length) result.push(`Genres: ${genres.join(', ')}`);
  if (moods.length) result.push(`Moods: ${moods.join(', ')}`);
  if (instruments.length) result.push(`Instruments: ${instruments.join(', ')}`);
  if (!result.length) result.push('CLAP embedding proximity');
  return result;
}

export function nearestTracks(selected: SonicTraceCatalogEntry, entries: SonicTraceCatalogEntry[], limit = 6): SimilarTrack[] {
  if (!validEmbedding(selected.embedding)) return [];
  return entries
    .filter(entry => entry.trackId !== selected.trackId && validEmbedding(entry.embedding))
    .map(entry => ({
      entry,
      similarity: Math.max(0, Math.min(100, cosineSimilarity(selected.embedding!.vector, entry.embedding!.vector) * 100)),
      reasons: reasons(selected, entry),
    }))
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, limit);
}

function normalizedMean(vectors: number[][]): number[] {
  const mean = Array.from({ length: 512 }, () => 0);
  for (const vector of vectors) for (let index = 0; index < 512; index += 1) mean[index] += vector[index] / vectors.length;
  const norm = Math.sqrt(mean.reduce((sum, value) => sum + value * value, 0)) || 1;
  return mean.map(value => value / norm);
}

function clusterLabel(entries: SonicTraceCatalogEntry[], index: number): string {
  const candidates = ['topGenres', 'topMoods'] as const;
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const key of candidates) for (const label of labels(entry, key).slice(0, 2)) counts.set(label, (counts.get(label) || 0) + 1);
  }
  const top = [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0]?.[0];
  return top || `Sonic family ${index + 1}`;
}

export function clusterTracks(entries: SonicTraceCatalogEntry[]): SonicCluster[] {
  const usable = entries.filter(entry => validEmbedding(entry.embedding)).sort((left, right) => left.trackId.localeCompare(right.trackId));
  if (!usable.length) return [];
  if (usable.length === 1) return [{ id: 0, label: clusterLabel(usable, 0), entries: usable }];
  const count = Math.min(6, usable.length, Math.max(2, Math.round(Math.sqrt(usable.length / 2))));
  let centroids = Array.from({ length: count }, (_, index) => usable[Math.floor((index * usable.length) / count)].embedding!.vector.slice());
  let assignments = usable.map(() => 0);
  for (let iteration = 0; iteration < 12; iteration += 1) {
    assignments = usable.map(entry => {
      const scores = centroids.map(centroid => cosineSimilarity(entry.embedding!.vector, centroid));
      return scores.indexOf(Math.max(...scores));
    });
    centroids = centroids.map((centroid, index) => {
      const vectors = usable.filter((_, itemIndex) => assignments[itemIndex] === index).map(entry => entry.embedding!.vector);
      return vectors.length ? normalizedMean(vectors) : centroid;
    });
  }
  return centroids.map((_, id) => {
    const members = usable.filter((__, index) => assignments[index] === id);
    return { id, label: clusterLabel(members, id), entries: members };
  }).filter(cluster => cluster.entries.length > 0);
}
