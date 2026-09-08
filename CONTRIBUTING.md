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

Concepts live under `content/en/<category>/<slug>.mdx`. The filename is the stable
slug. Frontmatter is validated at build time.

```yaml
---
title: "Confirmation Bias"
description: "A concise, plain-language description."
category: mind
tags: [cognition, decision-making]
aliases: ["Why do I only notice evidence that agrees with me?"]
difficulty: foundational
evidence_level: A
confidence: high
last_reviewed: "2026-09-09"
human_101_order: 4
related: [attention, metacognition]
sources:
  - title: "Source title"
    author: "Author or institution"
    publisher: "Journal or institution"
    year: 2024
    url: "https://example.org/source"
---
```

Use the shared article sequence where it fits: short version, why it matters, how
it works, a concrete example, misconceptions, practical recognition or response,
and what remains uncertain. Dark Library topics should end with protective action.

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
- Open every new source and confirm it supports the nearby claim.
- State important uncertainty, variation, and counterevidence.
- Use calm, direct language without sensationalism or motivational promises.
- Check the article at narrow and wide viewport sizes.

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
