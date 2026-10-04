// A2.4-C / C5 — test-only migration plan. Invented v2 input & owner attestations ONLY.
// No src/ runtime import of this script, files written, network, crypto export, owner data or authority mutation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { fixture, recount } from './catalogue-synthetic.mjs';

const read = path => fs.readFileSync(path, 'utf8');
function load(path, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(read(path), {
    fileName:path, compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
  }).outputText;
  vm.runInNewContext(code,{exports,TextEncoder,require:name=>{
    assert.ok(name in dependencies,'Unexpected C5 dependency: '+name);
    return dependencies[name];
  }});
  return exports;
}
const legacy=load('src/catalogue/import.ts');
const {parseCatalogueInput}=load('src/catalogue/import-v2.ts',{'./import':legacy});
const hash = v => createHash('sha256').update(v).digest('hex');
const parse = root => {
  const raw=JSON.stringify(root);
  return parseCatalogueInput(raw,hash(raw));
};
const clone = x => structuredClone(x);
const aliasKey = a => JSON.stringify([a.namespace,a.kind,a.sourceId]);
const halt=(code,extra={})=>({status:'HOLD',code,writes:0,deletions:0,automaticApprovals:0,...extra});
const exact=(row,fields)=>row!==null&&typeof row==='object'&&!Array.isArray(row)&&
  JSON.stringify(Object.keys(row))===JSON.stringify(fields);
const keys = ['kind','namespace','sourceId','targetId','sourceReleaseId','position','sourceRecordingId'];
const validText = s => typeof s==='string'&&s.length>0&&s.length<=160&&!/[\x00-\x1f]/.test(s);
const positiveOrNull=x=>x===null||(Number.isSafeInteger(x)&&x>0);
function fictionalV2(){
  const base=fixture();
  base.sourceSheets['2 fiches Amuse vérifiées']=1;
  return {
    ...base,schemaVersion:'catalogue-readonly-seed-v2',privateOnly:true,
    exporterContractVersion:'a24b2-local-0.1.0',sourceMethodEvidence:null,
    detailedCount:1,detailedDistributorEvidence:[{
      evidenceId:'imaginary-detail-A',sourceNamespace:'Amuse',sourceRecordAlias:'imaginary-evidence-row-A',
      sourceRecordAliasScope:'workbook-snapshot-only',sourceLocator:'imagined-ledger/detail-A',
      sourceReleaseId:'release-1',releaseId:'amuse:release-1',appearanceId:'app-1',position:1,
      linkStatus:'linked',linkProof:'EXACT_SOURCE_RELEASE_AND_POSITION',linkIssueCode:null,
      displayTitle:base.appearances[0].displayTitle,isrcObserved:base.appearances[0].isrcObserved,
      originalEvidence:{'Invented note':'Completely imaginary observation'},fileNote:'Fictional historic sheet',
      statusText:'Historic only',storeSyncText:'Unknown',timecodeVideo:null,upcObserved:null,
      evidenceFindingCodes:[],
    }],
    sectionCoverage:[
      ...Object.entries(base.sourceSheets).map(([section,sourceRows])=>({
        section,sourceRows,
        status:section==='2 fiches Amuse vérifiées'?'represented':'partial',
        bodyPreservation:section==='2 fiches Amuse vérifiées'?'detailed-evidence':'normalized-or-counted-only',
        countMatchesArchivedV1:true,
      })),
      {section:'Invented methods',sourceRows:0,status:'omitted',
        bodyPreservation:'not-copied',countMatchesArchivedV1:null},
      {section:'Invented dashboard',sourceRows:0,status:'omitted',
        bodyPreservation:'not-copied',countMatchesArchivedV1:null},
    ],
    coverageCounts:{
      appearanceRows:base.appearances.length,countedSectionsInV1:8,
      independentDetailedEvidenceRows:1,
      normalizedRecordsV1:['recordings','releases','appearances','unverifiedAmuseCandidates','soundcloudRecent','qa']
        .reduce((sum,k)=>sum+base[k].length,0),
      originalSections:10,totalRowsEightCountedSheets:Object.values(base.sourceSheets).reduce((a,b)=>a+b,0),
    },
  };
}
function anotherDetail(root) {
  const a=clone(root.detailedDistributorEvidence[0]);
  a.evidenceId='imaginary-detail-B';a.sourceRecordAlias='imaginary-evidence-row-B';
  a.sourceLocator='imagined-ledger/detail-B';
  root.detailedDistributorEvidence.push(a);
  root.detailedCount++;root.coverageCounts.independentDetailedEvidenceRows++;
  root.sourceSheets['2 fiches Amuse vérifiées']++;
  root.coverageCounts.totalRowsEightCountedSheets++;
  root.sectionCoverage.find(x=>x.section==='2 fiches Amuse vérifiées').sourceRows++;
}
function sourceItems(root) {
  const relIndex=new Map(root.releases.map(r=>[r.id,r]));
  return [
    ...root.recordings.map(r=>({kind:'recording',namespace:r.provenance.sheet,sourceId:r.id,
      sourceReleaseId:null,position:null,sourceRecordingId:null})),
    ...root.releases.map(r=>({kind:'release',namespace:r.source,sourceId:r.sourceId,
      sourceReleaseId:null,position:null,sourceRecordingId:null})),
    ...root.appearances.map(a=>{
      const rel=relIndex.get(a.releaseId);
      if(!rel) return null;
      return {kind:'appearance',namespace:rel.source,sourceId:a.id,
        sourceReleaseId:rel.sourceId,position:a.position,sourceRecordingId:a.recordingId};
    }),
  ];
}
function newPrior() {
  return {registryId:'fictional-registry-with-owner-chosen-identity',
    revision:0,seenSources:[],aliases:[]};
}
function reviewFor(root,parsed,prior=newPrior()) {
  const items=sourceItems(root);
  return {
    registryId:prior.registryId,expectedRevision:prior.revision,
    expectedFingerprint:hash(JSON.stringify(prior)),
    sourceInputSha256:parsed.snapshot.source.inputSha256,
    reviewer:'imaginary-human-reviewer',
    authorization:'EXACT_SOURCE_ALIAS_AND_POSITION_REVIEW',
    acknowledgedCoverage:true,
    mappings:items.map(({kind,namespace,sourceId,sourceReleaseId,position,sourceRecordingId},i)=>({
      kind,namespace,sourceId,
      targetId:kind==='recording'?'invented-reviewed-commercial-rec-'+(i+1):
        kind==='release'?'invented-reviewed-commercial-rel-'+(i+1):
        'invented-reviewed-commercial-app-'+(i+1),
      sourceReleaseId,position,sourceRecordingId,
    })),
  };
}
function previewMigration(root,parsed,review,prior,readCurrent=()=>prior) {
  if(parsed.status!=='accepted')return halt('SOURCE_REJECTED');
  if(parsed.snapshot.source.schema!=='catalogue-readonly-seed-v2')return halt('REQUIRES_EXPLICIT_V2_SOURCE');
  if(root.schemaVersion!=='catalogue-readonly-seed-v2'||
      !Array.isArray(root.sectionCoverage)||!Array.isArray(root.detailedDistributorEvidence))
    return halt('UNSUPPORTED_SOURCE');
  if(!review||!exact(review,['registryId','expectedRevision','expectedFingerprint','sourceInputSha256',
      'reviewer','authorization','acknowledgedCoverage','mappings'])||
      !validText(review.reviewer)||review.authorization!=='EXACT_SOURCE_ALIAS_AND_POSITION_REVIEW'||
      !Array.isArray(review.mappings)||review.acknowledgedCoverage!==true)
    return halt('REVIEW_NOT_APPROVED');
  const latest=readCurrent();
  if(review.registryId!==prior.registryId||review.registryId!==latest.registryId)
    return halt('FOREIGN_REGISTRY');
  if(prior.revision!==review.expectedRevision||
      review.expectedFingerprint!==hash(JSON.stringify(prior))||
      latest.revision!==review.expectedRevision||
      hash(JSON.stringify(latest))!==review.expectedFingerprint)
    return halt('STALE_OR_CHANGED_REGISTRY');
  if(review.sourceInputSha256!==parsed.snapshot.source.inputSha256||
      hash(JSON.stringify(root))!==review.sourceInputSha256)
    return halt('STALE_SOURCE_AFTER_REVIEW');
  const items=sourceItems(root);
  if(items.some(x=>x===null))return halt('INVALID_SOURCE_RELEASE');
  // The already accepted reader snapshot is authoritative for structural counts and links only.
  if(parsed.snapshot.recordings.length!==root.recordings.length||
      parsed.snapshot.releases.length!==root.releases.length||
      parsed.snapshot.appearances.length+parsed.snapshot.unboundAppearances.length!==root.appearances.length)
    return halt('SOURCE_VIEW_MISMATCH');
  if(review.mappings.length!==items.length)return halt('INCOMPLETE_EXACT_REVIEW');
  const sourceById=new Map();
  for(const item of items) {
    const identity=aliasKey(item);
    if(sourceById.has(identity))return halt('DUPLICATE_SOURCE_ALIAS');
    sourceById.set(identity,item);
  }
  const reviewed=new Map(),targetIds=new Set();
  for(const map of review.mappings){
    if(!exact(map,keys)||!['recording','release','appearance'].includes(map.kind)||
        !validText(map.namespace)||!validText(map.sourceId)||!validText(map.targetId)||
        !positiveOrNull(map.position))return halt('INVALID_REVIEW_MAPPING');
    const identity=aliasKey(map),item=sourceById.get(identity);
    if(!item || reviewed.has(identity))return halt('UNKNOWN_OR_DUPLICATE_MAPPING');
    if(targetIds.has(map.targetId))return halt('DUPLICATE_REVIEWED_TARGET');
    for(const prop of ['kind','namespace','sourceId','sourceReleaseId','position','sourceRecordingId'])
      if(map[prop]!==item[prop])return halt('EXACT_EDGE_NOT_REVIEWED');
    reviewed.set(identity,map);targetIds.add(map.targetId);
  }
  for(const identity of sourceById.keys())if(!reviewed.has(identity))return halt('INCOMPLETE_EXACT_REVIEW');
  const oldAliases=new Map(prior.aliases.map(a=>[aliasKey(a),a]));
  if(oldAliases.size!==prior.aliases.length)return halt('CORRUPT_PRIOR_ALIASES');
  let unchanged=0,changedSource=0,proposedNew=0;
  for(const [identity,map] of reviewed){
    const old=oldAliases.get(identity);
    if(!old){proposedNew++;continue;}
    if(old.targetId!==map.targetId)return halt('EXISTING_ALIAS_TARGET_CONFLICT');
    if(old.snapshotSha===review.sourceInputSha256)unchanged++;else changedSource++;
  }
  let missing=0;
  for(const identity of oldAliases.keys())if(!reviewed.has(identity))missing++;
  const linked=parsed.snapshot.enrichment?.linkedEvidenceCount??0;
  const unlinked=parsed.snapshot.enrichment?.unlinkedEvidenceCount??0;
  const coverage=clone(root.sectionCoverage);
  const counts={
    recordings:root.recordings.length,releases:root.releases.length,
    appearances:root.appearances.length,
    unbound:root.appearances.filter(a=>a.recordingId===null).length,
    detailedEvidence:root.detailedDistributorEvidence.length,linked,unlinked,
    pendingQA:parsed.snapshot.findings.length,
    partial:coverage.filter(c=>c.status==='partial').length,
    omitted:coverage.filter(c=>c.status==='omitted').length,
  };
  if(unlinked>0)return halt('C4_UNLINKED_EVIDENCE_SCHEMA_GAP',{counts});
  if(coverage.some(c=>['contradictory','unverified'].includes(c.status)))
    return halt('EXPLICIT_COVERAGE_REVIEW_REQUIRED',{counts});
  // No proof of workbook bytes and no live-channel verification follows from exporter source claim.
  if(prior.seenSources.includes(review.sourceInputSha256))
    return {status:'ALREADY_REVIEWED_SOURCE',writes:0,deletions:0,automaticApprovals:0,
      counts,proposedNew:0,changedSource:0,missingFromCurrentSnapshot:0};
  return {
    status:'REQUIRES_FINAL_OWNER_APPROVAL',writes:0,deletions:0,automaticApprovals:0,
    sourceInputSha256:review.sourceInputSha256,
    workbookDigestAuthority:'claim-only',
    registryId:prior.registryId,expectedRevision:prior.revision,
    proposedNextRevision:prior.revision+1,
    counts,coverage,
    aliases:review.mappings.map(m=>({...m,snapshotSha:review.sourceInputSha256}))
      .sort((a,b)=>aliasKey(a).localeCompare(aliasKey(b),'en')),
    diff:{unchanged,changedSource,proposedNew,missingFromCurrentSnapshot:missing},
    currentChannelVerifiedLive:0,
    // Review of this plan is NOT a commercial write or source/QA approval.
    pendingReviewRequired:true,
  };
}
let cases=0;
const test=(name,run)=>{
  run();cases++;console.log('A2.4-C/A fictional C5: '+name+' PASS');
};
const input=fictionalV2(),parsed=parse(input),prior=newPrior();
assert.equal(parsed.status,'accepted');
const reviewed=reviewFor(input,parsed,prior);
const run=(root=input,packet=reviewed,p=prior,result=parsed)=>previewMigration(root,result,packet,p);
test('uses the real accepted source-v2 adapter on an independent invented fixture',()=>{
  assert.equal(parsed.snapshot.source.schema,'catalogue-readonly-seed-v2');
  assert.equal(parsed.snapshot.enrichment.linkedEvidenceCount,1);
  assert.equal(parsed.snapshot.enrichment.unlinkedEvidenceCount,0);
  assert.equal(parsed.snapshot.source.inputSha256,hash(JSON.stringify(input)));
});
test('a complete exact owner review only creates a zero-write migration proposal',()=>{
  const r=run();
  assert.equal(r.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.deepEqual(r.diff,{unchanged:0,changedSource:0,proposedNew:3,missingFromCurrentSnapshot:0});
  assert.deepEqual([r.counts.recordings,r.counts.releases,r.counts.appearances,r.counts.detailedEvidence],
    [1,1,1,1]);
  assert.equal(r.writes,0);assert.equal(r.deletions,0);assert.equal(r.automaticApprovals,0);
});
test('manual review row order does not change exact alias identity or mutate previous state',()=>{
  const sourceBefore=clone(input),priorBefore=clone(prior);
  const reordered=clone(reviewed);reordered.mappings.reverse();
  const expected=run(),actual=run(input,reordered);
  assert.equal(actual.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.deepEqual(actual.aliases,expected.aliases);
  assert.deepEqual(actual.diff,expected.diff);
  assert.deepEqual(input,sourceBefore);
  assert.deepEqual(prior,priorBefore);
});
test('source workbook digest remains claim-only and partial/omitted coverage is retained',()=>{
  const r=run();assert.equal(r.workbookDigestAuthority,'claim-only');
  assert.equal(r.coverage.length,10);
  assert.equal(r.counts.partial,7);assert.equal(r.counts.omitted,2);
  assert.equal(r.pendingReviewRequired,true);
});
test('v1-only source never silently becomes a C4 commercial registry',()=>{
  const legacyInput=fixture(),result=parse(legacyInput);
  assert.equal(result.status,'accepted');
  assert.equal(previewMigration(legacyInput,result,reviewed,prior).code,'REQUIRES_EXPLICIT_V2_SOURCE');
});
test('missing, duplicated and unsupported human review packets hold before any proposed write',()=>{
  assert.equal(run(input,null).code,'REVIEW_NOT_APPROVED');
  let r=clone(reviewed);r.authorization='AUTO_BY_ISRC';
  assert.equal(run(input,r).code,'REVIEW_NOT_APPROVED');
  r=clone(reviewed);r.mappings.pop();
  assert.equal(run(input,r).code,'INCOMPLETE_EXACT_REVIEW');
  r=clone(reviewed);r.mappings.push(clone(r.mappings[0]));
  assert.equal(run(input,r).code,'UNKNOWN_OR_DUPLICATE_MAPPING');
});
test('alias kind/namespace/source ID must be attested exactly, never inferred from titles',()=>{
  for(const change of [
    m=>m.namespace='Another invented source',m=>m.sourceId='wrong-alias',
    m=>m.kind='release',
  ]){
    const r=clone(reviewed);change(r.mappings[0]);
    assert.equal(run(input,r).code,'UNKNOWN_OR_DUPLICATE_MAPPING');
  }
});
test('appearance position, source Release and optional Recording each require exact review',()=>{
  for(const [field,value] of [
    ['position',2],['sourceReleaseId','wrong-release'],['sourceRecordingId',null],
  ]){
    const r=clone(reviewed);
    r.mappings.find(m=>m.kind==='appearance')[field]=value;
    assert.equal(run(input,r).code,'EXACT_EDGE_NOT_REVIEWED');
  }
});
test('multiple source identities cannot silently collapse into one commercial target',()=>{
  const r=clone(reviewed);
  r.mappings.find(m=>m.kind==='appearance').targetId=r.mappings.find(m=>m.kind==='recording').targetId;
  assert.equal(run(input,r).code,'DUPLICATE_REVIEWED_TARGET');
  assert.equal(input.recordings[0].title,input.appearances[0].displayTitle);
});
test('explicitly unbound Appearance stays unbound without a title or ISRC-based match',()=>{
  const source=clone(input);source.appearances[0].recordingId=null;
  const result=parse(source);
  assert.equal(result.status,'accepted');
  const r=previewMigration(source,result,reviewFor(source,result),newPrior());
  assert.equal(r.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.equal(r.counts.unbound,1);
  assert.equal(r.aliases.find(m=>m.kind==='appearance').sourceRecordingId,null);
});
test('independent detailed evidence cannot create an extra recording or Appearance',()=>{
  const source=clone(input);anotherDetail(source);
  const result=parse(source);assert.equal(result.status,'accepted');
  const plan=previewMigration(source,result,reviewFor(source,result),newPrior());
  assert.equal(plan.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.deepEqual([plan.counts.recordings,plan.counts.releases,plan.counts.appearances,plan.counts.detailedEvidence],
    [1,1,1,2]);
});
test('title/ISRC contradictions remain pending QA rather than changing an exact appearance link',()=>{
  const source=clone(input);
  source.detailedDistributorEvidence[0].displayTitle='Contradictory imaginary title';
  source.detailedDistributorEvidence[0].isrcObserved='ZZAAA2600999';
  const result=parse(source);assert.equal(result.status,'accepted');
  const plan=previewMigration(source,result,reviewFor(source,result),newPrior());
  assert.equal(plan.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.equal(plan.counts.linked,1);
  assert.ok(plan.counts.pendingQA>run().counts.pendingQA);
});
test('structurally conflicting v2 detail fails in actual importer, never maps by position alone',()=>{
  const source=clone(input);source.detailedDistributorEvidence[0].position=2;
  const result=parse(source);assert.equal(result.status,'rejected');
  assert.equal(previewMigration(source,result,reviewed,prior).code,'SOURCE_REJECTED');
});
test('unlinked global detail is explicitly held: draft C4 target-only evidence cannot discard it',()=>{
  const source=clone(input);anotherDetail(source);
  const detail=source.detailedDistributorEvidence[1];
  detail.linkStatus='unlinked';detail.linkProof=null;detail.linkIssueCode='EXACT_TARGET_NOT_FOUND';
  detail.appearanceId=null;detail.releaseId=null;
  const result=parse(source);assert.equal(result.status,'accepted');
  const plan=previewMigration(source,result,reviewFor(source,result),newPrior());
  assert.equal(plan.status,'HOLD');assert.equal(plan.code,'C4_UNLINKED_EVIDENCE_SCHEMA_GAP');
  assert.equal(plan.counts.unlinked,1);
  assert.equal(plan.writes,0);
});
test('source digest mismatch after reviewed attestation invalidates the whole plan',()=>{
  const source=clone(input);source.recordings[0].title='Imaginary revised metadata';
  const result=parse(source);assert.equal(result.status,'accepted');
  assert.equal(previewMigration(source,result,reviewed,prior).code,'STALE_SOURCE_AFTER_REVIEW');
});
test('the wrong registry, revision and current fingerprint prevent stale migration',()=>{
  let r=clone(reviewed);r.registryId='foreign-imaginary-registry';
  assert.equal(run(input,r).code,'FOREIGN_REGISTRY');
  r=clone(reviewed);r.expectedRevision=8;
  assert.equal(run(input,r).code,'STALE_OR_CHANGED_REGISTRY');
  r=clone(reviewed);r.expectedFingerprint='old-fingerprint';
  assert.equal(run(input,r).code,'STALE_OR_CHANGED_REGISTRY');
  const newer=clone(prior);newer.revision=1;
  assert.equal(previewMigration(input,parsed,reviewed,prior,()=>newer).code,'STALE_OR_CHANGED_REGISTRY');
});
test('same exact previously reviewed source is idempotent without creating another registry revision',()=>{
  const p=clone(prior);p.seenSources.push(parsed.snapshot.source.inputSha256);
  const result=previewMigration(input,parsed,reviewFor(input,parsed,p),p);
  assert.equal(result.status,'ALREADY_REVIEWED_SOURCE');
  assert.equal(result.proposedNew,0);assert.equal(result.writes,0);
});
test('a later source revision reports changed-source, never overwrites historical evidence',()=>{
  const p=clone(prior);
  const old=run();
  p.revision=1;
  p.aliases=old.aliases.map(({kind,namespace,sourceId,targetId})=>({
    kind,namespace,sourceId,targetId,snapshotSha:parsed.snapshot.source.inputSha256,
  }));
  const newer=clone(input);newer.recordings[0].title='Newly invented revision';
  const result=parse(newer);assert.equal(result.status,'accepted');
  const reviewedNext=reviewFor(newer,result,p);
  for(const m of reviewedNext.mappings){
    const matching=p.aliases.find(a=>aliasKey(a)===aliasKey(m));
    m.targetId=matching.targetId;
  }
  const plan=previewMigration(newer,result,reviewedNext,p);
  assert.equal(plan.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.equal(plan.diff.changedSource,3);
  assert.equal(plan.diff.proposedNew,0);
  assert.equal(p.aliases[0].snapshotSha,parsed.snapshot.source.inputSha256);
  assert.equal(plan.writes,0);
});
test('previous aliases absent from a new snapshot are presented, never deleted',()=>{
  const p=clone(prior);
  p.aliases.push({kind:'appearance',namespace:'Amuse',sourceId:'imaginary-historical-appearance',
    targetId:'old-approved-durable-id',snapshotSha:'imagined-earlier-digest'});
  const result=previewMigration(input,parsed,reviewFor(input,parsed,p),p);
  assert.equal(result.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  assert.equal(result.diff.missingFromCurrentSnapshot,1);
  assert.equal(result.deletions,0);
});
test('previous explicit alias target cannot be silently reassigned',()=>{
  const p=clone(prior);
  p.aliases.push({kind:'release',namespace:'Amuse',sourceId:'release-1',
    targetId:'different-imaginary-reviewed-target',snapshotSha:'imaginary-old-digest'});
  const result=previewMigration(input,parsed,reviewFor(input,parsed,p),p);
  assert.equal(result.code,'EXISTING_ALIAS_TARGET_CONFLICT');
  assert.equal(result.writes,0);
});
test('candidate remains a transient proposal: no current channel-live claim or QA auto-approval',()=>{
  const r=run();
  assert.equal(r.currentChannelVerifiedLive,0);
  assert.equal(r.automaticApprovals,0);
  assert.ok(parsed.snapshot.findings.every(f=>f.state==='pending-review'));
  assert.equal(read('package.json').includes('"version": "0.19.46"'),true);
});
console.log('A2.4-C/A fictional C5: '+cases+
  ' exact source-v2/migration preview cases PASS. ZERO commercial minting, public export, disk write, runtime, network or owner data.');
