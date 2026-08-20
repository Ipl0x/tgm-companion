# Maintainer Onboarding

This page is the starting point for a new TGM Companion maintainer. Read it together with the [Development Guide](Development-Guide), [Branch & Protection Policy](Branch-and-Protection-Policy), and [Community Data Maintainer Guide](Community-Data-Maintainer-Guide).

## What TGM Companion is

TGM Companion is a static Progressive Web App for The Grand Mafia. It currently contains:

- Dashboard
- Building Star-Up planner
- Investment planner
- Player-facing in-app Wiki
- Community Data review page
- Local browser backup/restore
- GitHub-based community submission and review automation

There is no application backend or user account system. Planner progress is stored locally in the browser.

## Know these branches

- `main` — maintained application source and GitHub Pages source. Treat it as protected and change it through pull requests.
- `backup` — automation-maintained mirror of `main`. Do not use it as a development or deployment branch.
- `community-feed` — generated Community Data JSON snapshot used by the Community Data page. Do not hand-edit it.
- `community/issue-<number>-approved` — generated publication branch created after a community submission receives `status:approved`.

See [Branch & Protection Policy](Branch-and-Protection-Policy) before changing branch behavior.

## Know these workflows

The repository currently uses:

- `test.yml` — CI/tests and syntax validation.
- `backup.yml` — keeps `backup` synchronized with `main`.
- `community-data.yml` — generates the public Community Data feed.
- `community-review.yml` — normalizes review labels and prepares publication PRs.
- `wiki.yml` — publishes the maintained `wiki/` source to GitHub Wiki.

See [GitHub Actions Reference](GitHub-Actions-Reference) for triggers and responsibilities.

## Know where important code lives

```text
index.html / src/app/dashboard.js       Dashboard
star-ups.html / src/app/starups.js      Star-Up planner
investments.html / src/app/investments.js
wiki.html / src/app/wiki.js             Player-facing Wiki
community-data.html / src/app/community-data.js
src/buildings/                          Building catalog/calculation logic
src/investments/                        Investment logic and WIP construction data
src/shared/backup.js                    Central browser backup contract
scripts/                                Community feed/publication helpers
tests/                                  Node test suite
wiki/                                   Maintainer GitHub Wiki source
.github/                                Workflows and Issue Forms
```

## Community submissions

A newly submitted Investment, Star-Up, or Wiki issue is evidence, not maintained game data.

The normal lifecycle is:

```text
Needs review
→ Cross-checking
→ Verified candidate
→ Approved
→ Publication PR
→ Published
```

A maintainer controls the review steps. `Published` is system-owned and is applied only after the controlled publication PR is merged.

Start with [Community Data Maintainer Guide](Community-Data-Maintainer-Guide).

## Before merging any PR

At minimum:

1. Understand exactly what changed.
2. Confirm the PR contains no unrelated changes.
3. Run or verify CI.
4. Check data values against evidence when game data changed.
5. Check PWA cache requirements for runtime/static changes.
6. Update the changelog for notable changes.
7. Merge only after required checks are green.

Use [Pull Request Review Checklist](Pull-Request-Review-Checklist).

## Important data rule

Do not invent, estimate, interpolate, or silently “correct” source values.

`0` and `Unknown` are different states. Original investment time must be the unbuffed/base game value. Prerequisites must be supported by source evidence.

See [Data Conventions](Data-Conventions) and [Dataset Maintenance Guide](Dataset-Maintenance-Guide).

## Where to ask “what do I do now?”

Use [Maintainer Daily Operations](Maintainer-Daily-Operations) for common day-to-day scenarios and [Troubleshooting](Troubleshooting) when automation or the live app behaves unexpectedly.
