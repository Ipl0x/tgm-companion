# Publishing Approved Data

`status:approved` does not write directly to protected `main`. It starts a controlled publication process.

## What automation creates

For approved issue `#42`, the workflow creates or refreshes:

```text
community/issue-42-approved
```

and exports the normalized source record to:

```text
data/community/approved/issue-42.json
```

It then opens a pull request similar to:

```text
Publish approved community submission #42
```

CI is also started for the publication branch.

## The generated PR is only the publication container

The automatically generated JSON record preserves the approved source submission, but that alone may not change what players see in TGM Companion.

Before merging, add the real maintained integration to the same publication branch when required.

Examples:

- Investment submission → update the relevant investment dataset/registration and regression tests.
- Star-Up submission → update the maintained Star-Up data and tests where appropriate.
- Wiki correction → update the in-app Wiki source/content.

Do not create a second unrelated PR for the same publication when the maintained integration belongs with the approved source record.

## Review before merge

Check that:

- the approved JSON record matches the source issue;
- exact source values are preserved;
- the correct category/item/level is targeted;
- Original Time is the source/base value where applicable;
- prerequisites are evidence-backed;
- `0` and unknown values are not confused;
- required application-data or Wiki changes are included;
- existing ordering and behavior are preserved;
- tests cover the maintained change where practical;
- required CI/checks are green;
- no unrelated files are included.

## CI behavior

Publication PRs are created by `github-actions[bot]`. Because PRs created with the repository `GITHUB_TOKEN` do not always trigger the normal pull-request workflow as a fully runnable check, the Community review workflow explicitly dispatches `test.yml` on the generated branch as well.

Review the Actions results before merging. Do not merge with required checks incomplete.

## Merge means Published

After a publication PR from a branch matching:

```text
community/issue-<number>-approved
```

is merged, automation:

1. removes the previous Community Data status;
2. adds `status:published`;
3. closes the source issue as completed;
4. comments on the source issue with the publication PR.

`status:published` is therefore proof that the controlled publication PR actually reached the maintained repository.

## Do not bypass publication

Do not manually add `status:published`, and do not directly write approved community data to `main`. The review trail, approved source record, tests, PR, and merge are part of the integrity model.
