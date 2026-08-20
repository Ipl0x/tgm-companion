# Issue & Label Workflow

Community review status is controlled with GitHub issue labels. Only one review-status label should be active at a time; the Community review workflow normalizes the status and removes the previous review label when the issue advances.

## Status labels

| Label | Meaning | Set by |
| --- | --- | --- |
| `status:needs-review` | New source material awaiting review | Automation/default |
| `status:cross-checking` | Evidence is being compared | Maintainer |
| `status:verified-candidate` | Evidence appears consistent and is ready for final approval | Maintainer |
| `status:approved` | Maintainer approved publication preparation | Maintainer |
| `status:published` | Publication PR was merged into the maintained repository | Automation after merge only |
| `status:rejected` | Submission will not continue | Maintainer |

## Normal progression

```text
status:needs-review
        ↓
status:cross-checking
        ↓
status:verified-candidate
        ↓
status:approved
        ↓
publication PR merged
        ↓
status:published
```

You do not need to remove the old status manually before adding the next one. The workflow handles that normalization.

## Needs review

Use this while the report still needs an initial check, clarification, or missing evidence. Do not advance just to keep the queue moving.

## Cross-checking

Use this when a maintainer is actively comparing the submitted values against screenshots, other independent reports, or overlapping maintained data.

Cross-checking does not mean confirmed.

## Verified candidate

Use this after the evidence is internally consistent and important conflicts are resolved. This status is still not publication approval.

## Approved

`status:approved` is the maintainer-controlled publication gate. It triggers creation or refresh of the controlled publication branch and PR.

Only use it when the source record is suitable to prepare for maintained integration.

## Published is system-owned

Never use `status:published` as a manual shortcut. The workflow guards this status. A manual attempt is treated as approval instead, so the controlled publication path is still required.

Published means the related publication PR was actually merged.

## Rejected

Use `status:rejected` for reports that are incorrect, unusable, fabricated, irrecoverably incomplete, or duplicates that add no useful evidence.

Where possible, leave an issue comment explaining what was wrong or what corrected evidence would be needed.

## Legacy label handling

The workflow also recognizes the older `status:verified` label and normalizes it to `status:verified-candidate`.

## Supported submission issue types

The automated review flow recognizes structured issues with titles beginning with:

```text
[Data][Investment]:
[Data][Star-Up]:
[Wiki]:
```

Unrelated normal repository issues should not be moved through this Community Data lifecycle.
