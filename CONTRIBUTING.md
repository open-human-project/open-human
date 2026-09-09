# Contributing to Open Human

Open Human treats a knowledge edit with the same care an open-source project gives
a code change. A useful contribution can correct a claim, improve a source, make
uncertainty clearer, or explain a concept in more accessible language.

## Before editing

1. Read the product context and the existing article closest to your subject.
2. Define the question the article answers and the boundaries it does not cross.
3. Prefer primary research, systematic reviews, consensus statements, and
   accountable institutions over anonymous summaries.
4. Do not imply medical diagnosis, therapy, or individualized treatment.
5. Explain manipulation and coercion for recognition and defense, not exploitation.

## Knowledge file format

English source editions live under `content/en/<category>/<slug>.mdx`; Indonesian
editions use the matching path under `content/id/`. The filename is a stable,
language-independent concept ID. Frontmatter and cross-language parity are
validated at build time.

```yaml
---
locale: en
content_revision: 1
title: "Confirmation Bias"
description: "A concise, plain-language description."
category: mind
tags: [cognition, decision-making]
aliases: ["Why do I only notice evidence that agrees with me?"]
difficulty: foundational
evidence_level: A
confidence: high
last_reviewed: "2026-09-09"
human_101_order: 11
related: [attention, metacognition]
sources:
  - title: "Source title"
    author: "Author or institution"
    publisher: "Journal or institution"
    year: 2024
    url: "https://example.org/source"
---
```

An Indonesian edition points to the exact English revision it translates:

```yaml
locale: id
translation_of: confirmation-bias
translation_status: published
source_revision: 1
translation_method: ai-assisted # or human
translation_reviewed_at: "2026-09-09"
```

Translate the meaning of each paragraph rather than matching words or sentence
order. Titles, descriptions, aliases, tags, examples, and prose should read
naturally in Indonesian. Category IDs, difficulty, evidence level, confidence,
Human 101 order, related concept IDs, and supporting source URLs must remain
aligned with the English source. If `content_revision` changes, update and review
the translation before advancing its `source_revision`.

Increment `content_revision` whenever reader-facing English prose or knowledge
metadata changes, including titles, descriptions, evidence labels, source records,
curriculum order, and related concepts. Code-only changes do not require a content
revision. Advance an edition's `source_revision` only after its prose, metadata,
links, caveats, and safety framing have been checked against that English revision.

Use the [English–Indonesian editorial glossary](./docs/translation-glossary.md)
for recurring terms and update it deliberately when a better convention emerges.

Use the shared article sequence where it fits: short version, why it matters, how
it works, a concrete example, misconceptions, practical recognition or response,
and what remains uncertain. Dark Library topics should end with protective action.
Use the established Indonesian headings in existing `content/id/` articles rather
than mixing English headings into an Indonesian edition.

## Evidence levels

- **A — Strong:** multiple high-quality sources or strong consensus.
- **B — Good:** reasonably strong evidence with limitations.
- **C — Emerging / mixed:** real but inconsistent or incomplete evidence.
- **D — Hypothesis:** plausible and interesting, not sufficiently established.
- **E — Interpretive:** philosophical or interpretive rather than empirically settled.

The level summarizes the page; it does not replace citations for material claims.

## Review checklist

- Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Confirm every related slug exists and the relationship makes conceptual sense.
- Open every new source, cite it in the article body, and confirm it supports the
  nearby claim.
- State important uncertainty, variation, and counterevidence.
- Use calm, direct language without sensationalism or motivational promises.
- Check the article at narrow and wide viewport sizes.
- For a translation, compare every claim, number, caveat, safety statement, link,
  and source against the exact source revision.
- Disclose machine assistance and require an independent language pass; native
  speaker feedback should be resolved before the edition is considered final.

## Licensing contributions

By submitting a contribution, you confirm that you have the right to contribute
it and agree that it will be distributed under the license governing the area
you changed:

- Code contributions are licensed under the [MIT License](./LICENSE).
- Original prose and knowledge metadata contributed under `content/` are
  licensed under [CC BY 4.0](./LICENSE-CONTENT.md).

Do not copy third-party text into the project unless its license permits that
use and the attribution requirements are documented. Citations should normally
summarize a source in original language rather than reproduce it.
