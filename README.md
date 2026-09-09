# Open Human

**The open-source manual for being human.**

Open Human is an evidence-aware knowledge library for understanding the body,
mind, behavior, and systems around us. It teaches understanding rather than
obedience and keeps sources, uncertainty, and competing interpretations visible.

This repository contains the expanded bilingual foundation: an editorial website,
45 Human 101 concepts in English and Bahasa Indonesia, nine concepts in each of
five browsable fields, locale-specific weighted search, evidence profiles,
sources, and related-concept navigation.

**Live site:** [open-human-six.vercel.app](https://open-human-six.vercel.app)

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root selects `/en` or
`/id` from the saved language preference and browser settings.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The tests verify both curricula, translation/source revision parity, metadata,
public category coverage, related-concept links, locale routing, and
representative natural-language searches in both languages.

## Structure

```text
app/[locale]/         Locale-prefixed Next.js App Router pages
components/           Editorial, discovery, search, and article components
content/en/           English Markdown/MDX source editions
content/id/           Indonesian Markdown/MDX localized editions
lib/i18n/             Locale configuration and interface dictionaries
lib/content.ts        Schema, graph, and cross-language parity validation
lib/search.ts         Locale-aware static weighted search adapter
proxy.ts              Root negotiation and legacy URL redirects
tests/                Content, discovery, and locale-routing contract tests
```

Content is deliberately static-first. There is no database, authentication, CMS,
or vector search in this release. The internal content and search boundaries can
be replaced later without changing canonical concept URLs.

## Environment

- `NEXT_PUBLIC_SITE_URL` sets canonical sitemap and metadata URLs. Without it,
  local development uses `http://localhost:3000`.
- `NEXT_PUBLIC_GITHUB_URL` sets project and “Improve this page” links. Without
  it, contribution links lead to the explanation on the About page.

The deployed site should set both values.

## Content principles

- No taboo. Difficult subjects can be understood responsibly.
- No dogma. Explain evidence and interpretations rather than prescribe a life.
- Evidence first. Show sources, confidence, review dates, and uncertainty.
- Defensive understanding. Dark patterns are taught for recognition and resistance.
- No diagnosis. Health content is education, not individual medical care.
- Translate meaning rather than words. Localized prose should sound natural while
  preserving claims, evidence, uncertainty, safety framing, and source URLs.
- Track every localized edition against its English source revision and disclose
  AI assistance when it is used.

See [CONTRIBUTING.md](./CONTRIBUTING.md) before proposing knowledge changes.
Translation contributors should also follow the
[English–Indonesian editorial glossary](./docs/translation-glossary.md).

## Roadmap

Locale-aware publishing is now implemented with Bahasa Indonesia as the first
language after English. Reviewed audio editions remain a later track, after the
text library has grown. See [ROADMAP.md](./ROADMAP.md) for content governance and
future release criteria.

## License

Open Human uses separate licenses for software and knowledge:

- Source code is available under the [MIT License](./LICENSE).
- Original editorial content and knowledge metadata under `content/` are
  available under [CC BY 4.0](./LICENSE-CONTENT.md).

Third-party quotations, cited works, and trademarks remain subject to their
respective rights. See the license files for the precise scope and attribution
guidance.
