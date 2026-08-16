import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, value) { fs.writeFileSync(path, value); }
function replaceOnce(path, before, after) {
  const source = read(path);
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${path}: expected exactly one marker, found ${count}`);
  write(path, source.replace(before, after));
}

// C2.5-D keeps the Build99+ Album upload assertion, only authorizing the bounded Build101 successor.
replaceOnce(
  'scripts/test-phase-ux-c2-5-d-albums.mjs',
  "if (['0.19.21', '0.19.22'].includes(pkg.version)) {",
  "if (['0.19.21', '0.19.22', '0.19.23'].includes(pkg.version)) {",
);

// These are exactly the historical successor guards that Build100 already had to extend.
// We only widen release/build/codename enumerations; functional assertions remain untouched.
const successorFiles = [
  'scripts/test-phase7-c-guided-metadata-build69.mjs',
  'scripts/test-phase9-album-asset-upload-success-verification-build99.mjs',
  'scripts/test-phase9-album-create-success-verification-build96.mjs',
  'scripts/test-phase9-albums-daily-resilient-convergence-build95.mjs',
  'scripts/test-phase9-lyrics-validation-transient-retry-build94.mjs',
  'scripts/test-phase9-tm524-duration-evidence-compat-build98.mjs',
  'scripts/test-phase9-track-create-success-verification-build97.mjs',
  'scripts/test-phase9-track-metadata-validation-transient-retry-build93.mjs',
  'scripts/test-studio-focus-build64-foundation-repair.mjs',
  'scripts/test-studio-focus-build65-lyrics-crash-corrective.mjs',
  'scripts/test-studio-focus-build66-asset-identity-lyrics-continuity.mjs',
  'scripts/test-studio-focus-build67-lyrics-source-anchor.mjs',
];

for (const path of successorFiles) {
  const source = read(path);
  let next = source;
  next = next.replace(/\|22\)/g, '|22|23)');
  next = next.replace(/\|100\)/g, '|100|101)');
  next = next.replace(/'0\.19\.22'(?=\])/g, "'0.19.22', '0.19.23'");
  next = next.replace(/phase9-album-first-track-intake\)\)/g, 'phase9-album-first-track-intake|phase9-track-asset-upload-success-verification-truth))');
  if (next === source) throw new Error(`${path}: no bounded Build101 successor marker was found to extend`);
  write(path, next);
}

// Build100's own guard becomes an ancestry guard for Build101 while keeping Build100's exact identity immutable.
const build100Path = 'scripts/test-phase9-album-first-track-intake-build100.mjs';
const build100Source = read(build100Path);
const build100Identity = `assert.equal(pkg.version, '0.19.22', 'Build100 package version must be v0.19.22.');
assert.ok(release.includes("version: '0.19.22'"), 'Build100 release version mismatch.');
assert.ok(release.includes('build: 100'), 'Build100 release identity is missing.');
assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-first-track-intake'"), 'Build100 codename mismatch.');
assert.ok(release.includes('build99AncestryMarker'), 'Build100 must preserve accepted Build99 ancestry.');
assert.ok(release.includes("version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'"), 'Accepted Build99 identity must remain immutable in Build100 ancestry.');`;
const build100Successor = `assert.ok(['0.19.22', '0.19.23'].includes(pkg.version), 'Build100 guard accepts Build100 and its bounded Build101 successor.');
if (pkg.version === '0.19.22') {
  assert.ok(release.includes("version: '0.19.22'"), 'Build100 release version mismatch.');
  assert.ok(release.includes('build: 100'), 'Build100 release identity is missing.');
  assert.ok(release.includes("codename: 'studio-focus-slice4-phase9-album-first-track-intake'"), 'Build100 codename mismatch.');
}
assert.ok(release.includes('build99AncestryMarker'), 'Build100+ must preserve accepted Build99 ancestry.');
assert.ok(release.includes("version: 0.19.21 · build: 99 · codename: 'studio-focus-slice4-phase9-album-asset-upload-success-verification-truth'"), 'Accepted Build99 identity must remain immutable in Build100+ ancestry.');
if (pkg.version === '0.19.23') {
  assert.ok(release.includes('build100AncestryMarker'), 'Build101 must preserve accepted Build100 ancestry.');
  assert.ok(release.includes("version: 0.19.22 · build: 100 · codename: 'studio-focus-slice4-phase9-album-first-track-intake'"), 'Accepted Build100 identity must remain immutable in Build101 ancestry.');
}`;
const identityCount = build100Source.split(build100Identity).length - 1;
if (identityCount !== 1) throw new Error(`${build100Path}: exact Build100 identity block changed (${identityCount})`);
write(build100Path, build100Source.replace(build100Identity, build100Successor));

console.log('Build101 bounded inherited successor guards aligned without weakening functional assertions');
