// A2.4-C/A C3 · actual Chromium on localhost, independently invented bytes ONLY.
// Test harness inside an isolated browser page context. No STUDIO runtime crypto module,
// no Catalogue source selection, no download/Save As, no filesystem, no private user data.
// This is not production cryptographic/security certification.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { pbkdf2Sync, createDecipheriv } from 'node:crypto';

const fictionalPassphrase = 'Fictional passphrase exclusively for automated browser tests.';
const fictionalText = '{"fictionalRegistry":"cartoon-only","revision":3,"detail":"invented"}';
const minWork = 600_000;
const maxWork = 1_200_000;

// Browser-contained rehearsal, deliberately NOT shipped in src/ or imported by the app.
// Never use this isolated test function to process actual Catalogue material.
async function browserRehearsal({ passphrase, fakeText, workFloor, workCeiling }) {
  const enc = new TextEncoder();
  const MAX_ENVELOPE = 14 * 1024 * 1024; // browser-local: Playwright serializes this function without Node scope
  const dec = new TextDecoder('utf-8', { fatal: true });
  const u64 = bytes => btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
  function from64(value, length = null) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
    const padded = value.replaceAll('-', '+').replaceAll('_', '/');
    try {
      const bytes = Uint8Array.from(atob(padded), char => char.charCodeAt(0));
      if (u64(bytes) !== value || (length !== null && bytes.byteLength !== length)) return null;
      return bytes;
    } catch { return null; }
  }
  const expectedHeader = ['magic','version','kdf','iterations','salt','cipher','nonce','tagBits','plaintextBytes'];
  const expectedRoot = ['header','ciphertext'];
  const sameKeys = (value, fields) => value && typeof value === 'object' && !Array.isArray(value) &&
    JSON.stringify(Object.keys(value)) === JSON.stringify(fields);

  function validate(raw) {
    if (typeof raw !== 'string' || !raw.length || enc.encode(raw).byteLength > MAX_ENVELOPE)
      return { status:'rejected', code:'ENVELOPE_SIZE' };
    let root;
    try { root = JSON.parse(raw); } catch { return { status:'rejected', code:'INVALID_ENVELOPE' }; }
    if (!sameKeys(root,expectedRoot) || JSON.stringify(root) !== raw ||
        !sameKeys(root.header,expectedHeader) || typeof root.ciphertext !== 'string')
      return { status:'rejected', code:'NONCANONICAL_ENVELOPE' };
    const header = root.header;
    if (header.magic !== 'SHINOCAT-PKG' || header.version !== 1 ||
        header.kdf !== 'PBKDF2-HMAC-SHA256' || header.cipher !== 'AES-256-GCM' ||
        header.tagBits !== 128) return { status:'rejected',code:'UNSUPPORTED_FORMAT' };
    if (!Number.isSafeInteger(header.iterations) || header.iterations < workFloor ||
        header.iterations > workCeiling) return { status:'rejected',code:'KDF_WORK_LIMIT' };
    if (!Number.isSafeInteger(header.plaintextBytes) || header.plaintextBytes < 1 ||
        header.plaintextBytes > 10 * 1024 * 1024) return { status:'rejected',code:'PAYLOAD_SIZE' };
    const salt=from64(header.salt,16),nonce=from64(header.nonce,12),cipher=from64(root.ciphertext);
    if (!salt || !nonce || !cipher || cipher.byteLength !== header.plaintextBytes + 16)
      return { status:'rejected',code:'INVALID_SEALED_BYTES' };
    return { status:'valid', header, salt, nonce, cipher, aad:enc.encode(JSON.stringify(header)) };
  }
  let derivations=0;
  async function key(password,salt,iterations) {
    derivations++;
    const source = await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations},
      source,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  async function seal(password,plain) {
    const data=enc.encode(plain),salt=crypto.getRandomValues(new Uint8Array(16)),
      nonce=crypto.getRandomValues(new Uint8Array(12));
    const header={magic:'SHINOCAT-PKG',version:1,kdf:'PBKDF2-HMAC-SHA256',
      iterations:workFloor,salt:u64(salt),cipher:'AES-256-GCM',nonce:u64(nonce),
      tagBits:128,plaintextBytes:data.byteLength};
    const derived=await key(password,salt,header.iterations);
    const encrypted=new Uint8Array(await crypto.subtle.encrypt({
      name:'AES-GCM',iv:nonce,additionalData:enc.encode(JSON.stringify(header)),tagLength:128
    },derived,data));
    return JSON.stringify({header,ciphertext:u64(encrypted)});
  }
  async function open(raw,password) {
    const input=validate(raw);
    if(input.status!=='valid') return input;
    try {
      const derived=await key(password,input.salt,input.header.iterations);
      const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:input.nonce,
        additionalData:input.aad,tagLength:128},derived,input.cipher);
      return {status:'verified',text:dec.decode(plaintext)};
    } catch { return {status:'rejected',code:'CANNOT_VERIFY_PACKAGE'}; }
  }
  const fails=(raw,code)=>validate(raw).code===code;
  const mutate=(raw,callback)=>{const x=JSON.parse(raw);callback(x);return JSON.stringify(x);};

  const first=await seal(passphrase,fakeText),second=await seal(passphrase,fakeText);
  const a=validate(first),b=validate(second);
  const file=new File([first],'fictional-only.scat',{type:'application/octet-stream'});
  const opened=await open(await file.text(),passphrase);
  const badPassword=await open(await file.text(),'a different invented password');
  const badCipher=mutate(first,x=>{let data=from64(x.ciphertext);data[0]^=1;x.ciphertext=u64(data);});
  const badHeader=mutate(first,x=>{x.header.iterations++;});
  const badBytes=mutate(first,x=>{x.ciphertext=u64(from64(x.ciphertext).slice(0,-1));});
  const before=derivations;
  const invalidWork=await open(mutate(first,x=>{x.header.iterations=workCeiling+1;}),passphrase);
  const invalidSize=await open(mutate(first,x=>{x.header.plaintextBytes=10*1024*1024+1;}),passphrase);
  const preflightDerivationsUnchanged=before===derivations;
  const tamperedCipher=await open(badCipher,passphrase);
  const tamperedHeader=await open(badHeader,passphrase);
  const root=JSON.parse(first);
  return {
    secureContext:isSecureContext,
    roundtrip:opened.status==='verified'&&opened.text===fakeText,
    fileAPI:file.size===enc.encode(first).byteLength,
    wrongPassword:badPassword.code==='CANNOT_VERIFY_PACKAGE',
    tamperCipher:tamperedCipher.code==='CANNOT_VERIFY_PACKAGE',
    tamperHeader:tamperedHeader.code==='CANNOT_VERIFY_PACKAGE',
    freshRandom:a.status==='valid'&&b.status==='valid'&&
      a.header.salt!==b.header.salt&&a.header.nonce!==b.header.nonce&&first!==second,
    formatRejects:fails(mutate(first,x=>{x.header.version=2;}),'UNSUPPORTED_FORMAT')&&
      fails(mutate(first,x=>{x.header.extra='invented';}),'NONCANONICAL_ENVELOPE')&&
      fails(first.replace('"version":1,','"version":1,"version":1,'),'NONCANONICAL_ENVELOPE'),
    sizeRejects:fails(badBytes,'INVALID_SEALED_BYTES')&&
      invalidSize.code==='PAYLOAD_SIZE'&&invalidWork.code==='KDF_WORK_LIMIT'&&
      preflightDerivationsUnchanged,
    noMetadataLeak:!first.includes('cartoon-only')&&!first.includes('fictionalRegistry')&&
      JSON.stringify(Object.keys(root.header))===JSON.stringify(expectedHeader),
    // Returning test-only encrypted fictional bytes for independent Node interop; no user content.
    fictionalEnvelope:first
  };
}

const server=await createServer({configFile:false,base:'/',server:{host:'127.0.0.1',port:0},logLevel:'error'});
await server.listen();
const origin='http://127.0.0.1:'+server.httpServer.address().port;
let browser;
try {
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({serviceWorkers:'block'});
  const requests=[],errors=[],messages=[];
  const sandboxUrl=origin+'/__a24c_fictional_browser_fixture__';
  await context.route('**/*',route=>{
    const r=route.request();
    requests.push({url:r.url(),method:r.method(),body:r.postData()??''});
    if (r.url() === sandboxUrl && r.method() === 'GET')
      return route.fulfill({status:200,contentType:'text/html; charset=utf-8',
        body:'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Invented-only C3a sandbox</title></head><body>Fictional in-memory crypto fixture; no STUDIO runtime loaded.</body></html>'});
    // Disallow external requests. The only intended page is a locally fulfilled fixture.
    return route.abort();
  });
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>messages.push(m.text()));
  await page.goto(sandboxUrl);
  const results=await page.evaluate(browserRehearsal,{
    passphrase:fictionalPassphrase,fakeText:fictionalText,
    workFloor:minWork,workCeiling:maxWork
  });
  let checks=0;
  const test=(label,value)=>{
    assert.equal(value,true,label);
    checks++;console.log('A2.4-C/A fictional C3 Chromium: '+label+' PASS');
  };
  test('secure localhost browser uses real Web Crypto',results.secureContext);
  test('synthetic sealed package roundtrip through real browser File API',results.roundtrip&&results.fileAPI);
  test('wrong passphrase is rejected without plaintext',results.wrongPassword);
  test('modified ciphertext and authenticated header reject',results.tamperCipher&&results.tamperHeader);
  test('fresh salt and nonce per independent export',results.freshRandom);
  test('unknown, added and duplicate JSON fields reject',results.formatRejects);
  test('truncation and excessive input/work reject pre-derivation',results.sizeRejects);
  test('opaque header excludes fictional source metadata',results.noMetadataLeak);

  // Browser-produced AEAD must be decryptable independently by Node's OpenSSL-backed primitives.
  const document=JSON.parse(results.fictionalEnvelope);
  const salt=Buffer.from(document.header.salt,'base64url'),iv=Buffer.from(document.header.nonce,'base64url');
  const key=pbkdf2Sync(fictionalPassphrase,salt,document.header.iterations,32,'sha256');
  const data=Buffer.from(document.ciphertext,'base64url');
  const decipher=createDecipheriv('aes-256-gcm',key,iv);
  decipher.setAAD(Buffer.from(JSON.stringify(document.header)));
  decipher.setAuthTag(data.subarray(-16));
  const decrypted=Buffer.concat([decipher.update(data.subarray(0,-16)),decipher.final()]);
  test('browser sealed bytes independently decode with Node OpenSSL',decrypted.toString('utf8')===fictionalText);
  key.fill(0);decrypted.fill(0);

  await page.reload();
  const storage=await page.evaluate(async()=>({
    local:Object.keys(localStorage),session:Object.keys(sessionStorage),
    databases:await indexedDB.databases(),cache:await caches.keys()
  }));
  test('refresh discards synthetic plaintext and creates no browser persistence',
    JSON.stringify(storage)===JSON.stringify({local:[],session:[],databases:[],cache:[]}));
  test('no upload, external request, URL/console disclosure or browser errors',
    requests.every(r=>r.method==='GET'&&r.url.startsWith(origin+'/')&&
      !r.url.includes('cartoon-only')&&!r.body.includes('cartoon-only'))&&
      !page.url().includes('cartoon-only')&&
      !messages.some(s=>s.includes('cartoon-only'))&&errors.length===0);

  console.log('A2.4-C/A fictional C3: '+checks+' real Chromium scenarios PASS; test-only File object, no disk Save As, runtime import/export, private source or durable backup.');
} finally {
  await browser?.close();
  await server.close();
}
