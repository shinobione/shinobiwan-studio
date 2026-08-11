import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync('src/catalog-intelligence.ts', 'utf8');
const ui = fs.readFileSync('src/components/CatalogIntelligenceView.tsx', 'utf8');
const clarityCss = fs.readFileSync('src/c3-b-map-clarity.css', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const {
  analyzeCatalog,
  analyzeProject,
  analyzeStyleFamilies,
  catalogInsights,
  clusterAcousticZones,
  cosineSimilarity,
  nearestTracks,
  projectTracks,
  validEmbedding,
} = await import(moduleUrl);

const vector = (a, b = 0, c = 0) => [a, b, c, ...Array.from({ length: 509 }, () => 0)];
const ranked = (label, score) => ({ label, score });
const entry = (trackId, values, genre, mood = 'Focused') => ({
  trackId,
  title: trackId,
  analysisId: `sta-${trackId.padEnd(8, 'x')}`,
  analyzedAt: '2026-08-11T00:00:00.000Z',
  sourceVersion: { kind: 'r2-etag', value: trackId, sizeBytes: 1 },
  currentSourceVersion: { kind: 'r2-etag', value: trackId, sizeBytes: 1 },
  outdated: false,
  embedding: { model: 'clap', dimension: 512, vector: values },
  semanticSummary: {
    topGenres: [ranked(genre, .9)],
    topMoods: [ranked(mood, .8)],
    topInstruments: [],
    traits: { energy: { score: .55 } },
  },
  mastering: null,
  structure: null,
});

const entries = [
  entry('alpha', vector(1, 0), 'Hip-Hop'),
  entry('alpha-near', vector(.995, .04), 'Trap'),
  entry('beta', vector(.08, .99), 'Electronic'),
  entry('beta-near', vector(.12, .985), 'House'),
  entry('bridge', vector(.72, .69), 'Pop'),
  entry('far', vector(-.9, -.1, .4), 'Rock'),
];

assert.equal(cosineSimilarity(vector(1), vector(1)), 1);
assert.equal(validEmbedding(entries[0].embedding), true);
assert.equal(validEmbedding({ model: 'bad', dimension: 512, vector: [...vector(1).slice(0, 511), Number.NaN] }), false);
assert.equal(nearestTracks(entries[0], entries)[0].entry.trackId, 'alpha-near');

const projectionA = projectTracks(entries);
const projectionB = projectTracks([...entries].reverse());
assert.deepEqual(projectionA, projectionB, '2D projection must be deterministic regardless of API order.');
assert.equal(projectionA.length, entries.length);
assert.ok(projectionA.every(point => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1));

const zonesA = clusterAcousticZones(entries, projectionA);
const zonesB = clusterAcousticZones([...entries].reverse(), projectionB);
assert.deepEqual(zonesA, zonesB, 'Acoustic-zone identity must be deterministic regardless of API order.');
assert.ok(zonesA.count >= 2);
assert.ok(zonesA.groups.every(group => group.label.startsWith('Zone acoustique ')));

const families = analyzeStyleFamilies(entries);
assert.ok(families.groups.some(group => group.id === 'hip-hop-trap'));
assert.ok(families.groups.some(group => group.id === 'electronic'));
assert.notEqual(families.count, zonesA.count, 'Neural style families must not be aliases for acoustic K-means zones.');

const insights = catalogInsights(entries, zonesA);
assert.ok(insights.redundantPairs.some(pair => pair.a === 'alpha' && pair.b === 'alpha-near'));
assert.ok(Array.isArray(insights.outliers));
assert.ok(Array.isArray(insights.bridges));

const catalog = analyzeCatalog(entries);
assert.deepEqual(catalog.projection, projectionA);
assert.deepEqual(catalog.zones, zonesA);
assert.deepEqual(catalog.styleFamilies, families);

const canonicalTrackIds = ['alpha', 'bridge', 'beta', 'alpha-near', 'beta-near'];
const originalTrackIds = [...canonicalTrackIds];
const metadata = canonicalTrackIds.map((id, index) => ({ id, bpm: 96 + index * 7, key: index % 2 ? 'A Minor' : 'C Major', energy: String(.35 + index * .12) }));
const project = analyzeProject(canonicalTrackIds, entries, metadata);
assert.deepEqual(canonicalTrackIds, originalTrackIds, 'Project analysis must never mutate canonical album.trackIds.');
assert.equal(project.totalTracks, canonicalTrackIds.length);
assert.equal(project.embeddingTracks, canonicalTrackIds.length);
assert.equal(project.coveragePercent, 100);
assert.ok(Number.isFinite(project.coherencePercent));
assert.equal(project.proposedSequence.length, canonicalTrackIds.length);
assert.deepEqual(new Set(project.proposedSequence.map(item => item.trackId)), new Set(canonicalTrackIds));
assert.ok(project.proposedSequence.every(item => item.originalIndex === canonicalTrackIds.indexOf(item.trackId)));

for (const required of [
  'HIDDEN FROM MAP',
  'Not shown on map',
  'Missing or invalid 512D embedding',
  'Show only map-ready tracks',
  '512D missing',
  '512D embedding unavailable',
  'not plotted and cannot be compared by proximity',
  'mapped · {unmappedEntries.length} hidden',
]) assert.ok(ui.includes(required), `C3-B map clarity UI missing ${required}.`);
assert.ok(ui.includes('const unmappedEntries = useMemo'), 'C3-B must derive unmapped analyses from validEmbedding truthfully.');
assert.ok(ui.includes('showMapReadyOnly && !validEmbedding(entry.embedding)'), 'Map-ready filter must use the same canonical embedding validator.');
assert.ok(clarityCss.includes('.c3b-unmapped') && clarityCss.includes('.c3b-map-ready-toggle'), 'C3-B map clarity styles must remain loaded.');

console.log('C3-B V2-E parity passed deterministic projection, acoustic zones, Neural families, catalog insights, read-only project sequencing, and explicit map coverage truthfulness checks.');