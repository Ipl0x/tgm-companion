import { createInvestmentEngine } from '../investments/engine.js';
import { loadInvestmentRecords, loadInvestmentRowMap } from '../data/load.js';
import { duration, number } from '../shared/format.js';
import { readState, writeState } from '../shared/storage.js';

const STORAGE_KEY = 'tgm.investments';
const LEGACY_KEY = 'investments_data';
const RESOURCE_FIELDS = Object.freeze([
  'cash', 'arms', 'cargo', 'metal', 'diamonds', 'oil',
  'crypto_coins', 'family_currency', 'family_insignia'
]);

const [records, rowMap] = await Promise.all([
  loadInvestmentRecords(),
  loadInvestmentRowMap()
]);
const engine = createInvestmentEngine(records, rowMap);
const categories = new Map();
const maximums = new Map();

for (const entry of rowMap) {
  const categoryId = Number(entry[0]);
  const categoryName = String(entry[1]);
  const investmentId = Number(entry[2]);
  const level = Number(entry[4]) || 0;
  if (!categories.has(categoryId)) {
    categories.set(categoryId, { id: categoryId, name: categoryName, investments: [] });
  }
  const category = categories.get(categoryId);
  if (!category.investments.includes(investmentId)) category.investments.push(investmentId);
  maximums.set(investmentId, Math.max(maximums.get(investmentId) || 0, level));
}

function objectValue(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function activeCategory() {
  const active = document.querySelector('#investmentCategoryList li.active');
  if (active?.dataset.construction === 'true') return null;
  const categoryId = Number(active?.dataset.categoryId);
  return categories.get(categoryId) || categories.values().next().value;
}

function completedLevels() {
  return { ...objectValue(readState(STORAGE_KEY, {})) };
}

function groupedProgress(levels) {
  const grouped = {};
  for (const [idText, levelRaw] of Object.entries(levels)) {
    const id = Number(idText);
    const maximum = maximums.get(id) || 0;
    const level = Math.max(0, Math.min(maximum, Number(levelRaw) || 0));
    if (!level) continue;
    if (!grouped[level]) grouped[level] = [];
    grouped[level].push(id);
  }
  for (const ids of Object.values(grouped)) ids.sort((a, b) => a - b);
  return grouped;
}

function saveLevels(levels) {
  writeState(STORAGE_KEY, levels);
  localStorage.setItem(LEGACY_KEY, btoa(JSON.stringify(groupedProgress(levels))));
}

function toast(message) {
  const element = document.querySelector('#investmentToast');
  if (!element) return;
  element.textContent = message;
  element.classList.add('show');
  window.setTimeout(() => element.classList.remove('show'), 1400);
}

function setCategoryLevels(mode) {
  const category = activeCategory();
  if (!category) return;
  const levels = completedLevels();
  for (const id of category.investments) {
    if (mode === 'max') levels[String(id)] = maximums.get(id) || 0;
    else delete levels[String(id)];
  }
  saveLevels(levels);
  toast(mode === 'max' ? `${category.name} set to max` : `${category.name} reset`);
  window.setTimeout(() => location.reload(), 120);
}

function currentOptions() {
  const buff = Number(String(document.querySelector('#buff')?.value || '400').replace('%', '').trim()) || 0;
  const helps = Math.max(0, Math.min(30, Number(document.querySelector('#helps')?.value) || 0));
  const vipLevel = Math.max(1, Math.min(20, Number(document.querySelector('#vip')?.value) || 15));
  return { buffPercent: buff, helps, vipLevel };
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function renderCategoryTotals() {
  const category = activeCategory();
  if (!category) return;
  const totals = engine.calculateCategory(category.investments, completedLevels(), currentOptions());

  const details = document.querySelector('#details_inv');
  const levelActions = document.querySelector('.selected-investment .level-actions');
  if (details) details.style.display = 'none';
  if (levelActions) levelActions.style.display = 'none';
  setText('inv_name_lvl', `${category.name} — remaining total`);

  const heading = document.querySelector('#details_deps_aggr th');
  if (heading) heading.innerHTML = `Required total <small>all remaining ${category.name} investments</small>`;
  setText('deps_investments', number(totals.investments));
  setText('deps_time_human', duration(totals.adjusted_time));
  for (const field of RESOURCE_FIELDS) setText(`deps_${field}`, number(totals[field]));
  setText('deps_gold', number(totals.gold));
  setText('deps_influence_increase', number(totals.influence_increase));

  const names = document.querySelector('#deps_investment_names');
  if (names) {
    names.innerHTML = totals.investment_names.length
      ? `<details open><summary>All Investments: <small>(click to collapse)</small></summary><ul class="required-investments">${totals.investment_names.map(name => `<li>${name}</li>`).join('')}</ul></details>`
      : '<span class="muted-detail">This category is already complete.</span>';
  }
  const totalTable = document.querySelector('#details_deps_aggr');
  if (totalTable) totalTable.dataset.count = String(totals.investments);
  toast(`${category.name} total calculated`);
}

function restoreSingleDetails() {
  const details = document.querySelector('#details_inv');
  const totals = document.querySelector('#details_deps_aggr');
  const levelActions = document.querySelector('.selected-investment .level-actions');
  const constructionNotice = document.querySelector('#investmentConstructionNotice');
  if (constructionNotice) constructionNotice.hidden = true;
  if (details) {
    details.hidden = false;
    details.style.display = '';
  }
  if (totals) totals.hidden = false;
  if (levelActions) {
    levelActions.hidden = false;
    levelActions.style.display = '';
  }
  const heading = document.querySelector('#details_deps_aggr th');
  if (heading) heading.innerHTML = 'Required total <small>including selected investment</small>';
}

function applyProgressBackgrounds() {
  document.querySelectorAll('.node-controls').forEach(control => {
    const match = control.querySelector('span')?.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    const current = Number(match?.[1]) || 0;
    const maximum = Number(match?.[2]) || 0;
    control.style.setProperty('--node-progress', maximum ? `${Math.round((current / maximum) * 100)}%` : '0%');
  });
}

document.querySelector('#resetCategoryBtn')?.addEventListener('click', () => setCategoryLevels('reset'));
document.querySelector('#maxCategoryBtn')?.addEventListener('click', () => setCategoryLevels('max'));
document.querySelector('#calculateCategoryBtn')?.addEventListener('click', renderCategoryTotals);
document.querySelector('#investmentTree')?.addEventListener('click', event => {
  if (event.target.closest('.construction-node')) return;
  if (event.target.closest('[data-action]')) restoreSingleDetails();
  window.setTimeout(applyProgressBackgrounds, 0);
});
document.querySelector('#investmentCategoryList')?.addEventListener('click', event => {
  if (event.target.closest('li[data-construction="true"]')) return;
  restoreSingleDetails();
  window.setTimeout(applyProgressBackgrounds, 0);
});

const tree = document.querySelector('#investmentTree');
if (tree) new MutationObserver(applyProgressBackgrounds).observe(tree, { childList: true, subtree: true });
applyProgressBackgrounds();
