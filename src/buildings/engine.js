import { buildingNames, buildingOrder } from "./catalog.js";

const FAMILY_CURRENCY_ID = "21013744";
const FAMILY_INSIGNIA_ID = "21013745";

export function createBuildingEngine(sourceRecords) {
  const records = cloneRecords(sourceRecords);
  const levelIndex = buildLevelIndex(records);

  function dependencyLevels(buildingId, targetStar) {
    const startId = levelIndex.get(key(buildingId, targetStar));
    if (startId === undefined) throw new RangeError(`Unknown building target: ${buildingId}.${targetStar}`);

    const requiredRows = collectDependencies(records, [startId]);
    const requiredLevels = {};

    for (const rowId of requiredRows) {
      const row = records[rowId];
      const current = requiredLevels[row.category] ?? 0;
      if (row.star_level_big > current) requiredLevels[row.category] = row.star_level_big;
    }

    return requiredLevels;
  }

  function inferCurrentLevels(inputLevels) {
    const levels = Object.fromEntries(buildingOrder.map(id => [id, Number(inputLevels[id] ?? 0)]));
    let changed = true;

    while (changed) {
      changed = false;
      for (const buildingId of buildingOrder) {
        const currentStar = levels[buildingId];
        if (currentStar <= 0) continue;
        const inferred = dependencyLevels(buildingId, currentStar);
        for (const [requiredId, requiredStar] of Object.entries(inferred)) {
          if ((levels[requiredId] ?? 0) < requiredStar) {
            levels[requiredId] = requiredStar;
            changed = true;
          }
        }
      }
    }

    return levels;
  }

  function upgradeCost(buildingId, fromStar, toStar) {
    if (fromStar >= toStar) return { familyCurrency: 0, familyInsignia: 0 };
    let rowId = levelIndex.get(key(buildingId, fromStar));
    if (rowId === undefined) throw new RangeError(`Unknown current level: ${buildingId}.${fromStar}`);

    let familyCurrency = 0;
    let familyInsignia = 0;
    rowId = records[rowId].next_id;

    while (rowId) {
      const row = records[rowId];
      if (!row) throw new Error(`Broken building row chain at ${rowId}`);
      const items = parseRequiredItems(row.require_items);
      familyCurrency += items[FAMILY_CURRENCY_ID] ?? 0;
      familyInsignia += items[FAMILY_INSIGNIA_ID] ?? 0;
      if (row.star_level_big === toStar && row.star_level_small === 0) break;
      rowId = row.next_id;
    }

    return { familyCurrency, familyInsignia };
  }

  function calculatePlan({ currentLevels = {}, targetBuildingId, targetStar }) {
    const normalized = inferCurrentLevels(currentLevels);
    const targets = dependencyLevels(Number(targetBuildingId), Number(targetStar));
    const requirements = [];
    let familyCurrency = 0;
    let familyInsignia = 0;

    for (const buildingId of buildingOrder) {
      const requiredStar = targets[buildingId];
      if (requiredStar === undefined) continue;
      const currentStar = normalized[buildingId] ?? 0;
      if (currentStar >= requiredStar) continue;
      const cost = upgradeCost(buildingId, currentStar, requiredStar);
      familyCurrency += cost.familyCurrency;
      familyInsignia += cost.familyInsignia;
      requirements.push({
        buildingId,
        buildingName: buildingNames[buildingId],
        currentStar,
        requiredStar,
        ...cost
      });
    }

    return {
      currentLevels: normalized,
      targetBuildingId: Number(targetBuildingId),
      targetStar: Number(targetStar),
      requirements,
      totals: { familyCurrency, familyInsignia }
    };
  }

  return Object.freeze({ dependencyLevels, inferCurrentLevels, upgradeCost, calculatePlan });
}

function cloneRecords(source) {
  const copy = Object.fromEntries(Object.entries(source).map(([id, row]) => [id, { ...row }]));
  for (const row of Object.values(source)) {
    if (row.star_level_big !== 0 || row.star_level_small !== 1) continue;
    const zeroId = row.id - 1;
    if (copy[zeroId]) continue;
    copy[zeroId] = {
      ...row,
      id: zeroId,
      next_id: row.id,
      prev_id: 0,
      star_level_big: 0,
      star_level_small: 0,
      require_items: "",
      require_building_stars: "0"
    };
  }
  return copy;
}

function buildLevelIndex(records) {
  const index = new Map();
  for (const [rowId, row] of Object.entries(records)) {
    if (row.star_level_small === 0) index.set(key(row.category, row.star_level_big), Number(rowId));
  }
  return index;
}

function collectDependencies(records, initialRowIds) {
  const found = new Set();
  const stack = [...initialRowIds];
  while (stack.length) {
    const rowId = Number(stack.pop());
    if (!rowId || found.has(rowId)) continue;
    const row = records[rowId];
    if (!row) throw new Error(`Missing building dependency row ${rowId}`);
    found.add(rowId);
    for (const dependencyId of splitIds(row.require_building_stars)) stack.push(dependencyId);
  }
  return found;
}

function splitIds(value) {
  if (!value) return [];
  return String(value).split("|").map(Number).filter(Boolean);
}

function parseRequiredItems(value) {
  const result = {};
  if (!value) return result;
  for (const item of String(value).split("|")) {
    const [id, amount] = item.split(":");
    if (id) result[id] = Number(amount) || 0;
  }
  return result;
}

function key(buildingId, star) {
  return `${Number(buildingId)}.${Number(star)}`;
}
