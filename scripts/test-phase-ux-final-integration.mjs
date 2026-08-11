import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const read = path => fs.readFileSync(path, 'utf8');
const profileSource = read('src/sonictrace-profile.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const workspace = read('src/components/TrackWorkspace.tsx');
const html = read('index.html');

const compiled = ts.transpileModule(profileSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const profile = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const measuredMastering = {
  loudness: { integrated_lufs: -12.4, true_peak_dbtp: -0.8, provenance: 'measured-loudnorm-json' },
  levels: { mean_volume_db: -15.1, max_volume_db: -0.8, provenance: 'measured' },
};
const embedding512 = { model: 'clap', dimension: 512, vector: Array(512).fill(0) };
const base = { dsp: {}, mastering: measuredMastering, neural: {}, embedding: embedding512, structure: {}, provenance: {} };

assert.equal(profile.sonicTraceProfileState(base, false), 'full');
assert.equal(profile.sonicTraceProfileState({ ...base, neural: null }, false), 'partial');
assert.equal(profile.sonicTraceProfileState({
  ...base,
  mastering: { ...measuredMastering, loudness: { integrated_lufs: null, true_peak_dbtp: null, provenance: 'unavailable' } },
}, false), 'partial');
assert.equal(profile.sonicTraceProfileState({ dsp: {}, mastering: null, neural: null, embedding: null, structure: null, provenance: { deepAudio: 'unavailable' } }, false), 'unavailable');
assert.equal(profile.sonicTraceProfileState(base, true), 'outdated');
assert.equal(profile.sonicTraceProfileState(null, false), null);
assert.deepEqual(profile.sonicTraceMissingLayers({ ...base, mastering: null }), ['mastering']);

for (const marker of ['FULL', 'PARTIAL', 'UNAVAILABLE', 'OUTDATED']) assert.ok(profileSource.includes(marker), `SonicTrace profile contract is missing ${marker}.`);
for (const marker of ['sonicTraceProfileState', 'Missing or unavailable deep layers', 'sonic-profile-badge']) assert.ok(panel.includes(marker), `SonicTrace profile presentation is missing ${marker}.`);
for (const marker of ['observedAudioDuration', 'onLoadedMetadata', 'Measured from canonical audio', 'manifest']) {
  assert.ok(workspace.includes(marker), `Observed duration fallback is missing ${marker}.`);
}
assert.ok(html.includes('/shinobiwan-studio/favicon.svg'));
assert.ok(fs.existsSync('public/favicon.svg'));

console.log('PHASE UX final integration guard passed: favicon, observed canonical-audio duration and FULL/PARTIAL/UNAVAILABLE/OUTDATED profiles protected.');
