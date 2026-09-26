import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const read = file => fs.readFileSync(file, 'utf8');
const location = { hash: '#/catalogue' };
function load(file, imports = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, location, require: name => {
    assert.ok(name in imports, `Unexpected Catalogue dependency: ${name}`);
    return imports[name];
  }, ...globals });
  return exports;
}
const router = load('src/router.ts');
const catalogue = load('src/catalogue-router.ts');
const plain = value => JSON.parse(JSON.stringify(value));
for (const route of ['dashboard', 'workflow', 'catalog', 'albums', 'intelligence', 'lyrics', 'assets', 'publishing', 'administration']) {
  location.hash = router.routeHref(route);
  assert.equal(router.readRoute(), route);
  assert.equal(router.readTrackId(), null);
}
for (const section of ['overview', 'intelligence', 'market', 'lyrics', 'assets', 'versions', 'metadata', 'publishing']) {
  location.hash = router.trackHref('synthetic-track', section);
  assert.equal(router.readRoute(), 'catalog');
  assert.equal(router.readTrackId(), 'synthetic-track');
  assert.equal(router.readTrackSection(), section);
}
location.hash = router.workflowHref('audio');
assert.equal(router.readWorkflowHealthDrilldown(), 'audio');
for (const section of ['overview', 'releases', 'recordings', 'qa']) {
  location.hash = catalogue.catalogueHref({ section });
  assert.equal(router.readRoute(), 'catalogue');
  assert.equal(router.readTrackId(), null);
  assert.deepEqual(plain(catalogue.readCatalogueRoute()), { section });
}
for (const section of ['releases', 'recordings']) {
  for (const id of ['synthetic-1', 'R_001', 'a'.repeat(120)]) {
    const route = { section, id };
    assert.deepEqual(plain(catalogue.readCatalogueRoute(catalogue.catalogueHref(route))), route);
  }
}
assert.deepEqual(plain(catalogue.readCatalogueRoute('#/catalogue/recordings/%52_001')), { section: 'recordings', id: 'R_001' });
for (const suffix of ['/', '//releases', '/unknown', '/qa/item', '/releases/', '/releases/a/extra', '/recordings/%', '/recordings/%2F', '/recordings/%252F', '/recordings/..', '/recordings/%00', '/recordings/<script>', '/recordings/a?b', '/recordings/a#b', `/recordings/${'a'.repeat(121)}`]) {
  assert.deepEqual(plain(catalogue.readCatalogueRoute(`#/catalogue${suffix}`)), { section: 'not-found' });
}
for (const id of ['', '../a', 'a/b', 'a b', '%2F', '<script>', 'a'.repeat(121)]) {
  assert.throws(() => catalogue.catalogueHref({ section: 'recordings', id }));
}
assert.deepEqual(plain(catalogue.readCatalogueRoute('#/catalog')), { section: 'not-found' });

// Exercise the component's actual subscription and rendered output with a small
// hook harness; no browser services, private source data or new test dependency.
let state;
let effect;
const listeners = new Map();
let networkRequests = 0;
const jsx = await import('react/jsx-runtime');
const ui = load('src/components/CommercialCatalogue.tsx', {
  react: {
    useState: init => { state ??= init(); return [state, value => { state = value; }]; },
    useEffect: callback => { effect = callback; },
  },
  'react/jsx-runtime': jsx,
  '../catalogue-router': catalogue,
  './commercial-catalogue.css': {},
}, {
  fetch: () => { networkRequests++; throw new Error('Catalogue A2.1 must not request network data.'); },
  XMLHttpRequest: class { constructor() { networkRequests++; throw new Error('Catalogue A2.1 must not request network data.'); } },
  addEventListener: (name, handler) => listeners.set(name, handler),
  removeEventListener: (name, handler) => { assert.equal(listeners.get(name), handler); listeners.delete(name); },
});
const render = () => renderToStaticMarkup(React.createElement(ui.CommercialCatalogue));
location.hash = '#/catalogue';
assert.match(render(), /Your commercial discography starts here/);
const cleanup = effect();
for (const [hash, expected] of [
  ['#/catalogue/releases', 'No commercial releases loaded'],
  ['#/catalogue/recordings', 'No recordings loaded'],
  ['#/catalogue/qa', 'No reconciliation cases loaded'],
  ['#/catalogue/recordings/synthetic-missing', 'Catalogue item not found'],
  ['#/catalogue/releases/synthetic-missing', 'Catalogue item not found'],
  ['#/catalogue/recordings/%', 'Catalogue item not found'],
  ['#/catalogue', 'Your commercial discography starts here'],
]) {
  location.hash = hash;
  listeners.get('hashchange')();
  assert.match(render(), new RegExp(expected));
}
assert.match(render(), /Local import · coming next/);
assert.match(render(), /Historical snapshot · not loaded/);
assert.doesNotMatch(render(), /<(?:input|iframe|img|form|button)\b/);
cleanup();
assert.equal(listeners.size, 0);
state = undefined;
location.hash = '#/catalogue/qa';
assert.match(render(), /No reconciliation cases loaded/, 'Refresh initializes from the URL.');
assert.equal(networkRequests, 0, 'Catalogue mount, navigation and refresh introduce no network request.');

// Compile-time identity checks: appearances can share a recording, commercial
// releases cannot be substituted for recordings, and ISRC may be unknown.
const virtualFile = path.resolve('scripts/catalogue-type-check.ts');
const fixture = `import type { Recording, RecordingId, CommercialReleaseId, ReleaseAppearance } from '../src/types/commercial-catalogue';
declare const recording: Recording;
declare const releaseId: CommercialReleaseId;
declare const first: ReleaseAppearance;
const otherAppearance: ReleaseAppearance = { ...first, releaseId, recordingId: recording.recordingId };
const unknownIsrc: Recording = { ...recording, isrc: null, studioTrackLink: null };
// @ts-expect-error Commercial release identity cannot identify a recording.
const wrongId: RecordingId = releaseId;
// @ts-expect-error A Studio slug is not a proven commercial identity.
const unprovenId: RecordingId = 'synthetic-track';
// @ts-expect-error A Studio link requires evidence and human review.
const unprovenLink: Recording['studioTrackLink'] = { studioTrackId: 'synthetic-track' };
`;
const options = { strict: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler };
const host = ts.createCompilerHost(options);
const originalSource = host.getSourceFile.bind(host);
host.getSourceFile = (file, version, ...rest) => path.resolve(file) === virtualFile ? ts.createSourceFile(file, fixture, version, true) : originalSource(file, version, ...rest);
const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([virtualFile], options, host));
assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCanonicalFileName: file => file, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n' }));

const app = read('src/App.tsx');
const daily = app.slice(app.indexOf('const DAILY_NAV:'), app.indexOf('const TOOL_NAV:'));
assert.deepEqual([...daily.matchAll(/route: '([^']+)'/g)].map(match => match[1]), ['dashboard', 'catalog', 'albums', 'catalogue']);
assert.match(app, /route === 'catalogue' && <CommercialCatalogue \/>/);
assert.match(app, /route === 'catalog' && \(trackId \? <TrackWorkspace/);
assert.match(app, /route === 'albums' && <AlbumHealthWorkspace \/>/);
assert.match(app, /<summary>Tools<\/summary>/);
const source = read('src/components/CommercialCatalogue.tsx');
assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|services\/|dangerouslySetInnerHTML|<iframe|type="file"/);
assert.doesNotMatch(read('src/types/commercial-catalogue.ts'), /import |extends Studio|extends Album/);
const css = read('src/components/commercial-catalogue.css');
assert.match(css, /:focus-visible/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /max-width: 600px/);
const release = read('src/release.ts');
assert.equal(release.match(/version: '([^']+)'/)[1], '0.19.40');
assert.equal(Number(release.match(/build: (\d+)/)[1]), 118);
const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.version, '0.19.40');
assert.match(pkg.scripts.build, /check:build118/);
assert.match(pkg.scripts.build, /vite build && npm run check:catalogue-artifacts/);
console.log('Build118 PASS: legacy routes, strict commercial routes, hash navigation/refresh, honest empty/not-found views, independent identities and read-only boundaries.');
