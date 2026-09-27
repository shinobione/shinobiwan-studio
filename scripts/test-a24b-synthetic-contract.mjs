// A2.4-B: independently fictional, Node-only contract rehearsal.
// NOT a production importer, exporter, source converter, storage layer or Studio runtime.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const reject = code => ({ status: 'rejected', code });
const key = (...items) => JSON.stringify(items);
const str = x => typeof x === 'string' && x.trim().length > 0 && x.length <= 160;
const positive = x => Number.isSafeInteger(x) && x > 0;
const nullable = x => x === null || str(x);

function validateEvidenceProjection(seed) {
  if (!seed || seed.schemaVersion !== 'catalogue-readonly-seed-v2') return reject('UNSUPPORTED_SCHEMA');
  if (!Array.isArray(seed.releases) || !Array.isArray(seed.appearances) || !Array.isArray(seed.detailedDistributorEvidence) ||
      !Array.isArray(seed.sectionCoverage) || !Number.isSafeInteger(seed.detailedCount) || seed.detailedCount < 0)
    return reject('INVALID_SHAPE');
  if (seed.detailedCount !== seed.detailedDistributorEvidence.length) return reject('DETAIL_COUNT_CONFLICT');
  if (seed.sectionCoverage.length !== 10 || new Set(seed.sectionCoverage.map(s => s?.section)).size !== 10 ||
      !seed.sectionCoverage.every(s => str(s?.section) && Number.isSafeInteger(s?.sourceRows) && s.sourceRows >= 0 &&
        ['represented', 'partial', 'omitted', 'contradictory', 'unverified'].includes(s?.status))) return reject('COVERAGE_INVALID');

  const releases = new Map(), sourceReleases = new Map(), appearances = new Map(), positions = new Map(), sourceProofs = new Set();
  for (const r of seed.releases) {
    if (!str(r?.id) || !str(r.source) || !str(r.sourceId)) return reject('RELEASE_SHAPE');
    const sourceKey = key(r.source, r.sourceId);
    if (releases.has(r.id) || sourceReleases.has(sourceKey)) return reject('DUPLICATE_RELEASE_IDENTITY');
    releases.set(r.id, r); sourceReleases.set(sourceKey, r);
  }
  for (const a of seed.appearances) {
    if (!str(a?.id) || !str(a.releaseId) || (a.recordingId !== null && !str(a.recordingId)) ||
        !positive(a.position) || !nullable(a.displayTitle) || !nullable(a.isrcObserved)) return reject('APPEARANCE_SHAPE');
    if (!releases.has(a.releaseId)) return reject('ORPHAN_APPEARANCE');
    const owner = key(a.releaseId, a.position);
    if (appearances.has(a.id) || positions.has(owner)) return reject('DUPLICATE_APPEARANCE_IDENTITY');
    appearances.set(a.id, a); positions.set(owner, a);
  }

  const links = [], findings = [];
  for (const proof of seed.detailedDistributorEvidence) {
    if (!str(proof?.id) || !str(proof.sourceNamespace) || !str(proof.sourceRecordAlias) ||
        !str(proof.sourceReleaseId) || !str(proof.releaseId) || !str(proof.appearanceId) || !positive(proof.position) ||
        !nullable(proof.displayTitle) || !nullable(proof.isrcObserved) || !nullable(proof.statusText))
      return reject('DETAIL_SHAPE');
    const alias = key(proof.sourceNamespace, proof.sourceRecordAlias);
    if (sourceProofs.has(alias)) return reject('DUPLICATE_DETAIL_SOURCE');
    sourceProofs.add(alias);
    const release = sourceReleases.get(key(proof.sourceNamespace, proof.sourceReleaseId));
    if (!release || release.id !== proof.releaseId) return reject('DETAIL_RELEASE_REFERENCE');
    const appearance = positions.get(key(release.id, proof.position));
    if (!appearance || appearance.id !== proof.appearanceId ||
        appearances.get(proof.appearanceId) !== appearance || appearance.releaseId !== release.id)
      return reject('DETAIL_APPEARANCE_REFERENCE');
    // Corroboration only: neither title nor ISRC selects an identity or resolves a review decision.
    if (proof.displayTitle !== null && appearance.displayTitle !== null &&
        proof.displayTitle !== appearance.displayTitle) findings.push('DISPLAY_TITLE_CONTRADICTION');
    if (proof.isrcObserved !== null && appearance.isrcObserved !== null &&
        proof.isrcObserved.replace(/[-\s]/g, '').toUpperCase() !== appearance.isrcObserved.replace(/[-\s]/g, '').toUpperCase())
      findings.push('ISRC_CORROBORATION_CONTRADICTION');
    links.push({ evidenceId: proof.id, appearanceId: appearance.id, releaseId: release.id,
      // Preserve nullable source association as nullable. Evidence never creates a Recording.
      recordingId: appearance.recordingId });
  }
  return { status: 'accepted', summary: { releases: releases.size, appearances: appearances.size,
    detailedEvidence: links.length, unboundAppearances: [...appearances.values()].filter(a => a.recordingId === null).length,
    coverageSections: seed.sectionCoverage.length, pendingEvidenceFindings: findings.length }, links, findings };
}

function dryRunAliases(before, incoming) {
  const normalize = rows => {
    if (!Array.isArray(rows)) return null;
    const index = new Map();
    for (const r of rows) {
      if (!str(r?.namespace) || !str(r?.sourceId) || !str(r?.evidenceVersion) || !str(r?.targetId)) return null;
      const id = key(r.namespace, r.sourceId);
      if (index.has(id)) return null;
      index.set(id, r);
    }
    return index;
  };
  const oldIndex = normalize(before), newIndex = normalize(incoming);
  if (!oldIndex || !newIndex) return reject('ALIAS_SHAPE_OR_DUPLICATE');
  const categories = { unchanged: 0, proposedNew: 0, sourceChanged: 0, missingInNewSnapshot: 0, conflictingAlias: 0 };
  for (const [alias, current] of newIndex) {
    const previous = oldIndex.get(alias);
    if (!previous) categories.proposedNew++;
    else if (previous.targetId !== current.targetId) categories.conflictingAlias++;
    else if (previous.evidenceVersion !== current.evidenceVersion) categories.sourceChanged++;
    else categories.unchanged++;
  }
  for (const alias of oldIndex.keys()) if (!newIndex.has(alias)) categories.missingInNewSnapshot++;
  // Missing != deleted, changed != approved, conflicting != automatically reconciled.
  return { status: 'proposal-only', ...categories, writes: 0, deletions: 0, approvals: 0 };
}

let cases = 0;
const test = (label, run) => { run(); cases++; console.log('A2.4-B synthetic: ' + label + ' PASS'); };
const proof = (id, releaseId, sourceReleaseId, appearanceId, position, patch = {}) =>
  ({ id, sourceNamespace: 'Fictional Distributor', sourceRecordAlias: id, sourceReleaseId, releaseId, appearanceId,
    position, displayTitle: 'Invented example', isrcObserved: 'FAKE-CODE', statusText: 'Historical observation', ...patch });
const make = () => ({
  schemaVersion: 'catalogue-readonly-seed-v2', detailedCount: 3,
  releases: [{ id: 'rel-A', source: 'Fictional Distributor', sourceId: 'source-A' },
    { id: 'rel-B', source: 'Fictional Distributor', sourceId: 'source-B' }],
  appearances: [
    { id: 'app-A1', releaseId: 'rel-A', recordingId: 'rec-A', position: 1, displayTitle: 'Invented example', isrcObserved: 'FAKE-CODE' },
    { id: 'app-B1', releaseId: 'rel-B', recordingId: 'rec-A', position: 1, displayTitle: 'Invented example', isrcObserved: 'FAKE-CODE' },
    { id: 'app-A2', releaseId: 'rel-A', recordingId: null, position: 2, displayTitle: 'Invented example', isrcObserved: null },
  ],
  detailedDistributorEvidence: [proof('p-1', 'rel-A', 'source-A', 'app-A1', 1),
    proof('p-2', 'rel-B', 'source-B', 'app-B1', 1),
    proof('p-3', 'rel-A', 'source-A', 'app-A2', 2, { isrcObserved: null })],
  sectionCoverage: Array.from({ length: 10 }, (_, i) => ({ section: 'fictional-section-' + i, sourceRows: i,
    status: i < 8 ? 'represented' : 'omitted' })),
});
const changed = fn => { const input = structuredClone(make()); fn(input); return validateEvidenceProjection(input); };
test('exact release/position enriches appearances, never duplicates', () => {
  const r = validateEvidenceProjection(make()); assert.equal(r.status, 'accepted');
  assert.deepEqual(r.summary, { releases: 2, appearances: 3, detailedEvidence: 3, unboundAppearances: 1, coverageSections: 10, pendingEvidenceFindings: 0 });
  assert.equal(r.links[0].appearanceId, 'app-A1'); assert.equal(r.links[1].appearanceId, 'app-B1'); assert.equal(r.links[2].recordingId, null);
});
test('unsupported version and mismatched count fail closed', () => {
  assert.equal(changed(d => d.schemaVersion = 'catalogue-readonly-seed-v1').code, 'UNSUPPORTED_SCHEMA');
  assert.equal(changed(d => d.detailedCount++).code, 'DETAIL_COUNT_CONFLICT');
});
test('source namespace, source Release and exact Release agree', () => {
  assert.equal(changed(d => d.detailedDistributorEvidence[0].sourceNamespace = 'Other Distributor').code, 'DETAIL_RELEASE_REFERENCE');
  assert.equal(changed(d => d.detailedDistributorEvidence[0].sourceReleaseId = 'source-B').code, 'DETAIL_RELEASE_REFERENCE');
  assert.equal(changed(d => d.detailedDistributorEvidence[0].releaseId = 'rel-B').code, 'DETAIL_RELEASE_REFERENCE');
});
test('wrong, orphan, null and ambiguously owned position never binds', () => {
  assert.equal(changed(d => d.detailedDistributorEvidence[0].appearanceId = 'app-B1').code, 'DETAIL_APPEARANCE_REFERENCE');
  assert.equal(changed(d => d.detailedDistributorEvidence[0].position = 9).code, 'DETAIL_APPEARANCE_REFERENCE');
  assert.equal(changed(d => d.appearances[0].position = null).code, 'APPEARANCE_SHAPE');
  assert.equal(changed(d => d.appearances[1].releaseId = 'rel-A').code, 'DUPLICATE_APPEARANCE_IDENTITY');
});
test('duplicate release, appearance and evidence source are blocked', () => {
  assert.equal(changed(d => d.releases.push({ id: 'rel-C', source: 'Fictional Distributor', sourceId: 'source-A' })).code, 'DUPLICATE_RELEASE_IDENTITY');
  assert.equal(changed(d => d.appearances.push({ ...d.appearances[0], id: 'app-other' })).code, 'DUPLICATE_APPEARANCE_IDENTITY');
  assert.equal(changed(d => d.detailedDistributorEvidence[1].sourceRecordAlias = 'p-1').code, 'DUPLICATE_DETAIL_SOURCE');
});
test('multiple distinct proofs may refer to same Appearance but never increment it', () => {
  const r = changed(d => { d.detailedDistributorEvidence.push(proof('p-4', 'rel-A', 'source-A', 'app-A1', 1)); d.detailedCount++; });
  assert.equal(r.status, 'accepted'); assert.equal(r.summary.appearances, 3); assert.equal(r.summary.detailedEvidence, 4);
});
test('title/ISRC disagreements are findings only, never identity selectors', () => {
  const r = changed(d => { d.detailedDistributorEvidence[0].displayTitle = 'Different invented name'; d.detailedDistributorEvidence[1].isrcObserved = 'ANOTHER-FAKE-CODE'; });
  assert.equal(r.status, 'accepted'); assert.deepEqual(r.findings, ['DISPLAY_TITLE_CONTRADICTION', 'ISRC_CORROBORATION_CONTRADICTION']);
  assert.equal(r.links[0].appearanceId, 'app-A1'); assert.equal(r.links[1].appearanceId, 'app-B1');
});
test('section coverage is explicit, distinct and countable', () => {
  assert.equal(changed(d => d.sectionCoverage.pop()).code, 'COVERAGE_INVALID');
  assert.equal(changed(d => d.sectionCoverage[1].section = d.sectionCoverage[0].section).code, 'COVERAGE_INVALID');
  assert.equal(changed(d => d.sectionCoverage[0].status = 'fully-live').code, 'COVERAGE_INVALID');
});
test('row order cannot change exact relationships', () => {
  const original = validateEvidenceProjection(make()), shuffled = make();
  shuffled.releases.reverse(); shuffled.appearances.reverse(); shuffled.detailedDistributorEvidence.reverse();
  const r = validateEvidenceProjection(shuffled); assert.equal(r.status, 'accepted');
  assert.deepEqual(r.links.map(x => x.appearanceId).sort(), original.links.map(x => x.appearanceId).sort());
});
test('alias proposal is deterministic and never deletion or write', () => {
  const before = [{ namespace: 'fictional', sourceId: 'a', targetId: 'opaque-A', evidenceVersion: 'v1' },
    { namespace: 'fictional', sourceId: 'b', targetId: 'opaque-B', evidenceVersion: 'v1' }];
  const after = [before[0], { ...before[1], evidenceVersion: 'v2' }, { namespace: 'fictional', sourceId: 'c', targetId: 'opaque-C', evidenceVersion: 'v1' }];
  const r = dryRunAliases(before, after), reordered = dryRunAliases([...before].reverse(), [...after].reverse());
  assert.deepEqual(r, reordered); assert.deepEqual(r, { status: 'proposal-only', unchanged: 1, proposedNew: 1, sourceChanged: 1, missingInNewSnapshot: 0, conflictingAlias: 0, writes: 0, deletions: 0, approvals: 0 });
  assert.equal(dryRunAliases(before, [after[0]]).missingInNewSnapshot, 1);
  assert.equal(dryRunAliases(before, [{ ...before[0], targetId: 'other' }]).conflictingAlias, 1);
  assert.equal(dryRunAliases(before, [before[0], before[0]]).code, 'ALIAS_SHAPE_OR_DUPLICATE');
});
test('accepted Build122 v1 parser still fails closed on v2', () => {
  const source = fs.readFileSync('src/catalogue/import.ts', 'utf8'), js = ts.transpileModule(source,
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(js, { exports, TextEncoder });
  assert.equal(exports.parseCatalogue(JSON.stringify(make()), 'a'.repeat(64)).status, 'rejected');
  assert.equal(exports.parseCatalogue(JSON.stringify(make()), 'a'.repeat(64)).findings[0].code, 'UNSUPPORTED_SCHEMA');
});
test('prototype avoids network, browser Storage and private-source fixture paths', () => {
  const source = fs.readFileSync('scripts/test-a24b-synthetic-contract.mjs', 'utf8');
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon|dangerouslySetInnerHTML|https?:\/\/|\.xlsx|\.zip|catalogue-private/);
});
console.log('A2.4-B synthetic contract PASS: ' + cases + ' independently fictional, Node-only cases. No private workbook or live service used.');
