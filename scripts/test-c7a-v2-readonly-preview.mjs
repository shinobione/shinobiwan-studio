// C7a synthetic contract: pure parser-backed aggregate preflight, no real owner source.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const codec=fs.readFileSync('src/catalogue/c7aPreview.ts','utf8');
const component=fs.readFileSync('src/components/CatalogueImport.tsx','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const js=ts.transpileModule(codec.replace(/^import type .*\n/m,'').replace('export function previewC7a','function previewC7a'),{
  compilerOptions:{module:ts.ModuleKind.None,target:ts.ScriptTarget.ES2022}
}).outputText;
const {previewC7a}=new Function(js+'; return {previewC7a};')();
const fiction={
  source:{schema:'catalogue-readonly-seed-v2'},
  enrichment:{linkedEvidenceCount:2,unlinkedEvidenceCount:1,partialSections:3,omittedSections:1},
  summary:{rejectedRows:0},
  recordings:[{},{}],releases:[{}],appearances:[{},{}],unboundAppearances:[{}],
  evidence:[{},{},{}],
  findings:[{state:'pending-review'},{state:'pending-review'},{state:'human-reviewed'}],
};
let n=0;function test(name,fn){fn();n++;console.log('C7a invented preview: '+name+' PASS');}
test('accepted invented v2 preserves exact aggregate source counts',()=>{
  const result=previewC7a(fiction);
  assert.equal(result.status,'preview-only');
  assert.deepEqual([result.recordings,result.releases,result.appearances,result.unbound,result.evidence],[2,1,2,1,3]);
});
test('unlinked detail and pending QA are not silently approved',()=>{
  const p=previewC7a(fiction);
  assert.equal(p.unlinkedDetail,1);assert.equal(p.pendingQa,2);
  assert.equal(p.nextStep,'HUMAN_REVIEW_REQUIRED');
});
test('partial and omitted source coverage remains visible',()=>{
  const p=previewC7a(fiction);assert.equal(p.partialSections,3);assert.equal(p.omittedSections,1);
});
test('source-derived entities cannot imply new minted records or automatic bindings',()=>{
  const p=previewC7a(fiction);
  assert.equal(p.proposedAutomaticMappings,0);assert.equal(p.proposedCommercialWrites,0);
  assert.equal(p.unknownPlatformStatus,true);
});
test('v1 does not enter C7a preview',()=>{
  const x=structuredClone(fiction);x.source.schema='catalogue-readonly-seed-v1';
  assert.deepEqual(previewC7a(x),{status:'blocked',reason:'SOURCE_NOT_V2'});
});
test('no enrichment means blocked even if source schema is mislabeled',()=>{
  const x=structuredClone(fiction);delete x.enrichment;
  assert.deepEqual(previewC7a(x),{status:'blocked',reason:'SOURCE_NOT_V2'});
});
test('nonzero rejected rows cannot be used for migration preview',()=>{
  const x=structuredClone(fiction);x.summary.rejectedRows=1;
  assert.deepEqual(previewC7a(x),{status:'blocked',reason:'UNRESOLVED_SOURCE_REJECTIONS'});
});
test('preview is nonmutating across repeated and changed inputs',()=>{
  const input=structuredClone(fiction),prior=JSON.stringify(input);
  assert.deepEqual(previewC7a(input),previewC7a(input));
  assert.equal(JSON.stringify(input),prior);
});
test('UI uses existing accepted source session rather than second file picker or lab data',()=>{
  assert.match(component,/previewC7a\(snapshot\)/);
  assert.match(component,/c7a\?\.status === 'preview-only'/);
  assert.doesNotMatch(codec,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|Worker\s*\(|crypto\.|Blob\s*\(|URL\.createObjectURL/);
  assert.doesNotMatch(codec,/studioTrackId|studioTrackLink|createRelease|saveCommercial/);
});
test('runtime version stays Build125 until separately approved candidate',()=>{
  assert.equal(pkg.version,'0.19.47');
  assert.match(fs.readFileSync('src/release.ts','utf8'),/build: 125/);
});
console.log('C7a invented preview: '+n+' pure v2-only read-only gate checks PASS; no source files or commercial writes.');
