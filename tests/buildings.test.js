import test from "node:test";
import assert from "node:assert/strict";
import { loadBuildingRecordsNode } from "../src/data/load-node.js";
import { createBuildingEngine } from "../src/buildings/engine.js";

const engine = createBuildingEngine(await loadBuildingRecordsNode());

test("Mansion star 10 from zero matches reference totals", () => {
  const result = engine.calculatePlan({ currentLevels: {}, targetBuildingId: 8, targetStar: 10 });
  assert.deepEqual(result.totals, { familyCurrency: 131404, familyInsignia: 901 });
});

test("Family Council star 9 respects existing levels and original game order", () => {
  const result = engine.calculatePlan({
    currentLevels: { 2: 8, 3: 8, 6: 8, 7: 7, 8: 8, 12: 8, 15: 8, 27: 8 },
    targetBuildingId: 27,
    targetStar: 9
  });
  const rows = result.requirements.map(row => [row.buildingName, row.currentStar, row.requiredStar]);
  assert.deepEqual(rows, [["Mansion", 8, 9], ["Family Council", 8, 9], ["Hospital", 7, 8]]);
  assert.deepEqual(result.totals, { familyCurrency: 7850, familyInsignia: 165 });
});
