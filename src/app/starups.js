import { buildingNames, buildingOrder } from '../buildings/catalog.js';
import { createBuildingEngine } from '../buildings/engine.js';
import { loadBuildingRecords } from '../data/load.js';
import { number } from '../shared/format.js';
import { readState, writeState } from '../shared/storage.js';

const STORAGE_KEY = 'tgm-star-up-enhanced-v2';
const LEGACY_LEVELS_KEY = 'tgm.buildings';
const PRESET_KEY = 'tgm-star-up-presets-v1';
const DEFAULT_STATE = Object.freeze({ levels: {}, target: '27', targetStar: 9, live: true, sort: 'default' });

const records = await loadBuildingRecords();
const engine = createBuildingEngine(records);
const buildings = buildingOrder.map(id => ({ id, name: buildingNames[id] }));
const legacyLevels = readState(LEGACY_LEVELS_KEY, {});
const savedState = readState(STORAGE_KEY, {});
const state = {
  ...DEFAULT_STATE,
  ...savedState,
  levels: {
    ...(legacyLevels && typeof legacyLevels === 'object' ? legacyLevels : {}),
    ...(savedState.levels && typeof savedState.levels === 'object' ? savedState.levels : {})
  }
};

state.target = String(state.target || DEFAULT_STATE.target);
state.targetStar = clamp(state.targetStar || DEFAULT_STATE.targetStar) || DEFAULT_STATE.targetStar;
state.live = state.live !== false;
state.sort = ['default', 'currency-desc', 'insignia-desc', 'name'].includes(state.sort) ? state.sort : DEFAULT_STATE.sort;

let lastPlan = null;
let activeFilter = 'all';
let liveTimer = null;
const $ = selector => document.querySelector(selector);

function clamp(value) {
  return Math.max(0, Math.min(10, Number(value) || 0));
}

function categoryFor(name) {
  if (['Mansion', 'Family Council', 'Hospital', 'Training Center', 'Wall', 'Workshop'].includes(name)) return 'core';
  if (['Bank', 'Warehouse', 'Vault', 'Investment Center', 'Commercial Street'].includes(name)) return 'economy';
  return 'family';
}

function buildingIcon(name) {
  return name.replace(/\(.*?\)/g, '').trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  window.setTimeout(() => element.classList.remove('show'), 1800);
}

function saveState() {
  writeState(STORAGE_KEY, state);
  writeState(LEGACY_LEVELS_KEY, state.levels);
}

function getPresets() {
  const value = readState(PRESET_KEY, {});
  return value && typeof value === 'object' ? value : {};
}

function setPresets(value) {
  writeState(PRESET_KEY, value);
  renderPresetOptions();
}

function loadSharedState() {
  const hash = new URLSearchParams(location.hash.slice(1));
  if (!hash.has('s')) return;
  try {
    const shared = JSON.parse(atob(hash.get('s')));
    if (shared.levels && typeof shared.levels === 'object') state.levels = shared.levels;
    if (shared.target !== undefined) state.target = String(shared.target);
    if (shared.targetStar !== undefined) state.targetStar = clamp(shared.targetStar) || 1;
    saveState();
    toast('Shared plan loaded');
  } catch (error) {
    console.warn('Unable to load shared plan.', error);
    toast('Invalid shared plan');
  }
}

function loadTheme() {
  if (localStorage.getItem('tgm-theme') === 'light') document.documentElement.classList.add('light');
}

function renderBuildings() {
  $('#buildingGrid').innerHTML = buildings.map(building => {
    const id = String(building.id);
    const value = clamp(state.levels[id]);
    return `<article class="building" data-category="${categoryFor(building.name)}" data-name="${building.name.toLowerCase()}">
      <span class="building-icon">${buildingIcon(building.name)}</span>
      <div class="building-copy"><div class="building-name">${building.name}</div><div class="building-cat">Current stars</div></div>
      <div class="level-control"><button type="button" data-action="minus" data-id="${id}" aria-label="Decrease ${building.name}">−</button><input data-id="${id}" type="number" min="0" max="10" value="${value}" aria-label="${building.name} current stars"><button type="button" data-action="plus" data-id="${id}" aria-label="Increase ${building.name}">+</button></div>
    </article>`;
  }).join('');

  document.querySelectorAll('.level-control input').forEach(input => {
    input.addEventListener('change', event => setLevel(event.target.dataset.id, event.target.value));
    input.addEventListener('input', event => {
      if (event.target.value !== '') setLevel(event.target.dataset.id, event.target.value, false);
    });
  });

  document.querySelectorAll('.level-control button').forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.action === 'plus' ? 1 : -1;
      setLevel(button.dataset.id, clamp(state.levels[button.dataset.id]) + direction);
    });
  });
  applyBuildingVisibility();
}

function setLevel(id, value, rerender = true) {
  state.levels[String(id)] = clamp(value);
  saveState();
  updateProgress();
  if (rerender) {
    const input = document.querySelector(`input[data-id="${id}"]`);
    if (input) input.value = state.levels[String(id)];
  }
  scheduleLive();
}

function applyBuildingVisibility() {
  const query = $('#buildingSearch').value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.building').forEach(card => {
    const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesSearch = !query || card.dataset.name.includes(query);
    const show = matchesFilter && matchesSearch;
    card.classList.toggle('hidden-filter', !show);
    if (show) visible += 1;
  });
  $('#emptySearch').classList.toggle('hidden', visible !== 0);
}

function renderTarget() {
  $('#targetBuilding').innerHTML = buildings.map(building => `<option value="${building.id}">${building.name}</option>`).join('');
  $('#targetBuilding').value = buildingNames[Number(state.target)] ? state.target : DEFAULT_STATE.target;
  state.target = $('#targetBuilding').value;
  $('#liveToggle').checked = state.live;
  renderTargetStars();
  updateTargetPreview();
}

function renderTargetStars() {
  $('#targetStars').innerHTML = Array.from({ length: 10 }, (_, index) => {
    const star = index + 1;
    const active = star === Number(state.targetStar);
    return `<button type="button" data-star="${star}" class="${active ? 'active' : ''}" aria-label="Target star ${star}" aria-pressed="${active}">★</button>`;
  }).join('');
  $('#targetStars').querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.targetStar = Number(button.dataset.star);
      saveState();
      renderTargetStars();
      updateTargetPreview();
      scheduleLive();
    });
  });
}

function updateTargetPreview() {
  const target = buildings.find(building => String(building.id) === state.target) || buildings[0];
  $('#targetIcon').textContent = buildingIcon(target.name);
  $('#targetSummary').textContent = `${target.name} → ★${state.targetStar}`;
}

function updateProgress() {
  const entered = buildings.reduce((total, building) => total + clamp(state.levels[String(building.id)]), 0);
  const maximum = buildings.length * 10;
  const percentage = Math.round((entered / maximum) * 100);
  $('#overallPercent').textContent = `${percentage}%`;
  $('#overallBar').style.width = `${percentage}%`;
  $('#overallCaption').textContent = `${entered} of ${maximum} stars entered`;
}

function applyExpandedCurrent(expanded) {
  let changed = false;
  for (const building of buildings) {
    const id = String(building.id);
    const inferred = clamp(expanded[id]);
    if (inferred > clamp(state.levels[id])) {
      state.levels[id] = inferred;
      changed = true;
    }
  }
  if (changed) {
    saveState();
    renderBuildings();
    updateProgress();
  }
}

function getPlan() {
  return engine.calculatePlan({ currentLevels: state.levels, targetBuildingId: Number(state.target), targetStar: Number(state.targetStar) });
}

function sortedRequirements(requirements) {
  const rows = [...requirements];
  if (state.sort === 'currency-desc') rows.sort((a, b) => b.familyCurrency - a.familyCurrency);
  if (state.sort === 'insignia-desc') rows.sort((a, b) => b.familyInsignia - a.familyInsignia);
  if (state.sort === 'name') rows.sort((a, b) => a.buildingName.localeCompare(b.buildingName));
  return rows;
}

function renderPlan({ scroll = false } = {}) {
  try {
    applyExpandedCurrent(engine.inferCurrentLevels(state.levels));
    const plan = getPlan();
    lastPlan = plan;
    const target = buildings.find(building => String(building.id) === state.target) || buildings[0];
    const rows = sortedRequirements(plan.requirements);
    const requiredLevels = engine.dependencyLevels(Number(state.target), Number(state.targetStar));
    const requiredStars = Object.values(requiredLevels).reduce((total, value) => total + Number(value), 0);
    const completedStars = Object.entries(requiredLevels).reduce((total, [id, required]) => total + Math.min(Number(plan.currentLevels[id] || 0), Number(required)), 0);
    const readiness = requiredStars ? Math.round((completedStars / requiredStars) * 100) : 100;

    $('#resultIntro').textContent = rows.length
      ? `${target.name} ★${state.targetStar} requires ${rows.length} building upgrade${rows.length === 1 ? '' : 's'} from your current state.`
      : `All prerequisites for ${target.name} ★${state.targetStar} are already complete.`;
    $('#upgradeCount').textContent = rows.length;
    $('#currencyTotal').textContent = number(plan.totals.familyCurrency);
    $('#insigniaTotal').textContent = number(plan.totals.familyInsignia);
    $('#readinessPercent').textContent = `${readiness}%`;
    $('#readinessBar').style.width = `${readiness}%`;
    $('#tableCurrencyTotal').textContent = number(plan.totals.familyCurrency);
    $('#tableInsigniaTotal').textContent = number(plan.totals.familyInsignia);
    $('#requirementsBody').innerHTML = rows.length ? rows.map(row => {
      const progress = row.requiredStar ? Math.round((row.currentStar / row.requiredStar) * 100) : 100;
      return `<tr><th scope="row"><span class="table-building-icon">${buildingIcon(row.buildingName)}</span>${row.buildingName}</th><td><span class="upgrade-badge">★${row.currentStar} → ★${row.requiredStar}</span></td><td><div class="row-progress"><i style="width:${progress}%"></i></div><small>${progress}%</small></td><td>${number(row.familyCurrency)}</td><td>${number(row.familyInsignia)}</td></tr>`;
    }).join('') : '<tr><td colspan="5" class="empty-result">No upgrades are required.</td></tr>';
    $('#results').classList.remove('hidden');
    if (scroll) $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error(error);
    toast(`Calculation error: ${error.message}`);
  }
}

function scheduleLive() {
  window.clearTimeout(liveTimer);
  liveTimer = window.setTimeout(() => {
    if (state.live) renderPlan();
  }, 180);
}

function resetAll() {
  if (!confirm('Reset every entered building level and target?')) return;
  state.levels = {};
  state.target = DEFAULT_STATE.target;
  state.targetStar = DEFAULT_STATE.targetStar;
  state.live = DEFAULT_STATE.live;
  state.sort = DEFAULT_STATE.sort;
  saveState();
  renderBuildings();
  renderTarget();
  $('#sortResults').value = state.sort;
  updateProgress();
  $('#results').classList.add('hidden');
  lastPlan = null;
  toast('Planner reset');
}

function summaryText() {
  const plan = lastPlan || getPlan();
  const target = buildings.find(building => String(building.id) === state.target) || buildings[0];
  const details = sortedRequirements(plan.requirements).map(row => `${row.buildingName}: ★${row.currentStar} → ★${row.requiredStar} | ${number(row.familyCurrency)} Currency | ${number(row.familyInsignia)} Insignia`).join('\n');
  return `TGM Star-Up Requirements\nTarget: ${target.name} ★${state.targetStar}\n\n${details || 'No upgrades required'}\n\nTotal Currency: ${number(plan.totals.familyCurrency)}\nTotal Insignia: ${number(plan.totals.familyInsignia)}`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

async function copySummary() {
  try {
    await copyText(summaryText());
    toast('Summary copied');
  } catch (error) {
    console.error(error);
    toast('Unable to copy summary');
  }
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportJson() {
  download('tgm-star-up-plan.json', JSON.stringify({ version: 2, ...state }, null, 2), 'application/json');
  toast('Plan exported');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      state.levels = imported.levels && typeof imported.levels === 'object' ? imported.levels : {};
      state.target = String(imported.target || DEFAULT_STATE.target);
      state.targetStar = clamp(imported.targetStar || DEFAULT_STATE.targetStar) || DEFAULT_STATE.targetStar;
      state.live = imported.live !== false;
      state.sort = ['default', 'currency-desc', 'insignia-desc', 'name'].includes(imported.sort) ? imported.sort : DEFAULT_STATE.sort;
      saveState();
      renderBuildings();
      renderTarget();
      $('#sortResults').value = state.sort;
      updateProgress();
      renderPlan();
      toast('Plan imported');
    } catch (error) {
      console.error(error);
      toast('Invalid plan file');
    }
  };
  reader.readAsText(file);
}

function exportCsv() {
  const plan = lastPlan || getPlan();
  const rows = [
    ['Building', 'From star', 'To star', 'Family Currency', 'Family Insignia'],
    ...sortedRequirements(plan.requirements).map(row => [row.buildingName, row.currentStar, row.requiredStar, row.familyCurrency, row.familyInsignia]),
    ['Total', '', '', plan.totals.familyCurrency, plan.totals.familyInsignia]
  ];
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
  download('tgm-upgrade-plan.csv', csv, 'text/csv');
  toast('CSV exported');
}

async function shareState() {
  const payload = btoa(JSON.stringify({ levels: state.levels, target: state.target, targetStar: state.targetStar }));
  const url = `${location.href.split('#')[0]}#s=${encodeURIComponent(payload)}`;
  try {
    await copyText(url);
    toast('Share link copied');
  } catch (error) {
    console.error(error);
    location.hash = `s=${encodeURIComponent(payload)}`;
    toast('Share state added to URL');
  }
}

function renderPresetOptions() {
  const presets = getPresets();
  const select = $('#presetSelect');
  const selected = select.value;
  select.replaceChildren(new Option('Saved presets', ''));
  Object.keys(presets).sort().forEach(name => select.add(new Option(name, name)));
  if (Object.hasOwn(presets, selected)) select.value = selected;
}

function savePreset() {
  const name = prompt('Preset name:');
  if (!name?.trim()) return;
  const presets = getPresets();
  presets[name.trim()] = { levels: { ...state.levels }, target: state.target, targetStar: state.targetStar };
  setPresets(presets);
  $('#presetSelect').value = name.trim();
  toast('Preset saved');
}

function loadPreset(name) {
  if (!name) return;
  const preset = getPresets()[name];
  if (!preset) return;
  state.levels = { ...(preset.levels || {}) };
  state.target = String(preset.target || DEFAULT_STATE.target);
  state.targetStar = clamp(preset.targetStar || DEFAULT_STATE.targetStar) || DEFAULT_STATE.targetStar;
  saveState();
  renderBuildings();
  renderTarget();
  updateProgress();
  renderPlan();
  toast('Preset loaded');
}

function deletePreset() {
  const name = $('#presetSelect').value;
  if (!name) return toast('Choose a preset first');
  const presets = getPresets();
  delete presets[name];
  setPresets(presets);
  toast('Preset deleted');
}

loadTheme();
loadSharedState();
renderBuildings();
renderTarget();
renderPresetOptions();
updateProgress();
$('#sortResults').value = state.sort;

$('#targetBuilding').addEventListener('change', event => {
  state.target = event.target.value;
  saveState();
  updateTargetPreview();
  scheduleLive();
});
$('#calculateBtn').addEventListener('click', () => renderPlan({ scroll: true }));
$('#resetBtn').addEventListener('click', resetAll);
$('#copyBtn').addEventListener('click', copySummary);
$('#csvBtn').addEventListener('click', exportCsv);
$('#shareBtn').addEventListener('click', shareState);
$('#sortResults').addEventListener('change', event => {
  state.sort = event.target.value;
  saveState();
  if (lastPlan) renderPlan();
});
$('#liveToggle').addEventListener('change', event => {
  state.live = event.target.checked;
  saveState();
  if (state.live) renderPlan();
});
$('#buildingSearch').addEventListener('input', applyBuildingVisibility);
document.querySelectorAll('.segmented button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.segmented button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    applyBuildingVisibility();
  });
});
$('#savePresetBtn').addEventListener('click', savePreset);
$('#presetSelect').addEventListener('change', event => loadPreset(event.target.value));
$('#deletePresetBtn').addEventListener('click', deletePreset);
$('#exportBtn').addEventListener('click', exportJson);
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', event => {
  if (event.target.files[0]) importJson(event.target.files[0]);
  event.target.value = '';
});
$('#themeBtn').addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.setItem('tgm-theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
});

if (state.live) renderPlan();
