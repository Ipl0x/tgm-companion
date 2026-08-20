# Pull Request Review Checklist

Use this checklist before merging a TGM Companion pull request. Not every item applies to every PR, but skipped items should be intentionally not applicable.

## Scope

- [ ] The PR has one clear purpose.
- [ ] No unrelated files or refactors were added.
- [ ] The branch started from a reasonably current `main`.
- [ ] The PR description explains what changed and why.

## Tests and CI

- [ ] Required CI is green.
- [ ] `npm test` passes for code/data changes.
- [ ] JavaScript syntax validation passes.
- [ ] New behavior has a regression test where practical.
- [ ] Existing related tests were not weakened simply to make the PR pass.

## Game data

For Investment or Star-Up changes:

- [ ] Values match source evidence exactly.
- [ ] No guessed/interpolated values were added.
- [ ] `0` is used only when zero is confirmed.
- [ ] Unknown/missing values remain unknown.
- [ ] Original investment time is base/unbuffed time.
- [ ] Prerequisites are evidence-backed.
- [ ] Level/max-level/completeness flags are justified.
- [ ] Existing in-game ordering is preserved unless intentionally changed.

See [Dataset Maintenance Guide](Dataset-Maintenance-Guide).

## Community publication PRs

- [ ] The source issue reached `status:approved`.
- [ ] Approved JSON record matches the issue.
- [ ] Required maintained app/Wiki integration is included.
- [ ] The PR is not merged solely because automation created it.
- [ ] `status:published` will be left to automation after merge.

## User interface

- [ ] Existing TGM visual language/layout is preserved unless the task intentionally changes it.
- [ ] Desktop behavior was checked.
- [ ] Mobile/responsive behavior was checked.
- [ ] Light/dark theme behavior was checked when relevant.
- [ ] Screenshots are included for meaningful visible changes when useful.

## Browser storage and backup

- [ ] Existing `localStorage` users remain compatible.
- [ ] Changed storage keys/formats have a migration or deliberate compatibility plan.
- [ ] Central backup/restore still includes the intended data.
- [ ] Import/export behavior remains compatible where applicable.

See [Storage & Backup Compatibility](Storage-and-Backup-Compatibility).

## PWA

- [ ] Decide whether installed clients need a new cache.
- [ ] If yes, increment `CACHE_VERSION` in `sw.js`.
- [ ] `APP_SHELL` contains any new offline-critical files.
- [ ] Offline/update behavior was considered.

See [PWA & Deployment](PWA-and-Deployment).

## Security

- [ ] No tokens, credentials, or private secrets were committed.
- [ ] Client-side code does not embed GitHub write credentials.
- [ ] Untrusted data is rendered safely.
- [ ] Sensitive vulnerability details are not exposed in public documentation/issues.

See [Security & Secrets](Security-and-Secrets).

## Documentation

- [ ] `CHANGELOG.md` is updated for notable user-facing/maintainer changes.
- [ ] README/Wiki documentation is updated when behavior or process changed.
- [ ] Wiki changes are made under `wiki/`, not only in the rendered GitHub Wiki.

## Merge

- [ ] Required conversations are resolved.
- [ ] Final diff was reviewed after the last push.
- [ ] Required checks are green.
- [ ] The chosen merge method matches repository practice.
- [ ] No direct/manual `status:published` action is being used to bypass publication.
