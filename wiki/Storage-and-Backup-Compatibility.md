# Storage & Backup Compatibility

TGM Companion stores planner state in browser `localStorage`. Changing storage formats can affect existing users even when the visible UI still works.

## Central backup contract

`src/shared/backup.js` currently defines:

```text
format:  tgm-companion-browser-backup
version: 1
```

The backup allowlist currently includes:

```text
tgm-star-up-enhanced-v2
tgm.buildings
tgm-star-up-presets-v1
tgm.investments
investments_data
tgm-investment-options-v1
tgm-investment-ui-v1
tgm-theme
```

The central backup intentionally exports/restores only allowlisted app keys.

## Why the allowlist matters

Do not change backup behavior to dump all browser storage. The allowlist:

- keeps unrelated site/browser data out;
- makes the backup format predictable;
- lets validation reject unexpected value types;
- preserves a controlled compatibility contract.

## Adding a new persistent key

When a new feature stores important user progress/settings:

1. decide whether it should survive central backup/restore;
2. if yes, add it deliberately to `BACKUP_KEYS`;
3. add/update tests;
4. verify export and restore;
5. consider older backups where the key does not exist.

The current validator allows known keys to be absent, which helps older backups remain restorable.

## Changing an existing key/schema

Avoid renaming a key just for cleanup.

Before changing:

- identify legacy readers/writers;
- determine whether existing browser data needs migration;
- maintain compatibility with old imports/backups where practical;
- test users who already have progress.

A new format that cannot safely read old data should use an explicit version/migration strategy rather than silently misinterpreting it.

## Legacy compatibility

Some current keys intentionally coexist with legacy formats, for example:

- `tgm.buildings`;
- `investments_data`.

Do not remove compatibility until the project deliberately decides old user data no longer needs support and the migration consequences are documented.

## Restore behavior

Restore validates the backup before writing allowlisted values. `null` removes a known key; string values are restored.

Maintainers should preserve the validate-before-restore property.

## Testing storage changes

At minimum test:

- fresh browser/no saved data;
- existing current-format data;
- central backup export;
- restore into a clean storage area;
- older backup missing a newly introduced key;
- malformed backup rejection.

## PWA updates are separate

Service-worker cache versions and localStorage schemas are different systems. Bumping `CACHE_VERSION` does not migrate stored planner data.

If a release changes both cached code and storage format, test both update paths deliberately.
