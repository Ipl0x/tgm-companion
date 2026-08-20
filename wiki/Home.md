# TGM Companion Maintainer Wiki

This Wiki documents how to maintain **TGM Companion**, review community submissions, manage game data, and publish verified changes safely.

> Player-facing gameplay help lives in the TGM Companion in-app Wiki. This GitHub Wiki is for maintainers and contributors.

## Start here

- [Maintainer Onboarding](Maintainer-Onboarding) — first-read guide for a new maintainer.
- [Maintainer Daily Operations](Maintainer-Daily-Operations) — what to do when issues, PRs, workflow failures, or publication tasks appear.
- [Community Data Maintainer Guide](Community-Data-Maintainer-Guide) — what to do after a Submit Data issue is opened.
- [Issue & Label Workflow](Issue-and-Label-Workflow) — meaning of every `status:*` label and who may advance it.
- [Reviewing Game Data](Reviewing-Game-Data) — evidence checks for Investments, Star-Ups, and Wiki corrections.
- [Community Data Review Examples](Community-Data-Review-Examples) — worked examples for correct, incomplete, conflicting, and rejected submissions.
- [Publishing Approved Data](Publishing-Approved-Data) — what happens after `status:approved` and how publication PRs are handled.

## Repository operations

- [Branch & Protection Policy](Branch-and-Protection-Policy) — purpose and ownership of `main`, `backup`, `community-feed`, publication branches, and normal work branches.
- [Pull Request Review Checklist](Pull-Request-Review-Checklist) — pre-merge checklist for code, data, UI, storage, PWA, and publication PRs.
- [Release & Deployment Checklist](Release-and-Deployment-Checklist) — release preparation, Pages, PWA, backup, and post-deploy verification.
- [Rollback & Recovery](Rollback-and-Recovery) — how to recover safely without rewriting maintained history.
- [GitHub Actions Reference](GitHub-Actions-Reference) — CI, backup, Community Data, review, and Wiki workflows.

## Data, security, and compatibility

- [Data Conventions](Data-Conventions) — exact values, `0` vs `Unknown`, Original Time, prerequisites, and completeness.
- [Dataset Maintenance Guide](Dataset-Maintenance-Guide) — how verified building/investment/WIP data should be integrated and tested.
- [Security & Secrets](Security-and-Secrets) — static-app security model, workflow tokens, public issues, and untrusted content.
- [Storage & Backup Compatibility](Storage-and-Backup-Compatibility) — `localStorage`, backup format, allowlisted keys, and migration rules.

## Development and project reference

- [Development Guide](Development-Guide) — local setup, tests, branches, and pull requests.
- [Project Architecture](Project-Architecture) — app pages, source modules, Community Data, GitHub Actions, and branches.
- [PWA & Deployment](PWA-and-Deployment) — GitHub Pages, service-worker cache updates, CI, and backup behavior.
- [Project Roadmap & Feature Status](Project-Roadmap-and-Feature-Status) — maintained, partial, and WIP areas without release-date promises.
- [Maintainer FAQ](Maintainer-FAQ) — answers to recurring maintenance questions.
- [Terminology & Glossary](Glossary) — project-specific terms and status meanings.
- [Troubleshooting](Troubleshooting) — common problems with Community Data, publication PRs, CI, Wiki sync, and stale PWA versions.

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

The source for these pages is kept under `wiki/` in the main repository and synchronized to the GitHub Wiki by GitHub Actions. The GitHub Wiki tab is the published mirror; changes should be made in the maintained `wiki/` source so they can be reviewed first.

Use the normal branch → PR → CI → merge workflow. Direct edits to the rendered GitHub Wiki are not the source of truth and can be overwritten by the next sync.
