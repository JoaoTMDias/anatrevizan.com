# AGENTS.md

## Principles

- Stack: Astro, TinaCMS, TypeScript, Tailwind CSS, and Netlify.
- Prefer static HTML and `.astro` components; use JavaScript only for necessary interactions.
- PT-PT is the primary language. EN uses its own routes and never falls back to Portuguese.
- Editorial content belongs in the CMS; routing, layout, URLs, validation, and integrations belong in code.
- Do not invent factual, legal, academic, or professional content. External URLs must use HTTPS.
- Never store secrets in Git. Validate server input and preserve privacy, accessibility, and consent.

## Verification

Before delivering changes, run `pnpm test`, `pnpm exec astro check`, and `git diff --check`, plus the build or E2E tests when affected.
