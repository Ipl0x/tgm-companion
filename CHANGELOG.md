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
- Verified Freight Truck level 1 data for Extra Run and Ultimate Protection, including Cash, Arms, Cargo, Metal, Diamonds, Oil, Crypto Coins, Family Currency, Family Insignia, Influence, and their known prerequisites; both investments have max level 1, while Gold and aggregate calculations remain marked as incomplete
- Complete Freight Truck `Basic Resource` source data for levels 1–5, including original unbuffed time, all resource costs, Gold, Influence, and max level 5; the Details panel can browse all five known levels while the rest of Freight Truck remains under construction
- Complete Freight Truck `Hijack Boost` source data for levels 1–10, including original unbuffed time, all resource costs, Gold, Influence, `Basic Resource Lv. 1` for level 1, and `Basic Resource Lv. 5` for level 10
- Dedicated Investment and Star-Up data submission issue forms with screenshot evidence and cross-verification guidance; Investment submissions explicitly require the original unbuffed game time rather than a player-adjusted investment time
- Footer `Submit data` menu with direct choices for Investment data and Star-Up data submissions
- In-app TGM Wiki with searchable `Getting Started` and `Tips & Tricks` sections covering planner basics, Original Time, prerequisites, data-quality states, backups, resource planning, and community verification guidance

### Changed

- Replaced visible internal building IDs on Star-Up cards with a user-facing current-stars label
- Simplified community data submission forms into compact GitHub Issue Forms with grouped data entry and dedicated screenshot uploads
- Replaced grouped Investment resource and Star-Up cost textareas with individually labeled fields so field names remain visible while contributors enter values; all example placeholders are explicitly quoted as YAML strings
- Investment data submissions now collect investment prerequisites only and explicitly exclude building requirements
- Freight Truck known Gold values are displayed without a `~` prefix
- Added the Wiki to the primary navigation and shared footer, with responsive horizontal navigation on smaller screens and offline/PWA caching for the Wiki page, styles, and search controller

### Fixed

- Investment and Star-Up data submission links opening GitHub's blank issue editor instead of rendering the intended structured forms
- Removed the incorrect `Investment Center Lv. 10` prerequisite from Freight Truck `Ultimate Protection`; its known prerequisite is now only `Extra Run Lv. 1`

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
