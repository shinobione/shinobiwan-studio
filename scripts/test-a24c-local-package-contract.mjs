// A2.4-C/A · independently fictional, pure Node-only C1 rehearsal.
// NOT imported into Studio. NO crypto, downloads, file/Storage/network I/O, real source or commits.
// Every operation returns a proposal; this deliberately proves ZERO durable writes.
import assert from 'node:assert/strict';

const reject = code => ({ status: 'rejected', code, writes: 0 });
const key = (namespace, kind, sourceId) => JSON.stringify([namespace, kind, sourceId]);
const present = v => typeof v === 'string' && v.length > 0 && v.length <= 160 && !/[\x00-\x1f]/.test(v);
const rev = v => Number.isSafeInteger(v) && v >= 0;
const pos = v => Number.isSafeInteger(v) && v > 0;
const kinds = new Set(['recording', 'release', 'appearance']);
const aliasKey = a => key(a.sourceNamespace, a.kind, a.sourceId);
const releaseKey = a => key(a.sourceNamespace, 'release', a.sourceId);

function registryIndex(registry) {
  if (!registry || !present(registry.registryId) || !rev(registry.revision) ||
      !Array.isArray(registry.aliases) || !Array.isArray(registry.seenDigests) ||
      !Array.isArray(registry.operations) || !registry.seenDigests.every(present))
    return null;
  const idx = new Map(), targets = new Map(), operations = new Map();
  for (const row of registry.aliases) {
    if (!row || !present(row.sourceNamespace) || !kinds.has(row.kind) ||
        !present(row.sourceId) || !present(row.sourceRevision) || !present(row.targetId)) return null;
    const k = aliasKey(row);
    if (idx.has(k)) return null;
    // Same reviewed entity may have multiple source aliases of its own kind, never across kinds.
    if (targets.has(row.targetId) && targets.get(row.targetId) !== row.kind) return null;
    targets.set(row.targetId, row.kind); idx.set(k, row);
  }
  if (new Set(registry.seenDigests).size !== registry.seenDigests.length) return null;
  for (const operation of registry.operations) {
    if (!operation || !present(operation.operationId) || !present(operation.fingerprint) ||
        operations.has(operation.operationId)) return null;
    operations.set(operation.operationId, operation.fingerprint);
  }
  return { aliases: idx, operations };
}

function sourceProjection(snapshot) {
  if (!snapshot || !present(snapshot.snapshotId) || !present(snapshot.digest) ||
      !Array.isArray(snapshot.aliases) || !Array.isArray(snapshot.appearances) ||
      !Array.isArray(snapshot.detailEvidence)) return reject('INVALID_SNAPSHOT');
  const aliases = new Map();
  for (const a of snapshot.aliases) {
    if (!a || !present(a.sourceNamespace) || !kinds.has(a.kind) || !present(a.sourceId) ||
        !present(a.sourceRevision) || !(a.claimedTargetId === null || present(a.claimedTargetId)))
      return reject('INVALID_SOURCE_ALIAS');
    const k = aliasKey(a);
    if (aliases.has(k)) return reject('DUPLICATE_SOURCE_ALIAS');
    aliases.set(k, a);
  }
  const appearances = new Map(), occupied = new Set();
  for (const a of snapshot.appearances) {
    if (!a || !present(a.id) || !present(a.sourceNamespace) ||
        !present(a.sourceReleaseId) || !pos(a.position) ||
        !(a.recordingSourceId === null || present(a.recordingSourceId)) ||
        !aliases.has(key(a.sourceNamespace, 'release', a.sourceReleaseId)) ||
        !aliases.has(key(a.sourceNamespace, 'appearance', a.id)) ||
        (a.recordingSourceId !== null && !aliases.has(key(a.sourceNamespace, 'recording', a.recordingSourceId))))
      return reject('INVALID_APPEARANCE_EDGE');
    const identity = key(a.sourceNamespace, 'appearance', a.id);
    const placement = JSON.stringify([a.sourceNamespace, a.sourceReleaseId, a.position]);
    if (appearances.has(identity) || occupied.has(placement)) return reject('DUPLICATE_APPEARANCE_EDGE');
    appearances.set(identity, a); occupied.add(placement);
  }
  const proofs = new Set();
  for (const e of snapshot.detailEvidence) {
    if (!e || !present(e.evidenceId) || !present(e.sourceNamespace) ||
        !present(e.sourceReleaseId) || !present(e.appearanceId) || !pos(e.position))
      return reject('INVALID_DETAIL');
    const proofKey = key(e.sourceNamespace, 'evidence', e.evidenceId);
    if (proofs.has(proofKey)) return reject('DUPLICATE_DETAIL');
    proofs.add(proofKey);
    const a = appearances.get(key(e.sourceNamespace, 'appearance', e.appearanceId));
    // No row index, title, ISRC or UPC is allowed to repair the wrong exact Release + position.
    if (!a || a.sourceReleaseId !== e.sourceReleaseId || a.position !== e.position)
      return reject('DETAIL_EXACT_LINK_CONFLICT');
  }
  return { status: 'valid', aliases, appearances, evidenceCount: proofs.size };
}

function previewImport(registry, snapshot, expectedRevision) {
  const old = registryIndex(registry);
  if (!old) return reject('INVALID_REGISTRY');
  if (expectedRevision !== registry.revision) return reject('STALE_REVISION');
  const fresh = sourceProjection(snapshot);
  if (fresh.status === 'rejected') return fresh;
  if (registry.seenDigests.includes(snapshot.digest))
    return { status: 'already-seen', unchanged: 0, sourceChanged: 0, proposedNew: 0,
      missingInNewSnapshot: 0, unbound: 0, detailEvidence: 0, writes: 0, deletions: 0, approvals: 0 };

  const result = { status: 'proposal-only', unchanged: 0, sourceChanged: 0, proposedNew: 0,
    missingInNewSnapshot: 0, unbound: [...fresh.appearances.values()].filter(a => a.recordingSourceId === null).length,
    appearances: fresh.appearances.size, detailEvidence: fresh.evidenceCount, writes: 0, deletions: 0, approvals: 0 };
  for (const [id, a] of fresh.aliases) {
    const previous = old.aliases.get(id);
    if (!previous) {
      // A new source alias cannot assign a durable target ID without a separate reviewed migration.
      if (a.claimedTargetId !== null) return reject('UNREVIEWED_NEW_TARGET');
      result.proposedNew++;
    } else {
      if (a.claimedTargetId !== null && a.claimedTargetId !== previous.targetId)
        return reject('CONFLICTING_TARGET_CLAIM');
      if (a.sourceRevision !== previous.sourceRevision) result.sourceChanged++;
      else result.unchanged++;
    }
  }
  for (const id of old.aliases.keys()) if (!fresh.aliases.has(id)) result.missingInNewSnapshot++;
  return result;
}

function previewDecision(registry, operationId, fingerprint, expectedRevision) {
  const old = registryIndex(registry);
  if (!old) return reject('INVALID_REGISTRY');
  if (expectedRevision !== registry.revision) return reject('STALE_REVISION');
  if (!present(operationId) || !present(fingerprint)) return reject('INVALID_OPERATION');
  if (old.operations.has(operationId))
    return old.operations.get(operationId) === fingerprint
      ? { status: 'already-proposed', writes: 0 }
      : reject('OPERATION_ID_CONFLICT');
  return { status: 'review-required', expectedRevision, writes: 0, approvals: 0 };
}

// This receives a fictional ALREADY AUTHENTICATED registry model from a separate future boundary.
// C1 does not decrypt, authenticate, save, restore or prove any cryptographic behavior.
function previewRestore(current, candidate, expectedRevision) {
  if (!registryIndex(current) || !registryIndex(candidate)) return reject('INVALID_REGISTRY');
  if (expectedRevision !== current.revision) return reject('STALE_REVISION');
  if (current.registryId !== candidate.registryId) return reject('FOREIGN_REGISTRY');
  return { status: 'review-required', currentRevision: current.revision,
    candidateRevision: candidate.revision, requiresExplicitConfirmation: true, writes: 0 };
}

let cases = 0;
const test = (label, run) => { run(); cases++; console.log('A2.4-C/A fictional C1: ' + label + ' PASS'); };
const fakeRegistry = () => ({
  registryId: 'fictional-registry', revision: 4,
  aliases: [
    { sourceNamespace: 'Fictional A', kind: 'recording', sourceId: 'source-rec', sourceRevision: 'old', targetId: 'opaque-rec' },
    { sourceNamespace: 'Fictional A', kind: 'release', sourceId: 'source-rel', sourceRevision: 'old', targetId: 'opaque-rel' },
    { sourceNamespace: 'Fictional A', kind: 'appearance', sourceId: 'source-app', sourceRevision: 'old', targetId: 'opaque-app' },
  ],
  seenDigests: ['fictional-prior-digest'],
  operations: [{ operationId: 'fictional-operation', fingerprint: 'fictional-fingerprint' }],
});
const fakeSource = () => ({
  snapshotId: 'fictional-new-snapshot', digest: 'fictional-new-digest',
  aliases: fakeRegistry().aliases.map(a => ({ sourceNamespace: a.sourceNamespace, kind: a.kind,
    sourceId: a.sourceId, sourceRevision: a.sourceRevision, claimedTargetId: null, title: 'Same invented title' })),
  appearances: [{ id: 'source-app', sourceNamespace: 'Fictional A', sourceReleaseId: 'source-rel', position: 1,
    recordingSourceId: 'source-rec' }],
  detailEvidence: [{ evidenceId: 'fictional-proof-1', sourceNamespace: 'Fictional A',
    sourceReleaseId: 'source-rel', appearanceId: 'source-app', position: 1 }],
});
const mutate = fn => { const source = fakeSource(); fn(source); return previewImport(fakeRegistry(), source, 4); };

test('exact source replay is idempotent with no proposed operations', () => {
  const r = mutate(d => { d.digest = 'fictional-prior-digest'; });
  assert.equal(r.status, 'already-seen'); assert.equal(r.writes, 0); assert.equal(r.deletions, 0);
});
test('identical exact aliases and detail links do not create commercial entities', () => {
  const r = previewImport(fakeRegistry(), fakeSource(), 4);
  assert.equal(r.status, 'proposal-only'); assert.deepEqual([r.unchanged, r.sourceChanged, r.proposedNew, r.missingInNewSnapshot], [3,0,0,0]);
  assert.equal(r.appearances, 1); assert.equal(r.detailEvidence, 1);
  assert.deepEqual([r.writes,r.deletions,r.approvals], [0,0,0]);
});
test('changed, new and missing source aliases remain explicit non-destructive proposals', () => {
  const r = mutate(d => {
    d.aliases.find(a => a.kind === 'recording').sourceRevision = 'new';
    d.aliases = d.aliases.filter(a => a.kind !== 'appearance');
    d.aliases.push({ sourceNamespace:'Fictional B',kind:'recording',sourceId:'different-source',sourceRevision:'new',claimedTargetId:null });
    d.appearances = []; d.detailEvidence = [];
  });
  assert.equal(r.status, 'proposal-only');
  assert.deepEqual([r.unchanged,r.sourceChanged,r.proposedNew,r.missingInNewSnapshot], [1,1,1,1]);
  assert.equal(r.deletions, 0); assert.equal(r.writes, 0);
});
test('source ordering and duplicate human-facing title cannot select a canonical identity', () => {
  const base = previewImport(fakeRegistry(),fakeSource(),4), d = fakeSource();
  d.aliases.reverse(); d.appearances.reverse(); d.detailEvidence.reverse();
  assert.deepEqual(previewImport(fakeRegistry(),d,4),base);
  assert.equal(mutate(d => { d.aliases.push({sourceNamespace:'Fictional B',kind:'recording',sourceId:'new-source',sourceRevision:'new',claimedTargetId:null,title:'Same invented title'}); }).proposedNew,1);
});
test('namespace and kind are part of identity; duplicate aliases fail atomically', () => {
  assert.equal(mutate(d => d.aliases.push({...d.aliases[0]})).code, 'DUPLICATE_SOURCE_ALIAS');
  assert.equal(mutate(d => d.aliases.push({...d.aliases[0], sourceNamespace:'Fictional B', claimedTargetId:null})).proposedNew,1);
  assert.equal(mutate(d => d.aliases.push({...d.aliases[0],kind:'release',sourceId:'another-release',claimedTargetId:null})).proposedNew,1);
});
test('new target claim and changed established target claim never auto-bind', () => {
  assert.equal(mutate(d => d.aliases.push({...d.aliases[0],sourceId:'new',claimedTargetId:'invented-target'})).code,'UNREVIEWED_NEW_TARGET');
  assert.equal(mutate(d => d.aliases[0].claimedTargetId='incorrect-target').code,'CONFLICTING_TARGET_CLAIM');
});
test('unbound association and multiple distinct proofs remain evidence, not extra appearances', () => {
  const r = mutate(d => { d.appearances[0].recordingSourceId = null;
    d.detailEvidence.push({...d.detailEvidence[0],evidenceId:'fictional-proof-2'}); });
  assert.equal(r.status,'proposal-only'); assert.equal(r.unbound,1);
  assert.equal(r.appearances,1); assert.equal(r.detailEvidence,2);
});
test('cross-release/position mistake and duplicate evidence reject instead of guesswork', () => {
  assert.equal(mutate(d => d.detailEvidence[0].position=2).code,'DETAIL_EXACT_LINK_CONFLICT');
  assert.equal(mutate(d => d.detailEvidence[0].sourceReleaseId='wrong').code,'DETAIL_EXACT_LINK_CONFLICT');
  assert.equal(mutate(d => d.detailEvidence.push({...d.detailEvidence[0]})).code,'DUPLICATE_DETAIL');
});
test('stale expected revision blocks preview and Restore proposal, leaving inputs unchanged', () => {
  const registry=fakeRegistry(), snapshot=fakeSource(), baseline=structuredClone(registry), input=structuredClone(snapshot);
  assert.equal(previewImport(registry,snapshot,3).code,'STALE_REVISION');
  assert.equal(previewRestore(registry,registry,3).code,'STALE_REVISION');
  assert.deepEqual(registry,baseline); assert.deepEqual(snapshot,input);
});
test('operation exact replay stays pure while reused conflicting identity is rejected', () => {
  assert.equal(previewDecision(fakeRegistry(),'fictional-operation','fictional-fingerprint',4).status,'already-proposed');
  assert.equal(previewDecision(fakeRegistry(),'fictional-operation','altered-fingerprint',4).code,'OPERATION_ID_CONFLICT');
  const r=previewDecision(fakeRegistry(),'future-operation','new-fingerprint',4);
  assert.equal(r.status,'review-required'); assert.equal(r.writes,0); assert.equal(r.approvals,0);
});
test('Restore preview needs matching registry identity and explicit owner confirmation', () => {
  const current=fakeRegistry(), candidate=structuredClone(current); candidate.revision=2;
  const before=structuredClone(current), r=previewRestore(current,candidate,4);
  assert.equal(r.status,'review-required'); assert.equal(r.requiresExplicitConfirmation,true);
  assert.equal(r.writes,0); assert.deepEqual(current,before);
  candidate.registryId='fictional-other-registry'; assert.equal(previewRestore(current,candidate,4).code,'FOREIGN_REGISTRY');
});
console.log('A2.4-C/A fictional C1: ' + cases + ' proposal-only cases PASS; no crypto/filesystem/Storage/network/runtime and no real source.');
