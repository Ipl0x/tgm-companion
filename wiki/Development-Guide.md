# Development Guide

TGM Companion is a static Progressive Web App. There is no build step for normal local use.

## Local setup

Clone the repository, then serve the repository root over HTTP:

```bash
python -m http.server 8080
```

Open:

```text
http://localhost:8080
```

Do not open pages directly through `file://`; service workers require HTTP or HTTPS.

## Tests

GitHub Actions uses Node.js 22. Run the repository test suite with:

```bash
npm test
```

Tests cover calculator reference behavior, investment mapping/dependencies, PWA metadata/app-shell behavior, and Community Data regression logic.

## Branch workflow

Do not write directly to protected `main`.

Use:

```text
branch from main
    ↓
focused change
    ↓
tests
    ↓
pull request
    ↓
required CI/checks
    ↓
merge
```

Recommended branch prefixes:

- `feat/` — new functionality
- `fix/` — bug fix
- `docs/` — documentation
- `chore/` — maintenance

Recommended commit prefixes include `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, and `chore:`.

## Keep changes focused

A PR should explain:

- what changed;
- why it changed;
- how it was tested;
- screenshots for visible UI changes;
- impact on stored browser data, imports/exports, or offline caches when relevant.

## Dataset changes

Calculator and dataset changes should include the source/reason, a reproducible input, the expected output, and a regression test when practical.

Never replace exact source values with estimates.

## UI changes

Preserve the established TGM layout and original game ordering unless the requested change intentionally changes them. Check desktop/mobile behavior and both themes where relevant.

## Community publication branches

Branches named `community/issue-<number>-approved` are generated after maintainer approval. They are publication branches, not general development branches. Add the maintained data/Wiki integration needed for that approved submission, run tests, and merge only after review.

## Important repository docs

- `README.md` — project overview
- `CONTRIBUTING.md` — contribution rules
- `docs/COMMUNITY_DATA_REVIEW.md` — canonical Community Data maintainer procedure
- `CHANGELOG.md` — notable changes
- `SECURITY.md` — vulnerability reporting
