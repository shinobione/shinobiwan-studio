import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const profile = read('src/sonictrace-profile.ts');
const panel = read('src/components/SonicTracePanel.tsx');
const api = read('src/services/sonictrace-api.ts');
const release = read('src/release.ts');

for (const marker of [
  "'full' | 'partial' | 'unavailable' | 'outdated'",
  'sonicTraceMasteringReady',
  'sonicTraceEmbeddingReady',
  "provenance?.deepAudio === 'unavailable'",
  "if (state === 'unavailable') return 'UNAVAILABLE'",
  "if (value == null || value === '') return false",
]) assert.ok(profile.includes(marker), `C3 profile semantics missing ${marker}.`);

for (const marker of [
  "if (value == null || value === '') return null",
  'SonicTrace coordinator responded and completed the scan with PARTIAL layers',
  'SonicTrace coordinator is unreachable',
  'SonicTrace coordinator responded but Deep Audio processing failed',
  "profileState === 'unavailable'",
  'Deep Audio was unavailable for this saved scan',
  'sonicTraceMasteringReady(draft)',
]) assert.ok(panel.includes(marker), `C3 Studio UX semantics missing ${marker}.`);

assert.ok(!panel.includes('SonicTrace Deep Audio is offline. Browser DSP completed'), 'C3 must not call every Deep Audio processing failure offline.');
assert.ok(api.includes("provenance: { dsp: 'measured-in-browser', deepAudio: 'unavailable' }"), 'Browser-only fallback must keep explicit Deep Audio unavailable provenance.');
assert.ok(api.includes("xhr.onerror = () => reject(new SonicTraceError('SonicTrace Deep Audio node is offline or blocked by the browser."), 'Transport failures must remain distinguishable from HTTP processing failures.');

const version = release.match(/version:\s*'([^']+)'/)?.[1] || '';
const build = Number(release.match(/build:\s*(\d+)/)?.[1] || 0);
const codename = release.match(/codename:\s*'([^']+)'/)?.[1] || '';
const c3Line = /^0\.(?:13|14|15)\.\d+$/.test(version) && codename.startsWith('phase-ux-c3-');
const authorizedPhase7Successor = /^0\.(?:16|17)\.\d+$/.test(version) && codename.startsWith('phase7-');
const authorizedStudioFocusSuccessor = /^0\.17\.\d+$/.test(version) && codename.startsWith('studio-focus-');
assert.ok(c3Line || authorizedPhase7Successor || authorizedStudioFocusSuccessor, `C3 Deep Audio behavior must remain inherited by the accepted C3 line or its explicitly authorized Phase 7 / Studio Focus successor, got ${version} / ${codename}.`);
assert.ok(build >= 38, `C3 Studio build must be >= 38, got ${build}.`);

console.log('C3 Deep Audio FULL/PARTIAL/UNAVAILABLE semantics and transport-vs-processing guards passed through the authorized Studio Focus successor.');
