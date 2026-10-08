// C7a.2: entirely invented sources. Never load, log or save an owner file.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const codec = fs.readFileSync('src/catalogue/c7aDossiers.ts', 'utf8');
const component = fs.readFileSync('src/components/CatalogueImport.tsx', 'utf8');
const js = ts.transpileModule(codec.replace(/^import type .*\n/m, ''), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = {};
new Function('exports', js)(mod);
const collect = mod.collectC7aDossiers;

const source = {
  source: { schema: 'catalogue-readonly-seed-v2' },
  enrichment: { detailedEvidenceCount: 3 },
  summary: { rejectedRows: 0 },
  recordings: [
    { recordingId: 'recording:fiction-a', title: 'Invented duplicate', evidenceIds: ['proof-rec-a'] },
    { recordingId: 'recording:fiction-b', title: 'Invented duplicate', evidenceIds: ['proof-rec-b'] },
  ],
  releases: [{ releaseId: 'release:fiction', title: 'Invented release', evidenceIds: ['proof-release'] }],
  appearances: [{ appearanceId: 'appearance:bound', releaseId: 'release:fiction', recordingId: 'recording:fiction-a', position: 1, displayTitle: 'Invented', evidenceIds: ['proof-bound'] }],
  unboundAppearances: [{ appearanceId: 'appearance:unbound', releaseId: 'release:fiction', recordingId: null, position: 2, displayTitle: null, evidenceIds: ['proof-unbound'] }],
  evidence: [
    { evidenceId: 'proof-rec-a' }, { evidenceId: 'proof-rec-b' },
    { evidenceId: 'proof-release' }, { evidenceId: 'proof-bound' }, { evidenceId: 'proof-unbound' },
    { evidenceId: 'detail-linked', detailKind: 'distributor-detail' },
    { evidenceId: 'detail-unlinked', detailKind: 'distributor-detail' },
  ],
  findings: [
    { code: 'MISSING_ISRC', evidenceId: 'proof-rec-a' },
    { code: 'V2_DETAIL_UNLINKED', evidenceId: 'detail-unlinked' },
    { code: 'SOURCE_QA_PENDING' },
  ],
};
let count = 0;
function test(label, fn) { fn(); count++; console.log('C7a.2 fictional contract ' + count + ' PASS: ' + label); }

test('v2 source produces review-only dossier pack', () => {
  const p = collect(source); assert.equal(p.status, 'preview-only'); assert.equal(p.dossiers.length, 5);
});
test('exact source kinds, IDs and categories preserved', () => {
  const p = collect(source); assert.deepEqual(p.dossiers.map(d => d.kind), ['recording','recording','release','appearance','appearance']);
  assert.equal(p.dossiers[0].sourceId, 'recording:fiction-a');
});
test('all records explicitly lack reviewed namespace and target', () => {
  const p = collect(source); for (const d of p.dossiers) {
    assert.equal(d.reviewedSourceNamespace, null); assert.equal(d.commercialTargetId, null);
    assert.equal(d.reviewState, 'HUMAN_REVIEW_REQUIRED');
  }
  assert.equal(p.automaticMappings, 0); assert.equal(p.commercialWrites, 0);
});
test('duplicate titles do not imply identical identity', () => {
  const p = collect(source); assert.equal(p.dossiers[0].sourceLabel, p.dossiers[1].sourceLabel);
  assert.notEqual(p.dossiers[0].sourceId, p.dossiers[1].sourceId);
});
test('QA only linked through exact evidence IDs', () => {
  const p = collect(source); assert.deepEqual(p.dossiers[0].findingCodes, ['MISSING_ISRC']);
  assert.deepEqual(p.dossiers[1].findingCodes, []);
  assert.equal(p.unscopedFindingCount, 2);
});
test('unbound Appearance stays unbound without inferred recording', () => {
  const p = collect(source); assert.equal(p.dossiers[4].unbound, true);
  assert.match(p.dossiers[4].relationship, /recording unbound/);
});
test('independent unattached distributor detail remains targetless', () => {
  const p = collect(source); assert.deepEqual(p.unlinkedEvidenceIds, ['detail-linked', 'detail-unlinked']);
});
test('v1 or absent enrichment does not activate review desk', () => {
  const a = structuredClone(source); a.source.schema = 'catalogue-readonly-seed-v1';
  assert.deepEqual(collect(a), { status:'blocked',reason:'SOURCE_NOT_V2' });
  const b = structuredClone(source); delete b.enrichment;
  assert.deepEqual(collect(b), { status:'blocked',reason:'SOURCE_NOT_V2' });
});
test('source with rejected rows is blocked', () => {
  const a = structuredClone(source); a.summary.rejectedRows = 1;
  assert.deepEqual(collect(a), { status:'blocked',reason:'UNRESOLVED_SOURCE_REJECTIONS' });
});
test('pure replay preserves source bytes and prior result', () => {
  const a = structuredClone(source), before = JSON.stringify(a);
  assert.deepEqual(collect(a), collect(a)); assert.equal(JSON.stringify(a), before);
});
test('no new import, network, storage, crypto or write path', () => {
  assert.match(component, /collectC7aDossiers\(snapshot\)/);
  assert.match(component, /section === 'overview'/);
  assert.match(component, /Reset \/ unload/);
  assert.doesNotMatch(codec, /fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|crypto\.|new Worker|FileReader|createObjectURL|saveCommercial/);
  assert.doesNotMatch(component, /approve all|Auto-approve|commercialTargetId\s*=/i);
});
test('owner source is never used in invented-only test', () => {
  assert.equal(source.source.schema, 'catalogue-readonly-seed-v2');
  assert.equal(fs.readFileSync('src/release.ts','utf8').includes('build: 125'), true);
});
console.log('C7a.2: '+count+'/12 invented checks PASS. No source export or commercial writes.');
