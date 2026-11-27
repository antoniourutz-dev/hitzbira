# Jolastokia: authenticated vocabulary increment

Base: `feature/hitzbira-2.10-learning`, `3cf79911404cfd8f30b56328e4673cb9cc630212`.
Method consulted: [HitzBira method v1.1](https://docs.google.com/document/d/1g42sF5p3QWGcYf177giFVxRuY12qsp8RtY9Ji14E7vA/edit).
Original protocols 00/01/04/08 were unavailable; the owner confirmed there are no originals available in this session. This increment does not claim their full review or academic acceptance.

## Observed quality, 2026-11-27

Only bounded SELECTs against Lexikoa content and metadata; no learner records queried, no database mutations, DDL, grants, policy or deployment changes.

| Resource | Observed status | Use in this increment |
|---|---|---|
| `content.lexical_senses` | 12 in review; `content.sources` empty | Excluded |
| `editorial_topic_lexicon` | 2 published, not reviewed, needs review | Excluded |
| `editorial_lexical_entries` | 52 total: B2 5, C1 42, C2 5; 36 C1 published with current approved hash; all 52 have nonempty terms/nuances | Eligible for further rights and matching review only |
| `editorial_lexical_groups` | Approved current groups coexist with drafts and unreviewed published groups | Require current approved group too |
| `sd_dictionary_entries` / senses | 14 entries pending/draft, 17 senses draft; rights review required | Excluded |
| `sd_dictionary_provenance` | 17 legacy references, rights not assessed | Excluded |

No inspected resource has verified rights AND current suitability approval for this matching flow. **There are zero live-eligible rows today.** Published status and existing linguistic approval do not establish those rights. This is a scoped inspection, not a census or audit of the entire Lexikoa database.

## Implemented contract

`HBData.vocabulary({level,theme})` calls the existing authenticated account gateway with action `vocabulary`. Server-side account authorization is unchanged. No client-specified table names, select clauses, offsets, URLs or SQL. Allowed levels: A1/A2/B1/B2/C1/C2; theme: `all` or a bounded slug. At most 100 groups and 200 entries; selection is a bounded window, not a promise of corpus-wide random sampling.

The fixed source is the existing editorial lexical repository. Both group and entry must be published, approved, not needing review, with equal nonempty current/reviewed hashes. The entry must additionally carry explicitly recorded authorization in existing `knowledge_metadata.hitzbira_vocab`:

```json
{
  "rights_status": "approved",
  "rights_basis": "Documented permission/license basis for the delivered wording",
  "source_ref": "Approved public-safe source reference",
  "matching_review": "approved",
  "reviewed_fingerprint": "Exact current_content_hash approved for matching"
}
```

These fields are a new application gate, not a claim that the database already contains them. No metadata was created, approved or changed. An authorized editorial process must first establish rights and suitability for the exact current wording. `matching_review` means the nuance can serve as a distinct definition in this activity; a generic lexical usage note is insufficient. Do not mechanically set flags on existing content. Public-safe source references only; no private document URLs, names or editorial notes.

The server returns only ID, term, meaning, level, theme, version, reviewed content hash, approved source reference and rights basis. Raw metadata, reviewers, internal notes and credentials are omitted. The CORS allowlist is unchanged. The gateway change is committed as source only; **the shared Supabase function is not deployed**.

## Player and shared motor

`vocabulary.js` exposes a shared repository/selector. Jolastokia uses the existing Bidea player. It selects up to four rounds of three distinct term/meaning pairs, excludes duplicate terms/meanings, keeps exact level/theme, and prioritizes rows not used in the previous game for the same account/filter during the current page session. Repetition is possible with a small pool. No new content is generated or translated.

The player shows loading/cancel, the active source, and an explicit local-adventure fallback for guest mode, unavailable/insufficient approved content, timeout or backend failure. Fallback never claims to match the selected bank level/theme. Account changes, cancellation and newer sessions discard late responses; no persistent lexical cache is added. Existing offline adventure content and icons remain available.

Each dynamic pair attempt uses the existing activity journal with resource ID/version/hash, level/theme, selected ID, result and assistance. Recognition stays `academicState: not_observed`: no mastery, grammatical diagnosis, XP, episode completion or spaced-retrieval credit. Initial wrong attempts remain separate from subsequent assisted recognition. Telemetry is client-reported practice, not authoritative assessment. This increment does not implement corpus-wide learner adaptation or universal error understanding.

## Verification and activation limits

`node tests/run.cjs` is the same command as CI. The new vocabulary suite covers selection, duplicates, insufficient content, account isolation, cancellation, network fallback, fixed projections, stale approval hashes, rights/matching gates, authentication, query injection, unchanged origin restrictions, actual player integration and trace events. Fixtures are synthetic; tests do not prove real content approval or live connectivity.

Preview can verify the UI and explicit fallback. Actual dynamic content requires approved suitable rows AND the gateway action in an authorized backend deployment AND an explicitly approved preview origin/session. No wildcard CORS, privilege changes, shared backend deployment, credential retrieval or production publication is part of this increment. Do not label this integration live until authenticated end-to-end reads and trace persistence are observed.
