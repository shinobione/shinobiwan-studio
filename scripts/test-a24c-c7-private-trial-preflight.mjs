// A2.4-C C7 preflight — synthetic-only OWNER PERMISSION AND READINESS policy rehearsal.
// No real owner data, file input, crypto, storage, network, browser APIs or runtime integration.
// All "ready" scenarios below are invented hypothetical reviews, never real authorization.
import assert from 'node:assert/strict';

const C7A = 'C7a-local-readonly-preview';
const C7B = 'C7b-real-encrypted-export';
const A_GATES = Object.freeze([
  'acceptedV2ParserReviewed',
  'ownerLocalOnlySource',
  'zeroCommercialWrites',
  'noNetworkSourceTransport',
  'exactHumanAliasReview',
  'pendingQaAndCoveragePreserved',
  'unlinkedEvidencePreserved',
  'noCreativeTrackOrDspInference',
  'originBeforeAfterPrivacyPlan',
  'resetRefreshGenerationFence',
]);
const B_GATES = Object.freeze([
  'productionCryptoReviewed',
  'secretCustodyApproved',
  'ownerExplicitSaveAction',
  'savedBytesIndependentlyReopened',
  'secondCopyIndependentlyStored',
  'revisionConflictReviewApproved',
  'restoreAtomicFailClosed',
  'noPublicOrBackendPrivateWrites',
  'realDeviceDifferentialPrivacyVerified',
]);
const exactKeys = (input,expected) =>
  input!==null&&typeof input==='object'&&!Array.isArray(input)&&
  Object.keys(input).length===expected.length&&
  Object.keys(input).every(key=>expected.includes(key));
const reject=(code)=>Object.freeze({
  outcome:'STOP',code,commercialWrites:0,sourceBytesHandled:0,
  authorizationGranted:false,deployAuthorized:false,
});

// A pure preflight proposal; this function can neither inspect a user's machine
// nor grant/reify permissions. "ready" means an imaginary packet is consistent.
function evaluateC7Readiness(stage,packet) {
  if(stage!=='C7a'&&stage!=='C7b')return reject('UNKNOWN_STAGE');
  if(!exactKeys(packet,['permission','preview','export','prohibitions']))return reject('INVALID_PACKET');
  const p=packet.permission;
  if(!exactKeys(p,['requestedScope','explicitOwnerApproval','independentlyRecorded']) ||
    typeof p.requestedScope!=='string'||p.explicitOwnerApproval!==true||
    p.independentlyRecorded!==true) return reject('EXPLICIT_OWNER_PERMISSION_MISSING');
  if(stage==='C7a'&&p.requestedScope!==C7A)return reject('C7A_SCOPE_MISMATCH');
  if(stage==='C7b'&&p.requestedScope!==C7B)return reject('C7B_REQUIRES_ITS_OWN_PERMISSION');
  if(!exactKeys(packet.prohibitions,[
    'noAutomaticPromotion','noBackendWrite','noSourceIdentifiersInPublicLogs',
    'noCrossAppSync','noArbitraryFileEncoder'
  ])||Object.values(packet.prohibitions).some(x=>x!==true))return reject('PROHIBITION_MISSING');
  if(!exactKeys(packet.preview,A_GATES)||A_GATES.some(k=>packet.preview[k]!==true))
    return reject('PREVIEW_READINESS_INCOMPLETE');
  if(stage==='C7a') {
    if(packet.export!==null)return reject('C7A_MUST_NOT_INCLUDE_EXPORT');
    return Object.freeze({
      outcome:'READY_FOR_REVIEW',scope:C7A,commercialWrites:0,sourceBytesHandled:0,
      authorizationGranted:false,deployAuthorized:false,
    });
  }
  if(!exactKeys(packet.export,B_GATES)||B_GATES.some(k=>packet.export[k]!==true))
    return reject('EXPORT_READINESS_INCOMPLETE');
  return Object.freeze({
    outcome:'READY_FOR_REVIEW',scope:C7B,commercialWrites:0,sourceBytesHandled:0,
    authorizationGranted:false,deployAuthorized:false,
  });
}

const inventedPermissions=(scope)=>({
  requestedScope:scope,explicitOwnerApproval:true,independentlyRecorded:true
});
function inventedPacket(stage='C7a') {
  return {
    permission:inventedPermissions(stage==='C7a'?C7A:C7B),
    preview:Object.fromEntries(A_GATES.map(k=>[k,true])),
    export:stage==='C7a'?null:Object.fromEntries(B_GATES.map(k=>[k,true])),
    prohibitions:{
      noAutomaticPromotion:true,noBackendWrite:true,noSourceIdentifiersInPublicLogs:true,
      noCrossAppSync:true,noArbitraryFileEncoder:true,
    },
  };
}
const copy=x=>structuredClone(x);
let count=0;
function test(name,fn){fn();count++;console.log('A2.4-C C7 invented preflight: '+name+' PASS');}
const deny=(stage,packet,code)=>{
  const v=evaluateC7Readiness(stage,packet);
  assert.equal(v.outcome,'STOP',nameFromCode(code));
  assert.equal(v.code,code);
  assert.equal(v.commercialWrites,0);
  assert.equal(v.sourceBytesHandled,0);
  assert.equal(v.deployAuthorized,false);
  assert.equal(v.authorizationGranted,false);
};
const nameFromCode=x=>x;

test('unspecified stage cannot claim authorization',()=>{
  deny('C7x',inventedPacket(),'UNKNOWN_STAGE');
});
test('missing packet cannot authorize source handling',()=>{
  deny('C7a',null,'INVALID_PACKET');
  deny('C7b',{},'INVALID_PACKET');
});
test('generic go is not distinct private-source permission',()=>{
  const p=inventedPacket();p.permission.requestedScope='go';
  deny('C7a',p,'C7A_SCOPE_MISMATCH');
});
test('no explicit owner consent or recorded scope means STOP',()=>{
  let p=inventedPacket();p.permission.explicitOwnerApproval=false;
  deny('C7a',p,'EXPLICIT_OWNER_PERMISSION_MISSING');
  p=inventedPacket();p.permission.independentlyRecorded=false;
  deny('C7a',p,'EXPLICIT_OWNER_PERMISSION_MISSING');
});
test('read-only C7a permission cannot activate C7b',()=>{
  const p=inventedPacket('C7b');p.permission.requestedScope=C7A;
  deny('C7b',p,'C7B_REQUIRES_ITS_OWN_PERMISSION');
});
test('C7a rejects any supplied export plan or implied private writer',()=>{
  const p=inventedPacket();p.export=Object.fromEntries(B_GATES.map(k=>[k,true]));
  deny('C7a',p,'C7A_MUST_NOT_INCLUDE_EXPORT');
});
test('each C7a condition is individually mandatory',()=>{
  for(const k of A_GATES){const p=inventedPacket();p.preview[k]=false;deny('C7a',p,'PREVIEW_READINESS_INCOMPLETE');}
});
test('unknown or incomplete review claims fail closed',()=>{
  let p=inventedPacket();delete p.preview.unlinkedEvidencePreserved;
  deny('C7a',p,'PREVIEW_READINESS_INCOMPLETE');
  p=inventedPacket();p.preview.unexpected=true;
  deny('C7a',p,'PREVIEW_READINESS_INCOMPLETE');
});
test('origin privacy baseline must be differential, never assumed empty',()=>{
  const p=inventedPacket();p.preview.originBeforeAfterPrivacyPlan='empty-origin-required';
  deny('C7a',p,'PREVIEW_READINESS_INCOMPLETE');
});
test('source never auto-promotes by title, ISRC or channel status',()=>{
  const p=inventedPacket();p.preview.exactHumanAliasReview=false;
  deny('C7a',p,'PREVIEW_READINESS_INCOMPLETE');
  p.preview.exactHumanAliasReview=true;p.preview.noCreativeTrackOrDspInference=false;
  deny('C7a',p,'PREVIEW_READINESS_INCOMPLETE');
});
test('C7a hypothetical complete review gives proposal only, no source bytes or permissions issued',()=>{
  const v=evaluateC7Readiness('C7a',inventedPacket());
  assert.deepEqual(v,{
    outcome:'READY_FOR_REVIEW',scope:C7A,commercialWrites:0,sourceBytesHandled:0,
    authorizationGranted:false,deployAuthorized:false,
  });
});
test('C7b never inherits authorization from C7a and needs all independent export gates',()=>{
  for(const k of B_GATES){const p=inventedPacket('C7b');p.export[k]=false;deny('C7b',p,'EXPORT_READINESS_INCOMPLETE');}
});
test('C7b requires owner-held independently reopened and independently stored second copy',()=>{
  let p=inventedPacket('C7b');p.export.savedBytesIndependentlyReopened=false;
  deny('C7b',p,'EXPORT_READINESS_INCOMPLETE');
  p=inventedPacket('C7b');p.export.secondCopyIndependentlyStored=false;
  deny('C7b',p,'EXPORT_READINESS_INCOMPLETE');
});
test('public/backend/cross-app write must stay prohibited in both stages',()=>{
  for(const stage of ['C7a','C7b'])for(const k of Object.keys(inventedPacket(stage).prohibitions)){
    const p=inventedPacket(stage);p.prohibitions[k]=false;
    deny(stage,p,'PROHIBITION_MISSING');
  }
});
test('C7b hypothetical completed packet is only a design review, never real export permission',()=>{
  const v=evaluateC7Readiness('C7b',inventedPacket('C7b'));
  assert.deepEqual(v,{
    outcome:'READY_FOR_REVIEW',scope:C7B,commercialWrites:0,sourceBytesHandled:0,
    authorizationGranted:false,deployAuthorized:false,
  });
});
test('all evaluation leaves invented inputs byte-identical and no mutable state is returned',()=>{
  const p=inventedPacket('C7a'),before=JSON.stringify(p);
  const v=evaluateC7Readiness('C7a',p);
  assert.equal(JSON.stringify(p),before);
  assert.ok(Object.isFrozen(v));
  assert.ok(v.outcome==='READY_FOR_REVIEW');
});
console.log('A2.4-C C7 invented preflight: '+count+' pure decision-boundary cases PASS; NO source, file, crypto, network, browser, commercial write, or deployment.');
