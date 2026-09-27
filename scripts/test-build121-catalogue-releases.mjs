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
assert.match(read('src/release.ts'), /build121AncestryMarker.*version: '0\.19\.43'.*build: 121/);
assert.equal(JSON.parse(read('package.json')).version, read('src/release.ts').match(/version: '([^']+)'/)[1]);
assert.match(read('src/release.ts'), /build: 121/);
function load(path, imports = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(path), { fileName: path, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, { exports, TextEncoder, require: name => { assert.ok(name in imports); return imports[name]; } });
  return exports;
}
const { parseCatalogue } = load('src/catalogue/import.ts');
const { releaseIndex, releaseDetail, selectReleases, emptyReleaseQuery } = load('src/catalogue/releases.ts');
const parse = value => { const raw = JSON.stringify(value); return parseCatalogue(raw, createHash('sha256').update(raw).digest('hex')); };
const plain = value => JSON.parse(JSON.stringify(value));
const data = fixture();
const first = { ...data.releases[0], title: 'Synthetic repeated title', upc: '000000000001', referenceDate: '2025-02-03', coverUrl: 'https://artwork.invalid/synthetic-never-fetch.jpg' };
const second = { ...first, id: 'amuse:release-2', sourceId: 'release-2', releaseType: 'EP', referenceDate: '2026-04-05', unverifiedCount: 2 };
const third = { ...first, id: 'history:release-3', sourceId: 'release-3', source: 'Master août 2026', title: 'Synthetic historical release', releaseType: null, upc: null, referenceDate: 'circa 2020' };
const fourth = { ...first, id: 'amuse:release-4', sourceId: 'release-4', title: 'Synthetic album <img src=x onerror=alert(1)>', releaseType: 'Album', upc: null, referenceDate: null };
// Intentionally not sorted: findings/evidence cannot be joined by array index.
data.releases = [third, second, first, fourth];
data.appearances[0].position = 2;
data.appearances.push(
  { ...data.appearances[0], id: 'unbound-first', position: 1, recordingId: null, displayTitle: data.recordings[0].title },
  { ...data.appearances[0], id: 'second-bound', position: 1, releaseId: second.id },
  { ...data.appearances[0], id: 'unbound-second', position: null, recordingId: null, releaseId: second.id, displayTitle: 'Synthetic unbound second release', isrcObserved: null },
);
data.recordings.push({ ...data.recordings[0], id: 'rec-2', title: 'Synthetic unrelated recording', isrc: null, provenance: { sheet: 'Pistes consolidées', sourceId: 'rec-2' } });
recount(data);
const result = parse(data); assert.equal(result.status, 'accepted');
const snapshot = result.snapshot;
const index = releaseIndex(snapshot);
const firstId = 'release:' + first.id; const secondId = 'release:' + second.id;
const detail = releaseDetail(index, firstId);
assert.equal(snapshot.appearances.length, 2);
assert.equal(snapshot.unboundAppearances.length, 2);
assert.equal(snapshot.summary.unboundAppearances, 2);
assert.equal([...index.appearancesByReleaseId.values()].flat().length, 4);
assert.deepEqual(plain(detail.appearances.map(a => a.position)), [1, 2]);
assert.equal(detail.appearances[0].recordingId, null);
assert.equal(detail.appearances[0].displayTitle, data.recordings[0].title, 'Similar title must never bind.');
assert.equal(detail.appearances[1].recordingId, 'recording:rec-1');
assert.equal(releaseDetail(index, secondId).appearances[1].position, null);
for (const release of snapshot.releases) {
  const expected = data.appearances.filter(a => 'release:' + a.releaseId === release.releaseId);
  const actual = releaseDetail(index, release.releaseId).appearances;
  assert.equal(actual.length, expected.length);
  for (const row of actual) {
    const raw = JSON.parse(index.evidenceById.get(row.evidenceIds[0]).note);
    assert.equal('release:' + raw.releaseId, row.releaseId);
    assert.equal(raw.position, row.position);
    assert.equal(raw.recordingId === null ? null : 'recording:' + raw.recordingId, row.recordingId);
  }
}
assert.ok(releaseDetail(index, secondId).findings.some(f => f.code === 'RELEASE_COUNT_CONFLICT'));
assert.ok(!detail.findings.some(f => f.code === 'RELEASE_COUNT_CONFLICT'));
assert.ok(detail.findings.some(f => f.code === 'UNBOUND_APPEARANCE'));
assert.equal(releaseDetail(index, 'release:absent'), null);
assert.ok(snapshot.channels.every(channel => channel.status === 'unknown'));
const select = patch => plain(selectReleases(snapshot.releases, { ...emptyReleaseQuery, ...patch }).map(release => release.releaseId));
assert.equal(select({ search: 'REPEATED' }).length, 2);
assert.equal(select({ search: first.upc }).length, 2);
assert.equal(select({ search: 'Master août' }).length, 1);
assert.equal(select({ search: 'Amuse' }).length, 3);
assert.deepEqual(select({ kind: 'ep' }), [secondId]);
assert.equal(select({ kind: 'unknown' }).length, 1);
assert.equal(select({ source: 'Master août 2026' }).length, 1);
assert.equal(select({ upc: 'missing' }).length, 2);
assert.equal(select({ upc: 'present' }).length, 2);
assert.equal(select({ source: 'Master août 2026', upc: 'present' }).length, 0);
assert.deepEqual(select({ sort: 'reference' }), [secondId, firstId, 'release:' + fourth.id, 'release:' + third.id]);
assert.deepEqual(plain(selectReleases([...snapshot.releases].reverse(), { ...emptyReleaseQuery, sort: 'title' }).map(r => r.releaseId)), select({ sort: 'title' }));
assert.equal(snapshot.releases.length, 4, 'Repeated title/UPC never coalesces entries.');
for (const patch of [d => { d.appearances[1].releaseId = 'absent'; }, d => { d.appearances[1].position = 2; }, d => { d.appearances[1].recordingId = 'absent'; }, d => { d.appearances[1].extra = true; }]) {
  const invalid = structuredClone(data); patch(invalid); const rejected = parse(invalid);
  assert.equal(rejected.status, 'rejected'); assert.ok(!('snapshot' in rejected));
}
for (const path of ['src/catalogue/releases.ts', 'src/components/CatalogueReleases.tsx']) {
  assert.doesNotMatch(read(path), /fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|console\.|sendBeacon|dangerouslySetInnerHTML|https?:\/\/|services\/|<img\b/);
}
const { CatalogueReleaseDetail } = load('src/components/CatalogueReleases.tsx', {
  react: React, 'react/jsx-runtime': jsx, '../catalogue/releases': { releaseDetail },
  '../catalogue/finding-labels': load('src/catalogue/finding-labels.ts'), './catalogue-releases.css': {},
});
const renderDetail = (index, releaseId) => renderToStaticMarkup(React.createElement(CatalogueReleaseDetail, { index, releaseId, onClose() {} }));
assert.match(renderDetail(index, 'release:missing'), /Release not found/);
const incomplete = releaseIndex(snapshot); incomplete.evidenceById.clear(); incomplete.recordingById.clear();
const fallback = renderDetail(incomplete, firstId);
assert.match(fallback, /Evidence not available in this snapshot/);
assert.match(fallback, /Referenced Recording is unavailable/);
assert.doesNotMatch(fallback, /Linked Recording:/);
const zero = fixture(); for (const key of ['recordings', 'releases', 'appearances', 'qa', 'soundcloudRecent', 'unverifiedAmuseCandidates']) zero[key] = [];
recount(zero); assert.equal(parse(zero).status, 'accepted');
console.log('Build121 projection PASS: exact release/evidence joins, unbound rows, identity-preserving search/filter/sort and unchanged atomic rejection.');

const server = await createServer({ configFile: false, base: '/', server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser; let cases = 0;
const test = async (name, fn) => { await fn(); cases++; console.log(`Build121: ${name} PASS`); };
const file = (value = data) => ({ name: 'synthetic-releases.json', mimeType: 'application/json', buffer: Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)) });
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const requests = []; const messages = []; const errors = [];
  await context.route('**/*', route => {
    const request = route.request(); requests.push({ url: request.url(), method: request.method(), body: request.postData() ?? '' });
    return request.url().startsWith(origin + '/') ? route.continue() : route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await context.addInitScript(() => {
    const NativeWorker = Worker; window.__jobs = [];
    window.Worker = class extends NativeWorker { constructor(...args) { super(...args); window.__jobs.push(this); } terminate() { this.terminated = true; super.terminate(); } };
  });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  page.on('console', message => messages.push(message.text())); page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}/#/catalogue/releases`);
  const picker = page.getByLabel('Select local source');
  const cards = page.locator('.release-card'); const dialog = page.getByRole('dialog');
  const count = async n => { await page.waitForFunction(n => document.querySelectorAll('.release-card').length === n, n); };
  const choose = async value => { await picker.setInputFiles(file(value)); await page.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor(); };
  const nav = page.getByRole('navigation', { name: 'Catalogue sections' });
  const navigate = async name => { await nav.getByRole('link', { name, exact: true }).click(); await nav.getByRole('link', { name, exact: true }).and(page.locator('[aria-current=page]')).waitFor(); };
  const close = async () => { await dialog.getByRole('button', { name: 'Close detail' }).click(); await dialog.waitFor({ state: 'detached' }); };

  await test('empty, one and multiple releases; no unsolicited import or artwork', async () => {
    await page.getByText('No private source loaded.', { exact: true }).waitFor(); assert.equal(await cards.count(), 0);
    assert.equal(await page.evaluate(() => window.__jobs.length), 0);
    await choose(fixture()); await count(1);
    await choose(data); await count(4);
    assert.equal(await cards.filter({ hasText: 'Synthetic repeated title' }).count(), 2);
    assert.equal(await page.locator('.catalogue-releases img, .catalogue-releases iframe').count(), 0);
    assert.equal(await cards.filter({ hasText: 'Artwork not documented' }).count(), 4);
  });
  await test('source-derived search, combined factual filters and deterministic sort', async () => {
    const search = page.getByRole('searchbox', { name: 'Search releases' });
    await search.fill('repeated'); await count(2);
    await search.fill(first.upc); await count(2);
    await search.fill('Master août'); await count(1);
    await search.fill(''); await page.getByLabel('Release kind', { exact: true }).selectOption('ep'); await count(1);
    await page.getByLabel('Source', { exact: true }).selectOption('Master août 2026'); await count(0);
    await page.getByText('No releases match these filters.', { exact: false }).waitFor();
    await page.getByRole('button', { name: 'Clear filters' }).click(); await count(4);
    await page.getByLabel('UPC / EAN', { exact: true }).selectOption('missing'); await count(2);
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.getByLabel('Sort releases').selectOption('reference');
    await page.waitForFunction(() => document.querySelector('.release-card').textContent.includes('2026-04-05'));
    await page.getByLabel('Sort releases').selectOption('title');
    const expected = selectReleases(snapshot.releases, { ...emptyReleaseQuery, sort: 'title' }).map(r => r.title);
    assert.deepEqual(await page.locator('.release-card-title').allTextContents(), plain(expected));
    await page.getByRole('button', { name: 'Clear filters' }).click();
  });
  await test('exact release detail, unbound positions and real Recording/evidence joins', async () => {
    await cards.first().click(); await dialog.waitFor();
    assert.match(await dialog.innerText(), /2 source appearances · 1 bound · 1 unbound/);
    assert.deepEqual(await dialog.locator('.release-position').allTextContents(), ['Position 1', 'Position 2']);
    assert.match(await dialog.locator('.release-appearances li').first().innerText(), /Unbound appearance/);
    assert.doesNotMatch(await dialog.locator('.release-appearances li').first().innerText(), /Linked Recording:/);
    assert.match(await dialog.locator('.release-appearances li').nth(1).innerText(), /Linked Recording: Synthetic recording/);
    await dialog.locator('.release-evidence summary').first().click();
    const raw = JSON.parse(await dialog.locator('.release-evidence pre').first().textContent()); assert.equal(raw.id, first.id);
    assert.match(await dialog.innerText(), /Current availability: unknown/);
    assert.match(await dialog.innerText(), /Reference date/); assert.match(await dialog.innerText(), /Workbook coverage is incomplete/);
    await close();
    await cards.nth(1).click(); await dialog.waitFor();
    assert.deepEqual(await dialog.locator('.release-position').allTextContents(), ['Position 1', 'Position unknown']);
    await dialog.getByText('Inspect linked findings', { exact: true }).click();
    assert.match(await dialog.innerText(), /RELEASE_COUNT_CONFLICT/);
    await close();
  });
  await test('modal keyboard containment, Escape and explicit close restore opener focus', async () => {
    const opener = cards.nth(1); await opener.focus(); await page.keyboard.press('Enter'); await dialog.waitFor();
    assert.ok(await dialog.getByRole('button', { name: 'Close detail' }).evaluate(el => el === document.activeElement));
    await page.keyboard.press('Shift+Tab'); assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)));
    for (let i = 0; i < 16; i++) await page.keyboard.press('Tab');
    assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)));
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' }); assert.ok(await opener.evaluate(el => el === document.activeElement));
    await opener.press('Enter'); await close(); assert.ok(await opener.evaluate(el => el === document.activeElement));
  });
  await test('grid/list, mobile/desktop/ultrawide layout and reduced motion', async () => {
    fs.mkdirSync('node_modules/.cache/build121', { recursive: true });
    for (const width of [320, 390, 1280, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const mode of ['Grid', 'List']) {
        await page.getByRole('button', { name: mode, exact: true }).click();
        assert.equal(await page.getByRole('button', { name: mode, exact: true }).getAttribute('aria-pressed'), 'true');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Gallery overflow at ${width}`);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: `node_modules/.cache/build121/gallery-${width}-${mode}.png`, fullPage: true });
        await cards.first().click(); await dialog.waitFor();
        assert.ok(await dialog.evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && el.scrollWidth <= el.clientWidth; }), `Detail overflow at ${width}`);
        await page.screenshot({ path: `node_modules/.cache/build121/detail-${width}.png` }); await close();
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.ok(await cards.first().evaluate(el => parseFloat(getComputedStyle(el).transitionDuration) <= 0.001));
  });
  await test('section navigation/back closes detail and preserves one snapshot with unchanged counts', async () => {
    const jobs = await page.evaluate(() => window.__jobs.length);
    await cards.first().click(); await dialog.waitFor();
    await page.evaluate(() => { location.hash = '#/catalogue'; }); await dialog.waitFor({ state: 'detached' });
    await page.locator('.catalogue-metric').first().waitFor();
    assert.equal(await page.locator('.catalogue-metric').nth(1).locator('dd').textContent(), '4');
    assert.equal(await page.locator('.catalogue-metric').nth(2).locator('dd').textContent(), '4');
    await navigate('QA'); await page.getByRole('heading', { name: 'Pending review' }).waitFor();
    await navigate('Releases'); await count(4);
    assert.equal(await dialog.count(), 0); assert.equal(await page.evaluate(() => window.__jobs.length), jobs);
    await cards.first().click(); await page.goBack(); await dialog.waitFor({ state: 'detached' });
    await navigate('Releases'); await count(4);
  });
  await test('open detail clears on replacement/rejection/reset/pagehide/refresh/unmount', async () => {
    await cards.first().click(); await choose(fixture()); await dialog.waitFor({ state: 'detached' }); await count(1);
    await cards.first().click(); await picker.setInputFiles(file('{')); await page.getByText('Source rejected.', { exact: true }).waitFor();
    assert.equal(await dialog.count(), 0); assert.equal(await cards.count(), 0);
    await choose(data); await cards.first().click();
    // Native modal makes background inert; dispatch the real reset handler to
    // exercise parent invalidation while the detail is still mounted.
    await page.getByRole('button', { name: 'Reset / unload', includeHidden: true }).evaluate(el => el.click());
    await dialog.waitFor({ state: 'detached' }); await page.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.ok(await picker.evaluate(el => el === document.activeElement), 'Reset returns focus to picker even when detail was open');
    await choose(data); await cards.first().click(); await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
    await dialog.waitFor({ state: 'detached' }); await page.getByText('No private source loaded.', { exact: true }).waitFor();
    await choose(data); await cards.first().click(); await page.reload(); await page.getByText('No private source loaded.', { exact: true }).waitFor(); assert.equal(await dialog.count(), 0);
    await choose(data); await cards.first().click(); await page.evaluate(() => { location.hash = '#/administration'; }); await page.locator('.commercial-catalogue').waitFor({ state: 'detached' });
    await page.evaluate(() => { location.hash = '#/catalogue/releases'; }); await page.getByText('No private source loaded.', { exact: true }).waitFor();
  });
  await test('zero releases, invalid route and escaped source text remain truthful', async () => {
    await choose(zero); await page.getByText('No commercial releases documented in this snapshot.', { exact: true }).waitFor();
    await choose(data); await cards.filter({ hasText: fourth.title }).click(); await dialog.waitFor();
    assert.equal(await dialog.locator('img, iframe, a').count(), 0); assert.equal(await dialog.locator('#release-detail-title').innerText(), fourth.title);
    await close(); await page.evaluate(() => { location.hash = '#/catalogue/releases/absent'; }); await page.getByText('Catalogue item not found.', { exact: true }).waitFor();
    assert.equal(await dialog.count(), 0); await navigate('Releases'); await count(4);
  });
  await test('no private source/search/selection in URLs, network, logs or browser storage', async () => {
    const exposed = JSON.stringify(requests) + messages.join('\n') + page.url();
    for (const value of [first.title, first.upc, data.recordings[0].isrc, first.coverUrl, 'unbound-first', 'release:amuse:release-1']) assert.ok(!exposed.includes(value));
    assert.ok(requests.every(request => request.method === 'GET'));
    assert.deepEqual(await page.evaluate(async () => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), db: await indexedDB.databases(), caches: await caches.keys() })), { local: [], session: [], db: [], caches: [] });
    assert.deepEqual(errors, []);
  });
  console.log(`Build121 PASS: projection contracts and ${cases} real Chromium scenarios; synthetic sources only.`);
} finally { await browser?.close(); await server.close(); }
