import type { StudioTrackDetail } from './types/studio';

const MASTER_CONCEPT_DIRECTIONS = [
  'CONCEPT DIRECTION — kinetic collision. Build the image around one explosive frozen instant: impossible speed, compressed perspective, directional debris/light and a strong center-of-impact hierarchy. Make motion itself feel physical.',
  'CONCEPT DIRECTION — surreal time fracture. Build one memorable visual metaphor for altered time: repeated temporal layers, displaced geometry, impossible continuity, echoes of the same instant or objects caught between moments. Keep it elegant rather than psychedelic clutter.',
  'CONCEPT DIRECTION — premium typographic object. Treat the exact track title as a designed physical hero object inside the world: sculpted, fabricated, engraved, illuminated or materially integrated. The scene supports the title rather than competing with it.',
  'CONCEPT DIRECTION — cinematic human-scale tension. Use a single grounded subject or silhouette in a believable environment, with the track concept expressed through framing, light, atmosphere and one impossible detail. Avoid poster-template composition.',
  'CONCEPT DIRECTION — abstract material system. Avoid literal people and genre clichés. Translate the track into a distinctive system of materials, pressure, velocity, refraction, fragmentation or fluid geometry with a precise editorial composition.',
  'CONCEPT DIRECTION — brutal graphic minimalism. Use fewer elements, more negative space, a hard focal hierarchy and one iconic visual device. Make the result recognizable at thumbnail size while retaining premium detail up close.',
  'CONCEPT DIRECTION — environmental world-building. Create a specific place that could only belong to this track, with coherent architecture/terrain, atmospheric depth and story clues. No generic cyberpunk city filler; every major element must support the track concept.',
  'CONCEPT DIRECTION — impossible product-shot precision. Present one symbolic object or constructed artifact as if photographed for a luxury campaign, with obsessive materials, controlled studio/cinematic lighting and subtle narrative details tied to the track.',
] as const;

const clean = (value: string | null | undefined) => (value || '').replace(/\s+/g, ' ').trim();

function trackContext(track: StudioTrackDetail) {
  return [
    track.genres.length ? `Genres: ${track.genres.join(', ')}` : '',
    track.bpm ? `Tempo: ${track.bpm} BPM` : '',
    track.key ? `Key: ${track.key}` : '',
    track.energy ? `Energy: ${track.energy}` : '',
    track.moods.length ? `Mood: ${track.moods.join(', ')}` : '',
    track.themes.length ? `Themes: ${track.themes.join(', ')}` : '',
    track.era ? `Era: ${track.era}` : '',
    track.accent ? `Primary palette reference: ${track.accent}` : '',
    track.accent2 ? `Secondary palette reference: ${track.accent2}` : '',
  ].filter(Boolean).join('. ');
}

export const SHINOBIWAN_LOGO_RULE = [
  'BRANDING REFERENCE REQUIRED: attach the official SHINOBIWAN logo file as an image reference with this prompt.',
  'Preserve the exact SHINOBIWAN lettering, silhouette, proportions and identity; never redraw, respell, approximate or invent a substitute logo.',
  'Integrate the logo naturally into the visual world so its material, lighting, perspective and placement feel coherent with the artwork rather than pasted on afterward.',
  'The logo must always remain clearly smaller and visually subordinate to the exact track title; the track title is the primary typographic hierarchy and the SHINOBIWAN logo must never dominate it.',
].join(' ');

export function buildFreshMasterPrompt(track: StudioTrackDetail, _hasLogo = true, conceptIndex = 0) {
  const normalizedIndex = Math.abs(Math.trunc(conceptIndex)) % MASTER_CONCEPT_DIRECTIONS.length;
  const conceptDirection = MASTER_CONCEPT_DIRECTIONS[normalizedIndex];

  return [
    'PREMIUM RELEASE CAMPAIGN — MASTER 16:9.',
    conceptIndex > 0 ? 'CREATIVE RESET: start a genuinely new visual concept from scratch. Ignore any previous MASTER prompt, composition, scene, subject or visual metaphor. Keep only the canonical track identity and branding constraints below.' : '',
    `Create the finished 16:9 MASTER artwork for the music track “${clean(track.title)}”.`,
    trackContext(track),
    conceptDirection,
    SHINOBIWAN_LOGO_RULE,
    `The exact track title “${clean(track.title)}” must be intentionally integrated into the artwork, not pasted on as a generic overlay. Keep spelling exact and make the title visibly more prominent than the SHINOBIWAN logo.`,
    'Build one distinctive campaign concept with a clear focal idea, premium editorial composition, believable materials, controlled depth, detailed lighting and coherent color grading.',
    'Avoid generic AI music-cover clichés unless explicitly justified by the track context: random speakers, headphones, microphones, equalizers, vinyl records, glowing music notes, generic cyberpunk city filler or meaningless pseudo-text.',
    'Use any lyrics/themes only as emotional and conceptual inspiration; do not quote random lyric fragments into the image.',
    'Deliver a finished campaign MASTER strong enough to serve later as the sole visual composition reference for coherent 1:1 and 9:16 adaptations.',
  ].filter(Boolean).join(' ');
}

export function buildMasterPrompt(track: StudioTrackDetail, hasLogo = true) {
  return buildFreshMasterPrompt(track, hasLogo, 0);
}

export function buildVariantPrompt(track: StudioTrackDetail, format: '1:1' | '9:16') {
  const formatLabel = format === '1:1' ? 'square 1:1' : 'vertical 9:16';
  const composition = format === '1:1'
    ? 'Recompose intentionally for a square frame. Reframe or extend the scene where needed; do not perform a crude center crop.'
    : 'Recompose intentionally for a vertical frame. Extend/reframe the scene naturally to create vertical depth and hierarchy; do not perform a crude crop.';

  return [
    `ANCHORED CAMPAIGN DERIVATIVE — ${formatLabel.toUpperCase()}.`,
    'REFERENCE IMAGES REQUIRED: attach the accepted MASTER 16:9 artwork as the primary composition reference and attach the official SHINOBIWAN logo as the branding reference.',
    `Create a coherent ${formatLabel} version of that exact MASTER for “${clean(track.title)}”.`,
    'Preserve the same campaign identity: central subject or visual metaphor, characters/objects, environment, palette, lighting, materials, atmosphere and title treatment.',
    SHINOBIWAN_LOGO_RULE,
    `Preserve the exact track title “${clean(track.title)}”; the title must remain visibly more prominent than the SHINOBIWAN logo in this format too.`,
    composition,
    'Do not redesign the campaign, change the narrative, substitute the subject, invent new branding, change the title treatment or replace the logo.',
    'The result must look like an intentional official format adaptation from the same release campaign, not a new cover inspired by it.',
  ].join(' ');
}

export function buildMotionPrompt(track: StudioTrackDetail) {
  return [
    'ANCHORED 8-SECOND RELEASE LOOP.',
    'REFERENCE IMAGES REQUIRED: use the accepted MASTER 16:9 artwork as the first-frame / visual reference and attach the official SHINOBIWAN logo as the branding reference.',
    `Create a subtle cinematic 8-second loop for “${clean(track.title)}”.`,
    SHINOBIWAN_LOGO_RULE,
    'Preserve the artwork composition and exact title spelling. Keep title and logo visually stable unless a deliberate minimal motion treatment improves them, and keep the logo smaller than the title throughout.',
    'Use restrained parallax, atmospheric movement, particles/light/weather or camera depth appropriate to the artwork. Avoid introducing new subjects or unrelated objects.',
    'The final moment must visually reconnect to the opening frame so the clip can loop cleanly.',
  ].join(' ');
}
