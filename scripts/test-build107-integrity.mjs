import assert from 'node:assert/strict';
import fs from 'node:fs';
import { verify } from './verify-catalog-projection-kernel.mjs';
const bytes = fs.readFileSync('src/vendor/catalog-projection-kernel.mjs');
const origin = JSON.parse(fs.readFileSync('src/vendor/catalog-projection-kernel.origin.json','utf8'));
verify(bytes, origin);
assert.throws(() => verify(Buffer.concat([bytes,Buffer.from('\n')]),origin), /digest mismatch/);
for (const key of Object.keys(origin)) assert.throws(() => verify(bytes,{...origin,[key]:'tampered'}), /Provenance/);
console.log('PASS Build107 integrity negative tests: modified bytes and every provenance field rejected.');
