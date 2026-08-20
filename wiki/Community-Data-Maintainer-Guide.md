# Community Data Maintainer Guide

This page is the quick operational guide for maintainers handling structured community submissions.

The canonical detailed version is maintained in `docs/COMMUNITY_DATA_REVIEW.md` in the main repository.

## Review flow

```text
Submitted
   ↓
Needs review
   ↓
Cross-checking
   ↓
Verified candidate
   ↓
Maintainer approved
   ↓
Publication pull request
   ↓
Published
```

`Rejected` is the terminal state for a submission that should not continue.

## 1. New issue

Supported submission titles begin with:

- `[Data][Investment]:`
- `[Data][Star-Up]:`
- `[Wiki]:`

The automation recognizes these issues and assigns `status:needs-review` when no later review state is present.

At this point, the report is **source material only**.

## 2. Initial maintainer review

Open the issue and check that:

- the submitted item/category is understandable;
- the level is clear where applicable;
- the evidence belongs to the submitted item;
- values are readable;
- an Investment time is the original/base game time, not a player-reduced time;
- prerequisites are supported rather than guessed.

When there is enough information to investigate, add:

```text
status:cross-checking
```

The workflow removes the previous review-status label automatically.

## 3. Cross-check

Compare the report against the strongest available evidence:

- in-game screenshots;
- another independent submission for the same item and level;
- multiple screenshots that together show all fields;
- maintained TGM Companion data where values overlap.

Do not extrapolate missing values from a pattern. `0` is only valid when the source confirms zero; missing or unreadable values remain unknown.

When the evidence is consistent, add:

```text
status:verified-candidate
```

## 4. Final approval

Before approval, confirm the exact item, level, values, Original Time, prerequisites, zero/unknown handling, and evidence.

Then add:

```text
status:approved
```

Do **not** add `status:published` manually.

## 5. Publication PR

Approval causes automation to prepare:

```text
community/issue-<number>-approved
```

and:

```text
data/community/approved/issue-<number>.json
```

It then opens a controlled publication PR to `main` and starts CI.

The generated PR is not automatically ready to merge. If the submission should change an Investment dataset, Star-Up data, Wiki content, tests, or another maintained feature, add those real changes to the same publication branch first.

## 6. Merge = Published

Only merge after the source record and maintained app/Wiki changes are correct and required checks are green.

After merge, automation sets:

```text
status:published
```

closes the source issue as completed, and comments with the publication PR.

## Rejection

Use `status:rejected` when evidence is incorrect, unusable, fabricated, irrecoverably incomplete, or a duplicate that adds no useful evidence. Leave a short explanation when practical.

## Quick checklist

1. Read the full issue.
2. Inspect evidence.
3. Confirm item and level.
4. Confirm Original Time for Investments.
5. Add `status:cross-checking`.
6. Compare exact values and independent evidence.
7. Add `status:verified-candidate` when consistent.
8. Perform final review.
9. Add `status:approved` only when ready.
10. Review the generated publication PR.
11. Add the actual maintained dataset/Wiki change when required.
12. Wait for CI.
13. Merge only when correct.
14. Let automation mark the issue Published.
