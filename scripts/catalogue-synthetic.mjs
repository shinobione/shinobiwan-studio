// Entirely fictional fixtures, authored independently of private commercial rows.
export function fixture() {
  return {
    schemaVersion: 'catalogue-readonly-seed-v1', artist: 'Synthetic artist', snapshotDate: '2026-01-01', sourceFile: 'synthetic.xlsx', sourceSha256: 'a'.repeat(64), warnings: ['Synthetic evidence only'],
    recordings: [{ id: 'rec-1', title: 'Synthetic recording', isrc: 'ZZAAA2600001', isrcEvidence: 'Synthetic evidence', matchMethod: 'explicit source ID', legacyTrackId: null, studioTrackId: null,
      knownProjects: null, amuseDetails: null, soundcloudDistribution: null, soundcloudUpc: null, soundcloudStudioObserved: 'Oui', spotifyStatus: 'Unknown', spotifyTrackUrl: null, spotifyReleaseUrl: null, soundcloudUrl: null, referenceDate: null, duration: null, soundcloudStatus: 'Unknown', publicationNotes: null, reviewNeeded: null, sourceEvidence: 'Synthetic sheet',
      flags: { legacy: false, hasISRC: true, amuse: true, soundcloudDistribution: false, soundcloudStudio: false }, provenance: { sheet: 'Pistes consolidées', sourceId: 'rec-1' } }],
    releases: [{ id: 'amuse:release-1', title: 'Synthetic release', source: 'Amuse', sourceId: 'release-1', upc: null, releaseType: 'Single', referenceDate: null, distributionStatus: 'Submitted', coverUrl: null, observedTrackCount: 1, detailedCount: 1, unverifiedCount: 0, verification: 'Unverified', sourceEvidence: 'Synthetic sheet' }],
    appearances: [{ id: 'app-1', releaseId: 'amuse:release-1', recordingId: 'rec-1', position: 1, displayTitle: 'Synthetic recording', isrcObserved: 'ZZAAA2600001', matchStatus: 'explicit source ID', timecode: null, sourceEvidence: 'Synthetic sheet' }],
    unverifiedAmuseCandidates: [{ 'Sortie Amuse': 'Synthetic release', 'Release ID': 'release-1', 'Position exacte': 'Unknown', 'Titre candidat / non vu': 'Synthetic candidate', 'ISRC du master (si connu)': null, 'Source de ce code': null, 'ID consolidé': 'rec-1', 'Confiance dans l’attribution à cette sortie': 'Unverified', 'Prochaine vérification': 'Human review' }],
    soundcloudRecent: [{ 'Titre affiché': 'Synthetic recording', 'Date Studio': '2026-01-01', 'Durée Studio': '1:00', 'ID consolidé': 'rec-1', 'ISRC rapproché': null, 'Source ISRC': null, 'État de publication': 'Unknown', 'Lien SC historique': null, 'Lien Spotify documenté': null, 'Limite': 'Historical' }],
    qa: [{ 'Priorité': 'Review', 'Catégorie': 'Identity', 'Objet': 'Synthetic', 'Constat vérifié': 'Unknown', 'Traitement proposé': 'Review', 'Preuve / trace': 'Synthetic sheet', 'Statut': 'Pending' }],
    sourceSheets: { 'Pistes consolidées': 1, 'Apparitions distrib.': 1, 'Couverture Amuse': 1, 'Positions à vérifier': 1, 'SoundCloud récent': 1, 'Sorties historiques': 0, 'Contrôles QA': 1, '2 fiches Amuse vérifiées': 0 },
  };
}
export function recount(d) {
  for (const [sheet, table] of [['Pistes consolidées','recordings'],['Apparitions distrib.','appearances'],['Positions à vérifier','unverifiedAmuseCandidates'],['SoundCloud récent','soundcloudRecent'],['Contrôles QA','qa']]) d.sourceSheets[sheet] = d[table].length;
  d.sourceSheets['Couverture Amuse'] = d.releases.filter(r => r.source === 'Amuse').length;
  d.sourceSheets['Sorties historiques'] = d.releases.filter(r => r.source === 'Master août 2026').length;
  return d;
}
