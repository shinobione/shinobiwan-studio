// Build124/C3b — real Studio route + browser DOWNLOADED fictional file round-trip.
// All names, fixtures and source rows are independently invented. NO real owner data.
// CI alone may save the encrypted fictional download into a disposable temporary folder.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pbkdf2Sync, createDecipheriv } from 'node:crypto';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { fixture } from './catalogue-synthetic.mjs';

const read = p => fs.readFileSync(p, 'utf8');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');
assert.ok(read('src/release.ts').includes(`build123AncestryMarker = "version: '0.19.45' · build: 123`));
assert.ok(read('src/release.ts').includes(`build124AncestryMarker = "version: '0.19.46' · build: 124`));
assert.match(pkg.scripts.build,/check:build124/);
assert.match(read('src/catalogue/fictionalPackageLab.ts'), /FICTIONAL_PAYLOAD/);
assert.doesNotMatch(read('src/catalogue/fictionalPackageLab.ts'), /sourceSheets|recordingId|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon/);

const passphrase='An invented fictional-only test phrase, not an actual account or recovery secret.';
const wrong='Invented wrong password, unrelated to all actual source data.';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'fictional-package-lab-'));
const downloaded=path.join(temp,'fictional-catalogue-lab.scat');
const server=await createServer({configFile:false,base:'/',server:{host:'127.0.0.1',port:0},logLevel:'error'});
await server.listen();
const origin='http://127.0.0.1:'+server.httpServer.address().port;
let browser;
try {
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({acceptDownloads:true,serviceWorkers:'block'});
  const requests=[],messages=[],errors=[];
  await context.route('**/*',route=>{
    const request=route.request();
    requests.push({url:request.url(),method:request.method(),body:request.postData()??''});
    return request.url().startsWith(origin+'/') ? route.continue() : route.abort();
  });
  const page=await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>messages.push(m.text()));
  let checks=0;
  async function step(name,fn){await fn();checks++;console.log('Build124 fictional C3b Chromium: '+name+' PASS');}
  await page.goto(origin+'/#/catalogue/lab');
  const pass=page.getByLabel('Fictional test passphrase (enter it again when reopening)');
  const fileInput=page.getByLabel('Open downloaded fictional file');
  await step('exact separate Catalogue lab is visible without commercial source selection',async()=>{
    await page.getByRole('heading',{name:'Test a local encrypted file'}).waitFor();
    assert.equal(await page.locator('.catalogue-import').count(),0);
    assert.equal(await page.getByText('No fictional package generated or opened.').count(),1);
    assert.equal(await pass.inputValue(),'');
    assert.equal(await page.getByRole('link',{name:'Download fictional encrypted file'}).count(),0);
  });
  await step('explicit invented-only encryption creates download-ready link but not saved claim',async()=>{
    await pass.fill(passphrase);
    await page.getByRole('button',{name:'Generate fictional encrypted package'}).click();
    await page.getByText('Fictional encrypted package ready. Download it, then reopen the downloaded file.').waitFor();
    assert.equal(await pass.inputValue(),'');
    assert.equal(await page.getByRole('link',{name:'Download fictional encrypted file'}).count(),1);
    assert.equal(await page.getByText('Verified fictional package. No commercial Catalogue data changed.').count(),0);
  });
  await step('actual Chromium download is saved as disposable fictional disk file',async()=>{
    const [download]=await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link',{name:'Download fictional encrypted file'}).click(),
    ]);
    assert.equal(download.suggestedFilename(),'fictional-catalogue-lab.scat');
    await download.saveAs(downloaded);
    const stat=fs.statSync(downloaded);
    assert.ok(stat.isFile()&&stat.size>100&&stat.size<64*1024);
    const content=read(downloaded);
    assert.ok(content.includes('"magic":"SHINOCAT-PKG"'));
    assert.ok(!content.includes('invented-cartoon-registry'));
  });
  await step('downloaded bytes independently decrypt with Node-backed PBKDF2/AES-GCM',async()=>{
    const pkg=JSON.parse(read(downloaded));
    const h=pkg.header;
    const key=pbkdf2Sync(passphrase,Buffer.from(h.salt,'base64url'),h.iterations,32,'sha256');
    const input=Buffer.from(pkg.ciphertext,'base64url');
    const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(h.nonce,'base64url'));
    decipher.setAAD(Buffer.from(JSON.stringify(h)));
    decipher.setAuthTag(input.subarray(-16));
    const plain=Buffer.concat([decipher.update(input.subarray(0,-16)),decipher.final()]);
    const decoded=plain.toString('utf8');
    assert.match(decoded,/"schema":"shinocat-fictional-lab-only"/);
    assert.match(decoded,/"registry":"invented-cartoon-registry"/);
    key.fill(0);plain.fill(0);
  });
  await step('actual downloaded file is user-selected and verified with a freshly reentered passphrase',async()=>{
    await pass.fill(passphrase);
    await fileInput.setInputFiles(downloaded);
    await page.getByText('Verified fictional package. No commercial Catalogue data changed.').waitFor();
    assert.equal(await pass.inputValue(),'');
    assert.equal(await fileInput.inputValue(),'');
    assert.equal(await page.locator('.catalogue-import').count(),0);
  });
  await step('wrong passphrase cannot activate an earlier verified state',async()=>{
    await pass.fill(wrong);
    await fileInput.setInputFiles(downloaded);
    await page.getByText('Cannot open or verify fictional lab package.').waitFor();
    assert.equal(await page.getByText('Verified fictional package. No commercial Catalogue data changed.').count(),0);
    assert.equal(await pass.inputValue(),'');
  });
  await step('corrupted downloaded bytes and tampered authenticated metadata fail closed',async()=>{
    const original=JSON.parse(read(downloaded));
    const bad=structuredClone(original);
    const cipher=Buffer.from(bad.ciphertext,'base64url');cipher[0]^=1;bad.ciphertext=cipher.toString('base64url');
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'invented-tampered.scat',mimeType:'application/octet-stream',buffer:Buffer.from(JSON.stringify(bad))});
    await page.getByText('Cannot open or verify fictional lab package.').waitFor();
    const badHeader=structuredClone(original);badHeader.header.iterations++;
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'invented-header.scat',mimeType:'application/octet-stream',buffer:Buffer.from(JSON.stringify(badHeader))});
    await page.getByText('Cannot open or verify fictional lab package.').waitFor();
  });
  await step('foreign JSON and excessive KDF budget cannot become a lab or commercial registry',async()=>{
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'unrelated-fictional.json',mimeType:'application/json',buffer:Buffer.from('{"invented":"not a lab package"}')});
    await page.getByText('Cannot open or verify fictional lab package.').waitFor();
    const wrongWork=JSON.parse(read(downloaded));wrongWork.header.iterations=1_200_001;
    await pass.fill(passphrase);
    await fileInput.setInputFiles({name:'invented-unsafe-work.scat',mimeType:'application/octet-stream',buffer:Buffer.from(JSON.stringify(wrongWork))});
    await page.getByText('Cannot open or verify fictional lab package.').waitFor();
  });
  await step('lab Reset revokes generated download link and clears pending verification',async()=>{
    await page.getByRole('button',{name:'Reset fictional lab'}).click();
    await page.getByText('No fictional package generated or opened.').waitFor();
    assert.equal(await page.getByRole('link',{name:'Download fictional encrypted file'}).count(),0);
    assert.equal(await pass.inputValue(),'');
  });
  await step('refresh and route exit/reentry discard the lab and leave Catalogue view empty',async()=>{
    await page.reload();
    await page.getByText('No fictional package generated or opened.').waitFor();
    await page.getByRole('link',{name:'Overview'}).click();
    await page.getByText('No private source loaded.').waitFor();
    await page.getByRole('link',{name:'Fictional package lab'}).click();
    await page.getByText('No fictional package generated or opened.').waitFor();
  });
  await step('entering lab after separate invented v1 import discards its in-memory snapshot',async()=>{
    await page.getByRole('link',{name:'Overview'}).click();
    const source=fixture();
    await page.getByLabel('Select local source').setInputFiles({name:'invented-source.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(source))});
    await page.getByText('Source structurally accepted for dry-run.',{exact:false}).waitFor();
    await page.getByRole('link',{name:'Fictional package lab'}).click();
    await page.getByRole('heading',{name:'Test a local encrypted file'}).waitFor();
    assert.equal(await page.locator('.catalogue-import').count(),0);
    await page.getByRole('link',{name:'Overview'}).click();
    await page.getByText('No private source loaded.').waitFor();
  });
  await step('synthetic-only flow makes no private upload, persistent browser state or URL/console leak',async()=>{
    const storage=await page.evaluate(async()=>({
      local:Object.keys(localStorage),session:Object.keys(sessionStorage),
      databases:await indexedDB.databases(),caches:await caches.keys(),
    }));
    assert.deepEqual(storage,{local:[],session:[],databases:[],caches:[]});
    assert.ok(requests.every(r=>r.method==='GET'&&
      !r.body.includes('invented-cartoon-registry')&&!r.url.includes('invented-cartoon-registry')));
    assert.ok(!page.url().includes('invented-cartoon-registry'));
    assert.ok(!messages.some(m=>m.includes('invented-cartoon-registry')));
    assert.deepEqual(errors,[]);
  });
  console.log('Build124 fictional C3b: '+checks+' real Chromium Save As/open scenarios PASS; only invented fixture downloaded, no real-source code path, backend write or commercial persistence.');
} finally {
  await browser?.close();
  await server.close();
  fs.rmSync(temp,{recursive:true,force:true});
}
