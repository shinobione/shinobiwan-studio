export const COVER_PALETTE_FIELDS = ['accent', 'accent2'] as const;

export interface CoverPalette {
  accent: string;
  accent2: string;
}

interface ColorMetrics {
  hue: number;
  saturation: number;
  value: number;
  lightness: number;
  chroma: number;
}

interface ColorCandidate {
  count: number;
  rgb: [number, number, number];
  metrics: ColorMetrics;
  score: number;
}

function colorMetrics(rgb: [number, number, number]): ColorMetrics {
  const [r, g, b] = rgb.map(channel => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  let hue = 0;
  if (chroma) {
    if (max === r) hue = 60 * (((g - b) / chroma) % 6);
    else if (max === g) hue = 60 * ((b - r) / chroma + 2);
    else hue = 60 * ((r - g) / chroma + 4);
    if (hue < 0) hue += 360;
  }
  return { hue, saturation: max ? chroma / max : 0, value: max, lightness: (max + min) / 2, chroma };
}

function hueDistance(left: number, right: number): number {
  const distance = Math.abs(left - right) % 360;
  return Math.min(distance, 360 - distance);
}

function colorDistance(left: [number, number, number], right: [number, number, number]): number {
  const dr = left[0] - right[0];
  const dg = left[1] - right[1];
  const db = left[2] - right[2];
  return dr * dr + dg * dg + db * db;
}

function candidateScore(candidate: ColorCandidate): number {
  const metrics = candidate.metrics;
  if (metrics.value < 0.18 || (metrics.lightness > 0.94 && metrics.saturation < 0.12)) return 0;
  const brightness = Math.max(0.15, 1 - Math.abs(metrics.value - 0.58) * 1.8);
  return candidate.count * (0.25 + metrics.saturation * 1.7) * (0.5 + brightness);
}

function hsvToRgb(hue: number, saturation: number, value: number): [number, number, number] {
  const chroma = value * saturation;
  const sector = (((hue % 360) + 360) % 360) / 60;
  const x = chroma * (1 - Math.abs((sector % 2) - 1));
  let rgb: [number, number, number];
  if (sector < 1) rgb = [chroma, x, 0];
  else if (sector < 2) rgb = [x, chroma, 0];
  else if (sector < 3) rgb = [0, chroma, x];
  else if (sector < 4) rgb = [0, x, chroma];
  else if (sector < 5) rgb = [x, 0, chroma];
  else rgb = [chroma, 0, x];
  const match = value - chroma;
  return rgb.map(channel => Math.round((channel + match) * 255)) as [number, number, number];
}

function displayColor(candidate: ColorCandidate): [number, number, number] {
  const { hue } = candidate.metrics;
  let { value, saturation } = candidate.metrics;
  if (value < 0.28) value = 0.32;
  if (value > 0.9 && saturation < 0.15) value = 0.84;
  if (saturation > 0.88) saturation = 0.82;
  return hsvToRgb(hue, saturation, value);
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map(value => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0')).join('')}`;
}

/** Exact TypeScript port of Track Manager's Feature 10.3 hue-diverse cover palette contract. */
export function extractCoverPaletteFromPixels(data: Uint8ClampedArray): CoverPalette {
  const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
  const step = 24;
  for (let index = 0; index < data.length; index += 8) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max < 18 || (min > 242 && max - min < 8)) continue;
    const qr = Math.min(255, Math.round(r / step) * step);
    const qg = Math.min(255, Math.round(g / step) * step);
    const qb = Math.min(255, Math.round(b / step) * step);
    const key = `${qr},${qg},${qb}`;
    const bucket = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    bucket.count += 1;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }

  const candidates = [...buckets.values()].map(bucket => {
    const rgb: [number, number, number] = [
      Math.round(bucket.r / bucket.count),
      Math.round(bucket.g / bucket.count),
      Math.round(bucket.b / bucket.count),
    ];
    const candidate: ColorCandidate = { count: bucket.count, rgb, metrics: colorMetrics(rgb), score: 0 };
    candidate.score = candidateScore(candidate);
    return candidate;
  });
  const ranked = candidates.filter(candidate => candidate.score > 0).sort((left, right) => right.score - left.score);
  const fallbackPrimary: ColorCandidate = { count: 1, rgb: [29, 185, 84], metrics: colorMetrics([29, 185, 84]), score: 1 };
  const fallbackSecondary: ColorCandidate = { count: 1, rgb: [85, 107, 255], metrics: colorMetrics([85, 107, 255]), score: 1 };
  const primary = ranked[0] || fallbackPrimary;
  const secondary = ranked
    .filter(candidate => candidate !== primary
      && candidate.metrics.saturation >= 0.22
      && hueDistance(primary.metrics.hue, candidate.metrics.hue) >= 42
      && colorDistance(primary.rgb, candidate.rgb) > 2200)
    .sort((left, right) => {
      const leftDiversity = 1 + (hueDistance(primary.metrics.hue, left.metrics.hue) / 180) * 0.55;
      const rightDiversity = 1 + (hueDistance(primary.metrics.hue, right.metrics.hue) / 180) * 0.55;
      return right.score * rightDiversity - left.score * leftDiversity;
    })[0]
    || ranked.find(candidate => candidate !== primary && colorDistance(primary.rgb, candidate.rgb) > 1600)
    || fallbackSecondary;

  return { accent: toHex(displayColor(primary)), accent2: toHex(displayColor(secondary)) };
}

async function loadImageSource(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof globalThis.createImageBitmap === 'function') return globalThis.createImageBitmap(blob);
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The selected cover could not be decoded.')); };
    image.src = url;
  });
}

export async function extractCoverPalette(blob: Blob): Promise<CoverPalette> {
  const source = await loadImageSource(blob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
    if (!context) throw new Error('Canvas color extraction is unavailable.');
    context.drawImage(source, 0, 0, 96, 96);
    return extractCoverPaletteFromPixels(context.getImageData(0, 0, 96, 96).data);
  } finally {
    if ('close' in source && typeof source.close === 'function') source.close();
  }
}

export async function createCoverThumbnail(cover: Blob): Promise<File> {
  const source = await loadImageSource(cover);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas thumbnail generation is unavailable.');
    const width = source.width;
    const height = source.height;
    const scale = Math.max(512 / width, 512 / height);
    const drawWidth = width * scale;
    const drawHeight = height * scale;
    context.drawImage(source, (512 - drawWidth) / 2, (512 - drawHeight) / 2, drawWidth, drawHeight);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Thumbnail generation failed.')), 'image/webp', 0.82));
    return new File([blob], 'thumbnail.webp', { type: 'image/webp' });
  } finally {
    if ('close' in source && typeof source.close === 'function') source.close();
  }
}
