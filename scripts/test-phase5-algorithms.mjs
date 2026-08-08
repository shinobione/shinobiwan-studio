import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync('src/catalog-intelligence.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const { cosineSimilarity, nearestTracks, clusterTracks } = await import(moduleUrl);

const vector = (first, second = 0) => [first, second, ...Array.from({ length: 510 }, () => 0)];
assert.equal(cosineSimilarity(vector(1), vector(1)), 1);
assert.equal(cosineSimilarity(vector(1), vector(-1)), -1);
assert.equal(cosineSimilarity(vector(1), vector(0, 1)), 0);

const entry = (trackId, values) => ({
  trackId,
  title: trackId,
  analysisId: `sta-${trackId.padEnd(8, 'x')}`,
  analyzedAt: '2026-08-08T00:00:00.000Z',
  sourceVersion: { kind: 'r2-etag', value: trackId, sizeBytes: 1 },
  currentSourceVersion: { kind: 'r2-etag', value: trackId, sizeBytes: 1 },
  outdated: false,
  embedding: { model: 'clap', dimension: 512, vector: values },
  semanticSummary: null,
  mastering: null,
  structure: null,
});

const tracks = [entry('alpha', vector(1)), entry('alpha-near', vector(.99, .01)), entry('beta', vector(0, 1)), entry('beta-near', vector(.01, .99))];
assert.equal(nearestTracks(tracks[0], tracks)[0].entry.trackId, 'alpha-near');
const first = clusterTracks(tracks).map(cluster => cluster.entries.map(item => item.trackId));
const second = clusterTracks([...tracks].reverse()).map(cluster => cluster.entries.map(item => item.trackId));
assert.deepEqual(first, second, 'Cluster membership must be deterministic regardless of API order.');
assert.equal(first.flat().length, tracks.length);

console.log('Phase 5 catalog intelligence algorithms passed cosine, nearest-neighbor and deterministic-cluster checks.');
