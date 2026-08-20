# TGM Companion Maintainer Wiki

This Wiki documents how to maintain **TGM Companion**, review community submissions, manage game data, and publish verified changes safely.

> Player-facing gameplay help lives in the TGM Companion in-app Wiki. This GitHub Wiki is for maintainers and contributors.

## Start here

- [Community Data Maintainer Guide](Community-Data-Maintainer-Guide) — what to do after a Submit Data issue is opened.
- [Issue & Label Workflow](Issue-and-Label-Workflow) — meaning of every `status:*` label and who may advance it.
- [Reviewing Game Data](Reviewing-Game-Data) — evidence checks for Investments, Star-Ups, and Wiki corrections.
- [Publishing Approved Data](Publishing-Approved-Data) — what happens after `status:approved` and how publication PRs are handled.

## Development

- [Development Guide](Development-Guide) — local setup, tests, branches, and pull requests.
- [Project Architecture](Project-Architecture) — app pages, source modules, Community Data, GitHub Actions, and branches.
- [Data Conventions](Data-Conventions) — exact values, `0` vs `Unknown`, Original Time, prerequisites, and completeness.
- [PWA & Deployment](PWA-and-Deployment) — GitHub Pages, service-worker cache updates, CI, and backup behavior.
- [Troubleshooting](Troubleshooting) — common problems with Community Data, publication PRs, CI, and stale PWA versions.

## Core rule

**Community reports are evidence; only a reviewed and merged publication pull request makes them maintained TGM Companion data.**

## Important links

- Live app: https://ipl0x.github.io/tgm-companion/
- Repository: https://github.com/Ipl0x/tgm-companion
- Community Data page: https://ipl0x.github.io/tgm-companion/community-data.html
- Canonical Community Data review document: `docs/COMMUNITY_DATA_REVIEW.md`
- Contribution guide: `CONTRIBUTING.md`
- Changelog: `CHANGELOG.md`

## Editing this Wiki

The source for these pages is kept under `wiki/` in the main repository and synchronized to the GitHub Wiki by GitHub Actions. The GitHub Wiki tab is the published mirror; changes should be made in the maintained `wiki/` source so they can be reviewed first. Update the source through the normal branch → PR → CI → merge workflow instead of editing Wiki pages directly, because the next sync treats the repository source as authoritative.
