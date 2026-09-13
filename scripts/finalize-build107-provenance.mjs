// Delegate artifact generation to SonicTrace, then pin its actual committed module.
// This script contains no numerical implementation or independent artifact copier.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { expected, verify } from './verify-catalog-projection-kernel.mjs';

assert.ok(process.argv[2], 'Usage: node scripts/finalize-build107-provenance.mjs <SonicTrace checkout>');
const sourceRoot = path.resolve(process.argv[2]);
const studioRoot = fileURLToPath(new URL('../', import.meta.url));
const artifact = path.join(studioRoot, 'src/vendor/catalog-projection-kernel.mjs');
const committed = execFileSync('git', ['-c','safe.directory=*','-C',sourceRoot,'show', `${expected.sourceCommit}:${expected.sourcePath}`]);
verify(committed, expected);
assert.deepEqual(fs.readFileSync(artifact), committed, 'Provenance finalization must preserve current kernel bytes');
assert.deepEqual(fs.readFileSync(path.join(sourceRoot, expected.sourcePath)), committed, 'Vendor source must equal the pinned commit');
execFileSync(process.execPath, [path.join(sourceRoot,'scripts/vendor-build107-kernel.mjs'), studioRoot], {cwd:sourceRoot, stdio:'inherit'});
assert.deepEqual(fs.readFileSync(artifact), committed, 'SonicTrace generator must preserve committed bytes');
fs.writeFileSync(path.join(studioRoot,'src/vendor/catalog-projection-kernel.origin.json'), JSON.stringify(expected,null,2)+'\n');
execFileSync(process.execPath, [path.join(studioRoot,'scripts/verify-catalog-projection-kernel.mjs'),sourceRoot], {cwd:studioRoot, stdio:'inherit'});
