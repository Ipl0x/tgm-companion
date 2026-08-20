# Community Data Maintainer Guide

This guide explains what a maintainer should do after a player submits community data through one of the structured GitHub Issue Forms.

The review pipeline is intentionally conservative. A community submission is source material only. It does **not** become official TGM Companion data just because an issue was opened, because multiple players reported the same value, or because the issue has a screenshot.

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

`Rejected` is a terminal review state for submissions that are incorrect, unusable, duplicated without adding evidence, or cannot be verified.

Only one review-status label should be active at a time. The automation removes the previous review-status label when a maintainer moves a submission forward.

## 1. A player submits an issue

Supported structured submissions are:

- `[Data][Investment]: ...`
- `[Data][Star-Up]: ...`
- `[Wiki]: ...`

The issue-sync workflow adds the submission to the Community Data feed. New supported submissions begin as:

```text
status:needs-review
```

At this stage, do **not** treat the submitted values as official data.

### Maintainer checks

Open the issue and check that the submission is understandable and belongs to the correct type.

For an Investment submission, check the submitted fields such as:

- Investment category
- Investment name
- Investment level
- Original/base investment time
- Cash
- Arms
- Cargo
- Metal
- Diamonds
- Oil
- Crypto Coins
- Family Currency
- Family Insignia
- Gold
- Influence
- Investment prerequisites
- Screenshot or other evidence

The Investment time must be the original/base game time, not a player-specific reduced time caused by Investment Buff, VIP, Family Help, or another speed modifier.

For Star-Up and Wiki submissions, use the same principle: review the structured fields and the supplied evidence before trusting the information.

## 2. Move the issue to Cross-checking

When the submission contains enough information to investigate, add:

```text
status:cross-checking
```

The workflow removes the previous `status:needs-review` label automatically.

Cross-checking means the information is actively being compared with evidence. It does **not** mean the values are confirmed yet.

### What to compare

Use the strongest evidence available, for example:

- A clear in-game screenshot showing the exact level and values
- Another independent player submission for the same item and level
- Multiple screenshots that together show all required fields
- Existing maintained TGM Companion data where the new submission overlaps known values

Do not replace exact source values with estimates, extrapolated progression, or values that merely look plausible.

### Matching multiple reports

If multiple independent submissions report the same item and level, compare the values field by field.

For example:

```text
Freight Truck → Safeguard Boost → Lv. 3

Report A: Cash 1,500,000
Report B: Cash 1,500,000
Report C: Cash 1,500,000
```

Matching reports strengthen the evidence, but the maintainer should still inspect the screenshots/source context before approval.

A value of `0` is different from an unknown value. Only record `0` when the source confirms that zero is the actual requirement. Missing or unreadable information must remain unknown.

## 3. Mark as Verified candidate

When the evidence is consistent and the submission appears correct, add:

```text
status:verified-candidate
```

The workflow removes the previous review-status label automatically.

`Verified candidate` means:

- The submitted values have been reviewed
- Available evidence matches
- Important conflicts have been resolved
- The record is ready for a maintainer's final approval decision

It still does **not** mean the data is part of the maintained application dataset.

## 4. Maintainer approval

A maintainer performs the final review before publication.

Before approving, confirm:

- The correct item/category is identified
- The correct level is identified
- Exact values are preserved
- Original/base time is used where applicable
- Prerequisites are supported by evidence and not guessed
- Confirmed zero values are not confused with missing values
- Screenshots/evidence support the submitted information
- Any conflicting reports have been resolved or documented
- The change is appropriate for the maintained TGM Companion dataset or Wiki

When satisfied, add:

```text
status:approved
```

This is the maintainer-controlled approval point.

Do **not** add `status:published` manually.

## 5. What happens automatically after approval

After `status:approved` is applied, the Community review workflow:

1. Creates or refreshes a branch named:

   ```text
   community/issue-<issue-number>-approved
   ```

2. Exports the normalized approved source record to:

   ```text
   data/community/approved/issue-<issue-number>.json
   ```

3. Opens a pull request to protected `main` with a title similar to:

   ```text
   Publish approved community submission #<issue-number>
   ```

4. Starts CI for the publication branch.

The approval workflow never writes directly to protected `main`.

## 6. Review the publication pull request

The generated publication PR is **not** an automatic merge request.

A maintainer must review it before merge.

The generated PR initially publishes the normalized approved source record. For data that must affect the planner, calculator, Wiki, or another maintained feature, add the required application-data/code change to the same publication branch before merging.

For example, an approved Investment submission may require updating the relevant investment dataset and regression tests before the PR is ready.

### Before merging the PR

Check:

- The approved JSON record matches the source issue
- The actual maintained dataset/Wiki change is included when required
- No unrelated files were changed
- Exact source values are preserved
- Existing ordering and application behavior are preserved
- Tests cover the new maintained data where practical
- Required CI/checks are green

If GitHub shows an Action/CI run that requires manual approval, review the workflow request before allowing it to run. Do not merge while required checks are incomplete.

## 7. Merge = Published

Only merge the publication PR after the maintained change is ready and required checks pass.

After the publication PR is merged, the workflow automatically:

- Removes the previous review-status label
- Adds:

  ```text
  status:published
  ```

- Closes the source issue as completed
- Adds a comment that identifies the publication PR

`Published` therefore means the approved submission actually passed through the maintained repository and was merged.

Do not use `status:published` as a manual review shortcut. The workflow treats Published as a system-owned terminal state.

## Rejecting a submission

Use:

```text
status:rejected
```

when the submission should not continue through the verification pipeline.

Examples include:

- Values conflict with clear evidence
- The screenshot belongs to another level/item
- Required information cannot be recovered
- The submission is fabricated or clearly unreliable
- It is a duplicate that adds no useful evidence
- The contributor submitted a player-buffed time instead of the original/base Investment time and cannot provide the correct value

When practical, leave a short issue comment explaining why it was rejected so the contributor knows what would be needed for a corrected submission.

## If more information is needed

Do not promote a submission just to keep the pipeline moving.

Keep it at `status:needs-review` or `status:cross-checking` and ask the contributor for the missing evidence, such as:

- A clearer screenshot
- The exact investment level
- The original/base time
- A missing resource value
- The prerequisite screen

Once the new information is supplied, continue the normal review flow.

## Status reference

| Status | Meaning | Who/what advances it |
| --- | --- | --- |
| `status:needs-review` | New community source material awaiting review | Automatic/default |
| `status:cross-checking` | Evidence and independent reports are being compared | Maintainer |
| `status:verified-candidate` | Evidence appears consistent and is ready for final approval | Maintainer |
| `status:approved` | Maintainer approved publication preparation | Maintainer |
| `status:published` | Publication PR was merged into the maintained repository | Automation after merge only |
| `status:rejected` | Submission will not continue through publication | Maintainer |

## Quick maintainer checklist

When a new Submit Data issue appears:

1. Read all submitted fields.
2. Check the screenshot/evidence.
3. Confirm the correct item and level.
4. For Investments, confirm the time is the original/base game time.
5. Add `status:cross-checking` when active verification starts.
6. Compare independent reports and exact values.
7. Add `status:verified-candidate` when the evidence is consistent.
8. Perform the final maintainer review.
9. Add `status:approved` only when the record is ready for publication preparation.
10. Review the automatically generated publication PR.
11. Add the real maintained dataset/Wiki integration to that PR when required.
12. Wait for required CI/checks.
13. Merge the PR only when the maintained change is correct.
14. Let automation mark the source issue `status:published` and close it.

The key rule is simple: **community reports are evidence; only a reviewed and merged publication PR makes them maintained TGM Companion data.**
