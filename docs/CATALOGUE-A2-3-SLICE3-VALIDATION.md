# Build122 / v0.19.44 — Catalogue A2.3 Slice 3 handoff

Date: 2026-09-27. **Candidate only; no merge, deployment or REAL USER PASS.**

Delivery: [Draft PR #248](https://github.com/shinobione/shinobiwan-studio/pull/248). Its receipt records final exact-head CI after this documentation commit; an earlier head is not a substitute.

## Baseline and scope

Fetched `origin/main` exactly matched the owner baseline `1add68bc6f9c476374eafaefd58f865263f6e9ad` (docs #247); [Pages 36335916511](https://github.com/shinobione/shinobiwan-studio/actions/runs/36335916511) SUCCESS on that SHA. Runtime Build121 / v0.19.43 remains production, with its separate [bounded owner receipt](acceptance/BUILD121-REAL-USER-PASS.md). Initial checkout `757a46d0d83804ae5cd2b7a7c03c483125c0c67e` was clean; old branches and the CPU worktree were preserved. Dedicated branch: `codex/catalogue-a23-slice3-build122-20260927`, from verified main.

Authority: [Build122 owner kickoff in #235](https://github.com/shinobione/shinobiwan-studio/issues/235#issuecomment-5858138120), read with AGENTS, canonical documents, the blueprint and Builds119–121 receipts. This is frontend runtime work only. No new dependency, input schema, parser normalization, local parser Worker, generation fence, backend, R2 or cross-repository change.

## Implementation and evidence rules

- Native Recording list/cards, title/normalized-ISRC search, known/missing-or-invalid ISRC, actual bound-appearance count and exact-finding presence filters. Deterministic source-identity/title ordering with exact identity tie-breaks; no deduplication by title/ISRC. Missing and invalid ISRC display as unknown, with original input retained in evidence.
- A snapshot-derived index maps exact branded Recording/Release/Appearance IDs and normalized evidence IDs. Bound appearances are ordered by exact release identity, documented position, then appearance identity. Counts distinguish appearances from distinct Releases. Unbound appearances never enter Recording counts/details, even when title/ISRC match; Build121 Release and Overview counts still include them once.
- One modal host serves Recording, Release and appearance navigation in component state. Exact locally evidenced links open inside the same dialog; an in-memory Back action returns through that visit. Explicit Tab wrapping, Escape/Close, original opener restoration and focus on the evidence region after cross-view navigation. Section/history navigation discards the modal rather than putting private identity in a route.
- Existing Release detail retains its full linked evidence presentation. Recording detail discloses documented title/ISRC, exact bound appearances, historical reference dates, escaped original evidence and pending findings. Proposed Studio links remain unreviewed evidence; no Track binding action or public status inference.
- One controlled QA filter contains optional finding code and entity context. Overview sets code and clears context; contextual actions clear code. Show all restores the complete, unchanged paginated finding array. Build120 code selection survives normal tab visits; entity context clears when leaving QA. Source replacement/reset/rejection clears all filter/selection state.

### Exact contextual membership

| Context | Findings included | Deliberately excluded |
| --- | --- | --- |
| Recording | Its normalized evidence IDs and evidence of explicitly bound appearances | Other Recordings with matching title/ISRC; unbound rows; Release-level observations |
| Release | Its normalized evidence IDs and all its exact bound/unbound appearance evidence | Findings from Recording rows merely reachable through the Release detail |
| Appearance | Its own normalized evidence IDs | Findings borrowed from adjacent positions or related entities |
| Global QA | Every original finding, including source coverage and source-note-only cases | Nothing |

QA action targets are drawn from these proven memberships. A bound appearance finding may open its exact Recording and Release; an unbound appearance finding may open its Release/appearance evidence only. Amuse candidates, recent SoundCloud records, source QA notes and coverage warnings remain global. No raw-note parsing, sourceLocator substring, sorted-array offset, title or ISRC inference supplies links. Release detail's inherited broader linked-Recording finding disclosure is distinct from the narrower Release-row QA context.

## Validation

Build122's independently fictional fixtures include duplicate title/ISRC, invalid and absent ISRC, shuffled row order, zero/one/multiple appearances, multiple Releases, unbound lookalikes, source proposals and enough global findings to exercise pagination. Pure selector and rendered fallback checks prove exact provenance, deterministic filters, missing IDs/evidence, and global finding retention.

Eight actual App/StrictMode Chromium scenarios cover search/filter/sort; multi-Release/appearance navigation; global/contextual QA and Overview compatibility; keyboard/focus; 320/390/768/1280/2560px and reduced motion; reset/replacement/rejection/history/pagehide/refresh/unmount; private URLs/network/storage/console; deliberately late Worker success/error after supersession/reset/rejection/pagehide. Inherited Build120 races also cover pending tab navigation, unmount and refresh.

Local full `npm run build` PASS: inherited Build118/CPU, all 55 Build119 cases, 12 Build120 Chromium scenarios, nine Build121 Chromium scenarios, eight Build122 Chromium scenarios, release pairing, TypeScript, production build and **137-file** source/build/artifact privacy scan. `git diff --check` PASS. Exact final-head CI remains the PR delivery gate. Existing development-only Playwright/Chromium reused. Windows local Vite/Chromium runner requires the established narrowly approved sandbox exception. Screenshots/logs remain ignored under `node_modules/.cache/build122/`; no private source was read, uploaded or committed. Agent-inspected synthetic desktop/mobile screenshots are not owner acceptance. The inherited Vite large-chunk warning remains.

## Owner acceptance after separate merge/deployment authorization

1. Review the Draft diff and **final exact-head CI**, then separately authorize merge and Pages. Verify deployed SHA before the owner smoke; this handoff is not that authorization.
2. Select the private source locally. Compare Recording/known/missing ISRC counts and overall appearances/findings to that source. Prior owner observations (168, 120/48, 109, 355) are comparison history only, never runtime constants or fixtures.
3. Search by documented title/ISRC, combine all filters, clear them and compare deterministic sorts. Distinct equal-title/equal-ISRC identities must remain separate; zero appearances and missing ISRC must be explicit.
4. Compare a Recording on multiple Releases against original appearance IDs, Release membership, positions, display title and evidence. Follow View Release, View Recording and Back. Inspect an unbound lookalike through Release/appearance detail; it must have no Recording action.
5. Compare Recording, Release and appearance QA contexts to the membership table above; Show all and paginate the full global set. Inspect Amuse/recent SoundCloud/source QA rows without invented entity links. Overview code filtering must still work; all findings remain pending.
6. Keyboard-open details, Tab/Shift+Tab at both boundaries, follow exact links, Back, Escape and Close. Check original opener focus, QA heading focus, 320/390px/mobile/tablet/desktop/ultrawide and reduced motion in the owner's target browser/assistive technology.
7. Navigate tabs/history, replace with accepted/rejected source, Reset/unload, leave Catalogue and refresh. No old detail/context or snapshot may reappear; inspect inherited Releases and creative Tracks/Albums separately.
8. DevTools: no source/title/ISRC/search/selection in URL, outbound requests, logs or browser storage; no artwork fetching. Verify historical dates/current publication unknown, proposed links unreviewed and incomplete workbook evidence caveat.

No persistence/sync, automatic identity reconciliation, artwork, playback, DSP verification/publication, commercial writes, Worker/R2/backend/LaunchPAD/Blackhole work. Owner private-source correctness, production browser/visual/accessibility/privacy acceptance and sustained CPU measurements remain independent. If separately deployed and rejected, revert this bounded PR; do not compensate with source or production-data mutations.
