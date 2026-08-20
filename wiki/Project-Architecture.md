# Project Architecture

TGM Companion is a static, browser-based Progressive Web App hosted with GitHub Pages.

## Main user-facing pages

```text
index.html             Dashboard
star-ups.html          Building Star-Up Planner
investments.html       Investment Planner
wiki.html              In-app player Wiki
community-data.html    Community submission review overview
```

## Main source areas

```text
src/app/          Browser controllers and page behavior
src/buildings/    Building data/catalog and calculation logic
src/investments/  Investment registration/calculation logic
src/data/         Browser/Node data loaders
src/shared/       Shared formatting, storage, backup, and helpers
css/              Shared and page-specific styles
assets/           Icons and static/generated app data
tests/            Node regression tests
scripts/          Repository automation/data transformation scripts
```

## Browser data

Planner progress and settings are stored locally in the browser. The project does not use a normal application backend, login system, analytics service, or cloud database.

## Community Data architecture

Community submissions use GitHub as the review backend:

```text
Structured Issue Form
        ↓
GitHub Issue
        ↓
Community review/status labels
        ↓
Community data feed workflow
        ↓
community-feed branch
        ↓
Community Data page
```

The generated `community-feed` snapshot is read-only source/review information for the website. It is not the maintained game dataset.

## Approval architecture

```text
status:approved
        ↓
community-review.yml
        ↓
community/issue-<number>-approved
        ↓
data/community/approved/issue-<number>.json
        ↓
controlled publication PR
        ↓
maintained integration + CI
        ↓
merge
        ↓
status:published
```

## Important workflows

- `.github/workflows/test.yml` — repository CI.
- `.github/workflows/backup.yml` — keeps `backup` synchronized with `main` using fast-forward updates.
- `.github/workflows/community-data.yml` — rebuilds the Community Data feed from structured issues and publishes it to `community-feed`.
- `.github/workflows/community-review.yml` — manages status labels, approved publication branches/PRs, and Published handling after merge.
- `.github/workflows/wiki.yml` — synchronizes the maintained `wiki/` source to the repository's GitHub Wiki.

## Special branches

- `main` — maintained application and GitHub Pages source.
- `backup` — automatically synchronized backup; do not use for manual work.
- `community-feed` — generated Community Data snapshot.
- `community/issue-<number>-approved` — controlled publication branch for an approved submission.

## Player Wiki vs GitHub Wiki

The in-app `wiki.html` is player-facing gameplay/help content. The GitHub Wiki documents maintenance, contribution, review, data, deployment, and troubleshooting procedures.
