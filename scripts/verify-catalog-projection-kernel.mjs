import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const expected = {
  sourceRepository: 'shinobione/LM-IA-Analayse',
  sourcePath: 'js/catalog-projection-kernel.mjs',
  sourceCommit: '70b0bf277a01f3817dd2db71c91233a8fe91debf',
  sha256: 'f883aa12011d0714049717c6de6a426fbc7c8296a5aa872a978aaeefc47f34d8',
};
export function verify(bytes, origin) {
  assert.deepEqual(origin, expected, 'Provenance must match the reviewed pin');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expected.sha256, 'Vendored kernel digest mismatch');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bytes = fs.readFileSync(new URL('../src/vendor/catalog-projection-kernel.mjs', import.meta.url));
  const origin = JSON.parse(fs.readFileSync(new URL('../src/vendor/catalog-projection-kernel.origin.json', import.meta.url),'utf8'));
  verify(bytes, origin);
  if (process.argv[2]) {
    // Explicit local source checkout verification. No runtime or build network access.
    const sourceRoot = path.resolve(process.argv[2]);
    assert.deepEqual(bytes, fs.readFileSync(path.join(sourceRoot, origin.sourcePath)), 'Canonical working source differs');
    const repository = execFileSync('git', ['-c','safe.directory=*','-C',sourceRoot,'remote','get-url','origin'], {encoding:'utf8'}).trim();
    assert.ok(['https://github.com/' + origin.sourceRepository + '.git', 'https://github.com/' + origin.sourceRepository, 'git@github.com:' + origin.sourceRepository + '.git'].includes(repository), 'Source repository mismatch');
    const committed = execFileSync('git', ['-c','safe.directory=*','-C',sourceRoot,'show', origin.sourceCommit + ':' + origin.sourcePath]);
    assert.deepEqual(bytes, committed, 'Vendored bytes differ from the committed SonicTrace module');
  }
  console.log('PASS Build107 distribution digest/provenance' + (process.argv[2] ? ' and committed SonicTrace module.' : ' (standalone, offline).'));
}
