import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { fixture, recount } from './catalogue-synthetic.mjs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as jsx from 'react/jsx-runtime';

const read = file => fs.readFileSync(file, 'utf8');
function load(file, imports = {}, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read(file).replaceAll('import.meta.url', "'https://synthetic.invalid/'"), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023, jsx: ts.JsxEmit.ReactJSX } }).outputText, {
    exports, TextEncoder, TextDecoder, require: n => { assert.ok(n in imports); return imports[n]; }, ...globals,
  });
  return exports;
}
const api = load('src/catalogue/import.ts');
const parse = d => { const raw = typeof d === 'string' ? d : JSON.stringify(d); return api.parseCatalogue(raw, createHash('sha256').update(raw).digest('hex')); };
let cases = 0;
function test(name, fn) { try { fn(); cases++; } catch { throw new Error(`Synthetic Catalogue case failed: ${name}`); } }
const changed = fn => { const d = fixture(); fn(d); return parse(recount(d)); };
const has = (r, code) => (r.status === 'accepted' ? r.snapshot.findings : r.findings).some(f => f.code === code);
const rejected = (r, c) => { assert.equal(r.status, 'rejected'); assert.ok(!('snapshot' in r)); assert.ok(has(r, c)); };
test('valid independent entities', () => {
  const r = parse(fixture()); assert.equal(r.status, 'accepted'); const s = r.snapshot;
  assert.equal(s.summary.sourceRows, 6); assert.equal(s.recordings[0].studioTrackLink, null);
  assert.notEqual(s.recordings[0].recordingId, s.releases[0].releaseId); assert.equal(s.appearances[0].recordingId, s.recordings[0].recordingId);
  assert.equal(s.appearances[0].status, 'unverified'); assert.ok(s.channels.every(c => c.status === 'unknown'));
});
test('malformed JSON', () => rejected(parse('{'), 'MALFORMED_JSON'));
test('workbook and prototype rejected', () => { rejected(parse('PK synthetic workbook'), 'MALFORMED_JSON'); rejected(parse('<html>'), 'MALFORMED_JSON'); });
test('unknown version', () => rejected(changed(d => d.schemaVersion = 'v999'), 'UNSUPPORTED_SCHEMA'));
test('missing required root', () => rejected(changed(d => delete d.artist), 'INVALID_ROOT'));
test('unknown root field', () => rejected(changed(d => d.extra = true), 'INVALID_ROOT'));
test('missing required row', () => rejected(changed(d => delete d.recordings[0].title), 'INVALID_ROW'));
test('unknown row field', () => rejected(changed(d => d.recordings[0].extra = true), 'INVALID_ROW'));
test('invalid types', () => rejected(changed(d => d.recordings[0].flags.hasISRC = 'yes'), 'INVALID_ROW'));
test('blank and control identity', () => { for (const id of ['', ' x', 'x\n']) rejected(changed(d => d.recordings[0].id = id), 'INVALID_ROW'); });
test('invalid date', () => rejected(changed(d => d.snapshotDate = '2026-02-30'), 'INVALID_ROOT'));
test('invalid source digest', () => rejected(changed(d => d.sourceSha256 = 'not-a-digest'), 'INVALID_ROOT'));
test('optional null ISRC', () => { const r = changed(d => d.recordings[0].isrc = null); assert.equal(r.status, 'accepted'); assert.equal(r.snapshot.recordings[0].isrc, null); assert.ok(has(r, 'MISSING_ISRC')); });
test('ISRC normalization and invalid evidence', () => { assert.equal(changed(d => d.recordings[0].isrc = 'zz-aaa-26-00001').snapshot.recordings[0].isrc, 'ZZAAA2600001'); assert.ok(has(changed(d => d.recordings[0].isrc = 'invalid'), 'INVALID_ISRC')); });
test('duplicate ISRC preserves identities', () => { const r = changed(d => d.recordings.push({ ...d.recordings[0], id: 'rec-2', provenance: { sheet: 'Pistes consolidées', sourceId: 'rec-2' } })); assert.equal(r.snapshot.recordings.length, 2); assert.ok(has(r, 'DUPLICATE_ISRC')); });
test('duplicate recording identity rejected', () => rejected(changed(d => d.recordings.push(d.recordings[0])), 'DUPLICATE_ID'));
test('duplicate release identity rejected', () => rejected(changed(d => d.releases.push({ ...d.releases[0], id: 'other' })), 'DUPLICATE_RELEASE_IDENTITY'));
test('conflicting release metadata rejected', () => rejected(changed(d => d.releases.push({ ...d.releases[0], id: 'other', title: 'Conflicting synthetic title' })), 'RELEASE_METADATA_CONFLICT'));
test('duplicate appearance ID rejected', () => rejected(changed(d => d.appearances.push({ ...d.appearances[0], position: 2 })), 'DUPLICATE_ID'));
test('duplicate appearance ownership rejected', () => rejected(changed(d => d.appearances.push({ ...d.appearances[0], id: 'app-2' })), 'POSITION_OWNERSHIP_CONFLICT'));
test('one recording on multiple releases', () => {
  const r = changed(d => { d.releases.push({ ...d.releases[0], id: 'amuse:release-2', sourceId: 'release-2' }); d.appearances.push({ ...d.appearances[0], id: 'app-2', releaseId: 'amuse:release-2' }); });
  assert.equal(r.status, 'accepted'); assert.equal(r.snapshot.appearances.length, 2); assert.equal(r.snapshot.recordings.length, 1);
});
test('orphan recording and release', () => { for (const k of ['recordingId','releaseId']) rejected(changed(d => d.appearances[0][k] = 'absent'), 'ORPHAN_APPEARANCE'); });
test('unbound appearance remains evidence', () => { const r = changed(d => d.appearances[0].recordingId = null); assert.equal(r.snapshot.summary.unboundAppearances, 1); assert.ok(has(r,'UNBOUND_APPEARANCE')); assert.ok(r.snapshot.evidence.some(e => e.sourceLocator.startsWith('appearances/'))); });
test('orphan candidate', () => rejected(changed(d => d.unverifiedAmuseCandidates[0]['ID consolidé'] = 'absent'), 'ORPHAN_CANDIDATE'));
test('orphan recent observation', () => rejected(changed(d => d.soundcloudRecent[0]['ID consolidé'] = 'absent'), 'ORPHAN_OBSERVATION'));
test('release metadata conflict', () => assert.ok(has(changed(d => d.releases[0].unverifiedCount = 2), 'RELEASE_COUNT_CONFLICT')));
test('contradictory appearance evidence', () => assert.ok(has(changed(d => d.appearances[0].isrcObserved = 'ZZAAA2600002'), 'ISRC_CONTRADICTION')));
test('contradictory channel evidence', () => assert.ok(has(changed(d => d.recordings[0].soundcloudStudioObserved = 'Non'), 'CHANNEL_EVIDENCE_CONFLICT')));
test('Amuse remains pending', () => assert.ok(has(parse(fixture()), 'AMUSE_PENDING_REVIEW')));
test('title and proposed Track never bind', () => { const r = changed(d => { d.recordings[0].title = 'same-as-studio-track'; d.recordings[0].studioTrackId = 'same-as-studio-track'; }); assert.equal(r.snapshot.recordings[0].studioTrackLink, null); assert.ok(has(r, 'UNREVIEWED_TRACK_BINDING')); });
test('publication cannot become live', () => { const r = changed(d => { d.releases[0].distributionStatus = 'Published Spotify Apple SoundCloud'; d.releases[0].spotifyUrl = 'https://example.invalid/record'; }); assert.ok(r.snapshot.channels.every(c => c.status === 'unknown' && c.verifiedLiveAt === null)); assert.ok(!r.snapshot.channels.some(c => c.channel === 'Apple Music')); });
test('source provenance preserves all fields', () => { const d = fixture(); const r = parse(d); const e = r.snapshot.evidence.find(e => e.sourceLocator === 'recordings/rec-1'); assert.deepEqual(JSON.parse(e.note), d.recordings[0]); assert.equal(r.snapshot.source.claimedWorkbookSha256, d.sourceSha256); assert.equal(r.snapshot.source.inputSha256, createHash('sha256').update(JSON.stringify(d)).digest('hex')); });
test('provenance conflict', () => rejected(changed(d => d.recordings[0].provenance.sourceId = 'other'), 'PROVENANCE_CONFLICT'));
test('source counts mismatch', () => { const d = fixture(); d.sourceSheets['Pistes consolidées'] = 2; rejected(parse(d), 'SOURCE_COUNT_CONFLICT'); });
test('determinism and repeat idempotence', () => assert.equal(JSON.stringify(parse(fixture())), JSON.stringify(parse(fixture()))));
test('strict atomic invalidation', () => { const r = changed(d => { d.recordings.push({}); }); rejected(r, 'INVALID_ROW'); });
test('error vs review distinguishable', () => { assert.ok(parse(fixture()).snapshot.findings.every(f => f.severity === 'warning' && f.state === 'pending-review')); assert.ok(parse('{').findings.every(f => f.severity === 'error')); });
test('input bounded before parsing', () => rejected(parse(' '.repeat(api.MAX_BYTES + 1)), 'FILE_TOO_LARGE'));
test('row limit', () => { const d = fixture(); d.qa = Array(50_001).fill(d.qa[0]); rejected(parse(d), 'TOO_MANY_ROWS'); });

const { createImportSession } = load('src/catalogue/session.ts', { './import': api });
function harness() {
  const jobs = []; const states = [];
  const session = createImportSession(() => { const job = { terminated: false, terminate() { this.terminated = true; }, postMessage(file) { this.file = file; } }; jobs.push(job); return job; }, s => states.push(s));
  return { jobs, states, session, file: { name: 'synthetic.json', size: 200 } };
}
test('no startup import or worker', () => { const h = harness(); assert.equal(h.jobs.length, 0); assert.equal(h.states.length, 0); });
test('success releases worker and reset clears', () => { const h = harness(); h.session.select(h.file); h.jobs[0].onmessage({ data: parse(fixture()) }); assert.equal(h.states.at(-1).result.status,'accepted'); assert.ok(h.jobs[0].terminated); h.session.reset(); assert.equal(h.states.at(-1).phase,'empty'); });
test('invalid replacement never retains old snapshot', () => { const h=harness(); h.session.select(h.file); h.jobs[0].onmessage({data:parse(fixture())}); h.session.select(h.file); assert.equal(h.states.at(-1).phase,'reading'); h.jobs[1].onmessage({data:parse('{')}); assert.equal(h.states.at(-1).result.status,'rejected'); });
test('replacement discards late completion', () => { const h=harness(); h.session.select(h.file); h.session.select(h.file); h.jobs[0].onmessage({data:parse(fixture())}); assert.equal(h.states.at(-1).phase,'reading'); assert.ok(h.jobs[0].terminated); });
test('reset discards late completion', () => { const h=harness(); h.session.select(h.file); h.session.reset(); h.jobs[0].onmessage({data:parse(fixture())}); assert.equal(h.states.at(-1).phase,'empty'); });
test('unmount discards late completion', () => { const h=harness(); h.session.select(h.file); h.session.dispose(); const n=h.states.length; h.jobs[0].onmessage({data:parse(fixture())}); h.session.select(h.file); assert.equal(h.states.length,n); assert.ok(h.jobs[0].terminated); });
test('refresh creates empty session', () => { const h=harness(); assert.equal(h.jobs.length,0); });
test('file rejection and reader failure', () => { const h=harness(); h.session.select({...h.file,name:'x.xlsx'}); assert.equal(h.jobs.length,0); assert.equal(h.states.at(-1).result.status,'rejected'); h.session.select(h.file); h.jobs[0].onerror({preventDefault(){}}); assert.ok(h.jobs[0].terminated); assert.equal(h.states.at(-1).result.status,'rejected'); });
test('worker creation failure', () => { const states=[]; const s=createImportSession(()=>{throw Error();},x=>states.push(x)); s.select({name:'x.json',size:2}); assert.equal(states.at(-1).result.status,'rejected'); });
test('worker bounds and actual hash path', () => {
  const source=read('src/catalogue/import.worker.ts'); assert.match(source,/crypto.subtle.digest\('SHA-256', bytes\)/); assert.match(source,/fatal: true/); assert.match(source,/file.size > MAX_BYTES/);
});
test('no private IO or unsafe HTML dependencies', () => {
  for (const file of ['src/catalogue/import.ts','src/catalogue/import.worker.ts','src/catalogue/session.ts','src/components/CatalogueImport.tsx','src/catalogue/useCatalogueSession.ts','src/catalogue/overview.ts','src/catalogue/finding-labels.ts','src/components/CatalogueOverview.tsx']) {
    const s=read(file); assert.doesNotMatch(s,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|console\.|sendBeacon|dangerouslySetInnerHTML|https?:\/\/|services\//);
  }
  const s=read('src/components/CatalogueImport.tsx'); assert.match(s,/event.currentTarget.value = ''/); assert.match(read('src/catalogue/useCatalogueSession.ts'),/current.dispose\(\)/); assert.match(s,/type="file"/); assert.match(s,/aria-describedby/); assert.match(s,/role="status"/); assert.match(s,/snapshot.findings/);
});
test('release metadata', () => { const p=JSON.parse(read('package.json')); assert.match(read('src/release.ts'),/build119AncestryMarker.*version: '0\.19\.41'.*build: 119/); assert.equal(p.version,read('src/release.ts').match(/version: '([^']+)'/)[1]); assert.match(p.scripts.build,/check:build119/); assert.match(read('src/release.ts'),/build: 119/); });

// Exercise the actual UI with deterministic React hooks and local worker messages.
const slots=[]; let cursor=0; let effect; const uiJobs=[];
let uiState = { phase: 'empty' };
const uiSession = createImportSession(() => { const job={postMessage(){},terminate(){this.terminated=true;}}; uiJobs.push(job); return job; }, value => { uiState=value; });
const labels=load('src/catalogue/finding-labels.ts');
const overview=load('src/components/CatalogueOverview.tsx', { react:React,'react/jsx-runtime':jsx,'../catalogue/overview':load('src/catalogue/overview.ts'),'../catalogue/finding-labels':labels });
const ui=load('src/components/CatalogueImport.tsx', {
  react: { useState: initial => { const i=cursor++; if (!(i in slots)) slots[i]=initial; return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}]; }, useRef: initial => {const i=cursor++; slots[i]??={current:initial};return slots[i];},useEffect:fn=>{effect=fn;} },
  'react/jsx-runtime':jsx,'../catalogue/finding-labels':labels,'../catalogue-router':load('src/catalogue-router.ts'),'./CatalogueOverview':overview,
}, {URL, Worker:class { constructor(){uiJobs.push(this);} postMessage(){} terminate(){this.terminated=true;} }});
let section='overview';
const tree=()=>{cursor=0;return ui.CatalogueImport({state:uiState,onSelect:file=>uiSession.select(file),onReset:()=>uiSession.reset(),section,emptyCopy:{title:'Empty synthetic Catalogue',body:'No source selected'}});};
const html=()=>renderToStaticMarkup(tree());
function nodes(node, predicate, output=[]) { if (!node || typeof node !== 'object') return output; if(predicate(node))output.push(node); React.Children.forEach(node.props?.children,child=>nodes(child,predicate,output));return output; }
test('actual UI empty and accessible',()=>{assert.match(html(),/No private source loaded/);assert.equal(uiJobs.length,0);assert.match(html(),/type="file"/);assert.match(html(),/aria-describedby="catalogue-privacy"/);assert.doesNotMatch(html(),/<(?:img|iframe|form)\b/);});
const unmount=()=>uiSession.dispose();
test('actual UI selection clears input and renders summary',()=>{
  const input=nodes(tree(),n=>n.type==='input')[0]; const event={currentTarget:{files:[{name:'synthetic.json',size:200}],value:'synthetic.json'}};input.props.onChange(event);assert.equal(event.currentTarget.value,'');assert.match(html(),/Reading and validating locally/);
  uiJobs[0].onmessage({data:parse(fixture())});assert.match(html(),/Source structurally accepted/);assert.doesNotMatch(html(),/Empty synthetic Catalogue/);assert.match(html(),/Commercial releases/);assert.match(html(),/Known ISRC/);
});
test('actual UI QA evidence escapes private markup',()=>{
  const d=fixture();d.qa[0]['Objet']='<img src=x onerror=alert(1)>'; const input=nodes(tree(),n=>n.type==='input')[0];input.props.onChange({currentTarget:{files:[{name:'synthetic.json',size:200}],value:''}});uiJobs.at(-1).onmessage({data:parse(d)});section='qa';const s=html();assert.match(s,/Pending review/);assert.match(s,/Private source evidence/);assert.match(s,/&lt;img/);assert.doesNotMatch(s,/<img/);assert.match(s,/Previous cases/);
});
test('actual UI reset and unmount',()=>{nodes(tree(),n=>n.type==='button'&&n.props.children==='Reset / unload')[0].props.onClick();assert.match(html(),/No private source loaded/);unmount();assert.ok(uiJobs.every(j=>j.terminated));});

// Measurements are local Node wall-clock samples, never Cloudflare CPU claims.
for (const n of [168, 1000, 5000]) {
  const d=fixture(); const base=d.recordings[0]; d.recordings=Array.from({length:n},(_,i)=>({...base,id:`rec-${i+1}`,title:`Synthetic ${i+1}`,isrc:null,provenance:{sheet:'Pistes consolidées',sourceId:`rec-${i+1}`}})); recount(d);
  const start=performance.now(); const r=parse(d); assert.equal(r.status,'accepted');
  console.log(`Synthetic profile: ${n} recordings, ${Buffer.byteLength(JSON.stringify(d))} bytes, ${(performance.now()-start).toFixed(1)} ms local Node wall time.`);
}
console.log(`Build119 PASS: ${cases} synthetic parser, identity, provenance, atomicity, lifecycle and privacy cases.`);
