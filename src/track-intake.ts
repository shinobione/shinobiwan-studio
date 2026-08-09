export type IntakeFileRole = 'audio' | 'cover' | 'lyrics' | 'video' | 'ignore';
export type IntakeDetectedRole = IntakeFileRole | 'ambiguous';

export interface IntakeFileAssignment {
  id: string;
  file: File;
  detectedRole: IntakeDetectedRole;
  role: IntakeFileRole;
  note: string;
}

export type IntakeFieldSource = 'detected' | 'inferred' | 'detected+inferred';
export type IntakeFieldSources = Partial<Record<IntakeFieldName, IntakeFieldSource>>;

export interface IntakeFormValues {
  title: string;
  slug: string;
  type: string;
  year: string;
  releaseDate: string;
  albumTitle: string;
  albumId: string;
  languages: string;
  genres: string;
  tags: string;
  moods: string;
  themes: string;
  era: string;
  energy: string;
  bpm: string;
  key: string;
  keyConfidence: string;
  duration: string;
  explicit: string;
  status: string;
  accent: string;
  accent2: string;
}

export type IntakeFieldName = keyof IntakeFormValues;

export interface ParsedTrackTxt {
  values: Partial<IntakeFormValues>;
  sources: IntakeFieldSources;
  detectedFields: IntakeFieldName[];
  inferredFields: IntakeFieldName[];
  stylePrompt: string;
  lyricsFound: boolean;
  timestampCount: number;
}

export interface IntakeMergeResult {
  values: IntakeFormValues;
  sources: IntakeFieldSources;
  applied: IntakeFieldName[];
  preserved: IntakeFieldName[];
}

const ROLE_EXTENSIONS: Record<Exclude<IntakeFileRole, 'ignore'>, ReadonlySet<string>> = {
  audio: new Set(['mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg']),
  cover: new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']),
  lyrics: new Set(['txt']),
  video: new Set(['mp4', 'webm']),
};

const LIST_FIELDS = new Set<IntakeFieldName>(['genres', 'tags', 'moods', 'themes', 'languages']);
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const FIELD_MAP: Record<string, IntakeFieldName> = {
  TITLE: 'title', TITRE: 'title', SLUG: 'slug', TRACK_ID: 'slug', TRACKID: 'slug', TYPE: 'type',
  YEAR: 'year', ANNEE: 'year', GENRE: 'genres', GENRES: 'genres', TAG: 'tags', TAGS: 'tags',
  MOOD: 'moods', MOODS: 'moods', THEME: 'themes', THEMES: 'themes', ERA: 'era', ERE: 'era',
  ENERGY: 'energy', ENERGIE: 'energy', LANGUAGE: 'languages', LANGUAGES: 'languages', LANGUE: 'languages', LANGUES: 'languages',
  STATUS: 'status', STATUT: 'status', RELEASE: 'releaseDate', RELEASE_DATE: 'releaseDate', DATE_DE_SORTIE: 'releaseDate',
  ALBUM: 'albumTitle', ALBUM_TITLE: 'albumTitle', NOM_ALBUM: 'albumTitle', ALBUM_ID: 'albumId', ID_ALBUM: 'albumId',
  BPM: 'bpm', KEY: 'key', TONALITE: 'key', KEY_CONFIDENCE: 'keyConfidence', CONFIANCE_TONALITE: 'keyConfidence',
  DURATION: 'duration', DUREE: 'duration', EXPLICIT: 'explicit', ACCENT: 'accent', ACCENT_2: 'accent2', ACCENT2: 'accent2',
};

const GENRE_RULES: ReadonlyArray<readonly [string, RegExp]> = [
  ['Trap', /\b(?:trap|cybertrap|rage|abyssal)\b/i], ['Drill', /\bdrill\b/i], ['Phonk', /\bphonk\b/i],
  ['R&B', /\b(?:r\s*&\s*b|rnb|rhythm\s+and\s+blues|neo\s+soul|soul)\b/i],
  ['Hip-hop', /\b(?:hip[ -]?hop|rap|boom[ -]?bap|cypher)\b/i], ['House', /\b(?:house|garage|ukg|2[ -]?step)\b/i],
  ['Dancehall', /\b(?:dancehall|reggae|ragga)\b/i], ['Pop', /\b(?:pop|hyperpop|synthpop)\b/i],
  ['Electronic', /\b(?:electronic|electro|edm|techno|trance|synthwave|dnb|drum\s*(?:and|&)\s*bass)\b/i],
  ['Lo-fi', /\b(?:lo[ -]?fi|chillhop)\b/i], ['Afro', /\b(?:afrobeat|afropop|amapiano)\b/i],
  ['Bolero', /\bbolero\b/i], ['Cinematic', /\b(?:cinematic|orchestral|soundtrack|score)\b/i], ['Rock', /\b(?:rock|metal|punk)\b/i],
];

const MOOD_RULES: ReadonlyArray<readonly [string, RegExp]> = [
  ['Romantic', /\b(?:romantic|romance|love|lover|heart|tender|intimate)\b/i],
  ['Uplifting', /\b(?:uplifting|hopeful|bright|sunny|feel[ -]?good|joy|joyful)\b/i],
  ['Triumphant', /\b(?:triumphant|victory|victorious|anthemic|rise|rising|conquer)\b/i],
  ['Emotional', /\b(?:emotional|emotion|tears?|vulnerable|heartbreak|melanchol)\b/i],
  ['Dark', /\b(?:dark|noir|abyss|sinister|ominous|haunting|menacing)\b/i],
  ['Aggressive', /\b(?:aggressive|hard|brutal|violent|attack|ferocious|rage)\b/i],
  ['Energetic', /\b(?:energetic|high energy|explosive|intense|driving|kinetic)\b/i],
  ['Chill', /\b(?:chill|laid[ -]?back|relaxed|dreamy|ambient|soft)\b/i],
  ['Nostalgic', /\b(?:nostalgic|nostalgia|memory|memories|retro|y2k)\b/i],
  ['Playful', /\b(?:playful|fun|funny|humor|cheeky|quirky)\b/i],
];

const THEME_RULES: ReadonlyArray<readonly [string, RegExp]> = [
  ['Love', /\b(?:love|lover|romance|heart|kiss|together)\b/i],
  ['Long-distance relationship', /\b(?:long distance|distance relationship|screens?|across oceans?|miles apart)\b/i],
  ['Resilience', /\b(?:resilien|surviv|overcome|rise again|never give up|scars?)\b/i],
  ['Transformation', /\b(?:transform|rebirth|evolution|work in progress|coal to diamond)\b/i],
  ['Digital life', /\b(?:digital|online|signal|screen|algorithm|cyber|virtual)\b/i],
  ['Freedom', /\b(?:freedom|free|escape|out the cage|break chains?)\b/i],
  ['Ambition', /\b(?:ambition|success|throne|empire|build|legacy)\b/i],
  ['Vietnam', /\b(?:vietnam|saigon|ho chi minh|vietnamese|trân|tyffany)\b/i],
];

export function canonicalIntakeSlug(value: string): string {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
}

function extension(name: string): string {
  const clean = String(name || '').toLowerCase();
  const dot = clean.lastIndexOf('.');
  return dot < 0 ? '' : clean.slice(dot + 1);
}

function mimeRole(type: string): Exclude<IntakeFileRole, 'ignore'> | null {
  const value = String(type || '').toLowerCase();
  if (value.startsWith('audio/')) return 'audio';
  if (value.startsWith('image/')) return 'cover';
  if (value === 'text/plain') return 'lyrics';
  if (value === 'video/mp4' || value === 'video/webm') return 'video';
  return null;
}

export function detectIntakeFileRole(file: Pick<File, 'name' | 'type'>): IntakeDetectedRole {
  const ext = extension(file.name);
  if (ext === 'lrc') return 'ignore';
  const extensionRoles = (Object.keys(ROLE_EXTENSIONS) as Array<Exclude<IntakeFileRole, 'ignore'>>).filter(role => ROLE_EXTENSIONS[role].has(ext));
  const fromMime = mimeRole(file.type);
  if (fromMime === 'lyrics' && ext !== 'txt') return 'ignore';
  const signals = unique([extensionRoles[0] || '', fromMime || '']);
  if (signals.length > 1) return 'ambiguous';
  return signals[0] as IntakeDetectedRole || 'ignore';
}

export function classifyIntakeFiles(files: Iterable<File>): IntakeFileAssignment[] {
  return Array.from(files).map(file => {
    const detectedRole = detectIntakeFileRole(file);
    const role = detectedRole === 'ambiguous' ? 'ignore' : detectedRole;
    return {
      id: `${file.name}|${file.size}|${file.lastModified}`,
      file,
      detectedRole,
      role,
      note: detectedRole === 'ambiguous' ? 'Conflicting extension and MIME signals — choose a role.' : detectedRole === 'ignore' ? 'Unsupported file — ignored unless you resolve its role.' : 'Automatically classified.',
    };
  });
}

export function mergeIntakeFiles(current: IntakeFileAssignment[], files: Iterable<File>): IntakeFileAssignment[] {
  const merged = [...current, ...classifyIntakeFiles(files)];
  const seen = new Set<string>();
  return merged.filter(item => seen.has(item.id) ? false : (seen.add(item.id), true));
}

export function intakeRoleProblems(assignments: IntakeFileAssignment[]): string[] {
  const problems: string[] = [];
  for (const role of ['audio', 'cover', 'lyrics', 'video'] as const) {
    const matches = assignments.filter(item => item.role === role);
    if (matches.length > 1) problems.push(`Choose only one ${role} file; the other classified files stay available for reassignment.`);
  }
  if (assignments.some(item => item.detectedRole === 'ambiguous' && item.role === 'ignore')) problems.push('Resolve or explicitly ignore each ambiguous file.');
  if (assignments.some(item => item.role === 'lyrics' && extension(item.file.name) !== 'txt')) problems.push('Canonical lyrics intake accepts .txt only; use standalone Track Manager for optional LRC compatibility conversion.');
  return problems;
}

export function intakeFileForRole(assignments: IntakeFileAssignment[], role: Exclude<IntakeFileRole, 'ignore'>): File | null {
  const matches = assignments.filter(item => item.role === role);
  return matches.length === 1 ? matches[0].file : null;
}

function normalizeKey(value: string): string {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function cleanToken(value: string): string {
  return String(value || '').normalize('NFKC').replace(/[\u200B-\u200D\u2060\uFEFF]/g, '').replace(/[_–—]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitList(value: string): string[] {
  return String(value || '').split(/[,;|]/).map(cleanToken).filter(Boolean);
}

function unique(values: string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    const clean = cleanToken(value);
    if (clean && !result.some(candidate => candidate.toLowerCase() === clean.toLowerCase())) result.push(clean);
  }
  return result;
}

function normalizeReleaseDate(value: string): string | null {
  const clean = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const match = clean.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]); const month = Number(match[2]); const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function normalizeField(field: IntakeFieldName, value: string): string | null {
  const clean = cleanToken(value);
  if (!clean) return null;
  if (LIST_FIELDS.has(field)) return unique(splitList(clean)).join(', ');
  if (field === 'slug') return canonicalIntakeSlug(clean) || null;
  if (field === 'year') { const year = Number.parseInt(clean, 10); return year >= 1900 && year <= 2200 ? String(year) : null; }
  if (field === 'bpm') { const bpm = Number(clean.replace(/\s*bpm$/i, '')); return Number.isFinite(bpm) && bpm > 0 && bpm < 400 ? String(bpm) : null; }
  if (field === 'keyConfidence') { const confidence = Number(clean); return Number.isFinite(confidence) && confidence >= 0 && confidence <= 1 ? String(confidence) : null; }
  if (field === 'type') { const type = normalizeKey(clean).toLowerCase(); return type === 'single' ? 'single' : type === 'album_track' || type === 'albumtrack' ? 'album-track' : type === 'demo' ? 'demo' : null; }
  if (field === 'status') { const status = clean.toLowerCase(); return ['draft', 'published', 'archived'].includes(status) ? status : null; }
  if (field === 'explicit') { const explicit = clean.toLowerCase(); if (['true', 'yes', 'oui', 'explicit'].includes(explicit)) return 'explicit'; if (['false', 'no', 'non', 'clean'].includes(explicit)) return 'clean'; return null; }
  if (field === 'releaseDate') return normalizeReleaseDate(clean);
  if (field === 'duration') return /^(?:\d+:)?[0-5]\d(?:\.\d{1,3})?$/.test(clean) ? clean : null;
  if (field === 'accent' || field === 'accent2') return HEX_COLOR.test(clean) ? clean.toLowerCase() : null;
  return clean;
}

function labels(text: string, rules: ReadonlyArray<readonly [string, RegExp]>): string[] {
  return rules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}

function normalizedGenres(values: string[]): string[] {
  return unique(values.map(value => {
    const clean = cleanToken(value);
    const match = GENRE_RULES.find(([, pattern]) => pattern.test(clean));
    return match?.[0] || (/^(?:spotify\s+)?canvas?$/i.test(clean) ? '' : clean);
  }).filter(Boolean)).slice(0, 6);
}

export function parseTrackTxt(text: string, filenameSignal = '', formSignals = ''): ParsedTrackTxt {
  const source = String(text || '').replace(/^\uFEFF/, '');
  const lines = source.split(/\r?\n/);
  const values: Partial<IntakeFormValues> = {};
  const sources: IntakeFieldSources = {};
  let lyricsStart = -1;
  let stylePrompt = '';
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^LYRICS\s*:?\s*$/i.test(line)) { lyricsStart = index + 1; break; }
    const match = line.match(/^([^:]{1,80})\s*:\s*(.+)$/);
    if (!match) continue;
    const normalized = normalizeKey(match[1]);
    if (['STYLE_PROMPT', 'SUNO_STYLE', 'STYLE'].includes(normalized)) stylePrompt = match[2].trim();
    const field = FIELD_MAP[normalized];
    if (!field) continue;
    const value = normalizeField(field, match[2]);
    if (value == null) continue;
    if (LIST_FIELDS.has(field) && values[field]) values[field] = unique(splitList(`${values[field]},${value}`)).join(', ');
    else values[field] = value;
    sources[field] = 'detected';
  }

  if (values.title && !values.slug) { values.slug = canonicalIntakeSlug(values.title); sources.slug = 'inferred'; }
  if (!values.slug && filenameSignal) { values.slug = canonicalIntakeSlug(filenameSignal.replace(/\.[^.]+$/, '')); sources.slug = 'inferred'; }
  if (values.albumTitle && !/^(?:single|singles)$/i.test(values.albumTitle)) {
    if (!values.albumId) { values.albumId = canonicalIntakeSlug(values.albumTitle); sources.albumId = 'inferred'; }
    if (!values.type || values.type === 'single') { values.type = 'album-track'; sources.type = 'inferred'; }
  }

  const lyricsText = lyricsStart >= 0 ? lines.slice(lyricsStart).join('\n') : '';
  const combined = [source, stylePrompt, lyricsText, filenameSignal, formSignals].join(' ');
  const directLists = { genres: splitList(values.genres || ''), moods: splitList(values.moods || ''), themes: splitList(values.themes || '') };
  const inferredGenres = normalizedGenres([...directLists.genres, ...labels(combined, GENRE_RULES)]);
  const inferredMoods = unique([...directLists.moods, ...labels(combined, MOOD_RULES)]).slice(0, 8);
  const inferredThemes = unique([...directLists.themes, ...labels(combined, THEME_RULES)]).slice(0, 8);
  for (const [field, inferred] of [['genres', inferredGenres], ['moods', inferredMoods], ['themes', inferredThemes]] as const) {
    if (!inferred.length) continue;
    values[field] = inferred.join(', ');
    const direct = directLists[field];
    const added = inferred.some(value => !direct.some(existing => existing.toLowerCase() === value.toLowerCase()));
    sources[field] = direct.length ? added ? 'detected+inferred' : 'detected' : 'inferred';
  }

  const timestampCount = lyricsText.split(/\r?\n/).filter(line => /^\[\d{1,3}:\d{2}(?:[.:]\d{1,3})?\]/.test(line.trim())).length;
  const detectedFields = (Object.keys(sources) as IntakeFieldName[]).filter(field => sources[field]?.includes('detected'));
  const inferredFields = (Object.keys(sources) as IntakeFieldName[]).filter(field => sources[field]?.includes('inferred'));
  return { values, sources, detectedFields, inferredFields, stylePrompt, lyricsFound: lyricsStart >= 0, timestampCount };
}

export function mergeParsedTrackTxt(current: IntakeFormValues, parsed: ParsedTrackTxt, manualFields: ReadonlySet<IntakeFieldName>): IntakeMergeResult {
  const values = { ...current };
  const sources: IntakeFieldSources = {};
  const applied: IntakeFieldName[] = [];
  const preserved: IntakeFieldName[] = [];
  for (const field of Object.keys(parsed.values) as IntakeFieldName[]) {
    const proposal = parsed.values[field];
    if (proposal == null || proposal === '') continue;
    if (manualFields.has(field) && current[field].trim()) { preserved.push(field); continue; }
    values[field] = proposal;
    sources[field] = parsed.sources[field] || 'detected';
    applied.push(field);
  }
  return { values, sources, applied, preserved };
}
