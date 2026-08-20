# Rollback & Recovery

Use this guide when a merged change causes a serious live regression, incorrect game data, broken deployment, or incompatible PWA behavior.

## First: identify the failure

Determine:

- which commit/PR introduced the problem;
- whether the issue is code, data, PWA cache, GitHub Pages, Community Data, or Wiki sync;
- whether users are currently affected;
- whether a forward fix is safer than a revert.

Do not make several speculative emergency changes at once.

## Preferred recovery: revert through a PR

For a bad merge on `main`:

1. Create a recovery/fix branch from current `main`.
2. Revert the offending commit or apply the smallest forward fix.
3. Run tests.
4. Open a PR explaining the incident and expected restored behavior.
5. Merge after required checks.

This preserves public history and the audit trail.

Avoid force-pushing or resetting `main` backwards.

## When game data is wrong

If incorrect values were published:

- mark the source problem clearly;
- correct/revert the maintained dataset through a PR;
- add a regression test if practical;
- do not silently replace the value without recording why;
- update the related community issue/publication notes if they were the source.

`status:published` means a publication PR was merged; it does not prevent a later correction.

## PWA recovery

A fixed file on `main` may still be cached by installed clients.

When a runtime/static fix must reach clients:

- update the affected source;
- increment `CACHE_VERSION` when a new app cache is required;
- make sure `APP_SHELL` is correct;
- test update activation.

A code revert without an appropriate service-worker cache change can leave some clients on the broken cached version.

## GitHub Pages problem

If repository source is correct but the live site is stale/broken:

- confirm the expected commit is on `main`;
- check Pages build/deployment state;
- confirm paths remain compatible with `/tgm-companion/`;
- check `.nojekyll`;
- distinguish browser/PWA caching from a Pages deployment failure.

## Using `backup`

`backup` is a mirror/reference for the current maintained history.

Use it to verify repository state or recover a known commit if necessary, but do not:

- treat it as the normal deployment source;
- commit a hotfix directly to it;
- force `main` to match `backup` without understanding the history.

The normal recovery path still goes through a reviewed PR.

## Community automation recovery

If a workflow generated a wrong feed/publication branch:

- fix the source issue/workflow;
- let automation regenerate the derived branch/file;
- do not manually patch `community-feed` as the long-term solution.

For publication branches, close an unsafe PR rather than merging it.

## GitHub Wiki recovery

The maintained Wiki source is `wiki/` on `main`. If the rendered GitHub Wiki is wrong, correct the source and let `wiki.yml` republish it.

Do not rely on direct edits in the rendered Wiki as the permanent fix.

## Incident note

For significant incidents, record:

- what broke;
- affected commit/PR;
- user impact;
- recovery PR;
- whether data/storage compatibility was involved;
- whether additional tests/documentation were added.

The goal is recoverability without destroying the history needed to understand the incident.
