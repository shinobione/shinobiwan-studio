import type { SonicTraceCatalogEntry, SonicTraceEmbedding, StudioTrack } from './types/studio';

export interface SimilarTrack {
  entry: SonicTraceCatalogEntry;
  similarity: number;
  reasons: string[];
}

export interface ProjectionPoint {
  trackId: string;
  x: number;
  y: number;
}

export interface AcousticZone {
  id: number;
  label: string;
  trackIds: string[];
  center: { x: number; y: number };
}

export interface AcousticZoneResult {
  count: number;
  assignments: Record<string, number>;
  groups: AcousticZone[];
}

export interface StyleFamilyAssignment {
  id: string;
  score: number;
}

export interface StyleFamilyGroup {
  id: string;
  label: string;
  trackIds: string[];
  count: number;
  weight: number;
  topLabels: string[];
}

export interface StyleFamilyResult {
  count: number;
  groups: StyleFamilyGroup[];
  assignments: Record<string, StyleFamilyAssignment[]>;
}

export interface RedundantPair {
  a: string;
  b: string;
  percent: number;
}

export interface CatalogOutlier {
  trackId: string;
  neighborhoodPercent: number;
}

export interface CatalogBridge {
  trackId: string;
  zoneCount: number;
  bridgePercent: number;
}

export interface CatalogInsights {
  redundantPairs: RedundantPair[];
  outliers: CatalogOutlier[];
  bridges: CatalogBridge[];
}

export interface ProjectSequenceItem {
  trackId: string;
  originalIndex: number;
  role: string;
  transition: string[];
}

export interface ProjectAnalysis {
  totalTracks: number;
  analyzedTracks: number;
  embeddingTracks: number;
  coveragePercent: number;
  coherencePercent: number | null;
  outliers: Array<{ trackId: string; percent: number }>;
  bridge: { trackId: string; percent: number } | null;
  proposedSequence: ProjectSequenceItem[];
  missingTrackIds: string[];
  summary: string[];
}

export interface CatalogAnalysis {
  projection: ProjectionPoint[];
  zones: AcousticZoneResult;
  styleFamilies: StyleFamilyResult;
  insights: CatalogInsights;
}

export interface SonicCluster {
  id: number;
  label: string;
  entries: SonicTraceCatalogEntry[];
}

const STYLE_DEFINITIONS = [
  { id: 'hip-hop-trap', label: 'Hip-Hop / Trap', rx: /(?:^|\b)(hip[\s-]?hop|rap|trap|drill|boom[\s-]?bap)(?:\b|$)/i },
  { id: 'rnb-soul', label: 'R&B / Soul', rx: /(?:^|\b)(r\s*&\s*b|rnb|rhythm\s*(?:and|&)\s*blues|neo[\s-]?soul|soul)(?:\b|$)/i },
  { id: 'bass-dubstep', label: 'Bass / Dubstep', rx: /(?:^|\b)(dubstep|bass\s*music|brostep|grime|drum\s*(?:and|&)\s*bass|dnb)(?:\b|$)/i },
  { id: 'pop-electronic-pop', label: 'Pop / Electronic Pop', rx: /(?:^|\b)(electro[\s-]?pop|electronic\s*pop|synth[\s-]?pop|dance\s*pop|alt(?:ernative)?\s*pop|pop)(?:\b|$)/i },
  { id: 'electronic', label: 'Electronic', rx: /(?:^|\b)(electronic|electronica|edm|electro|house|techno|trance|garage)(?:\b|$)/i },
  { id: 'reggae-dancehall', label: 'Reggae / Dancehall', rx: /(?:^|\b)(reggae|dancehall|ragga)(?:\b|$)/i },
  { id: 'lofi-chillhop', label: 'Lo-fi / Chillhop', rx: /(?:^|\b)(lo[\s-]?fi|chill[\s-]?hop)(?:\b|$)/i },
  { id: 'rock-alternative', label: 'Rock / Alternative', rx: /(?:^|\b)(rock|alternative|indie\s*rock|post[\s-]?rock)(?:\b|$)/i },
] as const;

function clamp(value: number, minimum = 0, maximum = 1): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function rankingScore(value: unknown, fallback = 0.55): number {
  if (typeof value === 'number' && Number.isFinite(value)) return clamp(value > 1 ? value / 100 : value);
  const item = asRecord(value);
  if (!item) return fallback;
  const candidate = Number(item.score ?? item.value ?? (Number(item.percent) / 100));
  if (!Number.isFinite(candidate)) return fallback;
  return clamp(candidate > 1 ? candidate / 100 : candidate);
}

function normalizedLabel(value: unknown): string {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCase(value: string): string {
  return normalizedLabel(value).replace(/\b\w/g, letter => letter.toUpperCase());
}

function summaryList(entry: SonicTraceCatalogEntry, key: 'topGenres' | 'topMoods' | 'topInstruments'): unknown[] {
  const summary = asRecord(entry.semanticSummary);
  const values = summary?.[key];
  return Array.isArray(values) ? values : [];
}

function labels(entry: SonicTraceCatalogEntry, key: 'topGenres' | 'topMoods' | 'topInstruments'): string[] {
  return summaryList(entry, key)
    .map(value => {
      const item = asRecord(value);
      return normalizedLabel(item?.label ?? item?.name ?? value);
    })
    .filter(Boolean);
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

export function validEmbedding(value: SonicTraceEmbedding | null): value is SonicTraceEmbedding {
  return Boolean(value && value.dimension === 512 && value.vector.length === 512 && value.vector.every(Number.isFinite));
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || !left.length) return 0;
  let dotValue = 0;
  let normLeft = 0;
  let normRight = 0;
  for (let index = 0; index < left.length; index += 1) {
    dotValue += left[index] * right[index];
    normLeft += left[index] * left[index];
    normRight += right[index] * right[index];
  }
  if (!normLeft || !normRight) return 0;
  return dotValue / Math.sqrt(normLeft * normRight);
}

function similarity01(left: SonicTraceCatalogEntry, right: SonicTraceCatalogEntry): number {
  if (!validEmbedding(left.embedding) || !validEmbedding(right.embedding)) return 0;
  return clamp(cosineSimilarity(left.embedding.vector, right.embedding.vector));
}

export function nearestTracks(selected: SonicTraceCatalogEntry, entries: SonicTraceCatalogEntry[], limit = 6): SimilarTrack[] {
  if (!validEmbedding(selected.embedding)) return [];
  return entries
    .filter(entry => entry.trackId !== selected.trackId && validEmbedding(entry.embedding))
    .map(entry => ({
      entry,
      similarity: similarity01(selected, entry) * 100,
      reasons: reasons(selected, entry),
    }))
    .sort((left, right) => right.similarity - left.similarity || left.entry.trackId.localeCompare(right.entry.trackId))
    .slice(0, limit);
}

function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!norm) return vector.map(() => 0);
  return vector.map(value => value / norm);
}

function dot(left: number[], right: number[]): number {
  let result = 0;
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) result += left[index] * right[index];
  return result;
}

function powerComponent(rows: number[][], orthogonalTo: number[] | null): number[] {
  if (!rows.length || !rows[0]?.length) return [];
  const dimension = rows[0].length;
  let vector = normalizeVector(Array.from({ length: dimension }, (_, index) => ((index * 37 + 11) % 101) / 101 - 0.5));
  for (let iteration = 0; iteration < 42; iteration += 1) {
    const next = Array.from({ length: dimension }, () => 0);
    for (const row of rows) {
      const scale = dot(row, vector);
      for (let index = 0; index < dimension; index += 1) next[index] += row[index] * scale;
    }
    if (orthogonalTo?.length) {
      const projection = dot(next, orthogonalTo);
      for (let index = 0; index < dimension; index += 1) next[index] -= projection * orthogonalTo[index];
    }
    const normalized = normalizeVector(next);
    if (!normalized.some(value => Math.abs(value) > 1e-12)) break;
    vector = normalized;
  }
  return vector;
}

function normalizeProjection(raw: Array<{ trackId: string; x: number; y: number }>): ProjectionPoint[] {
  if (!raw.length) return [];
  const xs = raw.map(point => point.x);
  const ys = raw.map(point => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;
  return raw.map((point, index) => ({
    trackId: point.trackId,
    x: rangeX > 1e-9 ? 0.06 + ((point.x - minX) / rangeX) * 0.88 : raw.length === 1 ? 0.5 : 0.08 + (index / (raw.length - 1)) * 0.84,
    y: rangeY > 1e-9 ? 0.08 + ((point.y - minY) / rangeY) * 0.84 : 0.5,
  }));
}

export function projectTracks(entries: SonicTraceCatalogEntry[]): ProjectionPoint[] {
  const usable = entries.filter(entry => validEmbedding(entry.embedding)).sort((left, right) => left.trackId.localeCompare(right.trackId));
  if (!usable.length) return [];
  if (usable.length === 1) return [{ trackId: usable[0].trackId, x: 0.5, y: 0.5 }];
  const vectors = usable.map(entry => normalizeVector(entry.embedding!.vector));
  const mean = Array.from({ length: 512 }, () => 0);
  for (const vector of vectors) for (let index = 0; index < 512; index += 1) mean[index] += vector[index] / vectors.length;
  const centered = vectors.map(vector => vector.map((value, index) => value - mean[index]));
  const pc1 = powerComponent(centered, null);
  const pc2 = powerComponent(centered, pc1);
  if (!pc1.some(value => Math.abs(value) > 1e-9)) {
    return usable.map((entry, index) => ({ trackId: entry.trackId, x: 0.08 + (index / Math.max(1, usable.length - 1)) * 0.84, y: 0.5 }));
  }
  return normalizeProjection(centered.map((row, index) => ({
    trackId: usable[index].trackId,
    x: dot(row, pc1),
    y: pc2.some(value => Math.abs(value) > 1e-9) ? dot(row, pc2) : 0,
  })));
}

function distanceSquared(left: [number, number], right: [number, number]): number {
  const dx = left[0] - right[0];
  const dy = left[1] - right[1];
  return dx * dx + dy * dy;
}

function nearestCenter(point: [number, number], centers: Array<[number, number]>): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  centers.forEach((center, index) => {
    const distance = distanceSquared(point, center);
    if (distance < bestDistance) { best = index; bestDistance = distance; }
  });
  return best;
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function zoneName(index: number): string {
  return String.fromCharCode(65 + Math.max(0, Math.min(25, index)));
}

export function clusterAcousticZones(entries: SonicTraceCatalogEntry[], projection = projectTracks(entries)): AcousticZoneResult {
  const availableIds = new Set(entries.filter(entry => validEmbedding(entry.embedding)).map(entry => entry.trackId));
  const points = projection.filter(point => availableIds.has(point.trackId)).sort((left, right) => left.trackId.localeCompare(right.trackId));
  const count = points.length;
  if (!count) return { count: 0, assignments: {}, groups: [] };
  const k = count < 4 ? 1 : Math.max(2, Math.min(7, Math.round(Math.sqrt(count / 2)) || 2));
  let centers: Array<[number, number]> = Array.from({ length: k }, (_, index) => {
    const point = points[Math.floor((index * points.length) / k)] || points[0];
    return [point.x, point.y];
  });
  let assignments = Array.from({ length: count }, () => 0);
  for (let iteration = 0; iteration < 30; iteration += 1) {
    const next = points.map(point => nearestCenter([point.x, point.y], centers));
    if (iteration > 0 && next.every((value, index) => value === assignments[index])) break;
    assignments = next;
    centers = centers.map((center, centerIndex) => {
      const members = points.filter((_, pointIndex) => assignments[pointIndex] === centerIndex);
      return members.length
        ? [average(members.map(point => point.x)), average(members.map(point => point.y))] as [number, number]
        : center;
    });
  }
  const rawGroups = centers.map((center, id) => ({
    id,
    center,
    trackIds: points.filter((_, index) => assignments[index] === id).map(point => point.trackId).sort(),
  })).filter(group => group.trackIds.length > 0)
    .sort((left, right) => left.center[0] - right.center[0] || left.center[1] - right.center[1] || left.trackIds[0].localeCompare(right.trackIds[0]));
  const remap = new Map<number, number>();
  const groups = rawGroups.map((group, index): AcousticZone => {
    remap.set(group.id, index);
    return {
      id: index,
      label: `Zone acoustique ${zoneName(index)}`,
      trackIds: group.trackIds,
      center: { x: group.center[0], y: group.center[1] },
    };
  });
  return {
    count: groups.length,
    assignments: Object.fromEntries(points.map((point, index) => [point.trackId, remap.get(assignments[index]) ?? 0])),
    groups,
  };
}

function genreEvidence(entry: SonicTraceCatalogEntry): Array<{ label: string; score: number }> {
  return summaryList(entry, 'topGenres')
    .slice(0, 6)
    .map((value, index) => {
      const item = asRecord(value);
      return {
        label: normalizedLabel(item?.label ?? item?.name ?? value),
        score: rankingScore(value, Math.max(0.20, 0.58 - index * 0.08)),
      };
    })
    .filter(item => Boolean(item.label));
}

export function analyzeStyleFamilies(entries: SonicTraceCatalogEntry[]): StyleFamilyResult {
  type MutableGroup = { id: string; label: string; trackIds: Set<string>; weight: number; labels: Map<string, number> };
  const groups = new Map<string, MutableGroup>(STYLE_DEFINITIONS.map(definition => [definition.id, {
    id: definition.id,
    label: definition.label,
    trackIds: new Set<string>(),
    weight: 0,
    labels: new Map<string, number>(),
  }]));
  const unmatched = new Map<string, MutableGroup>();
  const assignments: Record<string, StyleFamilyAssignment[]> = {};
  for (const entry of [...entries].sort((left, right) => left.trackId.localeCompare(right.trackId))) {
    const perTrack = new Map<string, number>();
    for (const evidence of genreEvidence(entry)) {
      const definition = STYLE_DEFINITIONS.find(candidate => candidate.rx.test(evidence.label));
      if (definition) {
        perTrack.set(definition.id, Math.max(perTrack.get(definition.id) || 0, evidence.score));
        const group = groups.get(definition.id)!;
        group.labels.set(evidence.label, (group.labels.get(evidence.label) || 0) + evidence.score);
        continue;
      }
      const key = evidence.label.toLowerCase();
      const fallback = unmatched.get(key) || { id: '', label: evidence.label, trackIds: new Set<string>(), weight: 0, labels: new Map<string, number>() };
      fallback.trackIds.add(entry.trackId);
      fallback.weight += evidence.score;
      fallback.labels.set(evidence.label, (fallback.labels.get(evidence.label) || 0) + evidence.score);
      unmatched.set(key, fallback);
    }
    const accepted = [...perTrack.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .filter(([, score], index) => index === 0 || score >= 0.22)
      .slice(0, 3);
    assignments[entry.trackId] = accepted.map(([id, score]) => ({ id, score }));
    for (const [id, score] of accepted) {
      const group = groups.get(id)!;
      group.trackIds.add(entry.trackId);
      group.weight += score;
    }
  }
  for (const [key, fallback] of unmatched) {
    if (fallback.trackIds.size < 2 && fallback.weight < 1.15) continue;
    const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'other';
    const id = `genre-${slug}`;
    const group: MutableGroup = { ...fallback, id, label: titleCase(fallback.label) };
    groups.set(id, group);
    const score = Math.min(1, group.weight / Math.max(1, group.trackIds.size));
    for (const trackId of group.trackIds) assignments[trackId] = [...(assignments[trackId] || []), { id, score }];
  }
  const output = [...groups.values()]
    .filter(group => group.trackIds.size > 0)
    .map((group): StyleFamilyGroup => ({
      id: group.id,
      label: group.label,
      trackIds: [...group.trackIds].sort(),
      count: group.trackIds.size,
      weight: Number(group.weight.toFixed(3)),
      topLabels: [...group.labels.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])).slice(0, 4).map(([label]) => label),
    }))
    .sort((left, right) => right.count - left.count || right.weight - left.weight || left.label.localeCompare(right.label));
  return { count: output.length, groups: output, assignments };
}

function pairwise(entries: SonicTraceCatalogEntry[]): { entries: SonicTraceCatalogEntry[]; matrix: number[][] } {
  const usable = entries.filter(entry => validEmbedding(entry.embedding)).sort((left, right) => left.trackId.localeCompare(right.trackId));
  const matrix = Array.from({ length: usable.length }, () => Array.from({ length: usable.length }, () => 0));
  for (let left = 0; left < usable.length; left += 1) {
    matrix[left][left] = 1;
    for (let right = left + 1; right < usable.length; right += 1) {
      const score = similarity01(usable[left], usable[right]);
      matrix[left][right] = score;
      matrix[right][left] = score;
    }
  }
  return { entries: usable, matrix };
}

export function catalogInsights(entries: SonicTraceCatalogEntry[], zones = clusterAcousticZones(entries)): CatalogInsights {
  const data = pairwise(entries);
  const redundantPairs: RedundantPair[] = [];
  for (let left = 0; left < data.entries.length; left += 1) {
    for (let right = left + 1; right < data.entries.length; right += 1) {
      if (data.matrix[left][right] >= 0.92) redundantPairs.push({ a: data.entries[left].trackId, b: data.entries[right].trackId, percent: Math.round(data.matrix[left][right] * 100) });
    }
  }
  redundantPairs.sort((left, right) => right.percent - left.percent || `${left.a}:${left.b}`.localeCompare(`${right.a}:${right.b}`));
  const neighborhood = data.entries.map((entry, index) => {
    const scores = data.matrix[index].filter((_, otherIndex) => otherIndex !== index).sort((left, right) => right - left).slice(0, 3);
    return { trackId: entry.trackId, score: scores.length ? average(scores) : 1 };
  });
  const baseline = neighborhood.length > 2 ? average(neighborhood.map(item => item.score)) : 0;
  const outliers = neighborhood
    .filter(item => data.entries.length >= 4 && item.score < Math.min(0.72, baseline - 0.10))
    .sort((left, right) => left.score - right.score || left.trackId.localeCompare(right.trackId))
    .map(item => ({ trackId: item.trackId, neighborhoodPercent: Math.round(item.score * 100) }));
  const bridges: CatalogBridge[] = [];
  for (let index = 0; index < data.entries.length; index += 1) {
    const trackId = data.entries[index].trackId;
    const ownZone = zones.assignments[trackId];
    const foreign: Array<{ zone: number; score: number }> = [];
    for (let otherIndex = 0; otherIndex < data.entries.length; otherIndex += 1) {
      if (otherIndex === index || data.matrix[index][otherIndex] < 0.73) continue;
      const otherId = data.entries[otherIndex].trackId;
      const otherZone = zones.assignments[otherId];
      if (otherZone !== ownZone) foreign.push({ zone: otherZone, score: data.matrix[index][otherIndex] });
    }
    const foreignZones = new Set(foreign.map(item => item.zone));
    if (foreignZones.size >= 1 && foreign.length >= 2) {
      bridges.push({ trackId, zoneCount: foreignZones.size + 1, bridgePercent: Math.round(average(foreign.map(item => item.score)) * 100) });
    }
  }
  bridges.sort((left, right) => right.bridgePercent - left.bridgePercent || left.trackId.localeCompare(right.trackId));
  return { redundantPairs: redundantPairs.slice(0, 12), outliers: outliers.slice(0, 10), bridges: bridges.slice(0, 10) };
}

function traitValue(entry: SonicTraceCatalogEntry, key: string): number | null {
  const summary = asRecord(entry.semanticSummary);
  const traits = asRecord(summary?.traits);
  if (!traits || !(key in traits)) return null;
  const value = rankingScore(traits[key], Number.NaN);
  return Number.isFinite(value) ? value : null;
}

function metadataEnergy(track: StudioTrack | undefined): number | null {
  if (!track?.energy) return null;
  const numeric = Number(track.energy);
  if (Number.isFinite(numeric)) return clamp(numeric > 1 ? numeric / 100 : numeric);
  const normalized = track.energy.toLowerCase();
  if (/very\s*high|max|intense/.test(normalized)) return 0.92;
  if (/high|energetic/.test(normalized)) return 0.80;
  if (/medium|mid|balanced/.test(normalized)) return 0.58;
  if (/low|calm|soft/.test(normalized)) return 0.32;
  return null;
}

function trackEnergy(entry: SonicTraceCatalogEntry, track: StudioTrack | undefined): number {
  return traitValue(entry, 'energy') ?? metadataEnergy(track) ?? 0.55;
}

function bpmSimilarity(left: StudioTrack | undefined, right: StudioTrack | undefined): number {
  if (!Number.isFinite(left?.bpm) || !Number.isFinite(right?.bpm)) return Number.NaN;
  return Math.exp(-Math.abs(Number(left!.bpm) - Number(right!.bpm)) / 32);
}

function keySimilarity(left: StudioTrack | undefined, right: StudioTrack | undefined): number {
  const a = left?.key?.trim().toLowerCase();
  const b = right?.key?.trim().toLowerCase();
  if (!a || !b) return Number.NaN;
  if (a === b) return 1;
  const tonicA = a.split(/\s+/)[0];
  const tonicB = b.split(/\s+/)[0];
  if (tonicA === tonicB) return 0.84;
  const modeA = /minor|min\b/.test(a) ? 'minor' : /major|maj\b/.test(a) ? 'major' : '';
  const modeB = /minor|min\b/.test(b) ? 'minor' : /major|maj\b/.test(b) ? 'major' : '';
  return modeA && modeA === modeB ? 0.48 : 0.32;
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function targetEnergy(position: number, total: number): number {
  if (total <= 1) return 0.55;
  const progress = position / (total - 1);
  return progress <= 0.60
    ? 0.42 + 0.48 * (progress / 0.60)
    : 0.90 - 0.32 * ((progress - 0.60) / 0.40);
}

function roleFor(position: number, total: number): string {
  if (position === 0) return 'Opening';
  if (position === total - 1) return 'Resolution';
  const progress = position / Math.max(1, total - 1);
  if (progress >= 0.48 && progress <= 0.70) return 'Peak';
  return progress < 0.48 ? 'Build' : 'Descent';
}

function transitionExplanation(
  left: SonicTraceCatalogEntry,
  right: SonicTraceCatalogEntry,
  leftTrack: StudioTrack | undefined,
  rightTrack: StudioTrack | undefined,
): string[] {
  const result: string[] = [];
  const similarity = similarity01(left, right);
  if (similarity >= 0.90) result.push('very close CLAP neighborhood');
  else if (similarity >= 0.78) result.push('strong sonic continuity');
  else result.push('intentional sonic contrast');
  const bpm = bpmSimilarity(leftTrack, rightTrack);
  if (Number.isFinite(bpm) && bpm >= 0.85) result.push('tempo very close');
  else if (Number.isFinite(bpm) && bpm >= 0.66) result.push('tempo compatible');
  const key = keySimilarity(leftTrack, rightTrack);
  if (Number.isFinite(key) && key >= 0.84) result.push('harmonic metadata aligns');
  const energyLeft = trackEnergy(left, leftTrack);
  const energyRight = trackEnergy(right, rightTrack);
  if (Math.abs(energyLeft - energyRight) <= 0.12) result.push('energy continuity');
  else result.push(energyRight > energyLeft ? 'energy rise' : 'energy release');
  return result.slice(0, 3);
}

function sequenceProject(entries: SonicTraceCatalogEntry[], matrix: number[][], catalogById: Map<string, StudioTrack>): number[] {
  if (entries.length <= 1) return entries.map((_, index) => index);
  const energies = entries.map(entry => trackEnergy(entry, catalogById.get(entry.trackId)));
  const centrality = entries.map((_, index) => average(matrix[index].filter((__, otherIndex) => otherIndex !== index)));
  let current = 0;
  let openingScore = Number.NEGATIVE_INFINITY;
  entries.forEach((entry, index) => {
    const energyFit = 1 - Math.abs(energies[index] - 0.42);
    const originalBias = 1 - index / Math.max(1, entries.length - 1);
    const score = 0.48 * energyFit + 0.38 * centrality[index] + 0.14 * originalBias;
    if (score > openingScore) { openingScore = score; current = index; }
  });
  const order = [current];
  const unused = new Set(entries.map((_, index) => index));
  unused.delete(current);
  while (unused.size) {
    const position = order.length;
    const target = targetEnergy(position, entries.length);
    let best: number | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (const candidate of unused) {
      const currentTrack = catalogById.get(entries[current].trackId);
      const candidateTrack = catalogById.get(entries[candidate].trackId);
      const similarity = matrix[current][candidate];
      const energyFit = 1 - Math.abs(energies[candidate] - target);
      const tempoFit = finiteOr(bpmSimilarity(currentTrack, candidateTrack), 0.5);
      const harmonicFit = finiteOr(keySimilarity(currentTrack, candidateTrack), 0.5);
      const orderDistance = Math.abs(candidate - current) / Math.max(1, entries.length - 1);
      const originalContinuity = 1 - clamp(orderDistance);
      const score = 0.52 * similarity + 0.20 * energyFit + 0.12 * tempoFit + 0.08 * harmonicFit + 0.08 * originalContinuity;
      if (score > bestScore || (score === bestScore && entries[candidate].trackId.localeCompare(entries[best ?? candidate].trackId) < 0)) {
        best = candidate;
        bestScore = score;
      }
    }
    current = best ?? [...unused][0];
    order.push(current);
    unused.delete(current);
  }
  return order;
}

export function analyzeProject(trackIds: string[], entries: SonicTraceCatalogEntry[], catalogTracks: StudioTrack[] = []): ProjectAnalysis {
  const entryById = new Map(entries.map(entry => [entry.trackId, entry]));
  const catalogById = new Map(catalogTracks.map(track => [track.id, track]));
  const analyzed = trackIds.map(trackId => entryById.get(trackId)).filter((entry): entry is SonicTraceCatalogEntry => Boolean(entry));
  const usable = trackIds.map(trackId => entryById.get(trackId)).filter((entry): entry is SonicTraceCatalogEntry => Boolean(entry && validEmbedding(entry.embedding)));
  const missingTrackIds = trackIds.filter(trackId => !validEmbedding(entryById.get(trackId)?.embedding || null));
  const coveragePercent = trackIds.length ? Math.round((usable.length / trackIds.length) * 100) : 0;
  if (usable.length < 2) {
    return {
      totalTracks: trackIds.length,
      analyzedTracks: analyzed.length,
      embeddingTracks: usable.length,
      coveragePercent,
      coherencePercent: null,
      outliers: [],
      bridge: null,
      proposedSequence: usable.map(entry => ({ trackId: entry.trackId, originalIndex: trackIds.indexOf(entry.trackId), role: 'Opening', transition: ['insufficient comparison coverage'] })),
      missingTrackIds,
      summary: [usable.length ? 'At least two valid 512D embeddings are required for project coherence.' : 'No project track currently has a usable 512D embedding.'],
    };
  }
  const matrix = Array.from({ length: usable.length }, () => Array.from({ length: usable.length }, () => 0));
  const pairScores: number[] = [];
  for (let left = 0; left < usable.length; left += 1) {
    matrix[left][left] = 1;
    for (let right = left + 1; right < usable.length; right += 1) {
      const score = similarity01(usable[left], usable[right]);
      matrix[left][right] = score;
      matrix[right][left] = score;
      pairScores.push(score);
    }
  }
  const coherence = pairScores.length ? average(pairScores) : 1;
  const perTrack = usable.map((entry, index) => ({ entry, cohesion: average(matrix[index].filter((_, otherIndex) => otherIndex !== index)) }));
  const outliers = perTrack
    .filter(item => usable.length >= 4 && item.cohesion < Math.max(0.54, coherence - 0.14))
    .sort((left, right) => left.cohesion - right.cohesion || left.entry.trackId.localeCompare(right.entry.trackId))
    .map(item => ({ trackId: item.entry.trackId, percent: Math.round(item.cohesion * 100) }));
  let bridge: { trackId: string; percent: number } | null = null;
  if (usable.length >= 3) {
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let index = 0; index < usable.length; index += 1) {
      const entry = usable[index];
      const scores = matrix[index].filter((_, otherIndex) => otherIndex !== index).sort((left, right) => right - left);
      const take = Math.min(4, scores.length);
      const value = average(scores.slice(0, take));
      const spread = scores.length ? scores[0] - scores[scores.length - 1] : 0;
      const score = value - spread * 0.12;
      if (score > bestScore) {
        bestScore = score;
        bridge = { trackId: entry.trackId, percent: Math.round(score * 100) };
      }
    }
  }
  const order = sequenceProject(usable, matrix, catalogById);
  const proposedSequence = order.map((usableIndex, position): ProjectSequenceItem => {
    const entry = usable[usableIndex];
    const previous = position ? usable[order[position - 1]] : null;
    return {
      trackId: entry.trackId,
      originalIndex: trackIds.indexOf(entry.trackId),
      role: roleFor(position, order.length),
      transition: previous
        ? transitionExplanation(previous, entry, catalogById.get(previous.trackId), catalogById.get(entry.trackId))
        : ['advisory opening candidate'],
    };
  });
  const summary: string[] = [];
  if (coherence >= 0.82) summary.push(`${usable.length} analyzed tracks form a very coherent sonic identity.`);
  else if (coherence >= 0.70) summary.push(`${usable.length} analyzed tracks are broadly coherent with useful contrast.`);
  else summary.push('The analyzed project spans several distinct sonic neighborhoods.');
  if (outliers.length === 1) summary.push('One analyzed track sits clearly outside the project center.');
  else if (outliers.length > 1) summary.push(`${outliers.length} analyzed tracks sit outside the project center.`);
  if (bridge) summary.push(`${entryById.get(bridge.trackId)?.title || bridge.trackId} is the strongest bridge candidate across the analyzed selection.`);
  if (missingTrackIds.length) summary.push(`${missingTrackIds.length} project track${missingTrackIds.length === 1 ? '' : 's'} still need${missingTrackIds.length === 1 ? 's' : ''} a valid 512D profile before the recommendation has full coverage.`);
  return {
    totalTracks: trackIds.length,
    analyzedTracks: analyzed.length,
    embeddingTracks: usable.length,
    coveragePercent,
    coherencePercent: Math.round(coherence * 100),
    outliers,
    bridge,
    proposedSequence,
    missingTrackIds,
    summary,
  };
}

export function analyzeCatalog(entries: SonicTraceCatalogEntry[]): CatalogAnalysis {
  const projection = projectTracks(entries);
  const zones = clusterAcousticZones(entries, projection);
  const styleFamilies = analyzeStyleFamilies(entries);
  const insights = catalogInsights(entries, zones);
  return { projection, zones, styleFamilies, insights };
}

// Phase 5 compatibility alias. C3-B deliberately relabels these embedding clusters as acoustic zones.
export function clusterTracks(entries: SonicTraceCatalogEntry[]): SonicCluster[] {
  const zones = clusterAcousticZones(entries);
  const byId = new Map(entries.map(entry => [entry.trackId, entry]));
  return zones.groups.map(group => ({
    id: group.id,
    label: group.label,
    entries: group.trackIds.map(trackId => byId.get(trackId)).filter((entry): entry is SonicTraceCatalogEntry => Boolean(entry)),
  }));
}