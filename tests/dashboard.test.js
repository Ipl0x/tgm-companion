import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const dashboardHtml = await readFile('index.html', 'utf8');
const dashboardController = await readFile('src/app/dashboard.js', 'utf8');
const dashboardStyles = await readFile('css/dashboard.css', 'utf8');
const serviceWorker = await readFile('sw.js', 'utf8');

test('dashboard exposes investment progress for every category', () => {
  assert.match(dashboardHtml, /id="investmentCategoryProgress"/);
  assert.match(dashboardHtml, /Investment category progress/);
  assert.match(dashboardController, /const CATEGORY_ORDER = Object\.freeze/);
  assert.match(dashboardController, /function categoryProgress\(category, levels\)/);
  assert.match(dashboardController, /renderInvestmentCategories\(investments\)/);
  assert.match(dashboardController, /investmentIds: new Set\(\)/);
  assert.match(dashboardStyles, /\.investment-category-grid/);
  assert.match(dashboardStyles, /\.category-progress-bar/);
});

test('dashboard exposes complete backup and restore in quick actions', () => {
  assert.match(dashboardHtml, /id="backupAllBtn"/);
  assert.match(dashboardHtml, /id="restoreAllBtn"/);
  assert.match(dashboardHtml, /id="restoreAllFile"/);
  assert.match(dashboardController, /function downloadBackup\(\)/);
  assert.match(dashboardController, /function restoreAllData\(file\)/);
  assert.match(dashboardController, /initializeBackupControls\(\)/);
  assert.match(dashboardStyles, /\.backup-controls/);
});

test('dashboard features are included in the offline cache release', () => {
  assert.match(serviceWorker, /CACHE_VERSION = '2026-08-07-v\d+'/);
  assert.match(serviceWorker, /\.\/css\/dashboard\.css/);
  assert.match(serviceWorker, /\.\/src\/app\/dashboard\.js/);
  assert.match(serviceWorker, /\.\/src\/shared\/backup\.js/);
});
