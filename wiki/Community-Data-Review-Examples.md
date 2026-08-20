# Community Data Review Examples

These examples show how to apply the Community Data review lifecycle consistently.

The examples are illustrative. They do not create new official game values.

## Example 1 — Good Investment submission

A player submits:

- correct Investment category/name;
- exact level;
- Original Time;
- all visible resource values;
- clear screenshot showing the same level.

Maintainer process:

1. Keep it `status:needs-review` while reading the report.
2. Confirm the time is the base/unbuffed game time.
3. Add `status:cross-checking`.
4. Compare screenshot values field by field.
5. Check another independent report when available.
6. Add `status:verified-candidate`.
7. Final maintainer review.
8. Add `status:approved`.
9. Review the generated publication PR and add the maintained dataset update.
10. Merge only with green CI.

After merge, automation applies `status:published`.

## Example 2 — Buffed Investment time

The screenshot shows a player-reduced timer caused by Investment Buff/VIP/Family Helps, but the submission reports it as Original Time.

Do not approve it.

Action:

- keep at `needs-review` or `cross-checking`;
- ask for the base/original game time;
- do not reverse-calculate or estimate the original value.

If the correct value cannot be provided and the field is required for the intended data update, the submission should not advance.

## Example 3 — `0` versus Unknown

Report A says:

```text
Oil: 0
Gold: unknown
```

If the screenshot clearly shows Oil is zero but does not show Gold, preserve exactly that distinction:

```text
Oil = 0
Gold = Unknown
```

Do not convert missing/unreadable values to zero.

## Example 4 — Conflicting reports

Two independent reports for the same item/level disagree on Cash.

Do not select the value that “looks more likely.”

Keep the submission at `status:cross-checking` and investigate:

- screenshots;
- exact level;
- whether one image shows a different investment;
- whether one report used a different game state/version;
- transcription mistakes.

Only advance once the conflict is resolved/documented.

## Example 5 — Duplicate report that adds evidence

A second player submits the same values with a separate clear screenshot.

This is useful cross-verification. It may strengthen a candidate, but it does not automatically approve either issue.

A maintainer still checks both sources and decides whether to advance the relevant record(s).

## Example 6 — Duplicate report with no new evidence

A copied submission that adds no independent source may be treated as a duplicate rather than additional verification.

Do not count copied reports as independent matching evidence.

## Example 7 — Missing prerequisite

The resource values are clear, but the prerequisite is not visible.

Do not infer prerequisite progression from nearby levels. Preserve the prerequisite as unknown/unconfirmed until evidence exists.

## Example 8 — Wiki correction

A contributor reports that an in-app Wiki statement is wrong and provides evidence.

Review the factual correction through the same status lifecycle. After approval, the publication PR should include the actual maintained `wiki.html`/Wiki source change that affects players, not only the normalized approved record.

## Example 9 — Rejecting

Use `status:rejected` when evidence is clearly unusable or incorrect, for example:

- wrong level/item screenshot;
- fabricated values;
- unrecoverable required information;
- submission conflicts with clear evidence and cannot be corrected.

Leave a short comment explaining why when useful.

## Rule to remember

Matching reports increase confidence. They do not replace maintainer review. Community data becomes maintained TGM Companion data only after the controlled publication PR containing the real integration is reviewed and merged.
