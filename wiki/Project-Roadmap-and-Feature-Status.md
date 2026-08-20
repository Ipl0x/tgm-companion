# Project Roadmap & Feature Status

This page is a maintainer-facing snapshot of feature maturity. It is not a promise of release dates.

Update it when a feature materially changes state.

## Status legend

- ✅ Maintained — established feature with normal maintenance.
- 🟡 Partial / expanding — usable but content/coverage is still growing.
- 🚧 WIP — intentionally incomplete; do not represent it as complete.
- 📋 Planned — documented direction, not implemented.

## Current areas

| Area | Status | Notes |
| --- | --- | --- |
| Dashboard | ✅ Maintained | Combined progress, planner shortcuts, central backup/restore |
| Building Star-Ups | ✅ Maintained | Calculation/planning with preserved game ordering and local progress |
| Investments | ✅ Maintained | Category/tree planning, dependencies, resource/time calculations |
| Freight Truck investments | 🚧 WIP | Some investments/levels have verified data; category remains incomplete |
| In-app player Wiki | 🟡 Partial / expanding | Searchable player help exists; additional sections/content can grow |
| Community Data page | ✅ Maintained | Live generated issue feed, filters/status workflow |
| Community review lifecycle | ✅ Maintained | Needs review → Cross-checking → Verified candidate → Approved → Published |
| Controlled publication PRs | ✅ Maintained | Approved issues generate publication branches/PRs |
| GitHub maintainer Wiki | ✅ Maintained | Source under `wiki/`, automatically synchronized |
| PWA/offline support | ✅ Maintained | Service worker/app-shell/update behavior |
| Browser backup/restore | ✅ Maintained | Versioned allowlisted local-storage backup |

## Freight Truck rule

Freight Truck remains WIP until the category has enough complete source data for maintained aggregate behavior.

Do not change the status to complete because one investment is complete. Individual investments can have complete known levels while the category remains under construction.

## In-app Wiki direction

The in-app Wiki is player-facing and should focus on game/planner guidance. It is separate from this GitHub Wiki, which documents maintenance and contribution processes.

New player Wiki content should be evidence/reviewed where it makes factual claims.

## Community Data direction

The review system is intentionally conservative:

- issues are source material;
- matching reports improve confidence;
- maintainer approval prepares publication;
- merge makes the data maintained/published.

Potential future enhancements should preserve this separation instead of automatically trusting crowd data.

## How to update this page

When a feature state changes:

1. update the status row/notes;
2. link a dedicated Wiki page if the area becomes complex;
3. update `CHANGELOG.md` when the state change is notable;
4. avoid speculative dates unless a maintainer has actually committed to them.

## Roadmap principle

Prefer small, verifiable improvements over marking large areas “done” before their data, tests, and maintenance process are actually complete.
