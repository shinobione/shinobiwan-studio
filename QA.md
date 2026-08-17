# SHINOBIWAN STUDIO — Canonical QA / Acceptance Matrix

Updated: 2026-08-17 after **Build106 REAL USER PASS**, final acceptance receipts, and **Phase9 program closeout audit**.

This file records accepted runtime truth, automated proof boundaries, real-user evidence and major remaining unproven areas. Historical run-by-run detail belongs in `changelogs/` and `docs/`.

## Current accepted Studio runtime

```text
Version                 v0.19.28
Build                   Build106
Status                  REAL USER PASS
Codename                studio-focus-slice4-phase9-public-catalog-fallback-transient-retry-truth
Runtime PR              #208
Exact tested head       61bca333a7f9898444c8d9e1610e3d6c6585664b
Final runtime CI        #611 · 32058498867 · SUCCESS
Runtime merge           9c8efcf2250d48d0798ff1ea58ebd80d63ea19be
Runtime Pages           #219 · 32058828759 · SUCCESS build + deploy
Candidate docs PR       #209
Candidate docs CI       #612 · 32059364849 · SUCCESS
Candidate docs merge    24125d13962d8394ff0026ebbe38341607726054
Candidate docs Pages    #220 · 32059459541 · SUCCESS build + deploy
Acceptance docs PR      #210
Acceptance docs CI      #613 · 32062146377 · SUCCESS
Acceptance docs merge   a79b5c44d86b45361fe4d649114f7f8b5c29849c
Acceptance docs Pages   #221 · 32062257475 · SUCCESS build + deploy
Final receipts PR       #211
Final receipts CI       #614 · 32062830991 · SUCCESS
Final receipts merge    0b576d0fc521b579d3ae88b2878003591e253ed1
Final receipts Pages    #222 · 32062944646 · SUCCESS build + deploy
Real-user smoke         PASS · private/incognito · PUBLIC READ-ONLY FALLBACK · Ghost Signal detail opened
```

Detailed receipt: [`docs/acceptance/BUILD106-REAL-USER-PASS.md`](docs/acceptance/BUILD106-REAL-USER-PASS.md).

## Build106 automated coverage — GREEN

Official validation `32058498867` passed the repository-native validation/build chain on exact head `61bca333a7f9898444c8d9e1610e3d6c6585664b`, including inherited Phase0–9 / Studio Focus guards and the Build106 public-catalog fallback retry regression.

Build106 public fallback contract:

```text
preferred private Track read
→ accepted private bounded retry policy remains authoritative
→ only after final private failure may public fallback become authoritative for read-only use

first public request succeeds
→ use it
→ no second public request

first public request failed transiently
AND private ultimately failed
→ exactly one public GET retry
→ maximum 2 public attempts

first public request failed deterministically / invalid JSON / invalid semantic payload
→ no retry
```

Bounded public endpoints:

```text
GET /health
GET /tracks
GET /tracks/<trackId>
```

No generic HTTP retry, write retry, Worker change, Track Manager change, SonicTrace backend change, Deep Audio change or R2 mutation was introduced.

## Build106 real-user smoke — PASS

The user performed the requested normal-path smoke in a private/incognito browser context without the private Cloudflare Access session.

Visible evidence showed:

```text
Studio release identity  v0.19.28 · Build 106
Track                     Ghost Signal · PUBLISHED
Fallback banner           PUBLIC READ-ONLY FALLBACK
Fallback explanation      Private production tools are temporarily locked
Read source               LaunchPAD public catalog
Track detail              opened successfully
Lyrics canonical source   lyrics.txt PRESENT · READ ONLY
```

No Public Worker timeout, HTTP 503, network disconnect, Access sabotage or destructive failure was manufactured. Automated guards own transient-classification branches; the human smoke proved the normal degraded product path remains usable.

Result: **PASS**.

## Accepted Phase9 regression baseline — CLOSED PROGRAM

```text
Build82–100  accepted Phase9 reliability/canonical-truth lineage  PASS
Build101     rejected Track-asset false-negative candidate         NOT ACCEPTED
Build102     ETag representation corrective                        PASS
Build103     canonical audio pre-compute transient retry           PASS
Build104     rejected Deep Audio false-UNKNOWN candidate            NOT ACCEPTED
Build105     Deep Audio pre-submit transport corrective             PASS
Build106     public catalog fallback transient GET retry            PASS
```

Phase9 program closeout audit: [`docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md`](docs/PHASE-9-PROGRAM-CLOSEOUT-AUDIT.md).

The post-Build106 read-only audit found no additional bounded Studio-only reliability slice that can be implemented truthfully under current backend contracts. **Phase9 is COMPLETE on accepted Build106. Build107 remains UNALLOCATED / UNUSED.**

## Accepted reliability policies

### Lost-response writes

For accepted Phase9 write families:

```text
response lost / timeout
→ no blind automatic retry
→ private canonical reread
→ committed / not committed / ambiguous / unverified
```

A recovery may be called committed only when the operation-specific canonical postcondition is positively verified.

An explicit retry may be called safe only when canonical state positively proves the write did not commit and the pre-write state/revision remains suitable for retry.

### Canonical read retries

Accepted bounded read families include:

- core private Track reads;
- private Album reads;
- canonical Lyrics reads;
- private SonicTrace analysis/catalog reads;
- canonical audio download before compute;
- Track metadata non-mutating validation;
- Lyrics non-mutating validation;
- public Track-catalog fallback after final private failure.

Retry remains limited to timeout, browser transport interruption, and explicitly accepted transient HTTP classes. Access/session failures, deterministic failures, invalid JSON and invalid semantic payloads do not become retryable merely because another family retries.

### Deep Audio

```text
canonical audio GET
→ one bounded transient retry allowed

POST /api/studio/analyze
→ ZERO automatic retries
```

Build105 distinguishes:

```text
transport/timeout before browser-observed upload start
→ pre-submit unreachable
→ no compute-UNKNOWN fence
→ manual re-scan may be attempted after coordinator recovery

transport/timeout after browser-observed upload start
→ compute state UNKNOWN
→ exact Track + source revision fenced in-page
→ page reload required before deliberate manual resubmit
```

Further causal certainty requires coordinator-side operation identity/status/idempotency.

## Cross-stack accepted baseline

```text
Track Manager           v5.24 · REAL USER VERIFIED
Studio bridge           v1.14
TM admin Worker         53abb651-4f3c-46a7-a37a-055f35d340b9
TM deploy run           31919397012 · SUCCESS · admin only
Public Worker           v2.8 · REAL USER PASS
Public Worker PR        LaunchPAD-APP #241
Public source merge     b99ff00bb2483b46c7b1e02c874ebfc22892156d
Public deploy run       31974132377 · target public
Public Worker Version   49d87191-a13e-41a7-80c8-d1fd9362af77
LaunchPAD public        2026.08.12.102 · REAL USER PASS
SonicTrace              V2-E Build08 · REAL USER PASS
Deep Audio              2.0.3-alpha
LRC Maker               6.3.8
```

### Public parent-Album visibility — PASS

Public Worker v2.8 uses canonical Album `trackIds` ownership and withholds a published Track when its canonical parent Album remains Draft/archived. The gate covers public Track list, direct Track detail and media.

Automated regression proves:

- standalone published Single stays public;
- Track owned by published Album stays public;
- Track owned by Draft/archived Album is withheld;
- ownership conflict fails closed;
- a new catalog generation after Album publication restores visibility.

Production human smoke proved the withholding side with `Pixels & Promises` canonically published but absent from public LaunchPAD while `Anh Yêu Em` remained Draft. The reverse Album-publication transition was not manufactured merely for smoke evidence.

## Historical rejected candidates remain rejected

### Build101

Build101's Track asset upload committed and persisted, but quoted `httpEtag` versus raw canonical `etag` produced a false-negative ETag mismatch. Its no-blind-retry behavior prevented a duplicate write; Build102 corrected only the representation comparison and passed real-user acceptance.

### Build104

Build104 correctly attempted to fence true Deep Audio response loss, but normal-path human testing proved pre-submit/node-offline transport was being classified as compute UNKNOWN. Build105 corrected the browser-observed upload-start boundary and passed real-user acceptance.

Neither candidate is retroactively accepted.

## Remaining unproven areas — backend-contract candidates

These are no longer classified as unfinished Phase9 Studio work:

- Album create lost-response causality / durable operation identity;
- Track create lost-response causality / durable operation identity;
- exact-byte/digest proof for binary upload families;
- catalog rebuild operation identity / generation evidence;
- Deep Audio request status/idempotency if the coordinator gains an operation identity contract;
- degraded/offline behavior only where a future audit proves material daily-workflow impact.

Studio must not fabricate causal certainty when the backend does not expose authoritative evidence.

## Next QA gate

**Phase10 scope audit comes before Build107.**

Build107 remains **UNALLOCATED / UNUSED**. A future Phase10 runtime slice must:

1. start from real GitHub/cross-stack state;
2. prove one bounded progressive-extraction target;
3. preserve standalone app behavior and singular authority;
4. be independently reversible;
5. pass the complete repository-native validation chain on the exact head;
6. deploy on the exact merge SHA;
7. receive real-user acceptance where behavior materially changes.

A docs-only Phase9 closeout does not create a runtime build.