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
  assert.match(investmentForm, /original\/base investment time shown by the game/);
  assert.match(investmentForm, /not your buffed or reduced time/);
  for (const field of ['Cash:', 'Arms:', 'Cargo:', 'Metal:', 'Diamonds:', 'Oil:', 'Crypto Coins:', 'Family Currency:', 'Family Insignia:', 'Gold:', 'Influence:']) {
    assert.match(investmentForm, new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(investmentForm, /Prerequisites \/ dependencies/);
  assert.match(investmentForm, /type: upload/);
  assert.match(investmentForm, /Screenshots \/ evidence/);
  assert.match(investmentForm, /multiple independent submissions/);
});

test('investment time confirmation explicitly rejects personal buff time', () => {
  assert.match(investmentForm, /original\/base game time, not my personally buffed or reduced time/);
});

test('Star-Up data form captures costs, prerequisites, and evidence', () => {
  assert.match(starUpForm, /name: Submit Star-Up data/);
  assert.match(starUpForm, /Building name/);
  assert.match(starUpForm, /Star-Up level \/ step/);
  assert.match(starUpForm, /Family Currency:/);
  assert.match(starUpForm, /Family Insignia:/);
  assert.match(starUpForm, /Required buildings \/ prerequisites/);
  assert.match(starUpForm, /type: upload/);
  assert.match(starUpForm, /Screenshots \/ evidence/);
  assert.match(starUpForm, /multiple independent submissions/);
});
