# TGM Companion

TGM Companion is an installable, offline-capable planning toolkit for **The Grand Mafia**. It combines building star-up calculations, investment-tree planning, and locally saved progress in one responsive Progressive Web App.

**Live application:** https://ipl0x.github.io/tgm-companion/

## Features

### Dashboard

- Combined building and investment progress
- Current building target and saved preset count
- Continue-planning shortcuts
- Shared responsive light and dark interface

### Building Star-Up Planner

- Uses the supplied building star-up dataset
- Preserves the original in-game building order
- Resolves prerequisite buildings recursively
- Calculates Family Currency and Family Insignia
- Skips requirements already completed
- Supports live calculation, filtering, search, presets, import/export, sharing, CSV, and copyable results

### Investment Planner

- Uses the supplied investment records and row-ID map
- Preserves the original category and tree layout
- Tracks completed levels for every investment
- Calculates direct and recursive dependencies
- Calculates resources, adjusted research time, diamonds, and influence
- Supports investment buff, Family Helps, VIP level, category reset, category max, calculate all, import/export, and sharing

## Progressive Web App

TGM Companion can be installed on supported desktop and mobile browsers. After the first successful load, the application pages, calculator modules, icons, and compressed datasets remain available offline.

The PWA is implemented with:

- `manifest.webmanifest` — app identity, scope, icons, and shortcuts
- `sw.js` — offline cache, navigation fallback, and update lifecycle
- `src/app/pwa.js` — install prompt and update interface
- `assets/icons/` — standard and maskable SVG icons

Planner progress is stored in browser `localStorage`. The project has no backend, login system, analytics service, or cloud database.

## Run locally

A service worker requires HTTP or HTTPS. Do not open the HTML files directly through `file://`.

```bash
python -m http.server 8080
```

Open:

```text
http://localhost:8080
```

## Tests

Node.js 22 is used in GitHub Actions.

```bash
npm test
```

The test suite checks:

- Building calculation reference results
- Investment row mapping and dependency totals
- PWA manifest metadata
- Service-worker app-shell files
- JavaScript syntax for the PWA controller

## Deployment

GitHub Pages publishes directly from the `main` branch and repository root. There is no build step.

Important deployment files:

- `.nojekyll` keeps the static file structure unchanged
- Relative paths keep the app compatible with `/tgm-companion/`
- `.github/workflows/test.yml` validates each push and pull request

## Backups

The `backup` branch is maintained automatically by `.github/workflows/backup.yml`.

- It is synchronized immediately after every push to `main`.
- It is checked again every 12 hours.
- Updates are fast-forward-only; the workflow never force-pushes backup history.
- The first successful backup run removes obsolete development branches.
- `backup` is not used as the GitHub Pages deployment source and should not receive manual commits.

## Project structure

```text
.
├── index.html                         Dashboard
├── star-ups.html                      Building Star-Up Planner
├── investments.html                   Investment Planner
├── manifest.webmanifest               PWA manifest
├── sw.js                              Service worker
├── assets/
│   ├── data/                          Gzip/base64 calculator datasets
│   └── icons/                         PWA icons
├── css/                               Shared and page-specific styles
├── src/
│   ├── app/                           Browser controllers and PWA logic
│   ├── buildings/                     Building catalog and calculation engine
│   ├── investments/                   Investment calculation engine
│   ├── data/                          Browser and Node data loaders
│   └── shared/                        Formatting and local storage helpers
├── tests/                             Node test suite
└── .github/                           CI, backup automation, and templates
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a change. Calculator or dataset changes should include a reproducible input and expected output.

## Versioning

Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md). The current release is **0.2.0**.

## Security

See [SECURITY.md](SECURITY.md) for responsible vulnerability reporting.

## License

Released under the [MIT License](LICENSE).

## Disclaimer

TGM Companion is a fan-made community tool and is not affiliated with or endorsed by the game publisher. Game names, terminology, and related intellectual property belong to their respective owners.
