import { createInvestmentEngine } from '../investments/engine.js';
import { FREIGHT_TRUCK_CATEGORY, registerConstructionInvestments } from '../investments/construction.js';
import { loadInvestmentRecords, loadInvestmentRowMap } from '../data/load.js';
import { duration, number } from '../shared/format.js';
import { readState, writeState } from '../shared/storage.js';

const STORAGE_KEY = 'tgm.investments';
const OPTIONS_KEY = 'tgm-investment-options-v1';
const UI_KEY = 'tgm-investment-ui-v1';
const LEGACY_KEY = 'investments_data';
const CATEGORY_ORDER = Object.freeze([1, 2, 3, 5, FREIGHT_TRUCK_CATEGORY.id, 7, 8, 9, 14, 15, 16, 17, 23, 18, 19, 20, 21, 22, 24, 25, 26]);
const TREE_LAYOUT = Object.freeze({
  'Economy': [[6, '', 2, ''], [9, 4, 3, 5], [1, '', 7, '']],
  'Defenses': [['', 10, '', ''], [13, 12, 11, ''], [15, 14, 16, ''], ['', 70, '', ''], [23, 20, 17, ''], ['', 71, '', ''], [24, 21, 18, ''], ['', 72, '', ''], [25, 22, 19, '']],
  'Crew': [[42, '', '', ''], [43, 38, '', ''], [26, 28, 27, 29], [30, 32, 31, 33], [44, 47, 50, 53], [34, 36, 35, 37], [45, 48, 51, 54], [40, 39, 41, ''], [46, 49, 52, 55]],
  'Kingpins': [['', 76, '', ''], [74, 83, 81, ''], ['', 77, '', ''], [85, 73, 87, ''], [91, '', 93, ''], ['', 78, '', ''], [86, '', 88, ''], [92, '', 94, ''], ['', 79, '', ''], [90, '', 89, ''], [75, '', 82, ''], ['', 84, '', ''], ['', 80, '', '']],
  'Freight Truck': FREIGHT_TRUCK_CATEGORY.layout,
  'Advanced Defenses': [['', 56, '', ''], [57, 59, 58, ''], ['', 60, '', ''], [62, 61, 63, ''], ['', 64, '', ''], [65, 67, 66, ''], ['', 68, '', ''], ['', 69, '', '']],
  'Advanced Crew': [[119, '', '', ''], [95, 96, 97, 98], [99, 100, 101, 102], [118, 191, 103, ''], [104, 105, 106, 107], [108, 117, 109, ''], [116, 120, 110, ''], [111, 112, 113, 114], ['', 115, 306, '']],
  'City Hall Weapons': [[124, 121, 122, ''], ['', 162, '', ''], [164, '', 163, ''], ['', 165, '', ''], [143, 141, 128, ''], [125, 126, 127, ''], ['', 123, '', ''], [130, 129, 131, ''], ['', 132, '', ''], [134, '', 135, ''], ['', 133, '', '']],
  'Equipment': [['', 227, '', ''], [228, '', 231, ''], [229, '', 232, ''], [230, '', 233, ''], ['', 234, '', ''], ['', 235, '', ''], ['', 305, '', ''], ['', 371, '', ''], ['', 373, '', ''], ['', 374, '', '']],
  'Babes': [[236, '', 238, ''], [237, '', 239, ''], [240, '', '', ''], [241, '', 243, ''], [242, '', 244, ''], [245, '', '', ''], [303, '', 304, '']],
  'Casino': [[246, 247, '', ''], [248, 250, 249, ''], [251, 253, 252, ''], [254, 256, 255, ''], ['', 257, '', ''], [258, '', 259, ''], [261, 260, 262, ''], [263, '', 264, ''], ['', 265, '', '']],
  'Formation': [['', 266, '', ''], [267, '', 196, ''], [136, '', 137, ''], [268, 269, 270, ''], [158, 160, 159, ''], [138, 139, 140, ''], [271, 273, 272, ''], [274, 275, 276, '']],
  "Governor's War": [['', 277, '', ''], [278, '', 280, ''], [279, '', 281, ''], ['', 282, '', ''], [283, 286, 289, ''], [284, 287, 290, ''], [285, 288, 291, ''], ['', 292, '', ''], [293, '', 296, ''], [294, '', 297, ''], [295, '', 298, ''], [300, 299, 301, ''], ['', 302, '', '']],
  'Super Weapon': [['', 339, '', ''], [344, 346, 345, ''], [347, 348, 349, ''], ['', 340, '', ''], [350, 351, 352, ''], [353, 354, 355, ''], ['', 341, '', ''], [362, 363, 364, ''], [359, 360, 361, ''], [356, 357, 358, ''], ['', 342, '', ''], [365, 367, 366, ''], [369, 368, 370, ''], ['', 343, '', '']],
  'Family Crystal': [['', 375, '', ''], [376, 377, 378, ''], [379, '', 380, ''], [381, '', 382, ''], [383, 384, 385, ''], [386, 387, 388, ''], [389, 390, 391, ''], [392, '', 393, ''], [394, '', 395, ''], [396, '', 398, ''], ['', 397, '', ''], ['', 399, '', '']],
  'Luxury Car': [['', 461, '', ''], [462, '', 463, ''], [464, 465, 466, ''], ['', 467, '', ''], [468, 469, 470, ''], [471, 472, 473, ''], ['', 474, '', ''], [475, 476, 477, ''], [478, 479, 480, ''], [481, 482, 483, ''], ['', 484, '', '']],
  'Family Investment': [['', 438, '', ''], [439, '', 440, ''], ['', 432, '', ''], [441, '', 442, ''], [433, '', 459, ''], [443, 444, 445, 446], [447, 448, 449, 450], [451, 452, 453, 454], ['', 458, 460, ''], [456, 455, 457, ''], [434, 435, 436, 437]],
  'Oil Supply': [['', 400, '', ''], [401, '', 402, ''], [403, '', 404, ''], ['', 405, '', ''], ['', 406, '', ''], [407, '', 408, ''], [409, '', 410, ''], ['', 411, '', ''], ['', 412, '', ''], [413, 414, 415, ''], [416, 417, 418, ''], [419, 420, 421, ''], ['', 422, '', ''], [423, '', 424, ''], [425, '', 426, ''], ['', 427, '', ''], [429, 428, 430, ''], ['', 431, '', '']],
  'Coalition: Ferro': [[485, '', 486, ''], ['', 487, '', ''], [488, '', 489, ''], ['', 490, '', ''], [491, 528, 492, ''], ['', 493, '', ''], ['', 494, '', ''], [495, '', 496, ''], ['', 497, '', ''], ['', 498, '', '']],
  'Coalition: Umezu Gumi': [[499, '', 500, ''], ['', 501, '', ''], [502, '', 503, ''], ['', 504, '', ''], [505, 529, 506, ''], ['', 507, '', ''], ['', 508, '', ''], [509, '', 510, ''], ['', 511, '', ''], ['', 512, '', '']],
  'Coalition: Blaze Riders': [[513, '', 514, ''], ['', 515, '', ''], [516, '', 517, ''], ['', 518, '', ''], [519, 530, 520, ''], ['', 521, '', ''], ['', 522, '', ''], [523, '', 524, ''], ['', 525, '', ''], ['', 526, '', '']]
});
const RESOURCE_FIELDS = Object.freeze(['cash', 'arms', 'cargo', 'metal', 'diamonds', 'oil', 'crypto_coins', 'family_currency', 'family_insignia']);
const $ = selector => document.querySelector(selector);

const [records, rowMap] = await Promise.all([loadInvestmentRecords(), loadInvestmentRowMap()]);
const engine = createInvestmentEngine(records, rowMap);
const rowsById = new Map(Object.entries(records).map(([id, row]) => [Number(id), row]));
const investments = new Map();
const categoriesById = new Map();

rowMap.forEach((entry, index) => {
  const [categoryIdRaw, categoryName, investmentIdRaw, name, levelRaw, rowIdRaw] = entry;
  const categoryId = Number(categoryIdRaw);
  const investmentId = Number(investmentIdRaw);
  const level = Number(levelRaw);
  const rowId = Number(rowIdRaw);
  if (!categoriesById.has(categoryId)) categoriesById.set(categoryId, { id: categoryId, name: categoryName, investments: [] });
  if (!investments.has(investmentId)) {
    const investment = { id: investmentId, name, categoryId, categoryName, maxLevel: 0, order: index, levels: new Map() };
    investments.set(investmentId, investment);
    categoriesById.get(categoryId).investments.push(investmentId);
  }
  const investment = investments.get(investmentId);
  investment.maxLevel = Math.max(investment.maxLevel, level);
  investment.levels.set(level, rowId);
});
registerConstructionInvestments(categoriesById, investments);

const categories = [
  ...CATEGORY_ORDER.map(id => categoriesById.get(id)).filter(Boolean),
  ...[...categoriesById.values()].filter(category => !CATEGORY_ORDER.includes(category.id)).sort((a, b) => a.id - b.id)
];
const savedUi = objectValue(readState(UI_KEY, {}));
const savedOptions = objectValue(readState(OPTIONS_KEY, {}));
const completed = {
  ...loadLegacyProgress(),
  ...objectValue(readState(STORAGE_KEY, {}))
};
const state = {
  categoryId: categoriesById.has(Number(savedUi.categoryId)) ? Number(savedUi.categoryId) : categories[0]?.id,
  investmentId: investments.has(Number(savedUi.investmentId)) ? Number(savedUi.investmentId) : null,
  targetLevel: Number(savedUi.targetLevel) || 1,
  options: {
    buffPercent: Number(savedOptions.buffPercent ?? 400),
    helps: clamp(savedOptions.helps ?? 0, 0, 30),
    vipLevel: clamp(savedOptions.vipLevel ?? 15, 1, 20)
  }
};

function objectValue(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, Number(value) || 0));
}

function parseBuff(value) {
  return Math.max(0, Number(String(value).replace('%', '').trim()) || 0);
}

function loadLegacyProgress() {
  const encoded = localStorage.getItem(LEGACY_KEY);
  if (!encoded) return {};
  try {
    return normalizeImportedProgress(JSON.parse(atob(encoded)));
  } catch (error) {
    console.warn('Unable to read legacy investment progress.', error);
    return {};
  }
}

function normalizeImportedProgress(value) {
  const source = objectValue(value?.levels ?? value);
  const normalized = {};
  const grouped = Object.values(source).every(item => Array.isArray(item));
  if (grouped) {
    for (const [level, ids] of Object.entries(source)) {
      for (const id of ids) {
        const investment = investments.get(Number(id));
        if (investment && !investment.underConstruction) normalized[String(id)] = clamp(level, 0, investment.maxLevel);
      }
    }
    return normalized;
  }
  for (const [id, level] of Object.entries(source)) {
    const investment = investments.get(Number(id));
    if (investment && !investment.underConstruction) normalized[String(id)] = clamp(level, 0, investment.maxLevel);
  }
  return normalized;
}

function groupedProgress() {
  const grouped = {};
  for (const [id, levelRaw] of Object.entries(completed)) {
    const investment = investments.get(Number(id));
    const level = investment && !investment.underConstruction ? clamp(levelRaw, 0, investment.maxLevel) : 0;
    if (!level) continue;
    if (!grouped[level]) grouped[level] = [];
    grouped[level].push(Number(id));
  }
  for (const ids of Object.values(grouped)) ids.sort((a, b) => a - b);
  return grouped;
}

function saveProgress() {
  writeState(STORAGE_KEY, completed);
  localStorage.setItem(LEGACY_KEY, btoa(JSON.stringify(groupedProgress())));
  syncDataField();
}

function saveUi() {
  writeState(UI_KEY, { categoryId: state.categoryId, investmentId: state.investmentId, targetLevel: state.targetLevel });
}

function saveOptions() {
  writeState(OPTIONS_KEY, state.options);
}

function toast(message) {
  const element = $('#investmentToast');
  element.textContent = message;
  element.classList.add('show');
  window.setTimeout(() => element.classList.remove('show'), 1800);
}

function categoryProgress(category) {
  if (category.underConstruction) return { current: 0, maximum: 0, percent: 0, underConstruction: true };
  let current = 0;
  let maximum = 0;
  for (const id of category.investments) {
    const investment = investments.get(id);
    if (!investment) continue;
    current += clamp(completed[id], 0, investment.maxLevel);
    maximum += investment.maxLevel;
  }
  return { current, maximum, percent: maximum ? Math.round((current / maximum) * 100) : 0, underConstruction: false };
}

function renderCategories() {
  $('#investmentCategoryList').innerHTML = categories.map(category => {
    const progress = categoryProgress(category);
    const status = progress.underConstruction ? 'WIP' : `${progress.percent}%`;
    return `<li data-category-id="${category.id}" data-construction="${category.underConstruction === true}" class="${category.id === state.categoryId ? 'active' : ''}">
      <button class="category-link" type="button" data-category="${category.id}">${category.name}</button>
      <span class="category_progress">${status}</span>
    </li>`;
  }).join('');
  filterCategories();
}

function filterCategories() {
  const query = $('#investmentCategorySearch').value.trim().toLowerCase();
  document.querySelectorAll('#investmentCategoryList li').forEach(item => {
    item.classList.toggle('hidden-category', query && !item.textContent.toLowerCase().includes(query));
  });
}

function layoutForCategory(category) {
  const original = TREE_LAYOUT[category.name];
  if (original) return original;
  const ids = [...category.investments].sort((a, b) => investments.get(a).order - investments.get(b).order);
  const rows = [];
  for (let index = 0; index < ids.length; index += 4) rows.push(ids.slice(index, index + 4));
  return rows;
}

function firstInvestmentForCategory(category) {
  const layoutId = layoutForCategory(category).flat().map(Number).find(id => investments.has(id));
  return layoutId || category.investments[0] || null;
}

function ensureSelection() {
  const category = categoriesById.get(state.categoryId) || categories[0];
  if (!category) return;
  state.categoryId = category.id;
  let investment = investments.get(state.investmentId);
  if (!investment || investment.categoryId !== category.id) {
    state.investmentId = firstInvestmentForCategory(category);
    investment = investments.get(state.investmentId);
  }
  if (investment) {
    if (investment.underConstruction) state.targetLevel = 1;
    else {
      const current = clamp(completed[investment.id], 0, investment.maxLevel);
      state.targetLevel = clamp(state.targetLevel || Math.min(current + 1, investment.maxLevel), 1, investment.maxLevel);
    }
  }
  saveUi();
}

function renderNode(id) {
  if (!id || !investments.has(Number(id))) return '<div class="tree-cell empty" aria-hidden="true"></div>';
  const investment = investments.get(Number(id));
  const selected = investment.id === state.investmentId;

  if (investment.underConstruction) {
    return `<div class="tree-cell"><article class="investment-node construction-node ${selected ? 'selected' : ''}" data-investment-id="${investment.id}">
      <button type="button" class="node-main" data-action="select" data-id="${investment.id}"><strong title="${investment.name}">${investment.name}</strong><small>Details pending</small></button>
      <div class="construction-node-status">Coming soon</div>
    </article></div>`;
  }

  const current = clamp(completed[investment.id], 0, investment.maxLevel);
  const percent = investment.maxLevel ? Math.round((current / investment.maxLevel) * 100) : 0;
  return `<div class="tree-cell"><article class="investment-node ${selected ? 'selected' : ''} ${current >= investment.maxLevel ? 'complete' : ''}" data-investment-id="${investment.id}">
    <button type="button" class="node-main" data-action="select" data-id="${investment.id}"><strong title="${investment.name}">${investment.name}</strong><small>Investment ${investment.id}</small></button>
    <div class="node-progress"><i style="width:${percent}%"></i></div>
    <div class="node-controls"><button type="button" data-action="minus" data-id="${investment.id}" aria-label="Decrease ${investment.name}">−</button><span>${current} / ${investment.maxLevel}</span><button type="button" data-action="plus" data-id="${investment.id}" aria-label="Increase ${investment.name}">+</button></div>
  </article></div>`;
}

function renderTree() {
  const category = categoriesById.get(state.categoryId);
  if (!category) {
    $('#investmentTree').innerHTML = '<div class="tree-empty">No investment categories were found.</div>';
    return;
  }
  $('#treeTitle').textContent = category.name;
  const construction = category.underConstruction === true;
  for (const id of ['resetCategoryBtn', 'maxCategoryBtn', 'calculateCategoryBtn']) {
    const button = document.getElementById(id);
    if (button) button.hidden = construction;
  }
  const layout = layoutForCategory(category);
  $('#investmentTree').innerHTML = layout.map(row => `<div class="tree-row">${Array.from({ length: 4 }, (_, index) => renderNode(row[index])).join('')}</div>`).join('');
}

function optionsFromInputs() {
  state.options.buffPercent = parseBuff($('#buff').value);
  state.options.helps = clamp($('#helps').value, 0, 30);
  state.options.vipLevel = clamp($('#vip').value, 1, 20);
  $('#buff').value = `${state.options.buffPercent}%`;
  $('#helps').value = state.options.helps;
  $('#vip').value = state.options.vipLevel;
  saveOptions();
  return state.options;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function singleGold(adjustedSeconds) {
  return Math.round((((Number(adjustedSeconds) || 0) / 86400) * 1450) / 1000) * 1000;
}

function uniqueDependencyRows(row) {
  const seen = new Set();
  const dependencies = [];
  for (const rowId of [...(row.required_ids || [])].reverse()) {
    const dependency = rowsById.get(Number(rowId));
    if (!dependency || seen.has(dependency.name)) continue;
    seen.add(dependency.name);
    dependencies.push(dependency);
  }
  return dependencies.reverse();
}

function renderDependencies(row) {
  const completedRows = engine.highestCompletedRows(completed);
  const dependencies = uniqueDependencyRows(row);
  if (!dependencies.length) return '<span class="muted-detail">No dependencies.</span>';
  const items = dependencies.map(dependency => {
    const status = completedRows.has(Number(dependency.row_id)) ? 'complete' : 'missing';
    return `<li><button type="button" class="${status}" data-dependency-row="${dependency.row_id}">${dependency.name} ${dependency.level}</button></li>`;
  }).join('');
  return `<details><summary>Investments: <small>(click to expand)</small></summary><ul class="dependency-list">${items}</ul></details>`;
}

function renderRequiredNames(names) {
  if (!names.length) return '<span class="muted-detail">No missing investments.</span>';
  return `<details><summary>All Investments: <small>(click to expand)</small></summary><ul class="required-investments">${names.map(name => `<li>${name}</li>`).join('')}</ul></details>`;
}

function setConstructionMode(enabled) {
  const notice = $('#investmentConstructionNotice');
  const details = $('#details_inv');
  const totals = $('#details_deps_aggr');
  const levelActions = document.querySelector('.selected-investment .level-actions');
  if (notice) notice.hidden = !enabled;
  if (details) details.hidden = enabled;
  if (totals) totals.hidden = enabled;
  if (levelActions) levelActions.hidden = enabled;
}

function renderConstructionDetails(investment) {
  setConstructionMode(true);
  setText('inv_name_lvl', investment.name);
  setText('investmentConstructionMessage', `${investment.name} is still under construction because not all data is available for this investment yet.`);
  state.targetLevel = 1;
  saveUi();
}

function renderDetails() {
  const investment = investments.get(state.investmentId);
  if (!investment) return;
  if (investment.underConstruction) {
    renderConstructionDetails(investment);
    return;
  }

  setConstructionMode(false);
  state.targetLevel = clamp(state.targetLevel, 1, investment.maxLevel);
  const row = engine.rowForLevel(investment.id, state.targetLevel);
  if (!row) return;
  const options = optionsFromInputs();
  const adjusted = engine.adjustedTime(Number(row.time) || 0, options);
  const totals = engine.calculateTarget({ investmentId: investment.id, targetLevel: state.targetLevel, completedLevels: completed, options });

  setText('inv_name_lvl', `${row.name} ${row.level}`);
  setText('inv_time', number(row.time));
  setText('inv_time_buffs', number(adjusted));
  setText('inv_time_human', duration(adjusted));
  for (const field of RESOURCE_FIELDS) setText(`inv_${field}`, number(row[field]));
  setText('inv_gold', number(singleGold(adjusted)));
  setText('inv_influence_increase', number(row.influence_increase));
  $('#inv_dependencies').innerHTML = renderDependencies(row);

  setText('deps_investments', number(totals.investments));
  setText('deps_time_human', duration(totals.adjusted_time));
  for (const field of RESOURCE_FIELDS) setText(`deps_${field}`, number(totals[field]));
  setText('deps_gold', number(totals.gold));
  setText('deps_influence_increase', number(totals.influence_increase));
  $('#deps_investment_names').innerHTML = renderRequiredNames(totals.investment_names);
  $('#details_deps_aggr').dataset.count = String(totals.investments);
  $('#inv_lvl_down').disabled = state.targetLevel <= 1;
  $('#inv_lvl_up').disabled = state.targetLevel >= investment.maxLevel;
  saveUi();
}

function setCategory(categoryId) {
  if (!categoriesById.has(Number(categoryId))) return;
  state.categoryId = Number(categoryId);
  state.investmentId = firstInvestmentForCategory(categoriesById.get(state.categoryId));
  const investment = investments.get(state.investmentId);
  state.targetLevel = investment?.underConstruction
    ? 1
    : investment ? Math.min(clamp(completed[investment.id], 0, investment.maxLevel) + 1, investment.maxLevel) : 1;
  renderCategories();
  renderTree();
  renderDetails();
  saveUi();
}

function selectInvestment(investmentId, targetLevel) {
  const investment = investments.get(Number(investmentId));
  if (!investment) return;
  state.categoryId = investment.categoryId;
  state.investmentId = investment.id;
  if (investment.underConstruction) state.targetLevel = 1;
  else {
    const current = clamp(completed[investment.id], 0, investment.maxLevel);
    state.targetLevel = clamp(targetLevel ?? Math.min(current + 1, investment.maxLevel), 1, investment.maxLevel);
  }
  renderCategories();
  renderTree();
  renderDetails();
  saveUi();
  if (investment.underConstruction) toast(`${investment.name} is under construction`);
}

function changeCompleted(investmentId, amount) {
  const investment = investments.get(Number(investmentId));
  if (!investment) return;
  if (investment.underConstruction) {
    toast(`${investment.name} is under construction`);
    return;
  }
  completed[String(investment.id)] = clamp((Number(completed[investment.id]) || 0) + amount, 0, investment.maxLevel);
  state.categoryId = investment.categoryId;
  state.investmentId = investment.id;
  state.targetLevel = Math.max(1, Math.min(completed[investment.id] + 1, investment.maxLevel));
  saveProgress();
  renderCategories();
  renderTree();
  renderDetails();
}

function syncDataField() {
  const encoded = btoa(JSON.stringify(groupedProgress()));
  $('#data').value = encoded;
  const url = new URL(location.href);
  url.hash = `i=${encodeURIComponent(encoded)}`;
  $('#share_data').href = url.toString();
}

function importProgress(text, showToast = true) {
  try {
    const trimmed = String(text).trim();
    const parsed = trimmed.startsWith('{') ? JSON.parse(trimmed) : JSON.parse(atob(trimmed));
    const imported = normalizeImportedProgress(parsed);
    for (const key of Object.keys(completed)) delete completed[key];
    Object.assign(completed, imported);
    saveProgress();
    renderCategories();
    renderTree();
    renderDetails();
    if (showToast) toast('Investment progress imported');
  } catch (error) {
    console.error(error);
    toast('Invalid investment data');
  }
}

function loadHashProgress() {
  const params = new URLSearchParams(location.hash.slice(1));
  const encoded = params.get('i');
  if (encoded) importProgress(encoded, false);
}

function resetProgress() {
  if (!confirm('Reset all completed investment levels?')) return;
  for (const key of Object.keys(completed)) delete completed[key];
  saveProgress();
  renderCategories();
  renderTree();
  renderDetails();
  toast('Investment progress reset');
}

function initializeTheme() {
  if (localStorage.getItem('tgm-theme') === 'light') document.documentElement.classList.add('light');
  $('#investmentThemeBtn').addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('tgm-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  });
}

initializeTheme();
$('#buff').value = `${state.options.buffPercent}%`;
$('#helps').value = state.options.helps;
$('#vip').value = state.options.vipLevel;
loadHashProgress();
ensureSelection();
renderCategories();
renderTree();
renderDetails();
syncDataField();

$('#investmentCategoryList').addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (button) setCategory(button.dataset.category);
});
$('#investmentCategorySearch').addEventListener('input', filterCategories);
$('#investmentTree').addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const id = Number(control.dataset.id);
  if (control.dataset.action === 'select') selectInvestment(id);
  if (control.dataset.action === 'minus') changeCompleted(id, -1);
  if (control.dataset.action === 'plus') changeCompleted(id, 1);
});
$('#details').addEventListener('click', event => {
  const dependency = event.target.closest('[data-dependency-row]');
  if (dependency) {
    const row = rowsById.get(Number(dependency.dataset.dependencyRow));
    if (row) selectInvestment(row.id, row.level);
  }
});
$('#inv_lvl_down').addEventListener('click', () => {
  state.targetLevel -= 1;
  renderDetails();
});
$('#inv_lvl_up').addEventListener('click', () => {
  state.targetLevel += 1;
  renderDetails();
});
for (const id of ['buff', 'helps', 'vip']) {
  document.getElementById(id).addEventListener('change', renderDetails);
  document.getElementById(id).addEventListener('input', () => {
    window.clearTimeout(window.investmentOptionTimer);
    window.investmentOptionTimer = window.setTimeout(renderDetails, 180);
  });
}
$('#importInvestmentData').addEventListener('click', () => importProgress($('#data').value));
$('#data').addEventListener('focus', event => event.target.select());
$('#resetInvestmentsBtn').addEventListener('click', resetProgress);
