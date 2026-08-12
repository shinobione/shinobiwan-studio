import type { StudioTrackDetail } from './types/studio';

export type CampaignFormat = '16:9' | '1:1' | '9:16';

export interface CampaignImageAsset {
  dataUrl: string;
  filename: string;
  mimeType: string;
  width: number;
  height: number;
  importedAt: string;
}

export interface ReleaseCampaignCopy {
  soundcloud: string;
  social: string;
  tags: string[];
}

export interface ReleaseCampaignDraft {
  version: 1;
  trackId: string;
  provider: string;
  masterPrompt: string;
  squarePrompt: string;
  verticalPrompt: string;
  logo: CampaignImageAsset | null;
  master: CampaignImageAsset | null;
  square: CampaignImageAsset | null;
  vertical: CampaignImageAsset | null;
  copy: ReleaseCampaignCopy;
  updatedAt: string;
}

const SC_SIGNATURE = 'Thx for listening😁👍 — SHINOBIWAN';

const clean = (value: string | null | undefined) => (value || '').replace(/\s+/g, ' ').trim();
const unique = (values: string[]) => [...new Set(values.map(value => clean(value).toLowerCase()).filter(Boolean))];

function trackContext(track: StudioTrackDetail) {
  const parts = [
    track.genres.length ? `Genres: ${track.genres.join(', ')}` : '',
    track.bpm ? `Tempo: ${track.bpm} BPM` : '',
    track.key ? `Key: ${track.key}` : '',
    track.energy ? `Energy: ${track.energy}` : '',
    track.moods.length ? `Mood: ${track.moods.join(', ')}` : '',
    track.themes.length ? `Themes: ${track.themes.join(', ')}` : '',
    track.era ? `Era: ${track.era}` : '',
    track.accent ? `Primary palette reference: ${track.accent}` : '',
    track.accent2 ? `Secondary palette reference: ${track.accent2}` : '',
  ].filter(Boolean);
  return parts.join('. ');
}

export function buildMasterPrompt(track: StudioTrackDetail, hasLogo: boolean) {
  const logoRule = hasLogo
    ? 'REFERENCE IMAGE REQUIRED: attach the supplied SHINOBIWAN logo file together with this prompt. Preserve the exact lettering, silhouette, proportions and visual identity of that logo. Do not redraw, respell or invent a replacement.'
    : 'No artist-logo reference file is supplied. Do not invent fake SHINOBIWAN lettering or a pseudo-logo.';

  return [
    'PREMIUM RELEASE CAMPAIGN — MASTER 16:9.',
    `Create the finished 16:9 MASTER artwork for the music track “${clean(track.title)}”.`,
    trackContext(track),
    logoRule,
    `The exact track title “${clean(track.title)}” must be intentionally integrated into the artwork, not pasted on as a generic overlay. Keep spelling exact.`,
    'Build one distinctive campaign concept with a clear focal idea, premium editorial composition, believable materials, controlled depth, detailed lighting and coherent color grading.',
    'Avoid generic AI music-cover clichés unless explicitly justified by the track context: random speakers, headphones, microphones, equalizers, vinyl records, glowing music notes, generic cyberpunk city filler or meaningless pseudo-text.',
    'Use any lyrics/themes only as emotional and conceptual inspiration; do not quote random lyric fragments into the image.',
    'Deliver a finished campaign MASTER. It must be strong enough to serve later as the sole visual reference for coherent 1:1 and 9:16 derivatives.',
  ].filter(Boolean).join(' ');
}

export function buildVariantPrompt(track: StudioTrackDetail, format: '1:1' | '9:16') {
  const formatLabel = format === '1:1' ? 'square 1:1' : 'vertical 9:16';
  const composition = format === '1:1'
    ? 'Recompose intentionally for a square frame. Reframe or extend the scene where needed; do not perform a crude center crop.'
    : 'Recompose intentionally for a vertical frame. Extend/reframe the scene naturally to create vertical depth and hierarchy; do not perform a crude crop.';

  return [
    `ANCHORED CAMPAIGN DERIVATIVE — ${formatLabel.toUpperCase()}.`,
    'REFERENCE IMAGE REQUIRED: attach the accepted MASTER 16:9 artwork as the primary image reference for this generation.',
    `Create a coherent ${formatLabel} version of that exact MASTER for “${clean(track.title)}”.`,
    'Preserve the same campaign identity: central subject or visual metaphor, characters/objects, environment, palette, lighting, materials, atmosphere, title spelling, typography style and SHINOBIWAN logo identity/treatment.',
    composition,
    'Do not redesign the campaign, change the narrative, substitute the subject, invent new branding, change the title treatment or replace the logo.',
    'The result must look like an intentional official format adaptation from the same release campaign, not a new cover inspired by it.',
  ].join(' ');
}

export function buildMotionPrompt(track: StudioTrackDetail) {
  return [
    'ANCHORED 8-SECOND RELEASE LOOP.',
    'REFERENCE IMAGE REQUIRED: use the accepted MASTER 16:9 artwork as the first-frame / visual reference.',
    `Create a subtle cinematic 8-second loop for “${clean(track.title)}”.`,
    'Preserve the artwork composition, exact title spelling and SHINOBIWAN logo identity. Keep title/logo visually stable unless a deliberate minimal motion treatment improves them.',
    'Use restrained parallax, atmospheric movement, particles/light/weather or camera depth appropriate to the artwork. Avoid introducing new subjects or unrelated objects.',
    'The final moment must visually reconnect to the opening frame so the clip can loop cleanly.',
  ].join(' ');
}

export function buildReleaseCopy(track: StudioTrackDetail): ReleaseCampaignCopy {
  const genres = track.genres.slice(0, 2);
  const mood = track.moods[0] || track.energy || 'cinematic';
  const base = `${clean(track.title)} — ${genres.join(' / ') || 'SHINOBIWAN'}. ${clean(mood)} energy. `;
  const available = Math.max(0, 140 - SC_SIGNATURE.length);
  const clipped = base.length > available ? `${base.slice(0, Math.max(0, available - 1)).trimEnd()}…` : base;
  const soundcloud = `${clipped}${SC_SIGNATURE}`.slice(0, 140);

  const social = `“${clean(track.title)}” — ${genres.join(' × ') || 'new release'} through the SHINOBIWAN lens.\nTurn it up. ⚡ #SHINOBIWAN`;
  const tags = unique([
    ...track.genres,
    ...track.moods,
    ...track.themes.slice(0, 4),
    track.energy || '',
    'shinobiwan',
    'independent artist',
    'new music',
    'music release',
    'music discovery',
    'night drive',
    'headphones',
  ]).slice(0, 20);

  return { soundcloud, social, tags };
}

export function aspectTarget(format: CampaignFormat) {
  if (format === '16:9') return 16 / 9;
  if (format === '1:1') return 1;
  return 9 / 16;
}

export function inspectAspect(asset: CampaignImageAsset | null, format: CampaignFormat) {
  if (!asset || !asset.width || !asset.height) return { ok: false, actual: 0, delta: Infinity };
  const actual = asset.width / asset.height;
  const target = aspectTarget(format);
  const delta = Math.abs(actual - target) / target;
  return { ok: delta <= 0.04, actual, delta };
}

export function campaignReady(draft: Pick<ReleaseCampaignDraft, 'master' | 'square' | 'vertical'>) {
  return inspectAspect(draft.master, '16:9').ok
    && inspectAspect(draft.square, '1:1').ok
    && inspectAspect(draft.vertical, '9:16').ok;
}

export function safeCampaignName(value: string) {
  return clean(value).replace(/[^a-z0-9_-]+/gi, '_').replace(/^_+|_+$/g, '') || 'release_campaign';
}

export function dataUrlParts(dataUrl: string) {
  const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) throw new Error('Unsupported image data URL.');
  return { mimeType: match[1], base64: match[2] };
}

export function extensionForMime(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/avif') return 'avif';
  return 'png';
}
