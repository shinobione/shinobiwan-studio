import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { fixture, recount } from './catalogue-synthetic.mjs';

const read = file => fs.readFileSync(file, 'utf8');
assert.match(read('src/release.ts'), /build120AncestryMarker.*version: '0\.19\.42'.*build: 120/);
assert.equal(JSON.parse(read('package.json')).version, read('src/release.ts').match(/version: '([^']+)'/)[1]);
assert.match(read('src/release.ts'), /build: 120/);
function load(file) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, { exports, TextEncoder });
  return exports;
}
const { parseCatalogue } = load('src/catalogue/import.ts');
const { catalogueOverview } = load('src/catalogue/overview.ts');
const { FINDING_LABELS } = load('src/catalogue/finding-labels.ts');
const parse = data => { const text = JSON.stringify(data); return parseCatalogue(text, createHash('sha256').update(text).digest('hex')); };
const data = fixture();
data.recordings.push(...[2, 3].map(n => ({ ...data.recordings[0], id: `rec-${n}`, title: `Synthetic recording ${n}`, isrc: n === 2 ? null : 'ZZAAA2600003', provenance: { sheet: 'Pistes consolidées', sourceId: `rec-${n}` } })));
data.releases.push({ ...data.releases[0], id: 'amuse:release-2', sourceId: 'release-2', title: 'Another synthetic release' });
data.appearances.push({ ...data.appearances[0], id: 'app-2', releaseId: 'amuse:release-2' }, { ...data.appearances[0], id: 'app-3', position: 2, recordingId: null });
data.qa = Array.from({ length: 25 }, (_, n) => ({ ...data.qa[0], Objet: `Synthetic evidence ${n} <img src=x onerror=alert(1)>` }));
recount(data);
const result = parse(data);
assert.equal(result.status, 'accepted');
const view = catalogueOverview(result.snapshot);
assert.deepEqual([view.recordings, view.releases, view.sourceAppearances, view.boundAppearances, view.unboundAppearances, view.knownIsrc, view.missingIsrc], [3, 2, 3, 2, 1, 2, 1]);
assert.equal(view.groups.reduce((sum, group) => sum + group.count, 0), result.snapshot.findings.length);
// Every actual parser code has a human label, and every code/severity is grouped.
const codes = [...new Set([...read('src/catalogue/import.ts').matchAll(/(?:warn|error|reject)\('([A-Z_]+)'/g)].map(match => match[1]).concat('AMUSE_PENDING_REVIEW', 'CHANNEL_OBSERVATION_UNVERIFIED', 'SOURCE_QA_PENDING'))];
for (const code of codes) assert.ok(FINDING_LABELS[code], 'Every parser finding must have a label.');
const allFindings = codes.flatMap(code => ['error', 'warning'].flatMap(severity => Array.from({ length: 2 }, () => ({ code, severity, state: 'pending-review', locator: 'synthetic' }))));
const grouped = catalogueOverview({ ...result.snapshot, findings: allFindings });
assert.equal(grouped.groups.length, codes.length * 2);
assert.ok(grouped.groups.every(group => group.count === 2));
assert.equal(grouped.pending, allFindings.length);
const empty = fixture(); for (const key of ['recordings', 'releases', 'appearances', 'qa', 'soundcloudRecent', 'unverifiedAmuseCandidates']) empty[key] = [];
const emptyResult = parse(recount(empty));
assert.equal(emptyResult.status, 'accepted');
assert.equal(catalogueOverview(emptyResult.snapshot).recordings, 0);

// No fixture belongs to src/public/dist. The actual App, router and components
// run here in StrictMode. External services are intercepted before navigation.
const server = await createServer({ configFile: false, base: '/', server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
let cases = 0;
const test = async (name, fn) => { await fn(); cases++; console.log(`Build120: ${name} PASS`); };
const file = (value = data, name = 'synthetic.json') => ({ name, mimeType: 'application/json', buffer: Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)) });
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const requests = []; const messages = []; const errors = [];
  await context.route('**/*', route => {
    const request = route.request();
    requests.push({ url: request.url(), body: request.postData() ?? '', method: request.method() });
    if (request.url().startsWith(origin + '/')) return route.continue();
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await context.addInitScript(() => {
    const NativeWorker = Worker;
    window.__jobs = [];
    window.Worker = class extends NativeWorker {
      constructor(...args) { super(...args); window.__jobs.push(this); }
      terminate() { this.__terminated = true; super.terminate(); }
    };
  });
  const page = await context.newPage();
  page.on('console', message => messages.push(message.text()));
  page.on('pageerror', error => errors.push(error.message));
  page.setDefaultTimeout(10000);
  await page.goto(`${origin}/#/catalogue`);
  const nav = page.getByRole('navigation', { name: 'Catalogue sections' });
  const picker = page.getByLabel('Select local source');
  const accepted = () => page.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor();
  const navigate = async name => { await nav.getByRole('link', { name, exact: true }).click(); await nav.getByRole('link', { name, exact: true }).and(page.locator('[aria-current=page]')).waitFor(); };
  const metric = async (name, value) => assert.equal(await page.locator('.catalogue-metric').filter({ has: page.locator('dt', { hasText: new RegExp(`^${name}$`) }) }).locator('dd').textContent(), String(value));

  await test('fresh mount is empty with zero Worker activation', async () => {
    await page.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => window.__jobs.length), 0);
    assert.equal(await picker.getAttribute('aria-describedby'), 'catalogue-privacy');
  });
  await test('real local Worker, dynamic counts and unbound source appearances', async () => {
    await picker.setInputFiles(file()); await accepted();
    await metric('Recordings', 3); await metric('Commercial Releases', 2); await metric('Source Appearances', 3);
    await metric('Known ISRC', 2); await metric('Missing / invalid ISRC', 1); await metric('Pending review findings', view.pending);
    assert.match(await page.locator('.catalogue-overview').innerText(), /2 bound · 1 unbound/);
    assert.equal(await page.locator('time').getAttribute('datetime'), data.snapshotDate);
    assert.equal(await picker.inputValue(), '');
    assert.equal(await page.evaluate(() => window.__jobs.length), 1);
    assert.ok(await page.evaluate(() => window.__jobs.every(job => job.__terminated)));
  });
  await test('all sections, history and invalid subroutes retain the parent snapshot', async () => {
    for (const name of ['Releases', 'Recordings', 'QA', 'Overview']) { await navigate(name); await accepted(); assert.equal(await picker.count(), 1); }
    await page.goBack(); await page.getByRole('heading', { name: 'Pending review' }).waitFor();
    await page.goForward(); await metric('Recordings', 3);
    for (const hash of ['#/catalogue/recordings/absent', '#/catalogue/unknown']) {
      await page.evaluate(hash => { location.hash = hash; }, hash);
      await page.getByText('Catalogue item not found.', { exact: true }).waitFor();
      assert.equal(await picker.count(), 0);
      await page.getByRole('link', { name: 'Back to Catalogue overview' }).click(); await metric('Recordings', 3);
    }
    assert.equal(await page.evaluate(() => window.__jobs.length), 1);
  });
  await test('every actual finding group navigates to matching QA without source URLs', async () => {
    for (const group of view.groups) {
      const button = page.locator('.catalogue-review-highlights button').filter({ hasText: group.code });
      assert.equal(await button.count(), 1);
      assert.equal(await button.locator('.catalogue-finding-count').innerText(), `${group.count} ↗`);
      await button.focus(); await page.keyboard.press('Enter');
      await page.getByRole('button', { name: 'Show all findings' }).waitFor();
      assert.equal(new URL(page.url()).hash, '#/catalogue/qa');
      assert.equal(await page.locator('.catalogue-findings li').count(), Math.min(group.count, 20));
      assert.ok(await page.getByRole('heading', { name: 'Pending review' }).evaluate(el => el === document.activeElement));
      await navigate('Overview');
    }
  });
  await test('QA pagination, escaped full evidence, channel unknown and source warning retained', async () => {
    await navigate('QA');
    await page.getByRole('button', { name: 'Show all findings' }).click();
    assert.equal(await page.locator('.catalogue-findings li').count(), 20);
    await page.getByRole('button', { name: 'Next cases' }).click();
    assert.equal(await page.locator('.catalogue-findings ol').getAttribute('start'), '21');
    await page.locator('.catalogue-findings summary').first().click();
    assert.match(await page.locator('.catalogue-findings pre').first().innerText(), /Synthetic/);
    assert.equal(await page.locator('.catalogue-import img, .catalogue-import iframe').count(), 0);
    await page.getByText('Source audit & provenance', { exact: true }).click();
    await page.getByText('Channel evidence', { exact: true }).click();
    await page.getByText('All current availability remains unknown.', { exact: false }).waitFor();
    await page.getByText('Coverage is incomplete:', { exact: false }).waitFor();
    await navigate('Overview');
  });
  await test('mobile, tablet and ultrawide layout, keyboard and reduced motion', async () => {
    await page.getByText('Source audit & provenance', { exact: true }).click();
    fs.mkdirSync('node_modules/.cache/build120', { recursive: true });
    for (const width of [320, 390, 768, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}`);
      const boxes = await page.locator('.catalogue-metric').evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { width: r.width, left: r.left, right: r.right, scroll: el.scrollWidth }; }));
      assert.ok(boxes.every(box => box.width > 80 && box.left >= 0 && box.right <= width && box.scroll <= box.width + 1));
      await page.screenshot({ path: `node_modules/.cache/build120/overview-${width}.png`, fullPage: true });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.ok(await nav.getByRole('link', { name: 'Overview', exact: true }).evaluate(el => parseFloat(getComputedStyle(el).transitionDuration) <= 0.001));
    await picker.focus(); await page.keyboard.press('Tab');
    assert.ok(await page.getByRole('button', { name: 'Reset / unload' }).evaluate(el => el === document.activeElement));
    await page.keyboard.press('Enter');
    await page.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.ok(await picker.evaluate(el => el === document.activeElement));
  });
  await test('replacement recalculates; rejected replacement discards; zero source is honest', async () => {
    await picker.setInputFiles(file(fixture())); await accepted(); await metric('Recordings', 1);
    await picker.setInputFiles(file('{')); await page.getByText('Source rejected.', { exact: true }).waitFor();
    assert.equal(await page.locator('.catalogue-overview').count(), 0);
    await picker.setInputFiles(file(empty)); await accepted(); await metric('Recordings', 0); await metric('Source Appearances', 0);
  });
  await test('refresh, leaving Catalogue and pagehide clear the session', async () => {
    await picker.setInputFiles(file()); await accepted();
    await page.reload(); await page.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => window.__jobs.length), 0);
    await picker.setInputFiles(file()); await accepted();
    await page.evaluate(() => { location.hash = '#/administration'; }); await page.locator('.commercial-catalogue').waitFor({ state: 'detached' });
    await page.evaluate(() => { location.hash = '#/catalogue'; }); await page.getByText('No private source loaded.', { exact: true }).waitFor();
    await picker.setInputFiles(file()); await accepted();
    await page.evaluate(() => dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
    await page.getByText('No private source loaded.', { exact: true }).waitFor();
  });
  await test('no source data in requests, storage, URLs or logs', async () => {
    const sent = JSON.stringify(requests) + messages.join('\n') + page.url();
    for (const secret of [data.recordings[0].title, data.recordings[0].isrc, data.sourceFile, 'Synthetic evidence 0']) assert.ok(!sent.includes(secret));
    assert.ok(requests.every(request => request.method === 'GET'), 'No network writes');
    const storage = await page.evaluate(async () => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), databases: await indexedDB.databases(), caches: await caches.keys() }));
    assert.deepEqual(storage, { local: [], session: [], databases: [], caches: [] });
    assert.deepEqual(errors, []);
  });

  // Controlled Worker delivery through real mounted components: deliberately
  // deliver after termination to verify the generation fence, not browser luck.
  const races = await browser.newContext();
  await races.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await races.addInitScript(() => {
    window.__jobs = [];
    window.Worker = class {
      constructor() { window.__jobs.push(this); }
      postMessage() {}
      terminate() { this.terminated = true; }
    };
  });
  const race = await races.newPage(); race.setDefaultTimeout(10000);
  await race.goto(`${origin}/#/catalogue`);
  const choose = () => race.getByLabel('Select local source').setInputFiles(file());
  const deliver = (index, value = result) => race.evaluate(({ index, value }) => window.__jobs[index].onmessage({ data: value }), { index, value });
  await test('pending import survives tab navigation with one Worker', async () => {
    await choose(); await race.getByRole('link', { name: 'Releases', exact: true }).click();
    assert.equal(await race.evaluate(() => window.__jobs.length), 1);
    await deliver(0); await race.getByText('Source structurally accepted for dry-run.', { exact: true }).waitFor();
  });
  await test('concurrent selections and stale success/error cannot replace the current snapshot', async () => {
    await choose(); await choose(); await deliver(1);
    await race.getByText('Reading and validating locally', { exact: false }).waitFor();
    await deliver(2, parse(fixture()));
    await race.getByRole('link', { name: 'Overview', exact: true }).click();
    await race.locator('.catalogue-metric').first().locator('dd').filter({ hasText: /^1$/ }).waitFor();
    await deliver(1);
    await race.evaluate(() => window.__jobs[1].onerror({ preventDefault() {} }));
    assert.equal(await race.locator('.catalogue-metric').first().locator('dd').textContent(), '1');
  });
  await test('reset, invalid replacement, unmount and refresh ignore late Worker results', async () => {
    await choose(); await race.getByRole('button', { name: 'Reset / unload' }).click(); await deliver(3);
    await race.getByText('No private source loaded.', { exact: true }).waitFor();
    await choose(); await race.getByLabel('Select local source').setInputFiles(file('x', 'synthetic.txt')); await deliver(4);
    await race.getByText('Source rejected.', { exact: true }).waitFor();
    assert.equal(await race.locator('.catalogue-overview').count(), 0);
    await choose();
    await race.evaluate(() => { location.hash = '#/administration'; }); await race.locator('.commercial-catalogue').waitFor({ state: 'detached' });
    await deliver(5);
    await race.evaluate(() => { location.hash = '#/catalogue/qa'; }); await race.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.ok(await race.evaluate(() => window.__jobs.every(job => job.terminated)));
    await choose(); await race.reload(); await race.getByText('No private source loaded.', { exact: true }).waitFor();
    assert.equal(await race.evaluate(() => window.__jobs.length), 0);
  });
  console.log(`Build120 PASS: ${cases} real-browser scenarios plus dynamic projection/all-code grouping; synthetic data only.`);
} finally {
  await browser?.close();
  await server.close();
}
