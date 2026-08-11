import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('src/c3-c-premium-feel.css', 'utf8');
const main = fs.readFileSync('src/main.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');

assert.match(main, /import '\.\/c3-c-premium-feel\.css';/);
assert.match(release, /version: '0\.15\.0'/);
assert.match(release, /build: 44/);
assert.match(release, /phase-ux-c3-c-premium-feel/);

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

console.log('C3-C premium feel passed motion-token, press, glow, focus, map-safety and reduced-motion guards.');