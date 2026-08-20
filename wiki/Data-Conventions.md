# Data Conventions

TGM Companion treats source accuracy as more important than filling every field.

## Exact values only

Use exact source values when they are available. Do not replace missing data with an estimate, extrapolation, rounded progression, or a value that merely appears likely.

If a source says:

```text
Cash: 4,800,938
```

store `4,800,938`, not an inferred or rounded alternative.

## `0` is not Unknown

These states are intentionally different:

- `0` — confirmed by the source as zero.
- `Unknown` — not supplied, unreadable, or not sufficiently verified.

Never turn missing information into zero simply because other levels use zero.

## Original investment time

Source collection for Investments uses the **original/base game time**.

Do not store a contributor's personally reduced timer caused by:

- Investment Buff
- VIP
- Family Help
- another personal speed modifier

Player-adjusted time can be calculated separately by the app where supported; the source value remains unchanged.

## Prerequisites

Only include prerequisites that are explicitly supported by the evidence. Do not invent prerequisite chains from layout position or progression assumptions.

If only level 1 and level 10 prerequisites are known, that does not justify inventing level 2–9 prerequisites.

## Preserve game ordering

Building and Investment data should preserve the established/original game ordering and tree layout unless a verified source or explicit feature change requires something different.

## Partial data is allowed

An investment/category can have verified source-backed levels while still being incomplete overall.

Use the UI/data model to distinguish:

- complete source data;
- partial source data;
- under-construction/unknown data.

Do not enable aggregate calculations that require data which has not yet been verified.

## Maximum levels

Only mark an item's maximum level as known when that maximum is supported by source information. Do not infer it solely from another investment's shape or progression.

## Community reports vs maintained data

A Community Data issue, even with screenshots or matching reports, is not automatically part of the maintained dataset.

The source must pass the controlled review lifecycle and publication PR before it becomes maintained data.

## Regression tests

When practical, tests for newly maintained data should verify exact values, maximum levels, known prerequisites, zero/unknown behavior, and any special UI state that depends on completeness.
