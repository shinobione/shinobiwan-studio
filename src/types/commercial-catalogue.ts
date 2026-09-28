// Independent commercial snapshot model. No canonical Track or Album inheritance.
// Brands prevent accidental interchange of commercial identities or Studio slugs.
declare const commercialIdentity: unique symbol;
type CommercialId<Kind extends string> = string & { readonly [commercialIdentity]: Kind };
export type RecordingId = CommercialId<'recording'>;
export type CommercialReleaseId = CommercialId<'release'>;
export type EvidenceId = CommercialId<'evidence'>;

export interface Evidence {
  readonly evidenceId: EvidenceId;
  readonly source: string;
  readonly sourceLocator: string | null;
  readonly observedAt: string | null;
  readonly note: string | null;
  readonly classification?: 'source-observation' | 'derived' | 'human-confirmed' | 'missing' | 'contradictory';
  // An independent distributor evidence row supplements, never creates, an Appearance.
  readonly detailKind?: 'distributor-detail';
}

export interface Recording {
  readonly recordingId: RecordingId;
  readonly title: string;
  readonly version: string | null;
  readonly isrc: string | null; // Optional metadata, never identity.
  readonly evidenceIds: readonly EvidenceId[];
  // Only a privately proven, human-reviewed binding may populate this link.
  readonly studioTrackLink: {
    readonly studioTrackId: string;
    readonly evidenceId: EvidenceId;
    readonly reviewedAt: string;
  } | null;
}

export interface CommercialRelease {
  readonly releaseId: CommercialReleaseId;
  readonly title: string;
  readonly kind: 'single' | 'ep' | 'album' | 'unknown';
  readonly upc: string | null;
  readonly distributor: string | null;
  readonly source: string;
  readonly historicalDistributionStatus: string | null;
  readonly referenceDate: string | null;
  readonly evidenceIds: readonly EvidenceId[];
}

export interface ReleaseAppearance {
  readonly appearanceId: CommercialId<'appearance'>;
  readonly recordingId: RecordingId;
  readonly releaseId: CommercialReleaseId;
  readonly position: number | null;
  readonly displayTitle: string | null;
  readonly status: 'certified' | 'unverified';
  readonly evidenceIds: readonly EvidenceId[];
}

// Preserve a validated source position without inventing a Recording association.
export interface UnboundReleaseAppearance extends Omit<ReleaseAppearance, 'recordingId'> {
  readonly recordingId: null;
  readonly observedIsrc: string | null;
}

export interface ChannelPublication {
  readonly publicationId: CommercialId<'publication'>;
  readonly releaseId: CommercialReleaseId;
  readonly channel: string;
  readonly status: 'intent' | 'submitted' | 'delivered' | 'verified-live' | 'removed' | 'unknown';
  readonly plannedAt: string | null;
  readonly submittedAt: string | null;
  readonly deliveredAt: string | null;
  readonly verifiedLiveAt: string | null;
  readonly removedAt: string | null;
  readonly evidenceIds: readonly EvidenceId[];
}

export interface ReconciliationCase {
  readonly caseId: CommercialId<'reconciliation'>;
  readonly subject: { readonly recordingId: RecordingId } | { readonly releaseId: CommercialReleaseId };
  readonly status: 'pending-review' | 'resolved' | 'rejected';
  readonly observation: string;
  readonly proposedAction: string | null;
  readonly evidenceIds: readonly EvidenceId[];
}
