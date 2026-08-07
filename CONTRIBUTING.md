# Contributing to TGM Companion

Thank you for helping improve TGM Companion.

## Development setup

TGM Companion is a static Progressive Web App. No build step is required.

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. Do not open the HTML files through `file://`, because service workers require HTTP or HTTPS.

For the automated tests, use Node.js 22 or a compatible current Node.js version:

```bash
npm test
```

## Workflow

1. Create a branch from `main`.
2. Keep the change focused on one feature, fix, or maintenance task.
3. Add or update tests for calculator and PWA behavior where applicable.
4. Test Dashboard, Building Star-Ups, and Investments.
5. Test at desktop and mobile widths.
6. Test the installed/offline experience when changing cached files.
7. Open a pull request using the repository template.

Recommended branch names:

- `feat/short-description`
- `fix/short-description`
- `docs/short-description`
- `chore/short-description`

Recommended commit prefixes:

- `feat:` new functionality
- `fix:` bug fix
- `docs:` documentation only
- `style:` visual changes without logic changes
- `refactor:` internal restructuring
- `test:` test changes
- `chore:` maintenance and repository work

## Data and calculation logic

The building and investment datasets directly affect calculator accuracy.

Changes to datasets, dependency handling, row mapping, resource calculations, or upgrade ordering should include:

- The source or reason for the change
- A reproducible input
- The expected output
- A test when practical

Do not replace exact source data with estimates.

## User interface changes

Keep the established TGM layout and original game ordering unless the change explicitly intends to alter them. Include screenshots for visible changes and check both themes where relevant.

## PWA checks

When changing the application shell or static files:

- Update `CACHE_VERSION` in `sw.js` when installed clients must receive a new cache
- Keep `APP_SHELL` aligned with files required offline
- Confirm `manifest.webmanifest` loads without errors
- Confirm the service worker installs and activates
- Test a reload while offline
- Keep paths compatible with GitHub Pages under `/tgm-companion/`

## Pull requests

A pull request should explain:

- What changed
- Why it changed
- How it was tested
- Screenshots for visible interface changes
- Any impact on stored browser data, imports/exports, or offline caches

By contributing, you agree that your contribution is licensed under the repository's MIT License.
