import { buildingNames, buildingOrder } from '../buildings/catalog.js';
import { loadInvestmentRowMap } from '../data/load.js';
import { backupFilename, createBackup, restoreBackup, validateBackup } from '../shared/backup.js';
import { readState } from '../shared/storage.js';

const BUILDING_STATE_KEY = 'tgm-star-up-enhanced-v2';
const LEGACY_BUILDING_LEVELS_KEY = 'tgm.buildings';
const PRESET_KEY = 'tgm-star-up-presets-v1';
const INVESTMENT_STATE_KEY = 'tgm.investments';
const LEGACY_INVESTMENT_KEY = 'investments_data';
const CATEGORY_ORDER = Object.freeze([1, 2, 3, 5, 7, 8, 9, 14, 15, 16, 17, 23, 18, 19, 20, 21, 22, 24, 25, 26]);
const $ = selector => document.querySelector(selector);

let investmentMaximums = new Map();
let investmentCategories = [];

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function objectValue(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function abbreviation(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function loadBuildingState() {
  const enhanced = objectValue(readState(BUILDING_STATE_KEY, {}));
  const legacyLevels = objectValue(readState(LEGACY_BUILDING_LEVELS_KEY, {}));
  const enhancedLevels = objectValue(enhanced.levels);
  return {
    state: enhanced,
    levels: { ...legacyLevels, ...enhancedLevels }
  };
}

function loadLegacyInvestmentLevels() {
  const raw = localStorage.getItem(LEGACY_INVESTMENT_KEY);
  if (!raw) return {};
  try {
    const grouped = JSON.parse(atob(raw));
    const levels = {};
    for (const [level, ids] of Object.entries(objectValue(grouped))) {
      for (const id of Array.isArray(ids) ? ids : []) levels[String(id)] = Number(level) || 0;
    }
    return levels;
  } catch (error) {
    console.warn('Unable to read legacy investment progress.', error);
    return {};
  }
}

function buildingStats() {
  const { state, levels } = loadBuildingState();
  const maximum = buildingOrder.length * 10;
  const completed = buildingOrder.reduce((total, id) => total + clamp(levels[id], 0, 10), 0);
  return {
    state,
    completed,
    maximum,
    percent: maximum ? Math.round((completed / maximum) * 100) : 0
  };
}

function investmentStats() {
  const modern = objectValue(readState(INVESTMENT_STATE_KEY, {}));
  const levels = { ...loadLegacyInvestmentLevels(), ...modern };
  let completed = 0;
  let maximum = 0;
  let tracked = 0;

  for (const [id, maxLevel] of investmentMaximums) {
    const level = clamp(levels[id], 0, maxLevel);
    completed += level;
    maximum += maxLevel;
    if (level > 0) tracked += 1;
  }

  return {
    completed,
    maximum,
    tracked,
    percent: maximum ? Math.round((completed / maximum) * 100) : 0,
    levels
  };
}

function presetCount() {
  return Object.keys(objectValue(readState(PRESET_KEY, {}))).length;
}

function categoryProgress(category, levels) {
  let completed = 0;
  let maximum = 0;

  for (const id of category.investmentIds) {
    const maxLevel = investmentMaximums.get(id) || 0;
    completed += clamp(levels[id], 0, maxLevel);
    maximum += maxLevel;
  }

  return {
    completed,
    maximum,
    percent: maximum ? Math.round((completed / maximum) * 100) : 0
  };
}

function renderInvestmentCategories(investments) {
  const container = $('#investmentCategoryProgress');
  if (!container) return;

  if (!investmentCategories.length) {
    container.innerHTML = '<div class="empty-dashboard category-progress-empty">Investment category data could not be loaded.</div>';
    return;
  }

  container.innerHTML = investmentCategories.map(category => {
    const progress = categoryProgress(category, investments.levels);
    return `<a class="investment-category-item" href="investments.html" aria-label="Open ${category.name} investments">
      <div class="investment-category-heading">
        <strong>${category.name}</strong>
        <span>${progress.percent}%</span>
      </div>
      <div class="category-progress-bar" aria-hidden="true"><i style="width:${progress.percent}%"></i></div>
      <small>${progress.completed.toLocaleString()} / ${progress.maximum.toLocaleString()} levels</small>
    </a>`;
  }).join('');
}

function renderContinueCard(buildings) {
  const targetId = String(buildings.state.target || '');
  const targetStar = clamp(buildings.state.targetStar, 0, 10);
  const targetName = buildingNames[Number(targetId)];

  if (!targetName || targetStar < 1) {
    $('#currentTarget').textContent = 'Not set';
    $('#currentTargetMeta').textContent = 'Open the planner to choose one';
    $('#continueContent').innerHTML = '<div class="empty-dashboard">No active building target yet. Open the Star-Up planner to create one.</div>';
    return;
  }

  $('#currentTarget').textContent = targetName;
  $('#currentTargetMeta').textContent = `Target level ★${targetStar}`;
  $('#continueContent').innerHTML = `<div class="continue-target">
    <span class="target-badge">${abbreviation(targetName)}</span>
    <div><small>Current building goal</small><strong>${targetName} → ★${targetStar}</strong></div>
    <a href="star-ups.html">Continue →</a>
  </div>`;
}

function render() {
  const buildings = buildingStats();
  const investments = investmentStats();
  const combinedMaximum = buildings.maximum + investments.maximum;
  const combinedCompleted = buildings.completed + investments.completed;
  const combinedPercent = combinedMaximum ? Math.round((combinedCompleted / combinedMaximum) * 100) : 0;

  $('#buildingStars').textContent = `${buildings.completed.toLocaleString()} / ${buildings.maximum.toLocaleString()}`;
  $('#buildingPercentText').textContent = `${buildings.percent}% complete`;
  $('#investmentLevels').textContent = `${investments.completed.toLocaleString()} / ${investments.maximum.toLocaleString()}`;
  $('#investmentPercentText').textContent = `${investments.percent}% complete`;
  $('#presetCount').textContent = presetCount().toLocaleString();

  $('#combinedPercent').textContent = `${combinedPercent}%`;
  $('#combinedBar').style.width = `${combinedPercent}%`;
  $('#combinedCaption').textContent = combinedCompleted
    ? `${combinedCompleted.toLocaleString()} of ${combinedMaximum.toLocaleString()} total tracked levels completed.`
    : 'Start by entering your current building or investment progress.';

  $('#buildingLaunchPercent').textContent = `${buildings.percent}%`;
  $('#buildingLaunchBar').style.width = `${buildings.percent}%`;
  $('#investmentLaunchPercent').textContent = `${investments.percent}%`;
  $('#investmentLaunchBar').style.width = `${investments.percent}%`;
  renderInvestmentCategories(investments);
  renderContinueCard(buildings);
}

function setBackupStatus(message, error = false) {
  const status = $('#backupStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', error);
}

function downloadBackup() {
  try {
    const exportedAt = new Date();
    const backup = createBackup(localStorage, exportedAt);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFilename(exportedAt);
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setBackupStatus('Complete backup downloaded.');
  } catch (error) {
    console.error('Unable to create complete backup.', error);
    setBackupStatus('Unable to create the backup.', true);
  }
}

async function restoreAllData(file) {
  try {
    const backup = validateBackup(JSON.parse(await file.text()));
    const confirmed = confirm('Restore all TGM Companion progress and settings? This replaces the current saved data in this browser.');
    if (!confirmed) {
      setBackupStatus('Restore cancelled.');
      return;
    }

    restoreBackup(backup, localStorage);
    setBackupStatus('Backup restored. Reloading the dashboard…');
    window.setTimeout(() => location.reload(), 350);
  } catch (error) {
    console.error('Unable to restore complete backup.', error);
    setBackupStatus(error.message || 'Unable to restore this backup.', true);
  }
}

function initializeBackupControls() {
  $('#backupAllBtn')?.addEventListener('click', downloadBackup);
  $('#restoreAllBtn')?.addEventListener('click', () => $('#restoreAllFile')?.click());
  $('#restoreAllFile')?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) void restoreAllData(file);
    event.target.value = '';
  });
}

function initializeTheme() {
  if (localStorage.getItem('tgm-theme') === 'light') document.documentElement.classList.add('light');
  $('#dashboardThemeBtn').addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('tgm-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  });
}

async function loadInvestmentMetadata() {
  try {
    const rowMap = await loadInvestmentRowMap();
    investmentMaximums = new Map();
    const categoriesById = new Map();

    for (const entry of rowMap) {
      const categoryId = Number(entry[0]);
      const categoryName = String(entry[1]);
      const investmentId = String(entry[2]);
      const level = Number(entry[4]) || 0;

      investmentMaximums.set(investmentId, Math.max(investmentMaximums.get(investmentId) || 0, level));
      if (!categoriesById.has(categoryId)) {
        categoriesById.set(categoryId, { id: categoryId, name: categoryName, investmentIds: new Set() });
      }
      categoriesById.get(categoryId).investmentIds.add(investmentId);
    }

    investmentCategories = [
      ...CATEGORY_ORDER.map(id => categoriesById.get(id)).filter(Boolean),
      ...[...categoriesById.values()]
        .filter(category => !CATEGORY_ORDER.includes(category.id))
        .sort((a, b) => a.id - b.id)
    ];
  } catch (error) {
    console.error('Unable to load investment progress metadata.', error);
    investmentMaximums = new Map();
    investmentCategories = [];
  }
}

initializeTheme();
initializeBackupControls();
await loadInvestmentMetadata();
render();
window.addEventListener('storage', render);
window.addEventListener('pageshow', render);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) render();
});
