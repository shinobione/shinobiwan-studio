// Build125/C6 — real browser synthetic full-registry download/open/restore UX.
// Invented fixture only. NO real owner source, runtime persistence, backend write or cloud sync.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const read=p=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(read('package.json'));
const release=read('src/release.ts');
assert.equal(pkg.version,'0.19.47');
assert.match(release,/build:\s*125/);
assert.ok(release.includes("build124AncestryMarker = \"version: '0.19.46' · build: 124"));
assert.match(pkg.scripts.build,/check:build125/);
assert.match(read('src/catalogue/fictionalRegistryLab.ts'),/SYNTHETIC-ONLY/);
assert.match(read('src/components/FictionalRegistryRecoveryLab.tsx'),/Full fictional commercial registry recovery lab/);
assert.doesNotMatch(read('src/catalogue/fictionalRegistryLab.ts'),/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon/);
assert.doesNotMatch(read('src/components/FictionalRegistryRecoveryLab.tsx'),/CatalogueImport|CatalogueSnapshot|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon/);

const passphrase='Build125 invented browser recovery phrase only, never a real password.';
const wrong='Wrong invented Build125 test phrase, unrelated to any user secret.';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'build125-c6-fictional-'));
const fullFile=path.join(temp,'fictional-commercial-registry-r1.scat');
const rollbackFile=path.join(temp,'fictional-commercial-registry-r0.scat');
const foreignFile=path.join(temp,'fictional-commercial-registry-foreign.scat');

const server=await createServer({configFile:false,base:'/',server:{host:'127.0.0.1',port:0},logLevel:'error'});
await server.listen();
const origin='http://127.0.0.1:'+server.httpServer.address().port;
let browser;
try{
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({acceptDownloads:true,serviceWorkers:'block'});
  const requests=[],messages=[],errors=[];
  await context.route('**/*',route=>{
    const request=route.request();
    requests.push({url:request.url(),method:request.method(),body:request.postData()??''});
    return request.url().startsWith(origin+'/')?route.continue():route.abort();
  });
  const page=await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>messages.push(m.text()));
  let checks=0;
  async function step(name,fn){await fn();checks++;console.log('Build125 fictional C6 Chromium: '+name+' PASS');}

  await page.goto(origin+'/#/catalogue/lab');
  const pass=page.getByLabel('Fictional registry test passphrase (re-enter before each open)');
  const fileInput=page.getByLabel('Open downloaded fictional registry');

  await step('full registry recovery UI is visible inside isolated lab with revision zero current state',async()=>{
    await page.getByRole('heading',{name:'Rehearse a complete commercial registry restore'}).waitFor();
    await page.getByText('Fictional registry is at revision 0. Nothing is persisted.').waitFor();
    assert.equal(await page.locator('.catalogue-import').count(),0);
    assert.equal(await page.getByLabel('Current fictional registry state').getByText('Revision 0').count(),1);
    assert.equal(await pass.inputValue(),'');
  });

  await step('generate full fictional revision 1 creates download only after explicit passphrase',async()=>{
    await pass.fill(passphrase);
    await page.getByRole('button',{name:'Generate full fictional revision 1'}).click();
    await page.getByText('Fictional revision 1 package ready. Download it, then reopen that downloaded file.').waitFor();
    assert.equal(await pass.inputValue(),'');
    assert.equal(await page.getByRole('link',{name:'Download full fictional registry'}).count(),1);
    assert.equal(await page.getByRole('button',{name:/Approve fictional restore/}).count(),0);
  });

  await step('actual Chromium download produces encrypted full-registry disk file with no fixture plaintext',async()=>{
    const [download]=await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link',{name:'Download full fictional registry'}).click(),
    ]);
    assert.equal(download.suggestedFilename(),'fictional-commercial-registry-r1.scat');
    await download.saveAs(fullFile);
    const raw=read(fullFile);
    assert.ok(raw.includes('"magic":"SHINOCAT-PKG"'));
    assert.ok(fs.statSync(fullFile).size>300&&fs.statSync(fullFile).size<256*1024);
    for(const leak of ['invented-registry-browser-c6','An imaginary echo','fictional-unlinked-detail','EXACT_TARGET_NOT_FOUND'])
      assert.equal(raw.includes(leak),false,'plaintext leak: '+leak);
  });

  await step('reopening actual downloaded file authenticates candidate but leaves current revision unchanged',async()=>{
    await pass.fill(passphrase);
    await fileInput.setInputFiles(fullFile);
    await page.getByText('Candidate authenticated. Fictional revision 1 requires explicit restore review.').waitFor();
    assert.equal(await page.getByLabel('Authenticated fictional candidate').getByText('Revision 1').count(),1);
    assert.equal(await page.getByLabel('Current fictional registry state').getByText('Revision 0').count(),1);
    assert.equal(await page.getByRole('button',{name:'Approve fictional restore to revision 1'}).count(),1);
    assert.equal(await pass.inputValue(),'');
    assert.equal(await fileInput.inputValue(),'');
  });

  await step('explicit restore confirmation changes only transient fictional state to revision 1 and preserves counts',async()=>{
    await page.getByRole('button',{name:'Approve fictional restore to revision 1'}).click();
    await page.getByText('Fictional restore applied in memory. Current revision is 1. Nothing was persisted.').waitFor();
    const state=page.getByLabel('Current fictional registry state');
    assert.equal(await state.getByText('Revision 1').count(),1);
    for(const value of ['1','2']){
      assert.ok(await state.getByText(value,{exact:true}).count()>=1);
    }
    assert.equal(await page.getByRole('button',{name:/Approve fictional restore/}).count(),0);
  });

  await step('same downloaded revision is idempotent after restore and cannot trigger another restore',async()=>{
    await pass.fill(passphrase);
    await fileInput.setInputFiles(fullFile);
    await page.getByText('Candidate authenticated. Same verified fictional revision; no restore needed.').waitFor();
    assert.equal(await page.getByRole('button',{name:/Approve fictional restore/}).count(),0);
  });

  await step('wrong passphrase and tampered ciphertext fail closed without changing current revision',async()=>{
    await pass.fill(wrong);
    await fileInput.setInputFiles(fullFile);
    await page.getByText('Cannot open or verify fictional registry package.').waitFor();
    assert.equal(await page.getByLabel('Current fictional registry state').getByText('Revision 1').count(),1);

    const envelope=JSON.parse(read(fullFile));
    const cipher=Buffer.from(envelope.ciphertext,'base64url');cipher[0]^=1;
    envelope.ciphertext=cipher.toString('base64url');
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'tampered-fictional-registry.scat',mimeType:'application/octet-stream',buffer:Buffer.from(JSON.stringify(envelope))});
    await page.getByText('Cannot open or verify fictional registry package.').waitFor();
    assert.equal(await page.getByLabel('Current fictional registry state').getByText('Revision 1').count(),1);
  });

  await step('generated rollback fixture downloads and is explicitly blocked after revision 1 restore',async()=>{
    await page.getByText('Adversarial fictional fixtures').click();
    await pass.fill(passphrase);
    await page.getByRole('button',{name:'Generate revision 0 rollback fixture'}).click();
    await page.getByText('Synthetic adversarial fixture ready for download and reopen testing.').waitFor();
    const [download]=await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link',{name:'Download rollback fixture'}).click(),
    ]);
    assert.equal(download.suggestedFilename(),'fictional-commercial-registry-r0.scat');
    await download.saveAs(rollbackFile);
    await pass.fill(passphrase);
    await fileInput.setInputFiles(rollbackFile);
    await page.getByText('Blocked fictional rollback: revision 0 is older than current revision 1.').waitFor();
    assert.equal(await page.getByRole('button',{name:/Approve fictional restore/}).count(),0);
  });

  await step('generated foreign registry fixture downloads and is explicitly rejected',async()=>{
    await pass.fill(passphrase);
    await page.getByRole('button',{name:'Generate foreign registry fixture'}).click();
    await page.getByText('Synthetic adversarial fixture ready for download and reopen testing.').waitFor();
    const [download]=await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link',{name:'Download foreign fixture'}).click(),
    ]);
    assert.equal(download.suggestedFilename(),'fictional-commercial-registry-foreign.scat');
    await download.saveAs(foreignFile);
    await pass.fill(passphrase);
    await fileInput.setInputFiles(foreignFile);
    await page.getByText('Blocked foreign fictional registry.').waitFor();
    assert.equal(await page.getByLabel('Current fictional registry state').getByText('Revision 1').count(),1);
  });

  await step('foreign JSON and oversized input cannot become a candidate registry',async()=>{
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'not-a-registry.json',mimeType:'application/json',buffer:Buffer.from('{"schema":"not-fictional-c6"}')});
    await page.getByText('Cannot open or verify fictional registry package.').waitFor();
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'oversized.scat',mimeType:'application/octet-stream',buffer:Buffer.alloc(256*1024+1,65)});
    await page.getByText('Cannot open or verify fictional registry package.').waitFor();
  });

  await step('reset clears transient restored state and all generated C6 download links',async()=>{
    await page.getByRole('button',{name:'Reset full fictional registry lab'}).click();
    await page.getByText('Fictional registry is at revision 0. Nothing is persisted.').waitFor();
    assert.equal(await page.getByRole('link',{name:'Download full fictional registry'}).count(),0);
    assert.equal(await page.getByRole('link',{name:'Download rollback fixture'}).count(),0);
    assert.equal(await page.getByRole('link',{name:'Download foreign fixture'}).count(),0);
    assert.equal(await pass.inputValue(),'');
  });

  await step('refresh discards C6 in-memory restore state and does not persist browser data',async()=>{
    await page.reload();
    await page.getByText('Fictional registry is at revision 0. Nothing is persisted.').waitFor();
    const storage=await page.evaluate(async()=>({
      local:Object.keys(localStorage),session:Object.keys(sessionStorage),
      databases:await indexedDB.databases(),caches:await caches.keys(),
    }));
    assert.deepEqual(storage,{local:[],session:[],databases:[],caches:[]});
  });

  await step('synthetic full-registry UX makes no upload or private plaintext network URL console leak',async()=>{
    assert.ok(requests.every(r=>r.method==='GET'&&!r.body.includes('invented-registry-browser-c6')&&!r.url.includes('invented-registry-browser-c6')));
    assert.ok(!page.url().includes('invented-registry-browser-c6'));
    assert.ok(!messages.some(m=>m.includes('invented-registry-browser-c6')||m.includes('An imaginary echo')));
    assert.deepEqual(errors,[]);
  });

  console.log('Build125 fictional C6: '+checks+' real Chromium full-registry Save/Open/restore scenarios PASS; hardcoded invented registry only, no owner source or production persistence.');
} finally {
  await browser?.close();
  await server.close();
  fs.rmSync(temp,{recursive:true,force:true});
}
