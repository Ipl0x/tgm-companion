# Dataset Maintenance Guide

This guide describes how maintainers should move verified game data into maintained TGM Companion source.

Read [Data Conventions](Data-Conventions) first.

## General rules

- Preserve exact source values.
- Never invent missing levels.
- Never extrapolate progression.
- Keep `0` distinct from Unknown.
- Keep original/base Investment time distinct from player-adjusted time.
- Preserve game ordering unless an intentional UI/data-order change is being made.
- Add/update tests when data affects calculations or dependency resolution.

## Building Star-Ups

Building data and logic live under `src/buildings/` with related data loading/tests elsewhere in the project.

When changing Star-Up data:

1. Verify the exact building and star level.
2. Preserve prerequisite relationships.
3. Confirm Family Currency/Family Insignia and other required values.
4. Test recursive prerequisite calculations.
5. Verify existing progress/import behavior is unchanged.

Do not rename/reorder buildings casually because UI, imports, and stored progress may depend on stable identifiers/order.

## Investments

Investment calculation logic lives under `src/investments/`.

For maintained investment records, verify:

- category;
- investment identity;
- level;
- resource values;
- Original Time;
- Influence;
- prerequisites;
- max level where known.

Dependency/prerequisite changes deserve regression tests because they affect recursive totals.

## Freight Truck / construction data

Freight Truck is intentionally handled as WIP where source data is incomplete.

Known WIP definitions are maintained in:

```text
src/investments/construction.js
```

Known-level UI behavior is handled in:

```text
src/app/freight-truck-known-data.js
```

Rules for WIP data:

- register only levels that have source data;
- do not fabricate intermediate levels;
- a single confirmed level does not make the whole investment complete;
- `dataComplete: true` is appropriate only when all levels required for that investment are actually known/represented;
- a category can remain under construction even when one or more investments are complete;
- aggregate totals should stay disabled while the category does not have enough complete data.

## Prerequisites

Record only prerequisites supported by evidence.

Do not assume that because Lv. 1 requires something, every later level has the same prerequisite. Likewise, do not infer a prerequisite from a visual tree connection without confirming how the maintained model should represent it.

## From community issue to dataset

The preferred path is:

```text
Issue
→ Cross-checking
→ Verified candidate
→ Approved
→ generated publication branch/PR
→ add maintained dataset change + tests
→ merge
→ Published
```

The normalized approved JSON file is an audit/source record. It does not replace the actual calculator/Wiki data integration.

## Testing data changes

Run:

```bash
npm test
```

Add targeted tests for:

- new known level;
- corrected resources/time/influence;
- prerequisite behavior;
- max-level/completeness behavior;
- totals changed by the record.

## Changelog

Notable verified/corrected datasets should be recorded in `CHANGELOG.md`, especially when players will see newly available levels or corrected totals.

## Final review

Before merge, compare the code representation back to the original evidence one final time. A transcription error introduced during implementation is still a data error even if the community issue itself was correct.
