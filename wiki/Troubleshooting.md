# Troubleshooting

This page covers common maintainer problems around Community Data, GitHub Actions, deployment, and the PWA.

## A Submit Data issue does not appear on Community Data

Check:

1. The issue title starts with a supported structured prefix:
   - `[Data][Investment]:`
   - `[Data][Star-Up]:`
   - `[Wiki]:`
2. The **Community data feed** workflow ran after the issue event.
3. The `community-feed` branch contains an updated `assets/community/submissions.json`.
4. The browser/PWA is not still serving an older cached Community Data controller.

Do not manually copy issue values into the feed; the feed is generated.

## An issue has multiple status labels

Normally the Community review workflow removes the previous status after a new status is added.

If multiple review labels briefly appear, wait for the workflow run to complete and refresh the issue. If they remain, inspect the **Community review pipeline** Action run before changing labels again.

## `status:approved` does not create a publication PR

Check:

- the issue is a recognized structured submission;
- `status:approved` is the active review status;
- the Community review workflow completed;
- repository **Settings → Actions → General → Workflow permissions** allows GitHub Actions to create and approve pull requests.

The workflow leaves an issue comment with this setting when GitHub blocks PR creation.

## Publication PR exists but CI says `action_required`

Publication PRs are created by `github-actions[bot]`. The normal pull-request event may not behave like a user-created PR. The review workflow also explicitly dispatches `test.yml` on the publication branch.

Open Actions and inspect the explicitly dispatched CI run. If GitHub asks for workflow approval, review it before allowing it. Do not merge while required checks are incomplete.

## The publication PR only contains JSON

That can be expected initially. Automation exports the approved source record first.

Before merge, add the actual maintained integration when needed: Investment/Star-Up dataset changes, Wiki content, tests, or related code. The source JSON alone does not necessarily make the data visible in the planner.

## A maintainer manually added `status:published`

Published is system-owned. The workflow guards against using it as a shortcut and routes a manual attempt back through the approval path.

Use `status:approved`, review the generated publication PR, and let the merge handler set Published.

## Community Data shows an old status

The issue feed updates asynchronously through GitHub Actions. Check the latest Community data feed run and the `community-feed` branch, then refresh the page.

For an installed PWA, use the application's update prompt when a new cached runtime version exists.

## The PWA still shows an old app version

When a runtime/static change includes a service-worker cache bump, installed clients may keep the old cache until the new worker installs and activates.

Use **Update now** when the app offers it, or close/reopen the installed app and refresh after the deployment completes.

## GitHub Wiki did not update

Check the **Sync GitHub Wiki** workflow.

The maintained Wiki source is under `wiki/`. If the Wiki has never been initialized and GitHub rejects the first Git push, create the initial Home page once from the repository's Wiki tab, then rerun the workflow. After initialization, normal Wiki changes should come from `wiki/` through PRs rather than direct Wiki edits.

## Backup is behind main

Check `.github/workflows/backup.yml` runs. The backup workflow only performs fast-forward updates; it intentionally does not force-push divergent history.

Avoid manual commits to `backup`.
