import fs from 'node:fs';

const path = 'scripts/test-phase-ux-c2-5-d-albums.mjs';
const source = fs.readFileSync(path, 'utf8');
const before = "if (['0.19.21', '0.19.22'].includes(pkg.version)) {";
const after = "if (['0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) {";
const count = source.split(before).length - 1;
if (count !== 1) throw new Error(`${path}: expected exactly one Build99+ successor version marker, found ${count}`);
fs.writeFileSync(path, source.replace(before, after));
console.log('Build101 inherited C2.5-D successor guard aligned without weakening functional assertions');
