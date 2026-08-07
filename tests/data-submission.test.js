import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const investmentForm = await readFile('.github/ISSUE_TEMPLATE/investment_data_submission.yml', 'utf8');
const starUpForm = await readFile('.github/ISSUE_TEMPLATE/star_up_data_submission.yml', 'utf8');

test('investment data form captures source values needed for verification', () => {
  assert.match(investmentForm, /name: Submit Investment data/);
  assert.match(investmentForm, /Investment category/);
  assert.match(investmentForm, /Investment name/);
  assert.match(investmentForm, /Investment level/);
  assert.match(investmentForm, /Original investment time shown by the game/);
  assert.match(investmentForm, /unmodified\/base time exactly as shown in-game/);
  assert.match(investmentForm, /Do not enter your buffed or reduced investment time/);
  for (const field of ['Cash', 'Arms', 'Cargo', 'Metal', 'Diamonds', 'Oil', 'Crypto Coins', 'Family Currency', 'Family Insignia', 'Gold', 'Influence increase']) {
    assert.match(investmentForm, new RegExp(`label: ${field}`));
  }
  assert.match(investmentForm, /Prerequisites \/ dependencies/);
  assert.match(investmentForm, /Screenshots \/ evidence/);
  assert.match(investmentForm, /multiple independent submissions/);
});

test('investment time confirmation explicitly rejects personal buff time', () => {
  assert.match(investmentForm, /original\/base time shown by the game, not my personally buffed or reduced investment time/);
});

test('Star-Up data form captures costs, prerequisites, and evidence', () => {
  assert.match(starUpForm, /name: Submit Star-Up data/);
  assert.match(starUpForm, /Building name/);
  assert.match(starUpForm, /Current completed star level/);
  assert.match(starUpForm, /Target star \/ step shown/);
  assert.match(starUpForm, /Family Currency cost/);
  assert.match(starUpForm, /Family Insignia cost/);
  assert.match(starUpForm, /Required buildings \/ prerequisites/);
  assert.match(starUpForm, /Screenshots \/ evidence/);
  assert.match(starUpForm, /multiple independent submissions/);
});
