import test from "node:test";
import assert from "node:assert/strict";
import { loadInvestmentRecordsNode, loadInvestmentRowMapNode } from "../src/data/load-node.js";
import { createInvestmentEngine } from "../src/investments/engine.js";

const engine = createInvestmentEngine(await loadInvestmentRecordsNode(), await loadInvestmentRowMapNode());

test("investment lookup uses the remapped level index", () => {
  const row = engine.rowForLevel(1, 10);
  assert.equal(row.row_id, 12000110);
  assert.equal(row.name, "Logistics I");
});

test("target totals include the target and missing required rows", () => {
  const result = engine.calculateTarget({ investmentId: 2, targetLevel: 1, options: { buffPercent: 400, helps: 0, vipLevel: 15 } });
  assert.equal(result.investments, 1);
  assert.equal(result.diamonds, 397);
});
