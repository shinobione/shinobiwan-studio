import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as jsx from 'react/jsx-runtime';
import { fixture, recount } from './catalogue-synthetic.mjs';

const read = path => fs.readFileSync(path, 'utf8');
assert.equal(JSON.parse(read('package.json')).version, '0.19.44');
assert.match(read('src/release.ts'), /build: 122/);
assert.match(JSON.parse(read('package.json')).scripts.build, /check:build122/);
function load(path, imports = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(path), { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, { exports, TextEncoder, require: name => { assert.ok(name in imports, name); return imports[name]; } });
  return exports;
}
const { parseCatalogue } = load('src/catalogue/import.ts');
const releases = load('src/catalogue/releases.ts');
const model = load('src/catalogue/recordings.ts', { './releases': releases });
const { catalogueIndex, recordingDetail, contextFindings, findingTargets, selectRecordings, selectFindings, allFindings, emptyRecordingQuery } = model;
const plain = value => JSON.parse(JSON.stringify(value));
const parse = value => { const raw = JSON.stringify(value); return parseCatalogue(raw, createHash('sha256').update(raw).digest('hex')); };
const data = fixture(), base = data.recordings[0];
const rec = (id, title, isrc, extra = {}) => ({ ...base, id, title, isrc, provenance: { sheet: 'Pistes consolidées', sourceId: id }, ...extra });
data.recordings = [rec('rec-z', 'Synthetic quiet', 'ZZAAA2600009'), rec('rec-3', 'Synthetic invalid <img src=x onerror=alert(1)>', 'bad-isrc'), rec('rec-2', base.title, base.isrc, { studioTrackId: 'synthetic-proposal' }), rec('rec-4', 'Synthetic missing', null), { ...base, reviewNeeded: 'Synthetic exact review' }];
data.releases = [{ ...data.releases[0], id: 'amuse:release-2', sourceId: 'release-2', title: 'Synthetic second release', referenceDate: '2026-02-03' }, data.releases[0]];
data.appearances.push(
  { ...data.appearances[0], id: 'app-z', releaseId: 'amuse:release-2', position: 2 },
  { ...data.appearances[0], id: 'app-b', recordingId: 'rec-2', position: 2, isrcObserved: 'ZZAAA2600099' },
  { ...data.appearances[0], id: 'app-unbound', recordingId: null, position: 3 },
);
data.qa = Array.from({ length: 24 }, (_, i) => ({ ...data.qa[0], 'Objet': `Synthetic global ${i}` }));
recount(data);
const result = parse(data); assert.equal(result.status, 'accepted');
const snapshot = result.snapshot, index = catalogueIndex(snapshot);
const target = (kind, id) => ({ kind, id });
const first = target('recording', 'recording:rec-1');
const detail = recordingDetail(index, first.id);
assert.equal(detail.appearances.length, 2); assert.equal(detail.releaseCount, 2);
assert.equal(recordingDetail(index, 'recording:rec-z').appearances.length, 0);
assert.equal(recordingDetail(index, 'recording:rec-2').appearances.length, 1);
assert.equal(recordingDetail(index, 'recording:rec-3').recording.isrc, null);
assert.equal(recordingDetail(index, 'recording:rec-4').recording.isrc, null);
assert.equal(recordingDetail(index, 'recording:missing'), null);
assert.ok(snapshot.recordings.every(r => r.studioTrackLink === null));
assert.equal(snapshot.appearances.length + snapshot.unboundAppearances.length, 4);
assert.equal(releases.releaseDetail(index, 'release:amuse:release-1').appearances.length, 3);
for (const r of snapshot.recordings) for (const a of recordingDetail(index, r.recordingId).appearances) {
  const row = JSON.parse(index.evidenceById.get(a.evidenceIds[0]).note);
  assert.equal('recording:' + row.recordingId, r.recordingId);
  assert.equal('release:' + row.releaseId, a.releaseId);
  assert.equal(row.position, a.position);
}
assert.ok(!detail.appearances.some(a => a.appearanceId.includes('unbound')));
for (const f of snapshot.findings) {
  const targets = findingTargets(index, f);
  if (/^(unverifiedAmuseCandidates|soundcloudRecent|qa)\[/.test(f.locator) || f.locator === 'source') assert.equal(targets.length, 0);
  if (f.code === 'UNBOUND_APPEARANCE') {
    assert.deepEqual(plain(targets.map(t => t.kind)), ['appearance', 'release']);
    assert.equal(targets[1].id, 'release:amuse:release-1');
  }
}
const contextual = contextFindings(index, first);
assert.ok(contextual.some(f => f.code === 'SOURCE_REVIEW_REQUIRED'));
assert.ok(!contextual.some(f => ['UNREVIEWED_TRACK_BINDING', 'ISRC_CONTRADICTION', 'UNBOUND_APPEARANCE', 'AMUSE_PENDING_REVIEW', 'CHANNEL_OBSERVATION_UNVERIFIED', 'SOURCE_QA_PENDING'].includes(f.code)));
assert.ok(contextFindings(index, target('recording', 'recording:rec-2')).some(f => f.code === 'ISRC_CONTRADICTION'));
assert.equal(contextFindings(index, target('recording', 'recording:rec-z')).length, 0);
assert.equal(contextFindings(index, target('appearance', 'appearance:app-unbound')).length, 1);
assert.deepEqual(plain(selectFindings(index, allFindings)), plain(snapshot.findings));
assert.deepEqual(plain(selectFindings(index, { code: 'MISSING_ISRC', context: null })), plain(snapshot.findings.filter(f => f.code === 'MISSING_ISRC')));
assert.equal(selectFindings(index, { code: 'MISSING_ISRC', context: first }).length, 0);
assert.equal(contextFindings(index, target('recording', 'recording:absent')).length, 0);
const select = patch => plain(selectRecordings(index, { ...emptyRecordingQuery, ...patch }).map(r => r.recordingId));
assert.equal(select({ search: base.title }).length, 2); assert.equal(select({ search: base.isrc }).length, 2);
assert.equal(select({ search: 'synthetic-proposal' }).length, 0, 'Search is documented title/ISRC only');
assert.equal(select({ isrc: 'known' }).length, 3); assert.equal(select({ isrc: 'missing' }).length, 2);
assert.equal(select({ appearances: 'zero' }).length, 3); assert.equal(select({ appearances: 'one' }).length, 1);
assert.deepEqual(select({ appearances: 'multiple' }), [first.id]); assert.deepEqual(select({ review: 'none' }), ['recording:rec-z']);
assert.equal(select({ review: 'present' }).length, 4);
const shuffled = catalogueIndex({ ...snapshot, recordings: [...snapshot.recordings].reverse(), appearances: [...snapshot.appearances].reverse() });
for (const sort of ['identity', 'title']) assert.deepEqual(plain(selectRecordings(shuffled, { ...emptyRecordingQuery, sort }).map(r => r.recordingId)), select({ sort }));
for (const path of ['src/catalogue/recordings.ts', 'src/components/CatalogueRecordings.tsx', 'src/components/CatalogueDetails.tsx']) assert.doesNotMatch(read(path), /fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|console\.|sendBeacon|dangerouslySetInnerHTML|https?:\/\/|services\/|<img\b/);
const labels = load('src/catalogue/finding-labels.ts');
const releaseUI = load('src/components/CatalogueReleases.tsx', { react: React, 'react/jsx-runtime': jsx, '../catalogue/releases': releases, '../catalogue/finding-labels': labels, './catalogue-releases.css': {} });
const { CatalogueDetails } = load('src/components/CatalogueDetails.tsx', { react: React, 'react/jsx-runtime': jsx, '../catalogue/recordings': model, './CatalogueReleases': releaseUI, '../catalogue/finding-labels': labels });
const render = (idx, t) => renderToStaticMarkup(React.createElement(CatalogueDetails, { index: idx, target: t, onClose() {}, onReview() {} }));
assert.match(render(index, target('recording', 'recording:absent')), /Recording not found/);
assert.match(render(index, target('appearance', 'appearance:absent')), /Appearance not found/);
const incomplete = catalogueIndex(snapshot); incomplete.evidenceById.clear(); incomplete.releaseById.clear();
assert.match(render(incomplete, first), /Evidence not available/); assert.match(render(incomplete, first), /Referenced Release unavailable/);
assert.doesNotMatch(render(incomplete, first), />View Release</);
console.log('Build122 projection PASS: exact identities, bound-only multi-Release joins, contextual/global QA, missing references and deterministic filters.');

const server = await createServer({ configFile: false, base: '/', server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen(); const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser, cases = 0;
const test = async (name, fn) => { await fn(); cases++; console.log(`Build122: ${name} PASS`); };
const file = (value = data) => ({ name: 'synthetic-recordings.json', mimeType: 'application/json', buffer: Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)) });
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(); const requests = [], messages = [], errors = [], urls = [];
  await context.route('**/*', route => { const r = route.request(); requests.push(r.url() + (r.postData() ?? '')); return r.url().startsWith(origin + '/') ? route.continue() : route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }); });
  await context.addInitScript(() => { const NativeWorker = Worker; window.__jobs = []; window.Worker = class extends NativeWorker { constructor(...args) { super(...args); window.__jobs.push(this); } }; });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('console', m => messages.push(m.text())); page.on('pageerror', e => errors.push(e.message));
  page.on('framenavigated', frame => urls.push(frame.url()));
  await page.goto(`${origin}/#/catalogue/recordings`);
  const picker = page.getByLabel('Select local source'), cards = page.locator('.recording-card'), dialog = page.getByRole('dialog');
  const choose = async (value = data) => { await picker.setInputFiles(file(value)); await page.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor(); };
  const count = n => page.waitForFunction(n => document.querySelectorAll('.recording-card').length === n, n);
  const nav = page.getByRole('navigation', { name: 'Catalogue sections' });
  const navigate = async name => { await nav.getByRole('link', { name, exact: true }).click(); await nav.getByRole('link', { name, exact: true }).and(page.locator('[aria-current=page]')).waitFor(); };
  const close = async () => { await dialog.getByRole('button', { name: 'Close detail', exact: true }).click(); await dialog.waitFor({ state: 'detached' }); };
  await test('empty, single, multiple identities and source-only filters/sorting', async () => {
    await page.getByText('No private source loaded.', { exact: true }).waitFor(); assert.equal(await cards.count(), 0);
    assert.equal(await page.evaluate(() => window.__jobs.length), 0);
    await choose(fixture()); await count(1); await choose(); await count(5);
    const search = page.getByRole('searchbox', { name: 'Search recordings' });
    for (const text of [base.title, base.isrc]) { await search.fill(text); await count(2); }
    await search.fill('synthetic-proposal'); await count(0); await page.getByText('No recordings match these filters.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Clear filters' }).click(); await count(5);
    await page.getByLabel('Recording ISRC', { exact: true }).selectOption('missing'); await count(2);
    await page.getByLabel('Bound appearances', { exact: true }).selectOption('one'); await count(0);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.getByLabel('Bound appearances', { exact: true }).selectOption('multiple'); await count(1);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.getByLabel('Exact review links').selectOption('none'); await count(1); assert.match(await cards.innerText(), /Synthetic quiet/);
    await page.getByRole('button', { name: 'Clear filters' }).click(); await page.getByLabel('Sort recordings').selectOption('title');
    assert.deepEqual(await page.locator('.recording-title').allTextContents(), plain(selectRecordings(index, { ...emptyRecordingQuery, sort: 'title' }).map(r => r.title)));
    await page.getByRole('button', { name: 'Clear filters' }).click();
  });
  await test('exact multi-Release evidence, unbound exclusion and safe cross-detail navigation', async () => {
    await cards.first().click(); await dialog.waitFor(); assert.match(await dialog.innerText(), /2 bound appearances · 2 distinct Releases/);
    assert.equal(await dialog.locator('.release-appearances > li').count(), 2);
    await dialog.locator('.release-evidence summary').first().click(); assert.equal(JSON.parse(await dialog.locator('pre').first().textContent()).id, 'rec-1');
    await dialog.getByRole('button', { name: 'View Release', exact: true }).first().click();
    assert.equal(await page.locator('dialog[open]').count(), 1); assert.match(await dialog.innerText(), /3 source appearances · 2 bound · 1 unbound/);
    const unbound = dialog.locator('.release-appearances > li').filter({ hasText: 'Unbound appearance' });
    assert.equal(await unbound.getByRole('button', { name: 'View Recording', exact: true }).count(), 0);
    await unbound.getByRole('button', { name: 'Review appearance' }).click(); assert.match(await dialog.innerText(), /No Recording association documented/);
    assert.equal(await dialog.getByRole('button', { name: 'View Recording', exact: true }).count(), 0);
    await dialog.getByRole('button', { name: 'Back to previous detail' }).click();
    await dialog.getByRole('button', { name: 'View Recording', exact: true }).nth(1).click(); assert.match(await dialog.innerText(), /1 bound appearances · 1 distinct Releases/);
    await dialog.getByRole('button', { name: 'Back to previous detail' }).click(); await dialog.getByRole('button', { name: 'Back to previous detail' }).click();
    assert.match(await dialog.innerText(), /2 bound appearances · 2 distinct Releases/); await close(); assert.ok(await cards.first().evaluate(el => el === document.activeElement));
    await cards.nth(2).click(); assert.match(await dialog.innerText(), /ISRC: Unknown \/ not documented/); assert.match(await dialog.innerText(), /No bound appearances documented/); assert.equal(await dialog.locator('img').count(), 0); await close();
  });
  await test('contextual QA retains all global findings and exact action targets', async () => {
    await cards.first().click(); await dialog.getByRole('button', { name: 'Review contextual findings' }).click();
    await page.getByText('Exact recording evidence context', { exact: false }).waitFor();
    assert.equal(await page.locator('.catalogue-findings ol > li').count(), contextual.length);
    assert.ok(await page.getByRole('heading', { name: 'Pending review', exact: true }).evaluate(el => el === document.activeElement));
    await page.getByRole('button', { name: 'Show all findings' }).click();
    let rows = 0; const seen = [];
    while (true) {
      const items = page.locator('.catalogue-findings ol > li'); rows += await items.count();
      for (const item of await items.all()) {
        const locator = await item.locator(':scope > span').textContent(); seen.push(locator);
        if (/^(unverifiedAmuseCandidates|soundcloudRecent|qa)\[/.test(locator) || locator === 'source') assert.equal(await item.getByRole('button').count(), 0);
        if (locator === 'appearances[3]') { assert.equal(await item.getByRole('button', { name: 'View Recording', exact: true }).count(), 0); assert.equal(await item.getByRole('button', { name: 'View Release', exact: true }).count(), 1); }
      }
      const next = page.getByRole('button', { name: 'Next cases' }); if (await next.isDisabled()) break; await next.click();
    }
    assert.equal(rows, snapshot.findings.length); assert.ok(seen.some(x => x.startsWith('qa[')));
    await navigate('Recordings'); await cards.last().click(); await dialog.getByRole('button', { name: 'Review contextual findings' }).click();
    await page.getByText('Showing 0 of', { exact: false }).waitFor(); await page.getByText('No findings with a proven link', { exact: false }).waitFor();
    await page.getByRole('button', { name: 'Show all findings' }).click(); assert.equal(await page.locator('.catalogue-findings ol > li').count(), 20);
    await navigate('Releases'); await page.locator('.release-card').first().click(); await dialog.getByRole('button', { name: 'Review Release findings' }).click();
    await page.getByText('Exact release evidence context', { exact: false }).waitFor();
    const app = page.locator('.catalogue-findings ol > li').filter({ hasText: 'appearances[3]' }); await app.getByRole('button', { name: 'Review appearance' }).click();
    await dialog.getByRole('button', { name: 'Review contextual findings' }).click(); await page.getByText('Exact appearance evidence context', { exact: false }).waitFor(); assert.equal(await page.locator('.catalogue-findings ol > li').count(), 1);
    await page.getByRole('button', { name: 'Show all findings' }).click(); await navigate('Overview');
    await page.locator('.catalogue-review-highlights button').first().click();
    await page.getByRole('button', { name: 'Show all findings' }).waitFor();
    assert.doesNotMatch(await page.locator('.catalogue-findings').innerText(), /Exact appearance evidence context/);
    await navigate('Recordings');
  });
  await test('keyboard modal containment, cross-view focus, Escape and opener restoration', async () => {
    await cards.first().focus(); await page.keyboard.press('Enter'); await dialog.waitFor();
    assert.ok(await dialog.getByRole('button', { name: 'Close detail', exact: true }).evaluate(el => el === document.activeElement));
    for (const key of ['Shift+Tab', ...Array(18).fill('Tab')]) { await page.keyboard.press(key); assert.ok(await dialog.evaluate(el => el.contains(document.activeElement))); }
    await dialog.getByRole('button', { name: 'View Release', exact: true }).first().click();
    assert.ok(await dialog.locator('.catalogue-detail-content').evaluate(el => el === document.activeElement));
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' }); assert.ok(await cards.first().evaluate(el => el === document.activeElement));
  });
  await test('responsive 320/390/768/1280/2560 and reduced motion', async () => {
    fs.mkdirSync('node_modules/.cache/build122', { recursive: true });
    for (const width of [320, 390, 768, 1280, 2560]) {
      await page.setViewportSize({ width, height: 1000 }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `node_modules/.cache/build122/recordings-${width}.png`, fullPage: true });
      await cards.first().click(); assert.ok(await dialog.evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth; }));
      await page.screenshot({ path: `node_modules/.cache/build122/detail-${width}.png` }); await close();
    }
    await page.emulateMedia({ reducedMotion: 'reduce' }); assert.ok(await cards.first().evaluate(el => parseFloat(getComputedStyle(el).transitionDuration) <= 0.001));
  });
  await test('navigation, history, replacement/rejection/reset/pagehide/refresh/unmount clear transient state', async () => {
    const jobs = await page.evaluate(() => window.__jobs.length);
    await cards.first().click(); await page.evaluate(() => { location.hash = '#/catalogue/releases'; }); await dialog.waitFor({ state: 'detached' });
    await page.goBack(); await count(5); assert.equal(await dialog.count(), 0); assert.equal(await page.evaluate(() => window.__jobs.length), jobs);
    await cards.first().click(); await choose(fixture()); await dialog.waitFor({ state: 'detached' }); await count(1);
    await cards.first().click(); await picker.setInputFiles(file('{')); await page.getByText('Source rejected.', { exact: true }).waitFor(); assert.equal(await dialog.count(), 0); assert.equal(await cards.count(), 0);
    await choose(); await cards.first().click(); await page.getByRole('button', { name: 'Reset / unload', includeHidden: true }).evaluate(el => el.click());
    await page.getByText('No private source loaded.', { exact: true }).waitFor(); assert.equal(await dialog.count(), 0); assert.ok(await picker.evaluate(el => el === document.activeElement));
    await choose(); await cards.first().click(); await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
    await page.getByText('No private source loaded.', { exact: true }).waitFor(); assert.equal(await dialog.count(), 0);
    await choose(); await cards.first().click(); await page.reload(); await page.getByText('No private source loaded.', { exact: true }).waitFor();
    await choose(); await cards.first().click(); await page.evaluate(() => { location.hash = '#/administration'; }); await page.locator('.commercial-catalogue').waitFor({ state: 'detached' });
    await page.evaluate(() => { location.hash = '#/catalogue/recordings'; }); await page.getByText('No private source loaded.', { exact: true }).waitFor();
    const zero = fixture(); for (const key of ['recordings', 'releases', 'appearances', 'qa', 'soundcloudRecent', 'unverifiedAmuseCandidates']) zero[key] = []; recount(zero);
    await choose(zero); await page.getByText('No recordings documented in this snapshot.', { exact: true }).waitFor();
    await choose(); await cards.first().click(); await dialog.getByRole('button', { name: 'Review contextual findings' }).click();
    await picker.setInputFiles(file(fixture())); await page.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor(); assert.equal(await page.getByRole('button', { name: 'Show all findings' }).count(), 0);
  });
  await test('source/search/selection remain absent from URL, network, storage and console', async () => {
    for (const value of [base.title, base.isrc, 'rec-1', 'synthetic-proposal', 'bad-isrc', 'app-unbound']) {
      assert.ok(!requests.some(r => r.includes(value) || r.includes(encodeURIComponent(value)))); assert.ok(!messages.some(m => m.includes(value))); assert.ok(!urls.some(url => url.includes(value) || url.includes(encodeURIComponent(value))));
    }
    assert.deepEqual(await page.evaluate(async () => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), databases: await indexedDB.databases(), caches: await caches.keys() })), { local: [], session: [], databases: [], caches: [] });
    assert.deepEqual(errors, []);
  });
  const races = await browser.newContext();
  await races.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await races.addInitScript(() => { window.__jobs = []; window.Worker = class { constructor() { window.__jobs.push(this); } postMessage() {} terminate() { this.terminated = true; } }; });
  const race = await races.newPage(); race.setDefaultTimeout(10000); await race.goto(`${origin}/#/catalogue/recordings`);
  const selectFile = () => race.getByLabel('Select local source').setInputFiles(file());
  const deliver = (n, value = result) => race.evaluate(({ n, value }) => window.__jobs[n].onmessage({ data: value }), { n, value });
  await test('late Worker success/error cannot restore discarded Recording detail or context', async () => {
    await selectFile(); await deliver(0); await race.locator('.recording-card').first().click();
    await selectFile(); await selectFile(); await deliver(1); await race.getByText('Reading and validating locally', { exact: false }).waitFor();
    await deliver(2, parse(fixture())); await race.waitForFunction(() => document.querySelectorAll('.recording-card').length === 1);
    await deliver(1); await race.evaluate(() => window.__jobs[1].onerror({ preventDefault() {} }));
    assert.equal(await race.getByRole('dialog').count(), 0); assert.equal(await race.locator('.recording-card').count(), 1);
    await selectFile(); await race.getByRole('button', { name: 'Reset / unload' }).click(); await deliver(3); await race.getByText('No private source loaded.', { exact: true }).waitFor();
    await selectFile(); await race.getByLabel('Select local source').setInputFiles({ ...file(), name: 'synthetic.txt' }); await deliver(4); await race.getByText('Source rejected.', { exact: true }).waitFor();
    await selectFile(); await race.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide'))); await deliver(5); await race.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.equal(await race.locator('.recording-card').count(), 0);
  });
  console.log(`Build122 PASS: projection contracts and ${cases} actual App/StrictMode Chromium scenarios; independently synthetic sources only.`);
} finally { await browser?.close(); await server.close(); }
