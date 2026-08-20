# Release & Deployment Checklist

TGM Companion is a static app deployed through GitHub Pages from the repository root on `main`. There is no application build step.

Use this page when preparing a formal release or when a set of changes should be treated as a release milestone.

## Before release

- [ ] Decide the release scope.
- [ ] Confirm all intended PRs are merged.
- [ ] Check unresolved high-priority bugs.
- [ ] Review `CHANGELOG.md`.
- [ ] Confirm versioning follows the project's semantic-versioning policy.
- [ ] Update package/release version metadata when the release process requires it.

Do not change a version number simply because one documentation-only PR landed; make releases intentionally.

## Validate `main`

- [ ] CI on `main` is successful.
- [ ] `npm test` passes.
- [ ] Key pages load:
  - Dashboard
  - Building Star-Ups
  - Investments
  - in-app Wiki
  - Community Data
- [ ] Major calculators still produce expected results.
- [ ] Community Data links/forms still open correctly.

## PWA validation

Current PWA behavior is controlled by `sw.js`.

Before a release containing runtime/static changes:

- [ ] Confirm whether `CACHE_VERSION` was bumped when installed clients need updated cached assets.
- [ ] Confirm new offline-critical files are in `APP_SHELL`.
- [ ] Load the site once online.
- [ ] Confirm the service worker installs/updates.
- [ ] Reload while offline where practical.
- [ ] Confirm the update prompt does not leave users on a stale incompatible shell.

Documentation-only repository changes normally do not require a PWA cache bump.

## Deployment

Merging to `main` updates the GitHub Pages source.

After merge:

1. Wait for GitHub Pages to build the new `main`.
2. Confirm the live site serves the expected commit/content.
3. Hard-refresh only as a diagnostic step; remember installed PWA clients can follow service-worker caching rules.
4. Check browser console/network errors on key pages if the release touched runtime files.

## Backup verification

The `backup.yml` workflow synchronizes `backup` with `main`.

After release:

- [ ] Confirm the backup workflow succeeded.
- [ ] Confirm `backup` and `main` point to the same commit.

Do not deploy from `backup`.

## Community/Wiki verification

When a release includes community workflow changes:

- [ ] Verify issue-to-feed synchronization.
- [ ] Verify status label behavior.
- [ ] Verify an approved publication PR can still be created.

When it includes `wiki/` changes:

- [ ] Verify the GitHub Wiki sync completed.
- [ ] Open the rendered Wiki and check navigation/sidebar.

## Formal GitHub release/tag

If creating a GitHub Release:

- use the intended semantic version;
- summarize user-visible changes from the changelog;
- link important migrations/breaking behavior;
- avoid claiming WIP/incomplete datasets are complete.

## After release

Record any immediately discovered regression as an issue. For a serious live regression, use [Rollback & Recovery](Rollback-and-Recovery) rather than rewriting `main`.
