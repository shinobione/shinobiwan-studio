// A2.4-C/A C4 · purely fictional private-registry/recovery rehearsal, never imported by src/.
// No user source, actual artist metadata, file I/O, browser Storage, network or runtime writer.
// Real Web Crypto is used ONLY for an invented in-memory inner registry. This is not a
// reviewed, interoperable, production-commercial encryption implementation or disk backup.
import assert from 'node:assert/strict';
import { webcrypto, createHash } from 'node:crypto';

const { subtle } = webcrypto;
const encoder = new TextEncoder(), decoder = new TextDecoder('utf-8', { fatal: true });
const password = 'Entirely invented C4 rehearsal phrase, never an owner passphrase!';
const keys = (v, list) => v && typeof v === 'object' && !Array.isArray(v) &&
  JSON.stringify(Object.keys(v)) === JSON.stringify(list);
const nonempty = v => typeof v === 'string' && v.length > 0 && v.length <= 160 &&
  !/[\x00-\x1f]/.test(v);
const id = nonempty;
const positive = n => Number.isSafeInteger(n) && n > 0;
const nonnegative = n => Number.isSafeInteger(n) && n >= 0;
const digest64 = v => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
const safeText = v => typeof v === 'string' && v.length <= 262_144;
const nullableSafeText = v => v === null || safeText(v);
const validObservedAt = v => v === null || (typeof v === 'string' && !Number.isNaN(Date.parse(v)));
const reject = code => ({ ok: false, code });
const sha = text => createHash('sha256').update(text).digest('hex');
const fingerprint = registry => sha(JSON.stringify(registry));
const validTarget = (kind, targetId, refs) =>
  (kind === 'recording' && refs.recordings.has(targetId)) ||
  (kind === 'release' && refs.releases.has(targetId)) ||
  (kind === 'appearance' && refs.appearances.has(targetId));
const keyForAlias = row => JSON.stringify([row.namespace, row.kind, row.sourceId]);
const exact = (row, fields) => keys(row, fields);

const ROOT = ['schema','registryId','revision','parentRevision','sourceSnapshots','recordings','releases',
  'appearances','sourceAliases','evidence','findings','reviewDecisions','channelEvents','audit'];
const SOURCE = ['id','namespace','sourceRevision','sourceSchema','exporterContractVersion','snapshotDate','sourceFile','inputSha256','claimedWorkbookSha256','digestAuthority','coverage','sections'];
const RECORD = ['id','title','version','isrc'];
const RELEASE = ['id','title','kind','upc','distributor','source','historicalDistributionStatus','referenceDate'];
const APPEAR = ['id','releaseId','position','recordingId','displayTitle','observedIsrc','status'];
const ALIAS = ['namespace','kind','sourceId','targetId','snapshotId'];
const EVIDENCE = ['id','snapshotId','kind','linkState','sourceRecordAlias','sourceLocator','observedAt','classification','payload','targetKind','targetId','sourceReleaseId','position','linkIssueCode'];
const FINDING = ['id','scope','sourceSnapshotId','targetKind','targetId','evidenceId','code','locator','status'];
const DECISION = ['id','operationId','reviewer','targetKind','targetId','evidenceIds','disposition','expectedRevision','rationale'];
const CHANNEL = ['id','channel','subjectKind','subjectId','status','observedAt','evidenceIds'];
const AUDIT = ['operationId','revision','parentRevision','kind','targetId'];
const VALID_KINDS = new Set(['recording','release','appearance']);
const CHANNELS = new Set(['amuse','spotify','soundcloud','launchpad','studio']);
const CHANNEL_STATES = new Set(['unknown','pitch-submitted','delivered','verified-live']);
const EVIDENCE_CLASSES = new Set(['source-record','distributor-detail','historical-distributor','current-channel-check']);

function validate(registry) {
  if (!exact(registry,ROOT) || registry.schema !== 'shinocat-commercial-registry-v1' ||
      !id(registry.registryId) || !nonnegative(registry.revision) ||
      registry.parentRevision !== (registry.revision === 0 ? null : registry.revision - 1))
    return reject('INVALID_ROOT_OR_REVISION');
  for (const field of ROOT.slice(4)) {
    if (!Array.isArray(registry[field]) || registry[field].length > 500) return reject('INVALID_COLLECTION');
  }
  const refs = { recordings: new Map(), releases: new Map(), appearances: new Map() };
  const snapshots = new Map(), aliases = new Map(), evidence = new Map(), evidenceSourceAliases = new Set(), findingIds = new Set(),
    decisionIds = new Set(), operationIds = new Set(), channelIds = new Set(), auditOps = new Set();
  for (const s of registry.sourceSnapshots) {
    if (!exact(s,SOURCE) || !id(s.id) || !id(s.namespace) || !id(s.sourceRevision) ||
        !id(s.sourceSchema) || !(s.exporterContractVersion === null || id(s.exporterContractVersion)) ||
        !nonempty(s.snapshotDate) || Number.isNaN(Date.parse(s.snapshotDate)) ||
        !safeText(s.sourceFile) || !digest64(s.inputSha256) || !digest64(s.claimedWorkbookSha256) ||
        !['claim-only','original-bytes-verified'].includes(s.digestAuthority) ||
        !['complete','partial','omitted'].includes(s.coverage) ||
        !Array.isArray(s.sections) || s.sections.length === 0 || s.sections.length > 20 ||
        s.sections.some(x => !exact(x,['name','sourceRows','status','bodyPreservation','countMatchesArchivedV1']) ||
          !id(x.name) || !nonnegative(x.sourceRows) ||
          !['represented','partial','omitted','contradictory','unverified'].includes(x.status) ||
          !['not-copied','normalized-or-counted-only','detailed-evidence'].includes(x.bodyPreservation) ||
          !(x.countMatchesArchivedV1 === null || typeof x.countMatchesArchivedV1 === 'boolean')) ||
        new Set(s.sections.map(x => x.name)).size !== s.sections.length ||
        snapshots.has(s.id)) return reject('INVALID_SOURCE_SNAPSHOT');
    snapshots.set(s.id,s);
  }
  for (const r of registry.recordings) {
    if (!exact(r,RECORD) || !id(r.id) || !nonempty(r.title) ||
        !(r.version === null || safeText(r.version)) ||
        !(r.isrc === null || nonempty(r.isrc)) ||
        refs.recordings.has(r.id)) return reject('INVALID_COMMERCIAL_IDENTITY');
    refs.recordings.set(r.id,r);
  }
  for (const r of registry.releases) {
    if (!exact(r,RELEASE) || !id(r.id) || !nonempty(r.title) ||
        !['single','ep','album','unknown'].includes(r.kind) ||
        !(r.upc === null || nonempty(r.upc)) ||
        !(r.distributor === null || safeText(r.distributor)) ||
        !safeText(r.source) ||
        !(r.historicalDistributionStatus === null || safeText(r.historicalDistributionStatus)) ||
        !(r.referenceDate === null || safeText(r.referenceDate)) ||
        refs.releases.has(r.id)) return reject('INVALID_COMMERCIAL_IDENTITY');
    refs.releases.set(r.id,r);
  }
  const occupied = new Set();
  for (const a of registry.appearances) {
    if (!exact(a,APPEAR) || !id(a.id) || !refs.releases.has(a.releaseId) ||
        !(a.position === null || positive(a.position)) ||
        !(a.recordingId === null || refs.recordings.has(a.recordingId)) ||
        !(a.displayTitle === null || safeText(a.displayTitle)) ||
        !(a.observedIsrc === null || safeText(a.observedIsrc)) ||
        !['certified','unverified'].includes(a.status) ||
        refs.appearances.has(a.id)) return reject('INVALID_APPEARANCE');
    if (a.position !== null) {
      const slot = JSON.stringify([a.releaseId,a.position]);
      if (occupied.has(slot)) return reject('DUPLICATE_EXACT_POSITION');
      occupied.add(slot);
    }
    refs.appearances.set(a.id,a);
  }
  for (const a of registry.sourceAliases) {
    if (!exact(a,ALIAS) || !id(a.namespace) || !VALID_KINDS.has(a.kind) ||
        !id(a.sourceId) || !id(a.targetId) || !snapshots.has(a.snapshotId) ||
        snapshots.get(a.snapshotId).namespace !== a.namespace ||
        !validTarget(a.kind,a.targetId,refs)) return reject('INVALID_SOURCE_ALIAS');
    const unique = keyForAlias(a);
    if (aliases.has(unique)) return reject('DUPLICATE_ALIAS');
    aliases.set(unique,a);
  }
  for (const e of registry.evidence) {
    if (!exact(e,EVIDENCE) || !id(e.id) || !snapshots.has(e.snapshotId) ||
        !EVIDENCE_CLASSES.has(e.kind) || !['linked','unlinked','unattached'].includes(e.linkState) ||
        !id(e.sourceRecordAlias) || !nullableSafeText(e.sourceLocator) ||
        !validObservedAt(e.observedAt) ||
        !(e.classification === null || ['source-observation','derived','human-confirmed','missing','contradictory'].includes(e.classification)) ||
        !nullableSafeText(e.payload) || evidence.has(e.id))
      return reject('INVALID_EVIDENCE');
    const sourceIdentity = JSON.stringify([e.snapshotId,e.sourceRecordAlias]);
    if (evidenceSourceAliases.has(sourceIdentity)) return reject('DUPLICATE_EVIDENCE_SOURCE_ALIAS');
    evidenceSourceAliases.add(sourceIdentity);
    if (e.linkState === 'unlinked') {
      if (e.kind !== 'distributor-detail' || e.targetKind !== null || e.targetId !== null ||
          !nonempty(e.sourceReleaseId) || !(e.position === null || positive(e.position)) ||
          !id(e.linkIssueCode)) return reject('INVALID_UNLINKED_EVIDENCE');
    } else if (e.linkState === 'unattached') {
      if (e.kind === 'distributor-detail' || e.targetKind !== null || e.targetId !== null ||
          e.sourceReleaseId !== null || e.position !== null || e.linkIssueCode !== null)
        return reject('INVALID_UNATTACHED_EVIDENCE');
    } else {
      if (!VALID_KINDS.has(e.targetKind) || !validTarget(e.targetKind,e.targetId,refs) ||
          e.linkIssueCode !== null) return reject('INVALID_EVIDENCE');
      if (e.kind === 'distributor-detail') {
        const appearance = refs.appearances.get(e.targetId);
        const namespace = snapshots.get(e.snapshotId).namespace;
        const rel = aliases.get(JSON.stringify([namespace,'release',e.sourceReleaseId]));
        if (e.targetKind !== 'appearance' || !appearance || !positive(e.position) ||
            appearance.position !== e.position || !rel ||
            rel.targetId !== appearance.releaseId) return reject('DETAIL_EXACT_LINK_CONFLICT');
      } else if (e.sourceReleaseId !== null || e.position !== null) {
        return reject('UNEXPECTED_EVIDENCE_PLACEMENT');
      }
    }
    evidence.set(e.id,e);
  }
  for (const f of registry.findings) {
    if (!exact(f,FINDING) || !id(f.id) ||
        !['target','evidence','source'].includes(f.scope) ||
        !id(f.code) || !nonempty(f.locator) ||
        !['pending','human-reviewed'].includes(f.status) || findingIds.has(f.id))
      return reject('INVALID_FINDING');
    if (f.scope === 'target') {
      if (f.sourceSnapshotId !== null || !VALID_KINDS.has(f.targetKind) ||
          !validTarget(f.targetKind,f.targetId,refs) ||
          !(f.evidenceId === null || (id(f.evidenceId) && evidence.has(f.evidenceId) &&
            evidence.get(f.evidenceId).linkState === 'linked' &&
            evidence.get(f.evidenceId).targetKind === f.targetKind &&
            evidence.get(f.evidenceId).targetId === f.targetId)))
        return reject('INVALID_FINDING');
    } else if (f.scope === 'evidence') {
      if (!id(f.sourceSnapshotId) || !snapshots.has(f.sourceSnapshotId) ||
          f.targetKind !== null || f.targetId !== null ||
          !id(f.evidenceId) || !evidence.has(f.evidenceId) ||
          evidence.get(f.evidenceId).snapshotId !== f.sourceSnapshotId)
        return reject('INVALID_FINDING');
    } else {
      if (!id(f.sourceSnapshotId) || !snapshots.has(f.sourceSnapshotId) ||
          f.targetKind !== null || f.targetId !== null || f.evidenceId !== null)
        return reject('INVALID_FINDING');
    }
    findingIds.add(f.id);
  }
  for (const d of registry.reviewDecisions) {
    if (!exact(d,DECISION) || !id(d.id) || !id(d.operationId) || !id(d.reviewer) ||
        !VALID_KINDS.has(d.targetKind) || !validTarget(d.targetKind,d.targetId,refs) ||
        !Array.isArray(d.evidenceIds) || !d.evidenceIds.length ||
        new Set(d.evidenceIds).size !== d.evidenceIds.length ||
        d.evidenceIds.some(eid => !evidence.has(eid) ||
          evidence.get(eid).targetKind !== d.targetKind || evidence.get(eid).targetId !== d.targetId) ||
        !id(d.disposition) || !nonnegative(d.expectedRevision) ||
        d.expectedRevision >= registry.revision || !nonempty(d.rationale) ||
        decisionIds.has(d.id) || operationIds.has(d.operationId))
      return reject('INVALID_REVIEW_DECISION');
    decisionIds.add(d.id); operationIds.add(d.operationId);
  }
  for (const e of registry.channelEvents) {
    if (!exact(e,CHANNEL) || !id(e.id) || !CHANNELS.has(e.channel) ||
        !['recording','release'].includes(e.subjectKind) ||
        !validTarget(e.subjectKind,e.subjectId,refs) || !CHANNEL_STATES.has(e.status) ||
        !nonempty(e.observedAt) || Number.isNaN(Date.parse(e.observedAt)) ||
        !Array.isArray(e.evidenceIds) || !e.evidenceIds.length ||
        new Set(e.evidenceIds).size !== e.evidenceIds.length ||
        e.evidenceIds.some(eid => !evidence.has(eid) ||
          evidence.get(eid).targetKind !== e.subjectKind ||
          evidence.get(eid).targetId !== e.subjectId) || channelIds.has(e.id))
      return reject('INVALID_CHANNEL_EVENT');
    if (e.status === 'verified-live' &&
        !e.evidenceIds.some(eid => evidence.get(eid).kind === 'current-channel-check'))
      return reject('LIVE_REQUIRES_PLATFORM_CHECK');
    channelIds.add(e.id);
  }
  for (const receipt of registry.audit) {
    if (!exact(receipt,AUDIT) || !id(receipt.operationId) ||
        !nonnegative(receipt.revision) || receipt.revision > registry.revision ||
        receipt.parentRevision !== (receipt.revision === 0 ? null : receipt.revision - 1) ||
        !id(receipt.kind) || !id(receipt.targetId) ||
        auditOps.has(receipt.operationId)) return reject('INVALID_AUDIT');
    auditOps.add(receipt.operationId);
  }
  if (registry.reviewDecisions.some(d=>!auditOps.has(d.operationId)))
    return reject('REVIEW_AUDIT_MISSING');
  return { ok:true, count: {recordings:refs.recordings.size, releases:refs.releases.size,
    appearances:refs.appearances.size, evidence:evidence.size,
    unattachedEvidence:registry.evidence.filter(e=>e.linkState!=='linked').length,
    pendingQA:registry.findings.filter(f=>f.status==='pending').length}, fingerprint:fingerprint(registry) };
}
const deep = x => structuredClone(x);
function invented() {
  return {
    schema:'shinocat-commercial-registry-v1', registryId:'invented-registry-A',
    revision:2, parentRevision:1,
    sourceSnapshots:[{
      id:'invented-source-snapshot',namespace:'imaginary-distributor',sourceRevision:'fictional-revision-1',
      sourceSchema:'catalogue-readonly-seed-v2',exporterContractVersion:'fictional-exporter-1',
      snapshotDate:'2026-01-01',sourceFile:'invented-private-source.json',
      inputSha256:'b'.repeat(64),claimedWorkbookSha256:'a'.repeat(64),
      digestAuthority:'claim-only',coverage:'partial',
      sections:[
        {name:'Imagined releases',sourceRows:1,status:'represented',bodyPreservation:'normalized-or-counted-only',countMatchesArchivedV1:true},
        {name:'Imagined legacy details',sourceRows:1,status:'partial',bodyPreservation:'detailed-evidence',countMatchesArchivedV1:null},
      ],
    }],
    recordings:[
      {id:'commercial-rec-A',title:'An imaginary echo',version:null,isrc:null},
      {id:'commercial-rec-B',title:'An imaginary echo',version:null,isrc:null},
    ],
    releases:[{id:'commercial-rel-A',title:'Invented album',kind:'single',upc:null,
      distributor:'Imaginary distributor',source:'imaginary-distributor',
      historicalDistributionStatus:'Historic only',referenceDate:null}],
    appearances:[
      {id:'commercial-app-A',releaseId:'commercial-rel-A',position:1,recordingId:'commercial-rec-A',
        displayTitle:'An imaginary echo',observedIsrc:null,status:'unverified'},
      {id:'commercial-app-B',releaseId:'commercial-rel-A',position:2,recordingId:null,
        displayTitle:'Unbound imaginary echo',observedIsrc:'ZZAAA2600999',status:'unverified'},
    ],
    sourceAliases:[
      {namespace:'imaginary-distributor',kind:'release',sourceId:'imagined-source-rel',targetId:'commercial-rel-A',snapshotId:'invented-source-snapshot'},
      {namespace:'imaginary-distributor',kind:'appearance',sourceId:'imagined-source-app-A',targetId:'commercial-app-A',snapshotId:'invented-source-snapshot'},
      {namespace:'imaginary-distributor',kind:'recording',sourceId:'imagined-source-rec-A',targetId:'commercial-rec-A',snapshotId:'invented-source-snapshot'},
    ],
    evidence:[
      {id:'invented-proof-detail',snapshotId:'invented-source-snapshot',kind:'distributor-detail',
        linkState:'linked',sourceRecordAlias:'imagined-detail-row-A',
        sourceLocator:'details[0]',observedAt:'2026-01-01',classification:'source-observation',
        payload:'{"Invented note":"exact fictional detail"}',
        targetKind:'appearance',targetId:'commercial-app-A',sourceReleaseId:'imagined-source-rel',position:1,linkIssueCode:null},
      {id:'invented-proof-release',snapshotId:'invented-source-snapshot',kind:'historical-distributor',
        linkState:'linked',sourceRecordAlias:'imagined-release-evidence-A',
        sourceLocator:'releases[0]',observedAt:'2026-01-01',classification:'source-observation',
        payload:'{"Invented release":"historical only"}',
        targetKind:'release',targetId:'commercial-rel-A',sourceReleaseId:null,position:null,linkIssueCode:null},
    ],
    findings:[{id:'fictional-qa-A',scope:'target',sourceSnapshotId:null,targetKind:'appearance',targetId:'commercial-app-B',evidenceId:null,code:'FICTIONAL_TARGET_REVIEW',locator:'appearances[1]',status:'pending'}],
    reviewDecisions:[{id:'fictional-decision-A',operationId:'fictional-reviewed-op',reviewer:'imaginary-owner',
      targetKind:'appearance',targetId:'commercial-app-A',evidenceIds:['invented-proof-detail'],
      disposition:'confirmed-source-link',expectedRevision:1,rationale:'Only a wholly invented source link.'}],
    channelEvents:[{id:'fictional-amuse-delivery',channel:'amuse',subjectKind:'release',
      subjectId:'commercial-rel-A',status:'delivered',observedAt:'2026-01-01T10:00:00Z',
      evidenceIds:['invented-proof-release']}],
    audit:[{operationId:'fictional-reviewed-op',revision:2,parentRevision:1,
      kind:'review',targetId:'commercial-app-A'}],
  };
}
const enc64 = bytes => Buffer.from(bytes).toString('base64url');
function dec64(s, length) {
  if (typeof s !== 'string' || !/^[A-Za-z0-9_-]+$/.test(s)) return null;
  const b = Buffer.from(s,'base64url');
  return enc64(b) === s && (length === undefined || b.length === length) ? b : null;
}
const HEADER = ['magic','version','kdf','iterations','salt','cipher','nonce','tagBits','plaintextBytes'];
let derives=0;
async function derive(secret,salt,iterations) {
  derives++;
  const imported=await subtle.importKey('raw',encoder.encode(secret),'PBKDF2',false,['deriveKey']);
  return subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations},
    imported,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function sealInvented(registry,secret=password) {
  if(!validate(registry).ok) return reject('INVALID_SOURCE_REGISTRY');
  const plain=encoder.encode(JSON.stringify(registry));
  const salt=webcrypto.getRandomValues(new Uint8Array(16));
  const nonce=webcrypto.getRandomValues(new Uint8Array(12));
  const header={magic:'SHINOCAT-PKG',version:1,kdf:'PBKDF2-HMAC-SHA256',iterations:600000,
    salt:enc64(salt),cipher:'AES-256-GCM',nonce:enc64(nonce),tagBits:128,plaintextBytes:plain.length};
  const key=await derive(secret,salt,header.iterations);
  const cipher=new Uint8Array(await subtle.encrypt({name:'AES-GCM',iv:nonce,additionalData:encoder.encode(JSON.stringify(header)),tagLength:128},key,plain));
  return JSON.stringify({header,ciphertext:enc64(cipher)});
}
async function openInvented(raw,secret) {
  // Do not distinguish incorrect password from tampered bytes or invalid inner registry in public UI.
  try {
    if(typeof raw!=='string' || Buffer.byteLength(raw,'utf8') > 2*1024*1024 || !raw.length)
      return reject('CANNOT_VERIFY');
    const parsed=JSON.parse(raw), h=parsed?.header;
    if(!keys(parsed,['header','ciphertext']) || JSON.stringify(parsed)!==raw || !keys(h,HEADER) ||
       h.magic!=='SHINOCAT-PKG' || h.version!==1 || h.kdf!=='PBKDF2-HMAC-SHA256' ||
       h.cipher!=='AES-256-GCM' || h.tagBits!==128 ||
       !Number.isSafeInteger(h.iterations) || h.iterations<600000 || h.iterations>1200000 ||
       !Number.isSafeInteger(h.plaintextBytes) || h.plaintextBytes<1 || h.plaintextBytes>1024*1024)
       return reject('CANNOT_VERIFY');
    const salt=dec64(h.salt,16),nonce=dec64(h.nonce,12),cipher=dec64(parsed.ciphertext);
    if(!salt || !nonce || !cipher || cipher.length!==h.plaintextBytes+16) return reject('CANNOT_VERIFY');
    const key=await derive(secret,salt,h.iterations);
    const opened=await subtle.decrypt({name:'AES-GCM',iv:nonce,additionalData:encoder.encode(JSON.stringify(h)),tagLength:128},key,cipher);
    const result=JSON.parse(decoder.decode(opened));
    const validated=validate(result);
    return validated.ok ? {ok:true,registry:result,meta:validated} : reject('CANNOT_VERIFY');
  } catch { return reject('CANNOT_VERIFY'); }
}
function previewComparison(current,candidate,expectedCurrent) {
  const base=validate(current), next=validate(candidate);
  if(!base.ok || !next.ok) return reject('INVALID_REGISTRY');
  if(expectedCurrent.registryId!==current.registryId || expectedCurrent.revision!==current.revision ||
     expectedCurrent.fingerprint!==base.fingerprint) return reject('STALE_CURRENT');
  if(current.registryId!==candidate.registryId) return reject('FOREIGN_REGISTRY');
  if(candidate.revision<current.revision) return reject('ROLLBACK_BLOCKED');
  if(candidate.revision===current.revision)
    return candidate && base.fingerprint===next.fingerprint
      ? {ok:true,status:'same-verified-revision',writes:0}
      : reject('SAME_REVISION_CONFLICT');
  return {ok:true,status:'requires-explicit-owner-review',currentRevision:current.revision,
    candidateRevision:candidate.revision, entityDelta: {
      recordings:candidate.recordings.length-current.recordings.length,
      releases:candidate.releases.length-current.releases.length,
      appearances:candidate.appearances.length-current.appearances.length,
    }, candidateFingerprint:next.fingerprint, writes:0, automaticActivation:false};
}
async function previewSealedRestore(getCurrent,raw,secret,expectedCurrent) {
  const authenticated=await openInvented(raw,secret);
  if(!authenticated.ok) return authenticated;
  // Reread AFTER async decryption; unrelated import/reset must fence stale work.
  return previewComparison(getCurrent(),authenticated.registry,expectedCurrent);
}
if (process.env.A24C_LIBRARY_ONLY !== '1') {
let cases=0;
async function test(name,cb) {
  await cb();cases++;console.log('A2.4-C/A fictional C4: '+name+' PASS');
}
const baseline=invented(), baselineProof=validate(baseline);
assert.equal(baselineProof.ok,true);
await test('validated registry has distinct commercial entity and historical evidence counts',async()=>{
  assert.deepEqual(baselineProof.count,{recordings:2,releases:1,appearances:2,evidence:2,unattachedEvidence:0,pendingQA:1});
  assert.equal(baseline.appearances[1].recordingId,null);
  assert.equal(baseline.sourceSnapshots[0].digestAuthority,'claim-only');
});
await test('duplicate descriptive title and missing ISRC do not collapse commercial identity',async()=>{
  assert.equal(baseline.recordings[0].title,baseline.recordings[1].title);
  assert.notEqual(baseline.recordings[0].id,baseline.recordings[1].id);
  assert.equal(validate(baseline).ok,true);
});
await test('duplicate stable entity IDs and exact release positions fail atomically',async()=>{
  let r=deep(baseline);r.recordings.push(deep(r.recordings[0]));
  assert.equal(validate(r).code,'INVALID_COMMERCIAL_IDENTITY');
  r=deep(baseline);r.appearances[1].position=1;
  assert.equal(validate(r).code,'DUPLICATE_EXACT_POSITION');
  r=deep(baseline);r.appearances[0].releaseId='nonexistent-fictional-release';
  assert.equal(validate(r).code,'INVALID_APPEARANCE');
});
await test('unreviewed aliases, duplicate aliases and missing snapshots reject',async()=>{
  let r=deep(baseline);r.sourceAliases.push(deep(r.sourceAliases[0]));
  assert.equal(validate(r).code,'DUPLICATE_ALIAS');
  r=deep(baseline);r.sourceAliases[0].targetId='unapproved-fictional-target';
  assert.equal(validate(r).code,'INVALID_SOURCE_ALIAS');
  r=deep(baseline);r.sourceAliases[0].snapshotId='unknown-fictional-snapshot';
  assert.equal(validate(r).code,'INVALID_SOURCE_ALIAS');
});
await test('independent distributor detail requires the exact existing Release and position',async()=>{
  let r=deep(baseline);r.evidence[0].position=2;
  assert.equal(validate(r).code,'DETAIL_EXACT_LINK_CONFLICT');
  r=deep(baseline);r.evidence[0].sourceReleaseId='invented-wrong-release';
  assert.equal(validate(r).code,'DETAIL_EXACT_LINK_CONFLICT');
  r=deep(baseline);r.evidence.push({...deep(r.evidence[0]),id:'another-fictional-exact-detail',sourceRecordAlias:'imagined-detail-row-B'});
  const v=validate(r);assert.equal(v.ok,true);assert.equal(v.count.appearances,2);assert.equal(v.count.evidence,3);
  r=deep(baseline);r.evidence.push({...deep(r.evidence[0]),id:'another-fictional-exact-detail'});
  assert.equal(validate(r).code,'DUPLICATE_EVIDENCE_SOURCE_ALIAS');
});
await test('unlinked distributor detail is retained without inventing any commercial target',async()=>{
  const r=deep(baseline);
  r.evidence.push({
    id:'invented-unlinked-detail',snapshotId:'invented-source-snapshot',kind:'distributor-detail',
    linkState:'unlinked',sourceRecordAlias:'imagined-unlinked-row',
    sourceLocator:'details[unlinked]',observedAt:'2026-01-01',classification:'source-observation',payload:'{"Invented":"unlinked detail"}',
    targetKind:null,targetId:null,sourceReleaseId:'imagined-unknown-source-release',
    position:null,linkIssueCode:'EXACT_TARGET_NOT_FOUND',
  });
  r.findings.push({
    id:'fictional-global-unlinked-qa',scope:'evidence',sourceSnapshotId:'invented-source-snapshot',
    targetKind:null,targetId:null,evidenceId:'invented-unlinked-detail',
    code:'EXACT_TARGET_NOT_FOUND',locator:'details[unlinked]',status:'pending',
  });
  const v=validate(r);
  assert.equal(v.ok,true);
  assert.equal(v.count.unattachedEvidence,1);
  assert.equal(v.count.recordings,2);assert.equal(v.count.releases,1);assert.equal(v.count.appearances,2);
  assert.equal(v.count.evidence,3);assert.equal(v.count.pendingQA,2);
});
await test('unlinked evidence cannot impersonate a target, channel event or reviewed entity',async()=>{
  let r=deep(baseline);
  r.evidence.push({
    id:'invented-unlinked-detail',snapshotId:'invented-source-snapshot',kind:'distributor-detail',
    linkState:'unlinked',sourceRecordAlias:'imagined-unlinked-row',
    sourceLocator:'details[unlinked]',observedAt:'2026-01-01',classification:'source-observation',payload:'{"Invented":"unlinked detail"}',
    targetKind:'appearance',targetId:'commercial-app-A',sourceReleaseId:'imagined-source-rel',
    position:1,linkIssueCode:'EXACT_TARGET_NOT_FOUND',
  });
  assert.equal(validate(r).code,'INVALID_UNLINKED_EVIDENCE');

  r=deep(baseline);
  r.evidence.push({
    id:'invented-unlinked-detail',snapshotId:'invented-source-snapshot',kind:'distributor-detail',
    linkState:'unlinked',sourceRecordAlias:'imagined-unlinked-row',
    sourceLocator:'details[unlinked]',observedAt:'2026-01-01',classification:'source-observation',payload:'{"Invented":"unlinked detail"}',
    targetKind:null,targetId:null,sourceReleaseId:'imagined-unknown-source-release',
    position:null,linkIssueCode:'EXACT_TARGET_NOT_FOUND',
  });
  r.findings.push({id:'fictional-global-unlinked-qa',scope:'evidence',
    sourceSnapshotId:'invented-source-snapshot',targetKind:null,targetId:null,
    evidenceId:'invented-unlinked-detail',code:'EXACT_TARGET_NOT_FOUND',
    locator:'details[unlinked]',status:'pending'});
  r.channelEvents[0].evidenceIds=['invented-unlinked-detail'];
  assert.equal(validate(r).code,'INVALID_CHANNEL_EVENT');

  r=deep(baseline);
  r.evidence.push({
    id:'invented-unlinked-detail',snapshotId:'invented-source-snapshot',kind:'distributor-detail',
    linkState:'unlinked',sourceRecordAlias:'imagined-unlinked-row',
    sourceLocator:'details[unlinked]',observedAt:'2026-01-01',classification:'source-observation',payload:'{"Invented":"unlinked detail"}',
    targetKind:null,targetId:null,sourceReleaseId:'imagined-unknown-source-release',
    position:null,linkIssueCode:'EXACT_TARGET_NOT_FOUND',
  });
  r.findings.push({id:'fictional-global-unlinked-qa',scope:'evidence',
    sourceSnapshotId:'invented-source-snapshot',targetKind:null,targetId:null,
    evidenceId:'invented-unlinked-detail',code:'EXACT_TARGET_NOT_FOUND',
    locator:'details[unlinked]',status:'pending'});
  r.reviewDecisions[0].evidenceIds=['invented-unlinked-detail'];
  assert.equal(validate(r).code,'INVALID_REVIEW_DECISION');
});
await test('evidence-scoped global finding requires real evidence and matching source snapshot without target inference',async()=>{
  let r=deep(baseline);
  r.findings.push({id:'fictional-bad-global',scope:'evidence',sourceSnapshotId:'invented-source-snapshot',
    targetKind:null,targetId:null,evidenceId:null,code:'BAD_GLOBAL',locator:'source',status:'pending'});
  assert.equal(validate(r).code,'INVALID_FINDING');

  r=deep(baseline);
  r.findings.push({id:'fictional-linked-global',scope:'evidence',sourceSnapshotId:'invented-source-snapshot',
    targetKind:null,targetId:null,evidenceId:'invented-proof-detail',code:'SOURCE_DETAIL_REVIEW',
    locator:'details[0]',status:'pending'});
  const linkedGlobal=validate(r);
  assert.equal(linkedGlobal.ok,true);
  assert.equal(r.findings.at(-1).targetId,null);

  r=deep(baseline);
  r.findings.push({id:'fictional-wrong-snapshot',scope:'evidence',sourceSnapshotId:'missing-snapshot',
    targetKind:null,targetId:null,evidenceId:'invented-proof-detail',code:'SOURCE_DETAIL_REVIEW',
    locator:'details[0]',status:'pending'});
  assert.equal(validate(r).code,'INVALID_FINDING');
});
await test('generic unattached source evidence is preserved with evidence-scoped pending QA',async()=>{
  const r=deep(baseline);
  r.evidence.push({
    id:'invented-unattached-source-row',snapshotId:'invented-source-snapshot',kind:'source-record',
    linkState:'unattached',sourceRecordAlias:'imagined-qa-row-A',
    sourceLocator:'qa[0]',observedAt:'2026-01-01',classification:'source-observation',payload:'{"Invented":"global QA row"}',
    targetKind:null,targetId:null,sourceReleaseId:null,position:null,linkIssueCode:null,
  });
  r.findings.push({
    id:'fictional-source-row-qa',scope:'evidence',sourceSnapshotId:'invented-source-snapshot',
    targetKind:null,targetId:null,evidenceId:'invented-unattached-source-row',
    code:'SOURCE_QA_PENDING',locator:'qa[0]',status:'pending',
  });
  const v=validate(r);
  assert.equal(v.ok,true);
  assert.equal(v.count.unattachedEvidence,1);
  assert.equal(v.count.pendingQA,2);
  assert.equal(v.count.recordings,2);assert.equal(v.count.releases,1);assert.equal(v.count.appearances,2);
});
await test('source-wide coverage warning is preserved without evidence or commercial target',async()=>{
  const r=deep(baseline);
  r.findings.push({
    id:'fictional-source-coverage',scope:'source',sourceSnapshotId:'invented-source-snapshot',
    targetKind:null,targetId:null,evidenceId:null,
    code:'DERIVED_SOURCE_COVERAGE_INCOMPLETE',locator:'source',status:'pending',
  });
  const v=validate(r);
  assert.equal(v.ok,true);
  assert.equal(v.count.pendingQA,2);
});
await test('finding scope cannot smuggle source evidence into a commercial target',async()=>{
  let r=deep(baseline);
  r.evidence.push({
    id:'invented-unattached-source-row',snapshotId:'invented-source-snapshot',kind:'source-record',
    linkState:'unattached',sourceRecordAlias:'imagined-qa-row-A',
    sourceLocator:'qa[0]',observedAt:'2026-01-01',classification:'source-observation',payload:'{"Invented":"global QA row"}',
    targetKind:null,targetId:null,sourceReleaseId:null,position:null,linkIssueCode:null,
  });
  r.findings.push({
    id:'fictional-bad-target-scope',scope:'target',sourceSnapshotId:null,
    targetKind:'appearance',targetId:'commercial-app-A',evidenceId:'invented-unattached-source-row',
    code:'SOURCE_QA_PENDING',locator:'qa[0]',status:'pending',
  });
  assert.equal(validate(r).code,'INVALID_FINDING');

  r=deep(baseline);
  r.findings.push({
    id:'fictional-bad-source-scope',scope:'source',sourceSnapshotId:'invented-source-snapshot',
    targetKind:null,targetId:null,evidenceId:'invented-proof-detail',
    code:'DERIVED_SOURCE_COVERAGE_INCOMPLETE',locator:'source',status:'pending',
  });
  assert.equal(validate(r).code,'INVALID_FINDING');
});
await test('source coverage and selected-input/workbook digest authorities remain distinct and exact',async()=>{
  const r=deep(baseline);r.sourceSnapshots[0].coverage='omitted';
  r.sourceSnapshots[0].sections[1].status='omitted';
  r.sourceSnapshots[0].sections[1].bodyPreservation='not-copied';
  assert.equal(validate(r).ok,true);
  assert.equal(r.sourceSnapshots[0].digestAuthority,'claim-only');
  assert.notEqual(r.sourceSnapshots[0].inputSha256,r.sourceSnapshots[0].claimedWorkbookSha256);
  r.sourceSnapshots[0].digestAuthority='auto-trusted';
  assert.equal(validate(r).code,'INVALID_SOURCE_SNAPSHOT');

  const wrong=deep(baseline);wrong.sourceSnapshots[0].sections[0].status='complete';
  assert.equal(validate(wrong).code,'INVALID_SOURCE_SNAPSHOT');
});
await test('pending QA is not approved by source import or separate reviewed evidence',async()=>{
  assert.equal(baseline.findings[0].status,'pending');
  const r=deep(baseline);r.reviewDecisions[0].evidenceIds=['imaginary-proof-that-does-not-exist'];
  assert.equal(validate(r).code,'INVALID_REVIEW_DECISION');
  r.reviewDecisions[0].evidenceIds=['invented-proof-detail'];
  assert.equal(validate(r).ok,true);assert.equal(r.findings[0].status,'pending');
});
await test('review decisions require exact target, prior revision and private audit receipt',async()=>{
  let r=deep(baseline);r.reviewDecisions[0].expectedRevision=2;
  assert.equal(validate(r).code,'INVALID_REVIEW_DECISION');
  r=deep(baseline);r.audit=[];
  assert.equal(validate(r).code,'REVIEW_AUDIT_MISSING');
  r=deep(baseline);r.reviewDecisions.push({...deep(r.reviewDecisions[0]),id:'another-decision'});
  assert.equal(validate(r).code,'INVALID_REVIEW_DECISION');
});
await test('delivered historical evidence does not establish current verified-live availability',async()=>{
  assert.equal(baseline.channelEvents[0].status,'delivered');
  assert.equal(baseline.evidence.find(x=>x.id==='invented-proof-release').kind,'historical-distributor');
  const r=deep(baseline);r.channelEvents[0].status='verified-live';
  assert.equal(validate(r).code,'LIVE_REQUIRES_PLATFORM_CHECK');
  r.channelEvents[0].status='unknown';assert.equal(validate(r).ok,true);
});
await test('version, parent revision, unsupported shapes and missing links reject',async()=>{
  let r=deep(baseline);r.schema='source-v2';
  assert.equal(validate(r).code,'INVALID_ROOT_OR_REVISION');
  r=deep(baseline);r.parentRevision=0;
  assert.equal(validate(r).code,'INVALID_ROOT_OR_REVISION');
  r=deep(baseline);r.evidence[0].targetId='no-such-appearance';
  assert.equal(validate(r).code,'INVALID_EVIDENCE');
});
await test('same authenticated revision replays idempotently and same revision conflicting contents block',async()=>{
  const expected={registryId:baseline.registryId,revision:baseline.revision,fingerprint:fingerprint(baseline)};
  assert.deepEqual(previewComparison(baseline,deep(baseline),expected),
    {ok:true,status:'same-verified-revision',writes:0});
  const r=deep(baseline);r.recordings[0].title='Changed entirely invented metadata';
  assert.equal(previewComparison(baseline,r,expected).code,'SAME_REVISION_CONFLICT');
});
await test('foreign, rollback and stale current revision are always rejected',async()=>{
  const expected={registryId:baseline.registryId,revision:baseline.revision,fingerprint:fingerprint(baseline)};
  let r=deep(baseline);r.registryId='different-invented-registry';
  assert.equal(previewComparison(baseline,r,expected).code,'FOREIGN_REGISTRY');
  r=deep(baseline);r.revision=1;r.parentRevision=0;
  // A genuine older revision cannot contain a decision/audit made at later revision 2.
  r.reviewDecisions=[];r.audit=[];
  assert.equal(validate(r).ok,true);
  assert.equal(previewComparison(baseline,r,expected).code,'ROLLBACK_BLOCKED');
  assert.equal(previewComparison(baseline,baseline,{...expected,revision:1}).code,'STALE_CURRENT');
});
await test('newer revision remains a review proposal, never automatic activation',async()=>{
  const expected={registryId:baseline.registryId,revision:baseline.revision,fingerprint:fingerprint(baseline)};
  const r=deep(baseline);r.revision=3;r.parentRevision=2;
  r.recordings.push({id:'invented-commercial-rec-C',title:'Entirely fictional new version',version:null,isrc:null});
  const plan=previewComparison(baseline,r,expected);
  assert.equal(plan.status,'requires-explicit-owner-review');
  assert.deepEqual(plan.entityDelta,{recordings:1,releases:0,appearances:0});
  assert.equal(plan.writes,0);assert.equal(plan.automaticActivation,false);
});
await test('evidence payload and exact source coverage fields are mandatory private registry content',async()=>{
  let r=deep(baseline);
  delete r.evidence[0].payload;
  assert.equal(validate(r).code,'INVALID_EVIDENCE');
  r=deep(baseline);r.evidence[0].observedAt='not-a-date';
  assert.equal(validate(r).code,'INVALID_EVIDENCE');
  r=deep(baseline);delete r.sourceSnapshots[0].sections[0].bodyPreservation;
  assert.equal(validate(r).code,'INVALID_SOURCE_SNAPSHOT');
});
await test('real AEAD seals and reopens ONLY an invented inner commercial registry in memory',async()=>{
  const sealed=await sealInvented(baseline);
  const authenticated=await openInvented(sealed,password);
  assert.equal(authenticated.ok,true);
  assert.equal(authenticated.meta.fingerprint,baselineProof.fingerprint);
  assert.ok(!sealed.includes('An imaginary echo'));
  assert.ok(!sealed.includes('invented-proof-detail'));
  assert.ok(!sealed.includes('fictional-qa-A'));
  assert.ok(!sealed.includes('exact fictional detail'));
  assert.ok(!sealed.includes('invented-private-source.json'));
  assert.equal(authenticated.registry.evidence[0].payload,'{"Invented note":"exact fictional detail"}');
  assert.equal(authenticated.registry.sourceSnapshots[0].sections[0].bodyPreservation,'normalized-or-counted-only');
  assert.deepEqual(Object.keys(JSON.parse(sealed)),['header','ciphertext']);
});
await test('new encrypted backup candidates receive fresh salt/nonce, decode same private revision',async()=>{
  const a=await sealInvented(baseline),b=await sealInvented(baseline);
  assert.notEqual(JSON.parse(a).header.salt,JSON.parse(b).header.salt);
  assert.notEqual(JSON.parse(a).header.nonce,JSON.parse(b).header.nonce);
  const aa=await openInvented(a,password),bb=await openInvented(b,password);
  assert.equal(aa.ok,true);assert.equal(bb.ok,true);
  assert.equal(aa.meta.fingerprint,bb.meta.fingerprint);
  // These are TWO IN-MEMORY ciphertexts, not two independently stored real backups.
});
await test('wrong password, tag mutation and header tampering preserve current state',async()=>{
  const sealed=await sealInvented(baseline);
  const untouched=deep(baseline);
  const expected={registryId:baseline.registryId,revision:baseline.revision,fingerprint:fingerprint(baseline)};
  assert.equal((await previewSealedRestore(()=>baseline,sealed,'wrong invented secret',expected)).code,'CANNOT_VERIFY');
  const payload=JSON.parse(sealed),cipher=Buffer.from(payload.ciphertext,'base64url');cipher[0]^=1;
  payload.ciphertext=enc64(cipher);
  assert.equal((await previewSealedRestore(()=>baseline,JSON.stringify(payload),password,expected)).code,'CANNOT_VERIFY');
  const header=JSON.parse(sealed);header.header.iterations++;
  assert.equal((await previewSealedRestore(()=>baseline,JSON.stringify(header),password,expected)).code,'CANNOT_VERIFY');
  assert.deepEqual(baseline,untouched);
});
await test('foreign authenticated package and stale async import fail without replacing memory',async()=>{
  const expected={registryId:baseline.registryId,revision:baseline.revision,fingerprint:fingerprint(baseline)};
  const foreign=deep(baseline);foreign.registryId='other-invented-registry';
  const sealed=await sealInvented(foreign);
  assert.equal((await previewSealedRestore(()=>baseline,sealed,password,expected)).code,'FOREIGN_REGISTRY');
  let current=baseline;
  const authentic=await sealInvented(baseline);
  // The await boundary is intentionally followed by an authoritative current reread.
  const pending=previewSealedRestore(()=>current,authentic,password,expected);
  current=deep(baseline);current.revision=3;current.parentRevision=2;
  assert.equal((await pending).code,'STALE_CURRENT');
  assert.equal(current.revision,3);
});
await test('oversized KDF/unknown schema reject before expensive derivation or activation',async()=>{
  const raw=await sealInvented(baseline);
  const before=derives,tooMuch=JSON.parse(raw);
  tooMuch.header.iterations=1200001;
  assert.equal((await openInvented(JSON.stringify(tooMuch),password)).code,'CANNOT_VERIFY');
  assert.equal(derives,before);
  const r=deep(baseline);r.schema='catalogue-readonly-seed-v2';
  assert.equal((await sealInvented(r)).code,'INVALID_SOURCE_REGISTRY');
});
console.log('A2.4-C/A fictional C4: '+cases+' pure schema/authenticated in-memory restore checks PASS; ZERO actual files/network/browser Storage, owner source, production runtime or commercial write.');
}

export { validate as validateC4Registry, fingerprint as fingerprintC4Registry, sealInvented as sealC4Registry, openInvented as openC4Registry, previewComparison as previewC4Comparison };
