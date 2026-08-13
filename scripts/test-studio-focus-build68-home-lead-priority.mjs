import assert from 'node:assert/strict';
import fs from 'node:fs';

const home = fs.readFileSync('src/components/FocusHome.tsx', 'utf8');
const release = fs.readFileSync('src/release.ts', 'utf8');

assert.match(release, /build:\s*68/);
assert.ok(home.includes('function selectHomeLead('));
assert.ok(home.includes('item.track.id === lastTrackId && !item.ready'));
assert.ok(home.includes('workflow.find(item => !item.ready) || null'));
assert.ok(home.includes('PRODUCTION QUEUE CLEAR'));
assert.ok(home.includes('Nothing needs attention'));
assert.ok(!home.includes('const lead = lastItem || attention[0] || workflow[0] || null;'));

console.log('Build 68 Home lead check passed.');
