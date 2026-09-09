# Open Human Roadmap

This roadmap describes product sequence, not promised delivery dates. It was
last updated on 2026-09-09.

Open Human should make the same careful knowledge accessible across languages
and formats. Text remains the reviewable source of truth. Translation and audio
are published editions of that source, not separate knowledge products.

## Product principles for language and audio

- English remains the initial source edition; Bahasa Indonesia is the first
  additional language and uses the BCP 47 locale code `id`.
- Every language gets a stable, explicit URL. English and Indonesian content
  must never be mixed silently on one localized page.
- Machine assistance may accelerate translation or narration, but its use must
  be disclosed and the result independently checked against the source. Native
  human review is required before an edition leaves editorial beta.
- Audio is optional, never autoplayed, and always accompanied by an equivalent
  text version.
- Evidence level, uncertainty, safety framing, citations, and review history
  must survive translation and narration.
- Language preference and playback state should be stored locally by default
  (using a strictly functional preference cookie where server routing needs it);
  neither feature requires an account or behavioral tracking.

## Milestones

| Milestone | Outcome | Status |
| --- | --- | --- |
| v0.1 — Foundation | Editorial site, 15 concepts, evidence model, local search | Shipped |
| v0.2 — Bilingual foundation | Locale-aware routes, interface dictionaries, localized search | Shipped |
| v0.3 — Expanded bilingual Human 101 | 45 concepts, nine per field, available in `en` and `id`; native-language review remains open | Editorial beta |
| v0.4 — Audio pilot | A later bilingual listening pilot after the text library grows | Deferred |
| v0.5 — Complete foundation audio | Broad bilingual audio coverage | Deferred |
| v1.0 — Community publishing | Governed translation, narration, and review contributions | Future |

## v0.2 — Bilingual foundation

### Routing and interface

- Move public pages beneath locale-prefixed routes: `/en/...` and `/id/...`.
- Preserve every current unprefixed URL with a permanent redirect to its English
  equivalent.
- Let `/` select a language on first visit using an explicit preference first,
  then the browser's `Accept-Language`, and finally English. Never override a
  user's explicit locale URL or saved choice.
- Set `<html lang>`, localized titles and descriptions, `openGraph.locale`,
  self-canonical URLs, reciprocal `hreflang` alternates, and sitemap entries for
  every published edition. Add `x-default` only where the language-neutral
  destination is useful.
- Keep navigation, safety notices, evidence labels, dates, empty states, search
  controls, and error pages in locale dictionaries rather than article files.
- Treat a missing interface dictionary key as a build error instead of silently
  falling back to English.
- Use Next.js 16's `proxy.ts` convention for unprefixed-route redirects and
  first-visit locale negotiation.

The App Router implementation will follow the locale-segment pattern documented
in the [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization).

### Content model

Continue using content as code:

```text
content/
├── en/<category>/<concept-id>.mdx
└── id/<category>/<concept-id>.mdx
```

The filename is a language-independent concept ID. For the first bilingual
release, `/en/concepts/sleep` and `/id/concepts/sleep` identify the same concept
while titles, descriptions, aliases, tags, and prose are localized.

Indonesian editions add translation metadata:

```yaml
locale: id
translation_of: sleep
translation_status: published
source_revision: <content revision>
translation_method: ai-assisted # or human
translation_reviewed_at: "YYYY-MM-DD"
```

Validation will reject unknown locales, orphaned translations, mismatched
concept relationships, stale source revisions, and accidentally duplicated
Human 101 ordering.

### Translation workflow

1. Freeze the reviewed English revision being translated.
2. Draft the Indonesian edition using a shared terminology glossary.
3. Review it for meaning, natural Indonesian, citations, uncertainty, and tone.
4. Require an additional subject/safety review for health and Dark Library pages.
5. Publish only after an independent meaning and safety pass. Clearly label
   AI-assisted editions while native-language editorial review remains open.
6. Flag the translation as stale whenever its English source revision changes.

The language switcher only links to editions that exist. When a translation is
missing, it explains that clearly and offers the English edition; it never serves
English prose under an Indonesian URL.

### Search

- Build separate English and Indonesian indexes.
- Add Indonesian aliases, common questions, normalization, and stop words.
- Keep searches inside the selected locale, with an explicit option to search
  another language.
- Test representative natural-language questions in both languages.
- Namespace temporary query state by locale, such as
  `open-human:search-query:id`.

### Initial scope and release gate

The initial implementation covers the complete interface and all 15 Human 101
concepts. `sleep`, `confirmation-bias`, and `manipulation` remain the reference
set for reviewing health guidance, cognitive terminology, and safety-sensitive
language.

v0.2 is technically complete when all routes render statically, locale switching
keeps the equivalent concept, metadata alternates are correct, and searches
return useful results in both languages. Native-language approval remains the
editorial gate tracked in v0.3.

## v0.3 — Expanded bilingual Human 101

- Maintain 45 source/translation pairs across Body, Mind, Self Awareness, Human
  Nature, and the Dark Library.
- Continue native-language editorial review of all 45 translated concepts in
  curriculum order and resolve community feedback.
- Localize About, Methodology, Explore, contribution guidance, and all system UI.
- Publish and maintain an English–Indonesian terminology glossary.
- Show translation credits and review dates without exposing private contributor
  information.
- Measure content parity, stale translations, broken alternates, and search
  quality in CI.

## v0.4 — Audio pilot

Audio implementation is intentionally paused until the text library contains a
larger, stable body of reviewed content. The team will define a content-volume
and revision-stability threshold before scheduling this milestone.

Audio is a versioned derivative of reviewed text. It is not generated dynamically
for each listener.

### Publishing model

```yaml
audio:
  status: reviewed
  url: https://<media-host>/<locale>/<concept-id>/<revision>.mp3
  duration_seconds: 480
  narrator_type: synthetic # or human
  narrator_credit: <approved public credit>
  source_revision: <content revision>
  reviewed_at: "YYYY-MM-DD"
```

- Keep audio binaries in object storage behind a CDN, not in Git history.
- Use immutable, revisioned asset URLs. Regenerate only when narrated text changes.
- Hide or clearly mark audio whose `source_revision` no longer matches the
  article; never present stale narration as the current edition.
- Record pronunciation decisions in a shared English–Indonesian lexicon.
- Disclose synthetic narration. Never clone a person's voice without explicit,
  documented permission.
- Select a narration provider only after comparing Indonesian voice quality,
  licensing, cost, API reliability, and data-retention terms.

### Player experience and accessibility

- Place a compact player near the article introduction.
- Provide play/pause, elapsed and total time, seeking, playback speed, volume,
  keyboard operation, visible focus, and clear loading/error states.
- Never autoplay or interrupt reading.
- Keep the article available as the equivalent text alternative and provide a
  direct “Read the transcript” path. This follows WCAG guidance for
  [prerecorded audio-only content](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html).
- Preserve section boundaries in narration and avoid reading raw URLs aloud.
- Keep playback analytics off by default; aggregate, privacy-preserving metrics
  can be evaluated later.

When this milestone is reactivated, pilot concepts will be selected from stable,
high-value articles in both `en` and `id`; the initial set is not committed yet.

## v0.5 — Complete foundation audio

- Publish reviewed audio for the stable Human 101 text collection in both languages.
- Automate text-revision checks, generation queues, quality review, and asset
  publication without making deployments depend on a text-to-speech provider.
- Add optional downloads only after bandwidth, licensing, and offline behavior
  are defined.
- Evaluate chapter playlists, an audio-only library view, and a standards-based
  podcast/RSS feed after the in-page experience is proven useful.

## v1.0 and beyond

- Contributor roles for translators, language reviewers, narrators, and domain
  reviewers.
- Documented consent and licensing for human voice recordings.
- Translation-memory and terminology tooling with transparent human approval.
- Accounts, bookmarks, reading/listening history, progress, and personal maps.
- Semantic search, source comparison, and an evidence-grounded assistant.
- Offline and mobile distribution.

## Explicitly out of scope for the first releases

- Automatically publishing raw machine translations.
- Generating personalized or cloned voices.
- Autoplay, engagement-driven queues, or hidden listening trackers.
- Replacing article citations or uncertainty with a simplified audio summary.
- Requiring an account to change language or listen.

## Open implementation decisions

- Translation library and dictionary format.
- Audio generation provider and Indonesian voice selection.
- Object storage/CDN provider and retention policy.
- Whether human narration becomes the default for flagship concepts.
- Whether a podcast feed adds value after in-page listening is established.
- The amount and revision stability of text content required before audio work
  begins.
