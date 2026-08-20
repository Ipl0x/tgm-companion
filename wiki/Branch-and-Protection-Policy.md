# Branch & Protection Policy

TGM Companion uses different branches for maintained code, backups, generated community data, and controlled publication work. They are not interchangeable.

## `main`

`main` is the maintained source of truth for the application and the GitHub Pages deployment source.

Rules for maintainers:

- Do not use direct edits to `main` for normal work.
- Start a focused branch from the current `main`.
- Open a pull request.
- Wait for required CI/checks.
- Prefer squash merge for normal project changes.
- Do not force-push or rewrite `main` history.

Typical branch names:

```text
feat/short-description
fix/short-description
docs/short-description
chore/short-description
test/short-description
```

## `backup`

`backup` is an automation-managed safety mirror of `main`.

The backup workflow runs after pushes to `main`, every 12 hours, and on manual dispatch. It pushes the current `main` commit to `backup` and verifies both SHAs match.

Do not:

- develop on `backup`;
- deploy from `backup`;
- commit features directly to `backup`;
- use `backup` as a substitute for a proper revert.

Use it as a recovery/reference branch when validating repository state.

## `community-feed`

`community-feed` contains generated Community Data feed output.

It is rebuilt from GitHub issues by `community-data.yml`.

Rules:

- do not hand-edit generated feed records;
- do not merge `community-feed` into `main`;
- do not use it for feature work;
- troubleshoot the generating workflow or issue source when the feed is wrong.

The public Community Data page reads the generated feed and can fall back to its cached/local snapshot.

## `community/issue-<number>-approved`

These branches are created by the Community review workflow after a submission receives `status:approved`.

They are controlled publication branches. They initially contain the normalized approved source record under:

```text
data/community/approved/issue-<number>.json
```

A maintainer may add the required maintained dataset or Wiki integration to the same branch before merging its publication PR.

Do not merge the PR merely because the branch exists.

## Documentation branches

Maintainer Wiki changes should use a normal docs branch, for example:

```text
docs/update-maintainer-wiki
```

After merge to `main`, `wiki.yml` mirrors `wiki/` to the rendered GitHub Wiki.

## Force pushes and history rewriting

Avoid force pushes on maintained or automation-owned branches. Repository history is part of the audit trail for:

- game-data changes;
- review decisions;
- publication records;
- rollback investigation;
- deployment history.

When a bad change reaches `main`, use a revert/fix PR instead of rewriting public history. See [Rollback & Recovery](Rollback-and-Recovery).

## Before creating a branch

Make sure your branch starts from current `main`. A stale branch can accidentally reintroduce removed code or create unnecessary conflicts.

## Branch ownership summary

| Branch | Owner | Purpose |
| --- | --- | --- |
| `main` | Maintainers via PR | Maintained app / Pages source |
| `backup` | GitHub Actions | Safety mirror of `main` |
| `community-feed` | GitHub Actions | Generated public review feed |
| `community/issue-*-approved` | Review workflow + maintainer | Controlled approved-data publication |
| `feat/*`, `fix/*`, `docs/*`, etc. | Contributor/maintainer | Normal change branches |
