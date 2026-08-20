# GitHub Actions Reference

This page documents the repository workflows and what maintainers should expect from them.

## `test.yml` — CI

**Purpose:** validate code, data behavior, JavaScript syntax, and required project files.

**Triggers:**

- push to `main`;
- pull requests;
- manual dispatch.

**Important behavior:**

- uses Node.js 22;
- runs `npm test`;
- syntax-checks JavaScript/MJS files and `sw.js`;
- verifies required application/repository files exist.

A normal PR should not be merged while required CI is failing.

## `backup.yml` — Backup main

**Purpose:** keep `backup` synchronized with `main`.

**Triggers:**

- push to `main`;
- every 12 hours;
- manual dispatch.

**Important behavior:**

- checks out full `main` history;
- pushes `main` to `backup`;
- verifies both commit SHAs match;
- on first backup creation, performs the workflow's one-time obsolete-branch cleanup.

`backup` is not the Pages source and should not receive manual feature commits.

## `community-data.yml` — Community data feed

**Purpose:** convert structured GitHub Issue submissions into the generated Community Data snapshot.

**Triggers include:**

- supported issue changes such as opened/edited/closed/reopened/labeled/unlabeled;
- selected pushes to `main` affecting the feed workflow/builder/client;
- manual dispatch.

**Output:**

```text
community-feed
└── assets/community/submissions.json
```

The feed is generated data. Fix the source issue/parser/workflow instead of manually maintaining the branch.

## `community-review.yml` — Community review pipeline

**Purpose:** control submission status and approved-data publication.

**Responsibilities:**

- ensure review labels exist;
- default recognized submissions to `status:needs-review`;
- normalize status labels;
- prevent maintainers from manually bypassing the flow with `status:published`;
- create/refresh `community/issue-<number>-approved`;
- export `data/community/approved/issue-<number>.json`;
- open a controlled publication PR after `status:approved`;
- explicitly dispatch CI for the generated publication branch;
- after the publication PR is merged, mark the source issue `status:published` and close it.

Publication is intentionally PR-controlled; the workflow does not write the approved data directly to protected `main`.

## `wiki.yml` — Sync GitHub Wiki

**Purpose:** publish the reviewable `wiki/` source to the rendered GitHub Wiki.

**Triggers:**

- pushes to `main` affecting `wiki/**` or the Wiki workflow;
- manual dispatch.

**Important behavior:**

- clones the repository's separate Wiki Git repository;
- replaces rendered Wiki content with the maintained `wiki/` source;
- commits/pushes as `github-actions[bot]`.

Therefore direct rendered-Wiki edits are not the source of truth.

## When a workflow fails

1. Open the failed run.
2. Find the first failing step.
3. Read its logs.
4. Fix the source branch/workflow/input.
5. Re-run or trigger a new run.

Do not work around failed automation by directly editing protected/generated branches unless recovery explicitly requires it.

## Permissions

Workflows request only the repository permissions they need. Community review needs write access for contents, issues, pull requests, and Actions because it manages labels/branches/PRs and dispatches CI.

Never replace this design by putting a GitHub write token into browser JavaScript.
