const RESOURCE_FIELDS = Object.freeze([
  "cash", "arms", "cargo", "metal", "diamonds", "oil",
  "crypto_coins", "family_currency", "family_insignia"
]);

const VIP_SECONDS = Object.freeze({
  1: 300, 2: 420, 3: 540, 4: 660, 5: 780, 6: 900, 7: 1080,
  8: 1260, 9: 1440, 10: 1620, 11: 1800, 12: 2100, 13: 2400,
  14: 2700, 15: 3600, 16: 4500, 17: 5400, 18: 6300, 19: 7200, 20: 9000
});

export function createInvestmentEngine(records, rowMap) {
  const rows = Object.fromEntries(Object.entries(records).map(([id, row]) => [Number(id), Object.freeze({ ...row })]));
  const levelsByInvestment = buildLevelIndex(rowMap);

  function rowForLevel(investmentId, level) {
    const rowId = levelsByInvestment.get(Number(investmentId))?.get(Number(level));
    return rowId ? rows[rowId] : undefined;
  }

  function highestCompletedRows(levels = {}) {
    const completed = new Set();
    for (const [investmentIdText, levelValue] of Object.entries(levels)) {
      const investmentId = Number(investmentIdText);
      const level = Number(levelValue) || 0;
      const map = levelsByInvestment.get(investmentId);
      if (!map) continue;
      for (const [knownLevel, rowId] of map) if (knownLevel <= level) completed.add(rowId);
    }
    return completed;
  }

  function missingDependencies(targetRowId, completedLevels = {}) {
    const target = rows[Number(targetRowId)];
    if (!target) throw new RangeError(`Unknown investment row ${targetRowId}`);
    const completed = highestCompletedRows(completedLevels);
    const missing = new Set();
    for (const rowId of target.required_ids ?? []) if (!completed.has(Number(rowId))) missing.add(Number(rowId));
    return [...missing].map(rowId => rows[rowId]).filter(Boolean);
  }

  function adjustedTime(seconds, { buffPercent = 400, helps = 0, vipLevel = 15 } = {}) {
    const buff = Number(buffPercent) || 0;
    const helpCount = Math.max(0, Number(helps) || 0);
    const vip = Math.min(20, Math.max(1, Number(vipLevel) || 1));
    return Math.max(0, Math.round(seconds / (1 + buff / 100) * (0.99 ** helpCount) - VIP_SECONDS[vip]));
  }

  function calculateTarget({ investmentId, targetLevel, completedLevels = {}, options = {} }) {
    const target = rowForLevel(investmentId, targetLevel);
    if (!target) throw new RangeError(`Unknown investment target ${investmentId}.${targetLevel}`);
    const completed = highestCompletedRows(completedLevels);
    const rowIds = new Set([target.row_id, ...(target.required_ids ?? [])].map(Number));
    const pending = [...rowIds].filter(rowId => !completed.has(rowId)).map(rowId => rows[rowId]).filter(Boolean);
    return aggregateRows(pending, options, adjustedTime);
  }

  function calculateCategory(investmentIds, completedLevels = {}, options = {}) {
    const completed = highestCompletedRows(completedLevels);
    const rowIds = new Set();
    for (const investmentId of investmentIds) {
      const map = levelsByInvestment.get(Number(investmentId));
      if (!map) continue;
      const maxLevel = Math.max(...map.keys());
      const target = rows[map.get(maxLevel)];
      rowIds.add(target.row_id);
      for (const requiredId of target.required_ids ?? []) rowIds.add(Number(requiredId));
    }
    const pending = [...rowIds].filter(rowId => !completed.has(rowId)).map(rowId => rows[rowId]).filter(Boolean);
    return aggregateRows(pending, options, adjustedTime);
  }

  return Object.freeze({ rowForLevel, highestCompletedRows, missingDependencies, adjustedTime, calculateTarget, calculateCategory });
}

function buildLevelIndex(rowMap) {
  const index = new Map();
  for (const entry of rowMap) {
    const investmentId = Number(entry[2]);
    const level = Number(entry[4]);
    const rowId = Number(entry[5]);
    if (!index.has(investmentId)) index.set(investmentId, new Map());
    index.get(investmentId).set(level, rowId);
  }
  return index;
}

function aggregateRows(rows, options, adjustTime) {
  const totals = Object.fromEntries(RESOURCE_FIELDS.map(field => [field, 0]));
  totals.investments = rows.length;
  totals.influence_increase = 0;
  totals.time = 0;
  totals.adjusted_time = 0;
  totals.gold = 0;
  totals.investment_names = [];

  for (const row of rows) {
    for (const field of RESOURCE_FIELDS) totals[field] += Number(row[field]) || 0;
    totals.influence_increase += Number(row.influence_increase) || 0;
    totals.time += Number(row.time) || 0;
    totals.adjusted_time += adjustTime(Number(row.time) || 0, options);
    totals.investment_names.push(`${row.name} ${row.level}`);
  }

  totals.gold = Math.round(((totals.adjusted_time / 86400) * 1450) / 1000) * 1000;
  return totals;
}
