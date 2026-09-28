import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { fixture } from './catalogue-synthetic.mjs';

// Every value below is independently invented. No real user seed/workbook or
// commercial title, ISRC, source record, fingerprint or local output enters CI.
const read = path => fs.readFileSync(path, 'utf8');
const pkg = JSON.parse(read('package.json'));
assert.ok(read('src/release.ts').includes(`build123AncestryMarker = "version: '0.19.45' · build: 123`));
// Current runtime/version is checked independently by check:release and its latest Build gate.
assert.match(read('src/release.ts'), /build122AncestryMarker.*version: '0\.19\.44'.*build: 122/);
assert.match(pkg.scripts.build, /check:build123/);
function load(file, imports = {}) {
  const exports = {};
  const output = ts.transpileModule(read(file), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(output, { exports, TextEncoder, require: name => { assert.ok(name in imports, 'Unknown module ' + name); return imports[name]; } });
  return exports;
}
const legacy = load('src/catalogue/import.ts');
const { parseCatalogueInput } = load('src/catalogue/import-v2.ts', { './import': legacy });
const parse = data => { const input = typeof data === 'string' ? data : JSON.stringify(data); return parseCatalogueInput(input, createHash('sha256').update(input).digest('hex')); };
const summary = v => ({ releases: v.snapshot.releases.length, recordings: v.snapshot.recordings.length,
  appearances: v.snapshot.appearances.length + v.snapshot.unboundAppearances.length,
  findings: v.snapshot.findings.length });

function fictionalV2() {
  const base = fixture();
  base.sourceSheets['2 fiches Amuse vérifiées'] = 1;
  return {
    ...base, schemaVersion: 'catalogue-readonly-seed-v2', privateOnly: true,
    exporterContractVersion: 'a24b2-local-0.1.0', sourceMethodEvidence: null,
    detailedCount: 1, detailedDistributorEvidence: [{
      evidenceId: 'fictional-proof-A', sourceNamespace: 'Amuse', sourceRecordAlias: 'fictional-row-A',
      sourceRecordAliasScope: 'workbook-snapshot-only', sourceLocator: 'synthetic-evidence/A',
      sourceReleaseId: 'release-1', releaseId: 'amuse:release-1', appearanceId: 'app-1', position: 1,
      linkStatus: 'linked', linkProof: 'EXACT_SOURCE_RELEASE_AND_POSITION', linkIssueCode: null,
      displayTitle: base.appearances[0].displayTitle, isrcObserved: base.appearances[0].isrcObserved,
      originalEvidence: { 'Invented evidence': 'A fictional observation <img src=x onerror=alert(1)>' },
      fileNote: 'fictional-note', statusText: 'Historical observation', storeSyncText: 'Unknown',
      timecodeVideo: null, upcObserved: null, evidenceFindingCodes: [],
    }],
    sectionCoverage: [...Object.entries(base.sourceSheets).map(([section, sourceRows]) => ({
      section, sourceRows, status: section === '2 fiches Amuse vérifiées' ? 'represented' : 'partial',
      bodyPreservation: section === '2 fiches Amuse vérifiées' ? 'detailed-evidence' : 'normalized-or-counted-only',
      countMatchesArchivedV1: true,
    })), ...['Fictional dashboard', 'Fictional method'].map(section => ({
      section, sourceRows: 0, status: 'omitted', bodyPreservation: 'not-copied', countMatchesArchivedV1: null,
    }))],
    coverageCounts: {
      appearanceRows: base.appearances.length, countedSectionsInV1: 8, independentDetailedEvidenceRows: 1,
      normalizedRecordsV1: ['recordings','releases','appearances','unverifiedAmuseCandidates','soundcloudRecent','qa']
        .reduce((sum, field) => sum + base[field].length, 0),
      originalSections: 10, totalRowsEightCountedSheets: Object.values(base.sourceSheets).reduce((a, b) => a + b, 0),
    },
  };
}
const mutate = callback => { const d = structuredClone(fictionalV2()); callback(d); return parse(d); };
const addProof = d => {
  d.detailedDistributorEvidence.push({
    ...d.detailedDistributorEvidence[0], evidenceId: 'fictional-proof-B', sourceRecordAlias: 'fictional-row-B',
    sourceLocator: 'synthetic-evidence/B',
  });
  d.detailedCount++; d.coverageCounts.independentDetailedEvidenceRows++;
  d.sourceSheets['2 fiches Amuse vérifiées']++;
  d.coverageCounts.totalRowsEightCountedSheets++;
  d.sectionCoverage.find(row => row.section === '2 fiches Amuse vérifiées').sourceRows++;
};
let checks = 0;
const test = (name, fn) => { fn(); checks++; console.log('Build123 synthetic: ' + name + ' PASS'); };
const source = fictionalV2(), v1 = fixture(), old = parse(v1), accepted = parse(source);
test('source schemas are explicitly separate; unchanged v1 parser fails closed on v2', () => {
  assert.equal(old.status, 'accepted');
  assert.equal(legacy.parseCatalogue(JSON.stringify(source), 'a'.repeat(64)).findings[0].code, 'UNSUPPORTED_SCHEMA');
  assert.equal(accepted.status, 'accepted'); assert.equal(accepted.snapshot.source.schema, 'catalogue-readonly-seed-v2');
  assert.equal(legacy.parseCatalogue(JSON.stringify(v1), 'a'.repeat(64)).status, 'accepted');
});
test('v2 enriches exact appearance without adding entities or losing original findings', () => {
  assert.equal(accepted.status, 'accepted');
  assert.deepEqual(summary(accepted), summary(old));
  assert.equal(accepted.snapshot.summary.sourceRows, old.snapshot.summary.sourceRows);
  assert.equal(accepted.snapshot.enrichment.detailedEvidenceCount, 1);
  assert.equal(accepted.snapshot.enrichment.linkedEvidenceCount, 1);
  const appearance = accepted.snapshot.appearances[0];
  assert.equal(appearance.evidenceIds.length, 2);
  const evidence = accepted.snapshot.evidence.find(e => e.detailKind === 'distributor-detail');
  assert.ok(evidence); assert.ok(appearance.evidenceIds.includes(evidence.evidenceId));
  const provenance = JSON.parse(evidence.note);
  assert.equal(provenance.sourceRecordAlias, 'fictional-row-A');
  assert.equal(provenance.sourceReleaseId, 'release-1');
  assert.equal(provenance.releaseId, 'amuse:release-1');
  assert.equal(provenance.appearanceId, 'app-1');
  assert.equal(provenance.position, 1);
  assert.equal(provenance.linkProof, 'EXACT_SOURCE_RELEASE_AND_POSITION');
  assert.equal(accepted.snapshot.recordings[0].studioTrackLink, null);
  assert.ok(accepted.snapshot.channels.every(row => row.status === 'unknown'));
});
test('independent detail may repeat same exact appearance but never create another appearance', () => {
  const r = mutate(addProof); assert.equal(r.status, 'accepted');
  assert.equal(summary(r).appearances, 1); assert.equal(r.snapshot.appearances[0].evidenceIds.length, 3);
  assert.equal(r.snapshot.enrichment.detailedEvidenceCount, 2);
});
test('source namespaced Release ID and position are mandatory binding authority', () => {
  for (const alter of [
    d => { d.detailedDistributorEvidence[0].sourceNamespace = 'Another Distributor'; },
    d => { d.detailedDistributorEvidence[0].sourceReleaseId = 'other'; },
    d => { d.detailedDistributorEvidence[0].releaseId = 'missing-release'; },
    d => { d.detailedDistributorEvidence[0].position = 7; },
    d => { d.detailedDistributorEvidence[0].appearanceId = 'unrelated'; },
    d => { d.detailedDistributorEvidence[0].linkProof = null; },
  ]) assert.equal(mutate(alter).findings[0].code, 'V2_DETAIL_LINK_CONFLICT');
});
test('unlinked is global pending review with no invented relation', () => {
  const r = mutate(d => {
    addProof(d); const item = d.detailedDistributorEvidence[1];
    item.linkStatus = 'unlinked'; item.linkProof = null; item.linkIssueCode = 'EXACT_TARGET_NOT_FOUND';
    item.releaseId = null; item.appearanceId = null;
  });
  assert.equal(r.status, 'accepted'); assert.equal(r.snapshot.appearances[0].evidenceIds.length, 2);
  assert.equal(r.snapshot.enrichment.unlinkedEvidenceCount, 1);
  assert.ok(r.snapshot.findings.some(f => f.code === 'V2_DETAIL_UNLINKED' && f.evidenceId));
});
test('corroborating title and ISRC conflicts do not change selected association', () => {
  const r = mutate(d => { d.detailedDistributorEvidence[0].displayTitle = 'Fictional mismatch';
    d.detailedDistributorEvidence[0].isrcObserved = 'ZZAAA2600999'; });
  assert.equal(r.status, 'accepted'); assert.equal(r.snapshot.enrichment.linkedEvidenceCount, 1);
  assert.ok(r.snapshot.findings.some(f => f.code === 'V2_DETAIL_TITLE_CONTRADICTION'));
  assert.ok(r.snapshot.findings.some(f => f.code === 'V2_DETAIL_ISRC_CONTRADICTION'));
  assert.equal(r.snapshot.appearances[0].evidenceIds.length, 2);
});
test('identity duplicate, unverified coverage and count inconsistency fail atomically', () => {
  assert.equal(mutate(d => { addProof(d); d.detailedDistributorEvidence[1].sourceRecordAlias = 'fictional-row-A'; }).findings[0].code, 'V2_DUPLICATE_EVIDENCE');
  assert.equal(mutate(d => d.coverageCounts.appearanceRows++).findings[0].code, 'V2_COVERAGE_COUNT_CONFLICT');
  assert.equal(mutate(d => d.sectionCoverage[0].section = d.sectionCoverage[1].section).findings[0].code, 'V2_COVERAGE_COUNT_CONFLICT');
  assert.equal(mutate(d => d.sectionCoverage[0].countMatchesArchivedV1 = false).findings[0].code, 'V2_COVERAGE_COUNT_CONFLICT');
  assert.equal(mutate(d => d.detailedDistributorEvidence[0].originalEvidence.Invented = { unexpected: 1 }).findings[0].code, 'V2_INVALID_DETAIL');
});
test('unknown exporter contract and renamed root fields fail closed', () => {
  assert.equal(mutate(d => d.exporterContractVersion = 'unknown-next').findings[0].code, 'V2_INVALID_ENVELOPE');
  assert.equal(mutate(d => d.privateOnly = false).findings[0].code, 'V2_INVALID_ENVELOPE');
  assert.equal(mutate(d => d.futureWriteEnabled = true).findings[0].code, 'V2_INVALID_ENVELOPE');
  assert.equal(parse('{').findings[0].code, 'MALFORMED_JSON');
  assert.equal(mutate(d => d.schemaVersion = 'future-v3').findings[0].code, 'UNSUPPORTED_SCHEMA');
});
test('no persistence, upload, write or automatic binding in adapter implementation', () => {
  const code = read('src/catalogue/import-v2.ts');
  assert.doesNotMatch(code, /fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon|navigator\.storage/);
  assert.doesNotMatch(code, /studioTrackLink:\s*\{/);
});
const server = await createServer({ configFile: false, base: '/', server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const origin = 'http://127.0.0.1:' + server.httpServer.address().port;
let browser;
const browserChecks = [];
const chooseFile = (data, filename = 'fictional.json') =>
  ({ name: filename, mimeType: 'application/json', buffer: Buffer.from(typeof data === 'string' ? data : JSON.stringify(data)) });
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const requests = [], messages = [], errors = [];
  await context.route('**/*', route => {
    const request = route.request();
    requests.push({ url: request.url(), method: request.method(), body: request.postData() ?? '' });
    return request.url().startsWith(origin + '/') ? route.continue() :
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('console', m => messages.push(m.text())); page.on('pageerror', e => errors.push(e.message));
  const step = async (name, cb) => { await cb(); browserChecks.push(name); console.log('Build123 browser: ' + name + ' PASS'); };
  await page.goto(origin + '/#/catalogue/releases');
  const input = page.getByLabel('Select local source');
  const dialog = page.locator('dialog[open]');
  await step('explicit synthetic v2 upload, historical coverage and original appearance count', async () => {
    await input.setInputFiles(chooseFile(source));
    await page.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor();
    await page.getByText('Enriched v2', { exact: false }).waitFor();
    assert.equal(await page.locator('.release-card').count(), 1);
    await page.locator('.catalogue-source-details summary').first().click();
    assert.match(await page.locator('.catalogue-source-details').innerText(), /Independent detail evidence\s*1/);
    assert.match(await page.locator('.catalogue-source-details').innerText(), /Partial sections\s*7/);
  });
  await step('release detail preserves one appearance with separate on-demand historical evidence', async () => {
    await page.locator('.release-card').first().click(); await dialog.waitFor();
    assert.match(await dialog.innerText(), /1 source appearances · 1 bound · 0 unbound/);
    assert.equal(await dialog.locator('.release-appearances > li').count(), 1);
    const details = dialog.locator('.release-appearances > li .release-evidence').last();
    await details.locator('summary').click();
    assert.match(await details.innerText(), /Independent distributor detail · historical source proof/);
    assert.equal(await details.locator('img').count(), 0);
    assert.match(await details.locator('pre').last().innerText(), /Fictional marker|fictional observation/i);
    assert.match(await details.locator('pre').last().innerText(), /"sourceRecordAlias":"fictional-row-A"/);
    assert.match(await details.locator('pre').last().innerText(), /"sourceReleaseId":"release-1"/);
    await dialog.getByRole('button', { name: 'Close detail' }).click();
  });
  await step('v2 conflicting source link rejects whole replacement rather than retaining any stale detail', async () => {
    const conflict = structuredClone(source); conflict.detailedDistributorEvidence[0].position = 99;
    await input.setInputFiles(chooseFile(conflict));
    await page.getByText('Source rejected.', { exact: true }).waitFor();
    assert.equal(await page.locator('.release-card').count(), 0);
    assert.match(await page.locator('.catalogue-findings').innerText(), /exact distributor evidence link contradicts/i);
  });
  await step('accepted v1 replacement remains compatible with distinct, honest coverage copy', async () => {
    await input.setInputFiles(chooseFile(v1));
    await page.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor();
    assert.equal(await page.getByText('Enriched v2', { exact: false }).count(), 0);
    await page.locator('.release-card').first().click(); await dialog.waitFor();
    assert.match(await dialog.innerText(), /does not retain all original sheet bodies or detailed Amuse evidence/);
    await dialog.getByRole('button', { name: 'Close detail' }).click();
  });
  await step('reset, refresh and old browser lifecycle clear v1/v2 private state', async () => {
    await input.setInputFiles(chooseFile(source));
    await page.getByText('Enriched v2', { exact: false }).waitFor();
    await page.getByRole('button', { name: 'Reset / unload' }).click();
    await page.getByText('No private source loaded.', { exact: true }).waitFor();
    await input.setInputFiles(chooseFile(source));
    await page.getByText('Enriched v2', { exact: false }).waitFor();
    await page.reload();
    await page.getByText('No private source loaded.', { exact: true }).waitFor();
  });
  await step('synthetic private source never appears in storage, URL, console or external requests', async () => {
    const secret = 'fictional-proof-A';
    assert.ok(!requests.some(r => r.method !== 'GET' || r.body.includes(secret) || r.url.includes(secret)));
    assert.ok(!messages.some(m => m.includes(secret)));
    assert.ok(!page.url().includes(secret));
    assert.deepEqual(await page.evaluate(async () => ({ local: Object.keys(localStorage),
      session: Object.keys(sessionStorage), databases: await indexedDB.databases(), caches: await caches.keys() })),
    { local: [], session: [], databases: [], caches: [] });
    assert.deepEqual(errors, []);
  });
  console.log('Build123 PASS: ' + checks + ' pure contract tests + ' + browserChecks.length + ' actual Chromium scenarios; entirely invented fixture only.');
} finally { await browser?.close(); await server.close(); }
