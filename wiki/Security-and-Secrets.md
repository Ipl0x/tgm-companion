# Security & Secrets

TGM Companion is a public static client-side application. Its security model is intentionally simple: no application backend, no player account system, and planner data stored in browser `localStorage`.

The canonical vulnerability-reporting policy is `SECURITY.md`.

## Never put secrets in client code

Everything shipped through GitHub Pages can be inspected by visitors.

Never embed:

- GitHub personal access tokens;
- repository write tokens;
- API secrets intended to remain private;
- private keys;
- passwords;
- private webhook secrets

in HTML, browser JavaScript, CSS, static JSON, or the service worker.

## Why Community Data uses GitHub Actions

The browser does not need repository write credentials.

Community Data uses GitHub Issue Forms and server-side GitHub Actions to:

- read issue data;
- generate the public feed;
- manage review labels;
- prepare publication branches/PRs.

This keeps write-capable credentials out of the deployed PWA.

## `GITHUB_TOKEN`

Workflows use GitHub's scoped `GITHUB_TOKEN` with declared permissions. Keep workflow permissions limited to what each workflow needs.

When adding a workflow:

1. identify required actions;
2. request minimal GitHub permissions;
3. avoid broad write access unless necessary;
4. never print credentials to logs.

## Public issues and sensitive information

Do not ask contributors to post:

- account credentials;
- private authentication tokens;
- personal data unrelated to the submission;
- sensitive vulnerability details.

Security vulnerabilities should be reported privately according to `SECURITY.md`, not as ordinary public issues.

## Untrusted community content

Issue text, titles, and screenshots are untrusted user input.

When rendering community content in the app:

- prefer DOM APIs and `textContent`;
- validate URLs before creating clickable links;
- do not inject issue content through unsafe HTML;
- constrain links to expected GitHub issue locations where applicable.

## Imported backups/data

Browser-imported JSON is also untrusted input.

Validate:

- file structure;
- format/version;
- expected types;
- allowlisted storage keys.

Do not execute imported content.

## Dependency/workflow changes

GitHub Actions references and external actions are supply-chain dependencies. Review changes to action versions/owners carefully.

## Local storage privacy

Planner progress is stored locally. It is not an authentication boundary.

Do not place sensitive credentials into TGM Companion localStorage. Backup files can contain planner state/preferences and should be treated as user data even though they are not server-side accounts.

## Security review checklist

Before merging a security-relevant change:

- no secrets committed;
- no new unsafe HTML injection;
- external URLs validated;
- workflow permissions justified;
- imported/user-supplied data validated;
- service worker remains same-origin focused;
- sensitive reporting guidance still points to `SECURITY.md`.
