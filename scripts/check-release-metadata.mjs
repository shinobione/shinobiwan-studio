import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const releaseSource = fs.readFileSync(new URL('../src/release.ts', import.meta.url), 'utf8');
const appSource = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

function requireMatch(label, regex) {
  const match = releaseSource.match(regex);
  if (!match) throw new Error(`Release metadata guard: missing ${label} in src/release.ts`);
  return match[1];
}

const releaseVersion = requireMatch('version', /version:\s*'([^']+)'/);
const releaseBuild = Number(requireMatch('build', /build:\s*(\d+)/));
const releasePhase = Number(requireMatch('phase', /phase:\s*(\d+)/));

if (packageJson.version !== releaseVersion) {
  throw new Error(`Release metadata guard: package.json version ${packageJson.version} != src/release.ts ${releaseVersion}`);
}

const buildScripts = Object.keys(packageJson.scripts || {})
  .map(name => /^check:build(\d+)$/.exec(name))
  .filter(Boolean)
  .map(match => Number(match[1]));

if (!buildScripts.length) throw new Error('Release metadata guard: no check:buildNNN script found');
const latestBuildGate = Math.max(...buildScripts);
if (releaseBuild !== latestBuildGate) {
  throw new Error(`Release metadata guard: Studio says Build${releaseBuild}, but latest build gate is Build${latestBuildGate}`);
}

// Current 0.19 release-line policy: Build82 == v0.19.4, therefore patch == build - 78.
// If Studio deliberately moves to another release line, update this policy in the same release PR.
const expectedVersion = `0.19.${releaseBuild - 78}`;
if (releaseVersion !== expectedVersion) {
  throw new Error(`Release metadata guard: Build${releaseBuild} must map to ${expectedVersion} on the current 0.19 release line, got ${releaseVersion}`);
}

if (releaseBuild >= 107 && releasePhase !== 10) {
  throw new Error(`Release metadata guard: Build${releaseBuild} belongs to the active Phase10 program, got phase ${releasePhase}`);
}

if (!appSource.includes('PHASE {studioRelease.phase}')) {
  throw new Error('Release metadata guard: sidebar phase must be rendered from studioRelease.phase');
}
if (!appSource.includes('{studioRelease.summary}')) {
  throw new Error('Release metadata guard: sidebar summary must be rendered from studioRelease.summary');
}

console.log(`Release metadata PASS: v${releaseVersion} · Build${releaseBuild} · Phase${releasePhase} · latest gate aligned.`);
