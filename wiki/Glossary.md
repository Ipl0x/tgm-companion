# Terminology & Glossary

## Approved / `status:approved`

A maintainer-controlled Community Data state meaning the submission passed final review and may enter publication preparation. It is not yet maintained/published data.

## App shell

Files precached by the service worker for offline-capable application loading. Defined by `APP_SHELL` in `sw.js`.

## Backup branch

`backup`, the automation-maintained mirror of `main`. It is not the Pages source.

## Base / Original Time

The unbuffed game Investment time. It excludes player Investment Buff, VIP, Family Helps, and other speed modifiers.

## Community Data

Player-submitted Investment, Star-Up, or Wiki source material shown on the Community Data review page.

## Community feed

Generated JSON snapshot published on `community-feed` and read by the Community Data page.

## Cross-checking / `status:cross-checking`

Review state where a maintainer is actively comparing a submission with screenshots, independent reports, or maintained overlapping data.

## Data complete

A deliberate indication that all required source levels/data for a specific maintained definition are known. It must not be inferred from partial coverage.

## Evidence

Source material used to verify a submission, such as in-game screenshots or independent matching reports.

## Family Help

A player/game mechanic that can reduce effective Investment time. It must not be folded into Original Time source data.

## Freight Truck

An Investment category currently maintained as WIP because category data is incomplete even though some individual investments have complete known levels.

## GitHub Wiki

The maintainer/contributor documentation rendered in GitHub. Its source of truth is the `wiki/` directory on `main`.

## Known level

A level for which the project has source-backed data. A known level can exist inside an otherwise incomplete investment/category.

## Maintained data

Game/planner/Wiki data actually merged into the maintained application source on `main`.

## Needs review / `status:needs-review`

Default status for newly recognized community submissions.

## PWA

Progressive Web App. TGM Companion uses a web manifest and service worker for installation/offline behavior.

## Publication branch

`community/issue-<number>-approved`, prepared after maintainer approval.

## Publication PR

Controlled pull request from the publication branch to `main`. Its merge is the event that allows automation to mark the source submission Published.

## Published / `status:published`

System-owned terminal status meaning the controlled publication PR was merged into the maintained repository.

## Rejected / `status:rejected`

Terminal review status for a submission that should not continue through publication.

## Source record

Normalized JSON under `data/community/approved/` created from an approved issue. It preserves the reviewed submission but does not replace the real app dataset integration.

## Star-Up

Building Star-Up upgrade/planning data and the corresponding TGM Companion planner.

## Unknown

A value that is missing, unreadable, or not source-confirmed. It is not the same as `0`.

## Verified candidate / `status:verified-candidate`

A reviewed submission whose evidence is consistent and which is ready for final maintainer approval.

## WIP / Under construction

Intentional incomplete state. The UI/data model should expose known source data without fabricating the missing remainder.
