# Jolastokia: authenticated vocabulary increment

Base: `feature/hitzbira-2.10-learning`, `3cf79911404cfd8f30b56328e4673cb9cc630212`.
Method consulted: [HitzBira method v1.1](https://docs.google.com/document/d/1g42sF5p3QWGcYf177giFVxRuY12qsp8RtY9Ji14E7vA/edit).
Original protocols 00/01/04/08 were unavailable; the owner confirmed there are no originals available in this session. This increment does not claim their full review or academic acceptance.

## Initial inspection, before owner confirmation, 2026-11-27

Only bounded SELECTs against Lexikoa content and metadata; no learner records queried, no database mutations, DDL, grants, policy or deployment changes.

| Resource | Observed status | Use in this increment |
|---|---|---|
| `content.lexical_senses` | 12 in review; `content.sources` empty | Excluded |
| `editorial_topic_lexicon` | 2 published, not reviewed, needs review | Excluded |
| `editorial_lexical_entries` | 52 total: B2 5, C1 42, C2 5; 36 C1 published with current approved hash; all 52 have nonempty terms/nuances | Eligible for further rights and matching review only |
| `editorial_lexical_groups` | Approved current groups coexist with drafts and unreviewed published groups | Require current approved group too |
| `sd_dictionary_entries` / senses | 14 entries pending/draft, 17 senses draft; rights review required | Excluded |
| `sd_dictionary_provenance` | 17 legacy references, rights not assessed | Excluded |

At that initial inspection there were zero rows with the new application-specific approval metadata. Published status and existing linguistic approval do not by themselves establish rights. This is a scoped inspection, not a census or audit of the entire Lexikoa database. The subsequent owner-confirmed release below supersedes that activation limit for its exact listed versions.

## Owner-confirmed preview release

The owner subsequently confirmed: “Todo está revisado y preparado para el juego; implementemos todo”. Release `HB-VOCAB-C1-20261127-01` records that confirmation as owner authorization to use the current wording in Jolastokia. It is not presented as an independent rights or academic audit.

32 C1 entries across nine themes satisfy BOTH entry and group review/hash gates. The initial 36 approved entries include four whose group gate is not current; these four remain excluded. The release stores only IDs, versions and entry/group fingerprints, not terms or definitions. All displayed wording is fetched from Lexikoa on each preparation request. No editorial records, hashes, statuses or permissions are updated. Changes to either approved entry or group require a new release; explicit metadata revocation blocks release approval too.

`hitzbira-learning-preview` uses the shared account gateway implementation and accepts only `https://hitzbira-git-feature-hitzbira-171a80-antoniourutz-devs-projects.vercel.app`. The client selects it only at that exact hostname. Production and other origins continue to use the existing account endpoint; the deployed production function is not replaced. Authentication, registered-account checks and the existing learning journal are retained. JWT platform verification follows the existing gateway configuration (`false`); every data action validates the bearer token with Supabase Auth and performs current server-managed account authorization inside the handler.

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

The server returns only ID, term, meaning, level, theme, version, reviewed content hash, approved source reference and rights basis. Raw metadata, reviewers, internal notes and credentials are omitted. The production origin allowlist remains unchanged. The preview entrypoint has its own exact origin and bounded release approval.

## Player and shared motor

`vocabulary.js` exposes a shared repository/selector. Jolastokia uses the existing Bidea player. It selects up to four rounds of three distinct term/meaning pairs, excludes duplicate terms/meanings, keeps exact level/theme, and prioritizes rows not used in the previous game for the same account/filter during the current page session. Repetition is possible with a small pool. No new content is generated or translated.

The player shows loading/cancel, the active source, and an explicit local-adventure fallback for guest mode, unavailable/insufficient approved content, timeout or backend failure. Fallback never claims to match the selected bank level/theme. Account changes, cancellation and newer sessions discard late responses; no persistent lexical cache is added. Existing offline adventure content and icons remain available.

Each dynamic pair attempt uses the existing activity journal with resource ID/version/hash, level/theme, selected ID, result and assistance. Recognition stays `academicState: not_observed`: no mastery, grammatical diagnosis, XP, episode completion or spaced-retrieval credit. Initial wrong attempts remain separate from subsequent assisted recognition. Telemetry is client-reported practice, not authoritative assessment. This increment does not implement corpus-wide learner adaptation or universal error understanding.

Telemetry v2 (2.10.3) numbers attempts separately per word within each round. A previous mismatch on one word does not mark another word's first recognition as assisted. Existing v1 observations remain unchanged and conservative; they never counted toward mastery. Rounds that mix topics show `Gaiak nahastuta` instead of naming only the first word's topic.

## Verification and activation limits

`node tests/run.cjs` is the same command as CI. The new vocabulary suite covers selection, duplicates, insufficient content, account isolation, cancellation, network fallback, fixed projections, stale approval hashes, rights/matching gates, authentication, query injection, unchanged origin restrictions, actual player integration and trace events. Fixtures are synthetic; tests do not prove real content approval or live connectivity.

Actual dynamic verification requires a signed-in pilot account at the exact branch preview origin. No wildcard CORS, privilege changes, production gateway replacement, credential retrieval or production publication is part of this increment. Do not label this integration live until authenticated end-to-end reads and trace persistence are observed. Other difficulty levels retain an explicit fallback until their own reviewed content is available; C1 approval never changes an A1/B1 learner's difficulty implicitly.

## Authenticated smoke evidence, 2026-11-27

After the owner manually signed in at the authorized preview origin, C1 preparation displayed real terms from Lexikoa, including `ikuspegia`, `erronka` and `hobekuntzak bideratu`. The source panel showed their canonical IDs and version 1. A deliberate mismatch followed by correction and two other matches completed a round; a second round and a new game displayed different terms. The nine real topic options appeared after the first preparation.

The UI reported `Supabasen gordeta`. A bounded SELECT against only the signed-in test account's recent vocabulary events independently confirmed the mismatch and three matches, with source IDs and `academicState: not_observed`. No credentials, account identifier or private learner content are recorded here. These checks demonstrate live reads and trace persistence for this preview C1 scope; they do not establish other levels, simultaneous-device behavior, adaptive recommendations or language mastery.

The corrected 2.10.3 client was reloaded without another sign-in and tested live. Mixed rounds showed the correct mixed-topic label. A theme-specific game loaded only the selected topic and completed through the final screen. A second bounded read verified six v2 observations: four first-attempt matches without assistance, one assisted second-attempt match and its preceding first-attempt mismatch; all remain `not_observed` academically. Version 2.10.4 also preserves the available-topic menu after a filtered game, with a regression test. No production deployment or database permission/schema changes were made.
