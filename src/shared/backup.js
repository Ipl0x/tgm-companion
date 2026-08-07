export const BACKUP_FORMAT = 'tgm-companion-browser-backup';
export const BACKUP_VERSION = 1;

export const BACKUP_KEYS = Object.freeze([
  'tgm-star-up-enhanced-v2',
  'tgm.buildings',
  'tgm-star-up-presets-v1',
  'tgm.investments',
  'investments_data',
  'tgm-investment-options-v1',
  'tgm-investment-ui-v1',
  'tgm-theme'
]);

function isStorage(value) {
  return value
    && typeof value.getItem === 'function'
    && typeof value.setItem === 'function'
    && typeof value.removeItem === 'function';
}

export function createBackup(storage, exportedAt = new Date()) {
  if (!isStorage(storage)) throw new TypeError('A browser storage implementation is required.');

  const values = {};
  for (const key of BACKUP_KEYS) values[key] = storage.getItem(key);

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: exportedAt.toISOString(),
    storage: values
  };
}

export function validateBackup(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('This is not a valid TGM Companion backup.');
  }
  if (value.format !== BACKUP_FORMAT || value.version !== BACKUP_VERSION) {
    throw new Error('This backup format is not supported.');
  }
  if (!value.storage || typeof value.storage !== 'object' || Array.isArray(value.storage)) {
    throw new Error('The backup does not contain browser data.');
  }

  for (const key of BACKUP_KEYS) {
    if (!Object.hasOwn(value.storage, key)) continue;
    const storedValue = value.storage[key];
    if (storedValue !== null && typeof storedValue !== 'string') {
      throw new Error(`The backup contains an invalid value for ${key}.`);
    }
  }

  return value;
}

export function restoreBackup(value, storage) {
  if (!isStorage(storage)) throw new TypeError('A browser storage implementation is required.');
  const backup = validateBackup(value);
  let restored = 0;

  for (const key of BACKUP_KEYS) {
    if (!Object.hasOwn(backup.storage, key)) continue;
    const storedValue = backup.storage[key];
    if (storedValue === null) storage.removeItem(key);
    else storage.setItem(key, storedValue);
    restored += 1;
  }

  return restored;
}

export function backupFilename(exportedAt = new Date()) {
  const date = exportedAt.toISOString().slice(0, 10);
  return `tgm-companion-backup-${date}.json`;
}
