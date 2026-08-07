import { FREIGHT_TRUCK_CATEGORY } from '../investments/construction.js';
import { number } from '../shared/format.js';

const RESOURCE_FIELDS = Object.freeze([
  'cash', 'arms', 'cargo', 'metal', 'diamonds', 'oil',
  'crypto_coins', 'family_currency', 'family_insignia'
]);

const knownInvestments = new Map(
  FREIGHT_TRUCK_CATEGORY.investments
    .filter(investment => investment.knownLevel)
    .map(investment => [investment.id, investment])
);

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function renderKnownLevel(investmentId) {
  const investment = knownInvestments.get(Number(investmentId));
  if (!investment) return false;

  const level = investment.knownLevel;
  const notice = document.getElementById('investmentConstructionNotice');
  const details = document.getElementById('details_inv');
  const totals = document.getElementById('details_deps_aggr');
  const levelActions = document.querySelector('.selected-investment .level-actions');

  if (notice) notice.hidden = false;
  if (details) details.hidden = false;
  if (totals) totals.hidden = true;
  if (levelActions) levelActions.hidden = true;

  setText('inv_name_lvl', `${investment.name} ${level.level}`);
  setText(
    'investmentConstructionMessage',
    `${investment.name} level ${level.level} data is available, but this investment is still under construction because not all data is available yet.`
  );

  setText('inv_time', 'Unknown');
  setText('inv_time_buffs', 'Unknown');
  setText('inv_time_human', 'Unknown');
  for (const field of RESOURCE_FIELDS) setText(`inv_${field}`, 'Unknown');
  for (const [field, value] of Object.entries(level.resources)) setText(`inv_${field}`, number(value));
  setText('inv_gold', 'Unknown');
  setText('inv_influence_increase', 'Unknown');

  const dependencies = document.getElementById('inv_dependencies');
  if (dependencies) {
    dependencies.innerHTML = `<ul class="required-investments">${level.prerequisites
      .map(prerequisite => `<li>${prerequisite.name} Lv. ${prerequisite.level}</li>`)
      .join('')}</ul>`;
  }

  return true;
}

function enhanceKnownNodes() {
  for (const [investmentId, investment] of knownInvestments) {
    const node = document.querySelector(`.investment-node[data-investment-id="${investmentId}"]`);
    if (!node) continue;
    const description = node.querySelector('.node-main small');
    const status = node.querySelector('.construction-node-status');
    const descriptionText = `Level ${investment.knownLevel.level} data available`;
    if (description && description.textContent !== descriptionText) description.textContent = descriptionText;
    if (status && status.textContent !== 'Partial data') status.textContent = 'Partial data';
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

enhanceKnownNodes();
restoreSelectedKnownLevel();
