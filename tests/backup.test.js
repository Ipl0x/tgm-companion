import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BACKUP_FORMAT,
  BACKUP_KEYS,
  BACKUP_VERSION,
  backupFilename,
  createBackup,
  restoreBackup,
  validateBackup
} from '../src/shared/backup.js';

class MemoryStorage {
  constructor(values = {}) {
    this.values = new Map(Object.entries(values));
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test('complete backup captures every supported TGM storage key', () => {
  const storage = new MemoryStorage({
    'tgm-star-up-enhanced-v2': '{"target":"27"}',
    'tgm.investments': '{"1":5}',
    'tgm-theme': 'light'
  });
  const exportedAt = new Date('2026-08-07T02:00:00.000Z');
  const backup = createBackup(storage, exportedAt);

  assert.equal(backup.format, BACKUP_FORMAT);
  assert.equal(backup.version, BACKUP_VERSION);
  assert.equal(backup.exportedAt, exportedAt.toISOString());
  assert.deepEqual(Object.keys(backup.storage), [...BACKUP_KEYS]);
  assert.equal(backup.storage['tgm-star-up-enhanced-v2'], '{"target":"27"}');
  assert.equal(backup.storage['tgm.investments'], '{"1":5}');
  assert.equal(backup.storage['tgm-star-up-presets-v1'], null);
});

test('restore replaces supported values and removes values saved as null', () => {
  const storage = new MemoryStorage({
    'tgm-star-up-enhanced-v2': 'old-building-data',
    'tgm-star-up-presets-v1': 'old-presets',
    unrelated: 'keep-me'
  });
  const backup = createBackup(new MemoryStorage({
    'tgm-star-up-enhanced-v2': 'new-building-data',
    'tgm.investments': 'new-investment-data'
  }), new Date('2026-08-07T02:00:00.000Z'));

  const restored = restoreBackup(backup, storage);

  assert.equal(restored, BACKUP_KEYS.length);
  assert.equal(storage.getItem('tgm-star-up-enhanced-v2'), 'new-building-data');
  assert.equal(storage.getItem('tgm.investments'), 'new-investment-data');
  assert.equal(storage.getItem('tgm-star-up-presets-v1'), null);
  assert.equal(storage.getItem('unrelated'), 'keep-me');
});

test('backup validation rejects unsupported or malformed files', () => {
  assert.throws(() => validateBackup({}), /backup format is not supported/i);
  assert.throws(() => validateBackup({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    storage: { 'tgm-theme': { mode: 'light' } }
  }), /invalid value/i);
});

test('backup filename includes the export date', () => {
  assert.equal(backupFilename(new Date('2026-08-07T23:59:59.000Z')), 'tgm-companion-backup-2026-08-07.json');
});
