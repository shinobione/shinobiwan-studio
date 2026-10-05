// A2.4-C / C5b — full synthetic registry -> encrypted disk copies -> restore.
// TEST ONLY. Actual accepted v2 parser + exact C4.3 test-library contract.
// No owner data, runtime import, browser Storage, network, production writer or Build125.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createHash, pbkdf2Sync, createDecipheriv } from 'node:crypto';
import { fixture } from './catalogue-synthetic.mjs';

process.env.A24C_LIBRARY_ONLY = '1';
const {
  validateC4Registry,
  fingerprintC4Registry,
  sealC4Registry,
  openC4Registry,
  previewC4Comparison,
} = await import('./test-a24c-c4-registry-recovery.mjs');
delete process.env.A24C_LIBRARY_ONLY;

const read = p => fs.readFileSync(p, 'utf8');
function load(pathname, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(read(pathname), {
    fileName: pathname,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, TextEncoder,
    require: name => {
      assert.ok(name in dependencies, 'Unexpected C5b dependency: ' + name);
      return dependencies[name];
    },
  });
  return exports;
}
const legacy = load('src/catalogue/import.ts');
const { parseCatalogueInput } = load('src/catalogue/import-v2.ts', { './import': legacy });
const sha = value => createHash('sha256').update(value).digest('hex');
const clone = value => structuredClone(value);
const aliasKey = row => JSON.stringify([row.namespace, row.kind, row.sourceId]);
const inventedPassphrase = 'Entirely invented C5b portable registry phrase; never an owner secret.';

function fictionalV2() {
  const base = fixture();
  base.sourceSheets['2 fiches Amuse vérifiées'] = 2;
  const detailA = {
    evidenceId: 'imaginary-detail-A',
    sourceNamespace: 'Amuse',
    sourceRecordAlias: 'imaginary-evidence-row-A',
    sourceRecordAliasScope: 'workbook-snapshot-only',
    sourceLocator: 'imagined-ledger/detail-A',
    sourceReleaseId: 'release-1',
    releaseId: 'amuse:release-1',
    appearanceId: 'app-1',
    position: 1,
    linkStatus: 'linked',
    linkProof: 'EXACT_SOURCE_RELEASE_AND_POSITION',
    linkIssueCode: null,
    displayTitle: base.appearances[0].displayTitle,
    isrcObserved: base.appearances[0].isrcObserved,
    originalEvidence: { 'Invented note': 'Completely imaginary linked observation' },
    fileNote: 'Fictional historic sheet A',
    statusText: 'Historic only',
    storeSyncText: 'Unknown',
    timecodeVideo: null,
    upcObserved: null,
    evidenceFindingCodes: [],
  };
  const detailB = {
    evidenceId: 'imaginary-detail-B',
    sourceNamespace: 'Amuse',
    sourceRecordAlias: 'imaginary-evidence-row-B',
    sourceRecordAliasScope: 'workbook-snapshot-only',
    sourceLocator: 'imagined-ledger/detail-B',
    sourceReleaseId: 'release-1',
    releaseId: null,
    appearanceId: null,
    position: 1,
    linkStatus: 'unlinked',
    linkProof: null,
    linkIssueCode: 'EXACT_TARGET_NOT_FOUND',
    displayTitle: 'Entirely fictional unlinked observation',
    isrcObserved: null,
    originalEvidence: { 'Invented note': 'Completely imaginary targetless observation' },
    fileNote: 'Fictional historic sheet B',
    statusText: 'Historic only',
    storeSyncText: 'Unknown',
    timecodeVideo: null,
    upcObserved: null,
    evidenceFindingCodes: ['MANUAL_REVIEW_REQUIRED'],
  };
  return {
    ...base,
    schemaVersion: 'catalogue-readonly-seed-v2',
    privateOnly: true,
    exporterContractVersion: 'a24b2-local-0.1.0',
    sourceMethodEvidence: null,
    detailedCount: 2,
    detailedDistributorEvidence: [detailA, detailB],
    sectionCoverage: [
      ...Object.entries(base.sourceSheets).map(([section, sourceRows]) => ({
        section,
        sourceRows,
        status: section === '2 fiches Amuse vérifiées' ? 'represented' : 'partial',
        bodyPreservation: section === '2 fiches Amuse vérifiées' ? 'detailed-evidence' : 'normalized-or-counted-only',
        countMatchesArchivedV1: true,
      })),
      {
        section: 'Invented methods',
        sourceRows: 0,
        status: 'omitted',
        bodyPreservation: 'not-copied',
        countMatchesArchivedV1: null,
      },
      {
        section: 'Invented dashboard',
        sourceRows: 0,
        status: 'omitted',
        bodyPreservation: 'not-copied',
        countMatchesArchivedV1: null,
      },
    ],
    coverageCounts: {
      appearanceRows: base.appearances.length,
      countedSectionsInV1: 8,
      independentDetailedEvidenceRows: 2,
      normalizedRecordsV1: ['recordings','releases','appearances','unverifiedAmuseCandidates','soundcloudRecent','qa']
        .reduce((sum, key) => sum + base[key].length, 0),
      originalSections: 10,
      totalRowsEightCountedSheets: Object.values(base.sourceSheets).reduce((sum, count) => sum + count, 0),
    },
  };
}

function parseSource(root) {
  const raw = JSON.stringify(root);
  return { raw, digest: sha(raw), result: parseCatalogueInput(raw, sha(raw)) };
}

function exactReview(root, parsed) {
  assert.equal(parsed.status, 'accepted');
  const releaseById = new Map(root.releases.map(row => [row.id, row]));
  return {
    sourceInputSha256: parsed.snapshot.source.inputSha256,
    reviewer: 'fictional-owner-reviewer',
    mappings: [
      ...root.recordings.map((row, index) => ({
        kind: 'recording',
        namespace: row.provenance.sheet,
        sourceId: row.id,
        targetId: 'commercial-c5b-rec-' + (index + 1),
        sourceReleaseId: null,
        position: null,
        sourceRecordingId: null,
      })),
      ...root.releases.map((row, index) => ({
        kind: 'release',
        namespace: row.source,
        sourceId: row.sourceId,
        targetId: 'commercial-c5b-rel-' + (index + 1),
        sourceReleaseId: null,
        position: null,
        sourceRecordingId: null,
      })),
      ...root.appearances.map((row, index) => {
        const release = releaseById.get(row.releaseId);
        assert.ok(release);
        return {
          kind: 'appearance',
          namespace: release.source,
          sourceId: row.id,
          targetId: 'commercial-c5b-app-' + (index + 1),
          sourceReleaseId: release.sourceId,
          position: row.position,
          sourceRecordingId: row.recordingId,
        };
      }),
    ],
  };
}

function coverageRows(root) {
  return root.sectionCoverage.map(row => ({
    name: row.section,
    sourceRows: row.sourceRows,
    status: row.status,
    bodyPreservation: row.bodyPreservation,
    countMatchesArchivedV1: row.countMatchesArchivedV1,
  }));
}

function buildRegistry(root, parsed, review) {
  assert.equal(parsed.status, 'accepted');
  assert.equal(review.sourceInputSha256, parsed.snapshot.source.inputSha256);
  assert.equal(review.sourceInputSha256, sha(JSON.stringify(root)));

  const mapping = new Map(review.mappings.map(row => [aliasKey(row), row]));
  assert.equal(mapping.size, review.mappings.length);

  const sectionRows = coverageRows(root);
  assert.deepEqual(sectionRows.map(row => ({
    section: row.name,
    sourceRows: row.sourceRows,
    status: row.status,
    bodyPreservation: row.bodyPreservation,
    countMatchesArchivedV1: row.countMatchesArchivedV1,
  })), root.sectionCoverage);

  const exportSnapshotId = 'snapshot:c5b:export';
  const namespaces = [...new Set(review.mappings.map(row => row.namespace))].sort();
  const snapshotIdByNamespace = new Map(
    namespaces.map(namespace => [namespace, 'snapshot:c5b:ns:' + sha(namespace).slice(0, 16)])
  );
  const makeSnapshot = (id, namespace) => ({
    id,
    namespace,
    sourceRevision: parsed.snapshot.source.inputSha256,
    sourceSchema: parsed.snapshot.source.schema,
    exporterContractVersion: root.exporterContractVersion,
    snapshotDate: parsed.snapshot.source.snapshotDate,
    sourceFile: parsed.snapshot.source.sourceFile,
    inputSha256: parsed.snapshot.source.inputSha256,
    claimedWorkbookSha256: parsed.snapshot.source.claimedWorkbookSha256,
    digestAuthority: 'claim-only',
    coverage: root.sectionCoverage.every(row => row.status === 'represented') ? 'complete' : 'partial',
    sections: clone(sectionRows),
  });
  const sourceSnapshots = [
    makeSnapshot(exportSnapshotId, 'catalogue-export'),
    ...namespaces.map(namespace => makeSnapshot(snapshotIdByNamespace.get(namespace), namespace)),
  ].sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const rootRecordingById = new Map(root.recordings.map(row => [row.id, row]));
  const rootReleaseById = new Map(root.releases.map(row => [row.id, row]));
  const rootAppearanceById = new Map(root.appearances.map(row => [row.id, row]));

  const targetByParsedRecording = new Map();
  const recordings = parsed.snapshot.recordings.map(row => {
    const sourceId = String(row.recordingId).slice('recording:'.length);
    const source = rootRecordingById.get(sourceId);
    assert.ok(source);
    const reviewed = mapping.get(aliasKey({ namespace: source.provenance.sheet, kind: 'recording', sourceId }));
    assert.ok(reviewed);
    targetByParsedRecording.set(String(row.recordingId), {
      kind: 'recording', targetId: reviewed.targetId, namespace: reviewed.namespace,
    });
    return {
      id: reviewed.targetId,
      title: row.title,
      version: row.version,
      isrc: row.isrc,
    };
  }).sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const targetByParsedRelease = new Map();
  const releases = parsed.snapshot.releases.map(row => {
    const source = [...rootReleaseById.values()].find(candidate => 'release:' + candidate.id === String(row.releaseId));
    assert.ok(source);
    const reviewed = mapping.get(aliasKey({ namespace: source.source, kind: 'release', sourceId: source.sourceId }));
    assert.ok(reviewed);
    targetByParsedRelease.set(String(row.releaseId), {
      kind: 'release', targetId: reviewed.targetId, namespace: reviewed.namespace,
    });
    return {
      id: reviewed.targetId,
      title: row.title,
      kind: row.kind,
      upc: row.upc,
      distributor: row.distributor,
      source: row.source,
      historicalDistributionStatus: row.historicalDistributionStatus,
      referenceDate: row.referenceDate,
    };
  }).sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const allAppearances = [...parsed.snapshot.appearances, ...parsed.snapshot.unboundAppearances];
  const targetByParsedAppearance = new Map();
  const appearances = allAppearances.map(row => {
    const sourceId = String(row.appearanceId).slice('appearance:'.length);
    const source = rootAppearanceById.get(sourceId);
    assert.ok(source);
    const sourceRelease = rootReleaseById.get(source.releaseId);
    assert.ok(sourceRelease);
    const reviewed = mapping.get(aliasKey({ namespace: sourceRelease.source, kind: 'appearance', sourceId }));
    assert.ok(reviewed);
    assert.equal(reviewed.sourceReleaseId, sourceRelease.sourceId);
    assert.equal(reviewed.position, source.position);
    assert.equal(reviewed.sourceRecordingId, source.recordingId);
    let recordingId = null;
    if (row.recordingId !== null) {
      const linked = targetByParsedRecording.get(String(row.recordingId));
      assert.ok(linked);
      recordingId = linked.targetId;
    }
    targetByParsedAppearance.set(String(row.appearanceId), {
      kind: 'appearance', targetId: reviewed.targetId, namespace: reviewed.namespace,
    });
    return {
      id: reviewed.targetId,
      releaseId: targetByParsedRelease.get(String(row.releaseId)).targetId,
      position: row.position,
      recordingId,
      displayTitle: row.displayTitle,
      observedIsrc: source.isrcObserved,
      status: row.status,
    };
  }).sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const sourceAliases = review.mappings.map(row => ({
    namespace: row.namespace,
    kind: row.kind,
    sourceId: row.sourceId,
    targetId: row.targetId,
    snapshotId: snapshotIdByNamespace.get(row.namespace),
  })).sort((a,b) => aliasKey(a).localeCompare(aliasKey(b), 'en'));

  const targetByEvidence = new Map();
  const registerEvidenceTarget = (evidenceIds, target) => {
    for (const value of evidenceIds) {
      const key = String(value);
      const previous = targetByEvidence.get(key);
      if (previous) {
        assert.equal(previous.kind, target.kind);
        assert.equal(previous.targetId, target.targetId);
      } else {
        targetByEvidence.set(key, target);
      }
    }
  };
  for (const row of parsed.snapshot.recordings) {
    registerEvidenceTarget(row.evidenceIds, targetByParsedRecording.get(String(row.recordingId)));
  }
  for (const row of parsed.snapshot.releases) {
    registerEvidenceTarget(row.evidenceIds, targetByParsedRelease.get(String(row.releaseId)));
  }
  for (const row of allAppearances) {
    registerEvidenceTarget(row.evidenceIds, targetByParsedAppearance.get(String(row.appearanceId)));
  }

  const detailByEvidenceId = new Map(
    root.detailedDistributorEvidence.map(detail => ['evidence:v2-detail:' + detail.evidenceId, detail])
  );

  const evidence = parsed.snapshot.evidence.map(row => {
    const evidenceId = String(row.evidenceId);
    const detail = detailByEvidenceId.get(evidenceId);
    const target = targetByEvidence.get(evidenceId) ?? null;
    if (detail) {
      const snapshotId = snapshotIdByNamespace.get(detail.sourceNamespace);
      assert.ok(snapshotId);
      if (detail.linkStatus === 'linked') {
        assert.ok(target);
        assert.equal(target.kind, 'appearance');
      } else {
        assert.equal(target, null);
      }
      return {
        id: evidenceId,
        snapshotId,
        kind: 'distributor-detail',
        linkState: detail.linkStatus,
        sourceRecordAlias: detail.sourceRecordAlias,
        sourceLocator: row.sourceLocator,
        observedAt: row.observedAt,
        classification: row.classification ?? null,
        payload: row.note,
        targetKind: target?.kind ?? null,
        targetId: target?.targetId ?? null,
        sourceReleaseId: detail.sourceReleaseId,
        position: detail.position,
        linkIssueCode: detail.linkIssueCode,
      };
    }
    return {
      id: evidenceId,
      snapshotId: target ? snapshotIdByNamespace.get(target.namespace) : exportSnapshotId,
      kind: 'source-record',
      linkState: target ? 'linked' : 'unattached',
      sourceRecordAlias: evidenceId,
      sourceLocator: row.sourceLocator,
      observedAt: row.observedAt,
      classification: row.classification ?? null,
      payload: row.note,
      targetKind: target?.kind ?? null,
      targetId: target?.targetId ?? null,
      sourceReleaseId: null,
      position: null,
      linkIssueCode: null,
    };
  }).sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const evidenceById = new Map(evidence.map(row => [row.id, row]));
  assert.equal(evidenceById.size, evidence.length);

  const findings = parsed.snapshot.findings.map((finding, index) => {
    const evidenceId = finding.evidenceId ? String(finding.evidenceId) : null;
    if (evidenceId) {
      const sourceEvidence = evidenceById.get(evidenceId);
      assert.ok(sourceEvidence);
      return {
        id: 'finding:c5b:' + index + ':' + sha(finding.code + '|' + finding.locator).slice(0, 12),
        scope: 'evidence',
        sourceSnapshotId: sourceEvidence.snapshotId,
        targetKind: null,
        targetId: null,
        evidenceId,
        code: finding.code,
        locator: finding.locator,
        status: 'pending',
      };
    }
    return {
      id: 'finding:c5b:' + index + ':' + sha(finding.code + '|' + finding.locator).slice(0, 12),
      scope: 'source',
      sourceSnapshotId: exportSnapshotId,
      targetKind: null,
      targetId: null,
      evidenceId: null,
      code: finding.code,
      locator: finding.locator,
      status: 'pending',
    };
  }).sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const linkedEvidenceFor = (kind, targetId) => evidence
    .filter(row => row.linkState === 'linked' && row.targetKind === kind && row.targetId === targetId)
    .sort((a,b) => a.id.localeCompare(b.id, 'en'));

  const reviewDecisions = review.mappings.map((row, index) => {
    const matches = linkedEvidenceFor(row.kind, row.targetId);
    assert.ok(matches.length > 0, 'Reviewed identity must have exact linked evidence');
    return {
      id: 'decision:c5b:' + (index + 1),
      operationId: 'operation:c5b:' + (index + 1),
      reviewer: review.reviewer,
      targetKind: row.kind,
      targetId: row.targetId,
      evidenceIds: [matches[0].id],
      disposition: 'initial-reviewed-migration',
      expectedRevision: 0,
      rationale: 'Fictional exact source identity reviewed for synthetic C5b migration.',
    };
  });
  const audit = reviewDecisions.map(row => ({
    operationId: row.operationId,
    revision: 1,
    parentRevision: 0,
    kind: 'initial-migration-review',
    targetId: row.targetId,
  }));

  const channelEvents = parsed.snapshot.channels.map((row, index) => {
    const releaseTarget = targetByParsedRelease.get(String(row.releaseId));
    assert.ok(releaseTarget);
    const channel = String(row.channel).toLowerCase();
    assert.ok(['amuse','spotify','soundcloud','launchpad','studio'].includes(channel));
    return {
      id: 'channel-event:c5b:' + (index + 1),
      channel,
      subjectKind: 'release',
      subjectId: releaseTarget.targetId,
      status: row.status,
      observedAt: parsed.snapshot.source.snapshotDate + 'T00:00:00Z',
      evidenceIds: row.evidenceIds.map(String),
    };
  });

  const registry = {
    schema: 'shinocat-commercial-registry-v1',
    registryId: 'fictional-c5b-owner-registry',
    revision: 1,
    parentRevision: 0,
    sourceSnapshots,
    recordings,
    releases,
    appearances,
    sourceAliases,
    evidence,
    findings,
    reviewDecisions,
    channelEvents,
    audit,
  };

  const validated = validateC4Registry(registry);
  assert.equal(validated.ok, true, 'C5b builder must emit exact C4.3 registry');
  return registry;
}

function emptyRegistry(registryId) {
  return {
    schema: 'shinocat-commercial-registry-v1',
    registryId,
    revision: 0,
    parentRevision: null,
    sourceSnapshots: [],
    recordings: [],
    releases: [],
    appearances: [],
    sourceAliases: [],
    evidence: [],
    findings: [],
    reviewDecisions: [],
    channelEvents: [],
    audit: [],
  };
}

function confirmRestore(current, candidate, expectedCurrent, candidateFingerprint) {
  const plan = previewC4Comparison(current, candidate, expectedCurrent);
  if (!plan.ok || plan.status !== 'requires-explicit-owner-review' ||
      plan.candidateFingerprint !== candidateFingerprint)
    return { ok: false, code: 'RESTORE_NOT_CONFIRMED' };
  return { ok: true, registry: clone(candidate) };
}

let cases = 0;
async function test(name, fn) {
  await fn();
  cases++;
  console.log('A2.4-C/A fictional C5b: ' + name + ' PASS');
}

const source = fictionalV2();
const parsed = parseSource(source);
assert.equal(parsed.result.status, 'accepted');
const review = exactReview(source, parsed.result);
const registry = buildRegistry(source, parsed.result, review);
const registryValidation = validateC4Registry(registry);
assert.equal(registryValidation.ok, true);

await test('actual v2 parser feeds an exact reviewed complete C4.3 registry without runtime code', async () => {
  assert.equal(parsed.result.snapshot.source.schema, 'catalogue-readonly-seed-v2');
  assert.equal(registry.recordings.length, 1);
  assert.equal(registry.releases.length, 1);
  assert.equal(registry.appearances.length, 1);
  assert.equal(registry.sourceAliases.length, 3);
  assert.equal(registry.reviewDecisions.length, 3);
  assert.equal(registry.audit.length, 3);
});

await test('selected-input digest and claimed workbook digest remain distinct claim authorities across namespace snapshots', async () => {
  assert.ok(registry.sourceSnapshots.length >= 3);
  assert.ok(registry.sourceSnapshots.every(row => row.inputSha256 === parsed.digest));
  assert.ok(registry.sourceSnapshots.every(row => row.claimedWorkbookSha256 === source.sourceSha256));
  assert.ok(registry.sourceSnapshots.every(row => row.digestAuthority === 'claim-only'));
  assert.ok(registry.sourceSnapshots.every(row => row.sourceSchema === 'catalogue-readonly-seed-v2'));
  assert.ok(registry.sourceSnapshots.every(row => row.sections.length === source.sectionCoverage.length));
});

await test('exact v2 section coverage is retained without promoting partial or omitted sections', async () => {
  for (const snapshot of registry.sourceSnapshots) {
    assert.deepEqual(snapshot.sections.map(row => ({
      section: row.name,
      sourceRows: row.sourceRows,
      status: row.status,
      bodyPreservation: row.bodyPreservation,
      countMatchesArchivedV1: row.countMatchesArchivedV1,
    })), source.sectionCoverage);
    assert.equal(snapshot.coverage, 'partial');
  }
});

await test('normalized Recording Release and Appearance metadata survive registry construction with no creative link', async () => {
  const parsedRecording = parsed.result.snapshot.recordings[0];
  const parsedRelease = parsed.result.snapshot.releases[0];
  const parsedAppearance = parsed.result.snapshot.appearances[0];
  assert.deepEqual(registry.recordings[0], {
    id: 'commercial-c5b-rec-1', title: parsedRecording.title, version: parsedRecording.version, isrc: parsedRecording.isrc,
  });
  assert.equal(registry.releases[0].kind, parsedRelease.kind);
  assert.equal(registry.releases[0].historicalDistributionStatus, parsedRelease.historicalDistributionStatus);
  assert.equal(registry.appearances[0].displayTitle, parsedAppearance.displayTitle);
  assert.equal(registry.appearances[0].observedIsrc, source.appearances[0].isrcObserved);
  assert.ok(!JSON.stringify(registry).includes('studioTrackLink'));
});

await test('all parser evidence payloads are preserved with linked unlinked or unattached truth and no entity inflation', async () => {
  assert.equal(registry.evidence.length, parsed.result.snapshot.evidence.length);
  const linkedDetail = registry.evidence.find(row => row.id === 'evidence:v2-detail:imaginary-detail-A');
  const unlinkedDetail = registry.evidence.find(row => row.id === 'evidence:v2-detail:imaginary-detail-B');
  assert.equal(linkedDetail.linkState, 'linked');
  assert.equal(linkedDetail.targetKind, 'appearance');
  assert.equal(unlinkedDetail.linkState, 'unlinked');
  assert.equal(unlinkedDetail.targetKind, null);
  assert.equal(unlinkedDetail.targetId, null);
  assert.match(unlinkedDetail.payload, /targetless observation/);
  assert.ok(registry.evidence.some(row => row.linkState === 'unattached'));
  assert.deepEqual([registry.recordings.length, registry.releases.length, registry.appearances.length], [1,1,1]);
});

await test('every parser finding is preserved pending with exact code locator and source/evidence scope', async () => {
  assert.equal(registry.findings.length, parsed.result.snapshot.findings.length);
  const sourcePairs = parsed.result.snapshot.findings.map(row => row.code + '|' + row.locator).sort();
  const registryPairs = registry.findings.map(row => row.code + '|' + row.locator).sort();
  assert.deepEqual(registryPairs, sourcePairs);
  assert.ok(registry.findings.every(row => row.status === 'pending'));
  assert.ok(registry.findings.every(row => row.scope === 'evidence' || row.scope === 'source'));
  assert.ok(registry.findings.some(row => row.code === 'V2_DETAIL_UNLINKED'));
  assert.ok(registry.findings.some(row => row.code === 'DERIVED_SOURCE_COVERAGE_INCOMPLETE'));
});

await test('only exact human-reviewed identities have decisions and audit; imported QA stays pending', async () => {
  assert.equal(registry.reviewDecisions.length, review.mappings.length);
  assert.equal(registry.audit.length, review.mappings.length);
  assert.ok(registry.reviewDecisions.every(row => row.expectedRevision === 0));
  assert.ok(registry.findings.every(row => row.status === 'pending'));
  assert.ok(registry.reviewDecisions.every(row => row.evidenceIds.every(id =>
    registry.evidence.some(e => e.id === id && e.linkState === 'linked' &&
      e.targetKind === row.targetKind && e.targetId === row.targetId))));
});

await test('channel observations remain unknown and cannot become verified-live from historical source data', async () => {
  assert.equal(registry.channelEvents.length, parsed.result.snapshot.channels.length);
  assert.ok(registry.channelEvents.length > 0);
  assert.ok(registry.channelEvents.every(row => row.status === 'unknown'));
  assert.equal(registry.channelEvents.filter(row => row.status === 'verified-live').length, 0);
});

await test('exact C4.3 validator accepts registry and its fingerprint is deterministic before encryption', async () => {
  const first = validateC4Registry(registry);
  const second = validateC4Registry(clone(registry));
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.fingerprint, fingerprintC4Registry(registry));
});

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'shinocat-c5b-fictional-'));
const fileA = path.join(temp, 'fictional-registry-copy-a.scat');
const fileB = path.join(temp, 'fictional-registry-copy-b.scat');
try {
  const sealedA = await sealC4Registry(registry, inventedPassphrase);
  const sealedB = await sealC4Registry(registry, inventedPassphrase);
  assert.equal(typeof sealedA, 'string');
  assert.equal(typeof sealedB, 'string');

  await test('two explicit encryptions use distinct salt nonce and ciphertext for the same registry fingerprint', async () => {
    const a = JSON.parse(sealedA), b = JSON.parse(sealedB);
    assert.notEqual(a.header.salt, b.header.salt);
    assert.notEqual(a.header.nonce, b.header.nonce);
    assert.notEqual(a.ciphertext, b.ciphertext);
  });

  await test('only encrypted registry packages are written to two separate disposable disk files', async () => {
    fs.writeFileSync(fileA, sealedA, { encoding:'utf8', mode:0o600 });
    fs.writeFileSync(fileB, sealedB, { encoding:'utf8', mode:0o600 });
    assert.ok(fs.statSync(fileA).isFile());
    assert.ok(fs.statSync(fileB).isFile());
    assert.notEqual(fs.realpathSync(fileA), fs.realpathSync(fileB));
    assert.deepEqual(fs.readdirSync(temp).sort(), ['fictional-registry-copy-a.scat','fictional-registry-copy-b.scat']);
  });

  await test('both independently reread disk files authenticate to the identical exact C4 registry fingerprint', async () => {
    const a = await openC4Registry(fs.readFileSync(fileA,'utf8'), inventedPassphrase);
    const b = await openC4Registry(fs.readFileSync(fileB,'utf8'), inventedPassphrase);
    assert.equal(a.ok, true);assert.equal(b.ok, true);
    assert.equal(a.meta.fingerprint, registryValidation.fingerprint);
    assert.equal(b.meta.fingerprint, registryValidation.fingerprint);
    // Parser fixtures originate in a VM realm; compare canonical JSON content rather than realm prototypes.
    assert.equal(JSON.stringify(a.registry), JSON.stringify(registry));
    assert.equal(JSON.stringify(b.registry), JSON.stringify(registry));
  });

  await test('one disk package independently cross-decrypts with Node PBKDF2 and OpenSSL AES-GCM', async () => {
    const outer = JSON.parse(fs.readFileSync(fileA,'utf8'));
    const header = outer.header;
    const key = pbkdf2Sync(inventedPassphrase, Buffer.from(header.salt,'base64url'), header.iterations, 32, 'sha256');
    const input = Buffer.from(outer.ciphertext,'base64url');
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(header.nonce,'base64url'));
    decipher.setAAD(Buffer.from(JSON.stringify(header)));
    decipher.setAuthTag(input.subarray(-16));
    const plain = Buffer.concat([decipher.update(input.subarray(0,-16)), decipher.final()]);
    const decoded = JSON.parse(plain.toString('utf8'));
    assert.equal(fingerprintC4Registry(decoded), registryValidation.fingerprint);
    key.fill(0);plain.fill(0);
  });

  await test('outer disk packages expose no commercial title QA payload source filename or registry identity', async () => {
    const outerA = fs.readFileSync(fileA,'utf8');
    for (const secret of [
      registry.recordings[0].title,
      'SOURCE_QA_PENDING',
      'Completely imaginary targetless observation',
      parsed.result.snapshot.source.sourceFile,
      registry.registryId,
    ]) assert.ok(!outerA.includes(secret));
    assert.deepEqual(Object.keys(JSON.parse(outerA)), ['header','ciphertext']);
  });

  await test('corrupting one disk copy fails closed while the other independently stored test file still opens', async () => {
    const broken = JSON.parse(fs.readFileSync(fileA,'utf8'));
    const bytes = Buffer.from(broken.ciphertext,'base64url');
    bytes[0] ^= 1;
    broken.ciphertext = bytes.toString('base64url');
    fs.writeFileSync(fileA, JSON.stringify(broken), 'utf8');
    const bad = await openC4Registry(fs.readFileSync(fileA,'utf8'), inventedPassphrase);
    const good = await openC4Registry(fs.readFileSync(fileB,'utf8'), inventedPassphrase);
    assert.equal(bad.code, 'CANNOT_VERIFY');
    assert.equal(good.ok, true);
    assert.equal(good.meta.fingerprint, registryValidation.fingerprint);
  });

  await test('wrong passphrase and authenticated-header mutation never return partial registry state', async () => {
    const wrong = await openC4Registry(fs.readFileSync(fileB,'utf8'), 'different invented password');
    assert.equal(wrong.code, 'CANNOT_VERIFY');
    const altered = JSON.parse(fs.readFileSync(fileB,'utf8'));
    altered.header.iterations++;
    const tampered = await openC4Registry(JSON.stringify(altered), inventedPassphrase);
    assert.equal(tampered.code, 'CANNOT_VERIFY');
    assert.equal(Object.hasOwn(wrong,'registry'), false);
    assert.equal(Object.hasOwn(tampered,'registry'), false);
  });

  const empty = emptyRegistry(registry.registryId);
  const emptyValidation = validateC4Registry(empty);
  assert.equal(emptyValidation.ok, true);
  const expectedEmpty = {
    registryId: empty.registryId,
    revision: empty.revision,
    fingerprint: emptyValidation.fingerprint,
  };

  await test('authenticated revision-1 file produces review-required restore plan from exact empty revision 0', async () => {
    const opened = await openC4Registry(fs.readFileSync(fileB,'utf8'), inventedPassphrase);
    assert.equal(opened.ok, true);
    const plan = previewC4Comparison(empty, opened.registry, expectedEmpty);
    assert.equal(plan.ok, true);
    assert.equal(plan.status, 'requires-explicit-owner-review');
    assert.equal(plan.candidateRevision, 1);
    assert.deepEqual(plan.entityDelta, { recordings:1, releases:1, appearances:1 });
    assert.equal(plan.writes, 0);
    assert.equal(plan.automaticActivation, false);
  });

  let active = empty;
  await test('explicit fingerprint confirmation is required before atomic in-memory activation', async () => {
    const opened = await openC4Registry(fs.readFileSync(fileB,'utf8'), inventedPassphrase);
    const confirmed = confirmRestore(active, opened.registry, expectedEmpty, registryValidation.fingerprint);
    assert.equal(confirmed.ok, true);
    assert.equal(validateC4Registry(confirmed.registry).ok, true);
    active = confirmed.registry;
    assert.equal(fingerprintC4Registry(active), registryValidation.fingerprint);
  });

  await test('exact restored revision replay is idempotent and creates no new revision', async () => {
    const expected = {
      registryId: active.registryId,
      revision: active.revision,
      fingerprint: fingerprintC4Registry(active),
    };
    const replay = previewC4Comparison(active, clone(active), expected);
    assert.deepEqual(replay, { ok:true, status:'same-verified-revision', writes:0 });
  });

  await test('authentic older revision is rollback-blocked after revision 1 activation', async () => {
    const expected = {
      registryId: active.registryId,
      revision: active.revision,
      fingerprint: fingerprintC4Registry(active),
    };
    const rollback = previewC4Comparison(active, empty, expected);
    assert.equal(rollback.code, 'ROLLBACK_BLOCKED');
  });

  await test('stale current fingerprint blocks delayed restore after current state has changed', async () => {
    const staleExpected = expectedEmpty;
    const result = previewC4Comparison(active, registry, staleExpected);
    assert.equal(result.code, 'STALE_CURRENT');
  });

} finally {
  fs.rmSync(temp, { recursive:true, force:true });
}
assert.equal(fs.existsSync(temp), false);

await test('end-to-end test leaves no source JSON or encrypted package behind after cleanup', async () => {
  assert.equal(fs.existsSync(temp), false);
  assert.equal(read('package.json').includes('"version": "0.19.46"'), true);
  assert.ok(!read('src/catalogue/fictionalPackageLab.ts').includes('shinocat-commercial-registry-v1'));
});

console.log('A2.4-C/A fictional C5b: ' + cases +
  ' complete-registry -> two encrypted disk files -> authenticated restore cases PASS; ZERO owner source, runtime writer, network, Build125 or commercial production persistence.');
