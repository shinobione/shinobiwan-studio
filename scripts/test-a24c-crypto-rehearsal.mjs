// A2.4-C/A C2 · invented bytes only, Node 24 test-only WebCrypto rehearsal.
// NOT imported by Studio, NOT a production crypto module, file writer or private source converter.
// No fs, network, browser Storage, actual user secrets or commercial data.
import assert from 'node:assert/strict';
import { webcrypto, pbkdf2Sync, createDecipheriv } from 'node:crypto';

const { subtle } = webcrypto;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const MAGIC = 'SHINOCAT-PKG';
const KDF = 'PBKDF2-HMAC-SHA256';
const CIPHER = 'AES-256-GCM';
const MIN_ITERATIONS = 600_000;
const MAX_ITERATIONS = 1_200_000;
const MAX_PLAINTEXT = 10 * 1024 * 1024;
const MAX_ENVELOPE = 14 * 1024 * 1024;
const HEADER_FIELDS = ['magic', 'version', 'kdf', 'iterations', 'salt', 'cipher', 'nonce', 'tagBits', 'plaintextBytes'];
const ROOT_FIELDS = ['header', 'ciphertext'];
const fakePassphrase = 'Invented-only strong rehearsal phrase - never an actual user secret.';
const fakePayload = '{"fictionalRegistry":"cartoon-only","fictionalRevision":2,"proof":"invented"}';

const rejected = code => ({ status: 'rejected', code });
const exactly = (value, expected) => value && typeof value === 'object' && !Array.isArray(value) &&
  JSON.stringify(Object.keys(value)) === JSON.stringify(expected);
const encode64 = bytes => Buffer.from(bytes).toString('base64url');
function decode64(s, byteLength = null) {
  if (typeof s !== 'string' || !s || !/^[A-Za-z0-9_-]+$/.test(s)) return null;
  const data = Buffer.from(s, 'base64url');
  if (encode64(data) !== s || (byteLength !== null && data.length !== byteLength)) return null;
  return data;
}
const secureBytes = length => webcrypto.getRandomValues(new Uint8Array(length));
let derivations = 0;
async function keyFor(passphrase, salt, iterations) {
  derivations++;
  const imported = await subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    imported, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
function preflight(raw) {
  if (typeof raw !== 'string' || !raw.length || Buffer.byteLength(raw, 'utf8') > MAX_ENVELOPE)
    return rejected('ENVELOPE_SIZE');
  let root;
  try { root = JSON.parse(raw); } catch { return rejected('INVALID_ENVELOPE'); }
  // Exact canonical JSON also prevents duplicate keys, reordered keys, escaping alternatives and added whitespace.
  if (!exactly(root, ROOT_FIELDS) || JSON.stringify(root) !== raw ||
      !exactly(root.header, HEADER_FIELDS) || typeof root.ciphertext !== 'string')
    return rejected('NONCANONICAL_ENVELOPE');
  const h = root.header;
  if (h.magic !== MAGIC || h.version !== 1 || h.kdf !== KDF || h.cipher !== CIPHER ||
      h.tagBits !== 128) return rejected('UNSUPPORTED_FORMAT');
  if (!Number.isSafeInteger(h.iterations) || h.iterations < MIN_ITERATIONS ||
      h.iterations > MAX_ITERATIONS) return rejected('KDF_WORK_LIMIT');
  if (!Number.isSafeInteger(h.plaintextBytes) || h.plaintextBytes < 1 ||
      h.plaintextBytes > MAX_PLAINTEXT) return rejected('PAYLOAD_SIZE');
  const salt = decode64(h.salt, 16), nonce = decode64(h.nonce, 12), ciphertext = decode64(root.ciphertext);
  if (!salt || !nonce || !ciphertext || ciphertext.length !== h.plaintextBytes + 16)
    return rejected('INVALID_SEALED_BYTES');
  return { status: 'valid', header: h, salt, nonce, ciphertext,
    aad: encoder.encode(JSON.stringify(h)) };
}
async function sealInventedOnly(passphrase, content = fakePayload) {
  assert.equal(typeof passphrase, 'string');
  const plaintext = encoder.encode(content);
  assert.ok(plaintext.length > 0 && plaintext.length <= MAX_PLAINTEXT);
  const salt = secureBytes(16), nonce = secureBytes(12);
  const header = { magic: MAGIC, version: 1, kdf: KDF, iterations: MIN_ITERATIONS,
    salt: encode64(salt), cipher: CIPHER, nonce: encode64(nonce), tagBits: 128,
    plaintextBytes: plaintext.length };
  const key = await keyFor(passphrase, salt, header.iterations);
  const ciphertext = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv: nonce,
    additionalData: encoder.encode(JSON.stringify(header)), tagLength: 128 }, key, plaintext));
  const raw = JSON.stringify({ header, ciphertext: encode64(ciphertext) });
  assert.equal(preflight(raw).status, 'valid');
  return raw;
}
async function openInventedOnly(raw, passphrase) {
  const envelope = preflight(raw);
  if (envelope.status === 'rejected') return envelope;
  if (typeof passphrase !== 'string' || passphrase.length === 0) return rejected('CANNOT_VERIFY_PACKAGE');
  try {
    const key = await keyFor(passphrase, envelope.salt, envelope.header.iterations);
    const result = await subtle.decrypt({ name: 'AES-GCM', iv: envelope.nonce,
      additionalData: envelope.aad, tagLength: 128 }, key, envelope.ciphertext);
    return { status: 'verified', text: decoder.decode(result) };
  } catch {
    // Authentication failures (wrong password vs modified authenticated bytes) have one user-facing class.
    return rejected('CANNOT_VERIFY_PACKAGE');
  }
}
function mutate(raw, change) {
  const doc = JSON.parse(raw);
  change(doc);
  return JSON.stringify(doc);
}

let count = 0;
async function test(label, fn) {
  await fn();
  count++;
  console.log('A2.4-C/A fictional C2: ' + label + ' PASS');
}
const sealed = await sealInventedOnly(fakePassphrase);
const parsed = preflight(sealed);
assert.equal(parsed.status, 'valid');
const originalDerivations = derivations;

await test('real Web Crypto PBKDF2/AES-GCM synthetic roundtrip', async () => {
  const opened = await openInventedOnly(sealed, fakePassphrase);
  assert.equal(opened.status, 'verified');
  assert.equal(opened.text, fakePayload);
});
await test('independent Node PBKDF2 and OpenSSL-backed AES-GCM can decode authenticated envelope', () => {
  const key = pbkdf2Sync(encoder.encode(fakePassphrase), parsed.salt, parsed.header.iterations, 32, 'sha256');
  const ciphertext = parsed.ciphertext.subarray(0, -16);
  const tag = parsed.ciphertext.subarray(-16);
  const decipher = createDecipheriv('aes-256-gcm', key, parsed.nonce);
  decipher.setAAD(parsed.aad);
  decipher.setAuthTag(tag);
  const result = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  assert.equal(decoder.decode(result), fakePayload);
  key.fill(0);
});
await test('wrong passphrase has one non-disclosing authentication failure', async () => {
  const result = await openInventedOnly(sealed, 'different invented password');
  assert.deepEqual(result, rejected('CANNOT_VERIFY_PACKAGE'));
});
await test('one altered ciphertext byte cannot activate plaintext', async () => {
  const altered = mutate(sealed, x => {
    const b = decode64(x.ciphertext); b[0] ^= 1; x.ciphertext = encode64(b);
  });
  assert.deepEqual(await openInventedOnly(altered, fakePassphrase), rejected('CANNOT_VERIFY_PACKAGE'));
});
await test('valid-shape change to authenticated KDF header is rejected by AEAD', async () => {
  const altered = mutate(sealed, x => { x.header.iterations++; });
  assert.equal(preflight(altered).status, 'valid');
  assert.deepEqual(await openInventedOnly(altered, fakePassphrase), rejected('CANNOT_VERIFY_PACKAGE'));
});
await test('unsupported algorithm or format version rejects before deriving keys', () => {
  const baseline = derivations;
  assert.equal(preflight(mutate(sealed,x => { x.header.cipher = 'AES-CBC'; })).code,'UNSUPPORTED_FORMAT');
  assert.equal(preflight(mutate(sealed,x => { x.header.version = 2; })).code,'UNSUPPORTED_FORMAT');
  assert.equal(preflight(mutate(sealed,x => { x.header.kdf = 'SHA-256'; })).code,'UNSUPPORTED_FORMAT');
  assert.equal(derivations, baseline);
});
await test('noncanonical order, extra fields, duplicate keys and JSON whitespace reject', () => {
  assert.equal(preflight(mutate(sealed,x => { x.header.extra = 'invented'; })).code,'NONCANONICAL_ENVELOPE');
  const doc = JSON.parse(sealed);
  assert.equal(preflight(JSON.stringify({ ciphertext:doc.ciphertext, header:doc.header })).code,'NONCANONICAL_ENVELOPE');
  assert.equal(preflight(sealed + '\n').code,'NONCANONICAL_ENVELOPE');
  assert.equal(preflight(sealed.replace('"version":1,', '"version":1,"version":1,')).code,'NONCANONICAL_ENVELOPE');
});
await test('bad salt/nonce and noncanonical Base64URL reject before key derivation', () => {
  assert.equal(preflight(mutate(sealed,x => { x.header.salt = encode64(secureBytes(8)); })).code,'INVALID_SEALED_BYTES');
  assert.equal(preflight(mutate(sealed,x => { x.header.nonce = encode64(secureBytes(8)); })).code,'INVALID_SEALED_BYTES');
  assert.equal(preflight(mutate(sealed,x => { x.header.salt += '='; })).code,'INVALID_SEALED_BYTES');
});
await test('truncation and declared-size mismatch fail closed without partial decryption', () => {
  assert.equal(preflight(mutate(sealed,x => { x.ciphertext = encode64(decode64(x.ciphertext).subarray(0,-1)); })).code,'INVALID_SEALED_BYTES');
  assert.equal(preflight(mutate(sealed,x => { x.header.plaintextBytes++; })).code,'INVALID_SEALED_BYTES');
  assert.equal(preflight(sealed.slice(0,-8)).code,'INVALID_ENVELOPE');
});
await test('untrusted oversized KDF work and payload size reject prior to derivation', async () => {
  const baseline = derivations;
  assert.equal((await openInventedOnly(mutate(sealed,x => { x.header.iterations = 1_200_001; }),fakePassphrase)).code,'KDF_WORK_LIMIT');
  assert.equal((await openInventedOnly(mutate(sealed,x => { x.header.iterations = 1; }),fakePassphrase)).code,'KDF_WORK_LIMIT');
  assert.equal((await openInventedOnly(mutate(sealed,x => { x.header.plaintextBytes = MAX_PLAINTEXT + 1; }),fakePassphrase)).code,'PAYLOAD_SIZE');
  assert.equal((await openInventedOnly(sealed+' '.repeat(MAX_ENVELOPE),fakePassphrase)).code,'ENVELOPE_SIZE');
  assert.equal(derivations, baseline);
});
await test('two explicit encryptions produce independently fresh salt, nonce and ciphertext', async () => {
  const second = preflight(await sealInventedOnly(fakePassphrase));
  assert.equal(second.status,'valid');
  assert.notEqual(second.header.salt,parsed.header.salt);
  assert.notEqual(second.header.nonce,parsed.header.nonce);
  assert.notEqual(encode64(second.ciphertext),encode64(parsed.ciphertext));
});
await test('plaintext header exposes no source identity or sensitive invented payload metadata', () => {
  assert.deepEqual(Object.keys(parsed.header),HEADER_FIELDS);
  assert.deepEqual(Object.keys(JSON.parse(sealed)),ROOT_FIELDS);
  assert.ok(!sealed.includes('fictionalRegistry'));
  assert.ok(!sealed.includes('cartoon-only'));
  assert.equal(originalDerivations > 0,true);
});

console.log('A2.4-C/A fictional C2: '+count+' authenticated-format tests PASS; no real source, file I/O, browser Storage, network, runtime or durable backup.');
