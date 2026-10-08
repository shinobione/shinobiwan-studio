// Build126 / C7a browser gate. Independently invented input only.
// The actual browser worker may read source bytes locally but returns aggregate counts only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';

process.env.A24C_C5_LIBRARY_ONLY = '1';
const { fictionalC5V2, addFictionalC5Detail, parseC5Source } =
  await import('./test-a24c-c5-reviewed-migration.mjs');
delete process.env.A24C_C5_LIBRARY_ONLY;

const source = fictionalC5V2();
addFictionalC5Detail(source);
const loose = source.detailedDistributorEvidence[1];
loose.linkStatus = 'unlinked';
loose.linkProof = null;
loose.linkIssueCode = 'EXACT_TARGET_NOT_FOUND';
loose.releaseId = null;
loose.appearanceId = null;
const parsed = parseC5Source(source);
assert.equal(parsed.status,'accepted');

const read = file => fs.readFileSync(file,'utf8');
const pkg = JSON.parse(read('package.json'));
assert.equal(pkg.version,'0.19.48');
const release = read('src/release.ts');
assert.match(release,/build:\s*126/);
assert.ok(release.includes("build125AncestryMarker = \"version: '0.19.47' · build: 125"));
assert.match(pkg.scripts.build,/check:build126/);
for(const file of [
  'src/catalogue/c7a-preview.ts',
  'src/catalogue/c7a-preview.worker.ts',
  'src/catalogue/c7a-preview-session.ts',
  'src/components/CatalogueMigrationPreview.tsx'
]){
  const code = read(file);
  assert.doesNotMatch(code,/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|caches\.open|URL\.createObjectURL|crypto\.subtle\.encrypt|sealFictionalRegistryPackage/);
}
assert.doesNotMatch(read('src/catalogue/c7a-preview.worker.ts'),/postMessage\s*\(\s*(?:input|root|source|snapshot|result)\s*\)/);
assert.doesNotMatch(read('src/components/CatalogueMigrationPreview.tsx'),/CatalogueSnapshot|FictionalRegistryRecoveryLab|onSave|onApprove|exportEncrypted/);

const server=await createServer({configFile:false,base:'/',server:{host:'127.0.0.1',port:0},logLevel:'error'});
await server.listen();
const origin='http://127.0.0.1:'+server.httpServer.address().port;
let browser;
let total=0;
async function scenario(name,fn){await fn();total++;console.log('Build126 C7a Chromium: '+name+' PASS');}
const upload=(value,name='imaginary-v2.json')=>({
  name,mimeType:'application/json',
  buffer:Buffer.from(typeof value==='string'?value:JSON.stringify(value)),
});
try{
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({serviceWorkers:'block'});
  const requests=[],consoleMessages=[],errors=[];
  await context.route('**/*',route=>{
    const request=route.request();
    requests.push({url:request.url(),method:request.method(),body:request.postData()??''});
    return request.url().startsWith(origin+'/')?route.continue():route.abort();
  });
  const page=await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>consoleMessages.push(m.text()));
  await page.goto(origin+'/#/catalogue/migration-preview');
  const picker=page.getByLabel('Select private v2 JSON for local migration preview');
  const nav=page.getByRole('navigation',{name:'Catalogue sections'});
  const accepted=()=>page.getByText('Structurally accepted v2 for aggregate preflight only.').waitFor();
  const metrics=page.getByLabel('C7a aggregate source review counts');
  const card=label=>metrics.locator('.c7a-preview-metric').filter({has:page.locator('span',{hasText:new RegExp('^'+label+'$')})}).locator('strong');

  await scenario('isolated C7a route starts empty and requires explicit local v2 selection',async()=>{
    await page.getByRole('heading',{name:'Preview migration requirements — no commercial writes'}).waitFor();
    await page.getByText('No C7a source loaded.').waitFor();
    assert.equal(await picker.count(),1);
    assert.equal(await page.getByLabel('Local private import').count(),0);
    assert.equal(await page.getByRole('button',{name:/Approve fictional restore/}).count(),0);
  });

  await scenario('actual v2 worker accepts invented v2 with linked and unlinked independent proof',async()=>{
    await picker.setInputFiles(upload(source));
    await accepted();
    assert.equal(await card('Recordings').textContent(),'1');
    assert.equal(await card('Releases').textContent(),'1');
    assert.equal(await card('Appearances').textContent(),'1');
    assert.equal(await card('Linked historical details').textContent(),'1');
    assert.equal(await card('Unlinked historical details').textContent(),'1');
    assert.equal(await card('Pending QA findings').textContent(),String(parsed.snapshot.findings.length));
    assert.equal(await card('Source aliases requiring human review').textContent(),'3');
    assert.equal(await card('New commercial entities').textContent(),'0');
    assert.equal(await picker.inputValue(),'');
  });

  await scenario('full ten-section status coverage and claim-only workbook digest are not silently upgraded',async()=>{
    const coverage=page.getByLabel('C7a source coverage audit');
    for(const [label,n] of [['Sections',10],['Represented',1],['Partial',7],['Omitted',2],['Contradictory',0],['Unverified',0]]){
      const row=coverage.locator('dl div').filter({has:page.locator('dt',{hasText:new RegExp('^'+label+'$')})});
      assert.equal(await row.locator('dd').textContent(),String(n));
    }
    await coverage.getByText('claim-only',{exact:true}).waitFor();
    await page.getByText('Migration status: HOLD — human mappings required').waitFor();
    assert.equal(await page.getByRole('button',{name:/Create registry|Export encrypted|Approve mapping/}).count(),0);
  });

  await scenario('replacement source with an invalid v2 cannot leave the former preview visible',async()=>{
    const bad=structuredClone(source);
    bad.coverageCounts.appearanceRows += 1;
    await picker.setInputFiles(upload(bad));
    await page.getByText('Local preview rejected.').waitFor();
    assert.equal(await metrics.count(),0);
    await page.getByText('No C7a source loaded.').count().then(n=>assert.equal(n,0));
  });

  await scenario('v1 file is rejected even if valid for the separate read-only Catalogue viewer',async()=>{
    const legacy=structuredClone(source);legacy.schemaVersion='catalogue-readonly-seed-v1';
    await picker.setInputFiles(upload(legacy));
    await page.getByText('This preflight accepts only the previously reviewed v2 source format.').waitFor();
    assert.equal(await metrics.count(),0);
  });

  await scenario('malformed, wrong extension, empty and oversized files are rejected fail closed',async()=>{
    await picker.setInputFiles(upload('{'));
    await page.getByText('Local preview rejected.').waitFor();
    await picker.setInputFiles(upload('{}','invented-source.txt'));
    await page.getByText('Only a local JSON file is accepted.').waitFor();
    await picker.setInputFiles(upload('','empty.json'));
    await page.getByText('The selected file is empty.').waitFor();
    await picker.setInputFiles({name:'oversized.json',mimeType:'application/json',buffer:Buffer.alloc(10*1024*1024+1,65)});
    await page.getByText('The selected file exceeds the 10 MiB limit.').waitFor();
    assert.equal(await metrics.count(),0);
  });

  await scenario('Reset clears aggregate state without writing a registry or download',async()=>{
    await picker.setInputFiles(upload(source));await accepted();
    await page.getByRole('button',{name:'Reset / discard C7a preview'}).click();
    await page.getByText('No C7a source loaded.').waitFor();
    assert.equal(await metrics.count(),0);
    assert.equal(await page.getByRole('link',{name:/Download.*registry|Export.*catalogue/}).count(),0);
  });

  await scenario('moving into fictional lab unmounts C7a and leaves no private source in old Catalogue viewer',async()=>{
    await picker.setInputFiles(upload(source));await accepted();
    await nav.getByRole('link',{name:'Fictional package lab'}).click();
    await page.getByRole('heading',{name:'Fictional encrypted package lab'}).waitFor();
    assert.equal(await page.getByLabel('C7a local migration preflight').count(),0);
    await nav.getByRole('link',{name:'Overview'}).click();
    await page.getByText('No private source loaded.',{exact:true}).waitFor();
    await nav.getByRole('link',{name:'Local migration preflight'}).click();
    await page.getByText('No C7a source loaded.').waitFor();
  });

  await scenario('refresh discards the entire C7a aggregate preview state',async()=>{
    await picker.setInputFiles(upload(source));await accepted();
    await page.reload();
    await page.getByText('No C7a source loaded.').waitFor();
    assert.equal(await metrics.count(),0);
  });

  await scenario('browser has no source upload or new storage in fresh isolated test context',async()=>{
    const storage=await page.evaluate(async()=>({
      local:Object.keys(localStorage),session:Object.keys(sessionStorage),
      databases:await indexedDB.databases(),caches:await caches.keys(),
    }));
    assert.deepEqual(storage,{local:[],session:[],databases:[],caches:[]});
    assert.ok(requests.every(r=>r.method==='GET' && !r.body && !r.url.includes('imaginary-detail')));
    assert.ok(!page.url().includes('imaginary-detail'));
    assert.ok(!consoleMessages.some(m=>/imaginary-detail|invented-ledger|imaginary-evidence-row/.test(m)));
    assert.deepEqual(errors,[]);
  });
  console.log('Build126 C7a: '+total+' real Chromium local v2/read-only aggregate cases PASS; FICTIONAL SOURCE ONLY, no user source or registry/export/write.');
}finally{
  await browser?.close();
  await server.close();
}
