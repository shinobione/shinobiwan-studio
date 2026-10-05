// A2.4-C / C5b — end-to-end FICTIONAL source-v2 → reviewed plan → C4 registry → encrypted temp files → restore.
// Test-only. NO owner source, no runtime/src integration, no browser Storage/network, no production backup.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.A24C_LIBRARY_ONLY='1';
process.env.A24C_C5_LIBRARY_ONLY='1';
const c4 = await import('./test-a24c-c4-registry-recovery.mjs');
const c5 = await import('./test-a24c-c5-reviewed-migration.mjs');
delete process.env.A24C_LIBRARY_ONLY;
delete process.env.A24C_C5_LIBRARY_ONLY;

const {
  validateC4Registry, fingerprintC4Registry, sealC4Registry, openC4Registry, previewC4Comparison,
} = c4;
const {
  fictionalC5V2, addFictionalC5Detail, parseC5Source, newC5Prior, reviewC5Source,
  previewC5Migration, c5AliasKey,
} = c5;

const secret='C5b fictional recovery phrase only; never an owner secret.';
const wrongSecret='Completely different invented test phrase.';
const clone=x=>structuredClone(x);
const byKey=(plan,kind,namespace,sourceId)=>{
  const row=plan.aliases.find(a=>a.kind===kind&&a.namespace===namespace&&a.sourceId===sourceId);
  assert.ok(row,'Missing reviewed alias '+kind+'/'+namespace+'/'+sourceId);
  return row.targetId;
};
const slug=(s)=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'source';
const releaseKind=v=>{
  const x=String(v??'').toLowerCase();
  return x==='single'?'single':x==='ep'?'ep':x==='album'?'album':'unknown';
};

function buildSourceSnapshots(root,plan){
  const namespaces=new Set(['catalogue-v2-file']);
  for(const a of plan.aliases)namespaces.add(a.namespace);
  for(const e of root.detailedDistributorEvidence)namespaces.add(e.sourceNamespace);
  const ordered=[...namespaces].sort((a,b)=>a.localeCompare(b,'en'));
  const map=new Map();
  const coverage=root.sectionCoverage.some(s=>s.status!=='represented')?'partial':'complete';
  const rows=ordered.map((namespace,index)=>{
    const id='c5b-snapshot-'+String(index+1).padStart(2,'0')+'-'+slug(namespace);
    map.set(namespace,id);
    return {
      id,namespace,sourceRevision:'input-'+plan.sourceInputSha256.slice(0,24),
      sourceSchema:root.schemaVersion,exporterContractVersion:root.exporterContractVersion??null,
      snapshotDate:root.snapshotDate,sourceFile:root.sourceFile,
      inputSha256:plan.sourceInputSha256,claimedWorkbookSha256:root.sourceSha256,
      digestAuthority:'claim-only',coverage,
      sections:root.sectionCoverage.map(s=>({
        name:s.section,sourceRows:s.sourceRows,status:s.status,
        bodyPreservation:s.bodyPreservation,countMatchesArchivedV1:s.countMatchesArchivedV1,
      })),
    };
  });
  return {rows,map};
}

function materializeRegistry(root,parsed,plan){
  assert.equal(parsed.status,'accepted');
  assert.equal(plan.status,'REQUIRES_FINAL_OWNER_APPROVAL');
  const {rows:sourceSnapshots,map:snapshotByNamespace}=buildSourceSnapshots(root,plan);
  const globalSnapshot=snapshotByNamespace.get('catalogue-v2-file');
  assert.ok(globalSnapshot);

  const relSource=new Map(root.releases.map(r=>[r.id,r]));
  const recTarget=new Map(root.recordings.map(r=>[
    r.id,byKey(plan,'recording',r.provenance.sheet,r.id),
  ]));
  const relTarget=new Map(root.releases.map(r=>[
    r.id,byKey(plan,'release',r.source,r.sourceId),
  ]));
  const appTarget=new Map(root.appearances.map(a=>{
    const rel=relSource.get(a.releaseId);assert.ok(rel);
    return [a.id,byKey(plan,'appearance',rel.source,a.id)];
  }));

  const recordings=root.recordings.map(r=>({
    id:recTarget.get(r.id),title:r.title,version:null,isrc:r.isrc,
  }));
  const releases=root.releases.map(r=>({
    id:relTarget.get(r.id),title:r.title,kind:releaseKind(r.releaseType),upc:r.upc,
    distributor:r.source||null,source:r.source,
    historicalDistributionStatus:r.distributionStatus,referenceDate:r.referenceDate,
  }));
  const appearances=root.appearances.map(a=>({
    id:appTarget.get(a.id),releaseId:relTarget.get(a.releaseId),position:a.position,
    recordingId:a.recordingId===null?null:recTarget.get(a.recordingId),
    displayTitle:a.displayTitle,observedIsrc:a.isrcObserved,status:'unverified',
  }));

  const sourceAliases=plan.aliases.map(a=>({
    namespace:a.namespace,kind:a.kind,sourceId:a.sourceId,targetId:a.targetId,
    snapshotId:snapshotByNamespace.get(a.namespace),
  })).sort((a,b)=>c5AliasKey(a).localeCompare(c5AliasKey(b),'en'));
  assert.ok(sourceAliases.every(a=>a.snapshotId));

  const targetForEvidence=new Map();
  const bindEvidence=(ids,targetKind,targetId)=>{
    for(const evidenceId of ids??[]){
      const prior=targetForEvidence.get(evidenceId);
      if(prior)assert.deepEqual(prior,{targetKind,targetId},'Evidence '+evidenceId+' cannot target two entities');
      else targetForEvidence.set(evidenceId,{targetKind,targetId});
    }
  };
  const sourceIdFromParser=(kind,value)=>{
    const prefix=kind+':';
    assert.equal(typeof value,'string');
    assert.ok(value.startsWith(prefix),'Unexpected parser ID namespace: '+value);
    return value.slice(prefix.length);
  };
  for(const r of parsed.snapshot.recordings){
    const target=recTarget.get(sourceIdFromParser('recording',r.recordingId));assert.ok(target);
    bindEvidence(r.evidenceIds,'recording',target);
  }
  for(const r of parsed.snapshot.releases){
    const target=relTarget.get(sourceIdFromParser('release',r.releaseId));assert.ok(target);
    bindEvidence(r.evidenceIds,'release',target);
  }
  for(const a of [...parsed.snapshot.appearances,...parsed.snapshot.unboundAppearances]){
    const target=appTarget.get(sourceIdFromParser('appearance',a.appearanceId));assert.ok(target);
    bindEvidence(a.evidenceIds,'appearance',target);
  }

  const detailByEvidence=new Map(root.detailedDistributorEvidence.map(d=>['evidence:v2-detail:'+d.evidenceId,d]));
  const evidence=parsed.snapshot.evidence.map(e=>{
    const detail=detailByEvidence.get(e.evidenceId);
    if(detail){
      const snapshotId=snapshotByNamespace.get(detail.sourceNamespace);assert.ok(snapshotId);
      if(detail.linkStatus==='linked'){
        const targetId=appTarget.get(detail.appearanceId);assert.ok(targetId);
        return {
          id:e.evidenceId,snapshotId,kind:'distributor-detail',linkState:'linked',
          sourceRecordAlias:detail.sourceRecordAlias,sourceLocator:detail.sourceLocator,
          observedAt:e.observedAt,classification:e.classification??'source-observation',
          payload:JSON.stringify(detail.originalEvidence),
          targetKind:'appearance',targetId,sourceReleaseId:detail.sourceReleaseId,
          position:detail.position,linkIssueCode:null,
        };
      }
      assert.equal(detail.linkStatus,'unlinked');
      return {
        id:e.evidenceId,snapshotId,kind:'distributor-detail',linkState:'unlinked',
        sourceRecordAlias:detail.sourceRecordAlias,sourceLocator:detail.sourceLocator,
        observedAt:e.observedAt,classification:e.classification??'source-observation',
        payload:JSON.stringify(detail.originalEvidence),
        targetKind:null,targetId:null,sourceReleaseId:detail.sourceReleaseId,
        position:detail.position,linkIssueCode:detail.linkIssueCode,
      };
    }
    const target=targetForEvidence.get(e.evidenceId)??null;
    return {
      id:e.evidenceId,snapshotId:globalSnapshot,kind:'source-record',
      linkState:target?'linked':'unattached',sourceRecordAlias:'parser-'+e.evidenceId,
      sourceLocator:e.sourceLocator,observedAt:e.observedAt,
      classification:e.classification??'source-observation',payload:e.note,
      targetKind:target?.targetKind??null,targetId:target?.targetId??null,
      sourceReleaseId:null,position:null,linkIssueCode:null,
    };
  });
  const evidenceById=new Map(evidence.map(e=>[e.id,e]));

  const findings=parsed.snapshot.findings.map((f,index)=>{
    const id='c5b-finding-'+String(index+1).padStart(3,'0');
    const linked=f.evidenceId?evidenceById.get(f.evidenceId):null;
    if(linked?.linkState==='linked'){
      return {id,scope:'target',sourceSnapshotId:null,targetKind:linked.targetKind,
        targetId:linked.targetId,evidenceId:linked.id,code:f.code,locator:f.locator,status:'pending'};
    }
    if(linked){
      return {id,scope:'evidence',sourceSnapshotId:linked.snapshotId,targetKind:null,
        targetId:null,evidenceId:linked.id,code:f.code,locator:f.locator,status:'pending'};
    }
    return {id,scope:'source',sourceSnapshotId:globalSnapshot,targetKind:null,targetId:null,
      evidenceId:null,code:f.code,locator:f.locator,status:'pending'};
  });

  const findingEvidence=new Set(findings.filter(f=>f.evidenceId).map(f=>f.evidenceId));
  for(const e of evidence.filter(e=>e.linkState==='unlinked')){
    if(!findingEvidence.has(e.id)){
      findings.push({
        id:'c5b-unlinked-finding-'+String(findings.length+1),scope:'evidence',
        sourceSnapshotId:e.snapshotId,targetKind:null,targetId:null,evidenceId:e.id,
        code:e.linkIssueCode,locator:e.sourceLocator??e.sourceRecordAlias,status:'pending',
      });
      findingEvidence.add(e.id);
    }
  }

  return {
    schema:'shinocat-commercial-registry-v1',registryId:plan.registryId,
    revision:1,parentRevision:0,sourceSnapshots,recordings,releases,appearances,sourceAliases,
    evidence,findings,reviewDecisions:[],channelEvents:[],
    audit:[{operationId:'c5b-fictional-initial-migration',revision:1,parentRevision:0,
      kind:'reviewed-source-migration',targetId:plan.registryId}],
  };
}

function emptyRegistry(registryId){
  return {
    schema:'shinocat-commercial-registry-v1',registryId,revision:0,parentRevision:null,
    sourceSnapshots:[],recordings:[],releases:[],appearances:[],sourceAliases:[],
    evidence:[],findings:[],reviewDecisions:[],channelEvents:[],audit:[],
  };
}

const source=fictionalC5V2();
addFictionalC5Detail(source);
const unlinked=source.detailedDistributorEvidence[1];
unlinked.linkStatus='unlinked';unlinked.linkProof=null;unlinked.linkIssueCode='EXACT_TARGET_NOT_FOUND';
unlinked.appearanceId=null;unlinked.releaseId=null;
const parsed=parseC5Source(source);
assert.equal(parsed.status,'accepted');
const prior=newC5Prior();
const review=reviewC5Source(source,parsed,prior);
const plan=previewC5Migration(source,parsed,review,prior);
assert.equal(plan.status,'REQUIRES_FINAL_OWNER_APPROVAL');
const registry=materializeRegistry(source,parsed,plan);
const validated=validateC4Registry(registry);
assert.equal(validated.ok,true,'C5b materialized registry rejected: '+JSON.stringify(validated));

let cases=0;
async function test(name,fn){
  await fn();cases++;console.log('A2.4-C/A fictional C5b: '+name+' PASS');
}

await test('actual v2 parser plus reviewed C5 plan materializes one valid complete C4 revision',async()=>{
  assert.equal(registry.revision,1);assert.equal(registry.parentRevision,0);
  assert.equal(validated.count.recordings,source.recordings.length);
  assert.equal(validated.count.releases,source.releases.length);
  assert.equal(validated.count.appearances,source.appearances.length);
  assert.equal(registry.sourceAliases.length,plan.aliases.length);
  assert.equal(registry.channelEvents.length,0);
});
await test('selected input digest stays exact while claimed workbook digest remains claim-only',async()=>{
  assert.ok(registry.sourceSnapshots.length>=2);
  assert.ok(registry.sourceSnapshots.every(s=>s.inputSha256===parsed.snapshot.source.inputSha256));
  assert.ok(registry.sourceSnapshots.every(s=>s.claimedWorkbookSha256===source.sourceSha256));
  assert.ok(registry.sourceSnapshots.every(s=>s.digestAuthority==='claim-only'));
  assert.ok(registry.sourceSnapshots.every(s=>s.sections.length===source.sectionCoverage.length));
});
await test('linked detail remains exact and unlinked detail remains targetless pending evidence',async()=>{
  const linked=registry.evidence.find(e=>e.sourceRecordAlias==='imaginary-evidence-row-A');
  const loose=registry.evidence.find(e=>e.sourceRecordAlias==='imaginary-evidence-row-B');
  assert.ok(linked);assert.ok(loose);
  assert.equal(linked.linkState,'linked');assert.equal(linked.targetKind,'appearance');
  assert.equal(loose.linkState,'unlinked');assert.equal(loose.targetKind,null);assert.equal(loose.targetId,null);
  assert.ok(registry.findings.some(f=>f.evidenceId===loose.id&&f.scope==='evidence'&&f.status==='pending'));
  assert.equal(validated.count.recordings,1);assert.equal(validated.count.releases,1);assert.equal(validated.count.appearances,1);
});
await test('all parser findings remain pending and no current platform-live event is invented',async()=>{
  assert.ok(registry.findings.length>=parsed.snapshot.findings.length);
  assert.ok(registry.findings.every(f=>f.status==='pending'));
  assert.deepEqual(registry.reviewDecisions,[]);
  assert.deepEqual(registry.channelEvents,[]);
  assert.equal(registry.releases[0].historicalDistributionStatus,source.releases[0].distributionStatus);
});
await test('C5 reviewed target IDs rather than title or ISRC are the materialized identities',async()=>{
  const aliasTargets=new Set(plan.aliases.map(a=>a.targetId));
  for(const row of [...registry.recordings,...registry.releases,...registry.appearances])
    assert.ok(aliasTargets.has(row.id));
  assert.notEqual(registry.recordings[0].id,source.recordings[0].id);
  assert.notEqual(registry.releases[0].id,source.releases[0].id);
  assert.notEqual(registry.appearances[0].id,source.appearances[0].id);
});

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'a24c-c5b-fictional-'));
const primary=path.join(tmp,'fictional-commercial-registry-primary.scat');
const recovery=path.join(tmp,'fictional-commercial-registry-recovery.scat');
try {
  const sealedPrimary=await sealC4Registry(registry,secret);
  const sealedRecovery=await sealC4Registry(registry,secret);
  assert.equal(typeof sealedPrimary,'string');assert.equal(typeof sealedRecovery,'string');

  await test('two independently encrypted candidates use different ciphertext and outer randomness',async()=>{
    assert.notEqual(sealedPrimary,sealedRecovery);
    const a=JSON.parse(sealedPrimary),b=JSON.parse(sealedRecovery);
    assert.notEqual(a.header.salt,b.header.salt);assert.notEqual(a.header.nonce,b.header.nonce);
    assert.equal(sealedPrimary.includes(source.recordings[0].title),false);
    assert.equal(sealedPrimary.includes(unlinked.originalEvidence['Invented note']),false);
  });
  await test('actual disposable disk writes create two separate ciphertext files',async()=>{
    fs.writeFileSync(primary,sealedPrimary,{encoding:'utf8',flag:'wx'});
    fs.writeFileSync(recovery,sealedRecovery,{encoding:'utf8',flag:'wx'});
    const a=fs.statSync(primary),b=fs.statSync(recovery);
    assert.ok(a.isFile()&&b.isFile()&&a.size>100&&b.size>100);
    assert.notEqual(fs.readFileSync(primary,'utf8'),fs.readFileSync(recovery,'utf8'));
  });
  const primaryBytes=fs.readFileSync(primary,'utf8');
  const recoveryBytes=fs.readFileSync(recovery,'utf8');
  const reopenedPrimary=await openC4Registry(primaryBytes,secret);
  const reopenedRecovery=await openC4Registry(recoveryBytes,secret);

  await test('actual bytes reread from both disk files authenticate to the same C4 registry fingerprint',async()=>{
    assert.equal(reopenedPrimary.ok,true);assert.equal(reopenedRecovery.ok,true);
    assert.equal(reopenedPrimary.meta.fingerprint,validated.fingerprint);
    assert.equal(reopenedRecovery.meta.fingerprint,validated.fingerprint);
    assert.equal(JSON.stringify(reopenedPrimary.registry),JSON.stringify(registry));
    assert.equal(JSON.stringify(reopenedRecovery.registry),JSON.stringify(registry));
  });
  await test('revision-0 current state previews authenticated disk revision-1 as explicit review and never activation',async()=>{
    const current=emptyRegistry(registry.registryId);
    const expected={registryId:current.registryId,revision:0,fingerprint:fingerprintC4Registry(current)};
    const preview=previewC4Comparison(current,reopenedPrimary.registry,expected);
    assert.equal(preview.status,'requires-explicit-owner-review');
    assert.equal(preview.automaticActivation,false);assert.equal(preview.writes,0);
    assert.deepEqual(preview.entityDelta,{recordings:1,releases:1,appearances:1});
  });
  await test('same authenticated revision replay is idempotent and foreign registry is rejected',async()=>{
    const expected={registryId:registry.registryId,revision:1,fingerprint:validated.fingerprint};
    assert.equal(previewC4Comparison(registry,reopenedRecovery.registry,expected).status,'same-verified-revision');
    const foreign=clone(reopenedRecovery.registry);foreign.registryId='foreign-fictional-registry';
    assert.equal(previewC4Comparison(registry,foreign,expected).code,'FOREIGN_REGISTRY');
  });
  await test('authentic older revision is rollback-blocked once revision-1 is current',async()=>{
    const old=emptyRegistry(registry.registryId);
    const oldSealed=await sealC4Registry(old,secret);
    const oldOpened=await openC4Registry(oldSealed,secret);
    assert.equal(oldOpened.ok,true);
    const expected={registryId:registry.registryId,revision:1,fingerprint:validated.fingerprint};
    assert.equal(previewC4Comparison(registry,oldOpened.registry,expected).code,'ROLLBACK_BLOCKED');
  });
  await test('wrong secret ciphertext tamper header tamper and truncated disk bytes fail closed',async()=>{
    assert.equal((await openC4Registry(primaryBytes,wrongSecret)).code,'CANNOT_VERIFY');
    const tampered=JSON.parse(primaryBytes);
    const cipher=Buffer.from(tampered.ciphertext,'base64url');cipher[0]^=1;tampered.ciphertext=cipher.toString('base64url');
    assert.equal((await openC4Registry(JSON.stringify(tampered),secret)).code,'CANNOT_VERIFY');
    const header=JSON.parse(primaryBytes);header.header.iterations++;
    assert.equal((await openC4Registry(JSON.stringify(header),secret)).code,'CANNOT_VERIFY');
    assert.equal((await openC4Registry(primaryBytes.slice(0,-17),secret)).code,'CANNOT_VERIFY');
  });
  await test('corrupting primary disk copy after verification leaves independently encrypted recovery copy valid',async()=>{
    fs.writeFileSync(primary,'corrupted fictional primary copy','utf8');
    assert.equal((await openC4Registry(fs.readFileSync(primary,'utf8'),secret)).code,'CANNOT_VERIFY');
    const stillGood=await openC4Registry(fs.readFileSync(recovery,'utf8'),secret);
    assert.equal(stillGood.ok,true);assert.equal(stillGood.meta.fingerprint,validated.fingerprint);
  });
  await test('sealed disk files expose no invented registry source metadata in plaintext',async()=>{
    const raw=fs.readFileSync(recovery,'utf8');
    for(const secretText of [
      source.artist,source.sourceFile,source.recordings[0].title,source.releases[0].title,
      'imaginary-detail-A','imaginary-detail-B','EXACT_TARGET_NOT_FOUND',
    ]) assert.equal(raw.includes(secretText),false,'plaintext leak: '+secretText);
  });
} finally {
  fs.rmSync(tmp,{recursive:true,force:true});
}
await test('disposable C5b file directory is removed after the rehearsal',async()=>{
  assert.equal(fs.existsSync(tmp),false);
});

console.log('A2.4-C/A fictional C5b: '+cases+
  ' full source-v2→reviewed C4 registry→encrypted disk files→authenticated restore checks PASS; ZERO owner data, runtime integration, cloud/network or production persistence.');
