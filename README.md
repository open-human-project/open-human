# Open Human

**The open-source manual for being human.**

Open Human is an evidence-aware knowledge library for understanding the body,
mind, behavior, and systems around us. It teaches understanding rather than
obedience and keeps sources, uncertainty, and competing interpretations visible.

This repository contains the foundation release: an editorial website, the first
15 Human 101 concepts, five browsable fields, weighted full-text search, evidence
profiles, sources, and related-concept navigation.

**Live site:** [open-human-six.vercel.app](https://open-human-six.vercel.app)

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The content test verifies the curriculum order, metadata schema, public category
coverage, related-concept links, and representative natural-language searches.

## Structure

```text
app/                 Next.js App Router pages and global design system
components/          Editorial, discovery, search, and article components
content/en/           Markdown/MDX knowledge source of truth
lib/content.ts        Schema validation and content repository
lib/search.ts         Static weighted search adapter
tests/                Content and discovery contract tests
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

See [CONTRIBUTING.md](./CONTRIBUTING.md) before proposing knowledge changes.

## Roadmap

The next product track adds locale-aware publishing with Bahasa Indonesia as the
first language after English, followed by reviewed audio editions for both
languages. See [ROADMAP.md](./ROADMAP.md) for sequencing, content governance,
accessibility requirements, and release criteria.

## License

Open Human uses separate licenses for software and knowledge:

- Source code is available under the [MIT License](./LICENSE).
- Original editorial content and knowledge metadata under `content/` are
  available under [CC BY 4.0](./LICENSE-CONTENT.md).

Third-party quotations, cited works, and trademarks remain subject to their
respective rights. See the license files for the precise scope and attribution
guidance.
