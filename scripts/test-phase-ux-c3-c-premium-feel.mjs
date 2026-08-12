import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('src/c3-c-premium-feel.css', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');

assert.match(main, /import '\.\/c3-c-premium-feel\.css';/);
const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const c3Candidate = /^0\.15\.\d+$/.test(version) && codename.startsWith('phase-ux-c3-');
const phase7Successor = /^0\.(?:16|17)\.\d+$/.test(version) && codename.startsWith('phase7-');
const studioFocusSuccessor = /^0\.(?:17|18)\.\d+$/.test(version) && codename.startsWith('studio-focus-');
assert.ok(c3Candidate || phase7Successor || studioFocusSuccessor, `C3-C premium interaction layer must remain inherited by the C3 candidate or authorized Phase 7 / Studio Focus successor, got ${version} / ${codename}.`);
assert.ok(build >= 44, `C3-C inherited build must remain >= 44, got ${build}.`);

for (const token of [
  '--studio-motion-instant',
  '--studio-motion-fast',
  '--studio-motion-base',
  '--studio-ease-out',
  '--studio-press-scale',
]) assert.ok(css.includes(token), `Missing motion token ${token}`);

assert.match(css, /:active[\s\S]*scale:/, 'Premium feel must include tactile press response.');
assert.match(css, /\.primary-btn:hover:not\(:disabled\)[\s\S]*box-shadow:/, 'Primary actions need restrained hover glow.');
assert.match(css, /input, select, textarea[\s\S]*focus/, 'Form controls need local focus response.');
assert.match(css, /\.c3b-map-point[\s\S]*transition:/, 'C3-B map interactions must retain specialized safe motion.');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/, 'Reduced motion must be explicitly supported.');
assert.match(css, /animation: none !important/, 'Reduced motion must suppress entry animations.');
assert.doesNotMatch(css, /animation-iteration-count:\s*infinite/i, 'C3-C must not add perpetual attention-seeking motion.');
assert.doesNotMatch(css, /transition-delay:/i, 'C3-C must not delay real interactions.');

console.log('C3-C premium feel passed inherited motion-token, press, glow, focus, map-safety and reduced-motion guards through the authorized Studio Focus successor.');
