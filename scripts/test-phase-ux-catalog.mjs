import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const read = path => fs.readFileSync(path, 'utf8');
const create = read('src/components/TrackCreatePanel.tsx');
const assets = read('src/components/AssetsManager.tsx');
const preview = read('src/components/CoverPalettePreview.tsx');
const paletteSource = read('src/cover-palette.ts');
const adminApi = read('src/services/admin-api.ts');
const catalog = read('src/components/CatalogView.tsx');
const compiledPalette = ts.transpileModule(paletteSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const paletteModule = await import(`data:text/javascript;base64,${Buffer.from(compiledPalette).toString('base64')}`);
const { COVER_PALETTE_FIELDS, extractCoverPaletteFromPixels } = paletteModule;

assert.deepEqual(COVER_PALETTE_FIELDS, ['accent', 'accent2'], 'Studio must use the canonical Track Manager / LaunchPAD palette fields.');
for (const marker of ['canvas.width = 96', 'canvas.height = 96', 'const step = 24', 'index += 8', 'max < 18', 'min > 242', '>= 42', '> 2200', '[29, 185, 84]', '[85, 107, 255]']) {
  assert.ok(paletteSource.includes(marker), `Track Manager Feature 10.3 extraction contract is missing ${marker}.`);
}

const pixels = new Uint8ClampedArray(96 * 96 * 4);
for (let index = 0; index < pixels.length; index += 4) {
  const first = (index / 4) % 4 < 3;
  pixels[index] = first ? 224 : 25;
  pixels[index + 1] = first ? 38 : 88;
  pixels[index + 2] = first ? 68 : 220;
  pixels[index + 3] = 255;
}
const extracted = extractCoverPaletteFromPixels(pixels);
assert.match(extracted.accent, /^#[0-9a-f]{6}$/);
assert.match(extracted.accent2, /^#[0-9a-f]{6}$/);
assert.notEqual(extracted.accent, extracted.accent2, 'A valid diverse cover must produce two distinct colors.');

for (const field of ['accent', 'accent2']) {
  assert.ok(preview.includes(`palette[field]`), `Both canonical colors must be visibly rendered (${field}).`);
  assert.ok(adminApi.includes(`| '${field}'`), `Metadata save contract must whitelist ${field}.`);
}
assert.ok(preview.includes('cover-palette-swatch'));
assert.ok(preview.includes('<code>{palette[field]}</code>'), 'Actual color values must be visible beside the swatches.');
assert.ok(create.includes('extractCoverPalette(cover)'), 'New Track cover selection must automatically calculate a palette preview.');
assert.ok(create.includes('Recalculate palette') || preview.includes("actionLabel = 'Recalculate palette'"));
assert.ok(create.includes('...(palette ? { accent: palette.accent, accent2: palette.accent2 } : {})'), 'New Track must persist the preview through canonical manifest fields.');

const coverSelection = assets.slice(assets.indexOf("if (def.kind === 'cover')"), assets.indexOf("setResult(null)", assets.indexOf("if (def.kind === 'cover')")));
assert.ok(coverSelection.includes('setPalettePreview(null)'));
assert.ok(!coverSelection.includes('saveAdminTrackMetadata'), 'Selecting a replacement cover must not silently save a palette.');
assert.ok(assets.includes('async function recalculatePalette()'));
assert.ok(assets.includes('async function savePalette()'));
assert.ok(assets.includes('validateAdminTrackMetadata(track.id, revision, patch)'));
assert.ok(assets.includes('saveAdminTrackMetadata(track.id, revision, patch)'));

assert.ok(catalog.includes('>+ New Track</button>'), 'Catalog must expose one obvious New Track action.');
assert.ok(!catalog.includes('<TrackCreatePanel privateRead={privateRead} onCreated={loadCatalog} />'), 'The intake flow must not remain permanently expanded above the catalog.');
for (const step of ["['Files', 'Metadata', 'Review']", "step === 1", "step === 2", "step === 3"]) assert.ok(create.includes(step), `New Track progressive flow is missing ${step}.`);
for (const forbidden of ['/api/', 'fetch(']) assert.ok(!paletteSource.includes(forbidden), `Palette extraction must remain local and route-free: ${forbidden}.`);

console.log(`PHASE UX UX-2 guard passed: ${extracted.accent} + ${extracted.accent2}; canonical palette, progressive intake, visible swatches and explicit existing-track updates protected.`);
