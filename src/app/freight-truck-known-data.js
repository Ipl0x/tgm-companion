import { FREIGHT_TRUCK_CATEGORY } from '../investments/construction.js';
import { number } from '../shared/format.js';

const RESOURCE_FIELDS = Object.freeze([
  'cash', 'arms', 'cargo', 'metal', 'diamonds', 'oil',
  'crypto_coins', 'family_currency', 'family_insignia'
]);

function levelsFor(investment) {
  const levels = investment.knownLevels?.length
    ? [...investment.knownLevels]
    : investment.knownLevel ? [investment.knownLevel] : [];
  return levels.sort((a, b) => Number(a.level) - Number(b.level));
}

const knownInvestments = new Map(
  FREIGHT_TRUCK_CATEGORY.investments
    .filter(investment => levelsFor(investment).length)
    .map(investment => [investment.id, investment])
);
const selectedLevels = new Map();

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function selectedLevelFor(investment, requestedLevel) {
  const levels = levelsFor(investment);
  const wanted = Number(requestedLevel ?? selectedLevels.get(investment.id) ?? levels[0]?.level);
  return levels.find(level => Number(level.level) === wanted) || levels[0];
}

function renderKnownLevel(investmentId, requestedLevel) {
  const investment = knownInvestments.get(Number(investmentId));
  if (!investment) return false;

  const levels = levelsFor(investment);
  const level = selectedLevelFor(investment, requestedLevel);
  if (!level) return false;
  selectedLevels.set(investment.id, Number(level.level));

  const levelIndex = levels.findIndex(item => Number(item.level) === Number(level.level));
  const lastKnownLevel = Number(levels.at(-1).level);
  const maxLevel = Number(investment.maxLevel) || lastKnownLevel;
  const notice = document.getElementById('investmentConstructionNotice');
  const details = document.getElementById('details_inv');
  const totals = document.getElementById('details_deps_aggr');
  const levelActions = document.querySelector('.selected-investment .level-actions');
  const levelDown = document.getElementById('inv_lvl_down');
  const levelUp = document.getElementById('inv_lvl_up');

  if (notice) notice.hidden = false;
  if (details) details.hidden = false;
  if (totals) totals.hidden = true;
  if (levelActions) levelActions.hidden = levels.length <= 1;
  if (levelDown) levelDown.disabled = levelIndex <= 0;
  if (levelUp) levelUp.disabled = levelIndex >= levels.length - 1;

  setText('inv_name_lvl', `${investment.name} ${level.level}`);
  setText(
    'investmentConstructionMessage',
    investment.dataComplete
      ? `${investment.name} data is complete for levels 1–${lastKnownLevel}. Freight Truck is still under construction because other investments are incomplete.`
      : maxLevel > lastKnownLevel
        ? `${investment.name} level ${level.level} data is available. Known data currently covers levels ${levels[0].level}–${lastKnownLevel} of max level ${maxLevel}; the remaining levels are still under construction.`
        : `${investment.name} level ${level.level} data is available, but this investment is still under construction because not all data is available yet.`
  );

  setText('inv_time', level.timeSeconds == null ? 'Unknown' : number(level.timeSeconds));
  setText('inv_time_buffs', level.originalTime ? 'Not calculated' : 'Unknown');
  setText('inv_time_human', level.originalTime || 'Unknown');
  for (const field of RESOURCE_FIELDS) setText(`inv_${field}`, 'Unknown');
  for (const [field, value] of Object.entries(level.resources)) setText(`inv_${field}`, number(value));
  setText('inv_gold', level.goldApprox == null ? 'Unknown' : `~${number(level.goldApprox)}`);
  setText('inv_influence_increase', number(level.influenceIncrease));

  const dependencies = document.getElementById('inv_dependencies');
  if (dependencies) {
    dependencies.innerHTML = level.prerequisites.length
      ? `<ul class="required-investments">${level.prerequisites
          .map(prerequisite => `<li>${prerequisite.name} Lv. ${prerequisite.level}</li>`)
          .join('')}</ul>`
      : '<span class="muted-detail">No investment prerequisites.</span>';
  }

  return true;
}

function enhanceKnownNodes() {
  for (const [investmentId, investment] of knownInvestments) {
    const node = document.querySelector(`.investment-node[data-investment-id="${investmentId}"]`);
    if (!node) continue;
    const levels = levelsFor(investment);
    const lastKnownLevel = Number(levels.at(-1).level);
    const maxLevel = Number(investment.maxLevel) || lastKnownLevel;
    const description = node.querySelector('.node-main small');
    const status = node.querySelector('.construction-node-status');
    const descriptionText = investment.dataComplete
      ? `Levels 1–${lastKnownLevel} data complete`
      : maxLevel > lastKnownLevel
        ? `Levels ${levels[0].level}–${lastKnownLevel} of ${maxLevel} data available`
        : levels.length === 1
          ? `Level ${levels[0].level} data available`
          : `Levels ${levels[0].level}–${lastKnownLevel} data available`;
    const statusText = investment.dataComplete ? 'Data complete' : 'Partial data';
    if (description && description.textContent !== descriptionText) description.textContent = descriptionText;
    if (status && status.textContent !== statusText) status.textContent = statusText;
  }
}

function restoreSelectedKnownLevel() {
  const selected = document.querySelector('.investment-node.selected[data-investment-id]');
  if (selected) renderKnownLevel(Number(selected.dataset.investmentId));
}

const tree = document.getElementById('investmentTree');
if (tree) {
  tree.addEventListener('click', event => {
    const control = event.target.closest('[data-action="select"][data-id]');
    if (!control || !knownInvestments.has(Number(control.dataset.id))) return;
    window.setTimeout(() => {
      enhanceKnownNodes();
      renderKnownLevel(Number(control.dataset.id));
    }, 0);
  });

  new MutationObserver(() => {
    enhanceKnownNodes();
    restoreSelectedKnownLevel();
  }).observe(tree, { childList: true, subtree: true });
}

const detailsPanel = document.getElementById('details');
if (detailsPanel) {
  detailsPanel.addEventListener('click', event => {
    const direction = event.target.closest('#inv_lvl_down') ? -1 : event.target.closest('#inv_lvl_up') ? 1 : 0;
    if (!direction) return;

    const selected = document.querySelector('.investment-node.selected[data-investment-id]');
    const investment = selected ? knownInvestments.get(Number(selected.dataset.investmentId)) : null;
    if (!investment) return;
    const levels = levelsFor(investment);
    if (levels.length <= 1) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const current = selectedLevelFor(investment);
    const index = levels.findIndex(level => Number(level.level) === Number(current.level));
    const next = levels[Math.max(0, Math.min(levels.length - 1, index + direction))];
    renderKnownLevel(investment.id, next.level);
  }, true);
}

enhanceKnownNodes();
restoreSelectedKnownLevel();
