# Changelog

All notable changes to TGM Companion are documented in this file.

The project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Automated `backup` branch synchronized after every `main` push and every 12 hours
- One-time automated cleanup of obsolete development branches
- Shared responsive footer with links to the source repository, issues, contribution guide, and changelog
- Dashboard overview with completed levels and percentage progress for every investment category
- Central dashboard backup and restore for all Star-Ups, Investments, presets, planner settings, and theme data
- Freight Truck investment preview between Kingpins and Advanced Defenses, with all currently known investment names and under-construction details while resource data is incomplete
- Verified Freight Truck level 1 data for Extra Run and Ultimate Protection, including Cash, Arms, Cargo, Metal, Diamonds, and their known prerequisites; unavailable fields and aggregate calculations remain marked as incomplete

### Changed

- Replaced visible internal building IDs on Star-Up cards with a user-facing current-stars label

## [0.2.0] - 2026-08-07

### Added

- Restored installable Progressive Web App support with manifest, fixed-size icons, offline caching, install controls, and update notifications
- Dashboard with combined building and investment progress
- Building presets, search, filters, import/export, sharing, CSV, and copyable results
- Investment category reset, max, and calculate-all controls
- PWA and offline-cache tests
- `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, repository templates, and maintained changelog

### Changed

- Restored the original visual layout for Dashboard, Building Star-Ups, and Investments while retaining the rewritten JavaScript architecture
- Restored the original building order beginning with Mansion and Family Council
- Restored the compact original investment-tree layout and category order
- Kept compatibility with progress stored by earlier versions
- Consolidated repository validation into one CI workflow
- Rewrote the project documentation to match the current architecture and GitHub Pages setup

### Removed

- Unused first-rewrite page controllers, calculation engines, catalog, shell, styles, export entry point, data-generation script, and obsolete test
- Duplicate custom GitHub Pages deployment workflow
- Duplicate validation workflow

## [0.1.0] - 2026-08-05

### Added

- Initial static rewrite
- Building calculation engine and compressed building dataset
- Investment calculation engine, compressed records, and row-ID mapping
- Dashboard, Building Star-Up Planner, and Investment Planner foundations
- Local browser persistence
- Node reference tests
- GitHub Pages branch deployment
