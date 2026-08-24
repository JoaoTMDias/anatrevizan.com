# AGENTS.md

## Project purpose

This repository contains the official implementation of `anatrevizan.com`. The production foundation is Astro + TinaCMS, deployed on Netlify. The existing Next.js implementation in another repository is only a visual, functional, editorial, and information architecture specification; it must not be promoted or migrated mechanically.

Before making structural changes, consult:

1. `docs/decisoes-tecnicas.md` — primary source for established decisions;
2. `docs/Checklist.md` — outstanding work and launch criteria;
3. `docs/Relatório Técnico - Versão Next.js.md` — historical audit and risks that must not be repeated.

In case of conflict, the technical decisions take precedence, followed by the user's current request, and then the checklist. Do not reopen established decisions without explicit instructions.

## Stack and commands

- Node.js 22.22 or newer, as specified in `.nvmrc` and `package.json`.
- Use pnpm exclusively; do not create `package-lock.json` or `yarn.lock`.
- Astro 7, TinaCMS 3, `@tinacms/astro`, TypeScript, and Tailwind CSS 4.
- Production is deployed on Netlify; `netlify.toml` defines the build command and publish directory.

Primary commands:

```sh
pnpm install
pnpm dev
pnpm exec astro check
pnpm build:local
pnpm build
```

Use `pnpm build:local` to validate without the Tina Cloud check. Use `pnpm build` when the required environment and remote schema are available. Do not bypass dependency errors with `--force` or `--legacy-peer-deps`.

## Architecture

- Prefer `.astro` components and static HTML. Add client-side JavaScript only when genuine interactivity requires it.
- Do not convert components from the Next.js version line by line. Reimplement their behavior idiomatically in Astro.
- Keep reusable components in `src/components`, layouts in `src/layouts`, utilities in `src/lib`, routes in `src/pages`, and global styles in `src/styles`.
- Keep schemas and editorial configuration in `tina/`, and CMS-managed content in `src/content/`.
- Avoid runtime dependencies when Astro or the deployment platform already provides the required functionality.
- Preserve the host-neutral approach in `astro.config.mjs` without compromising the Netlify deployment.

## Content and TinaCMS

- Ana must be able to edit pages, navigation, services, events, talks, training, mentoring, images, CTAs, contact details, SEO, and legal copy through TinaCMS.
- Layouts, components, validation, integrations, and business rules remain in code.
- Changes to the editorial model must update the Tina schemas, generated types/queries when applicable, rendering components, and existing content together.
- Do not introduce factual, legal, academic, or professional content without a source or approval. Never invent credentials, dates, services, contact details, or outcome claims.
- Remove placeholders, empty assets, buttons without destinations, and `href="#"` links; do not use them as silent temporary solutions.
- Write Portuguese content in European Portuguese unless explicitly instructed otherwise.

## Internationalization and routes

- Launch languages are European Portuguese and English.
- Portuguese is the primary language and has no prefix; English uses `/en` and localized slugs.
- Do not publish incomplete English content or display visible Portuguese fallback content on English pages.
- Spanish may be prepared in the editorial model but must not be published in v1. Brazilian Portuguese is not part of v1.
- When changing routes, preserve PT/EN equivalents and update navigation, canonicals, `hreflang`, `x-default`, and the sitemap.
- The planned final structure contains 19 routes. Confirm the route map in the documentation/content before adding, removing, or renaming pages.

## Integrations

- Calendly must be a TinaCMS-configurable external link, without an embed or script in v1. Present the contact form as an alternative.
- ORCID is the automatic source for publications at build time. Validate external responses and keep a local snapshot as a fallback. External downtime must not remove existing publications or block the build.
- Publications without a valid URL must not produce fake links.
- The contact form will be processed server-side in Astro/Netlify, using Google Sheets, Resend notifications, Turnstile, a honeypot, validation, size limits, and duplicate-submission prevention.
- Never place Google, Resend, Tina, or Netlify credentials in code, content, versioned documentation, or `netlify.toml`. Use environment variables and keep `.env`/`.env.local` out of Git.

## Required quality checks

Validate every change in proportion to its risk and run at least:

```sh
pnpm exec astro check
git diff --check
```

Also run an appropriate build when changing configuration, dependencies, routes, content, TinaCMS, or deployment integration. If a test depends on external services, clearly distinguish code failures from credential, remote schema, or external availability failures.

Before completing interface changes:

- test keyboard use, visible focus, semantics, accessible names, and contrast;
- confirm responsiveness from 320 px and zoom up to 400%;
- respect `prefers-reduced-motion` and, for heavy media, `Save-Data`;
- avoid unnecessary JavaScript and downloads;
- confirm there are no console errors, missing assets, or development URLs.

For critical flows, add or update tests for routing, translations, ORCID, forms, and accessibility. Do not consider a feature complete merely because it compiles.

- Add unit tests whenever practical, especially for utilities, validation, data transformation, content mapping, and integration fallback logic.
- Add end-to-end tests with Playwright for user-facing flows, routing, navigation, forms, localization, and other behavior that depends on the rendered application.
- Every bug fix should include a regression test when the affected behavior can be tested reliably.
- When tests are not practical, document the reason and the manual validation performed in the handoff.

## SEO, privacy, and security

- Every published page must have localized metadata, the correct canonical URL, and consistent alternates.
- Do not index incomplete pages, languages, or legal copy. Production must not emit `localhost` URLs.
- Validate all input on the server; limit payload sizes and apply anti-spam protection and rate limiting where required.
- Do not load non-essential third parties before obtaining applicable consent.
- Treat privacy policies, cookie policies, terms, and professional claims as content requiring qualified human review.
- Do not expose secrets in logs, diffs, screenshots, or error messages.

## Change discipline

- Preserve unrelated changes already present in the working tree.
- Keep changes small and coherent; do not mix broad refactors with focused fixes.
- Update `docs/decisoes-tecnicas.md` when a structural decision is approved and `docs/Checklist.md` when the real status of a task changes.
- In the handoff, explain what changed, which checks passed, and any remaining risks or blockers.
