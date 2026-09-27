import type { Finding, Snapshot } from './import';

// Only the current accepted snapshot is an input. Unbound source rows count too.
export function catalogueOverview(snapshot: Snapshot) {
  const groups = new Map<string, { code: string; severity: Finding['severity']; count: number }>();
  for (const finding of snapshot.findings) {
    const key = `${finding.severity}:${finding.code}`;
    const group = groups.get(key) ?? { code: finding.code, severity: finding.severity, count: 0 };
    group.count++;
    groups.set(key, group);
  }
  return {
    recordings: snapshot.recordings.length,
    releases: snapshot.releases.length,
    sourceAppearances: snapshot.appearances.length + snapshot.summary.unboundAppearances,
    boundAppearances: snapshot.appearances.length,
    unboundAppearances: snapshot.summary.unboundAppearances,
    knownIsrc: snapshot.recordings.filter(recording => recording.isrc !== null).length,
    missingIsrc: snapshot.recordings.filter(recording => recording.isrc === null).length,
    pending: snapshot.findings.length,
    groups: [...groups.values()].sort((a, b) => a.severity.localeCompare(b.severity) || a.code.localeCompare(b.code)),
  };
}
