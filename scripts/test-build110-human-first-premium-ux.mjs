import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const pkg = JSON.parse(read('package.json'));
const release = read('src/release.ts');

assert.equal(pkg.version, '0.19.32', 'Build110 must publish Studio v0.19.32.');
assert.match(release, /version:\s*'0\.19\.32'/);
assert.match(release, /build:\s*110/);
assert.match(release, /phase:\s*10/);
assert.match(release, /studio-focus-build110-human-first-premium-ux/);
assert.match(release, /build109AncestryMarker/);

console.log('Build110 allocation PASS: v0.19.32 / Build110 / Phase10 identity is reserved for human-first Studio simplification and premium UX.');
