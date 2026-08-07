# Security Policy

## Supported versions

TGM Companion is currently in early development. Security and correctness fixes are applied to the latest version on the `main` branch.

| Version | Supported |
| --- | --- |
| `main` / latest release | Yes |
| Older releases | No |

## Reporting a vulnerability

Do not publish sensitive security details in a public issue.

Report a suspected vulnerability privately to the repository owner through GitHub. Include:

- A clear description of the issue
- Steps to reproduce it
- The affected page or file
- The browser and operating system used
- Potential impact
- Any suggested fix

Please allow reasonable time to investigate before disclosing the issue publicly.

## Security model

TGM Companion is a static client-side application:

- It has no backend or account system
- It does not upload planner progress to a server
- Planner progress and preferences are stored in browser `localStorage`
- Imported JSON files are processed in the browser
- The service worker only caches same-origin application files

Users should still avoid importing planner files from untrusted sources and should keep their browser up to date.
