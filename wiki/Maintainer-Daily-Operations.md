# Maintainer Daily Operations

This page maps common repository events to the maintainer action that should follow.

## A new community data issue appears

For `[Data][Investment]`, `[Data][Star-Up]`, or `[Wiki]` submissions:

1. Read every submitted field.
2. Check screenshots/evidence.
3. Leave the issue at `status:needs-review` if required information is missing.
4. Move it to `status:cross-checking` when active verification starts.
5. Compare values with evidence and independent reports.
6. Move it to `status:verified-candidate` only when evidence is consistent.
7. Perform final review.
8. Add `status:approved` when it is ready for publication preparation.
9. Review the automatically created publication PR.
10. Merge only after the real maintained dataset/Wiki change and CI are ready.

Do not manually apply `status:published`.

Full process: [Community Data Maintainer Guide](Community-Data-Maintainer-Guide).

## A bug issue appears

1. Reproduce the issue if possible.
2. Identify affected page/module.
3. Create `fix/<short-description>` from `main`.
4. Keep the fix focused.
5. Add/update regression tests where practical.
6. Check nearby behavior for regressions.
7. Open a PR and follow the [Pull Request Review Checklist](Pull-Request-Review-Checklist).

For a live regression requiring immediate recovery, see [Rollback & Recovery](Rollback-and-Recovery).

## A feature request appears

1. Confirm the request fits the project.
2. Determine whether it changes UI, calculation logic, stored browser data, PWA assets, or community workflows.
3. Define a narrow first change.
4. Use `feat/<short-description>`.
5. Add tests for functional behavior.
6. Update documentation/changelog when appropriate.
7. Do not mix unrelated cleanup into the same PR.

## A Wiki correction is submitted

A player-facing Wiki correction still uses the Community Data review lifecycle.

Verify the factual/strategy claim, then use the generated publication PR to update the maintained in-app Wiki source where needed. The GitHub maintainer Wiki is separate and is maintained under `wiki/`.

## CI fails on a normal PR

1. Open the failed job.
2. Read the first meaningful error.
3. Fix the feature branch, not `main`.
4. Re-run/let CI run again.
5. Do not merge while required checks fail.

Common checks include `npm test`, JavaScript syntax checks, and required-file validation.

## A publication PR appears

A publication PR means the issue reached maintainer approval. It does not mean the data is automatically ready for production.

Check:

- normalized approved record;
- source issue/evidence;
- actual maintained dataset or Wiki integration;
- tests;
- no unrelated changes;
- CI.

See [Publishing Approved Data](Publishing-Approved-Data).

## Community Data page looks stale

Check in this order:

1. source issue status label;
2. Community review workflow;
3. Community data feed workflow;
4. `community-feed` branch snapshot;
5. browser/PWA cache.

See [Troubleshooting](Troubleshooting).

## A Wiki source PR is merged

Changes under `wiki/` are synchronized to the GitHub Wiki by `wiki.yml`. The repository `wiki/` directory remains the source of truth.

Do not make permanent edits directly in the rendered GitHub Wiki because the next sync can overwrite them.

## End-of-change verification

For meaningful changes, verify what is relevant:

- `main` contains the intended merge;
- `backup` catches up to `main`;
- GitHub Pages serves the expected change;
- PWA update works if cache was bumped;
- Community feed/status changed when applicable;
- GitHub Wiki synchronized when `wiki/` changed.
